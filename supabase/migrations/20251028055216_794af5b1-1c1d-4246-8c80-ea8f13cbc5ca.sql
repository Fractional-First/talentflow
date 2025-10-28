
-- Update get_anon_profile to ignore published status
CREATE OR REPLACE FUNCTION public.get_anon_profile(anon_slug_param text)
 RETURNS TABLE(anon_slug text, anon_profile_data jsonb, profile_version text)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
DECLARE
  profile_record RECORD;
BEGIN
  -- Get the profile data by anon_slug
  SELECT p.anon_slug, p.anon_profile_data, p.profile_version
  INTO profile_record
  FROM public.profiles AS p
  WHERE p.anon_slug = anon_slug_param
  LIMIT 1;

  -- If profile doesn't exist, return empty result (will result in 404)
  IF NOT FOUND THEN
    RETURN;
  END IF;

  -- If anon_profile_data is null, return empty result
  IF profile_record.anon_profile_data IS NULL THEN
    RETURN;
  END IF;

  -- Return the anonymous profile data
  RETURN QUERY SELECT 
    profile_record.anon_slug, 
    profile_record.anon_profile_data,
    profile_record.profile_version;
END;
$function$
