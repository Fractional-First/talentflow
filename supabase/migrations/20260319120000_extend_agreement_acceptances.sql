-- Migration: Extend agreement_acceptances with user_id column
-- Allows both candidate portal (via profile_id) and client portal (via user_id)
-- to use the same table for MSA signing.

-- Add user_id column (nullable first for backfill)
ALTER TABLE public.agreement_acceptances
  ADD COLUMN user_id UUID REFERENCES auth.users(id);

-- Backfill from profile_id (talentflow: profiles.id == auth.users.id)
UPDATE public.agreement_acceptances
  SET user_id = profile_id;

-- Make user_id NOT NULL after backfill
ALTER TABLE public.agreement_acceptances
  ALTER COLUMN user_id SET NOT NULL;

-- Index for fast lookup by user_id
CREATE INDEX idx_agreement_acceptances_user_id
  ON public.agreement_acceptances(user_id);

-- New RLS policies using user_id (works for both candidate and client portal users)
CREATE POLICY "Users can view own acceptances via user_id"
  ON public.agreement_acceptances FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own acceptances via user_id"
  ON public.agreement_acceptances FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Note: Existing profile_id policies remain for backwards compatibility:
--   "Users can view their own acceptances"  (USING profile_id = auth.uid())
--   "Users can insert their own acceptances" (WITH CHECK profile_id = auth.uid())
-- These remain unchanged so existing talentflow callers continue to work.
