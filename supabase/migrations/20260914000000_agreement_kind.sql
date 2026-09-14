-- ff-workspace#11 — tell the talent agreement and the client agreement apart.
--
-- Both the candidate MSA (signed on app.fractionalfirst.com) and the client MSA (signed on
-- clients.fractionalfirst.com) write to public.agreement_acceptances, and nothing on the table
-- distinguishes them. `profile_id` does not: it equals `user_id` on every row in production.
-- Consumers therefore read "the user's most recent acceptance of any kind", so a person who is
-- both a candidate and a client gets whichever agreement they signed last.
--
-- This adds the discriminator. The only evidence that exists on historical rows is
-- `agreement_version`, and it separates cleanly — each string below was matched against the
-- constant in the app that wrote it:
--   client  ← ff-client-portal  lib/constants/msa.ts        CURRENT_CLIENT_AGREEMENT_VERSION
--             'Master Services Agreement (01.04.2026) PDF'  and its predecessor 'v1.0'
--             (renamed in ff-client-portal commit 511f8f2)
--   talent  ← talentflow  src/queries/useAgreementAcceptance.ts  CURRENT_AGREEMENT_VERSION
--             'Master Candidate Agreement (13.02.2026) PDF', plus the historical
--             '2026-01-30-mca-v1' and '2025-01-01-old'
--
-- Measured on production before writing this migration: 103 acceptances over 100 users —
-- 93 talent, 10 client, 0 that the mapping below cannot classify. 3 users hold both kinds.
--
-- MAINTENANCE: when a new agreement version string ships, make sure it still matches one of the
-- patterns below (the recurring case — a new PDF date — does, because the document name is kept).
-- A string that matches neither is left NULL on purpose: consumers render NULL as a neutral
-- "not signed" state, which is a safe blank rather than a confidently wrong value.

CREATE OR REPLACE FUNCTION public.agreement_kind_for_version(p_version text)
RETURNS text
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT CASE
    WHEN p_version IS NULL                            THEN NULL
    WHEN p_version ILIKE '%Services Agreement%'       THEN 'client'
    WHEN p_version = 'v1.0'                           THEN 'client'
    WHEN p_version ILIKE '%Candidate Agreement%'      THEN 'talent'
    WHEN p_version ILIKE '%mca%'                      THEN 'talent'
    WHEN p_version = '2025-01-01-old'                 THEN 'talent'
    ELSE NULL
  END;
$$;

COMMENT ON FUNCTION public.agreement_kind_for_version(text) IS
  'Maps an agreement_version string to ''talent'' or ''client''. NULL when the string is not recognised.';

ALTER TABLE public.agreement_acceptances
  ADD COLUMN IF NOT EXISTS agreement_kind text;

COMMENT ON COLUMN public.agreement_acceptances.agreement_kind IS
  'Which agreement this acceptance is: ''talent'' (candidate MSA) or ''client'' (client MSA). NULL when the version string is unrecognised.';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'public.agreement_acceptances'::regclass
      AND conname = 'agreement_acceptances_agreement_kind_check'
  ) THEN
    ALTER TABLE public.agreement_acceptances
      ADD CONSTRAINT agreement_acceptances_agreement_kind_check
      CHECK (agreement_kind IN ('talent', 'client'));
  END IF;
END;
$$;

-- Backfill. Rollback: `UPDATE public.agreement_acceptances SET agreement_kind = NULL;` restores
-- the pre-migration state exactly — no other column is touched and no row is added or removed.
UPDATE public.agreement_acceptances
SET agreement_kind = public.agreement_kind_for_version(agreement_version)
WHERE agreement_kind IS NULL;

DO $$
DECLARE
  v_talent int;
  v_client int;
  v_null   int;
BEGIN
  SELECT count(*) FILTER (WHERE agreement_kind = 'talent'),
         count(*) FILTER (WHERE agreement_kind = 'client'),
         count(*) FILTER (WHERE agreement_kind IS NULL)
    INTO v_talent, v_client, v_null
    FROM public.agreement_acceptances;
  RAISE NOTICE 'agreement_kind backfill: talent=%, client=%, unclassified=%', v_talent, v_client, v_null;
  IF v_null > 0 THEN
    RAISE WARNING 'agreement_kind: % acceptance(s) could not be classified from agreement_version; they will render as "not signed" until agreement_kind_for_version is extended.', v_null;
  END IF;
END;
$$;

-- Keep new rows labelled without changing the RPC signatures the two portals call. The client
-- portal reaches record_agreement_acceptance through an edge function, so a new parameter would
-- need a redeploy of that function; a trigger covers every insert path instead.
CREATE OR REPLACE FUNCTION public.set_agreement_kind()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  -- Recompute on insert, and whenever the version string actually changes — a row corrected from
  -- one agreement to the other must not keep the old kind, which the CHECK constraint would not
  -- catch. An explicitly supplied kind on an insert is respected.
  IF NEW.agreement_kind IS NULL
     OR (TG_OP = 'UPDATE' AND NEW.agreement_version IS DISTINCT FROM OLD.agreement_version) THEN
    NEW.agreement_kind := public.agreement_kind_for_version(NEW.agreement_version);
  END IF;
  -- Deliberately a warning, not an exception: the column stays nullable so that an unrecognised
  -- version string can never stop someone signing. The cost is that such an acceptance reads as
  -- "not signed" on the admin surfaces until agreement_kind_for_version is extended — a visible
  -- gap in a report, rather than a failure on the signing path.
  IF NEW.agreement_kind IS NULL THEN
    RAISE WARNING 'agreement_kind: unrecognised agreement_version %; extend public.agreement_kind_for_version', NEW.agreement_version;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_agreement_kind ON public.agreement_acceptances;
CREATE TRIGGER set_agreement_kind
BEFORE INSERT OR UPDATE OF agreement_version ON public.agreement_acceptances
FOR EACH ROW EXECUTE FUNCTION public.set_agreement_kind();

-- Supports the "latest acceptance of this kind for this user/profile" lookups the admin RPCs do.
CREATE INDEX IF NOT EXISTS agreement_acceptances_user_kind_idx
  ON public.agreement_acceptances (user_id, agreement_kind, accepted_at DESC);

CREATE INDEX IF NOT EXISTS agreement_acceptances_profile_kind_idx
  ON public.agreement_acceptances (profile_id, agreement_kind, accepted_at DESC);
