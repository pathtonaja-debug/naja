
-- Allow any authenticated user to update prayer_count on community_duas
CREATE POLICY "Users can update prayer count" ON public.community_duas 
  FOR UPDATE 
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);
