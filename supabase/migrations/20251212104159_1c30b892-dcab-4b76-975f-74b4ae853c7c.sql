-- Fix DELETE policies for GDPR compliance
CREATE POLICY "Users can delete their own profile" 
  ON profiles FOR DELETE 
  USING (auth.uid() = id);

CREATE POLICY "Users can delete their own companion profile" 
  ON companion_profiles FOR DELETE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notifications" 
  ON notifications FOR DELETE 
  USING (auth.uid() = user_id);

-- Restrict prayer_times_cache INSERT to service role only
DROP POLICY IF EXISTS "Service role can insert prayer times" ON prayer_times_cache;

CREATE POLICY "Service role can insert prayer times" 
  ON prayer_times_cache FOR INSERT 
  WITH CHECK (auth.jwt()->>'role' = 'service_role');