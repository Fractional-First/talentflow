-- Add profile_slug and anon_slug to get_candidate_admin return
-- Needed by ff-admin to build correct profile URLs

DROP FUNCTION IF EXISTS public.get_candidate_admin(uuid);

CREATE FUNCTION public.get_candidate_admin(candidate_id uuid)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  result json;
BEGIN
  IF (auth.jwt() -> 'app_metadata' ->> 'role') IS DISTINCT FROM 'admin' THEN
    RAISE EXCEPTION 'Unauthorized: not an admin user';
  END IF;

  SELECT json_build_object(
    'profile', json_build_object(
      'id', p.id,
      'email', p.email,
      'first_name', COALESCE(NULLIF(p.first_name, ''), NULLIF(u.raw_user_meta_data->>'first_name', ''), SPLIT_PART(NULLIF(u.raw_user_meta_data->>'name', ''), ' ', 1)),
      'last_name', COALESCE(NULLIF(p.last_name, ''), NULLIF(u.raw_user_meta_data->>'last_name', ''), NULLIF(SUBSTRING(u.raw_user_meta_data->>'name' FROM POSITION(' ' IN COALESCE(u.raw_user_meta_data->>'name', '')) + 1), '')),
      'profile_type', p.profile_type::text,
      'onboarding_status', p.onboarding_status::text,
      'ispublished', p.ispublished,
      'linkedinurl', p.linkedinurl,
      'profile_slug', p.profile_slug,
      'anon_slug', p.anon_slug,
      'created_at', p.created_at,
      'profile_data', p.profile_data
    ),
    'fractional_preferences', (SELECT row_to_json(fp) FROM fractional_preferences fp WHERE fp.user_id = p.id),
    'full_time_preferences', (SELECT row_to_json(ftp) FROM full_time_preferences ftp WHERE ftp.user_id = p.id),
    'work_preferences', (SELECT row_to_json(wp) FROM work_preferences wp WHERE wp.user_id = p.id),
    'agreements', (SELECT COALESCE(json_agg(row_to_json(aa)), '[]'::json) FROM agreement_acceptances aa WHERE aa.profile_id = p.id),
    'work_eligibility', (SELECT COALESCE(json_agg(row_to_json(we)), '[]'::json) FROM user_work_eligibility we WHERE we.user_id = p.id),
    'location', (SELECT row_to_json(l) FROM locations l JOIN work_preferences wp ON wp.current_location_id = l.id WHERE wp.user_id = p.id),
    'fractional_locations', (
      SELECT COALESCE(json_agg(json_build_object('city', l.city, 'country_code', l.country_code, 'formatted_address', l.formatted_address)), '[]'::json)
      FROM fractional_location_preferences flp
      JOIN locations l ON l.id = flp.location_id
      WHERE flp.user_id = p.id
    ),
    'full_time_locations', (
      SELECT COALESCE(json_agg(json_build_object('city', l.city, 'country_code', l.country_code, 'formatted_address', l.formatted_address)), '[]'::json)
      FROM full_time_location_preferences ftlp
      JOIN locations l ON l.id = ftlp.location_id
      WHERE ftlp.user_id = p.id
    )
  ) INTO result
  FROM profiles p
  LEFT JOIN auth.users u ON u.id = p.id
  WHERE p.id = candidate_id;

  RETURN result;
END;
$function$;
