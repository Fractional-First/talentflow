CREATE OR REPLACE FUNCTION get_candidate_admin(candidate_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result json;
BEGIN
  -- Verify caller is admin
  IF (auth.jwt() -> 'app_metadata' ->> 'role') IS DISTINCT FROM 'admin' THEN
    RAISE EXCEPTION 'Unauthorized: not an admin user';
  END IF;

  SELECT json_build_object(
    'profile', row_to_json(p),
    'fractional_preferences', (SELECT row_to_json(fp) FROM fractional_preferences fp WHERE fp.user_id = p.id),
    'full_time_preferences', (SELECT row_to_json(ftp) FROM full_time_preferences ftp WHERE ftp.user_id = p.id),
    'work_preferences', (SELECT row_to_json(wp) FROM work_preferences wp WHERE wp.user_id = p.id),
    'agreements', (SELECT COALESCE(json_agg(row_to_json(aa)), '[]'::json) FROM agreement_acceptances aa WHERE aa.profile_id = p.id),
    'work_eligibility', (SELECT COALESCE(json_agg(row_to_json(we)), '[]'::json) FROM user_work_eligibility we WHERE we.user_id = p.id),
    'location', (SELECT row_to_json(l) FROM locations l JOIN work_preferences wp ON wp.current_location_id = l.id WHERE wp.user_id = p.id)
  ) INTO result
  FROM profiles p
  WHERE p.id = candidate_id;

  RETURN result;
END;
$$;

GRANT EXECUTE ON FUNCTION get_candidate_admin TO authenticated;
