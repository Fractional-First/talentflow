-- ff-workspace#11 — the admin Clients surfaces read the CLIENT agreement, not "the latest one".
--
-- `list_client_signatories_admin` (Clients table) and `get_client_admin` (client drawer) both
-- pulled the user's most recent acceptance of any kind. For a person who is both a candidate and
-- a client that is whichever they signed last, and the candidate agreement is signed as an
-- individual — which is why the "Contracting" column read "Individual" for an account that
-- signed the client MSA as an entity. `signatory_name` (COALESCE(aa.full_legal_name, …)),
-- `agreement_version` and `entity_name` inherited the same defect.
--
-- Measured on production: of 20 client profiles, 10 are unaffected (their latest acceptance
-- already is the client MSA), 8 have signed nothing at all, and 2 currently display a TALENT
-- agreement's "Individual" contracting type. Those 2 have not signed a client MSA, so after this
-- change they read as `onboarded_unsigned` with empty contracting/entity — the truthful state,
-- not "Entity".
--
-- WHY #8'S MIGRATIONS SHIP IN THIS SAME PR
-- `20260826140000` / `20260826140100` above (ff-workspace#8, side letters — Daniel's commit and
-- lane D's 42702 fix, carried here byte-identical) replace this same function, and SQL has no way
-- to patch a function body: whichever definition sorts last wins outright. Split across two PRs,
-- one merge order strands #8's migration before the remote tail — `migrate.yml` runs
-- `supabase db push --linked` with no `--include-all`, so the apply run goes red and lands
-- nothing — and the other silently deletes the side-letter columns, leaving ff-admin's Agreement
-- Variations column reading "None" forever with nothing in any log to explain it.
--
-- Shipping them as one ordered set removes the choice. All three orders are then safe:
--   * this PR alone        — 20260826140000 creates the table, then everything applies in
--                            filename order in a single run;
--   * #149 merged first    — those exact two files are already recorded as applied, so the Apply
--                            action skips them and only the 20260914* files run;
--   * this PR merged first — #149 becomes a no-op, for the same reason.
-- Nothing needs re-timestamping and nobody has to remember a merge-order instruction.
--
-- SHAPE: the 18 columns from `20260826140100`, unchanged in name, type and order. The only
-- differences are the `agreement_kind = 'client'` filter on the `aa` lateral and the extra
-- aliasing below.
--
-- 42702: `agreement_id`, `organization_id`, `contracting_type`, `entity_name`,
-- `agreement_version`, `status`, `company_url` and the rest of the RETURNS TABLE list are OUT
-- variables, and PL/pgSQL resolves a bare column reference against both those and the table.
-- `20260427010245` exists solely to fix that failure for `organization_id`, and lane D hit it
-- again for `agreement_id`. Adding output columns can newly shadow a previously-safe bare
-- identifier, so every column reference in this body is table-qualified, including both laterals'
-- own sources (`aa_src`, `sl_src`). A plain-SQL rehearsal cannot catch this class of bug —
-- OUT-variable shadowing only exists inside the function — so this was verified by calling the
-- function on a real PostgreSQL instance, not by running the query shape.

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
    -- Load-bearing, not redundant: the side-letter lateral is joined ON aa.id IS NOT NULL, so it
    -- NULL-extends for a client with no signed agreement — 8 of 20 production rows — and the
    -- admin column would render blank instead of 0 without this.
    COALESCE(sl.side_letter_count, 0),
    sl.latest_title,
    sl.latest_url,
    sl.latest_created_at
  FROM all_rows cp
  LEFT JOIN public.organizations o ON o.id = cp.organization_id
  LEFT JOIN auth.users u           ON u.id = cp.user_id
  LEFT JOIN LATERAL (
    -- The client agreement only. Without this filter a user who is also a candidate contributes
    -- their candidate agreement here (ff-workspace#11). Aliased and fully qualified: `user_id`
    -- and `accepted_at` are safe bare today, but any future RETURNS TABLE column of the same
    -- name would silently make them ambiguous (42702).
    SELECT aa_src.*
    FROM public.agreement_acceptances aa_src
    WHERE aa_src.user_id = cp.user_id
      AND aa_src.agreement_kind = 'client'
    ORDER BY aa_src.accepted_at DESC
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

-- The client drawer shows the same agreement, and had the same defect. Shape unchanged; the
-- `agreement` object now also carries `agreement_kind`, which is additive for its consumer
-- (ff-admin components/client-drawer.tsx). `SET search_path` is kept from the production
-- definition — CREATE OR REPLACE replaces the whole attribute set, and dropping it would make a
-- SECURITY DEFINER function search-path-mutable.
CREATE OR REPLACE FUNCTION public.get_client_admin(p_user_id uuid)
RETURNS json
LANGUAGE plpgsql SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  result json;
BEGIN
  IF (auth.jwt() -> 'app_metadata' ->> 'role') IS DISTINCT FROM 'admin' THEN
    RAISE EXCEPTION 'Unauthorized: not an admin user';
  END IF;

  SELECT json_build_object(
    'client_profile', (
      SELECT json_build_object(
        'id', cp.id,
        'user_id', cp.user_id,
        'organization_id', cp.organization_id,
        'user_name', cp.user_name,
        'first_name', cp.first_name,
        'last_name', cp.last_name,
        'user_designation', cp.user_designation,
        'company_email', cp.company_email,
        'mobile_number', cp.mobile_number,
        'user_location', cp.user_location,
        'social_links', cp.social_links,
        'is_onboarded', cp.is_onboarded,
        'created_at', cp.created_at,
        'updated_at', cp.updated_at,
        'auth_email', u.email,
        'auth_created_at', u.created_at,
        'auth_last_sign_in_at', u.last_sign_in_at
      )
      FROM public.client_profiles cp
      LEFT JOIN auth.users u ON u.id = cp.user_id
      WHERE cp.user_id = p_user_id
    ),
    'organization', (
      SELECT json_build_object(
        'id', o.id,
        'company_url', o.company_url,
        'metadata', o.metadata,
        'created_at', o.created_at,
        'updated_at', o.updated_at
      )
      FROM public.organizations o
      JOIN public.client_profiles cp ON cp.organization_id = o.id
      WHERE cp.user_id = p_user_id
    ),
    'agreement', (
      SELECT row_to_json(aa)
      FROM public.agreement_acceptances aa
      WHERE aa.user_id = p_user_id
        AND aa.agreement_kind = 'client'
      ORDER BY aa.accepted_at DESC
      LIMIT 1
    )
  ) INTO result;

  RETURN result;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_client_admin(uuid) TO authenticated;
