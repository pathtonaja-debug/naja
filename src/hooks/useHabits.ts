// Hook for managing habits data
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getAuthenticatedUserId } from "@/lib/auth";
import { format } from "date-fns";

export interface Habit {
  id: string;
  name: string;
  category: string | null;
  icon: string | null;
  target_count: number | null;
  is_active: boolean | null;
}

export interface HabitLog {
  id: string;
  habit_id: string;
  date: string;
  completed: boolean | null;
  count: number | null;
}

export interface HabitWithLog extends Habit {
  todayCompleted: boolean;
  todayCount: number;
  streak: number;
}

export function useHabits() {
  const [habits, setHabits] = useState<HabitWithLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHabits = useCallback(async () => {
    try {
      setLoading(true);
      const userId = await getAuthenticatedUserId();
      const today = format(new Date(), "yyyy-MM-dd");

      // Fetch all active habits
      const { data: habitsData, error: habitsError } = await supabase
        .from("habits")
        .select("*")
        .eq("user_id", userId)
        .eq("is_active", true);

      if (habitsError) throw habitsError;

      // Fetch today's logs
      const { data: logsData, error: logsError } = await supabase
        .from("habit_logs")
        .select("*")
        .eq("user_id", userId)
        .eq("date", today);

      if (logsError) throw logsError;

      // Fetch habit stats for streaks
      const { data: statsData } = await supabase
        .from("habit_stats")
        .select("habit_id, current_streak")
        .eq("user_id", userId);

      const statsMap = new Map(
        statsData?.map((s) => [s.habit_id, s.current_streak]) || []
      );
      const logsMap = new Map(logsData?.map((l) => [l.habit_id, l]) || []);

      const habitsWithLogs: HabitWithLog[] = (habitsData || []).map((habit) => {
        const log = logsMap.get(habit.id);
        return {
          ...habit,
          todayCompleted: log?.completed ?? false,
          todayCount: log?.count ?? 0,
          streak: statsMap.get(habit.id) ?? 0,
        };
      });

      setHabits(habitsWithLogs);
    } catch (error) {
      console.error("Failed to fetch habits:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleHabit = async (habitId: string) => {
    try {
      const userId = await getAuthenticatedUserId();
      const today = format(new Date(), "yyyy-MM-dd");

      // Check if log exists
      const { data: existingLog } = await supabase
        .from("habit_logs")
        .select("*")
        .eq("habit_id", habitId)
        .eq("date", today)
        .maybeSingle();

      if (existingLog) {
        // Toggle completion
        await supabase
          .from("habit_logs")
          .update({ completed: !existingLog.completed })
          .eq("id", existingLog.id);
      } else {
        // Create new log
        await supabase.from("habit_logs").insert({
          habit_id: habitId,
          user_id: userId,
          date: today,
          completed: true,
          count: 1,
        });
      }

      await fetchHabits();
    } catch (error) {
      console.error("Failed to toggle habit:", error);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  return { habits, loading, toggleHabit, refetch: fetchHabits };
}

// Hook for dashboard habit preview (limited to top 3)
export function useHabitPreview() {
  const { habits, loading } = useHabits();

  const previewHabits = habits.slice(0, 3).map((habit) => ({
    id: habit.id,
    icon: habit.icon || "star",
    name: habit.name,
    category: habit.category || "General",
    progress: habit.streak,
    total: 7, // Weekly progress
    completed: habit.todayCompleted,
  }));

  return { previewHabits, loading };
}
