-- Clean up the failed view approach
DROP VIEW IF EXISTS public.public_profiles;

-- Ensure we have a unique index on profile_slug for fast lookup
CREATE UNIQUE INDEX IF NOT EXISTS profiles_profile_slug_unique ON public.profiles (profile_slug);

-- Remove the dangerous public policy from profiles table
DROP POLICY IF EXISTS "Allow public read access to profiles" ON public.profiles;

-- Create a secure SECURITY DEFINER function that exposes only safe columns
CREATE OR REPLACE FUNCTION public.get_public_profile(profile_slug_param text)
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
  WHERE p.profile_slug = profile_slug_param
  LIMIT 1;
$func$;

-- Lock down permissions properly
REVOKE ALL ON FUNCTION public.get_public_profile(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_public_profile(text) TO anon, authenticated;