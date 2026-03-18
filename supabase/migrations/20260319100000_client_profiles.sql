-- Create client_profiles table for the client portal
-- Separate from candidate profiles table — different data shape entirely
-- RLS: users can only view/edit their own profile row

CREATE TABLE public.client_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id),

  -- Company data (View 2a — from scraper or manual entry)
  company_url TEXT,                    -- NULL if "My company doesn't have a URL"
  metadata JSONB DEFAULT '{}',         -- {name, logo, size, industry, description, stage}

  -- User data (View 2b)
  user_name TEXT,
  user_designation TEXT,
  mobile_number TEXT,

  -- Company profile extras (View 5)
  social_links JSONB DEFAULT '{}',     -- {linkedin, website, etc.}
  company_location TEXT,

  -- Status
  is_onboarded BOOLEAN DEFAULT false,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS: users can only see/edit their own profile
ALTER TABLE public.client_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own client profile"
  ON public.client_profiles FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own client profile"
  ON public.client_profiles FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own client profile"
  ON public.client_profiles FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Auto-update updated_at on row changes (same pattern as other FF tables)
CREATE TRIGGER update_client_profiles_updated_at
  BEFORE UPDATE ON public.client_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
