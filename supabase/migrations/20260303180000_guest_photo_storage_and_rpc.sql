-- Allow anonymous uploads to guest-photos/ prefix in profile-images bucket
CREATE POLICY "Anyone can upload guest photos"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'profile-images'
  AND (storage.foldername(name))[1] = 'guest-photos'
);

-- RPC to update profile_data.profilePicture for any profile
CREATE OR REPLACE FUNCTION update_profile_picture(
  p_profile_id UUID,
  p_picture_url TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE profiles
  SET
    profile_data = jsonb_set(
      COALESCE(profile_data, '{}'::jsonb),
      '{profilePicture}',
      to_jsonb(p_picture_url)
    ),
    updated_at = NOW()
  WHERE id = p_profile_id;

  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Profile not found');
  END IF;

  RETURN json_build_object('success', true, 'profile_id', p_profile_id, 'picture_url', p_picture_url);
END;
$$;
