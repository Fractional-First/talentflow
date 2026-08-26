-- Admin-only RPCs for the ff-admin Roles directory: list all roles with
-- their client name, and update a role's status.

CREATE OR REPLACE FUNCTION public.list_roles_admin()
RETURNS TABLE (
  id uuid,
  title text,
  status text,
  organization_id uuid,
  client_name text,
  job_description_id uuid,
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
    r.created_at,
    r.updated_at
  FROM public.roles r
  JOIN public.organizations o ON o.id = r.organization_id
  ORDER BY r.created_at DESC;
END;
$$;

GRANT EXECUTE ON FUNCTION public.list_roles_admin() TO authenticated;

CREATE OR REPLACE FUNCTION public.update_role_status_admin(p_role_id uuid, p_status text)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF (auth.jwt() -> 'app_metadata' ->> 'role') IS DISTINCT FROM 'admin' THEN
    RAISE EXCEPTION 'Unauthorized: not an admin user';
  END IF;

  UPDATE public.roles
  SET status = p_status
  WHERE id = p_role_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.update_role_status_admin(uuid, text) TO authenticated;
