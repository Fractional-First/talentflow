-- Fix get_profiles_by_ids: cast profile_type enum to text
-- The original migration declared profile_type as text in the return table
-- but the column is a custom enum type, causing "Returned type profile_type
-- does not match expected type text in column 7" error.

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
