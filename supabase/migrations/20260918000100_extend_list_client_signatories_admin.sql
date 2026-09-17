-- Hard dependency on ff-workspace#11 (talentflow#152), which adds
-- `agreement_acceptances.agreement_kind`. Fail loudly at apply time rather than
-- applying green and erroring later on Reza's Clients page: PL/pgSQL bodies are
-- not relation- or column-checked at CREATE time, so without this the mistake
-- would only surface at runtime. The guard is in BOTH files of this pair so a
-- mis-ordered merge lands nothing at all, and the correct order can still be
-- applied afterwards without --include-all.
DO $guard$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'agreement_acceptances'
      AND column_name  = 'agreement_kind'
  ) THEN
    RAISE EXCEPTION
      'agreement_acceptances.agreement_kind is missing - merge talentflow#152 (ff-workspace#11) and let its migrations apply before this PR';
  END IF;
END
$guard$;

-- Extend list_client_signatories_admin to surface the agreement id and a
-- lateral-joined summary of agreement_side_letters, so ff-admin's clients
-- dashboard can flag non-standard MSAs without a per-row query.
-- Return type is changing, so the function must be dropped and recreated.
--
-- ORDERING: this file must apply AFTER talentflow#152's
-- 20260914000200_client_admin_rpcs_agreement_kind.sql, which also replaces this
-- function. #152 keeps production's 13-column shape and adds the
-- `agreement_kind = 'client'` filter; this file is the LAST definition to run, so
-- it has to carry BOTH that filter and the five side-letter columns, or whichever
-- of the two it omits is silently undone.
--
-- This pair has now been re-timestamped TWICE, and the second move is the
-- instructive one:
--
--   20260826140000/140100  original, written before #152 existed
--   20260914000500/000600  moved to sort after #152's ...000000-000400
--   20260918000000/000100  moved again, after the apply job refused them
--
-- What happened: #149 was merged AFTER talentflow#155, whose
-- 20260916000000_record_agreement_acceptance_kind.sql had already applied. The
-- Supabase CLI refuses ANY pending migration older than the last one on remote
-- ("Found local migration files to be inserted before the last migration on
-- remote database") — not merely an out-of-order redefinition of the same
-- object. Both files were rejected together, nothing landed, and #149 sat
-- merged in git but absent from the database until this PR.
--
-- The lesson for whoever reads this next: a migration's timestamp is not a
-- property of the branch it was written on. It is a claim about where the file
-- will sit in the applied sequence — and that sequence is fixed by MERGE ORDER,
-- which is not knowable while the PR is open. Check it against the live
-- `supabase_migrations.schema_migrations` tail immediately before merging,
-- rather than when the file is written.

DROP FUNCTION IF EXISTS public.list_client_signatories_admin();

CREATE FUNCTION public.list_client_signatories_admin()
RETURNS TABLE (
  organization_id uuid,
  company_name text,
  company_url text,
  company_logo text,
  signatory_user_id uuid,
  signatory_name text,
  signatory_email text,
  status text,
  signed_at timestamptz,
  agreement_version text,
  contracting_type text,
  entity_name text,
  signed_up_at timestamptz,
  agreement_id uuid,
  side_letter_count int,
  latest_side_letter_title text,
  latest_side_letter_url text,
  latest_side_letter_created_at timestamptz
)
LANGUAGE plpgsql SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF (auth.jwt() -> 'app_metadata' ->> 'role') IS DISTINCT FROM 'admin' THEN
    RAISE EXCEPTION 'Unauthorized: not an admin user';
  END IF;

  RETURN QUERY
  WITH primary_user_per_org AS (
    SELECT DISTINCT ON (cp.organization_id) cp.*
    FROM public.client_profiles cp
    WHERE cp.organization_id IS NOT NULL
    ORDER BY cp.organization_id, cp.created_at DESC
  ),
  orphan_users AS (
    -- Explicit alias avoids ambiguity with the RETURNS TABLE output variable `organization_id`
    SELECT cp_o.* FROM public.client_profiles cp_o WHERE cp_o.organization_id IS NULL
  ),
  all_rows AS (
    SELECT * FROM primary_user_per_org
    UNION ALL
    SELECT * FROM orphan_users
  )
  SELECT
    o.id,
    o.metadata->>'name',
    o.company_url,
    o.metadata->>'logo',
    cp.user_id,
    COALESCE(aa.full_legal_name, cp.user_name),
    u.email::text,
    CASE
      WHEN aa.id IS NULL AND cp.organization_id IS NULL THEN 'signed_up'
      WHEN aa.id IS NULL AND cp.is_onboarded = false    THEN 'onboarding'
      WHEN aa.id IS NULL                                THEN 'onboarded_unsigned'
      ELSE 'signed'
    END,
    aa.accepted_at,
    aa.agreement_version,
    aa.contracting_type,
    aa.entity_name,
    u.created_at,
    aa.id,
    COALESCE(sl.side_letter_count, 0),
    sl.latest_title,
    sl.latest_url,
    sl.latest_created_at
  FROM all_rows cp
  LEFT JOIN public.organizations o ON o.id = cp.organization_id
  LEFT JOIN auth.users u           ON u.id = cp.user_id
  LEFT JOIN LATERAL (
    -- The client agreement only. Without this filter a user who is also a
    -- candidate contributes their candidate agreement here (ff-workspace#11).
    -- Kept byte-identical to the lateral in 20260914000200 so the two are
    -- trivially comparable. `agreement_kind` is not a RETURNS TABLE output
    -- variable of this function, so the bare reference cannot raise 42702.
    SELECT *
    FROM public.agreement_acceptances
    WHERE user_id = cp.user_id
      AND agreement_kind = 'client'
    ORDER BY accepted_at DESC
    LIMIT 1
  ) aa ON TRUE
  LEFT JOIN LATERAL (
    -- Explicit alias avoids ambiguity with the RETURNS TABLE output variable `agreement_id`:
    -- an unqualified reference matching both a PL/pgSQL output variable and a column raises
    -- 42702 at runtime. Same class of error fixed for `organization_id` in 20260427010245.
    SELECT
      count(*)::int AS side_letter_count,
      (array_agg(sl_src.title ORDER BY sl_src.created_at DESC))[1] AS latest_title,
      (array_agg(sl_src.url ORDER BY sl_src.created_at DESC))[1] AS latest_url,
      max(sl_src.created_at) AS latest_created_at
    FROM public.agreement_side_letters sl_src
    WHERE sl_src.agreement_id = aa.id
  ) sl ON aa.id IS NOT NULL
  ORDER BY u.created_at DESC;
END;
$$;

GRANT EXECUTE ON FUNCTION public.list_client_signatories_admin() TO authenticated;
