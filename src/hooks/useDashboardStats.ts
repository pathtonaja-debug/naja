// Hook for dashboard overview statistics
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getAuthenticatedUserId } from "@/lib/auth";
import { format, startOfWeek, endOfWeek, differenceInDays } from "date-fns";

export interface DashboardStats {
  prayersCompleted: number;
  prayersTotal: number;
  habitsCompleted: number;
  habitsTotal: number;
  dhikrCount: number;
  currentStreak: number;
}

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats>({
    prayersCompleted: 0,
    prayersTotal: 5,
    habitsCompleted: 0,
    habitsTotal: 0,
    dhikrCount: 0,
    currentStreak: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const userId = await getAuthenticatedUserId();
      const today = format(new Date(), "yyyy-MM-dd");
      const weekStart = format(startOfWeek(new Date(), { weekStartsOn: 1 }), "yyyy-MM-dd");
      const weekEnd = format(endOfWeek(new Date(), { weekStartsOn: 1 }), "yyyy-MM-dd");

      // Fetch active habits with category
      const { data: habitsData } = await supabase
        .from("habits")
        .select("id, category")
        .eq("user_id", userId)
        .eq("is_active", true);

      const habitsTotal = habitsData?.length || 0;
      const prayerHabitIds = habitsData?.filter(h => h.category === "Prayer").map(h => h.id) || [];
      const prayersTotal = prayerHabitIds.length || 5;

      // Fetch today's completed habits
      const { data: todayLogs } = await supabase
        .from("habit_logs")
        .select("habit_id, completed")
        .eq("user_id", userId)
        .eq("date", today)
        .eq("completed", true);

      const habitsCompleted = todayLogs?.length || 0;
      
      // Count completed prayers from habit logs
      const prayersCompleted = todayLogs?.filter(log => prayerHabitIds.includes(log.habit_id)).length || 0;

      // Fetch today's dhikr count
      const { data: dhikrData } = await supabase
        .from("dhikr_sessions")
        .select("count")
        .eq("user_id", userId)
        .eq("date", today);

      const dhikrCount = dhikrData?.reduce((sum, d) => sum + (d.count || 0), 0) || 0;

      // Calculate streak from habit logs
      const { data: allLogs } = await supabase
        .from("habit_logs")
        .select("date")
        .eq("user_id", userId)
        .eq("completed", true)
        .order("date", { ascending: false })
        .limit(60);

      const uniqueDays = new Set(allLogs?.map((l) => l.date) || []);
      
      // Calculate consecutive day streak
      let currentStreak = 0;
      const todayDate = new Date();
      for (let i = 0; i < 60; i++) {
        const checkDate = format(
          new Date(todayDate.getTime() - i * 24 * 60 * 60 * 1000),
          "yyyy-MM-dd"
        );
        if (uniqueDays.has(checkDate)) {
          currentStreak++;
        } else if (i > 0) {
          // Allow today to be missing (user might not have logged yet)
          break;
        }
      }

      setStats({
        prayersCompleted,
        prayersTotal,
        habitsCompleted,
        habitsTotal,
        dhikrCount,
        currentStreak,
      });
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { stats, loading, refetch: fetchStats };
}
