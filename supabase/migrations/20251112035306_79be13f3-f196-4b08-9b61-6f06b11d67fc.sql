-- Remove RLS policies that depend on auth.uid() from companion_profiles
DROP POLICY IF EXISTS "Users can view their own companion" ON companion_profiles;
DROP POLICY IF EXISTS "Users can insert their own companion" ON companion_profiles;
DROP POLICY IF EXISTS "Users can update their own companion" ON companion_profiles;

-- Make user_id nullable and add device_id for non-authenticated storage
ALTER TABLE companion_profiles ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE companion_profiles ADD COLUMN IF NOT EXISTS device_id TEXT;

-- Create new RLS policies that work without authentication
CREATE POLICY "Anyone can view their device companion"
ON companion_profiles FOR SELECT
USING (true);

CREATE POLICY "Anyone can insert companion profile"
ON companion_profiles FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update companion profile"
ON companion_profiles FOR UPDATE
USING (true);

-- Do the same for other tables that currently require auth
ALTER TABLE reflections ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE reflections ADD COLUMN IF NOT EXISTS device_id TEXT;

DROP POLICY IF EXISTS "Users can view their own reflections" ON reflections;
DROP POLICY IF EXISTS "Users can create their own reflections" ON reflections;
DROP POLICY IF EXISTS "Users can update their own reflections" ON reflections;
DROP POLICY IF EXISTS "Users can delete their own reflections" ON reflections;

CREATE POLICY "Anyone can manage reflections"
ON reflections FOR ALL
USING (true);

ALTER TABLE habits ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE habits ADD COLUMN IF NOT EXISTS device_id TEXT;

DROP POLICY IF EXISTS "Users can view their own habits" ON habits;
DROP POLICY IF EXISTS "Users can create their own habits" ON habits;
DROP POLICY IF EXISTS "Users can update their own habits" ON habits;
DROP POLICY IF EXISTS "Users can delete their own habits" ON habits;

CREATE POLICY "Anyone can manage habits"
ON habits FOR ALL
USING (true);

ALTER TABLE habit_logs ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE habit_logs ADD COLUMN IF NOT EXISTS device_id TEXT;

DROP POLICY IF EXISTS "Users can view their own habit logs" ON habit_logs;
DROP POLICY IF EXISTS "Users can create their own habit logs" ON habit_logs;
DROP POLICY IF EXISTS "Users can update their own habit logs" ON habit_logs;

CREATE POLICY "Anyone can manage habit_logs"
ON habit_logs FOR ALL
USING (true);

ALTER TABLE duas ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE duas ADD COLUMN IF NOT EXISTS device_id TEXT;

DROP POLICY IF EXISTS "Users can view their own duas" ON duas;
DROP POLICY IF EXISTS "Users can create their own duas" ON duas;
DROP POLICY IF EXISTS "Users can update their own duas" ON duas;
DROP POLICY IF EXISTS "Users can delete their own duas" ON duas;

CREATE POLICY "Anyone can manage duas"
ON duas FOR ALL
USING (true);

ALTER TABLE dhikr_sessions ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE dhikr_sessions ADD COLUMN IF NOT EXISTS device_id TEXT;

DROP POLICY IF EXISTS "Users can view their own dhikr sessions" ON dhikr_sessions;
DROP POLICY IF EXISTS "Users can create their own dhikr sessions" ON dhikr_sessions;

CREATE POLICY "Anyone can manage dhikr_sessions"
ON dhikr_sessions FOR ALL
USING (true);

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS device_id TEXT;

DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

CREATE POLICY "Anyone can manage profiles"
ON profiles FOR ALL
USING (true);