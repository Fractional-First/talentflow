CREATE OR REPLACE FUNCTION validate_command_key(p_api_key text)
RETURNS boolean AS $$
BEGIN
  -- NULL or empty key is always invalid
  IF p_api_key IS NULL OR p_api_key = '' THEN
    RETURN false;
  END IF;

  RETURN EXISTS (
    SELECT 1 FROM command_config
    WHERE key = 'api_key_hash'
    AND value = crypt(p_api_key, value)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
