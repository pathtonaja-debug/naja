import { useState, useEffect } from "react";
import { Check, Circle, Sun, Sunrise, Moon, CloudSun, Sunset } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getPrayerHabits, logHabitCompletion } from "@/services/habitTracking";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface PrayerHabit {
  id: string;
  name: string;
  completed: boolean;
  habit_time?: string;
}

const prayerIcons: Record<string, React.ReactNode> = {
  Fajr: <Sunrise className="w-3.5 h-3.5" />,
  Dhuhr: <Sun className="w-3.5 h-3.5" />,
  Asr: <CloudSun className="w-3.5 h-3.5" />,
  Maghrib: <Sunset className="w-3.5 h-3.5" />,
  Isha: <Moon className="w-3.5 h-3.5" />,
};

export function PrayerTracker() {
  const [prayers, setPrayers] = useState<PrayerHabit[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPrayers = async () => {
    try {
      const data = await getPrayerHabits();
      setPrayers(data);
    } catch (error) {
      console.error("Error loading prayers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPrayers();
  }, []);

  const handleToggle = async (prayerId: string, currentStatus: boolean) => {
    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }

    // Optimistic update
    setPrayers(prev => 
      prev.map(p => p.id === prayerId ? { ...p, completed: !currentStatus } : p)
    );

    try {
      await logHabitCompletion(prayerId, !currentStatus);
      if (!currentStatus) {
        toast.success("Prayer logged! ✨");
      }
    } catch (error) {
      // Revert on error
      setPrayers(prev => 
        prev.map(p => p.id === prayerId ? { ...p, completed: currentStatus } : p)
      );
      toast.error("Failed to update prayer");
    }
  };

  const completedCount = prayers.filter(p => p.completed).length;
  const progress = prayers.length > 0 ? (completedCount / prayers.length) * 100 : 0;

  if (loading) {
    return (
      <div className="px-4 py-1.5">
        <div className="liquid-glass rounded-xl p-3">
          <Skeleton className="h-3.5 w-20 mb-2" />
          <div className="flex justify-between gap-1">
            {[1, 2, 3, 4, 5].map(i => (
              <Skeleton key={i} className="w-11 h-12 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="px-4 py-1.5"
    >
      <div className="liquid-glass rounded-xl p-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-[13px] font-semibold text-foreground">Daily Prayers</h3>
          <span className="text-[10px] text-foreground-muted font-medium bg-muted/50 px-1.5 py-0.5 rounded-full">
            {completedCount}/{prayers.length}
          </span>
        </div>

        <div className="flex justify-between gap-1">
          {prayers.map((prayer, index) => (
            <motion.button
              key={prayer.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.2 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleToggle(prayer.id, prayer.completed)}
              className={cn(
                "flex flex-col items-center gap-0.5 p-1 rounded-lg transition-all flex-1 min-w-0",
                prayer.completed 
                  ? "bg-primary/15" 
                  : "bg-muted/30 hover:bg-muted/50"
              )}
            >
              <motion.div
                animate={prayer.completed ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.3 }}
                className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center transition-all",
                  prayer.completed
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted/50 border border-border/30"
                )}
              >
                <AnimatePresence mode="wait">
                  {prayer.completed ? (
                    <motion.div
                      key="check"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 180 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="icon"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-muted-foreground"
                    >
                      {prayerIcons[prayer.name] || <Circle className="w-3 h-3" />}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
              <span className={cn(
                "text-[9px] font-medium truncate w-full text-center",
                prayer.completed ? "text-primary" : "text-foreground-muted"
              )}>
                {prayer.name}
              </span>
            </motion.button>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="mt-2 h-1 bg-muted/50 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full"
          />
        </div>
      </div>
    </motion.div>
  );
}
