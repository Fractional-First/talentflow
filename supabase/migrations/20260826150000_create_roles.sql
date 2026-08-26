-- Create roles table: internal tracking of search engagements/openings,
-- each belonging to a client organization. Distinct from job_descriptions,
-- which tracks the public-facing JD content/publish state rather than the
-- engagement lifecycle.

CREATE TABLE public.roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id),
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'searching'
    CHECK (status IN ('on_hold', 'searching', 'active_engagement', 'completed', 'canceled')),
  job_description_id UUID REFERENCES public.job_descriptions(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX roles_organization_id_idx ON public.roles(organization_id);
CREATE INDEX roles_status_idx ON public.roles(status);

CREATE TRIGGER update_roles_updated_at
  BEFORE UPDATE ON public.roles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- RLS enabled with no policies: no direct client-side access. Phase 1 is
-- admin-only, served entirely through SECURITY DEFINER RPCs (see
-- 20260826150100_roles_admin_rpcs.sql) that check for the admin role.
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
