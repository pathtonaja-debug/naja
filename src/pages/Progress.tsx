import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress as ProgressBar } from "@/components/ui/progress";
import { ArrowLeft, Flame } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getAuthenticatedUserId } from "@/lib/auth";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from "date-fns";

interface ProgressStats {
  currentStreak: number;
  bestStreak: number;
  weeklyConsistency: number;
  completedDays: Date[];
  totalCompletions: number;
  weeklyGoal: number;
}

const Progress = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<ProgressStats>({
    currentStreak: 0,
    bestStreak: 0,
    weeklyConsistency: 0,
    completedDays: [],
    totalCompletions: 0,
    weeklyGoal: 7
  });

  useEffect(() => {
    loadProgressStats();
  }, []);

  const loadProgressStats = async () => {
    try {
      const userId = await getAuthenticatedUserId();
      const now = new Date();
      const weekStart = startOfWeek(now, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

      // Fetch habit logs for the week
      const { data: habitLogs } = await supabase
        .from('habit_logs')
        .select('*')
        .eq('user_id', userId)
        .gte('date', format(weekStart, 'yyyy-MM-dd'))
        .lte('date', format(weekEnd, 'yyyy-MM-dd'));

      // Calculate stats
      const completedDays = habitLogs
        ? [...new Set(habitLogs.filter(log => log.completed).map(log => log.date))]
            .map(date => new Date(date))
        : [];

      const totalCompletions = habitLogs?.filter(log => log.completed).length || 0;
      const weeklyConsistency = completedDays.length > 0 
        ? Math.round((completedDays.length / 7) * 100) 
        : 0;

      // Calculate streaks
      const { currentStreak, bestStreak } = calculateStreaks(completedDays);

      setStats({
        currentStreak,
        bestStreak,
        weeklyConsistency,
        completedDays,
        totalCompletions,
        weeklyGoal: 7
      });
    } catch (error) {
      console.error("Failed to load progress stats:", error);
    }
  };

  const calculateStreaks = (dates: Date[]) => {
    if (dates.length === 0) return { currentStreak: 0, bestStreak: 0 };

    const sortedDates = dates.sort((a, b) => a.getTime() - b.getTime());
    let currentStreak = 1;
    let bestStreak = 1;
    let tempStreak = 1;

    for (let i = 1; i < sortedDates.length; i++) {
      const diffDays = Math.floor((sortedDates[i].getTime() - sortedDates[i-1].getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        tempStreak++;
        bestStreak = Math.max(bestStreak, tempStreak);
      } else {
        tempStreak = 1;
      }
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastDate = sortedDates[sortedDates.length - 1];
    lastDate.setHours(0, 0, 0, 0);
    const daysSinceLastActivity = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

    if (daysSinceLastActivity <= 1) {
      currentStreak = tempStreak;
    } else {
      currentStreak = 0;
    }

    return { currentStreak, bestStreak };
  };

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weekDates = eachDayOfInterval({ 
    start: startOfWeek(new Date(), { weekStartsOn: 1 }), 
    end: endOfWeek(new Date(), { weekStartsOn: 1 }) 
  });

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-10 bg-background border-b border-border px-6 py-4">
        <div className="flex items-center gap-3">
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold text-foreground">Progress</h1>
        </div>
      </header>

      <main className="px-6 pt-6 space-y-6">
        {/* Current Streak Card */}
        <Card className="bg-accent border-none rounded-3xl p-8 text-center">
          <p className="text-accent-foreground/70 text-sm mb-4">Current Streak</p>
          <div className="flex items-center justify-center gap-3 mb-3">
            <Flame className="w-10 h-10 text-primary" />
            <span className="text-6xl font-bold text-accent-foreground">{stats.currentStreak}</span>
          </div>
          <p className="text-accent-foreground/70 text-lg mb-6">Days in a row</p>
          
          <div className="h-px bg-accent-foreground/10 my-6" />
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-3xl font-bold text-accent-foreground mb-1">{stats.bestStreak}</p>
              <p className="text-accent-foreground/70 text-sm">Best Streak</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-accent-foreground mb-1">{stats.weeklyConsistency}%</p>
              <p className="text-accent-foreground/70 text-sm">This Week</p>
            </div>
          </div>
        </Card>

        {/* Weekly Summary Card */}
        <Card className="border-border bg-card rounded-3xl p-6">
          <h3 className="text-foreground font-medium text-lg mb-4">Weekly Summary</h3>
          
          <div className="grid grid-cols-7 gap-2 mb-6">
            {weekDays.map((day, i) => {
              const isCompleted = stats.completedDays.some(d => isSameDay(d, weekDates[i]));
              const isToday = isSameDay(weekDates[i], new Date());
              
              return (
                <div key={day} className="text-center">
                  <p className="text-xs text-muted-foreground mb-2">{day}</p>
                  <div className={`w-full h-2 rounded-full ${
                    isCompleted ? 'bg-primary' : isToday ? 'bg-muted' : 'bg-muted/50'
                  }`} />
                </div>
              );
            })}
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Weekly Consistency</span>
                <span className="text-sm font-medium text-foreground">{stats.weeklyConsistency}%</span>
              </div>
              <ProgressBar value={stats.weeklyConsistency} className="h-2" />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.totalCompletions}</p>
                <p className="text-sm text-muted-foreground">Completions this week</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-foreground">{stats.completedDays.length}/7</p>
                <p className="text-sm text-muted-foreground">Active days</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Tips Card */}
        <Card className="border-border bg-card rounded-3xl p-6">
          <h3 className="text-foreground font-medium text-lg mb-3">💡 Keep Going!</h3>
          <p className="text-muted-foreground text-sm">
            Consistency is key. Even a small act of worship counts. Keep building your spiritual habits one day at a time.
          </p>
        </Card>
      </main>

      <BottomNav />
    </div>
  );
};

export default Progress;
