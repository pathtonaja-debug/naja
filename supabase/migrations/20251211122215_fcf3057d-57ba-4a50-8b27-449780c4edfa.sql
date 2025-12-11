-- Add city and country columns to profiles for location display
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS city text,
ADD COLUMN IF NOT EXISTS country text;