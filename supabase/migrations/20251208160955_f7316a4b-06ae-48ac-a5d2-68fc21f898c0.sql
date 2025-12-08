-- First, delete any orphaned records without user_id (from old device_id approach)
DELETE FROM calendar_items WHERE user_id IS NULL;
DELETE FROM dhikr_sessions WHERE user_id IS NULL;
DELETE FROM duas WHERE user_id IS NULL;
DELETE FROM habit_logs WHERE user_id IS NULL;
DELETE FROM habit_stats WHERE user_id IS NULL;
DELETE FROM habits WHERE user_id IS NULL;
DELETE FROM reflections WHERE user_id IS NULL;

-- Make user_id NOT NULL on all tables
ALTER TABLE calendar_items ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE dhikr_sessions ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE duas ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE habit_logs ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE habit_stats ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE habits ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE reflections ALTER COLUMN user_id SET NOT NULL;

-- Add foreign key constraints to link to profiles table
ALTER TABLE calendar_items 
  ADD CONSTRAINT calendar_items_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE dhikr_sessions 
  DROP CONSTRAINT IF EXISTS dhikr_sessions_user_id_fkey,
  ADD CONSTRAINT dhikr_sessions_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE duas 
  DROP CONSTRAINT IF EXISTS duas_user_id_fkey,
  ADD CONSTRAINT duas_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE habit_logs 
  DROP CONSTRAINT IF EXISTS habit_logs_user_id_fkey,
  ADD CONSTRAINT habit_logs_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE habits 
  DROP CONSTRAINT IF EXISTS habits_user_id_fkey,
  ADD CONSTRAINT habits_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE reflections 
  DROP CONSTRAINT IF EXISTS reflections_user_id_fkey,
  ADD CONSTRAINT reflections_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;