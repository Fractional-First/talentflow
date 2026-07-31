-- Store anonymous profile contact inquiries for audit and abuse controls.
-- Edge Functions write with the service role; browser clients get no direct access.

CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  company text,
  message text,
  candidate_name text,
  profile_url text,
  source text NOT NULL DEFAULT 'anonymous_profile_cta',
  ip_address text,
  user_agent text,
  referrer text,
  status text NOT NULL DEFAULT 'received'
    CHECK (status IN ('received', 'sent', 'rate_limited', 'failed')),
  resend_id text,
  error text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS contact_submissions_created_at_idx
  ON public.contact_submissions (created_at DESC);

CREATE INDEX IF NOT EXISTS contact_submissions_email_created_at_idx
  ON public.contact_submissions (email, created_at DESC);

CREATE INDEX IF NOT EXISTS contact_submissions_ip_created_at_idx
  ON public.contact_submissions (ip_address, created_at DESC)
  WHERE ip_address IS NOT NULL;

ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "contact_submissions_service_role_all"
  ON public.contact_submissions
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
