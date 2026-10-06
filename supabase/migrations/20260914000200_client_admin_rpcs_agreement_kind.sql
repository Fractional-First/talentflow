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
-- SHAPE: unchanged from the definition in production today (20260427010245) — all 13 columns in
-- the same name, type and order. The only difference is the `agreement_kind = 'client'` filter on
-- the lateral. This migration deliberately does NOT reference `public.agreement_side_letters`:
-- that table does not exist in production yet (verified with to_regclass), and a PL/pgSQL body
-- referencing a missing relation is not checked at CREATE time — it would apply green and then
-- raise 42P01 on every load of the admin Clients page.
--
-- ORDERING with ff-workspace#8 (talentflow#149), which replaces this same function: #149's two
-- migrations are timestamped `20260914000500` / `20260914000600`, so they sort after every file
-- in this PR, and `20260914000600` is the LAST definition to run — it carries both the five
-- side-letter columns and this same `agreement_kind = 'client'` filter. Both of its files also
-- open with a guard that raises if `agreement_acceptances.agreement_kind` is missing, so a
-- mis-ordered merge lands nothing at all and stays retryable.
--
-- Merge this PR first, let Apply Supabase Migrations go green, then #149. Nothing here depends on
-- #149, so this PR is also correct on its own if #149 never merges.
--
-- 42702: every column reference in this body is table-qualified, including the lateral's own
-- source (`aa_src`). `organization_id` and `agreement_id` are RETURNS TABLE OUT variables that
-- PL/pgSQL resolves against both the variable and the column — `20260427010245` exists solely to
-- fix that failure here, and lane D hit it again on #149. Adding output columns can newly shadow
-- a previously-safe bare identifier, and a plain-SQL rehearsal cannot catch it because
-- OUT-variable shadowing only exists inside the function, so this was verified by calling the
-- function on a real PostgreSQL instance.

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
  signed_up_at timestamptz
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
    u.created_at
  FROM all_rows cp
  LEFT JOIN public.organizations o ON o.id = cp.organization_id
  LEFT JOIN auth.users u           ON u.id = cp.user_id
  LEFT JOIN LATERAL (
    -- The client agreement only. Without this filter a user who is also a candidate
    -- contributes their candidate agreement here (ff-workspace#11). Aliased and fully
    -- qualified: `user_id`, `agreement_kind` and `accepted_at` are safe bare today, but any
    -- future RETURNS TABLE column of the same name would silently make them ambiguous (42702).
    SELECT aa_src.*
    FROM public.agreement_acceptances aa_src
    WHERE aa_src.user_id = cp.user_id
      AND aa_src.agreement_kind = 'client'
    ORDER BY aa_src.accepted_at DESC
    LIMIT 1
  ) aa ON TRUE
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
