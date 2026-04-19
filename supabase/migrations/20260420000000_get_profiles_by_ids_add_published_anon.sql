-- Adds `anon_slug` and `ispublished` to get_profiles_by_ids return.
-- /search-candidates needs both to construct named URLs (slug if published, preview otherwise)
-- and anonymous URLs alongside the named ones for every profile.

DROP FUNCTION IF EXISTS public.get_profiles_by_ids(uuid[]);

CREATE OR REPLACE FUNCTION public.get_profiles_by_ids(p_ids uuid[])
RETURNS TABLE(
  id uuid,
  profile_slug text,
  anon_slug text,
  ispublished boolean,
  first_name text,
  last_name text,
  email text,
  linkedinurl text,
  profile_type text,
  profile_data jsonb
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.profile_slug,
    p.anon_slug,
    p.ispublished,
    p.first_name,
    p.last_name,
    p.email,
    p.linkedinurl,
    p.profile_type::text,
    p.profile_data
  FROM profiles p
  WHERE p.id = ANY(p_ids);
END;
$function$;
