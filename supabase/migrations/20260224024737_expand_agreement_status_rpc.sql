DROP FUNCTION IF EXISTS public.get_current_agreement_status(text);

CREATE FUNCTION public.get_current_agreement_status(p_current_version text)
RETURNS TABLE(
  is_accepted boolean,
  is_current_version boolean,
  accepted_at timestamptz,
  agreement_version text,
  signature_name text,
  contact_email text,
  mobile_country_code text,
  mobile_number text,
  full_legal_name text,
  residential_address jsonb,
  contracting_type text,
  entity_name text,
  entity_registration_number text,
  entity_address jsonb,
  entity_confirmed boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    true AS is_accepted,
    (aa.agreement_version = p_current_version) AS is_current_version,
    aa.accepted_at,
    aa.agreement_version,
    aa.signature_name,
    aa.contact_email,
    aa.mobile_country_code,
    aa.mobile_number,
    aa.full_legal_name,
    aa.residential_address,
    aa.contracting_type,
    aa.entity_name,
    aa.entity_registration_number,
    aa.entity_address,
    aa.entity_confirmed
  FROM public.agreement_acceptances aa
  WHERE aa.profile_id = auth.uid()
  ORDER BY aa.accepted_at DESC
  LIMIT 1;
END;
$$;
