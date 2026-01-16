-- Fix function search_path for update_gamification_timestamp
CREATE OR REPLACE FUNCTION public.update_gamification_timestamp()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- Fix overly permissive RLS policy on daily_quizzes
-- First drop the old policy
DROP POLICY IF EXISTS "Service role can insert quizzes" ON public.daily_quizzes;

-- Create a more secure policy that only allows service role (via security definer functions)
-- For now, we'll restrict to authenticated users with admin role
CREATE POLICY "Admins can insert quizzes"
ON public.daily_quizzes
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Also add a policy for selecting quizzes (public read is fine)
CREATE POLICY "Anyone can view quizzes"
ON public.daily_quizzes
FOR SELECT
USING (true);