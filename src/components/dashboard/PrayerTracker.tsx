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

  if (loading) {
    return (
      <div className="px-5 py-4">
        <div className="liquid-glass rounded-card p-5">
          <Skeleton className="h-5 w-32 mb-4" />
          <div className="flex justify-between gap-2">
            {[1, 2, 3, 4, 5].map(i => (
              <Skeleton key={i} className="w-14 h-14 rounded-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-5 py-4">
      <div className="liquid-glass rounded-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-title-3 font-semibold text-foreground">Daily Prayers</h3>
          <span className="text-subheadline text-foreground-muted">
            {completedCount}/{prayers.length}
          </span>
        </div>

        <div className="flex justify-between gap-1 sm:gap-2">
          {prayers.map((prayer, index) => (
            <motion.button
              key={prayer.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => handleToggle(prayer.id, prayer.completed)}
              className={cn(
                "flex flex-col items-center gap-1.5 p-2 sm:p-3 rounded-2xl transition-all flex-1 min-w-0",
                prayer.completed 
                  ? "bg-primary/15" 
                  : "bg-muted/30 hover:bg-muted/50"
              )}
            >
              <div
                className={cn(
                  "w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all",
                  prayer.completed
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted border-2 border-border/50"
                )}
              >
                {prayer.completed ? (
                  <Check className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
                ) : (
                  <Circle className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground" />
                )}
              </div>
              <span className={cn(
                "text-[10px] sm:text-xs font-medium truncate w-full text-center",
                prayer.completed ? "text-primary" : "text-foreground-muted"
              )}>
                {prayer.name}
              </span>
            </motion.button>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(completedCount / prayers.length) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full"
          />
        </div>
      </div>
    </div>
  );
}
