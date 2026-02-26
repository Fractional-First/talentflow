-- Add ip_address column for audit trail
ALTER TABLE public.agreement_acceptances ADD COLUMN ip_address TEXT;

-- Update RPC to accept ip_address parameter
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
  p_user_agent TEXT DEFAULT NULL,
  p_ip_address TEXT DEFAULT NULL
) RETURNS public.agreement_acceptances AS $$
DECLARE
  v_result public.agreement_acceptances;
BEGIN
  INSERT INTO public.agreement_acceptances (
    profile_id, agreement_version, signature_name,
    contact_email, mobile_country_code, mobile_number,
    full_legal_name, residential_address,
    contracting_type, entity_name, entity_registration_number,
    entity_address, entity_confirmed, user_agent, ip_address
  ) VALUES (
    auth.uid(), p_agreement_version, p_signature_name,
    p_contact_email, p_mobile_country_code, p_mobile_number,
    p_full_legal_name, p_residential_address,
    p_contracting_type, p_entity_name, p_entity_registration_number,
    p_entity_address, p_entity_confirmed, p_user_agent, p_ip_address
  )
  RETURNING * INTO v_result;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
