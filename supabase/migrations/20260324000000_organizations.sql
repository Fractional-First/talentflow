-- Create organizations table for the client portal
-- Stores company/entity data. One row per company.
-- Multiple users can belong to the same organization (future multi-user support).
-- Company data is separated from user data (client_profiles) to support
-- multiple users per company in future phases.

CREATE TABLE public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Company data (View 2a — from scraper or manual entry)
  company_url TEXT,                    -- NULL if "My company doesn't have a URL"
  metadata JSONB DEFAULT '{}',         -- {name, logo, size, industry, description, stage}

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Auto-update updated_at on row changes (same pattern as other FF tables)
CREATE TRIGGER update_organizations_updated_at
  BEFORE UPDATE ON public.organizations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS (policies that reference client_profiles are in the next migration)
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

-- INSERT is allowed for any authenticated user (they link themselves during onboarding)
CREATE POLICY "Authenticated users can create organizations"
  ON public.organizations FOR INSERT
  WITH CHECK (true);
