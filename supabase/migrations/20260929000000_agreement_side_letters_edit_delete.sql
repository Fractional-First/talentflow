-- Editing and deleting side letters & amendments, mirroring
-- 20260918000400_candidate_annotations_edit_delete.sql's shape exactly.
--
-- agreement_side_letters shipped append-only in 20260918000000: RLS with a
-- SELECT and an INSERT policy and nothing else. An UPDATE or DELETE from the
-- ff-admin client would therefore match zero rows and return no error, so the
-- edit/delete UI being added to AgreementSideLetters ships switched off until
-- this lands, same caution as candidate_annotations' ANNOTATION_EDITS_ENABLED.
--
-- Three parts, all needed for that feature to work:
--   1. the edited_* columns an "(edited)" tag would read
--   2. the UPDATE and DELETE policies, mirroring the existing admin idiom
--   3. a BEFORE INSERT OR UPDATE trigger that stamps edited_* and restores
--      provenance — the app never writes these columns directly, exactly as
--      it never writes created_by / created_by_email / created_at.

-- 1. Columns ────────────────────────────────────────────────────────────────
-- Nullable with no default: NULL means "never edited", and every existing row
-- is correctly never-edited.
ALTER TABLE public.agreement_side_letters
  ADD COLUMN edited_at timestamptz,
  ADD COLUMN edited_by uuid,
  ADD COLUMN edited_by_email text;

-- 2. Policies ───────────────────────────────────────────────────────────────
-- Same admin claim expression as agreement_side_letters_admin_select/_insert.
-- Any admin may edit or delete any side letter — same team-wide-by-design
-- reasoning as candidate_annotations, and the SELECT policy already lets
-- every admin read every row.
--
-- Deliberately NOT copied from the INSERT policy: its `created_by = auth.uid()`
-- clause. On insert that pins authorship to the caller; as an UPDATE WITH CHECK
-- it would instead forbid one admin from correcting another admin's entry.
-- Provenance is protected by the trigger below, which restores the created_*
-- columns rather than trusting the client.
CREATE POLICY "agreement_side_letters_admin_update" ON public.agreement_side_letters
  FOR UPDATE TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "agreement_side_letters_admin_delete" ON public.agreement_side_letters
  FOR DELETE TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- 3. Stamp trigger ──────────────────────────────────────────────────────────
-- Fires on INSERT as well as UPDATE, for the same reason as
-- stamp_candidate_annotation_edit: on INSERT it forces edited_* back to NULL
-- so a direct PostgREST insert can't fabricate "(edited) ... by someone-else"
-- history on a brand-new row.
--
-- SECURITY INVOKER (the default): the trigger must see the *caller's* auth
-- claims, and RLS has already decided whether this admin may write the row.
CREATE OR REPLACE FUNCTION public.stamp_agreement_side_letter_edit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    NEW.edited_at := NULL;
    NEW.edited_by := NULL;
    NEW.edited_by_email := NULL;
    RETURN NEW;
  END IF;

  -- Only a real signed-in caller counts as an edit — a service-role backfill
  -- has no auth.uid(), and stamping those rows would show the team an
  -- "(edited) just now" tag no person actually caused.
  IF auth.uid() IS NOT NULL THEN
    NEW.edited_at := pg_catalog.now();
    NEW.edited_by := auth.uid();
    NEW.edited_by_email := auth.jwt() ->> 'email';
  END IF;

  -- Identity and provenance are not the client's to change, on every UPDATE,
  -- signed in or not — deliberately outside the branch above.
  NEW.id := OLD.id;
  NEW.agreement_id := OLD.agreement_id;
  NEW.created_by := OLD.created_by;
  NEW.created_by_email := OLD.created_by_email;
  NEW.created_at := OLD.created_at;

  RETURN NEW;
END;
$$;

CREATE TRIGGER agreement_side_letters_stamp_edit
  BEFORE INSERT OR UPDATE ON public.agreement_side_letters
  FOR EACH ROW
  EXECUTE FUNCTION public.stamp_agreement_side_letter_edit();
