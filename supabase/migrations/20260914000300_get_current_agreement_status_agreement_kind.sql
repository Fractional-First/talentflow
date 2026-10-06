-- ff-workspace#11 (same root cause, end-user facing) — each portal reads its own agreement.
--
-- `get_current_agreement_status` is called by BOTH portals: talentflow passes the candidate
-- agreement version, ff-client-portal passes the client one. It filtered only on
-- `user_id = auth.uid()` and took the most recent acceptance of any kind, so a person who is
-- both a candidate and a client saw the other portal's agreement: `is_current_version` came back
-- false and they were invited to re-sign something they had already signed. Three users in
-- production hold both kinds.
--
-- The caller already tells us which agreement it means — its own version string — so the kind is
-- derived from `p_current_version`. If that string is not recognised the filter is skipped and
-- the behaviour is exactly what it is today, so an unrecognised new version can never make a
-- signed user look unsigned.
--
-- Signature and return columns unchanged. Consumers: talentflow
-- src/queries/useAgreementAcceptance.ts, ff-client-portal lib/data/get-agreement.ts.

CREATE OR REPLACE FUNCTION public.get_current_agreement_status(p_current_version text)
RETURNS TABLE(
  is_accepted boolean,
  is_current_version boolean,
  accepted_at timestamp with time zone,
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
LANGUAGE plpgsql SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_kind text := public.agreement_kind_for_version(p_current_version);
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
  WHERE aa.user_id = auth.uid()
    -- Defensive on both sides: an unrecognised caller version, or an acceptance whose kind
    -- could not be classified, falls back to today's behaviour rather than reporting a signed
    -- user as unsigned.
    AND (v_kind IS NULL OR aa.agreement_kind IS NULL OR aa.agreement_kind = v_kind)
  ORDER BY aa.accepted_at DESC
  LIMIT 1;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_current_agreement_status(text) TO authenticated;
