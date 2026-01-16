-- Add RLS policies for storage buckets (reflections and companion-avatars)

-- RLS policy for reflections bucket - upload
CREATE POLICY "Users can upload own reflections"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'reflections' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- RLS policy for reflections bucket - read
CREATE POLICY "Users can read own reflections"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'reflections' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- RLS policy for reflections bucket - delete
CREATE POLICY "Users can delete own reflections"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'reflections' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- RLS policy for reflections bucket - update
CREATE POLICY "Users can update own reflections"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'reflections' AND
  (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'reflections' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- RLS policy for companion-avatars bucket - upload
CREATE POLICY "Users can upload own avatars"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'companion-avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- RLS policy for companion-avatars bucket - read
CREATE POLICY "Users can read own avatars"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'companion-avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- RLS policy for companion-avatars bucket - delete
CREATE POLICY "Users can delete own avatars"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'companion-avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- RLS policy for companion-avatars bucket - update
CREATE POLICY "Users can update own avatars"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'companion-avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'companion-avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);