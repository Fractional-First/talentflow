-- Hard dependency on ff-workspace#11 (talentflow#152), which adds
-- `agreement_acceptances.agreement_kind`. Fail loudly at apply time rather than
-- applying green and erroring later on Reza's Clients page: PL/pgSQL bodies are
-- not relation- or column-checked at CREATE time, so without this the mistake
-- would only surface at runtime. The guard is in BOTH files of this pair so a
-- mis-ordered merge lands nothing at all, and the correct order can still be
-- applied afterwards without --include-all.
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

-- Side letters & amendments attached to a signed MSA (agreement_acceptances row).
-- Link-only tracking; admin-authored, mirrors candidate_annotations' RLS shape.
-- Consumed by ff-admin's AgreementSideLetters component (candidate + client drawers).

CREATE TABLE public.agreement_side_letters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agreement_id uuid NOT NULL REFERENCES public.agreement_acceptances(id) ON DELETE CASCADE,
  title text NOT NULL,
  url text NOT NULL,
  created_by uuid NOT NULL DEFAULT auth.uid(),
  created_by_email text DEFAULT (auth.jwt() ->> 'email'),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX agreement_side_letters_agreement_id_created_at_idx
  ON public.agreement_side_letters (agreement_id, created_at DESC);

ALTER TABLE public.agreement_side_letters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "agreement_side_letters_admin_select" ON public.agreement_side_letters
  FOR SELECT TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- WITH CHECK pins authorship to the caller, same as candidate_annotations_admin_insert.
CREATE POLICY "agreement_side_letters_admin_insert" ON public.agreement_side_letters
  FOR INSERT TO authenticated
  WITH CHECK (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    AND created_by = auth.uid()
    AND created_by_email IS NOT DISTINCT FROM (auth.jwt() ->> 'email')
  );
