-- Fix get_anon_profile to run with SECURITY DEFINER so the anon key can read
-- profile_data.profilePicture (Supabase Storage URL for authenticated users).
--
-- Background: migration 20260529000000 accidentally omitted SECURITY DEFINER,
-- reverting to the default SECURITY INVOKER. RLS prevents the anon role from
-- reading profile_data, so authenticated users' photos were never merged into
-- the returned anon_profile_data, causing the /api/avatar/[slug] route to
-- return 404 for all authenticated profiles.
--
-- The ispublished = true guard is belt-and-suspenders: only published profiles
-- are ever returned regardless of RLS bypass.
CREATE OR REPLACE FUNCTION get_anon_profile(anon_slug_param TEXT)
RETURNS TABLE(anon_slug TEXT, anon_profile_data JSONB, profile_version TEXT, profile_type TEXT)
LANGUAGE plpgsql SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $$
DECLARE
  profile_record RECORD;
  photo_url TEXT;
  merged_data JSONB;
BEGIN
  SELECT p.anon_slug, p.anon_profile_data, p.profile_version, p.profile_type::text, p.profile_data
  INTO profile_record
  FROM public.profiles AS p
  WHERE p.anon_slug = anon_slug_param
    AND p.ispublished = true
  LIMIT 1;

  IF NOT FOUND THEN RETURN; END IF;
  IF profile_record.anon_profile_data IS NULL THEN RETURN; END IF;

  -- Prefer authenticated user's Supabase Storage URL; fall back to whatever
  -- is already in anon_profile_data (LinkedIn CDN for guest profiles).
  photo_url := COALESCE(
    NULLIF(profile_record.profile_data->>'profilePicture', ''),
    profile_record.anon_profile_data->>'profilePicture'
  );

  merged_data := CASE
    WHEN photo_url IS NOT NULL
    THEN profile_record.anon_profile_data || jsonb_build_object('profilePicture', photo_url)
    ELSE profile_record.anon_profile_data
  END;

  RETURN QUERY SELECT
    profile_record.anon_slug,
    merged_data,
    profile_record.profile_version,
    profile_record.profile_type;
END;
$$;
