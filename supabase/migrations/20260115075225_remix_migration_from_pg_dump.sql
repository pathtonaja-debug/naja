CREATE EXTENSION IF NOT EXISTS "pg_graphql";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "plpgsql";
CREATE EXTENSION IF NOT EXISTS "supabase_vault";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";
BEGIN;

--
-- PostgreSQL database dump
--


-- Dumped from database version 17.6
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--



--
-- Name: app_role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.app_role AS ENUM (
    'admin',
    'user'
);


--
-- Name: prayer_method; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.prayer_method AS ENUM (
    'MWL',
    'ISNA',
    'Egypt',
    'Makkah',
    'Karachi',
    'Tehran',
    'Jafari'
);


--
-- Name: handle_new_user(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.handle_new_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'display_name');
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  INSERT INTO public.companion_profiles (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$;


--
-- Name: handle_new_user_gamification(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.handle_new_user_gamification() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  INSERT INTO public.user_gamification (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;


--
-- Name: handle_updated_at(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.handle_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public'
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


--
-- Name: has_role(uuid, public.app_role); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.has_role(_user_id uuid, _role public.app_role) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;


--
-- Name: update_gamification_timestamp(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_gamification_timestamp() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


--
-- Name: update_habit_stats(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_habit_stats() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public'
    AS $$
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
$$;


SET default_table_access_method = heap;

--
-- Name: achievements; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.achievements (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    icon text DEFAULT 'trophy'::text NOT NULL,
    xp_reward integer DEFAULT 50 NOT NULL,
    category text DEFAULT 'general'::text NOT NULL,
    requirement_type text NOT NULL,
    requirement_value integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: calendar_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.calendar_items (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    device_id text,
    type text NOT NULL,
    title text NOT NULL,
    notes text,
    start_date_time timestamp with time zone NOT NULL,
    end_date_time timestamp with time zone,
    is_all_day boolean DEFAULT false,
    category text NOT NULL,
    completion integer DEFAULT 0,
    calendar_source text DEFAULT 'NAJA'::text,
    color text,
    repeat_rule text,
    reminder text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT calendar_items_category_check CHECK ((category = ANY (ARRAY['faith'::text, 'work'::text, 'study'::text, 'health'::text, 'personal'::text, 'other'::text]))),
    CONSTRAINT calendar_items_completion_check CHECK (((completion >= 0) AND (completion <= 100))),
    CONSTRAINT calendar_items_type_check CHECK ((type = ANY (ARRAY['event'::text, 'task'::text])))
);


--
-- Name: companion_profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.companion_profiles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    name text DEFAULT 'NAJA'::text,
    voice_tone text DEFAULT 'warm'::text,
    skin_tone text,
    hair_color text,
    eye_color text,
    outfit text,
    behavior_settings jsonb DEFAULT '{"faith_aligned": true, "gentle_reminders": true, "contextual_suggestions": true}'::jsonb,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    device_id text,
    full_body_url text,
    portrait_url text,
    portrait_crop jsonb DEFAULT '{"x": 0, "y": 0, "width": 256, "height": 256}'::jsonb,
    selected_variant_id integer DEFAULT 1,
    appearance jsonb DEFAULT '{}'::jsonb
);


--
-- Name: daily_quizzes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.daily_quizzes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    quiz_date date NOT NULL,
    topic text NOT NULL,
    questions jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: dhikr_sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.dhikr_sessions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    phrase text NOT NULL,
    count integer NOT NULL,
    target integer,
    date date DEFAULT CURRENT_DATE,
    created_at timestamp with time zone DEFAULT now(),
    device_id text
);


--
-- Name: dua_folders; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.dua_folders (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    name text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: duas; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.duas (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    title text NOT NULL,
    category text,
    content jsonb NOT NULL,
    reminder_time time without time zone,
    is_favorite boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    device_id text,
    folder_id uuid,
    topic text,
    selected_names text[] DEFAULT '{}'::text[],
    request_text text,
    ummah_prayers text[] DEFAULT '{}'::text[],
    include_salawat boolean DEFAULT false,
    final_text text
);


--
-- Name: habit_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.habit_logs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    habit_id uuid NOT NULL,
    user_id uuid NOT NULL,
    date date NOT NULL,
    completed boolean DEFAULT false,
    count integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    device_id text
);


--
-- Name: habit_stats; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.habit_stats (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    habit_id uuid NOT NULL,
    user_id uuid NOT NULL,
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


--
-- Name: habits; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.habits (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    name text NOT NULL,
    category text,
    frequency text DEFAULT 'daily'::text,
    target_count integer DEFAULT 1,
    reminder_time time without time zone,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    device_id text,
    icon text DEFAULT 'star'::text,
    notes text,
    is_all_day boolean DEFAULT false,
    habit_time time without time zone,
    repeat_pattern jsonb DEFAULT '{"type": "daily"}'::jsonb,
    sync_to_calendar boolean DEFAULT false,
    color text
);


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notifications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    type text NOT NULL,
    title text NOT NULL,
    body text,
    data jsonb,
    read boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: prayer_times_cache; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.prayer_times_cache (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    latitude numeric(10,8) NOT NULL,
    longitude numeric(11,8) NOT NULL,
    method public.prayer_method NOT NULL,
    date date NOT NULL,
    times jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.profiles (
    id uuid NOT NULL,
    display_name text,
    timezone text DEFAULT 'UTC'::text,
    latitude numeric(10,8),
    longitude numeric(11,8),
    prayer_method public.prayer_method DEFAULT 'MWL'::public.prayer_method,
    language text DEFAULT 'en'::text,
    show_hijri boolean DEFAULT true,
    notifications_enabled boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    device_id text,
    city text,
    country text
);


--
-- Name: quiz_attempts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.quiz_attempts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    quiz_id uuid NOT NULL,
    score integer NOT NULL,
    total_questions integer NOT NULL,
    answers jsonb NOT NULL,
    xp_earned integer DEFAULT 0 NOT NULL,
    completed_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: reflections; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.reflections (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    date date NOT NULL,
    text text NOT NULL,
    prompt text,
    voice_note_url text,
    photo_url text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    device_id text,
    mood text
);


--
-- Name: user_achievements; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_achievements (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    achievement_id uuid NOT NULL,
    earned_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: user_gamification; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_gamification (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    xp integer DEFAULT 0 NOT NULL,
    level integer DEFAULT 1 NOT NULL,
    streak_days integer DEFAULT 0 NOT NULL,
    last_activity_date date,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_roles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    role public.app_role NOT NULL
);


--
-- Name: achievements achievements_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.achievements
    ADD CONSTRAINT achievements_pkey PRIMARY KEY (id);


--
-- Name: calendar_items calendar_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.calendar_items
    ADD CONSTRAINT calendar_items_pkey PRIMARY KEY (id);


--
-- Name: companion_profiles companion_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.companion_profiles
    ADD CONSTRAINT companion_profiles_pkey PRIMARY KEY (id);


--
-- Name: companion_profiles companion_profiles_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.companion_profiles
    ADD CONSTRAINT companion_profiles_user_id_key UNIQUE (user_id);


--
-- Name: daily_quizzes daily_quizzes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.daily_quizzes
    ADD CONSTRAINT daily_quizzes_pkey PRIMARY KEY (id);


--
-- Name: daily_quizzes daily_quizzes_quiz_date_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.daily_quizzes
    ADD CONSTRAINT daily_quizzes_quiz_date_key UNIQUE (quiz_date);


--
-- Name: dhikr_sessions dhikr_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dhikr_sessions
    ADD CONSTRAINT dhikr_sessions_pkey PRIMARY KEY (id);


--
-- Name: dua_folders dua_folders_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dua_folders
    ADD CONSTRAINT dua_folders_pkey PRIMARY KEY (id);


--
-- Name: duas duas_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.duas
    ADD CONSTRAINT duas_pkey PRIMARY KEY (id);


--
-- Name: habit_logs habit_logs_habit_id_date_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.habit_logs
    ADD CONSTRAINT habit_logs_habit_id_date_key UNIQUE (habit_id, date);


--
-- Name: habit_logs habit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.habit_logs
    ADD CONSTRAINT habit_logs_pkey PRIMARY KEY (id);


--
-- Name: habit_stats habit_stats_habit_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.habit_stats
    ADD CONSTRAINT habit_stats_habit_id_key UNIQUE (habit_id);


--
-- Name: habit_stats habit_stats_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.habit_stats
    ADD CONSTRAINT habit_stats_pkey PRIMARY KEY (id);


--
-- Name: habits habits_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.habits
    ADD CONSTRAINT habits_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: prayer_times_cache prayer_times_cache_latitude_longitude_method_date_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.prayer_times_cache
    ADD CONSTRAINT prayer_times_cache_latitude_longitude_method_date_key UNIQUE (latitude, longitude, method, date);


--
-- Name: prayer_times_cache prayer_times_cache_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.prayer_times_cache
    ADD CONSTRAINT prayer_times_cache_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);


--
-- Name: quiz_attempts quiz_attempts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quiz_attempts
    ADD CONSTRAINT quiz_attempts_pkey PRIMARY KEY (id);


--
-- Name: quiz_attempts quiz_attempts_user_id_quiz_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quiz_attempts
    ADD CONSTRAINT quiz_attempts_user_id_quiz_id_key UNIQUE (user_id, quiz_id);


--
-- Name: reflections reflections_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reflections
    ADD CONSTRAINT reflections_pkey PRIMARY KEY (id);


--
-- Name: user_achievements user_achievements_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_achievements
    ADD CONSTRAINT user_achievements_pkey PRIMARY KEY (id);


--
-- Name: user_achievements user_achievements_user_id_achievement_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_achievements
    ADD CONSTRAINT user_achievements_user_id_achievement_id_key UNIQUE (user_id, achievement_id);


--
-- Name: user_gamification user_gamification_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_gamification
    ADD CONSTRAINT user_gamification_pkey PRIMARY KEY (id);


--
-- Name: user_gamification user_gamification_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_gamification
    ADD CONSTRAINT user_gamification_user_id_key UNIQUE (user_id);


--
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (id);


--
-- Name: user_roles user_roles_user_id_role_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_role_key UNIQUE (user_id, role);


--
-- Name: habits_unique_name_per_user; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX habits_unique_name_per_user ON public.habits USING btree (user_id, name, category);


--
-- Name: idx_calendar_items_date_range; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_calendar_items_date_range ON public.calendar_items USING btree (start_date_time, end_date_time);


--
-- Name: idx_calendar_items_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_calendar_items_user_id ON public.calendar_items USING btree (user_id);


--
-- Name: idx_dhikr_sessions_user_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_dhikr_sessions_user_date ON public.dhikr_sessions USING btree (user_id, date DESC);


--
-- Name: idx_dua_folders_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_dua_folders_user_id ON public.dua_folders USING btree (user_id);


--
-- Name: idx_duas_folder_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_duas_folder_id ON public.duas USING btree (folder_id);


--
-- Name: idx_duas_is_favorite; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_duas_is_favorite ON public.duas USING btree (is_favorite);


--
-- Name: idx_duas_user_category; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_duas_user_category ON public.duas USING btree (user_id, category);


--
-- Name: idx_habit_logs_habit_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_habit_logs_habit_date ON public.habit_logs USING btree (habit_id, date DESC);


--
-- Name: idx_habits_user_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_habits_user_active ON public.habits USING btree (user_id, is_active);


--
-- Name: idx_notifications_user_read; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_notifications_user_read ON public.notifications USING btree (user_id, read, created_at DESC);


--
-- Name: idx_prayer_cache_lookup; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_prayer_cache_lookup ON public.prayer_times_cache USING btree (latitude, longitude, method, date);


--
-- Name: idx_reflections_user_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_reflections_user_date ON public.reflections USING btree (user_id, date DESC);


--
-- Name: companion_profiles companion_profiles_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER companion_profiles_updated_at BEFORE UPDATE ON public.companion_profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


--
-- Name: duas duas_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER duas_updated_at BEFORE UPDATE ON public.duas FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


--
-- Name: habits habits_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER habits_updated_at BEFORE UPDATE ON public.habits FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


--
-- Name: profiles on_profile_created_gamification; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER on_profile_created_gamification AFTER INSERT ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_gamification();


--
-- Name: profiles profiles_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


--
-- Name: reflections reflections_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER reflections_updated_at BEFORE UPDATE ON public.reflections FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


--
-- Name: calendar_items update_calendar_items_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_calendar_items_updated_at BEFORE UPDATE ON public.calendar_items FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


--
-- Name: habit_logs update_habit_stats_trigger; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_habit_stats_trigger AFTER INSERT OR UPDATE ON public.habit_logs FOR EACH ROW WHEN ((new.completed = true)) EXECUTE FUNCTION public.update_habit_stats();


--
-- Name: habit_stats update_habit_stats_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_habit_stats_updated_at BEFORE UPDATE ON public.habit_stats FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


--
-- Name: user_gamification update_user_gamification_timestamp; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_user_gamification_timestamp BEFORE UPDATE ON public.user_gamification FOR EACH ROW EXECUTE FUNCTION public.update_gamification_timestamp();


--
-- Name: calendar_items calendar_items_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.calendar_items
    ADD CONSTRAINT calendar_items_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: companion_profiles companion_profiles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.companion_profiles
    ADD CONSTRAINT companion_profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: dhikr_sessions dhikr_sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dhikr_sessions
    ADD CONSTRAINT dhikr_sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: dua_folders dua_folders_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dua_folders
    ADD CONSTRAINT dua_folders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: duas duas_folder_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.duas
    ADD CONSTRAINT duas_folder_id_fkey FOREIGN KEY (folder_id) REFERENCES public.dua_folders(id) ON DELETE SET NULL;


--
-- Name: duas duas_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.duas
    ADD CONSTRAINT duas_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: habit_logs habit_logs_habit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.habit_logs
    ADD CONSTRAINT habit_logs_habit_id_fkey FOREIGN KEY (habit_id) REFERENCES public.habits(id) ON DELETE CASCADE;


--
-- Name: habit_logs habit_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.habit_logs
    ADD CONSTRAINT habit_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: habit_stats habit_stats_habit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.habit_stats
    ADD CONSTRAINT habit_stats_habit_id_fkey FOREIGN KEY (habit_id) REFERENCES public.habits(id) ON DELETE CASCADE;


--
-- Name: habits habits_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.habits
    ADD CONSTRAINT habits_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: notifications notifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: profiles profiles_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: quiz_attempts quiz_attempts_quiz_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quiz_attempts
    ADD CONSTRAINT quiz_attempts_quiz_id_fkey FOREIGN KEY (quiz_id) REFERENCES public.daily_quizzes(id) ON DELETE CASCADE;


--
-- Name: quiz_attempts quiz_attempts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quiz_attempts
    ADD CONSTRAINT quiz_attempts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: reflections reflections_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reflections
    ADD CONSTRAINT reflections_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: user_achievements user_achievements_achievement_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_achievements
    ADD CONSTRAINT user_achievements_achievement_id_fkey FOREIGN KEY (achievement_id) REFERENCES public.achievements(id) ON DELETE CASCADE;


--
-- Name: user_achievements user_achievements_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_achievements
    ADD CONSTRAINT user_achievements_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: user_gamification user_gamification_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_gamification
    ADD CONSTRAINT user_gamification_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: user_roles user_roles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: user_roles Admins can manage all roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage all roles" ON public.user_roles USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: achievements Anyone can view achievements; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view achievements" ON public.achievements FOR SELECT USING ((auth.uid() IS NOT NULL));


--
-- Name: prayer_times_cache Authenticated users can read prayer times cache; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can read prayer times cache" ON public.prayer_times_cache FOR SELECT USING ((auth.uid() IS NOT NULL));


--
-- Name: daily_quizzes Authenticated users can view quizzes; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can view quizzes" ON public.daily_quizzes FOR SELECT USING ((auth.uid() IS NOT NULL));


--
-- Name: prayer_times_cache Service role can insert prayer times; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Service role can insert prayer times" ON public.prayer_times_cache FOR INSERT WITH CHECK (((auth.jwt() ->> 'role'::text) = 'service_role'::text));


--
-- Name: daily_quizzes Service role can insert quizzes; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Service role can insert quizzes" ON public.daily_quizzes FOR INSERT WITH CHECK (true);


--
-- Name: calendar_items Users can create their own calendar items; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create their own calendar items" ON public.calendar_items FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: companion_profiles Users can create their own companion profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create their own companion profile" ON public.companion_profiles FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: dhikr_sessions Users can create their own dhikr sessions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create their own dhikr sessions" ON public.dhikr_sessions FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: duas Users can create their own duas; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create their own duas" ON public.duas FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: dua_folders Users can create their own folders; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create their own folders" ON public.dua_folders FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: habit_logs Users can create their own habit logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create their own habit logs" ON public.habit_logs FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: habit_stats Users can create their own habit stats; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create their own habit stats" ON public.habit_stats FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: habits Users can create their own habits; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create their own habits" ON public.habits FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: notifications Users can create their own notifications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create their own notifications" ON public.notifications FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: profiles Users can create their own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create their own profile" ON public.profiles FOR INSERT WITH CHECK ((auth.uid() = id));


--
-- Name: reflections Users can create their own reflections; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create their own reflections" ON public.reflections FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: calendar_items Users can delete their own calendar items; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their own calendar items" ON public.calendar_items FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: companion_profiles Users can delete their own companion profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their own companion profile" ON public.companion_profiles FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: dhikr_sessions Users can delete their own dhikr sessions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their own dhikr sessions" ON public.dhikr_sessions FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: duas Users can delete their own duas; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their own duas" ON public.duas FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: dua_folders Users can delete their own folders; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their own folders" ON public.dua_folders FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: habit_logs Users can delete their own habit logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their own habit logs" ON public.habit_logs FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: habit_stats Users can delete their own habit stats; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their own habit stats" ON public.habit_stats FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: habits Users can delete their own habits; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their own habits" ON public.habits FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: notifications Users can delete their own notifications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their own notifications" ON public.notifications FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: profiles Users can delete their own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their own profile" ON public.profiles FOR DELETE USING ((auth.uid() = id));


--
-- Name: reflections Users can delete their own reflections; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their own reflections" ON public.reflections FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: user_achievements Users can earn achievements; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can earn achievements" ON public.user_achievements FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: user_gamification Users can insert their own gamification; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert their own gamification" ON public.user_gamification FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: quiz_attempts Users can submit attempts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can submit attempts" ON public.quiz_attempts FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: calendar_items Users can update their own calendar items; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own calendar items" ON public.calendar_items FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: companion_profiles Users can update their own companion profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own companion profile" ON public.companion_profiles FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: dhikr_sessions Users can update their own dhikr sessions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own dhikr sessions" ON public.dhikr_sessions FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: duas Users can update their own duas; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own duas" ON public.duas FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: dua_folders Users can update their own folders; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own folders" ON public.dua_folders FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: user_gamification Users can update their own gamification; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own gamification" ON public.user_gamification FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: habit_logs Users can update their own habit logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own habit logs" ON public.habit_logs FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: habit_stats Users can update their own habit stats; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own habit stats" ON public.habit_stats FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: habits Users can update their own habits; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own habits" ON public.habits FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: notifications Users can update their own notifications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own notifications" ON public.notifications FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: profiles Users can update their own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING ((auth.uid() = id));


--
-- Name: reflections Users can update their own reflections; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own reflections" ON public.reflections FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: profiles Users can view own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING ((auth.uid() = id));


--
-- Name: user_achievements Users can view their own achievements; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own achievements" ON public.user_achievements FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: quiz_attempts Users can view their own attempts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own attempts" ON public.quiz_attempts FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: calendar_items Users can view their own calendar items; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own calendar items" ON public.calendar_items FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: companion_profiles Users can view their own companion profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own companion profile" ON public.companion_profiles FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: dhikr_sessions Users can view their own dhikr sessions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own dhikr sessions" ON public.dhikr_sessions FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: duas Users can view their own duas; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own duas" ON public.duas FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: dua_folders Users can view their own folders; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own folders" ON public.dua_folders FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: user_gamification Users can view their own gamification; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own gamification" ON public.user_gamification FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: habit_logs Users can view their own habit logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own habit logs" ON public.habit_logs FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: habit_stats Users can view their own habit stats; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own habit stats" ON public.habit_stats FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: habits Users can view their own habits; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own habits" ON public.habits FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: notifications Users can view their own notifications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own notifications" ON public.notifications FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: reflections Users can view their own reflections; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own reflections" ON public.reflections FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: user_roles Users can view their own roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: achievements; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

--
-- Name: calendar_items; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.calendar_items ENABLE ROW LEVEL SECURITY;

--
-- Name: companion_profiles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.companion_profiles ENABLE ROW LEVEL SECURITY;

--
-- Name: daily_quizzes; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.daily_quizzes ENABLE ROW LEVEL SECURITY;

--
-- Name: dhikr_sessions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.dhikr_sessions ENABLE ROW LEVEL SECURITY;

--
-- Name: dua_folders; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.dua_folders ENABLE ROW LEVEL SECURITY;

--
-- Name: duas; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.duas ENABLE ROW LEVEL SECURITY;

--
-- Name: habit_logs; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.habit_logs ENABLE ROW LEVEL SECURITY;

--
-- Name: habit_stats; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.habit_stats ENABLE ROW LEVEL SECURITY;

--
-- Name: habits; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;

--
-- Name: notifications; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

--
-- Name: prayer_times_cache; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.prayer_times_cache ENABLE ROW LEVEL SECURITY;

--
-- Name: profiles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

--
-- Name: quiz_attempts; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

--
-- Name: reflections; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.reflections ENABLE ROW LEVEL SECURITY;

--
-- Name: user_achievements; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

--
-- Name: user_gamification; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_gamification ENABLE ROW LEVEL SECURITY;

--
-- Name: user_roles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--




COMMIT;