-- Editing and deleting candidate annotations (ff-workspace#19)
--
-- The table shipped append-only in 20260812090000 (ff-workspace#4): RLS with a
-- SELECT and an INSERT policy and nothing else. An UPDATE or DELETE from the
-- ff-admin client therefore matches zero rows and returns no error, so the edit
-- and delete UI built in ff-workspace#7 is shipped switched off behind
-- ANNOTATION_EDITS_ENABLED until this lands.
--
-- Three parts, all of which are needed for that feature to work:
--   1. the edited_* columns the "(edited)" tag reads
--   2. the UPDATE and DELETE policies, mirroring the existing admin idiom
--   3. a BEFORE UPDATE trigger that STAMPS the edited_* columns — the app never
--      writes them, exactly as it never writes created_by / created_by_email /
--      created_at (those come from column defaults). Without the trigger an edit
--      would succeed and the "(edited)" tag would still never appear.

-- 1. Columns ────────────────────────────────────────────────────────────────
-- Nullable with no default: NULL means "never edited", which is what the UI
-- tests for, and every one of the 17 existing rows is correctly never-edited.
ALTER TABLE public.candidate_annotations
  ADD COLUMN edited_at timestamptz,
  ADD COLUMN edited_by uuid,
  ADD COLUMN edited_by_email text;

-- 2. Policies ───────────────────────────────────────────────────────────────
-- Same admin claim expression as candidate_annotations_admin_select/_insert.
-- Any admin may edit or delete any annotation: notes are team-wide by design
-- (the composer labels them "Visible to all admins") and the SELECT policy
-- already lets every admin read every row.
--
-- Deliberately NOT copied from the INSERT policy: its `created_by = auth.uid()`
-- clause. On insert that pins authorship to the caller; as an UPDATE WITH CHECK
-- it would instead forbid one admin from correcting another admin's note, since
-- created_by stays the original author. Provenance is protected by the trigger
-- below, which restores the created_* columns rather than trusting the client.
CREATE POLICY "candidate_annotations_admin_update" ON public.candidate_annotations
  FOR UPDATE TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "candidate_annotations_admin_delete" ON public.candidate_annotations
  FOR DELETE TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- 3. Stamp trigger ──────────────────────────────────────────────────────────
-- Fires on INSERT as well as UPDATE. On INSERT it forces the edited_* columns
-- back to NULL: the existing admin_insert policy pins created_by/created_by_email
-- to the caller but says nothing about these new columns, so without this an
-- admin posting directly to PostgREST could file a brand-new note already
-- carrying "(edited) 2020-01-01 by someone-else" — fabricated history on a record
-- the team reads as fact. These three columns are the trigger's to write, never
-- the client's, on either operation.
-- Every identifier in the body is qualified as NEW.* or OLD.*, and the function
-- declares no local variables at all, so a bare name can never be ambiguous
-- between a column and a variable (42702 — which only ever bites inside plpgsql,
-- never in plain-SQL rehearsal).
--
-- SECURITY INVOKER (the default): the trigger must see the *caller's* auth
-- claims, and RLS has already decided whether this admin may write the row.
CREATE OR REPLACE FUNCTION public.stamp_candidate_annotation_edit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
BEGIN
  -- A row that has just been created has never been edited, whatever the client
  -- supplied. (OLD is not defined on INSERT, so this returns before the
  -- provenance restore below touches it.)
  IF TG_OP = 'INSERT' THEN
    NEW.edited_at := NULL;
    NEW.edited_by := NULL;
    NEW.edited_by_email := NULL;
    RETURN NEW;
  END IF;

  -- Only a real signed-in caller counts as an edit. A future backfill or repair
  -- migration running as the service role has no auth.uid(), and stamping those
  -- rows would show the team an "(edited) just now" tag on notes no person
  -- touched — invented history on a record they trust. Such a write passes
  -- through unstamped instead.
  IF auth.uid() IS NOT NULL THEN
    NEW.edited_at := pg_catalog.now();
    NEW.edited_by := auth.uid();
    NEW.edited_by_email := auth.jwt() ->> 'email';
  END IF;

  -- Identity and provenance are not the client's to change, and this part is
  -- deliberately NOT inside the branch above: it must hold for every UPDATE,
  -- signed in or not. (For the same reason the trigger has no WHEN clause —
  -- a WHEN that skipped no-op updates would skip this guard with them.)
  -- An UPDATE that tries to move an annotation to another candidate, or to
  -- re-attribute it, silently keeps the original values instead.
  NEW.id := OLD.id;
  NEW.profile_id := OLD.profile_id;
  NEW.created_by := OLD.created_by;
  NEW.created_by_email := OLD.created_by_email;
  NEW.created_at := OLD.created_at;

  RETURN NEW;
END;
$$;

CREATE TRIGGER candidate_annotations_stamp_edit
  BEFORE INSERT OR UPDATE ON public.candidate_annotations
  FOR EACH ROW
  EXECUTE FUNCTION public.stamp_candidate_annotation_edit();
