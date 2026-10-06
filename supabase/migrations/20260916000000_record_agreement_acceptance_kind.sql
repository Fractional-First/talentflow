-- ff-workspace#29 — let the signing portal declare which agreement it is.
--
-- `agreement_acceptances.agreement_kind` (added by talentflow#152 / ff-workspace#11) is inferred
-- from the version string by the `set_agreement_kind` trigger. That inference is a fallback, not
-- a source of truth: it goes stale the moment an agreement is renamed, and it cannot tell the two
-- kinds apart at all if the two documents ever converge on similar names. The portal that is
-- doing the signing knows the answer for certain, so let it say so.
--
-- Both portals sign through the same edge function, `record-agreement-acceptance`, which spreads
-- the request body into the RPC call unfiltered. A new `p_agreement_kind` field sent by either
-- portal therefore reaches this function with no edge-function redeploy.
--
-- WHY ONE FUNCTION, NOT THREE — this is the whole reason the file is shaped this way.
-- `record_agreement_acceptance` exists in production as TWO overloads (20260319130000): 13 params,
-- and the same 13 plus `p_ip_address`. PostgREST resolves by argument NAME, and overload A's names
-- are a strict subset of B's, so a call that omits `p_ip_address` already matches both and raises
-- PGRST203. (A is effectively unreachable today only because the edge function always supplies an
-- IP.) `CREATE OR REPLACE` with a longer parameter list does not replace B — it creates a THIRD
-- function C. Every call supplying `p_ip_address` but not `p_agreement_kind` would then match B and
-- C: PGRST203, signing 400s in both portals, including every stale browser bundle still in flight
-- mid-rollout. That is a live outage on the legal-signature path, not a latent bug. So: drop both
-- overloads by their full explicit argument types, create exactly one replacement. One candidate
-- means PostgREST can never be ambiguous here again. The guard at the bottom of this file asserts
-- that outcome rather than trusting it.
--
-- MERGE ORDER is load-bearing: talentflow#152 → this migration (merged AND applied) → the two app
-- PRs that start sending `p_agreement_kind`. The apps cannot fail safe — a portal sending an
-- argument name the function does not accept matches no candidate and signing fails outright. The
-- DO $guard$ below protects the database against a mis-ordered merge; nothing protects the apps
-- except the order.

-- Hard dependency on ff-workspace#11 (talentflow#152), which adds
-- `agreement_acceptances.agreement_kind`. Fail loudly at apply time rather than applying green and
-- erroring later on the signing path: PL/pgSQL bodies are not column-checked at CREATE time, so
-- without this the mistake would only surface when the next person tried to sign — and it would
-- surface having already dropped both working overloads.
DO $guard$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'agreement_acceptances'
      AND column_name  = 'agreement_kind'
  ) THEN
    RAISE EXCEPTION
      'agreement_acceptances.agreement_kind is missing - merge talentflow#152 (ff-workspace#11) and let its migrations apply before this PR';
  END IF;
END
$guard$;

-- Both overloads, each by its full explicit argument-type list. Never the bare name: a bare
-- `DROP FUNCTION public.record_agreement_acceptance` errors on an overloaded name, and dropping
-- only one of the two would leave exactly the ambiguity this file exists to remove.
-- Types, not argument names, on purpose — `IF EXISTS` would silently no-op on a name mismatch,
-- and a silent no-op here is the PGRST203 outage described above.
DROP FUNCTION IF EXISTS public.record_agreement_acceptance(
  text, text, text, text, text, text, jsonb, text, text, text, jsonb, boolean, text
);

DROP FUNCTION IF EXISTS public.record_agreement_acceptance(
  text, text, text, text, text, text, jsonb, text, text, text, jsonb, boolean, text, text
);

-- The single replacement: the 14 parameters of the surviving overload, plus `p_agreement_kind`
-- last with a NULL default so that callers which have not been updated yet keep working unchanged.
-- Body is the previous definition verbatim apart from the new column.
--
-- `SET search_path TO 'public'` is new. Both originals were SECURITY DEFINER without it (confirmed
-- against production: `proconfig IS NULL` on both), which is the standing Supabase linter warning
-- — a definer function resolving unqualified names through the caller's search_path. Every
-- reference in this body is already schema-qualified, so pinning it changes no behaviour; it just
-- stops the hole being reintroduced the next time someone edits the body.
CREATE FUNCTION public.record_agreement_acceptance(
  p_agreement_version text,
  p_signature_name text,
  p_contact_email text,
  p_mobile_country_code text,
  p_mobile_number text,
  p_full_legal_name text,
  p_residential_address jsonb,
  p_contracting_type text,
  p_entity_name text DEFAULT NULL::text,
  p_entity_registration_number text DEFAULT NULL::text,
  p_entity_address jsonb DEFAULT NULL::jsonb,
  p_entity_confirmed boolean DEFAULT false,
  p_user_agent text DEFAULT NULL::text,
  p_ip_address text DEFAULT NULL::text,
  p_agreement_kind text DEFAULT NULL::text
) RETURNS public.agreement_acceptances
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO 'public'
  AS $$
DECLARE
  v_result public.agreement_acceptances;
  v_profile_id uuid;
BEGIN
  -- Write profile_id only if a profiles row exists (talentflow users).
  -- Client portal users have no profiles row — profile_id stays NULL.
  SELECT id INTO v_profile_id FROM public.profiles WHERE id = auth.uid();

  INSERT INTO public.agreement_acceptances (
    profile_id, user_id, agreement_version, signature_name,
    contact_email, mobile_country_code, mobile_number,
    full_legal_name, residential_address,
    contracting_type, entity_name, entity_registration_number,
    entity_address, entity_confirmed, user_agent, ip_address,
    agreement_kind
  ) VALUES (
    v_profile_id, auth.uid(), p_agreement_version, p_signature_name,
    p_contact_email, p_mobile_country_code, p_mobile_number,
    p_full_legal_name, p_residential_address,
    p_contracting_type, p_entity_name, p_entity_registration_number,
    p_entity_address, p_entity_confirmed, p_user_agent, p_ip_address,
    -- Sanitised, not passed through. The edge function forwards a caller-controlled request body,
    -- and the column carries CHECK (agreement_kind IN ('talent','client')), so an unrecognised
    -- value would abort this INSERT and BLOCK SIGNING — a legal-signature outage caused by a typo
    -- in a client. Anything that is not one of the two accepted values becomes NULL instead, and a
    -- NULL hands the row to #152's `set_agreement_kind` trigger, which infers the kind from
    -- `agreement_version` exactly as it does today. Worst case is the behaviour we already have.
    -- (That trigger only recomputes when the incoming kind IS NULL, so a valid declared value
    -- passed here wins over the inference, which is the point of this change.)
    CASE WHEN p_agreement_kind IN ('talent', 'client') THEN p_agreement_kind END
  )
  RETURNING * INTO v_result;

  RETURN v_result;
END;
$$;

COMMENT ON FUNCTION public.record_agreement_acceptance(
  text, text, text, text, text, text, jsonb, text, text, text, jsonb, boolean, text, text, text
) IS
  'Records an agreement acceptance. p_agreement_kind lets the signing portal declare ''talent'' or ''client'' explicitly; any other value (including a caller-supplied junk string) is stored as NULL and left to the set_agreement_kind trigger to infer. The single overload is deliberate — see 20260916000000.';

-- DROP removes grants with the function, and the signing path calls this through PostgREST, so
-- without these it 403s for everyone. Same three roles the dropped overloads held
-- (00000000000000_baseline.sql:2386-2394), same GRANT ALL idiom.
GRANT ALL ON FUNCTION public.record_agreement_acceptance(
  text, text, text, text, text, text, jsonb, text, text, text, jsonb, boolean, text, text, text
) TO anon;

GRANT ALL ON FUNCTION public.record_agreement_acceptance(
  text, text, text, text, text, text, jsonb, text, text, text, jsonb, boolean, text, text, text
) TO authenticated;

GRANT ALL ON FUNCTION public.record_agreement_acceptance(
  text, text, text, text, text, text, jsonb, text, text, text, jsonb, boolean, text, text, text
) TO service_role;

-- Assert the single-candidate outcome rather than assuming it. If a future migration (or a
-- hand-run CREATE on production) has left another overload behind, PostgREST would resolve calls
-- ambiguously and signing would 400 in both portals — better to fail the apply here, loudly, while
-- the previous definitions are still recoverable from git.
DO $verify$
DECLARE
  v_count int;
BEGIN
  SELECT count(*) INTO v_count
  FROM pg_proc p
  JOIN pg_namespace n ON n.oid = p.pronamespace
  WHERE n.nspname = 'public'
    AND p.proname = 'record_agreement_acceptance';

  IF v_count <> 1 THEN
    RAISE EXCEPTION
      'expected exactly 1 public.record_agreement_acceptance after this migration, found % - overload ambiguity would break signing (PGRST203)', v_count;
  END IF;
END
$verify$;
