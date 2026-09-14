CREATE TABLE public.rdg_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text,
  designation text,
  email text NOT NULL,
  mobile text,
  city text,
  contact_opt_in boolean NOT NULL DEFAULT false,
  contact_message text,
  jd_text text NOT NULL,
  jd_inputs jsonb NOT NULL,
  hide_ff_branding boolean NOT NULL DEFAULT false,
  ip_address text,
  user_agent text,
  referrer text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_rdg_leads_email ON public.rdg_leads(email);
CREATE INDEX idx_rdg_leads_created_at ON public.rdg_leads(created_at DESC);

ALTER TABLE public.rdg_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "rdg_leads_admin_select" ON public.rdg_leads
  FOR SELECT TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE OR REPLACE FUNCTION public.submit_rdg_lead(p_lead jsonb)
RETURNS json
LANGUAGE plpgsql SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  new_id uuid;
BEGIN
  IF (p_lead ->> 'first_name') IS NULL OR (p_lead ->> 'email') IS NULL OR (p_lead ->> 'jd_text') IS NULL THEN
    RAISE EXCEPTION 'Missing required fields';
  END IF;

  INSERT INTO public.rdg_leads (
    first_name, last_name, designation, email, mobile, city,
    contact_opt_in, contact_message,
    jd_text, jd_inputs, hide_ff_branding,
    ip_address, user_agent, referrer
  ) VALUES (
    p_lead ->> 'first_name',
    p_lead ->> 'last_name',
    p_lead ->> 'designation',
    p_lead ->> 'email',
    p_lead ->> 'mobile',
    p_lead ->> 'city',
    coalesce((p_lead ->> 'contact_opt_in')::boolean, false),
    p_lead ->> 'contact_message',
    p_lead ->> 'jd_text',
    coalesce((p_lead -> 'jd_inputs')::jsonb, '{}'::jsonb),
    coalesce((p_lead ->> 'hide_ff_branding')::boolean, false),
    p_lead ->> 'ip_address',
    p_lead ->> 'user_agent',
    p_lead ->> 'referrer'
  ) RETURNING id INTO new_id;

  RETURN json_build_object('lead_id', new_id);
END;
$$;

GRANT EXECUTE ON FUNCTION public.submit_rdg_lead(jsonb) TO anon, authenticated;
