-- Agreement acceptances table
CREATE TABLE public.agreement_acceptances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,

  -- What they accepted
  agreement_version TEXT NOT NULL,           -- e.g. '2026-01-30-mca-v1'
  accepted_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Digital signature
  signature_name TEXT NOT NULL,              -- Typed full legal name

  -- Contact details captured at signing
  contact_email TEXT NOT NULL,
  mobile_country_code TEXT NOT NULL,
  mobile_number TEXT NOT NULL,

  -- Personal details
  full_legal_name TEXT NOT NULL,
  residential_address JSONB NOT NULL,        -- { addressLine1, addressLine2, city, stateProvince, postalCode, country }

  -- Contracting details
  contracting_type TEXT NOT NULL CHECK (contracting_type IN ('individual', 'entity')),
  entity_name TEXT,                          -- NULL if individual
  entity_registration_number TEXT,           -- NULL if individual
  entity_address JSONB,                      -- NULL if individual; same structure as residential_address
  entity_confirmed BOOLEAN DEFAULT false,

  -- Audit
  user_agent TEXT,                           -- Browser user agent string

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_agreement_acceptances_profile_id ON public.agreement_acceptances(profile_id);
CREATE INDEX idx_agreement_acceptances_version ON public.agreement_acceptances(agreement_version);

-- RLS
ALTER TABLE public.agreement_acceptances ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own acceptances"
  ON public.agreement_acceptances FOR SELECT
  USING (auth.uid() = profile_id);

CREATE POLICY "Users can insert their own acceptances"
  ON public.agreement_acceptances FOR INSERT
  WITH CHECK (auth.uid() = profile_id);

-- No UPDATE or DELETE — acceptances are immutable audit records

-- updated_at trigger
CREATE TRIGGER update_agreement_acceptances_updated_at
  BEFORE UPDATE ON public.agreement_acceptances
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RPC: record_agreement_acceptance
CREATE OR REPLACE FUNCTION public.record_agreement_acceptance(
  p_agreement_version TEXT,
  p_signature_name TEXT,
  p_contact_email TEXT,
  p_mobile_country_code TEXT,
  p_mobile_number TEXT,
  p_full_legal_name TEXT,
  p_residential_address JSONB,
  p_contracting_type TEXT,
  p_entity_name TEXT DEFAULT NULL,
  p_entity_registration_number TEXT DEFAULT NULL,
  p_entity_address JSONB DEFAULT NULL,
  p_entity_confirmed BOOLEAN DEFAULT false,
  p_user_agent TEXT DEFAULT NULL
) RETURNS public.agreement_acceptances AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RPC: get_current_agreement_status
CREATE OR REPLACE FUNCTION public.get_current_agreement_status(
  p_current_version TEXT
) RETURNS TABLE (
  is_accepted BOOLEAN,
  is_current_version BOOLEAN,
  accepted_at TIMESTAMPTZ,
  agreement_version TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    true AS is_accepted,
    (aa.agreement_version = p_current_version) AS is_current_version,
    aa.accepted_at,
    aa.agreement_version
  FROM public.agreement_acceptances aa
  WHERE aa.profile_id = auth.uid()
  ORDER BY aa.accepted_at DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
