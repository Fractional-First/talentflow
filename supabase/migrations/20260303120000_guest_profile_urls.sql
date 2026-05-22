-- Migration: guest_profile_urls
-- Purpose: Add profile_type to get_anon_profile() return value and update
--          create_guest_profile() to return /guest-profile/ URLs instead of /profile/
-- Context: Operators need to distinguish guest profiles (never signed up) from
--          authenticated profiles in the URL. PDPA compliance + outreach differences.
-- create_guest_profile is CREATE OR REPLACE (return type unchanged).
-- get_anon_profile changes its return type (adds profile_type column),
-- so we must DROP and re-CREATE it.

-- 1. Drop existing get_anon_profile (return type is changing)
DROP FUNCTION IF EXISTS "public"."get_anon_profile"("text");

-- 2. Re-create get_anon_profile with profile_type in return columns
CREATE FUNCTION "public"."get_anon_profile"("anon_slug_param" "text")
RETURNS TABLE("anon_slug" "text", "anon_profile_data" "jsonb", "profile_version" "text", "profile_type" "text")
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public', 'pg_temp'
    AS $$
DECLARE
  profile_record RECORD;
BEGIN
  -- Get the profile data by anon_slug
  SELECT p.anon_slug, p.anon_profile_data, p.profile_version, p.profile_type::text
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

  -- Return the anonymous profile data (now includes profile_type)
  RETURN QUERY SELECT
    profile_record.anon_slug,
    profile_record.anon_profile_data,
    profile_record.profile_version,
    profile_record.profile_type;
END;
$$;

-- 3. Update create_guest_profile to return /guest-profile/ URLs
CREATE OR REPLACE FUNCTION "public"."create_guest_profile"("p_profile_data" "jsonb", "p_anon_profile_data" "jsonb", "p_linkedin_url" "text" DEFAULT NULL::"text") RETURNS "json"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
  v_profile_id UUID;
  v_name TEXT;
  v_first_name TEXT;
  v_last_name TEXT;
  v_name_parts TEXT[];
  v_anon_slug TEXT;
  v_existing_id UUID;
BEGIN
  -- Extract name from profile data
  v_name := COALESCE(p_profile_data->>'name', 'Unknown');

  -- Parse name into first/last
  v_name_parts := string_to_array(v_name, ' ');
  v_first_name := v_name_parts[1];
  v_last_name := CASE
    WHEN array_length(v_name_parts, 1) > 1
    THEN array_to_string(v_name_parts[2:], ' ')
    ELSE NULL
  END;

  -- Check for duplicate by LinkedIn URL
  IF p_linkedin_url IS NOT NULL AND p_linkedin_url != '' THEN
    SELECT id INTO v_existing_id
    FROM profiles
    WHERE linkedinurl = p_linkedin_url;

    IF v_existing_id IS NOT NULL THEN
      -- Return existing profile info
      SELECT anon_slug INTO v_anon_slug FROM profiles WHERE id = v_existing_id;

      RETURN json_build_object(
        'success', true,
        'profile_id', v_existing_id,
        'anon_slug', v_anon_slug,
        'profile_url', 'https://candidates.fractionalfirst.com/guest-profile/' || COALESCE(v_anon_slug, ''),
        'action', 'existing',
        'message', 'Profile already exists for this LinkedIn URL'
      );
    END IF;
  END IF;

  -- Generate UUID
  v_profile_id := gen_random_uuid();

  -- Insert the profile
  INSERT INTO profiles (
    id,
    profile_type,
    profile_slug,
    email,
    first_name,
    last_name,
    profile_data,
    anon_profile_data,
    linkedinurl,
    onboarding_status,
    profile_version,
    ispublished,
    created_at,
    updated_at
  ) VALUES (
    v_profile_id,
    'guest',
    NULL,  -- Guest profiles don't have profile_slug
    NULL,  -- Guest profiles don't have email
    v_first_name,
    v_last_name,
    p_profile_data,
    p_anon_profile_data,
    p_linkedin_url,
    'PROFILE_GENERATED',
    COALESCE(p_profile_data->>'profile_version', '0.3'),
    false,  -- Don't auto-publish
    NOW(),
    NOW()
  )
  RETURNING anon_slug INTO v_anon_slug;

  RETURN json_build_object(
    'success', true,
    'profile_id', v_profile_id,
    'anon_slug', v_anon_slug,
    'profile_url', 'https://candidates.fractionalfirst.com/guest-profile/' || COALESCE(v_anon_slug, ''),
    'first_name', v_first_name,
    'last_name', v_last_name,
    'action', 'created'
  );

EXCEPTION WHEN unique_violation THEN
  RETURN json_build_object(
    'success', false,
    'error', 'duplicate',
    'message', 'A profile with this slug already exists. Try again.'
  );
WHEN OTHERS THEN
  RETURN json_build_object(
    'success', false,
    'error', SQLERRM,
    'message', 'Failed to create guest profile'
  );
END;
$$;
