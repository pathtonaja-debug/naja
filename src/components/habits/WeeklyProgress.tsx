import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { getHabitProgress } from "@/services/db";

export default function WeeklyProgress() {
  const [progressData, setProgressData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgress();
  }, []);

  async function loadProgress() {
    try {
      const data = await getHabitProgress(undefined, 7);
      setProgressData(data);
    } catch (error) {
      console.error("Error loading progress:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return null;

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const today = new Date().getDay();
  const adjustedToday = today === 0 ? 6 : today - 1;

  // Calculate daily completion rates
  const dailyRates = days.map((_, idx) => {
    const date = new Date();
    date.setDate(date.getDate() - (adjustedToday - idx));
    const dateStr = date.toISOString().split('T')[0];
    
    const logsForDay = progressData?.logs?.filter((l: any) => l.date === dateStr) || [];
    const completedCount = logsForDay.filter((l: any) => l.completed).length;
    const totalHabits = progressData?.habits?.length || 1;
    
    return (completedCount / totalHabits) * 100;
  });

  return (
    <Card className="backdrop-blur-3xl bg-gradient-to-br from-lilac/30 to-sky/20 border-white/15 rounded-[2rem] p-6">
      <h3 className="text-lg font-medium text-foreground mb-4">Weekly Progress</h3>
      <div className="flex items-end justify-between gap-2 h-32">
        {days.map((day, idx) => (
          <div key={day} className="flex-1 flex flex-col items-center gap-2">
            <div className="flex-1 w-full flex items-end">
              <div
                className="w-full rounded-t-xl bg-gradient-to-t from-olive/60 to-olive/40 backdrop-blur-xl border border-white/20 transition-all duration-300"
                style={{ height: `${Math.max(dailyRates[idx], 5)}%` }}
              />
            </div>
            <span className={`text-xs ${idx === adjustedToday ? 'text-foreground font-medium' : 'text-foreground/60'}`}>
              {day}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
