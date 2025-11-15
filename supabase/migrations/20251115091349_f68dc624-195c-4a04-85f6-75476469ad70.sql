-- Fix RLS policies to use proper authentication instead of USING (true)

-- Drop all existing permissive policies
DROP POLICY IF EXISTS "Anyone can manage their calendar items" ON calendar_items;
DROP POLICY IF EXISTS "Anyone can view their device companion" ON companion_profiles;
DROP POLICY IF EXISTS "Anyone can insert companion profile" ON companion_profiles;
DROP POLICY IF EXISTS "Anyone can update companion profile" ON companion_profiles;
DROP POLICY IF EXISTS "Anyone can manage dhikr_sessions" ON dhikr_sessions;
DROP POLICY IF EXISTS "Anyone can manage duas" ON duas;
DROP POLICY IF EXISTS "Anyone can manage habit_logs" ON habit_logs;
DROP POLICY IF EXISTS "Anyone can manage habit_stats" ON habit_stats;
DROP POLICY IF EXISTS "Anyone can manage habits" ON habits;
DROP POLICY IF EXISTS "Anyone can manage profiles" ON profiles;
DROP POLICY IF EXISTS "Anyone can manage reflections" ON reflections;

-- Calendar Items: Users can only access their own calendar items
CREATE POLICY "Users can view their own calendar items"
  ON calendar_items FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own calendar items"
  ON calendar_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own calendar items"
  ON calendar_items FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own calendar items"
  ON calendar_items FOR DELETE
  USING (auth.uid() = user_id);

-- Companion Profiles: Users can only access their own companion profile
CREATE POLICY "Users can view their own companion profile"
  ON companion_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own companion profile"
  ON companion_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own companion profile"
  ON companion_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Dhikr Sessions: Users can only access their own dhikr sessions
CREATE POLICY "Users can view their own dhikr sessions"
  ON dhikr_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own dhikr sessions"
  ON dhikr_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own dhikr sessions"
  ON dhikr_sessions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own dhikr sessions"
  ON dhikr_sessions FOR DELETE
  USING (auth.uid() = user_id);

-- Duas: Users can only access their own duas
CREATE POLICY "Users can view their own duas"
  ON duas FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own duas"
  ON duas FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own duas"
  ON duas FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own duas"
  ON duas FOR DELETE
  USING (auth.uid() = user_id);

-- Habit Logs: Users can only access their own habit logs
CREATE POLICY "Users can view their own habit logs"
  ON habit_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own habit logs"
  ON habit_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own habit logs"
  ON habit_logs FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own habit logs"
  ON habit_logs FOR DELETE
  USING (auth.uid() = user_id);

-- Habit Stats: Users can only access their own habit stats
CREATE POLICY "Users can view their own habit stats"
  ON habit_stats FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own habit stats"
  ON habit_stats FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own habit stats"
  ON habit_stats FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own habit stats"
  ON habit_stats FOR DELETE
  USING (auth.uid() = user_id);

-- Habits: Users can only access their own habits
CREATE POLICY "Users can view their own habits"
  ON habits FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own habits"
  ON habits FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own habits"
  ON habits FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own habits"
  ON habits FOR DELETE
  USING (auth.uid() = user_id);

-- Profiles: Users can view all profiles but only update their own
CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Reflections: Users can only access their own reflections
CREATE POLICY "Users can view their own reflections"
  ON reflections FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own reflections"
  ON reflections FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reflections"
  ON reflections FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reflections"
  ON reflections FOR DELETE
  USING (auth.uid() = user_id);