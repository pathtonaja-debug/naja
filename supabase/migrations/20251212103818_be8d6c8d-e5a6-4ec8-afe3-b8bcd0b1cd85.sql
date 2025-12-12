-- 1. Drop the insecure public read policy
DROP POLICY IF EXISTS "Anyone can read prayer times cache" ON prayer_times_cache;

-- 2. Create a secure policy that only allows authenticated users to read
CREATE POLICY "Authenticated users can read prayer times cache" 
  ON prayer_times_cache 
  FOR SELECT 
  USING (auth.uid() IS NOT NULL);

-- 3. Ensure RLS is enabled (should already be, but confirm)
ALTER TABLE prayer_times_cache ENABLE ROW LEVEL SECURITY;