-- Fix: Restrict profiles table to only allow users to view their own profile
-- This prevents exposure of other users' display names, locations, and preferences

-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Users can view all profiles" ON profiles;

-- Create a restrictive policy that only allows users to view their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);