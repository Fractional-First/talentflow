

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "vector" WITH SCHEMA "public";

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE SCHEMA IF NOT EXISTS "public";


ALTER SCHEMA "public" OWNER TO "pg_database_owner";


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE TYPE "public"."document_type" AS ENUM (
    'resume',
    'linkedin',
    'other'
);


ALTER TYPE "public"."document_type" OWNER TO "postgres";


CREATE TYPE "public"."onboarding_status" AS ENUM (
    'SIGNED_UP',
    'EMAIL_CONFIRMED',
    'PROFILE_GENERATED',
    'PROFILE_CONFIRMED',
    'PREFERENCES_SET',
    'SET_PASSWORD'
);


ALTER TYPE "public"."onboarding_status" OWNER TO "postgres";


CREATE TYPE "public"."profile_type" AS ENUM (
    'authenticated',
    'guest'
);


ALTER TYPE "public"."profile_type" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."auto_generate_profile_slug"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
  generated_slug text;
BEGIN
  -- Only generate for authenticated profiles with no slug
  IF NEW.profile_slug IS NULL AND NEW.profile_type = 'authenticated' THEN
    generated_slug := public.generate_unique_profile_slug(
      NEW.id,
      NEW.first_name,
      NEW.last_name
    );
    NEW.profile_slug := generated_slug;
  END IF;

  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."auto_generate_profile_slug"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."check_linkedin_cache"("p_urls" "text"[]) RETURNS TABLE("linkedin_url" "text", "full_name" "text", "first_name" "text", "last_name" "text", "headline" "text", "summary" "text", "current_company" "text", "follower_count" integer, "location_text" "text", "city" "text", "state" "text", "country" "text", "country_code" "text", "experience" "jsonb", "education" "jsonb", "skills" "jsonb", "raw_data" "jsonb")
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
  RETURN QUERY
  SELECT 
    lp.linkedin_url,
    lp.full_name,
    lp.first_name,
    lp.last_name,
    lp.headline,
    lp.summary,
    lp.current_company,
    lp.follower_count,
    lp.location_text,
    lp.city,
    lp.state,
    lp.country,
    lp.country_code,
    lp.experience,
    lp.education,
    lp.skills,
    lp.raw_data
  FROM linkedin_profiles lp
  WHERE lp.linkedin_url = ANY(p_urls);
END;
$$;


ALTER FUNCTION "public"."check_linkedin_cache"("p_urls" "text"[]) OWNER TO "postgres";


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
        'profile_url', 'https://candidates.fractionalfirst.com/profile/' || COALESCE(v_anon_slug, ''),
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
    'profile_url', 'https://candidates.fractionalfirst.com/profile/' || COALESCE(v_anon_slug, ''),
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


ALTER FUNCTION "public"."create_guest_profile"("p_profile_data" "jsonb", "p_anon_profile_data" "jsonb", "p_linkedin_url" "text") OWNER TO "postgres";


COMMENT ON FUNCTION "public"."create_guest_profile"("p_profile_data" "jsonb", "p_anon_profile_data" "jsonb", "p_linkedin_url" "text") IS 'Creates a guest profile in the profiles table. Returns JSON with profile_id, anon_slug, and profile_url. Checks for duplicates by LinkedIn URL. Safe to call with anon key - no service role needed.';



CREATE OR REPLACE FUNCTION "public"."create_job_description"("p_jd_data" "jsonb", "p_status" "text" DEFAULT 'draft'::"text", "p_client_name" "text" DEFAULT NULL::"text", "p_google_doc_url" "text" DEFAULT NULL::"text") RETURNS "json"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
  v_slug TEXT;
  v_id UUID;
  v_role_title TEXT;
  v_location TEXT;
BEGIN
  v_role_title := p_jd_data->>'role_title';
  v_location := p_jd_data->>'location';
  v_slug := generate_unique_jd_slug(v_role_title, v_location);

  INSERT INTO public.job_descriptions (slug, jd_data, status, client_name, google_doc_url)
  VALUES (v_slug, p_jd_data, p_status, p_client_name, p_google_doc_url)
  RETURNING id INTO v_id;

  RETURN json_build_object(
    'success', true,
    'id', v_id,
    'slug', v_slug,
    'url', 'https://roles.fractionalfirst.com/' || v_slug
  );

EXCEPTION WHEN OTHERS THEN
  RETURN json_build_object(
    'success', false,
    'error', SQLERRM
  );
END;
$$;


ALTER FUNCTION "public"."create_job_description"("p_jd_data" "jsonb", "p_status" "text", "p_client_name" "text", "p_google_doc_url" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."generate_unique_anon_slug"("p_user_id" "uuid", "p_anon_data" "jsonb") RETURNS "text"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
DECLARE
  base_slug text;
  final_slug text;
  counter integer := 1;
  slug_exists boolean;
BEGIN
  -- Extract the anon-profile-slug from the JSON data
  base_slug := p_anon_data ->> 'anon-profile-slug';
  
  -- If no slug in the data, return NULL
  IF base_slug IS NULL OR base_slug = '' THEN
    RETURN NULL;
  END IF;

  -- Clean up slug (lowercase, sanitize)
  base_slug := lower(
    regexp_replace(
      regexp_replace(
        trim(base_slug),
        '[^a-zA-Z0-9\-]', '', 'g'
      ),
      '\-+', '-', 'g'
    )
  );
  
  -- Clean up slug (remove leading/trailing hyphens)
  base_slug := trim(base_slug, '-');
  
  -- Ensure minimum length
  IF length(base_slug) < 3 THEN
    base_slug := 'anon-' || substring(p_user_id::text from 1 for 8);
  END IF;

  -- Check uniqueness and increment if needed
  final_slug := base_slug;
  
  LOOP
    SELECT EXISTS(
      SELECT 1 FROM public.profiles 
      WHERE anon_slug = final_slug AND id != p_user_id
    ) INTO slug_exists;
    
    IF NOT slug_exists THEN
      EXIT;
    END IF;
    
    counter := counter + 1;
    final_slug := base_slug || '-' || counter::text;
  END LOOP;

  RETURN final_slug;
END;
$$;


ALTER FUNCTION "public"."generate_unique_anon_slug"("p_user_id" "uuid", "p_anon_data" "jsonb") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."generate_unique_jd_slug"("p_role_title" "text", "p_location" "text") RETURNS "text"
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public'
    AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 1;
BEGIN
  base_slug := lower(trim(COALESCE(p_role_title, '') || ' ' || COALESCE(p_location, '')));
  base_slug := regexp_replace(base_slug, '[^a-z0-9\s-]', '', 'g');
  base_slug := regexp_replace(base_slug, '\s+', '-', 'g');
  base_slug := regexp_replace(base_slug, '-+', '-', 'g');
  base_slug := trim(BOTH '-' FROM base_slug);

  IF length(base_slug) < 3 THEN
    base_slug := 'jd-' || left(gen_random_uuid()::text, 8);
  END IF;

  final_slug := base_slug;
  WHILE EXISTS (SELECT 1 FROM public.job_descriptions WHERE slug = final_slug) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;

  RETURN final_slug;
END;
$$;


ALTER FUNCTION "public"."generate_unique_jd_slug"("p_role_title" "text", "p_location" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."generate_unique_profile_slug"("p_user_id" "uuid", "p_first_name" "text", "p_last_name" "text") RETURNS "text"
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public'
    AS $$
DECLARE
  base_slug text;
  final_slug text;
  counter integer := 1;
  slug_exists boolean;
BEGIN
  IF p_first_name IS NOT NULL AND p_last_name IS NOT NULL THEN
    base_slug := lower(
      regexp_replace(
        regexp_replace(
          trim(p_first_name) || '-' || trim(p_last_name),
          '[^a-zA-Z0-9\-]', '', 'g'
        ),
        '\-+', '-', 'g'
      )
    );
  ELSIF p_first_name IS NOT NULL THEN
    base_slug := lower(
      regexp_replace(
        regexp_replace(
          trim(p_first_name),
          '[^a-zA-Z0-9\-]', '', 'g'
        ),
        '\-+', '-', 'g'
      )
    );
  ELSE
    base_slug := 'user-' || substring(p_user_id::text from 1 for 8);
  END IF;

  base_slug := trim(base_slug, '-');

  IF length(base_slug) < 3 THEN
    base_slug := 'user-' || substring(p_user_id::text from 1 for 8);
  END IF;

  final_slug := base_slug;

  LOOP
    -- Only check authenticated profiles for uniqueness
    SELECT EXISTS(
      SELECT 1 FROM public.profiles
      WHERE profile_slug = final_slug
        AND id != p_user_id
        AND profile_type = 'authenticated'
    ) INTO slug_exists;

    IF NOT slug_exists THEN
      EXIT;
    END IF;

    counter := counter + 1;
    final_slug := base_slug || '-' || counter::text;
  END LOOP;

  RETURN final_slug;
END;
$$;


ALTER FUNCTION "public"."generate_unique_profile_slug"("p_user_id" "uuid", "p_first_name" "text", "p_last_name" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_anon_profile"("anon_slug_param" "text") RETURNS TABLE("anon_slug" "text", "anon_profile_data" "jsonb", "profile_version" "text")
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public', 'pg_temp'
    AS $$
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
$$;


ALTER FUNCTION "public"."get_anon_profile"("anon_slug_param" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_candidate_admin"("candidate_id" "uuid") RETURNS "json"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  result json;
BEGIN
  -- Verify caller is admin
  IF (auth.jwt() -> 'app_metadata' ->> 'role') IS DISTINCT FROM 'admin' THEN
    RAISE EXCEPTION 'Unauthorized: not an admin user';
  END IF;

  SELECT json_build_object(
    'profile', row_to_json(p),
    'fractional_preferences', (SELECT row_to_json(fp) FROM fractional_preferences fp WHERE fp.user_id = p.id),
    'full_time_preferences', (SELECT row_to_json(ftp) FROM full_time_preferences ftp WHERE ftp.user_id = p.id),
    'work_preferences', (SELECT row_to_json(wp) FROM work_preferences wp WHERE wp.user_id = p.id),
    'agreements', (SELECT COALESCE(json_agg(row_to_json(aa)), '[]'::json) FROM agreement_acceptances aa WHERE aa.profile_id = p.id),
    'work_eligibility', (SELECT COALESCE(json_agg(row_to_json(we)), '[]'::json) FROM user_work_eligibility we WHERE we.user_id = p.id),
    'location', (SELECT row_to_json(l) FROM locations l JOIN work_preferences wp ON wp.current_location_id = l.id WHERE wp.user_id = p.id)
  ) INTO result
  FROM profiles p
  WHERE p.id = candidate_id;

  RETURN result;
END;
$$;


ALTER FUNCTION "public"."get_candidate_admin"("candidate_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_candidate_details"("p_name" "text") RETURNS "json"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
  v_result JSON;
BEGIN
  SELECT json_agg(row_data) INTO v_result
  FROM (
    SELECT json_build_object(
      'name', COALESCE(
        NULLIF(u.raw_user_meta_data->>'name', ''),
        NULLIF(CONCAT_WS(' ', u.raw_user_meta_data->>'first_name', u.raw_user_meta_data->>'last_name'), ''),
        NULLIF(CONCAT_WS(' ', p.first_name, p.last_name), '')
      ),
      'email', COALESCE(p.email, u.email),
      'linkedin_url', p.linkedinurl,
      'profile_slug', p.profile_slug,
      'location', p.profile_data->>'location',
      'role', p.profile_data->>'role',
      'industries', p.profile_data->'industries',
      'focus_areas', p.profile_data->'focus_areas',
      'geographic_coverage', p.profile_data->'geographical_coverage',
      'fractional_preferences', (
        SELECT json_build_object(
          'open_for_work', fp.open_for_work,
          'min_hourly_rate', fp.min_hourly_rate,
          'max_hourly_rate', fp.max_hourly_rate,
          'min_daily_rate', fp.min_daily_rate,
          'max_daily_rate', fp.max_daily_rate,
          'min_hours_per_week', fp.min_hours_per_week,
          'max_hours_per_week', fp.max_hours_per_week,
          'remote_ok', fp.remote_ok,
          'start_date', fp.start_date
        )
        FROM fractional_preferences fp WHERE fp.user_id = p.id
      ),
      'full_time_preferences', (
        SELECT json_build_object(
          'open_for_work', ftp.open_for_work,
          'min_salary', ftp.min_salary,
          'max_salary', ftp.max_salary,
          'remote_ok', ftp.remote_ok,
          'start_date', ftp.start_date
        )
        FROM full_time_preferences ftp WHERE ftp.user_id = p.id
      ),
      'agreement', (
        SELECT json_build_object(
          'agreement_version', aa.agreement_version,
          'accepted_at', aa.accepted_at,
          'signature_name', aa.signature_name
        )
        FROM agreement_acceptances aa
        WHERE aa.profile_id = p.id
        ORDER BY aa.accepted_at DESC
        LIMIT 1
      )
    ) AS row_data
    FROM profiles p
    JOIN auth.users u ON u.id = p.id
    WHERE
      COALESCE(
        NULLIF(u.raw_user_meta_data->>'name', ''),
        CONCAT_WS(' ', u.raw_user_meta_data->>'first_name', u.raw_user_meta_data->>'last_name')
      ) ILIKE '%' || p_name || '%'
      OR p.email ILIKE '%' || p_name || '%'
      OR u.email ILIKE '%' || p_name || '%'
    LIMIT 10
  ) sub;

  RETURN COALESCE(v_result, '[]'::JSON);
END;
$$;


ALTER FUNCTION "public"."get_candidate_details"("p_name" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_current_agreement_status"("p_current_version" "text") RETURNS TABLE("is_accepted" boolean, "is_current_version" boolean, "accepted_at" timestamp with time zone, "agreement_version" "text", "signature_name" "text", "contact_email" "text", "mobile_country_code" "text", "mobile_number" "text", "full_legal_name" "text", "residential_address" "jsonb", "contracting_type" "text", "entity_name" "text", "entity_registration_number" "text", "entity_address" "jsonb", "entity_confirmed" boolean)
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
  RETURN QUERY
  SELECT
    true AS is_accepted,
    (aa.agreement_version = p_current_version) AS is_current_version,
    aa.accepted_at,
    aa.agreement_version,
    aa.signature_name,
    aa.contact_email,
    aa.mobile_country_code,
    aa.mobile_number,
    aa.full_legal_name,
    aa.residential_address,
    aa.contracting_type,
    aa.entity_name,
    aa.entity_registration_number,
    aa.entity_address,
    aa.entity_confirmed
  FROM public.agreement_acceptances aa
  WHERE aa.profile_id = auth.uid()
  ORDER BY aa.accepted_at DESC
  LIMIT 1;
END;
$$;


ALTER FUNCTION "public"."get_current_agreement_status"("p_current_version" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_job_description"("p_slug" "text") RETURNS "json"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
  v_result JSON;
BEGIN
  SELECT row_to_json(jd)
  INTO v_result
  FROM (
    SELECT id, slug, client_name, google_doc_url, jd_data, status, created_at, updated_at
    FROM public.job_descriptions
    WHERE slug = p_slug
  ) jd;

  IF v_result IS NULL THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Job description not found: ' || p_slug
    );
  END IF;

  RETURN v_result;
END;
$$;


ALTER FUNCTION "public"."get_job_description"("p_slug" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_profiles_by_slugs"("p_slugs" "text"[]) RETURNS TABLE("profile_slug" "text", "first_name" "text", "last_name" "text", "email" "text", "linkedinurl" "text", "profile_data" "jsonb")
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
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


ALTER FUNCTION "public"."get_profiles_by_slugs"("p_slugs" "text"[]) OWNER TO "postgres";


COMMENT ON FUNCTION "public"."get_profiles_by_slugs"("p_slugs" "text"[]) IS 'Fetch profile details by slug array. Used by fractional-command internal search. Anon-safe via SECURITY DEFINER.';



CREATE OR REPLACE FUNCTION "public"."get_public_profile"("profile_slug_param" "text") RETURNS TABLE("profile_slug" "text", "profile_data" "jsonb", "profile_version" "text", "first_name" "text", "last_name" "text", "linkedinurl" "text")
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public', 'pg_temp'
    AS $$
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
$$;


ALTER FUNCTION "public"."get_public_profile"("profile_slug_param" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_public_profile_by_id"("profile_id_param" "uuid") RETURNS TABLE("profile_slug" "text", "profile_data" "jsonb", "profile_version" "text", "first_name" "text", "last_name" "text", "linkedinurl" "text")
    LANGUAGE "sql" SECURITY DEFINER
    SET "search_path" TO 'public', 'pg_temp'
    AS $$
  SELECT p.profile_slug, p.profile_data, p.profile_version, p.first_name, p.last_name, p.linkedinurl
  FROM public.profiles AS p
  WHERE p.id = profile_id_param
  LIMIT 1;
$$;


ALTER FUNCTION "public"."get_public_profile_by_id"("profile_id_param" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
DECLARE
  generated_slug text;
  new_status public.onboarding_status;
  is_linkedin boolean;
  first_name_val text;
  last_name_val text;
  full_name text;
  space_pos integer;
BEGIN
  -- Determine if the provider is LinkedIn (covers both single provider and array of providers)
  is_linkedin := 
    (NEW.raw_app_meta_data ->> 'provider') = 'linkedin_oidc'
    OR ((NEW.raw_app_meta_data -> 'providers') @> '["linkedin_oidc"]'::jsonb);

  -- Decide initial onboarding status at creation time
  new_status := CASE
    WHEN NEW.email_confirmed_at IS NOT NULL OR is_linkedin THEN 'EMAIL_CONFIRMED'::public.onboarding_status
    ELSE 'SIGNED_UP'::public.onboarding_status
  END;

  -- Extract first_name and last_name
  first_name_val := NEW.raw_user_meta_data ->> 'first_name';
  last_name_val := NEW.raw_user_meta_data ->> 'last_name';

  -- If both are NULL, try to parse from 'name' field (common with LinkedIn OAuth)
  IF first_name_val IS NULL AND last_name_val IS NULL THEN
    full_name := trim(NEW.raw_user_meta_data ->> 'name');
    
    IF full_name IS NOT NULL AND full_name != '' THEN
      -- Find the first space to split first and last name
      space_pos := position(' ' in full_name);
      
      IF space_pos > 0 THEN
        -- Split on first space: "John Doe Smith" -> "John" + "Doe Smith"
        first_name_val := trim(substring(full_name from 1 for space_pos - 1));
        last_name_val := trim(substring(full_name from space_pos + 1));
      ELSE
        -- No space found, use entire name as first_name
        first_name_val := full_name;
        last_name_val := NULL;
      END IF;
    END IF;
  END IF;

  -- Generate unique slug using the extracted/parsed names
  generated_slug := public.generate_unique_profile_slug(
    NEW.id,
    first_name_val,
    last_name_val
  );

  -- Insert profile; if it already exists (due to a race), do not overwrite it
  BEGIN
    INSERT INTO public.profiles (id, email, first_name, last_name, onboarding_status, profile_slug)
    VALUES (
      NEW.id,
      NEW.email,
      first_name_val,
      last_name_val,
      new_status,
      generated_slug
    );
  EXCEPTION
    WHEN unique_violation THEN
      -- Profile row already exists (possibly updated by the client); do not downgrade or overwrite.
      NULL;
  END;

  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."list_job_descriptions"("p_status" "text" DEFAULT NULL::"text", "p_limit" integer DEFAULT 20) RETURNS "json"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
  v_result JSON;
BEGIN
  SELECT json_agg(row_data)
  INTO v_result
  FROM (
    SELECT
      id,
      slug,
      client_name,
      status,
      google_doc_url,
      jd_data->>'role_title' AS role_title,
      jd_data->>'location' AS location,
      created_at
    FROM public.job_descriptions
    WHERE (p_status IS NULL OR status = p_status)
    ORDER BY created_at DESC
    LIMIT p_limit
  ) row_data;

  RETURN COALESCE(v_result, '[]'::json);
END;
$$;


ALTER FUNCTION "public"."list_job_descriptions"("p_status" "text", "p_limit" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."match_documents"("query_embedding" "public"."vector", "match_count" integer DEFAULT NULL::integer, "filter" "jsonb" DEFAULT '{}'::"jsonb") RETURNS TABLE("id" "uuid", "content" "text", "metadata" "jsonb", "similarity" double precision)
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public'
    AS $$
#variable_conflict use_column
BEGIN
  RETURN QUERY
  SELECT
    e.profile_id AS id,
    e.content,
    e.metadata,
    1 - (e.embedding <=> query_embedding) AS similarity
  FROM profile_embeddings e
  WHERE e.metadata @> filter
  ORDER BY e.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;


ALTER FUNCTION "public"."match_documents"("query_embedding" "public"."vector", "match_count" integer, "filter" "jsonb") OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."agreement_acceptances" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "profile_id" "uuid" NOT NULL,
    "agreement_version" "text" NOT NULL,
    "accepted_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "signature_name" "text" NOT NULL,
    "contact_email" "text" NOT NULL,
    "mobile_country_code" "text" NOT NULL,
    "mobile_number" "text" NOT NULL,
    "full_legal_name" "text" NOT NULL,
    "residential_address" "jsonb" NOT NULL,
    "contracting_type" "text" NOT NULL,
    "entity_name" "text",
    "entity_registration_number" "text",
    "entity_address" "jsonb",
    "entity_confirmed" boolean DEFAULT false,
    "user_agent" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "ip_address" "text",
    CONSTRAINT "agreement_acceptances_contracting_type_check" CHECK (("contracting_type" = ANY (ARRAY['individual'::"text", 'entity'::"text"])))
);


ALTER TABLE "public"."agreement_acceptances" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."record_agreement_acceptance"("p_agreement_version" "text", "p_signature_name" "text", "p_contact_email" "text", "p_mobile_country_code" "text", "p_mobile_number" "text", "p_full_legal_name" "text", "p_residential_address" "jsonb", "p_contracting_type" "text", "p_entity_name" "text" DEFAULT NULL::"text", "p_entity_registration_number" "text" DEFAULT NULL::"text", "p_entity_address" "jsonb" DEFAULT NULL::"jsonb", "p_entity_confirmed" boolean DEFAULT false, "p_user_agent" "text" DEFAULT NULL::"text") RETURNS "public"."agreement_acceptances"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  v_result public.agreement_acceptances;
BEGIN
  INSERT INTO public.agreement_acceptances (
    profile_id, agreement_version, signature_name,
    contact_email, mobile_country_code, mobile_number,
    full_legal_name, residential_address,
    contracting_type, entity_name, entity_registration_number,
    entity_address, entity_confirmed, user_agent
  ) VALUES (
    auth.uid(), p_agreement_version, p_signature_name,
    p_contact_email, p_mobile_country_code, p_mobile_number,
    p_full_legal_name, p_residential_address,
    p_contracting_type, p_entity_name, p_entity_registration_number,
    p_entity_address, p_entity_confirmed, p_user_agent
  )
  RETURNING * INTO v_result;

  RETURN v_result;
END;
$$;


ALTER FUNCTION "public"."record_agreement_acceptance"("p_agreement_version" "text", "p_signature_name" "text", "p_contact_email" "text", "p_mobile_country_code" "text", "p_mobile_number" "text", "p_full_legal_name" "text", "p_residential_address" "jsonb", "p_contracting_type" "text", "p_entity_name" "text", "p_entity_registration_number" "text", "p_entity_address" "jsonb", "p_entity_confirmed" boolean, "p_user_agent" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."record_agreement_acceptance"("p_agreement_version" "text", "p_signature_name" "text", "p_contact_email" "text", "p_mobile_country_code" "text", "p_mobile_number" "text", "p_full_legal_name" "text", "p_residential_address" "jsonb", "p_contracting_type" "text", "p_entity_name" "text" DEFAULT NULL::"text", "p_entity_registration_number" "text" DEFAULT NULL::"text", "p_entity_address" "jsonb" DEFAULT NULL::"jsonb", "p_entity_confirmed" boolean DEFAULT false, "p_user_agent" "text" DEFAULT NULL::"text", "p_ip_address" "text" DEFAULT NULL::"text") RETURNS "public"."agreement_acceptances"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  v_result public.agreement_acceptances;
BEGIN
  INSERT INTO public.agreement_acceptances (
    profile_id, agreement_version, signature_name,
    contact_email, mobile_country_code, mobile_number,
    full_legal_name, residential_address,
    contracting_type, entity_name, entity_registration_number,
    entity_address, entity_confirmed, user_agent, ip_address
  ) VALUES (
    auth.uid(), p_agreement_version, p_signature_name,
    p_contact_email, p_mobile_country_code, p_mobile_number,
    p_full_legal_name, p_residential_address,
    p_contracting_type, p_entity_name, p_entity_registration_number,
    p_entity_address, p_entity_confirmed, p_user_agent, p_ip_address
  )
  RETURNING * INTO v_result;

  RETURN v_result;
END;
$$;


ALTER FUNCTION "public"."record_agreement_acceptance"("p_agreement_version" "text", "p_signature_name" "text", "p_contact_email" "text", "p_mobile_country_code" "text", "p_mobile_number" "text", "p_full_legal_name" "text", "p_residential_address" "jsonb", "p_contracting_type" "text", "p_entity_name" "text", "p_entity_registration_number" "text", "p_entity_address" "jsonb", "p_entity_confirmed" boolean, "p_user_agent" "text", "p_ip_address" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."save_linkedin_profiles"("p_profiles" "jsonb", "p_search_query" "text" DEFAULT 'manual scrape'::"text") RETURNS "json"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
  profile JSONB;
  inserted_count INTEGER := 0;
  updated_count INTEGER := 0;
BEGIN
  -- Validate input
  IF p_profiles IS NULL OR jsonb_array_length(p_profiles) = 0 THEN
    RETURN json_build_object(
      'success', false,
      'error', 'No profiles provided'
    );
  END IF;
  
  -- Limit batch size to prevent abuse (max 50 profiles at once)
  IF jsonb_array_length(p_profiles) > 50 THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Too many profiles. Maximum 50 per request.'
    );
  END IF;

  -- Insert each profile
  FOR profile IN SELECT * FROM jsonb_array_elements(p_profiles)
  LOOP
    INSERT INTO linkedin_profiles (
      linkedin_url,
      full_name,
      first_name,
      last_name,
      headline,
      summary,
      current_company,
      follower_count,
      location_text,
      city,
      state,
      country,
      country_code,
      experience,
      education,
      skills,
      raw_data,
      search_query
    ) VALUES (
      profile->>'linkedin_url',
      profile->>'full_name',
      profile->>'first_name',
      profile->>'last_name',
      profile->>'headline',
      profile->>'summary',
      profile->>'current_company',
      COALESCE((profile->>'follower_count')::INTEGER, 0),
      profile->>'location_text',
      profile->>'city',
      profile->>'state',
      profile->>'country',
      profile->>'country_code',
      COALESCE(profile->'experience', '[]'::JSONB),
      COALESCE(profile->'education', '[]'::JSONB),
      COALESCE(profile->'skills', '[]'::JSONB),
      profile->'raw_data',
      p_search_query
    )
    ON CONFLICT (linkedin_url) DO UPDATE SET
      full_name = EXCLUDED.full_name,
      first_name = EXCLUDED.first_name,
      last_name = EXCLUDED.last_name,
      headline = EXCLUDED.headline,
      summary = EXCLUDED.summary,
      current_company = EXCLUDED.current_company,
      follower_count = EXCLUDED.follower_count,
      location_text = EXCLUDED.location_text,
      city = EXCLUDED.city,
      state = EXCLUDED.state,
      country = EXCLUDED.country,
      country_code = EXCLUDED.country_code,
      experience = EXCLUDED.experience,
      education = EXCLUDED.education,
      skills = EXCLUDED.skills,
      raw_data = EXCLUDED.raw_data,
      search_query = EXCLUDED.search_query,
      updated_at = NOW();
    
    IF FOUND THEN
      inserted_count := inserted_count + 1;
    END IF;
  END LOOP;

  RETURN json_build_object(
    'success', true,
    'saved_count', inserted_count,
    'search_query', p_search_query
  );
END;
$$;


ALTER FUNCTION "public"."save_linkedin_profiles"("p_profiles" "jsonb", "p_search_query" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."search_candidates_admin"("search_query" "text" DEFAULT NULL::"text", "status_filter" "text" DEFAULT NULL::"text", "type_filter" "text" DEFAULT NULL::"text", "has_agreement" boolean DEFAULT NULL::boolean, "open_for_work" boolean DEFAULT NULL::boolean, "page_number" integer DEFAULT 1, "page_size" integer DEFAULT 25) RETURNS "json"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  result json;
  offset_val int;
  total_count int;
BEGIN
  -- Verify caller is admin
  IF (auth.jwt() -> 'app_metadata' ->> 'role') IS DISTINCT FROM 'admin' THEN
    RAISE EXCEPTION 'Unauthorized: not an admin user';
  END IF;

  offset_val := (page_number - 1) * page_size;

  -- Get total count
  SELECT COUNT(*) INTO total_count
  FROM profiles p
  WHERE
    (search_query IS NULL OR (
      p.first_name ILIKE '%' || search_query || '%' OR
      p.last_name ILIKE '%' || search_query || '%' OR
      p.email ILIKE '%' || search_query || '%' OR
      p.profile_data->>'role' ILIKE '%' || search_query || '%' OR
      p.profile_data->>'summary' ILIKE '%' || search_query || '%'
    ))
    AND (status_filter IS NULL OR p.onboarding_status::text = status_filter)
    AND (type_filter IS NULL OR p.profile_type::text = type_filter)
    AND (has_agreement IS NULL OR (
      CASE WHEN has_agreement THEN
        EXISTS (SELECT 1 FROM agreement_acceptances aa WHERE aa.profile_id = p.id)
      ELSE
        NOT EXISTS (SELECT 1 FROM agreement_acceptances aa WHERE aa.profile_id = p.id)
      END
    ))
    AND (open_for_work IS NULL OR EXISTS (
      SELECT 1 FROM fractional_preferences fp WHERE fp.user_id = p.id AND fp.open_for_work = search_candidates_admin.open_for_work
    ));

  -- Get page results
  SELECT json_build_object(
    'data', COALESCE(json_agg(row_to_json(t)), '[]'::json),
    'total', total_count,
    'page', page_number,
    'pageSize', page_size,
    'totalPages', CEIL(total_count::float / page_size)
  ) INTO result
  FROM (
    SELECT
      p.id,
      p.email,
      p.first_name,
      p.last_name,
      p.profile_type::text as profile_type,
      p.onboarding_status::text as onboarding_status,
      p.ispublished,
      p.linkedinurl,
      p.created_at,
      p.profile_data->>'role' as role,
      p.profile_data->>'location' as location,
      EXISTS (SELECT 1 FROM agreement_acceptances aa WHERE aa.profile_id = p.id) as has_agreement,
      (SELECT fp.open_for_work FROM fractional_preferences fp WHERE fp.user_id = p.id) as fractional_open,
      (SELECT ftp.open_for_work FROM full_time_preferences ftp WHERE ftp.user_id = p.id) as fulltime_open
    FROM profiles p
    WHERE
      (search_query IS NULL OR (
        p.first_name ILIKE '%' || search_query || '%' OR
        p.last_name ILIKE '%' || search_query || '%' OR
        p.email ILIKE '%' || search_query || '%' OR
        p.profile_data->>'role' ILIKE '%' || search_query || '%' OR
        p.profile_data->>'summary' ILIKE '%' || search_query || '%'
      ))
      AND (status_filter IS NULL OR p.onboarding_status::text = status_filter)
      AND (type_filter IS NULL OR p.profile_type::text = type_filter)
      AND (has_agreement IS NULL OR (
        CASE WHEN has_agreement THEN
          EXISTS (SELECT 1 FROM agreement_acceptances aa WHERE aa.profile_id = p.id)
        ELSE
          NOT EXISTS (SELECT 1 FROM agreement_acceptances aa WHERE aa.profile_id = p.id)
        END
      ))
      AND (open_for_work IS NULL OR EXISTS (
        SELECT 1 FROM fractional_preferences fp WHERE fp.user_id = p.id AND fp.open_for_work = search_candidates_admin.open_for_work
      ))
    ORDER BY p.created_at DESC
    LIMIT page_size OFFSET offset_val
  ) t;

  RETURN result;
END;
$$;


ALTER FUNCTION "public"."search_candidates_admin"("search_query" "text", "status_filter" "text", "type_filter" "text", "has_agreement" boolean, "open_for_work" boolean, "page_number" integer, "page_size" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_anon_slug"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
BEGIN
  -- Only update if anon_profile_data has changed and is not null
  IF NEW.anon_profile_data IS NOT NULL AND 
     (OLD.anon_profile_data IS NULL OR NEW.anon_profile_data != OLD.anon_profile_data) THEN
    NEW.anon_slug := public.generate_unique_anon_slug(NEW.id, NEW.anon_profile_data);
  END IF;
  
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_anon_slug"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_job_description"("p_slug" "text", "p_jd_data" "jsonb", "p_status" "text" DEFAULT NULL::"text", "p_client_name" "text" DEFAULT NULL::"text", "p_google_doc_url" "text" DEFAULT NULL::"text") RETURNS "json"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
  v_id UUID;
BEGIN
  UPDATE public.job_descriptions
  SET
    jd_data = p_jd_data,
    status = COALESCE(p_status, status),
    client_name = COALESCE(p_client_name, client_name),
    google_doc_url = COALESCE(p_google_doc_url, google_doc_url)
  WHERE slug = p_slug
  RETURNING id INTO v_id;

  IF v_id IS NULL THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Job description not found: ' || p_slug
    );
  END IF;

  RETURN json_build_object(
    'success', true,
    'id', v_id,
    'slug', p_slug
  );

EXCEPTION WHEN OTHERS THEN
  RETURN json_build_object(
    'success', false,
    'error', SQLERRM
  );
END;
$$;


ALTER FUNCTION "public"."update_job_description"("p_slug" "text", "p_jd_data" "jsonb", "p_status" "text", "p_client_name" "text", "p_google_doc_url" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_linkedin_profiles_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_linkedin_profiles_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."countries" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "alpha2_code" character(2) NOT NULL,
    "alpha3_code" character(3) NOT NULL,
    "country_code" integer NOT NULL,
    "iso_3166_2" "text",
    "region" "text",
    "sub_region" "text",
    "intermediate_region" "text",
    "region_code" integer,
    "sub_region_code" integer,
    "intermediate_region_code" integer,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."countries" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."fractional_industry_preferences" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "industry_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."fractional_industry_preferences" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."fractional_location_preferences" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "location_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."fractional_location_preferences" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."fractional_preferences" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "min_hourly_rate" integer,
    "max_hourly_rate" integer,
    "min_daily_rate" integer,
    "max_daily_rate" integer,
    "min_hours_per_week" integer,
    "max_hours_per_week" integer,
    "remote_ok" boolean DEFAULT false,
    "payment_type" "text",
    "start_date" "date",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "open_for_work" boolean DEFAULT false NOT NULL,
    CONSTRAINT "fractional_preferences_payment_type_check" CHECK (("payment_type" = ANY (ARRAY['hourly'::"text", 'daily'::"text"])))
);


ALTER TABLE "public"."fractional_preferences" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."full_time_industry_preferences" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "industry_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."full_time_industry_preferences" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."full_time_location_preferences" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "location_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."full_time_location_preferences" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."full_time_preferences" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "min_salary" integer,
    "max_salary" integer,
    "remote_ok" boolean DEFAULT false,
    "start_date" "date",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "open_for_work" boolean DEFAULT false NOT NULL
);


ALTER TABLE "public"."full_time_preferences" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."industries" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "slug" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."industries" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."job_descriptions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "slug" "text" NOT NULL,
    "jd_data" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "status" "text" DEFAULT 'draft'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "client_name" "text",
    "google_doc_url" "text",
    CONSTRAINT "job_descriptions_status_check" CHECK (("status" = ANY (ARRAY['draft'::"text", 'published'::"text"])))
);


ALTER TABLE "public"."job_descriptions" OWNER TO "postgres";


COMMENT ON TABLE "public"."job_descriptions" IS 'Structured job descriptions for executive search engagements';



CREATE TABLE IF NOT EXISTS "public"."linkedin_profiles" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "linkedin_url" "text" NOT NULL,
    "full_name" "text",
    "first_name" "text",
    "last_name" "text",
    "headline" "text",
    "summary" "text",
    "current_company" "text",
    "follower_count" integer,
    "location_text" "text",
    "city" "text",
    "state" "text",
    "country" "text",
    "country_code" "text",
    "experience" "jsonb",
    "education" "jsonb",
    "skills" "jsonb",
    "raw_data" "jsonb",
    "scraped_at" timestamp with time zone DEFAULT "now"(),
    "search_query" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."linkedin_profiles" OWNER TO "postgres";


COMMENT ON TABLE "public"."linkedin_profiles" IS 'LinkedIn profiles scraped via Apify external search. Service role access only.';



CREATE TABLE IF NOT EXISTS "public"."locations" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "place_id" "text" NOT NULL,
    "name" "text" NOT NULL,
    "formatted_address" "text",
    "city" "text",
    "state_province" "text",
    "country_code" character(2),
    "latitude" numeric(10,8),
    "longitude" numeric(11,8),
    "place_types" "text"[],
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."locations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."profile_documents" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "type" "public"."document_type" NOT NULL,
    "title" "text",
    "original_filename" "text" NOT NULL,
    "file_size" bigint,
    "mime_type" "text",
    "storage_path" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."profile_documents" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."profile_embeddings" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "profile_id" "uuid",
    "content" "text",
    "text_hash" "text",
    "embedding" "public"."vector"(1536),
    "last_embedded_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "metadata" "jsonb"
);


ALTER TABLE "public"."profile_embeddings" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "email" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "profile_data" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "profile_version" "text" DEFAULT '0.1'::"text" NOT NULL,
    "first_name" "text",
    "last_name" "text",
    "onboarding_status" "public"."onboarding_status" DEFAULT 'SIGNED_UP'::"public"."onboarding_status" NOT NULL,
    "notification_preferences" "jsonb" DEFAULT '{"email_notifications": true}'::"jsonb",
    "profile_slug" "text",
    "profile_data_original" "jsonb" DEFAULT '{}'::"jsonb",
    "ispublished" boolean DEFAULT false,
    "linkedinurl" "text",
    "anon_profile_data" "jsonb",
    "anon_slug" "text",
    "profile_type" "public"."profile_type" DEFAULT 'authenticated'::"public"."profile_type" NOT NULL,
    CONSTRAINT "profiles_authenticated_email_check" CHECK ((("profile_type" = 'guest'::"public"."profile_type") OR (("profile_type" = 'authenticated'::"public"."profile_type") AND ("email" IS NOT NULL)))),
    CONSTRAINT "profiles_authenticated_slug_check" CHECK ((("profile_type" = 'guest'::"public"."profile_type") OR (("profile_type" = 'authenticated'::"public"."profile_type") AND ("profile_slug" IS NOT NULL))))
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


COMMENT ON COLUMN "public"."profiles"."id" IS 'Primary key. For authenticated users, this matches auth.users.id. For guest profiles (profile_type=guest), this is a standalone UUID.';



CREATE TABLE IF NOT EXISTS "public"."timezones" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "value" "text" NOT NULL,
    "abbr" "text" NOT NULL,
    "utc_offset" numeric NOT NULL,
    "isdst" boolean NOT NULL,
    "text" "text" NOT NULL,
    "utc" "text"[] NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."timezones" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_location_preferences" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "location_id" "uuid" NOT NULL,
    "preference_type" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "user_location_preferences_preference_type_check" CHECK (("preference_type" = ANY (ARRAY['current'::"text", 'preferred_work'::"text"])))
);


ALTER TABLE "public"."user_location_preferences" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_work_eligibility" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "country_code" character(2) NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."user_work_eligibility" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."work_preferences" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "current_location_id" "uuid",
    "timezone_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."work_preferences" OWNER TO "postgres";


ALTER TABLE ONLY "public"."agreement_acceptances"
    ADD CONSTRAINT "agreement_acceptances_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."countries"
    ADD CONSTRAINT "countries_alpha2_code_key" UNIQUE ("alpha2_code");



ALTER TABLE ONLY "public"."countries"
    ADD CONSTRAINT "countries_alpha3_code_key" UNIQUE ("alpha3_code");



ALTER TABLE ONLY "public"."countries"
    ADD CONSTRAINT "countries_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."fractional_industry_preferences"
    ADD CONSTRAINT "fractional_industry_preferences_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."fractional_industry_preferences"
    ADD CONSTRAINT "fractional_industry_preferences_user_id_industry_id_key" UNIQUE ("user_id", "industry_id");



ALTER TABLE ONLY "public"."fractional_location_preferences"
    ADD CONSTRAINT "fractional_location_preferences_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."fractional_location_preferences"
    ADD CONSTRAINT "fractional_location_preferences_user_id_location_id_key" UNIQUE ("user_id", "location_id");



ALTER TABLE ONLY "public"."fractional_preferences"
    ADD CONSTRAINT "fractional_preferences_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."fractional_preferences"
    ADD CONSTRAINT "fractional_preferences_user_id_key" UNIQUE ("user_id");



ALTER TABLE ONLY "public"."full_time_industry_preferences"
    ADD CONSTRAINT "full_time_industry_preferences_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."full_time_industry_preferences"
    ADD CONSTRAINT "full_time_industry_preferences_user_id_industry_id_key" UNIQUE ("user_id", "industry_id");



ALTER TABLE ONLY "public"."full_time_location_preferences"
    ADD CONSTRAINT "full_time_location_preferences_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."full_time_location_preferences"
    ADD CONSTRAINT "full_time_location_preferences_user_id_location_id_key" UNIQUE ("user_id", "location_id");



ALTER TABLE ONLY "public"."full_time_preferences"
    ADD CONSTRAINT "full_time_preferences_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."full_time_preferences"
    ADD CONSTRAINT "full_time_preferences_user_id_key" UNIQUE ("user_id");



ALTER TABLE ONLY "public"."industries"
    ADD CONSTRAINT "industries_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."industries"
    ADD CONSTRAINT "industries_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."industries"
    ADD CONSTRAINT "industries_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."job_descriptions"
    ADD CONSTRAINT "job_descriptions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."job_descriptions"
    ADD CONSTRAINT "job_descriptions_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."linkedin_profiles"
    ADD CONSTRAINT "linkedin_profiles_linkedin_url_key" UNIQUE ("linkedin_url");



ALTER TABLE ONLY "public"."linkedin_profiles"
    ADD CONSTRAINT "linkedin_profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."locations"
    ADD CONSTRAINT "locations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."locations"
    ADD CONSTRAINT "locations_place_id_key" UNIQUE ("place_id");



ALTER TABLE ONLY "public"."profile_documents"
    ADD CONSTRAINT "profile_documents_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profile_embeddings"
    ADD CONSTRAINT "profile_embeddings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profile_embeddings"
    ADD CONSTRAINT "profile_embeddings_profile_id_key" UNIQUE ("profile_id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_anon_slug_key" UNIQUE ("anon_slug");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."timezones"
    ADD CONSTRAINT "timezones_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."timezones"
    ADD CONSTRAINT "timezones_value_key" UNIQUE ("value");



ALTER TABLE ONLY "public"."user_location_preferences"
    ADD CONSTRAINT "user_location_preferences_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_location_preferences"
    ADD CONSTRAINT "user_location_preferences_user_id_location_id_preference_ty_key" UNIQUE ("user_id", "location_id", "preference_type");



ALTER TABLE ONLY "public"."user_work_eligibility"
    ADD CONSTRAINT "user_work_eligibility_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_work_eligibility"
    ADD CONSTRAINT "user_work_eligibility_user_id_country_code_key" UNIQUE ("user_id", "country_code");



ALTER TABLE ONLY "public"."work_preferences"
    ADD CONSTRAINT "work_preferences_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."work_preferences"
    ADD CONSTRAINT "work_preferences_user_id_key" UNIQUE ("user_id");



CREATE INDEX "idx_agreement_acceptances_profile_id" ON "public"."agreement_acceptances" USING "btree" ("profile_id");



CREATE INDEX "idx_agreement_acceptances_version" ON "public"."agreement_acceptances" USING "btree" ("agreement_version");



CREATE INDEX "idx_countries_alpha2" ON "public"."countries" USING "btree" ("alpha2_code");



CREATE INDEX "idx_countries_alpha3" ON "public"."countries" USING "btree" ("alpha3_code");



CREATE INDEX "idx_countries_name" ON "public"."countries" USING "btree" ("name");



CREATE INDEX "idx_countries_region" ON "public"."countries" USING "btree" ("region");



CREATE INDEX "idx_countries_sub_region" ON "public"."countries" USING "btree" ("sub_region");



CREATE INDEX "idx_industries_name" ON "public"."industries" USING "btree" ("name");



CREATE INDEX "idx_industries_slug" ON "public"."industries" USING "btree" ("slug");



CREATE INDEX "idx_job_descriptions_created_at" ON "public"."job_descriptions" USING "btree" ("created_at" DESC);



CREATE INDEX "idx_job_descriptions_status" ON "public"."job_descriptions" USING "btree" ("status");



CREATE INDEX "idx_locations_country_code" ON "public"."locations" USING "btree" ("country_code");



CREATE INDEX "idx_locations_name" ON "public"."locations" USING "gin" ("to_tsvector"('"english"'::"regconfig", "name"));



CREATE INDEX "idx_locations_place_id" ON "public"."locations" USING "btree" ("place_id");



CREATE INDEX "idx_profile_documents_created_at" ON "public"."profile_documents" USING "btree" ("created_at");



CREATE INDEX "idx_profile_documents_type" ON "public"."profile_documents" USING "btree" ("type");



CREATE INDEX "idx_profile_documents_user_id" ON "public"."profile_documents" USING "btree" ("user_id");



CREATE INDEX "idx_profiles_anon_slug" ON "public"."profiles" USING "btree" ("anon_slug");



CREATE INDEX "idx_profiles_profile_data" ON "public"."profiles" USING "gin" ("profile_data");



CREATE INDEX "idx_profiles_profile_version" ON "public"."profiles" USING "btree" ("profile_version");



CREATE INDEX "idx_timezones_abbr" ON "public"."timezones" USING "btree" ("abbr");



CREATE INDEX "idx_timezones_text" ON "public"."timezones" USING "btree" ("text");



CREATE INDEX "idx_timezones_utc_offset" ON "public"."timezones" USING "btree" ("utc_offset");



CREATE INDEX "idx_timezones_value" ON "public"."timezones" USING "btree" ("value");



CREATE INDEX "linkedin_profiles_country_code_idx" ON "public"."linkedin_profiles" USING "btree" ("country_code");



CREATE INDEX "linkedin_profiles_current_company_idx" ON "public"."linkedin_profiles" USING "btree" ("current_company");



CREATE INDEX "linkedin_profiles_scraped_at_idx" ON "public"."linkedin_profiles" USING "btree" ("scraped_at" DESC);



CREATE INDEX "profile_embeddings_embedding_vector_idx" ON "public"."profile_embeddings" USING "ivfflat" ("embedding" "public"."vector_cosine_ops") WITH ("lists"='100');



CREATE UNIQUE INDEX "profiles_profile_slug_unique_authenticated" ON "public"."profiles" USING "btree" ("profile_slug") WHERE (("profile_type" = 'authenticated'::"public"."profile_type") AND ("profile_slug" IS NOT NULL));



CREATE OR REPLACE TRIGGER "auto_generate_profile_slug_trigger" BEFORE INSERT ON "public"."profiles" FOR EACH ROW EXECUTE FUNCTION "public"."auto_generate_profile_slug"();



CREATE OR REPLACE TRIGGER "countries_updated_at" BEFORE UPDATE ON "public"."countries" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "job_descriptions_updated_at" BEFORE UPDATE ON "public"."job_descriptions" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "linkedin_profiles_updated_at" BEFORE UPDATE ON "public"."linkedin_profiles" FOR EACH ROW EXECUTE FUNCTION "public"."update_linkedin_profiles_updated_at"();



CREATE OR REPLACE TRIGGER "timezones_updated_at" BEFORE UPDATE ON "public"."timezones" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "trigger_update_anon_slug" BEFORE INSERT OR UPDATE ON "public"."profiles" FOR EACH ROW EXECUTE FUNCTION "public"."update_anon_slug"();



CREATE OR REPLACE TRIGGER "update_agreement_acceptances_updated_at" BEFORE UPDATE ON "public"."agreement_acceptances" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_fractional_preferences_updated_at" BEFORE UPDATE ON "public"."fractional_preferences" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_full_time_preferences_updated_at" BEFORE UPDATE ON "public"."full_time_preferences" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_industries_updated_at" BEFORE UPDATE ON "public"."industries" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_locations_updated_at" BEFORE UPDATE ON "public"."locations" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_profile_documents_updated_at" BEFORE UPDATE ON "public"."profile_documents" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_user_location_preferences_updated_at" BEFORE UPDATE ON "public"."user_location_preferences" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_work_preferences_updated_at" BEFORE UPDATE ON "public"."work_preferences" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



ALTER TABLE ONLY "public"."agreement_acceptances"
    ADD CONSTRAINT "agreement_acceptances_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."fractional_industry_preferences"
    ADD CONSTRAINT "fractional_industry_preferences_industry_id_fkey" FOREIGN KEY ("industry_id") REFERENCES "public"."industries"("id");



ALTER TABLE ONLY "public"."fractional_industry_preferences"
    ADD CONSTRAINT "fractional_industry_preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."fractional_location_preferences"
    ADD CONSTRAINT "fractional_location_preferences_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id");



ALTER TABLE ONLY "public"."fractional_location_preferences"
    ADD CONSTRAINT "fractional_location_preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."fractional_preferences"
    ADD CONSTRAINT "fractional_preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."full_time_industry_preferences"
    ADD CONSTRAINT "full_time_industry_preferences_industry_id_fkey" FOREIGN KEY ("industry_id") REFERENCES "public"."industries"("id");



ALTER TABLE ONLY "public"."full_time_industry_preferences"
    ADD CONSTRAINT "full_time_industry_preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."full_time_location_preferences"
    ADD CONSTRAINT "full_time_location_preferences_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id");



ALTER TABLE ONLY "public"."full_time_location_preferences"
    ADD CONSTRAINT "full_time_location_preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."full_time_preferences"
    ADD CONSTRAINT "full_time_preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."locations"
    ADD CONSTRAINT "locations_country_code_fkey" FOREIGN KEY ("country_code") REFERENCES "public"."countries"("alpha2_code");



ALTER TABLE ONLY "public"."profile_documents"
    ADD CONSTRAINT "profile_documents_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_location_preferences"
    ADD CONSTRAINT "user_location_preferences_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_location_preferences"
    ADD CONSTRAINT "user_location_preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_work_eligibility"
    ADD CONSTRAINT "user_work_eligibility_country_code_fkey" FOREIGN KEY ("country_code") REFERENCES "public"."countries"("alpha2_code");



ALTER TABLE ONLY "public"."user_work_eligibility"
    ADD CONSTRAINT "user_work_eligibility_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."work_preferences"
    ADD CONSTRAINT "work_preferences_current_location_id_fkey" FOREIGN KEY ("current_location_id") REFERENCES "public"."locations"("id");



ALTER TABLE ONLY "public"."work_preferences"
    ADD CONSTRAINT "work_preferences_timezone_id_fkey" FOREIGN KEY ("timezone_id") REFERENCES "public"."timezones"("id");



ALTER TABLE ONLY "public"."work_preferences"
    ADD CONSTRAINT "work_preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



CREATE POLICY "Allow authenticated insert" ON "public"."locations" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Anyone can read published JDs" ON "public"."job_descriptions" FOR SELECT USING (("status" = 'published'::"text"));



CREATE POLICY "Anyone can view locations" ON "public"."locations" FOR SELECT USING (true);



CREATE POLICY "Countries are publicly readable" ON "public"."countries" FOR SELECT USING (true);



CREATE POLICY "Industries are publicly readable" ON "public"."industries" FOR SELECT USING (true);



CREATE POLICY "Service role can manage all profile embeddings" ON "public"."profile_embeddings" USING (("auth"."role"() = 'service_role'::"text"));



CREATE POLICY "Timezones are publicly readable" ON "public"."timezones" FOR SELECT USING (true);



CREATE POLICY "Users can create their own fractional industry preferences" ON "public"."fractional_industry_preferences" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can create their own fractional location preferences" ON "public"."fractional_location_preferences" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can create their own fractional preferences" ON "public"."fractional_preferences" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can create their own full-time industry preferences" ON "public"."full_time_industry_preferences" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can create their own full-time location preferences" ON "public"."full_time_location_preferences" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can create their own full-time preferences" ON "public"."full_time_preferences" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can create their own location preferences" ON "public"."user_location_preferences" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can create their own work eligibility" ON "public"."user_work_eligibility" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can create their own work preferences" ON "public"."work_preferences" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can delete their own documents" ON "public"."profile_documents" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can delete their own fractional industry preferences" ON "public"."fractional_industry_preferences" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can delete their own fractional location preferences" ON "public"."fractional_location_preferences" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can delete their own fractional preferences" ON "public"."fractional_preferences" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can delete their own full-time industry preferences" ON "public"."full_time_industry_preferences" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can delete their own full-time location preferences" ON "public"."full_time_location_preferences" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can delete their own full-time preferences" ON "public"."full_time_preferences" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can delete their own location preferences" ON "public"."user_location_preferences" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can delete their own work eligibility" ON "public"."user_work_eligibility" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can delete their own work preferences" ON "public"."work_preferences" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert their own acceptances" ON "public"."agreement_acceptances" FOR INSERT WITH CHECK (("auth"."uid"() = "profile_id"));



CREATE POLICY "Users can insert their own documents" ON "public"."profile_documents" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own documents" ON "public"."profile_documents" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own fractional industry preferences" ON "public"."fractional_industry_preferences" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own fractional location preferences" ON "public"."fractional_location_preferences" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own fractional preferences" ON "public"."fractional_preferences" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own full-time industry preferences" ON "public"."full_time_industry_preferences" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own full-time location preferences" ON "public"."full_time_location_preferences" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own full-time preferences" ON "public"."full_time_preferences" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own location preferences" ON "public"."user_location_preferences" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own work eligibility" ON "public"."user_work_eligibility" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own work preferences" ON "public"."work_preferences" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view and update their own profiles" ON "public"."profiles" USING (("auth"."uid"() = "id")) WITH CHECK (("auth"."uid"() = "id"));



CREATE POLICY "Users can view their own acceptances" ON "public"."agreement_acceptances" FOR SELECT USING (("auth"."uid"() = "profile_id"));



CREATE POLICY "Users can view their own documents" ON "public"."profile_documents" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own fractional industry preferences" ON "public"."fractional_industry_preferences" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own fractional location preferences" ON "public"."fractional_location_preferences" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own fractional preferences" ON "public"."fractional_preferences" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own full-time industry preferences" ON "public"."full_time_industry_preferences" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own full-time location preferences" ON "public"."full_time_location_preferences" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own full-time preferences" ON "public"."full_time_preferences" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own location preferences" ON "public"."user_location_preferences" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own profile embeddings" ON "public"."profile_embeddings" FOR SELECT USING (("profile_id" IN ( SELECT "profiles"."id"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "auth"."uid"()))));



CREATE POLICY "Users can view their own work eligibility" ON "public"."user_work_eligibility" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own work preferences" ON "public"."work_preferences" FOR SELECT USING (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."agreement_acceptances" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."countries" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."fractional_industry_preferences" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."fractional_location_preferences" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."fractional_preferences" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."full_time_industry_preferences" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."full_time_location_preferences" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."full_time_preferences" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."industries" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."job_descriptions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."linkedin_profiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."locations" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profile_documents" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profile_embeddings" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."timezones" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_location_preferences" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_work_eligibility" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."work_preferences" ENABLE ROW LEVEL SECURITY;


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";



GRANT ALL ON FUNCTION "public"."auto_generate_profile_slug"() TO "anon";
GRANT ALL ON FUNCTION "public"."auto_generate_profile_slug"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."auto_generate_profile_slug"() TO "service_role";



GRANT ALL ON FUNCTION "public"."check_linkedin_cache"("p_urls" "text"[]) TO "anon";
GRANT ALL ON FUNCTION "public"."check_linkedin_cache"("p_urls" "text"[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."check_linkedin_cache"("p_urls" "text"[]) TO "service_role";



GRANT ALL ON FUNCTION "public"."create_guest_profile"("p_profile_data" "jsonb", "p_anon_profile_data" "jsonb", "p_linkedin_url" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."create_guest_profile"("p_profile_data" "jsonb", "p_anon_profile_data" "jsonb", "p_linkedin_url" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_guest_profile"("p_profile_data" "jsonb", "p_anon_profile_data" "jsonb", "p_linkedin_url" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."create_job_description"("p_jd_data" "jsonb", "p_status" "text", "p_client_name" "text", "p_google_doc_url" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."create_job_description"("p_jd_data" "jsonb", "p_status" "text", "p_client_name" "text", "p_google_doc_url" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_job_description"("p_jd_data" "jsonb", "p_status" "text", "p_client_name" "text", "p_google_doc_url" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."generate_unique_anon_slug"("p_user_id" "uuid", "p_anon_data" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."generate_unique_anon_slug"("p_user_id" "uuid", "p_anon_data" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."generate_unique_anon_slug"("p_user_id" "uuid", "p_anon_data" "jsonb") TO "service_role";



GRANT ALL ON FUNCTION "public"."generate_unique_jd_slug"("p_role_title" "text", "p_location" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."generate_unique_jd_slug"("p_role_title" "text", "p_location" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."generate_unique_jd_slug"("p_role_title" "text", "p_location" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."generate_unique_profile_slug"("p_user_id" "uuid", "p_first_name" "text", "p_last_name" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."generate_unique_profile_slug"("p_user_id" "uuid", "p_first_name" "text", "p_last_name" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."generate_unique_profile_slug"("p_user_id" "uuid", "p_first_name" "text", "p_last_name" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_anon_profile"("anon_slug_param" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."get_anon_profile"("anon_slug_param" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_anon_profile"("anon_slug_param" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_candidate_admin"("candidate_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_candidate_admin"("candidate_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_candidate_admin"("candidate_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_candidate_details"("p_name" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."get_candidate_details"("p_name" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_candidate_details"("p_name" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_current_agreement_status"("p_current_version" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."get_current_agreement_status"("p_current_version" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_current_agreement_status"("p_current_version" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_job_description"("p_slug" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."get_job_description"("p_slug" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_job_description"("p_slug" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_profiles_by_slugs"("p_slugs" "text"[]) TO "anon";
GRANT ALL ON FUNCTION "public"."get_profiles_by_slugs"("p_slugs" "text"[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_profiles_by_slugs"("p_slugs" "text"[]) TO "service_role";



REVOKE ALL ON FUNCTION "public"."get_public_profile"("profile_slug_param" "text") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."get_public_profile"("profile_slug_param" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."get_public_profile"("profile_slug_param" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_public_profile"("profile_slug_param" "text") TO "service_role";



REVOKE ALL ON FUNCTION "public"."get_public_profile_by_id"("profile_id_param" "uuid") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."get_public_profile_by_id"("profile_id_param" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_public_profile_by_id"("profile_id_param" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_public_profile_by_id"("profile_id_param" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."list_job_descriptions"("p_status" "text", "p_limit" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."list_job_descriptions"("p_status" "text", "p_limit" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."list_job_descriptions"("p_status" "text", "p_limit" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."match_documents"("query_embedding" "public"."vector", "match_count" integer, "filter" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."match_documents"("query_embedding" "public"."vector", "match_count" integer, "filter" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."match_documents"("query_embedding" "public"."vector", "match_count" integer, "filter" "jsonb") TO "service_role";



GRANT ALL ON TABLE "public"."agreement_acceptances" TO "anon";
GRANT ALL ON TABLE "public"."agreement_acceptances" TO "authenticated";
GRANT ALL ON TABLE "public"."agreement_acceptances" TO "service_role";



GRANT ALL ON FUNCTION "public"."record_agreement_acceptance"("p_agreement_version" "text", "p_signature_name" "text", "p_contact_email" "text", "p_mobile_country_code" "text", "p_mobile_number" "text", "p_full_legal_name" "text", "p_residential_address" "jsonb", "p_contracting_type" "text", "p_entity_name" "text", "p_entity_registration_number" "text", "p_entity_address" "jsonb", "p_entity_confirmed" boolean, "p_user_agent" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."record_agreement_acceptance"("p_agreement_version" "text", "p_signature_name" "text", "p_contact_email" "text", "p_mobile_country_code" "text", "p_mobile_number" "text", "p_full_legal_name" "text", "p_residential_address" "jsonb", "p_contracting_type" "text", "p_entity_name" "text", "p_entity_registration_number" "text", "p_entity_address" "jsonb", "p_entity_confirmed" boolean, "p_user_agent" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."record_agreement_acceptance"("p_agreement_version" "text", "p_signature_name" "text", "p_contact_email" "text", "p_mobile_country_code" "text", "p_mobile_number" "text", "p_full_legal_name" "text", "p_residential_address" "jsonb", "p_contracting_type" "text", "p_entity_name" "text", "p_entity_registration_number" "text", "p_entity_address" "jsonb", "p_entity_confirmed" boolean, "p_user_agent" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."record_agreement_acceptance"("p_agreement_version" "text", "p_signature_name" "text", "p_contact_email" "text", "p_mobile_country_code" "text", "p_mobile_number" "text", "p_full_legal_name" "text", "p_residential_address" "jsonb", "p_contracting_type" "text", "p_entity_name" "text", "p_entity_registration_number" "text", "p_entity_address" "jsonb", "p_entity_confirmed" boolean, "p_user_agent" "text", "p_ip_address" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."record_agreement_acceptance"("p_agreement_version" "text", "p_signature_name" "text", "p_contact_email" "text", "p_mobile_country_code" "text", "p_mobile_number" "text", "p_full_legal_name" "text", "p_residential_address" "jsonb", "p_contracting_type" "text", "p_entity_name" "text", "p_entity_registration_number" "text", "p_entity_address" "jsonb", "p_entity_confirmed" boolean, "p_user_agent" "text", "p_ip_address" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."record_agreement_acceptance"("p_agreement_version" "text", "p_signature_name" "text", "p_contact_email" "text", "p_mobile_country_code" "text", "p_mobile_number" "text", "p_full_legal_name" "text", "p_residential_address" "jsonb", "p_contracting_type" "text", "p_entity_name" "text", "p_entity_registration_number" "text", "p_entity_address" "jsonb", "p_entity_confirmed" boolean, "p_user_agent" "text", "p_ip_address" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."save_linkedin_profiles"("p_profiles" "jsonb", "p_search_query" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."save_linkedin_profiles"("p_profiles" "jsonb", "p_search_query" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."save_linkedin_profiles"("p_profiles" "jsonb", "p_search_query" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."search_candidates_admin"("search_query" "text", "status_filter" "text", "type_filter" "text", "has_agreement" boolean, "open_for_work" boolean, "page_number" integer, "page_size" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."search_candidates_admin"("search_query" "text", "status_filter" "text", "type_filter" "text", "has_agreement" boolean, "open_for_work" boolean, "page_number" integer, "page_size" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."search_candidates_admin"("search_query" "text", "status_filter" "text", "type_filter" "text", "has_agreement" boolean, "open_for_work" boolean, "page_number" integer, "page_size" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."update_anon_slug"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_anon_slug"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_anon_slug"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_job_description"("p_slug" "text", "p_jd_data" "jsonb", "p_status" "text", "p_client_name" "text", "p_google_doc_url" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."update_job_description"("p_slug" "text", "p_jd_data" "jsonb", "p_status" "text", "p_client_name" "text", "p_google_doc_url" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_job_description"("p_slug" "text", "p_jd_data" "jsonb", "p_status" "text", "p_client_name" "text", "p_google_doc_url" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."update_linkedin_profiles_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_linkedin_profiles_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_linkedin_profiles_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "service_role";



GRANT ALL ON TABLE "public"."countries" TO "anon";
GRANT ALL ON TABLE "public"."countries" TO "authenticated";
GRANT ALL ON TABLE "public"."countries" TO "service_role";



GRANT ALL ON TABLE "public"."fractional_industry_preferences" TO "anon";
GRANT ALL ON TABLE "public"."fractional_industry_preferences" TO "authenticated";
GRANT ALL ON TABLE "public"."fractional_industry_preferences" TO "service_role";



GRANT ALL ON TABLE "public"."fractional_location_preferences" TO "anon";
GRANT ALL ON TABLE "public"."fractional_location_preferences" TO "authenticated";
GRANT ALL ON TABLE "public"."fractional_location_preferences" TO "service_role";



GRANT ALL ON TABLE "public"."fractional_preferences" TO "anon";
GRANT ALL ON TABLE "public"."fractional_preferences" TO "authenticated";
GRANT ALL ON TABLE "public"."fractional_preferences" TO "service_role";



GRANT ALL ON TABLE "public"."full_time_industry_preferences" TO "anon";
GRANT ALL ON TABLE "public"."full_time_industry_preferences" TO "authenticated";
GRANT ALL ON TABLE "public"."full_time_industry_preferences" TO "service_role";



GRANT ALL ON TABLE "public"."full_time_location_preferences" TO "anon";
GRANT ALL ON TABLE "public"."full_time_location_preferences" TO "authenticated";
GRANT ALL ON TABLE "public"."full_time_location_preferences" TO "service_role";



GRANT ALL ON TABLE "public"."full_time_preferences" TO "anon";
GRANT ALL ON TABLE "public"."full_time_preferences" TO "authenticated";
GRANT ALL ON TABLE "public"."full_time_preferences" TO "service_role";



GRANT ALL ON TABLE "public"."industries" TO "anon";
GRANT ALL ON TABLE "public"."industries" TO "authenticated";
GRANT ALL ON TABLE "public"."industries" TO "service_role";



GRANT ALL ON TABLE "public"."job_descriptions" TO "anon";
GRANT ALL ON TABLE "public"."job_descriptions" TO "authenticated";
GRANT ALL ON TABLE "public"."job_descriptions" TO "service_role";



GRANT ALL ON TABLE "public"."linkedin_profiles" TO "anon";
GRANT ALL ON TABLE "public"."linkedin_profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."linkedin_profiles" TO "service_role";



GRANT ALL ON TABLE "public"."locations" TO "anon";
GRANT ALL ON TABLE "public"."locations" TO "authenticated";
GRANT ALL ON TABLE "public"."locations" TO "service_role";



GRANT ALL ON TABLE "public"."profile_documents" TO "anon";
GRANT ALL ON TABLE "public"."profile_documents" TO "authenticated";
GRANT ALL ON TABLE "public"."profile_documents" TO "service_role";



GRANT ALL ON TABLE "public"."profile_embeddings" TO "anon";
GRANT ALL ON TABLE "public"."profile_embeddings" TO "authenticated";
GRANT ALL ON TABLE "public"."profile_embeddings" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."timezones" TO "anon";
GRANT ALL ON TABLE "public"."timezones" TO "authenticated";
GRANT ALL ON TABLE "public"."timezones" TO "service_role";



GRANT ALL ON TABLE "public"."user_location_preferences" TO "anon";
GRANT ALL ON TABLE "public"."user_location_preferences" TO "authenticated";
GRANT ALL ON TABLE "public"."user_location_preferences" TO "service_role";



GRANT ALL ON TABLE "public"."user_work_eligibility" TO "anon";
GRANT ALL ON TABLE "public"."user_work_eligibility" TO "authenticated";
GRANT ALL ON TABLE "public"."user_work_eligibility" TO "service_role";



GRANT ALL ON TABLE "public"."work_preferences" TO "anon";
GRANT ALL ON TABLE "public"."work_preferences" TO "authenticated";
GRANT ALL ON TABLE "public"."work_preferences" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






