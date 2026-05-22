-- Migration: Update agreement RPCs to use user_id
-- Non-breaking — same function signatures, same return types.
--
-- Why: The client portal introduces users who have no `profiles` row.
-- The existing RPCs use profile_id (FK → profiles.id) for both writes and filters.
-- After this migration:
--   - record_agreement_acceptance: writes user_id = auth.uid() always;
--     profile_id is written only when a profiles row exists (NULL for client portal users)
--   - get_current_agreement_status: filters by user_id = auth.uid() (works for both portals)
--   - profile_id becomes nullable (FK still valid — NULL values skip constraint check)
--
-- Talentflow users: identical results (user_id == profile_id == auth.uid() for them)
-- Client portal users: can now INSERT and SELECT from agreement_acceptances

-- ============================================================
-- 1. Make profile_id nullable
-- ============================================================
-- Client portal users have no profiles row — allow NULL profile_id.
-- FK constraint (→ profiles.id) is still enforced for non-NULL values.
ALTER TABLE public.agreement_acceptances
  ALTER COLUMN profile_id DROP NOT NULL;

-- ============================================================
-- 2. record_agreement_acceptance (without ip_address)
-- ============================================================
CREATE OR REPLACE FUNCTION "public"."record_agreement_acceptance"(
  "p_agreement_version" "text",
  "p_signature_name" "text",
  "p_contact_email" "text",
  "p_mobile_country_code" "text",
  "p_mobile_number" "text",
  "p_full_legal_name" "text",
  "p_residential_address" "jsonb",
  "p_contracting_type" "text",
  "p_entity_name" "text" DEFAULT NULL::"text",
  "p_entity_registration_number" "text" DEFAULT NULL::"text",
  "p_entity_address" "jsonb" DEFAULT NULL::"jsonb",
  "p_entity_confirmed" boolean DEFAULT false,
  "p_user_agent" "text" DEFAULT NULL::"text"
) RETURNS "public"."agreement_acceptances"
  LANGUAGE "plpgsql" SECURITY DEFINER
  AS $$
DECLARE
  v_result public.agreement_acceptances;
  v_profile_id UUID;
BEGIN
  -- Write profile_id only if a profiles row exists (talentflow users).
  -- Client portal users have no profiles row — profile_id stays NULL.
  SELECT id INTO v_profile_id FROM public.profiles WHERE id = auth.uid();

  INSERT INTO public.agreement_acceptances (
    profile_id, user_id, agreement_version, signature_name,
    contact_email, mobile_country_code, mobile_number,
    full_legal_name, residential_address,
    contracting_type, entity_name, entity_registration_number,
    entity_address, entity_confirmed, user_agent
  ) VALUES (
    v_profile_id, auth.uid(), p_agreement_version, p_signature_name,
    p_contact_email, p_mobile_country_code, p_mobile_number,
    p_full_legal_name, p_residential_address,
    p_contracting_type, p_entity_name, p_entity_registration_number,
    p_entity_address, p_entity_confirmed, p_user_agent
  )
  RETURNING * INTO v_result;

  RETURN v_result;
END;
$$;

-- ============================================================
-- 3. record_agreement_acceptance (with ip_address — primary overload)
-- ============================================================
CREATE OR REPLACE FUNCTION "public"."record_agreement_acceptance"(
  "p_agreement_version" "text",
  "p_signature_name" "text",
  "p_contact_email" "text",
  "p_mobile_country_code" "text",
  "p_mobile_number" "text",
  "p_full_legal_name" "text",
  "p_residential_address" "jsonb",
  "p_contracting_type" "text",
  "p_entity_name" "text" DEFAULT NULL::"text",
  "p_entity_registration_number" "text" DEFAULT NULL::"text",
  "p_entity_address" "jsonb" DEFAULT NULL::"jsonb",
  "p_entity_confirmed" boolean DEFAULT false,
  "p_user_agent" "text" DEFAULT NULL::"text",
  "p_ip_address" "text" DEFAULT NULL::"text"
) RETURNS "public"."agreement_acceptances"
  LANGUAGE "plpgsql" SECURITY DEFINER
  AS $$
DECLARE
  v_result public.agreement_acceptances;
  v_profile_id UUID;
BEGIN
  -- Write profile_id only if a profiles row exists (talentflow users).
  -- Client portal users have no profiles row — profile_id stays NULL.
  SELECT id INTO v_profile_id FROM public.profiles WHERE id = auth.uid();

  INSERT INTO public.agreement_acceptances (
    profile_id, user_id, agreement_version, signature_name,
    contact_email, mobile_country_code, mobile_number,
    full_legal_name, residential_address,
    contracting_type, entity_name, entity_registration_number,
    entity_address, entity_confirmed, user_agent, ip_address
  ) VALUES (
    v_profile_id, auth.uid(), p_agreement_version, p_signature_name,
    p_contact_email, p_mobile_country_code, p_mobile_number,
    p_full_legal_name, p_residential_address,
    p_contracting_type, p_entity_name, p_entity_registration_number,
    p_entity_address, p_entity_confirmed, p_user_agent, p_ip_address
  )
  RETURNING * INTO v_result;

  RETURN v_result;
END;
$$;

-- ============================================================
-- 4. get_current_agreement_status
-- ============================================================
-- Filter by user_id = auth.uid() instead of profile_id = auth.uid().
-- For talentflow users: user_id == profile_id == auth.uid(), result is identical.
-- For client portal users: user_id = auth.uid() finds their MSA rows directly.
CREATE OR REPLACE FUNCTION "public"."get_current_agreement_status"("p_current_version" "text")
  RETURNS TABLE(
    "is_accepted" boolean,
    "is_current_version" boolean,
    "accepted_at" timestamp with time zone,
    "agreement_version" "text",
    "signature_name" "text",
    "contact_email" "text",
    "mobile_country_code" "text",
    "mobile_number" "text",
    "full_legal_name" "text",
    "residential_address" "jsonb",
    "contracting_type" "text",
    "entity_name" "text",
    "entity_registration_number" "text",
    "entity_address" "jsonb",
    "entity_confirmed" boolean
  )
  LANGUAGE "plpgsql" SECURITY DEFINER
  SET "search_path" TO 'public'
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
  WHERE aa.user_id = auth.uid()
  ORDER BY aa.accepted_at DESC
  LIMIT 1;
END;
$$;
