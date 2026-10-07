-- Extend list_client_signatories_admin with mobile fields so ff-admin's clients
-- dashboard table can show a Mobile column + WhatsApp link, matching the
-- mobile fields added to search_candidates_admin in
-- 20260923000000_search_candidates_admin_mobile_fields.sql.
--
-- Built directly on 20260918000100's query — same `aa` lateral (SELECT *, so
-- mobile_country_code/mobile_number are already in scope; this only adds them
-- to the RETURNS TABLE and outer SELECT), same agreement_kind = 'client'
-- filter, same side-letter columns. This must stay the LAST definition of this
-- function to apply — see 20260918000100's ordering note before touching this
-- function again.
-- Return type is changing, so the function must be dropped and recreated.

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
  latest_side_letter_created_at timestamptz,
  mobile_country_code text,
  mobile_number text,
  profile_mobile_number text
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
    sl.latest_created_at,
    aa.mobile_country_code,
    aa.mobile_number,
    cp.mobile_number
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
