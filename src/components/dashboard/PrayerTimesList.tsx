import { Button } from "@/components/ui/button";
import { Check, Circle, Clock, Sun, Sunrise, Moon, CloudSun, Sunset } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePrayerTimes } from "@/hooks/usePrayerTimes";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PrayerItemProps {
  name: string;
  time: string;
  isCompleted: boolean;
  isNext: boolean;
  index: number;
}

const prayerIcons: Record<string, React.ReactNode> = {
  Fajr: <Sunrise className="w-3.5 h-3.5" />,
  Dhuhr: <Sun className="w-3.5 h-3.5" />,
  Asr: <CloudSun className="w-3.5 h-3.5" />,
  Maghrib: <Sunset className="w-3.5 h-3.5" />,
  Isha: <Moon className="w-3.5 h-3.5" />,
};

function PrayerItem({ name, time, isCompleted, isNext, index }: PrayerItemProps) {
  const bgColor = isNext 
    ? "bg-primary/10 border-primary/20" 
    : isCompleted 
    ? "bg-secondary/5 border-transparent" 
    : "bg-muted/20 border-transparent";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.2 }}
      whileHover={{ scale: 1.01, x: 4 }}
      className={cn(
        "flex items-center gap-2.5 p-2.5 rounded-xl liquid-glass border transition-all cursor-pointer",
        bgColor
      )}
    >
      <div className={cn(
        "w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0",
        isNext ? "bg-primary/20" : isCompleted ? "bg-secondary/20" : "bg-muted/50"
      )}>
        {isCompleted ? (
          <Check className="w-3.5 h-3.5 text-secondary" />
        ) : isNext ? (
          <Clock className="w-3.5 h-3.5 text-primary" />
        ) : (
          <span className={cn(
            isNext ? "text-primary" : "text-muted-foreground"
          )}>
            {prayerIcons[name] || <Circle className="w-3.5 h-3.5" />}
          </span>
        )}
      </div>
      <span className={cn(
        "text-xs font-medium flex-1",
        isNext ? "text-primary" : "text-foreground"
      )}>
        {name}
      </span>
      <span className={cn(
        "text-xs font-medium",
        isNext ? "text-primary" : "text-foreground-muted"
      )}>
        {time}
      </span>
      {isNext && (
        <motion.span 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-[8px] font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded-full"
        >
          NEXT
        </motion.span>
      )}
    </motion.div>
  );
}

function PrayerItemSkeleton() {
  return (
    <div className="flex items-center gap-2.5 p-2.5 rounded-xl liquid-glass">
      <Skeleton className="w-7 h-7 rounded-lg" />
      <Skeleton className="h-3 w-12 flex-1" />
      <Skeleton className="h-3 w-10" />
    </div>
  );
}

export function PrayerTimesList() {
  const navigate = useNavigate();
  const { prayerTimes, loading } = usePrayerTimes();

  if (loading) {
    return (
      <div className="px-3 py-2">
        <div className="flex items-center justify-between mb-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-6 w-16" />
        </div>
        <div className="space-y-1.5">
          {[1, 2, 3, 4, 5].map(i => <PrayerItemSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  if (!prayerTimes) {
    return (
      <div className="px-3 py-2">
        <div className="liquid-glass p-4 rounded-xl">
          <p className="text-xs text-foreground-muted">Unable to load prayer times</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="px-3 py-2"
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm text-foreground font-semibold">Prayer Times</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-primary text-xs h-7 px-2"
          onClick={() => navigate("/calendar")}
        >
          Calendar
        </Button>
      </div>
      <div className="space-y-1">
        {prayerTimes.prayers.map((prayer, index) => (
          <PrayerItem
            key={prayer.name}
            name={prayer.name}
            time={prayer.time}
            isCompleted={prayer.isCompleted}
            isNext={prayer.isNext}
            index={index}
          />
        ))}
      </div>
    </motion.div>
  );
}
