-- Create get_anon_profile function for retrieving anonymous profiles
CREATE OR REPLACE FUNCTION public.get_anon_profile(anon_slug_param text)
RETURNS TABLE(anon_slug text, anon_profile_data jsonb, profile_version text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $$
DECLARE
  profile_record RECORD;
BEGIN
  -- First check if the profile exists and get its published status
  SELECT p.anon_slug, p.anon_profile_data, p.profile_version, p.ispublished
  INTO profile_record
  FROM public.profiles AS p
  WHERE p.anon_slug = anon_slug_param
  LIMIT 1;

  -- If profile doesn't exist, return empty result (will result in 404)
  IF NOT FOUND THEN
    RETURN;
  END IF;

  -- If profile exists but is not published, raise an exception
  IF NOT profile_record.ispublished THEN
    RAISE EXCEPTION 'Profile is not published' USING ERRCODE = '42501'; -- insufficient_privilege
  END IF;

  -- If anon_profile_data is null, return empty result
  IF profile_record.anon_profile_data IS NULL THEN
    RETURN;
  END IF;

  -- If published and has anon data, return the anonymous profile data
  RETURN QUERY SELECT 
    profile_record.anon_slug, 
    profile_record.anon_profile_data,
    profile_record.profile_version;
END;
$$;