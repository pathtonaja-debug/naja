-- Fix function search_path mutable warning
-- The update_habit_stats function needs to have search_path set for security

CREATE OR REPLACE FUNCTION public.update_habit_stats()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
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
$function$;