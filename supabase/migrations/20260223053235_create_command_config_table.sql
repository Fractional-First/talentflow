CREATE TABLE IF NOT EXISTS command_config (
  key text PRIMARY KEY,
  value text NOT NULL
);

-- Restrict access: only SECURITY DEFINER functions can read/write this table
REVOKE ALL ON command_config FROM anon, authenticated;
