-- RPC function for fetching profile details by slug (batch)
-- Used by fractional-command internal search to display results
-- SECURITY DEFINER allows anon key access to profiles table data

CREATE OR REPLACE FUNCTION public.get_profiles_by_slugs(p_slugs text[])
RETURNS TABLE(
  profile_slug text,
  first_name text,
  last_name text,
  email text,
  linkedinurl text,
  profile_data jsonb
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.profile_slug,
    p.first_name,
    p.last_name,
    p.email,
    p.linkedinurl,
    p.profile_data
  FROM profiles p
  WHERE p.profile_slug = ANY(p_slugs);
END;
$$;

COMMENT ON FUNCTION public.get_profiles_by_slugs IS 'Fetch profile details by slug array. Used by fractional-command internal search. Anon-safe via SECURITY DEFINER.';

GRANT EXECUTE ON FUNCTION public.get_profiles_by_slugs TO anon;
