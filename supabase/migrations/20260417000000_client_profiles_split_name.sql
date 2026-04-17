-- Add first_name / last_name to client_profiles, backfill from existing user_name.
-- user_name is kept (writable) for backwards compatibility with any existing
-- consumers (ff-admin, talentflow). Once all consumers read first/last directly,
-- a follow-up migration can drop or generate user_name.

ALTER TABLE public.client_profiles
  ADD COLUMN first_name TEXT,
  ADD COLUMN last_name  TEXT;

-- Backfill: take first whitespace-delimited token as first_name, the rest as last_name.
-- NULLIF(..., '') ensures single-name rows get NULL last_name rather than empty string.
UPDATE public.client_profiles
SET
  first_name = NULLIF(split_part(trim(user_name), ' ', 1), ''),
  last_name  = NULLIF(regexp_replace(trim(user_name), '^\S+\s*', ''), '')
WHERE user_name IS NOT NULL;
