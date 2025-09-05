-- Update the get_public_profile function to include linkedinurl field
DROP FUNCTION IF EXISTS public.get_public_profile(text);

CREATE FUNCTION public.get_public_profile(profile_slug_param text)
RETURNS TABLE(
  profile_slug text,
  profile_data jsonb,
  profile_version text,
  first_name text,
  last_name text,
  linkedinurl text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $func$
DECLARE
  profile_record RECORD;
BEGIN
  -- First check if the profile exists and get its published status
  SELECT p.profile_slug, p.profile_data, p.profile_version, p.first_name, p.last_name, p.linkedinurl, p.ispublished
  INTO profile_record
  FROM public.profiles AS p
  WHERE p.profile_slug = profile_slug_param
  LIMIT 1;

  -- If profile doesn't exist, return empty result (will result in 404)
  IF NOT FOUND THEN
    RETURN;
  END IF;

  -- If profile exists but is not published, raise an exception
  IF NOT profile_record.ispublished THEN
    RAISE EXCEPTION 'Profile is not published' USING ERRCODE = '42501'; -- insufficient_privilege
  END IF;

  -- If published, return the profile data
  RETURN QUERY SELECT 
    profile_record.profile_slug, 
    profile_record.profile_data, 
    profile_record.profile_version,
    profile_record.first_name, 
    profile_record.last_name,
    profile_record.linkedinurl;
END;
$func$;

-- Update the get_public_profile_by_id function to include linkedinurl field
DROP FUNCTION IF EXISTS public.get_public_profile_by_id(uuid);

CREATE FUNCTION public.get_public_profile_by_id(profile_id_param uuid)
RETURNS TABLE(
  profile_slug text,
  profile_data jsonb,
  profile_version text,
  first_name text,
  last_name text,
  linkedinurl text
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $func$
  SELECT p.profile_slug, p.profile_data, p.profile_version, p.first_name, p.last_name, p.linkedinurl
  FROM public.profiles AS p
  WHERE p.id = profile_id_param
  LIMIT 1;
$func$;

-- Lock down permissions properly
REVOKE ALL ON FUNCTION public.get_public_profile(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_public_profile(text) TO anon, authenticated;

REVOKE ALL ON FUNCTION public.get_public_profile_by_id(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_public_profile_by_id(uuid) TO anon, authenticated;
