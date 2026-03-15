
-- Phase 2: Cloud sync tables
CREATE TABLE public.daily_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  date date NOT NULL,
  acts jsonb NOT NULL DEFAULT '[]'::jsonb,
  points integer NOT NULL DEFAULT 0,
  completed_count integer NOT NULL DEFAULT 0,
  total_count integer NOT NULL DEFAULT 7,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, date)
);

ALTER TABLE public.daily_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own daily progress" ON public.daily_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own daily progress" ON public.daily_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own daily progress" ON public.daily_progress FOR UPDATE USING (auth.uid() = user_id);

CREATE TABLE public.quran_reading_state (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  last_surah integer,
  last_verse integer,
  last_verse_key text,
  last_chapter_name text,
  bookmarks jsonb NOT NULL DEFAULT '[]'::jsonb,
  read_surahs integer[] NOT NULL DEFAULT '{}',
  today_pages integer NOT NULL DEFAULT 0,
  daily_goal integer NOT NULL DEFAULT 5,
  total_pages integer NOT NULL DEFAULT 0,
  current_juz integer NOT NULL DEFAULT 1,
  khatams integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.quran_reading_state ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own quran state" ON public.quran_reading_state FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own quran state" ON public.quran_reading_state FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own quran state" ON public.quran_reading_state FOR UPDATE USING (auth.uid() = user_id);

CREATE TABLE public.user_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  goal_config jsonb NOT NULL DEFAULT '{}'::jsonb,
  daily_completions jsonb NOT NULL DEFAULT '[]'::jsonb,
  streak integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.user_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own goals" ON public.user_goals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own goals" ON public.user_goals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own goals" ON public.user_goals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own goals" ON public.user_goals FOR DELETE USING (auth.uid() = user_id);

-- Phase 3: Gamification tables
CREATE TABLE public.weekly_challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  challenge_type text NOT NULL,
  title text NOT NULL,
  description text,
  target integer NOT NULL DEFAULT 5,
  progress integer NOT NULL DEFAULT 0,
  week_start date NOT NULL,
  completed boolean NOT NULL DEFAULT false,
  xp_reward integer NOT NULL DEFAULT 50,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.weekly_challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own challenges" ON public.weekly_challenges FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own challenges" ON public.weekly_challenges FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own challenges" ON public.weekly_challenges FOR UPDATE USING (auth.uid() = user_id);

-- Phase 5: Social features table
CREATE TABLE public.community_duas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  text text NOT NULL,
  category text DEFAULT 'general',
  prayer_count integer NOT NULL DEFAULT 0,
  is_approved boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.community_duas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can view approved community duas" ON public.community_duas FOR SELECT USING (auth.uid() IS NOT NULL AND is_approved = true);
CREATE POLICY "Users can insert community duas" ON public.community_duas FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own community duas" ON public.community_duas FOR DELETE USING (auth.uid() = user_id);

-- Add leaderboard_visible to profiles for opt-in
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS leaderboard_visible boolean DEFAULT false;

-- Create a view-like policy for leaderboard (users who opt in)
CREATE POLICY "Users can view leaderboard profiles" ON public.profiles FOR SELECT USING (auth.uid() = id OR leaderboard_visible = true);

-- Add trigger for updated_at on new tables
CREATE TRIGGER set_daily_progress_updated_at BEFORE UPDATE ON public.daily_progress FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_quran_reading_state_updated_at BEFORE UPDATE ON public.quran_reading_state FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_user_goals_updated_at BEFORE UPDATE ON public.user_goals FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Enable realtime for community_duas
ALTER PUBLICATION supabase_realtime ADD TABLE public.community_duas;
