-- Admin-authored candidate annotations (notes, comments, transcripts, rate details, links)
-- shown in the ff-admin candidate drawer (ff-workspace#4)
-- Append-only design; consumed by ff-admin via direct .from() under logged-in admin session
-- RLS policies gate access using admin JWT claim

CREATE TABLE public.candidate_annotations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  kind text NOT NULL CHECK (kind IN ('note', 'comment', 'transcript', 'rate', 'link')),
  body text NOT NULL,
  url text,
  created_by uuid NOT NULL DEFAULT auth.uid(),
  created_by_email text DEFAULT (auth.jwt() ->> 'email'),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX candidate_annotations_profile_id_created_at_idx ON public.candidate_annotations (profile_id, created_at DESC);

ALTER TABLE public.candidate_annotations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "candidate_annotations_admin_select" ON public.candidate_annotations
  FOR SELECT TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- WITH CHECK also pins authorship to the caller: the column defaults satisfy it,
-- but a client supplying someone else's created_by/created_by_email is rejected.
CREATE POLICY "candidate_annotations_admin_insert" ON public.candidate_annotations
  FOR INSERT TO authenticated
  WITH CHECK (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    AND created_by = auth.uid()
    AND created_by_email IS NOT DISTINCT FROM (auth.jwt() ->> 'email')
  );
