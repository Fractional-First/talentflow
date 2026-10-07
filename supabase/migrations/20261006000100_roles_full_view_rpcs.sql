-- Admin-only RPCs for the ff-admin Roles "Full" view and Add role
-- (ff-workspace#34). Same guard, SECURITY DEFINER and grant pattern as
-- 20260918000300_roles_admin_rpcs.sql. list_roles_admin and
-- update_role_status_admin are left exactly as they are: the board keeps
-- calling them.

-- Every role with its client, linked job description, the new tracking
-- fields and the candidates introduced (oldest link first). A candidate's
-- name is the profile's own first/last name, else the sign-up metadata's
-- first/last name, else its full "name"; NULL when none is set.
CREATE OR REPLACE FUNCTION public.list_roles_full_admin()
RETURNS TABLE (
  id uuid,
  title text,
  status text,
  organization_id uuid,
  client_name text,
  job_description_id uuid,
  job_description_slug text,
  job_description_status text,
  job_description_title text,
  client_sow_url text,
  candidate_sow_url text,
  notes text,
  confirmed_candidate_id uuid,
  candidates jsonb,
  created_at timestamptz,
  updated_at timestamptz
)
LANGUAGE plpgsql SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF (auth.jwt() -> 'app_metadata' ->> 'role') IS DISTINCT FROM 'admin' THEN
    RAISE EXCEPTION 'Unauthorized: not an admin user';
  END IF;

  RETURN QUERY
  SELECT
    r.id,
    r.title,
    r.status,
    r.organization_id,
    o.metadata->>'name',
    r.job_description_id,
    jd.slug,
    jd.status,
    jd.jd_data->>'role_title',
    r.client_sow_url,
    r.candidate_sow_url,
    r.notes,
    r.confirmed_candidate_id,
    COALESCE(c.candidates, '[]'::jsonb),
    r.created_at,
    r.updated_at
  FROM public.roles r
  JOIN public.organizations o ON o.id = r.organization_id
  LEFT JOIN public.job_descriptions jd ON jd.id = r.job_description_id
  LEFT JOIN LATERAL (
    SELECT jsonb_agg(
      jsonb_build_object(
        'id', p.id,
        'name', COALESCE(
          NULLIF(TRIM(CONCAT_WS(' ', NULLIF(p.first_name, ''), NULLIF(p.last_name, ''))), ''),
          NULLIF(TRIM(CONCAT_WS(' ', NULLIF(u.raw_user_meta_data->>'first_name', ''), NULLIF(u.raw_user_meta_data->>'last_name', ''))), ''),
          NULLIF(TRIM(u.raw_user_meta_data->>'name'), '')
        ),
        'profile_type', p.profile_type
      )
      ORDER BY rc.created_at, p.id
    ) AS candidates
    FROM public.role_candidates rc
    JOIN public.profiles p ON p.id = rc.profile_id
    LEFT JOIN auth.users u ON u.id = p.id
    WHERE rc.role_id = r.id
  ) c ON true
  ORDER BY r.created_at DESC;
END;
$$;

GRANT EXECUTE ON FUNCTION public.list_roles_full_admin() TO authenticated;

-- Create or patch a role. p_role is a JSON object:
--   * no "id" (or null): insert. Requires "title" and a client — either
--     "organization_id" or "new_client_name", which creates an organization
--     holding just that name (most real clients have no organization row).
--   * "id": update ONLY the keys present, so two admins editing different
--     cells of the same role never overwrite each other. A key present with
--     null (or a blank string) clears that field.
-- Unknown keys are refused rather than silently ignored. Returns the role id.
CREATE OR REPLACE FUNCTION public.upsert_role_admin(p_role jsonb)
RETURNS uuid
LANGUAGE plpgsql SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_id uuid;
  v_title text;
  v_org_id uuid;
  v_new_client text;
  v_unknown text;
BEGIN
  IF (auth.jwt() -> 'app_metadata' ->> 'role') IS DISTINCT FROM 'admin' THEN
    RAISE EXCEPTION 'Unauthorized: not an admin user';
  END IF;

  IF p_role IS NULL OR jsonb_typeof(p_role) <> 'object' THEN
    RAISE EXCEPTION 'upsert_role_admin: p_role must be a JSON object';
  END IF;

  SELECT string_agg(k, ', ') INTO v_unknown
  FROM jsonb_object_keys(p_role) AS k
  WHERE k NOT IN (
    'id', 'title', 'organization_id', 'new_client_name', 'job_description_id',
    'status', 'client_sow_url', 'candidate_sow_url', 'notes', 'confirmed_candidate_id'
  );
  IF v_unknown IS NOT NULL THEN
    RAISE EXCEPTION 'upsert_role_admin: unknown field(s): %', v_unknown;
  END IF;

  IF p_role ? 'title' THEN
    v_title := NULLIF(TRIM(p_role->>'title'), '');
    IF v_title IS NULL THEN
      RAISE EXCEPTION 'A role needs a title';
    END IF;
  END IF;

  -- An edit that lost its id must fail, not quietly add a duplicate role.
  IF p_role ? 'id' AND NULLIF(p_role->>'id', '') IS NULL THEN
    RAISE EXCEPTION 'upsert_role_admin: id is empty; omit it to add a role';
  END IF;
  IF p_role ? 'status' AND NULLIF(p_role->>'status', '') IS NULL THEN
    RAISE EXCEPTION 'A role needs a status';
  END IF;

  v_id := (p_role->>'id')::uuid;

  IF v_id IS NULL THEN
    IF v_title IS NULL THEN
      RAISE EXCEPTION 'A role needs a title';
    END IF;

    v_org_id := NULLIF(p_role->>'organization_id', '')::uuid;
    v_new_client := NULLIF(TRIM(p_role->>'new_client_name'), '');
    IF v_org_id IS NULL AND v_new_client IS NULL THEN
      RAISE EXCEPTION 'A role needs a client';
    END IF;
    IF v_org_id IS NOT NULL AND v_new_client IS NOT NULL THEN
      RAISE EXCEPTION 'Pick an existing client or name a new one, not both';
    END IF;
    -- Nobody can have been introduced to a role that doesn't exist yet.
    IF NULLIF(p_role->>'confirmed_candidate_id', '') IS NOT NULL THEN
      RAISE EXCEPTION 'Introduce a candidate before confirming them';
    END IF;

    IF v_new_client IS NOT NULL THEN
      INSERT INTO public.organizations (metadata)
      VALUES (jsonb_build_object('name', v_new_client))
      RETURNING organizations.id INTO v_org_id;
    END IF;

    INSERT INTO public.roles (
      organization_id, title, status, job_description_id,
      client_sow_url, candidate_sow_url, notes
    )
    VALUES (
      v_org_id,
      v_title,
      COALESCE(p_role->>'status', 'searching'),
      NULLIF(p_role->>'job_description_id', '')::uuid,
      NULLIF(TRIM(p_role->>'client_sow_url'), ''),
      NULLIF(TRIM(p_role->>'candidate_sow_url'), ''),
      NULLIF(TRIM(p_role->>'notes'), '')
    )
    RETURNING roles.id INTO v_id;

    RETURN v_id;
  END IF;

  IF p_role ? 'new_client_name' THEN
    RAISE EXCEPTION 'new_client_name is only accepted when adding a role';
  END IF;
  IF p_role ? 'organization_id' AND NULLIF(p_role->>'organization_id', '') IS NULL THEN
    RAISE EXCEPTION 'A role needs a client';
  END IF;
  -- The foreign key enforces this too; this says it in words.
  IF NULLIF(p_role->>'confirmed_candidate_id', '') IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM public.role_candidates
    WHERE role_id = v_id AND profile_id = (p_role->>'confirmed_candidate_id')::uuid
  ) THEN
    RAISE EXCEPTION 'Introduce a candidate before confirming them';
  END IF;
  UPDATE public.roles r
  SET
    title = CASE WHEN p_role ? 'title' THEN v_title ELSE r.title END,
    organization_id = CASE WHEN p_role ? 'organization_id'
      THEN (p_role->>'organization_id')::uuid ELSE r.organization_id END,
    status = CASE WHEN p_role ? 'status' THEN p_role->>'status' ELSE r.status END,
    job_description_id = CASE WHEN p_role ? 'job_description_id'
      THEN NULLIF(p_role->>'job_description_id', '')::uuid ELSE r.job_description_id END,
    client_sow_url = CASE WHEN p_role ? 'client_sow_url'
      THEN NULLIF(TRIM(p_role->>'client_sow_url'), '') ELSE r.client_sow_url END,
    candidate_sow_url = CASE WHEN p_role ? 'candidate_sow_url'
      THEN NULLIF(TRIM(p_role->>'candidate_sow_url'), '') ELSE r.candidate_sow_url END,
    notes = CASE WHEN p_role ? 'notes'
      THEN NULLIF(TRIM(p_role->>'notes'), '') ELSE r.notes END,
    confirmed_candidate_id = CASE WHEN p_role ? 'confirmed_candidate_id'
      THEN NULLIF(p_role->>'confirmed_candidate_id', '')::uuid ELSE r.confirmed_candidate_id END
  WHERE r.id = v_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Role % not found', v_id;
  END IF;

  RETURN v_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.upsert_role_admin(jsonb) TO authenticated;

-- Record that a candidate (guest or authenticated) was introduced to a role.
-- Linking twice is a no-op.
CREATE OR REPLACE FUNCTION public.link_role_candidate_admin(p_role_id uuid, p_profile_id uuid)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF (auth.jwt() -> 'app_metadata' ->> 'role') IS DISTINCT FROM 'admin' THEN
    RAISE EXCEPTION 'Unauthorized: not an admin user';
  END IF;

  INSERT INTO public.role_candidates (role_id, profile_id)
  VALUES (p_role_id, p_profile_id)
  ON CONFLICT (role_id, profile_id) DO NOTHING;
END;
$$;

GRANT EXECUTE ON FUNCTION public.link_role_candidate_admin(uuid, uuid) TO authenticated;

-- Remove a candidate from a role's introduced list. The confirmed hire can't
-- be removed while confirmed; the foreign key enforces this too, this just
-- says it in words.
CREATE OR REPLACE FUNCTION public.unlink_role_candidate_admin(p_role_id uuid, p_profile_id uuid)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF (auth.jwt() -> 'app_metadata' ->> 'role') IS DISTINCT FROM 'admin' THEN
    RAISE EXCEPTION 'Unauthorized: not an admin user';
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.roles
    WHERE id = p_role_id AND confirmed_candidate_id = p_profile_id
  ) THEN
    RAISE EXCEPTION 'This candidate is the confirmed hire — clear the confirmation first';
  END IF;

  DELETE FROM public.role_candidates
  WHERE role_id = p_role_id AND profile_id = p_profile_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.unlink_role_candidate_admin(uuid, uuid) TO authenticated;

-- Candidate picker: profiles of both types matching a name, email or
-- LinkedIn URL, most recently updated first. A blank query returns the most
-- recently updated profiles.
CREATE OR REPLACE FUNCTION public.search_role_candidate_options_admin(p_query text DEFAULT NULL)
RETURNS TABLE (
  id uuid,
  name text,
  profile_type text,
  headline text
)
LANGUAGE plpgsql SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_query text := NULLIF(TRIM(p_query), '');
  -- Typed % and _ are literal characters, not wildcards.
  v_pattern text := '%' || replace(replace(replace(v_query, '\', '\\'), '%', '\%'), '_', '\_') || '%';
BEGIN
  IF (auth.jwt() -> 'app_metadata' ->> 'role') IS DISTINCT FROM 'admin' THEN
    RAISE EXCEPTION 'Unauthorized: not an admin user';
  END IF;

  RETURN QUERY
  SELECT n.id, n.name, n.profile_type::text, n.headline
  FROM (
    SELECT
      p.id,
      COALESCE(
        NULLIF(TRIM(CONCAT_WS(' ', NULLIF(p.first_name, ''), NULLIF(p.last_name, ''))), ''),
        NULLIF(TRIM(CONCAT_WS(' ', NULLIF(u.raw_user_meta_data->>'first_name', ''), NULLIF(u.raw_user_meta_data->>'last_name', ''))), ''),
        NULLIF(TRIM(u.raw_user_meta_data->>'name'), '')
      ) AS name,
      p.profile_type,
      p.profile_data->>'role' AS headline,
      p.email,
      p.linkedinurl,
      p.updated_at
    FROM public.profiles p
    LEFT JOIN auth.users u ON u.id = p.id
  ) n
  WHERE v_query IS NULL
    OR n.name ILIKE v_pattern
    OR n.email ILIKE v_pattern
    OR n.linkedinurl ILIKE v_pattern
  ORDER BY n.updated_at DESC
  LIMIT 20;
END;
$$;

GRANT EXECUTE ON FUNCTION public.search_role_candidate_options_admin(text) TO authenticated;

-- Client picker for Add role / edit. Organization names are not unique, so
-- the company URL and creation date come back to tell same-named rows apart.
CREATE OR REPLACE FUNCTION public.list_role_client_options_admin()
RETURNS TABLE (
  id uuid,
  name text,
  company_url text,
  created_at timestamptz
)
LANGUAGE plpgsql SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF (auth.jwt() -> 'app_metadata' ->> 'role') IS DISTINCT FROM 'admin' THEN
    RAISE EXCEPTION 'Unauthorized: not an admin user';
  END IF;

  RETURN QUERY
  SELECT o.id, o.metadata->>'name', o.company_url, o.created_at
  FROM public.organizations o
  ORDER BY lower(o.metadata->>'name') NULLS LAST, o.created_at DESC;
END;
$$;

GRANT EXECUTE ON FUNCTION public.list_role_client_options_admin() TO authenticated;

-- Job description picker: every JD, drafts included, newest first. The
-- free-text client_name is returned for display only — it is never used to
-- pick the role's client (names don't map safely to organizations, #26).
CREATE OR REPLACE FUNCTION public.list_role_job_description_options_admin()
RETURNS TABLE (
  id uuid,
  slug text,
  status text,
  role_title text,
  client_name text,
  created_at timestamptz
)
LANGUAGE plpgsql SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF (auth.jwt() -> 'app_metadata' ->> 'role') IS DISTINCT FROM 'admin' THEN
    RAISE EXCEPTION 'Unauthorized: not an admin user';
  END IF;

  RETURN QUERY
  SELECT jd.id, jd.slug, jd.status, jd.jd_data->>'role_title', jd.client_name, jd.created_at
  FROM public.job_descriptions jd
  ORDER BY jd.created_at DESC;
END;
$$;

GRANT EXECUTE ON FUNCTION public.list_role_job_description_options_admin() TO authenticated;
