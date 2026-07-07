-- Migration: normalize_linkedin_url_dedup
-- Purpose: Stop create_guest_profile() from missing duplicate guests whose
--          linkedinurl differs only by format (protocol case, `www.` prefix,
--          trailing slash, query string, or username casing).
-- Context: Production has 4 known dupes (e.g. `https://linkedin.com/in/foo`
--          vs `https://www.linkedin.com/in/foo`) where the RPC's exact-string
--          match created a second row instead of returning the existing one.
--          Backfill of historical linkedinurl values is intentionally out of
--          scope for v0 — this migration only fixes the lookup path.
--
-- Approach: Add an immutable normalize_linkedin_url(text) helper and call it
--          on both sides of the dedup WHERE clause. No schema or stored-value
--          changes; the RPC body is otherwise identical to the previous
--          revision (20260303120000_guest_profile_urls.sql).
--
-- Limitation: PL/pgSQL has no built-in URL decoder, so URL-encoded variants
--          (e.g. %2D in usernames) are not decoded. The canonical TypeScript
--          normalizer in fractional-command/src/utils/linkedin.ts does decode
--          via decodeURIComponent — a follow-up can backfill stored values
--          and / or move dedup to a generated normalized column with a unique
--          index if URL-encoded inputs start to appear.

-- 1. Normalization helper
CREATE OR REPLACE FUNCTION public.normalize_linkedin_url(p_url text)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
PARALLEL SAFE
AS $$
DECLARE
  v_lower text;
  v_handle text;
BEGIN
  IF p_url IS NULL OR p_url = '' THEN
    RETURN p_url;
  END IF;

  v_lower := lower(p_url);

  -- Extract the handle from a `linkedin.com/in/<handle>` URL. Stop at the
  -- first `/`, `?` or `#` so query strings and trailing slashes don't leak.
  v_handle := substring(v_lower FROM 'linkedin\.com/in/([^/?#]+)');

  IF v_handle IS NULL OR v_handle = '' THEN
    RETURN v_lower;
  END IF;

  RETURN 'https://www.linkedin.com/in/' || v_handle;
END;
$$;

COMMENT ON FUNCTION public.normalize_linkedin_url(text) IS
  'Canonical-form a LinkedIn URL for dedup. Mirrors fractional-command/src/utils/linkedin.ts#normalizeLinkedInUrl. Does NOT URL-decode.';

-- 2. create_guest_profile — only the dedup SELECT changes vs the previous
--    revision; everything else is preserved verbatim.
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

  -- Check for duplicate by LinkedIn URL (normalized — see migration
  -- 20260513000000_normalize_linkedin_url_dedup.sql for the helper).
  IF p_linkedin_url IS NOT NULL AND p_linkedin_url != '' THEN
    SELECT id INTO v_existing_id
    FROM profiles
    WHERE public.normalize_linkedin_url(linkedinurl)
        = public.normalize_linkedin_url(p_linkedin_url)
    LIMIT 1;

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

-- VERIFY — run these in psql against staging or a local supabase db after
-- applying the migration. All should return TRUE.
--
--   SELECT public.normalize_linkedin_url('https://www.linkedin.com/in/foo')
--        = public.normalize_linkedin_url('https://linkedin.com/in/foo');
--   SELECT public.normalize_linkedin_url('http://LinkedIn.com/in/Foo/')
--        = public.normalize_linkedin_url('https://www.linkedin.com/in/foo');
--   SELECT public.normalize_linkedin_url('https://www.linkedin.com/in/foo?utm=x')
--        = public.normalize_linkedin_url('https://www.linkedin.com/in/foo');
--   SELECT public.normalize_linkedin_url('not-a-linkedin-url')
--        = 'not-a-linkedin-url';
--   SELECT public.normalize_linkedin_url(NULL) IS NULL;
--   SELECT public.normalize_linkedin_url('') = '';
