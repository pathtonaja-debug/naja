-- Fix: Add INSERT policy for profiles table
-- This allows new users to create their own profile record

CREATE POLICY "Users can create their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);