-- LinkedIn profiles scraped via Apify for external search
-- Service role only access (used by fractional-command CLI)

CREATE TABLE public.linkedin_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Canonical identifier
  linkedin_url text UNIQUE NOT NULL,

  -- Basic info
  full_name text,
  first_name text,
  last_name text,
  headline text,
  summary text,
  current_company text,
  follower_count integer,

  -- Parsed location
  location_text text,
  city text,
  state text,
  country text,
  country_code text,

  -- Complex data as JSONB
  experience jsonb,
  education jsonb,
  skills jsonb,

  -- Raw Apify response for anything we missed
  raw_data jsonb,

  -- Search context
  scraped_at timestamptz DEFAULT now(),
  search_query text,

  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.linkedin_profiles ENABLE ROW LEVEL SECURITY;

-- No policies = service role only access
-- Service role bypasses RLS, so only backend/CLI can access

-- Index for common queries
CREATE INDEX linkedin_profiles_country_code_idx ON public.linkedin_profiles(country_code);
CREATE INDEX linkedin_profiles_current_company_idx ON public.linkedin_profiles(current_company);
CREATE INDEX linkedin_profiles_scraped_at_idx ON public.linkedin_profiles(scraped_at DESC);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.update_linkedin_profiles_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER linkedin_profiles_updated_at
  BEFORE UPDATE ON public.linkedin_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_linkedin_profiles_updated_at();

-- Comment
COMMENT ON TABLE public.linkedin_profiles IS 'LinkedIn profiles scraped via Apify external search. Service role access only.';
