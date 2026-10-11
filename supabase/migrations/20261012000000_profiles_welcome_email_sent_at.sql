-- Welcome email (ff-workspace#43): records when the "Welcome to Fractional First"
-- email went out, so it sends once per person and we can see who received it.
--
-- The send-welcome-email edge function claims the send with
--   UPDATE profiles SET welcome_email_sent_at = now()
--   WHERE id = <user> AND welcome_email_sent_at IS NULL
-- before calling Resend, so two concurrent calls can never both send, and clears
-- it again if Resend refuses the email. NULL means "never sent".
--
-- No backfill: existing members stay NULL, and the function only sends to people
-- who verified their email in the last 24 hours, so nobody already signed up is
-- emailed when this ships.

ALTER TABLE public.profiles
  ADD COLUMN welcome_email_sent_at TIMESTAMPTZ;

COMMENT ON COLUMN public.profiles.welcome_email_sent_at IS
  'When the welcome email was sent (send-welcome-email edge function). NULL = never sent.';
