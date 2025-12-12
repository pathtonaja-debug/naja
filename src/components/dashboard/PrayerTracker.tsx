import { useState, useEffect } from "react";
import { Check, Circle } from "lucide-react";
import { motion } from "framer-motion";
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
    setPrayers(prev => 
      prev.map(p => p.id === prayerId ? { ...p, completed: !currentStatus } : p)
    );

    try {
      await logHabitCompletion(prayerId, !currentStatus);
      if (!currentStatus) {
        toast.success("Prayer logged!");
      }
    } catch (error) {
      setPrayers(prev => 
        prev.map(p => p.id === prayerId ? { ...p, completed: currentStatus } : p)
      );
      toast.error("Failed to update prayer");
    }
  };

  const completedCount = prayers.filter(p => p.completed).length;

  if (loading) {
    return (
      <div className="sage-card">
        <Skeleton className="h-6 w-36 mb-4" />
        <div className="flex justify-between gap-2">
          {[1, 2, 3, 4, 5].map(i => (
            <Skeleton key={i} className="w-14 h-20 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="sage-card"
    >
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-xl sm:text-2xl font-display font-semibold text-primary-foreground">
          Daily Prayers
        </h3>
        <span className="text-sm font-medium text-primary-foreground/70 bg-white/40 px-3 py-1 rounded-pill">
          {completedCount}/{prayers.length}
        </span>
      </div>

      <div className="flex justify-between gap-1.5 sm:gap-2">
        {prayers.map((prayer, index) => (
          <motion.button
            key={prayer.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => handleToggle(prayer.id, prayer.completed)}
            className={cn(
              "flex flex-col items-center gap-2 p-2.5 sm:p-3 rounded-2xl transition-all flex-1 min-w-0",
              prayer.completed 
                ? "bg-accent/90" 
                : "bg-white/50 hover:bg-white/70"
            )}
          >
            <div
              className={cn(
                "w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all",
                prayer.completed
                  ? "bg-accent-foreground/20 text-accent-foreground"
                  : "bg-primary-foreground/10 text-primary-foreground/60"
              )}
            >
              {prayer.completed ? (
                <Check className="w-5 h-5" strokeWidth={2.5} />
              ) : (
                <Circle className="w-5 h-5" />
              )}
            </div>
            <span className={cn(
              "text-[10px] sm:text-xs font-semibold truncate w-full text-center",
              prayer.completed ? "text-accent-foreground" : "text-primary-foreground/80"
            )}>
              {prayer.name}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="mt-5 h-2 bg-white/30 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(completedCount / prayers.length) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="h-full bg-accent rounded-full"
        />
      </div>
    </motion.div>
  );
}
