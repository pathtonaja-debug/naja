-- Update habits table to support time-based tracking and calendar sync
ALTER TABLE habits
ADD COLUMN IF NOT EXISTS notes text,
ADD COLUMN IF NOT EXISTS is_all_day boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS habit_time time,
ADD COLUMN IF NOT EXISTS repeat_pattern jsonb DEFAULT '{"type": "daily"}'::jsonb,
ADD COLUMN IF NOT EXISTS sync_to_calendar boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS color text;

-- Create habit_stats table for analytics
CREATE TABLE IF NOT EXISTS habit_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id uuid NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  user_id uuid,
  device_id text,
  current_streak integer DEFAULT 0,
  longest_streak integer DEFAULT 0,
  total_completions integer DEFAULT 0,
  weekly_breakdown jsonb DEFAULT '{}'::jsonb,
  monthly_breakdown jsonb DEFAULT '{}'::jsonb,
  yearly_breakdown jsonb DEFAULT '{}'::jsonb,
  last_completed_date date,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on habit_stats
ALTER TABLE habit_stats ENABLE ROW LEVEL SECURITY;

-- Create policy for habit_stats
CREATE POLICY "Anyone can manage habit_stats"
ON habit_stats
FOR ALL
USING (true);

-- Create function to update habit stats
CREATE OR REPLACE FUNCTION update_habit_stats()
RETURNS TRIGGER AS $$
DECLARE
  v_current_streak integer := 0;
  v_longest_streak integer := 0;
  v_total_completions integer := 0;
  v_last_date date;
BEGIN
  -- Calculate total completions
  SELECT COUNT(*) INTO v_total_completions
  FROM habit_logs
  WHERE habit_id = NEW.habit_id AND completed = true;

  -- Calculate current streak
  SELECT date INTO v_last_date
  FROM habit_logs
  WHERE habit_id = NEW.habit_id AND completed = true
  ORDER BY date DESC
  LIMIT 1;

  IF v_last_date IS NOT NULL THEN
    WITH RECURSIVE streak_dates AS (
      SELECT v_last_date as check_date, 0 as days_back
      UNION ALL
      SELECT (check_date - interval '1 day')::date, days_back + 1
      FROM streak_dates
      WHERE days_back < 365
        AND EXISTS (
          SELECT 1 FROM habit_logs
          WHERE habit_id = NEW.habit_id
            AND date = (check_date - interval '1 day')::date
            AND completed = true
        )
    )
    SELECT COUNT(*) INTO v_current_streak FROM streak_dates;

    -- Calculate longest streak
    WITH daily_logs AS (
      SELECT date, completed,
        date - (ROW_NUMBER() OVER (ORDER BY date))::integer * interval '1 day' as grp
      FROM habit_logs
      WHERE habit_id = NEW.habit_id AND completed = true
    ),
    streak_groups AS (
      SELECT grp, COUNT(*) as streak_length
      FROM daily_logs
      GROUP BY grp
    )
    SELECT COALESCE(MAX(streak_length), 0) INTO v_longest_streak FROM streak_groups;
  END IF;

  -- Upsert habit_stats
  INSERT INTO habit_stats (
    habit_id, user_id, device_id, current_streak, longest_streak,
    total_completions, last_completed_date
  )
  VALUES (
    NEW.habit_id, NEW.user_id, NEW.device_id, v_current_streak,
    v_longest_streak, v_total_completions, NEW.date
  )
  ON CONFLICT (habit_id) DO UPDATE SET
    current_streak = v_current_streak,
    longest_streak = GREATEST(habit_stats.longest_streak, v_longest_streak),
    total_completions = v_total_completions,
    last_completed_date = NEW.date,
    updated_at = now();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add unique constraint for habit_id in habit_stats
ALTER TABLE habit_stats DROP CONSTRAINT IF EXISTS habit_stats_habit_id_key;
ALTER TABLE habit_stats ADD CONSTRAINT habit_stats_habit_id_key UNIQUE (habit_id);

-- Create trigger for habit stats updates
DROP TRIGGER IF EXISTS update_habit_stats_trigger ON habit_logs;
CREATE TRIGGER update_habit_stats_trigger
AFTER INSERT OR UPDATE ON habit_logs
FOR EACH ROW
WHEN (NEW.completed = true)
EXECUTE FUNCTION update_habit_stats();

-- Add updated_at trigger to habit_stats
DROP TRIGGER IF EXISTS update_habit_stats_updated_at ON habit_stats;
CREATE TRIGGER update_habit_stats_updated_at
BEFORE UPDATE ON habit_stats
FOR EACH ROW
EXECUTE FUNCTION handle_updated_at();