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
      ORDER BY aa.accepted_at DESC
      LIMIT 1
    )
  ) INTO result;

  RETURN result;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_client_admin(uuid) TO authenticated;
