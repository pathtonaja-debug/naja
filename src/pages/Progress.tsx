import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress as ProgressBar } from "@/components/ui/progress";
import { ArrowLeft, Flame } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getAuthenticatedUserId } from "@/lib/auth";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, subDays } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import crescentWatercolor from "@/assets/illustrations/crescent-watercolor.png";
import tasbihWatercolor from "@/assets/illustrations/tasbih-watercolor.png";

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
  const [loading, setLoading] = useState(true);
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
      setLoading(true);
      const userId = await getAuthenticatedUserId();
      const now = new Date();
      const weekStart = startOfWeek(now, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

      const { data: habitLogs } = await supabase
        .from('habit_logs')
        .select('*')
        .eq('user_id', userId)
        .gte('date', format(weekStart, 'yyyy-MM-dd'))
        .lte('date', format(weekEnd, 'yyyy-MM-dd'));

      const completedDays = habitLogs
        ? [...new Set(habitLogs.filter(log => log.completed).map(log => log.date))]
            .map(date => new Date(date))
        : [];

      const totalCompletions = habitLogs?.filter(log => log.completed).length || 0;
      const weeklyConsistency = completedDays.length > 0 
        ? Math.round((completedDays.length / 7) * 100) 
        : 0;

      const thirtyDaysAgo = format(subDays(now, 30), 'yyyy-MM-dd');
      const { data: allLogs } = await supabase
        .from('habit_logs')
        .select('date, completed')
        .eq('user_id', userId)
        .eq('completed', true)
        .gte('date', thirtyDaysAgo)
        .order('date', { ascending: false });

      const { currentStreak, bestStreak } = calculateStreaks(allLogs || []);

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
    } finally {
      setLoading(false);
    }
  };

  const calculateStreaks = (logs: { date: string; completed: boolean }[]) => {
    if (!logs || logs.length === 0) return { currentStreak: 0, bestStreak: 0 };

    const uniqueDates = [...new Set(logs.map(l => l.date))].sort().reverse();
    
    if (uniqueDates.length === 0) return { currentStreak: 0, bestStreak: 0 };

    const today = format(new Date(), 'yyyy-MM-dd');
    const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');

    let currentStreak = 0;
    let checkDate = today;
    
    if (uniqueDates.includes(today)) {
      checkDate = today;
    } else if (uniqueDates.includes(yesterday)) {
      checkDate = yesterday;
    } else {
      return { currentStreak: 0, bestStreak: calculateBestStreak(uniqueDates) };
    }

    for (let i = 0; i < 30; i++) {
      const dateToCheck = format(subDays(new Date(checkDate), i), 'yyyy-MM-dd');
      if (uniqueDates.includes(dateToCheck)) {
        currentStreak++;
      } else if (i > 0) {
        break;
      }
    }

    const bestStreak = calculateBestStreak(uniqueDates);

    return { currentStreak, bestStreak: Math.max(currentStreak, bestStreak) };
  };

  const calculateBestStreak = (dates: string[]) => {
    if (dates.length === 0) return 0;

    const sortedDates = dates.sort();
    let maxStreak = 1;
    let currentStreak = 1;

    for (let i = 1; i < sortedDates.length; i++) {
      const prevDate = new Date(sortedDates[i - 1]);
      const currDate = new Date(sortedDates[i]);
      const diffDays = Math.round((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 1;
      }
    }

    return maxStreak;
  };

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weekDates = eachDayOfInterval({ 
    start: startOfWeek(new Date(), { weekStartsOn: 1 }), 
    end: endOfWeek(new Date(), { weekStartsOn: 1 }) 
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-24">
        <header className="sticky top-0 z-10 bg-background border-b border-border px-6 py-4">
          <div className="flex items-center gap-3">
            <Button size="icon" variant="ghost" onClick={() => navigate('/dashboard')} className="rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-semibold text-foreground">Progress</h1>
          </div>
        </header>
        <main className="px-6 pt-6 space-y-6">
          <Skeleton className="h-64 rounded-3xl" />
          <Skeleton className="h-48 rounded-3xl" />
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-background pb-24 relative overflow-hidden"
    >
      {/* Watercolor decorations */}
      <motion.img 
        src={crescentWatercolor}
        alt=""
        className="absolute top-20 right-0 w-32 h-32 object-contain opacity-25 pointer-events-none"
        initial={{ opacity: 0, rotate: -10 }}
        animate={{ opacity: 0.25, rotate: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      />
      <motion.img 
        src={tasbihWatercolor}
        alt=""
        className="absolute bottom-40 left-0 w-28 h-28 object-contain opacity-20 pointer-events-none"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 0.2, x: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      />

      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border px-4 py-2.5">
        <div className="flex items-center gap-2">
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="rounded-full h-8 w-8"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-lg font-semibold text-foreground">Progress</h1>
        </div>
      </header>

      <main className="px-4 pt-4 space-y-4">
        {/* Current Streak Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-accent border-none rounded-2xl p-5 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
            <div className="relative">
              <p className="text-accent-foreground/70 text-[13px] mb-3">Current Streak</p>
              <div className="flex items-center justify-center gap-2 mb-2">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Flame className="w-8 h-8 text-primary" />
                </motion.div>
                <span className="text-5xl font-bold text-accent-foreground">{stats.currentStreak}</span>
              </div>
              <p className="text-accent-foreground/70 text-base mb-4">Days in a row</p>
              
              <div className="h-px bg-accent-foreground/10 my-4" />
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-2xl font-bold text-accent-foreground mb-0.5">{stats.bestStreak}</p>
                  <p className="text-accent-foreground/70 text-[13px]">Best Streak</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-accent-foreground mb-0.5">{stats.weeklyConsistency}%</p>
                  <p className="text-accent-foreground/70 text-[13px]">This Week</p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Weekly Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-border bg-card rounded-2xl p-4">
            <h3 className="text-foreground font-medium text-[15px] mb-3">Weekly Summary</h3>
            
            <div className="grid grid-cols-7 gap-1.5 mb-4">
              {weekDays.map((day, i) => {
                const isCompleted = stats.completedDays.some(d => isSameDay(d, weekDates[i]));
                const isToday = isSameDay(weekDates[i], new Date());
                
                return (
                  <motion.div 
                    key={day} 
                    className="text-center"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.25 + i * 0.05 }}
                  >
                    <p className="text-[10px] text-muted-foreground mb-1.5">{day}</p>
                    <div className={`w-full h-1.5 rounded-full transition-all ${
                      isCompleted ? 'bg-primary' : isToday ? 'bg-muted' : 'bg-muted/50'
                    }`} />
                  </motion.div>
                );
              })}
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[13px] text-muted-foreground">Weekly Consistency</span>
                  <span className="text-[13px] font-medium text-foreground">{stats.weeklyConsistency}%</span>
                </div>
                <ProgressBar value={stats.weeklyConsistency} className="h-1.5" />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div>
                  <p className="text-xl font-bold text-foreground">{stats.totalCompletions}</p>
                  <p className="text-[12px] text-muted-foreground">Completions this week</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-foreground">{stats.completedDays.length}/7</p>
                  <p className="text-[12px] text-muted-foreground">Active days</p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Tips Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-border bg-card rounded-2xl p-4">
            <h3 className="text-foreground font-medium text-[15px] mb-2">Keep Going!</h3>
            <p className="text-muted-foreground text-[13px]">
              Consistency is key. Even a small act of worship counts. Keep building your spiritual habits one day at a time.
            </p>
          </Card>
        </motion.div>
      </main>

      <BottomNav />
    </motion.div>
  );
};

export default Progress;
