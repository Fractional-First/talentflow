-- get_candidate_facets() is SECURITY DEFINER with no caller check, so anyone holding
-- the public anon key could call it and list every candidate's location and role.
-- Its only consumer is ff-admin, which calls it with an admin session.
-- Add the same admin check the other *_admin RPCs use, and drop anon/public execute.

CREATE OR REPLACE FUNCTION public.get_candidate_facets()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  IF (auth.jwt() -> 'app_metadata' ->> 'role') IS DISTINCT FROM 'admin' THEN
    RAISE EXCEPTION 'Unauthorized: not an admin user';
  END IF;

  RETURN json_build_object(
    'locations', (
      SELECT COALESCE(json_agg(loc ORDER BY loc), '[]'::json)
      FROM (SELECT DISTINCT profile_data->>'location' AS loc FROM profiles WHERE profile_data->>'location' IS NOT NULL AND profile_data->>'location' != '') sub
    ),
    'roles', (
      SELECT COALESCE(json_agg(r ORDER BY r), '[]'::json)
      FROM (SELECT DISTINCT profile_data->>'role' AS r FROM profiles WHERE profile_data->>'role' IS NOT NULL AND profile_data->>'role' != '') sub
    )
  );
END;
$function$;

REVOKE EXECUTE ON FUNCTION public.get_candidate_facets() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_candidate_facets() TO authenticated;
