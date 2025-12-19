-- User gamification profile (XP, level, streaks)
CREATE TABLE public.user_gamification (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  xp INTEGER NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 1,
  streak_days INTEGER NOT NULL DEFAULT 0,
  last_activity_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_gamification ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own gamification" ON public.user_gamification FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own gamification" ON public.user_gamification FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own gamification" ON public.user_gamification FOR UPDATE USING (auth.uid() = user_id);

-- Achievements definitions
CREATE TABLE public.achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'trophy',
  xp_reward INTEGER NOT NULL DEFAULT 50,
  category TEXT NOT NULL DEFAULT 'general',
  requirement_type TEXT NOT NULL, -- 'prayers_completed', 'streak_days', 'quizzes_passed', 'dhikr_count', 'level_reached'
  requirement_value INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User earned achievements
CREATE TABLE public.user_achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

-- Enable RLS
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_achievements
CREATE POLICY "Users can view their own achievements" ON public.user_achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can earn achievements" ON public.user_achievements FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Achievements are readable by all authenticated users
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view achievements" ON public.achievements FOR SELECT USING (auth.uid() IS NOT NULL);

-- Daily quizzes
CREATE TABLE public.daily_quizzes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quiz_date DATE NOT NULL UNIQUE,
  topic TEXT NOT NULL,
  questions JSONB NOT NULL, -- Array of {question, options[], correct_index, explanation}
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS - quizzes are public to authenticated users
ALTER TABLE public.daily_quizzes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view quizzes" ON public.daily_quizzes FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Service role can insert quizzes" ON public.daily_quizzes FOR INSERT WITH CHECK (true);

-- User quiz attempts
CREATE TABLE public.quiz_attempts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  quiz_id UUID NOT NULL REFERENCES public.daily_quizzes(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  answers JSONB NOT NULL, -- User's selected answers
  xp_earned INTEGER NOT NULL DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, quiz_id)
);

-- Enable RLS
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

-- RLS policies for quiz_attempts
CREATE POLICY "Users can view their own attempts" ON public.quiz_attempts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can submit attempts" ON public.quiz_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Insert default achievements
INSERT INTO public.achievements (name, description, icon, xp_reward, category, requirement_type, requirement_value) VALUES
-- Prayer achievements
('First Prayer', 'Complete your first prayer tracking', 'sun', 25, 'prayer', 'prayers_completed', 1),
('Dedicated Worshipper', 'Complete 50 prayers', 'sunrise', 100, 'prayer', 'prayers_completed', 50),
('Steadfast in Salah', 'Complete 200 prayers', 'moon', 250, 'prayer', 'prayers_completed', 200),
-- Streak achievements
('Getting Started', 'Maintain a 3-day streak', 'flame', 50, 'streak', 'streak_days', 3),
('Week Warrior', 'Maintain a 7-day streak', 'zap', 100, 'streak', 'streak_days', 7),
('Monthly Master', 'Maintain a 30-day streak', 'award', 500, 'streak', 'streak_days', 30),
-- Quiz achievements
('Knowledge Seeker', 'Pass your first quiz', 'book-open', 50, 'quiz', 'quizzes_passed', 1),
('Scholar in Training', 'Pass 10 quizzes', 'graduation-cap', 200, 'quiz', 'quizzes_passed', 10),
('Learned One', 'Pass 50 quizzes', 'library', 500, 'quiz', 'quizzes_passed', 50),
-- Dhikr achievements
('Remembrance Begins', 'Complete 100 dhikr counts', 'heart', 25, 'dhikr', 'dhikr_count', 100),
('Devoted Heart', 'Complete 1000 dhikr counts', 'sparkles', 150, 'dhikr', 'dhikr_count', 1000),
('Constant Remembrance', 'Complete 10000 dhikr counts', 'star', 500, 'dhikr', 'dhikr_count', 10000),
-- Level achievements
('Rising Star', 'Reach level 5', 'trending-up', 100, 'level', 'level_reached', 5),
('Enlightened Path', 'Reach level 10', 'crown', 250, 'level', 'level_reached', 10),
('Spiritual Master', 'Reach level 25', 'gem', 750, 'level', 'level_reached', 25);

-- Trigger to update user_gamification updated_at
CREATE OR REPLACE FUNCTION public.update_gamification_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_gamification_timestamp
BEFORE UPDATE ON public.user_gamification
FOR EACH ROW EXECUTE FUNCTION public.update_gamification_timestamp();

-- Function to create gamification profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user_gamification()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_gamification (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to auto-create gamification profile when profile is created
CREATE TRIGGER on_profile_created_gamification
AFTER INSERT ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_gamification();