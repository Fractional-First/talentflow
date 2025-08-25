
-- Create a SECURE function to fetch a public profile by UUID, mirroring the slug-based function
CREATE OR REPLACE FUNCTION public.get_public_profile_by_id(profile_id_param uuid)
RETURNS TABLE(
  profile_slug text,
  profile_data jsonb,
  first_name text,
  last_name text
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $func$
  SELECT p.profile_slug, p.profile_data, p.first_name, p.last_name
  FROM public.profiles AS p
  WHERE p.id = profile_id_param
  LIMIT 1;
$func$;

-- Lock down permissions properly
REVOKE ALL ON FUNCTION public.get_public_profile_by_id(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_public_profile_by_id(uuid) TO anon, authenticated;
