-- Secure the companion-avatars storage bucket
-- Make bucket private to prevent unrestricted access
UPDATE storage.buckets 
SET public = false 
WHERE id = 'companion-avatars';

-- Drop existing permissive policies
DROP POLICY IF EXISTS "Anyone can view companion avatars" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload companion avatars" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update companion avatars" ON storage.objects;

-- Create authenticated policies that restrict users to their own folder
CREATE POLICY "Users can view their own avatars"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'companion-avatars'
  AND auth.uid() IS NOT NULL
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can upload their own avatars"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'companion-avatars'
  AND auth.uid() IS NOT NULL
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can update their own avatars"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'companion-avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own avatars"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'companion-avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);