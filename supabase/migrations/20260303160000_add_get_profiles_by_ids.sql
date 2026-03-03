-- Add get_profiles_by_ids RPC for UUID-based profile lookups
-- Mirrors get_profiles_by_slugs but uses profile UUIDs instead of slugs.
-- Needed because guest profiles have no profile_slug, so slug-based lookup
-- misses ~197 guest profiles (36% of the database).

CREATE OR REPLACE FUNCTION public.get_profiles_by_ids(p_ids uuid[])
RETURNS TABLE(
  id uuid,
  profile_slug text,
  first_name text,
  last_name text,
  email text,
  linkedinurl text,
  profile_type text,
  profile_data jsonb
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.profile_slug,
    p.first_name,
    p.last_name,
    p.email,
    p.linkedinurl,
    p.profile_type::text,
    p.profile_data
  FROM profiles p
  WHERE p.id = ANY(p_ids);
END;
$$;
