
-- Create public bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-images', 'profile-images', true);

-- Allow upload if folder = auth.uid()
CREATE POLICY "Users can upload their own profile images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'profile-images'
  AND auth.uid()::text = split_part(name, '/', 1)
);

-- Allow update of own files
CREATE POLICY "Users can update their own profile images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'profile-images'
  AND auth.uid()::text = split_part(name, '/', 1)
);

-- Allow delete of own files
CREATE POLICY "Users can delete their own profile images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'profile-images'
  AND auth.uid()::text = split_part(name, '/', 1)
);

-- Allow public read access
CREATE POLICY "Public can view profile images"
ON storage.objects FOR SELECT
USING (bucket_id = 'profile-images');
