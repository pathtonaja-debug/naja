import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, Trash2, Calendar as CalendarIcon, Flame, Trophy, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import BottomNav from "@/components/BottomNav";
import { getHabitWithStats, getHabitLogs, deleteHabit } from "@/services/habitTracking";
import type { Habit, HabitStats, HabitLog } from "@/services/habitTracking";
import { toast } from "sonner";
import { format, subDays, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";

export default function HabitDetail() {
  const { habitId } = useParams<{ habitId: string }>();
  const navigate = useNavigate();
  const [habit, setHabit] = useState<Habit | null>(null);
  const [stats, setStats] = useState<HabitStats | null>(null);
  const [weeklyLogs, setWeeklyLogs] = useState<HabitLog[]>([]);
  const [monthlyLogs, setMonthlyLogs] = useState<HabitLog[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    if (!habitId) return;
    
    setLoading(true);
    try {
      const { habit: habitData, stats: statsData } = await getHabitWithStats(habitId);
      setHabit(habitData);
      setStats(statsData);

      // Load weekly logs
      const weekStart = format(subDays(new Date(), 6), 'yyyy-MM-dd');
      const today = format(new Date(), 'yyyy-MM-dd');
      const weekly = await getHabitLogs(habitId, weekStart, today);
      setWeeklyLogs(weekly);

      // Load monthly logs
      const monthStart = format(startOfMonth(new Date()), 'yyyy-MM-dd');
      const monthEnd = format(endOfMonth(new Date()), 'yyyy-MM-dd');
      const monthly = await getHabitLogs(habitId, monthStart, monthEnd);
      setMonthlyLogs(monthly);
    } catch (error) {
      console.error("Error loading habit details:", error);
      toast.error("Failed to load habit details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [habitId]);

  const handleDelete = async () => {
    if (!habitId || !confirm("Are you sure you want to delete this habit?")) return;
    
    try {
      await deleteHabit(habitId);
      toast.success("Habit deleted successfully");
      navigate("/habits");
    } catch (error) {
      console.error("Error deleting habit:", error);
      toast.error("Failed to delete habit");
    }
  };

  if (loading || !habit) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-accent/5 pb-24">
        <div className="animate-pulse px-4 pt-20">
          <div className="h-32 bg-background/40 backdrop-blur-xl rounded-3xl mb-6" />
          <div className="h-48 bg-background/40 backdrop-blur-xl rounded-3xl mb-6" />
          <div className="h-64 bg-background/40 backdrop-blur-xl rounded-3xl" />
        </div>
      </div>
    );
  }

  const IconComponent = (Icons as any)[habit.icon || "target"] || Icons.Target;
  
  // Calculate weekly completion rate
  const weeklyCompletions = weeklyLogs.filter(log => log.completed).length;
  const weeklyRate = Math.round((weeklyCompletions / 7) * 100);

  // Generate monthly heatmap
  const monthDays = eachDayOfInterval({
    start: startOfMonth(new Date()),
    end: endOfMonth(new Date())
  });
  
  const logMap = new Map(monthlyLogs.map(log => [log.date, log.completed]));

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-accent/5 pb-24">
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="flex items-center justify-between px-4 h-16 pt-safe">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          <h1 className="text-[17px] font-semibold text-foreground">
            Habit Details
          </h1>
          
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              className="rounded-full text-destructive"
            >
              <Trash2 className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Habit Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-6 bg-background/40 backdrop-blur-xl border-border/50">
            <div className="flex items-start gap-4">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: habit.color }}
              >
                <IconComponent className="w-8 h-8 text-foreground/80" strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <h2 className="text-[22px] font-bold text-foreground mb-1">
                  {habit.name}
                </h2>
                <p className="text-[15px] text-muted-foreground">
                  {habit.category}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 gap-4"
        >
          <Card className="p-5 bg-background/40 backdrop-blur-xl border-border/50">
            <div className="flex items-center gap-3 mb-2">
              <Flame className="w-5 h-5 text-orange-500" />
              <span className="text-[13px] text-muted-foreground">Current Streak</span>
            </div>
            <p className="text-[28px] font-bold text-foreground">
              {stats?.current_streak || 0}
            </p>
            <p className="text-[12px] text-muted-foreground">days</p>
          </Card>

          <Card className="p-5 bg-background/40 backdrop-blur-xl border-border/50">
            <div className="flex items-center gap-3 mb-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span className="text-[13px] text-muted-foreground">Best Streak</span>
            </div>
            <p className="text-[28px] font-bold text-foreground">
              {stats?.longest_streak || 0}
            </p>
            <p className="text-[12px] text-muted-foreground">days</p>
          </Card>
        </motion.div>

        {/* Weekly Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 bg-background/40 backdrop-blur-xl border-border/50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h3 className="text-[17px] font-semibold text-foreground">
                  This Week
                </h3>
              </div>
              <span className="text-[15px] font-medium text-foreground">
                {weeklyRate}%
              </span>
            </div>
            
            <div className="flex justify-between gap-2">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => {
                const date = format(subDays(new Date(), 6 - index), 'yyyy-MM-dd');
                const log = weeklyLogs.find(l => l.date === date);
                const completed = log?.completed || false;
                
                return (
                  <div key={index} className="flex-1 text-center">
                    <div className={`w-full aspect-square rounded-xl mb-2 flex items-center justify-center ${
                      completed
                        ? 'bg-primary'
                        : 'bg-background/60 border border-border/50'
                    }`}>
                      {completed && <Icons.Check className="w-4 h-4 text-primary-foreground" />}
                    </div>
                    <span className="text-[11px] text-muted-foreground">{day}</span>
                  </div>
                );
              })}
            </div>
          </Card>
        </motion.div>

        {/* Monthly Heatmap */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 bg-background/40 backdrop-blur-xl border-border/50">
            <h3 className="text-[17px] font-semibold text-foreground mb-4">
              {format(new Date(), 'MMMM')} Activity
            </h3>
            
            <div className="grid grid-cols-7 gap-2">
              {monthDays.map((day, index) => {
                const dateStr = format(day, 'yyyy-MM-dd');
                const completed = logMap.get(dateStr);
                const isFuture = day > new Date();
                
                return (
                  <div
                    key={index}
                    className={`aspect-square rounded-lg ${
                      isFuture
                        ? 'bg-background/30'
                        : completed
                        ? 'bg-primary'
                        : 'bg-background/60 border border-border/50'
                    }`}
                    title={format(day, 'MMM d')}
                  />
                );
              })}
            </div>
          </Card>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
}
