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

      // Fetch active habits count
      const { data: habitsData } = await supabase
        .from("habits")
        .select("id")
        .eq("user_id", userId)
        .eq("is_active", true);

      const habitsTotal = habitsData?.length || 0;

      // Fetch today's completed habits
      const { data: todayLogs } = await supabase
        .from("habit_logs")
        .select("*")
        .eq("user_id", userId)
        .eq("date", today)
        .eq("completed", true);

      const habitsCompleted = todayLogs?.length || 0;

      // Fetch today's dhikr count
      const { data: dhikrData } = await supabase
        .from("dhikr_sessions")
        .select("count")
        .eq("user_id", userId)
        .eq("date", today);

      const dhikrCount = dhikrData?.reduce((sum, d) => sum + (d.count || 0), 0) || 0;

      // Calculate prayer completion based on time (simple logic)
      const now = new Date();
      const currentHour = now.getHours();
      let prayersCompleted = 0;
      
      // Simple time-based estimation (can be enhanced with actual tracking)
      if (currentHour >= 6) prayersCompleted = 1; // Fajr
      if (currentHour >= 13) prayersCompleted = 2; // Dhuhr
      if (currentHour >= 16) prayersCompleted = 3; // Asr
      if (currentHour >= 18) prayersCompleted = 4; // Maghrib
      if (currentHour >= 20) prayersCompleted = 5; // Isha

      // Calculate streak from habit logs
      const { data: weekLogs } = await supabase
        .from("habit_logs")
        .select("date")
        .eq("user_id", userId)
        .eq("completed", true)
        .gte("date", weekStart)
        .lte("date", weekEnd);

      const uniqueDays = new Set(weekLogs?.map((l) => l.date) || []);
      
      // Simple streak calculation (consecutive days)
      let currentStreak = 0;
      const todayDate = new Date();
      for (let i = 0; i < 30; i++) {
        const checkDate = format(
          new Date(todayDate.getTime() - i * 24 * 60 * 60 * 1000),
          "yyyy-MM-dd"
        );
        if (uniqueDays.has(checkDate) || i === 0) {
          currentStreak++;
        } else {
          break;
        }
      }

      setStats({
        prayersCompleted,
        prayersTotal: 5,
        habitsCompleted,
        habitsTotal,
        dhikrCount,
        currentStreak: Math.max(1, currentStreak - 1), // Adjust for today
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
