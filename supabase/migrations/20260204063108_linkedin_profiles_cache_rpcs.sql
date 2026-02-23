-- RPC functions for linkedin_profiles cache
-- Allows anon key to read/write via SECURITY DEFINER functions
-- while keeping the table locked down (RLS with no policies = service role only)

-- Check cache for existing profiles by LinkedIn URLs
CREATE OR REPLACE FUNCTION public.check_linkedin_cache(p_urls text[])
RETURNS TABLE(
  linkedin_url text,
  full_name text,
  first_name text,
  last_name text,
  headline text,
  summary text,
  current_company text,
  follower_count integer,
  location_text text,
  city text,
  state text,
  country text,
  country_code text,
  experience jsonb,
  education jsonb,
  skills jsonb,
  raw_data jsonb
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
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

COMMENT ON FUNCTION public.check_linkedin_cache IS 'Check if LinkedIn profiles are already cached. Returns matching profiles.';

-- Save/upsert LinkedIn profiles to cache
CREATE OR REPLACE FUNCTION public.save_linkedin_profiles(
  p_profiles jsonb,
  p_search_query text DEFAULT 'manual scrape'
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
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

COMMENT ON FUNCTION public.save_linkedin_profiles IS 'Save/upsert LinkedIn profiles to cache. Max 50 profiles per batch.';
