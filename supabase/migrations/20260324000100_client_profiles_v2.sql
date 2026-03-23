-- Create client_profiles table for the client portal (v2 schema)
-- Replaces the old single-table design where company data lived on client_profiles.
-- Now: company data → organizations table (via organization_id FK)
--      user data → this table
-- Separate from candidate profiles table — different data shape entirely.
-- RLS: users can only view/edit their own profile row.

CREATE TABLE public.client_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id),
  organization_id UUID REFERENCES public.organizations(id),  -- NULL until company onboarding step

  -- User data (View 2b)
  user_name TEXT,
  user_designation TEXT,
  company_email TEXT,                  -- Optional work email (may differ from login email)
  mobile_number TEXT,
  user_location TEXT,                  -- City of residence (Google Places API) — NOT company HQ

  -- Company profile extras (View 5)
  social_links JSONB DEFAULT '{}',     -- {linkedin, website, etc.}

  -- Status
  is_onboarded BOOLEAN DEFAULT false,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Auto-update updated_at on row changes (same pattern as other FF tables)
CREATE TRIGGER update_client_profiles_updated_at
  BEFORE UPDATE ON public.client_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

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
