-- Fix: Secure reflections storage bucket RLS policies
-- These policies now properly check user ownership via folder path

-- Drop the insecure policies that only check bucket_id
DROP POLICY IF EXISTS "Anyone can view their own reflection photos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload their own reflection photos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update their own reflection photos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete their own reflection photos" ON storage.objects;

-- Create secure policies that verify user ownership
CREATE POLICY "Users can view their own reflection photos" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'reflections' AND
    auth.uid() IS NOT NULL AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can upload their own reflection photos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'reflections' AND
    auth.uid() IS NOT NULL AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update their own reflection photos" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'reflections' AND
    auth.uid() IS NOT NULL AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete their own reflection photos" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'reflections' AND
    auth.uid() IS NOT NULL AND
    (storage.foldername(name))[1] = auth.uid()::text
  );