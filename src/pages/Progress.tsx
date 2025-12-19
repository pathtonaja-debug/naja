import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getAuthenticatedUserId } from "@/lib/auth";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, subDays, subWeeks, startOfMonth, eachWeekOfInterval } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface HabitData {
  id: string;
  name: string;
  icon: string;
  color: string;
  frequency: string;
  completedDates: string[];
}

interface ProgressStats {
  currentStreak: number;
  bestStreak: number;
  successRate: number;
  completedHabits: number;
}

const Progress = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'today' | 'weekly' | 'overall'>('weekly');
  const [habits, setHabits] = useState<HabitData[]>([]);
  const [stats, setStats] = useState<ProgressStats>({
    currentStreak: 0,
    bestStreak: 0,
    successRate: 0,
    completedHabits: 0
  });

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weekDates = eachDayOfInterval({ 
    start: startOfWeek(new Date(), { weekStartsOn: 1 }), 
    end: endOfWeek(new Date(), { weekStartsOn: 1 }) 
  });

  // Get last 8 weeks for heatmap
  const weeksForHeatmap = useMemo(() => {
    const weeks: Date[][] = [];
    for (let i = 7; i >= 0; i--) {
      const weekStart = startOfWeek(subWeeks(new Date(), i), { weekStartsOn: 1 });
      const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
      weeks.push(eachDayOfInterval({ start: weekStart, end: weekEnd }));
    }
    return weeks;
  }, []);

  useEffect(() => {
    loadProgressData();
  }, []);

  const loadProgressData = async () => {
    try {
      setLoading(true);
      const userId = await getAuthenticatedUserId();
      
      // Load habits
      const { data: habitsData } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true);

      // Load habit logs for the last 60 days
      const sixtyDaysAgo = format(subDays(new Date(), 60), 'yyyy-MM-dd');
      const { data: logsData } = await supabase
        .from('habit_logs')
        .select('*')
        .eq('user_id', userId)
        .eq('completed', true)
        .gte('date', sixtyDaysAgo);

      // Map habits with their completed dates
      const habitsWithLogs: HabitData[] = (habitsData || []).map(habit => ({
        id: habit.id,
        name: habit.name,
        icon: habit.icon || '📋',
        color: habit.color || 'pink',
        frequency: habit.frequency || 'daily',
        completedDates: (logsData || [])
          .filter(log => log.habit_id === habit.id)
          .map(log => log.date)
      }));

      setHabits(habitsWithLogs);

      // Calculate stats
      const allCompletedDates = [...new Set((logsData || []).map(log => log.date))];
      const currentStreak = calculateCurrentStreak(allCompletedDates);
      const bestStreak = calculateBestStreak(allCompletedDates);
      const successRate = calculateSuccessRate(logsData || [], habitsData?.length || 1);
      
      setStats({
        currentStreak,
        bestStreak,
        successRate,
        completedHabits: logsData?.length || 0
      });
    } catch (error) {
      console.error("Failed to load progress:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateCurrentStreak = (dates: string[]) => {
    if (dates.length === 0) return 0;
    const sortedDates = [...dates].sort().reverse();
    const today = format(new Date(), 'yyyy-MM-dd');
    const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');
    
    let streak = 0;
    let checkDate = sortedDates.includes(today) ? today : yesterday;
    
    if (!sortedDates.includes(today) && !sortedDates.includes(yesterday)) {
      return 0;
    }

    for (let i = 0; i < 60; i++) {
      const dateToCheck = format(subDays(new Date(checkDate), i), 'yyyy-MM-dd');
      if (sortedDates.includes(dateToCheck)) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    return streak;
  };

  const calculateBestStreak = (dates: string[]) => {
    if (dates.length === 0) return 0;
    const sortedDates = [...dates].sort();
    let maxStreak = 1, currentStreak = 1;

    for (let i = 1; i < sortedDates.length; i++) {
      const diff = Math.round(
        (new Date(sortedDates[i]).getTime() - new Date(sortedDates[i - 1]).getTime()) / (1000 * 60 * 60 * 24)
      );
      if (diff === 1) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 1;
      }
    }
    return maxStreak;
  };

  const calculateSuccessRate = (logs: any[], habitCount: number) => {
    if (habitCount === 0) return 0;
    const days = 30;
    const expectedCompletions = days * habitCount;
    const actualCompletions = logs.length;
    return Math.min(100, Math.round((actualCompletions / expectedCompletions) * 100));
  };

  const getHabitColor = (color: string) => {
    const colors: Record<string, { bg: string; fill: string }> = {
      pink: { bg: 'bg-pastel-pink-soft', fill: 'bg-pastel-pink' },
      blue: { bg: 'bg-pastel-blue-soft', fill: 'bg-pastel-blue' },
      green: { bg: 'bg-pastel-green-soft', fill: 'bg-pastel-green' },
      lavender: { bg: 'bg-pastel-lavender-soft', fill: 'bg-pastel-lavender' },
      yellow: { bg: 'bg-pastel-yellow-soft', fill: 'bg-pastel-yellow' },
    };
    return colors[color] || colors.pink;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-safe-bottom">
        <header className="sticky top-0 z-10 bg-background px-4 py-3">
          <h1 className="text-title-2 text-center text-foreground">Statistics</h1>
        </header>
        <main className="px-4 space-y-3">
          <Skeleton className="h-10 rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-40 rounded-xl" />
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background pb-safe-bottom"
    >
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background px-4 py-3">
        <h1 className="text-title-2 text-center text-foreground font-semibold">Statistics</h1>
      </header>

      <main className="px-4 space-y-4">
        {/* Tab Selector */}
        <div className="flex bg-muted rounded-xl p-1">
          {(['today', 'weekly', 'overall'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all capitalize",
                activeTab === tab
                  ? "bg-card shadow-sm text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Summary Stats - Only show on Overall tab */}
        {activeTab === 'overall' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-headline font-semibold text-foreground mb-2">Summary:</h3>
            <div className="grid grid-cols-2 gap-3">
              <Card className="p-3 bg-card border-border/50 rounded-xl">
                <p className="text-caption text-muted-foreground">Current streak</p>
                <p className="text-title-2 font-bold text-foreground">{stats.currentStreak} days</p>
              </Card>
              <Card className="p-3 bg-card border-border/50 rounded-xl">
                <p className="text-caption text-muted-foreground">Success rate</p>
                <p className="text-title-2 font-bold text-foreground">{stats.successRate}%</p>
              </Card>
              <Card className="p-3 bg-card border-border/50 rounded-xl">
                <p className="text-caption text-muted-foreground">Best streak day</p>
                <p className="text-title-2 font-bold text-foreground">{stats.bestStreak} days</p>
              </Card>
              <Card className="p-3 bg-card border-border/50 rounded-xl">
                <p className="text-caption text-muted-foreground">Completed habits</p>
                <p className="text-title-2 font-bold text-foreground">{stats.completedHabits}</p>
              </Card>
            </div>
          </motion.div>
        )}

        {/* Habits List with Progress */}
        <div className="space-y-3">
          {habits.length === 0 ? (
            <Card className="p-6 text-center bg-card border-border/50 rounded-xl">
              <p className="text-muted-foreground">No habits yet. Create your first habit!</p>
              <Button 
                onClick={() => navigate('/habits')}
                className="mt-3 bg-pastel-pink text-foreground hover:bg-pastel-pink/80"
              >
                Add Habit
              </Button>
            </Card>
          ) : (
            habits.map((habit, index) => (
              <motion.div
                key={habit.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-3 bg-card border-border/50 rounded-xl">
                  {/* Habit Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{habit.icon}</span>
                      <span className="font-medium text-foreground text-sm">{habit.name}</span>
                    </div>
                    <span className="text-caption text-muted-foreground capitalize">
                      {habit.frequency === 'daily' ? 'Everyday' : habit.frequency}
                    </span>
                  </div>

                  {/* Weekly View - Circle indicators */}
                  {activeTab === 'weekly' && (
                    <div className="flex justify-between">
                      {weekDays.map((day, i) => {
                        const date = weekDates[i];
                        const dateStr = format(date, 'yyyy-MM-dd');
                        const isCompleted = habit.completedDates.includes(dateStr);
                        const colorClasses = getHabitColor(habit.color);
                        
                        return (
                          <div key={day} className="flex flex-col items-center gap-1">
                            <span className="text-caption-1 text-muted-foreground">{day}</span>
                            <motion.div
                              initial={isCompleted ? { scale: 0 } : {}}
                              animate={isCompleted ? { scale: 1 } : {}}
                              className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                                isCompleted ? colorClasses.fill : "bg-muted/50"
                              )}
                            >
                              {isCompleted && (
                                <Check className="w-4 h-4 text-foreground" />
                              )}
                            </motion.div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Overall View - Heatmap Grid */}
                  {activeTab === 'overall' && (
                    <div className="space-y-1">
                      {weekDays.map((day, dayIndex) => (
                        <div key={day} className="flex items-center gap-1">
                          <span className="text-caption-2 text-muted-foreground w-4">{day.charAt(0)}</span>
                          <div className="flex gap-0.5 flex-1">
                            {weeksForHeatmap.map((week, weekIndex) => {
                              const date = week[dayIndex];
                              const dateStr = format(date, 'yyyy-MM-dd');
                              const isCompleted = habit.completedDates.includes(dateStr);
                              const colorClasses = getHabitColor(habit.color);
                              const isFuture = date > new Date();
                              
                              return (
                                <motion.div
                                  key={`${dayIndex}-${weekIndex}`}
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: (dayIndex * 8 + weekIndex) * 0.005 }}
                                  className={cn(
                                    "flex-1 aspect-square rounded-sm min-w-[10px] max-w-[14px]",
                                    isFuture ? "bg-transparent" : isCompleted ? colorClasses.fill : colorClasses.bg
                                  )}
                                />
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Today View - Single day status */}
                  {activeTab === 'today' && (
                    <div className="flex items-center justify-center py-4">
                      {(() => {
                        const today = format(new Date(), 'yyyy-MM-dd');
                        const isCompleted = habit.completedDates.includes(today);
                        const colorClasses = getHabitColor(habit.color);
                        
                        return (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className={cn(
                              "w-16 h-16 rounded-full flex items-center justify-center",
                              isCompleted ? colorClasses.fill : "bg-muted/50 border-2 border-dashed border-muted-foreground/30"
                            )}
                          >
                            {isCompleted ? (
                              <Check className="w-8 h-8 text-foreground" />
                            ) : (
                              <span className="text-muted-foreground text-sm">Not done</span>
                            )}
                          </motion.div>
                        );
                      })()}
                    </div>
                  )}
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </main>

      <BottomNav />
    </motion.div>
  );
};

export default Progress;
