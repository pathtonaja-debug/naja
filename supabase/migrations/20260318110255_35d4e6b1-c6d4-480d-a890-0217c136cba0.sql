
-- Friendships (accountability partners) table
CREATE TABLE IF NOT EXISTS public.friendships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  friend_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  invite_code text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  accepted_at timestamptz,
  UNIQUE(user_id, friend_id)
);

ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own friendships"
  ON public.friendships FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() = friend_id);

CREATE POLICY "Users can create friendships"
  ON public.friendships FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own friendships"
  ON public.friendships FOR UPDATE
  USING (auth.uid() = user_id OR auth.uid() = friend_id);

CREATE POLICY "Users can delete own friendships"
  ON public.friendships FOR DELETE
  USING (auth.uid() = user_id OR auth.uid() = friend_id);

-- Group goals table
CREATE TABLE IF NOT EXISTS public.group_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  goal_type text NOT NULL DEFAULT 'quran',
  target integer NOT NULL DEFAULT 100,
  progress integer NOT NULL DEFAULT 0,
  invite_code text NOT NULL UNIQUE DEFAULT substr(md5(random()::text), 1, 8),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.group_goals ENABLE ROW LEVEL SECURITY;

-- Group goal members
CREATE TABLE IF NOT EXISTS public.group_goal_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_goal_id uuid NOT NULL REFERENCES public.group_goals(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  contribution integer NOT NULL DEFAULT 0,
  joined_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(group_goal_id, user_id)
);

ALTER TABLE public.group_goal_members ENABLE ROW LEVEL SECURITY;

-- Group goals policies - members can view
CREATE POLICY "Members can view group goals"
  ON public.group_goals FOR SELECT
  USING (
    auth.uid() = creator_id OR
    EXISTS (SELECT 1 FROM public.group_goal_members WHERE group_goal_id = id AND user_id = auth.uid())
  );

CREATE POLICY "Creators can insert group goals"
  ON public.group_goals FOR INSERT
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can update group goals"
  ON public.group_goals FOR UPDATE
  USING (auth.uid() = creator_id);

CREATE POLICY "Creators can delete group goals"
  ON public.group_goals FOR DELETE
  USING (auth.uid() = creator_id);

-- Group goal members policies
CREATE POLICY "Members can view group goal members"
  ON public.group_goal_members FOR SELECT
  USING (
    auth.uid() = user_id OR
    EXISTS (SELECT 1 FROM public.group_goals WHERE id = group_goal_id AND creator_id = auth.uid())
  );

CREATE POLICY "Users can join group goals"
  ON public.group_goal_members FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own contribution"
  ON public.group_goal_members FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can leave group goals"
  ON public.group_goal_members FOR DELETE
  USING (auth.uid() = user_id);

-- Add invite_code column to profiles for accountability partners
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS invite_code text UNIQUE DEFAULT substr(md5(random()::text), 1, 8);
