import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import HabitCard from "@/components/habits/HabitCard";
import BottomNav from "@/components/BottomNav";
import AICompanion from "@/components/AICompanion";
import { getHabitsByCategory, getTodayHabitLogs, logHabitCompletion } from "@/services/habitTracking";
import type { Habit, HabitLog } from "@/services/habitTracking";
import { toast } from "sonner";

export default function HabitCategory() {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [logs, setLogs] = useState<Map<string, HabitLog>>(new Map());
  const [loading, setLoading] = useState(true);
  const [companionOpen, setCompanionOpen] = useState(false);

  const loadData = async () => {
    if (!category) return;
    
    setLoading(true);
    try {
      const [habitsData, logsData] = await Promise.all([
        getHabitsByCategory(decodeURIComponent(category)),
        getTodayHabitLogs()
      ]);
      
      setHabits(habitsData);
      setLogs(new Map(logsData.map(log => [log.habit_id, log])));
    } catch (error) {
      console.error("Error loading category data:", error);
      toast.error("Failed to load habits");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [category]);

  const handleToggle = async (habitId: string) => {
    const currentLog = logs.get(habitId);
    const newCompleted = !currentLog?.completed;
    
    try {
      await logHabitCompletion(habitId, newCompleted);
      await loadData();
      
      if (newCompleted) {
        toast.success("Great job! Keep it up!");
      }
    } catch (error) {
      console.error("Error toggling habit:", error);
      toast.error("Failed to update habit");
    }
  };

  const handleHabitClick = (habitId: string) => {
    navigate(`/habits/detail/${habitId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-accent/5 pb-24">
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="flex items-center justify-between px-4 h-16 pt-safe">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/habits")}
            className="rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          <h1 className="text-[17px] font-semibold text-foreground">
            {decodeURIComponent(category || "")}
          </h1>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/progress")}
            className="rounded-full"
          >
            <BarChart3 className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="px-4 py-6">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-20 bg-background/40 backdrop-blur-xl rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : habits.length > 0 ? (
          <div className="space-y-3">
            {habits.map((habit, index) => (
              <motion.div
                key={habit.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * index }}
              >
                <HabitCard
                  id={habit.id}
                  name={habit.name}
                  icon={habit.icon}
                  color={habit.color}
                  isAllDay={habit.is_all_day}
                  time={habit.habit_time}
                  completed={logs.get(habit.id)?.completed || false}
                  onToggle={handleToggle}
                  onClick={handleHabitClick}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-accent/20 flex items-center justify-center">
              <BarChart3 className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-[17px] font-semibold text-foreground mb-2">
              No habits yet
            </h3>
            <p className="text-[15px] text-muted-foreground mb-6">
              Create your first habit to get started
            </p>
            <Button onClick={() => navigate("/habits")}>
              Go Back
            </Button>
          </motion.div>
        )}
      </div>

      <AICompanion onClose={() => setCompanionOpen(false)} isOpen={companionOpen} />
      <BottomNav onChatbotOpen={() => setCompanionOpen(true)} />
    </div>
  );
}
