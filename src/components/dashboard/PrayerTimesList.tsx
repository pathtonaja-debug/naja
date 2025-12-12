import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Circle, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePrayerTimes } from "@/hooks/usePrayerTimes";
import { Skeleton } from "@/components/ui/skeleton";

interface PrayerItemProps {
  name: string;
  time: string;
  isCompleted: boolean;
  isNext: boolean;
}

function PrayerItem({ name, time, isCompleted, isNext }: PrayerItemProps) {
  const bgColor = isNext 
    ? "bg-primary/10" 
    : isCompleted 
    ? "bg-secondary/5" 
    : "bg-muted/20";
  
  const iconBg = isNext
    ? "bg-primary/20"
    : isCompleted
    ? "bg-secondary/20"
    : "bg-muted";

  const Icon = isNext ? Clock : isCompleted ? Check : Circle;

  return (
    <div className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-card liquid-glass ${bgColor} transition-all`}>
      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl ${iconBg} flex items-center justify-center flex-shrink-0`}>
        <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${isNext ? "text-primary" : isCompleted ? "text-secondary" : "text-muted-foreground"}`} />
      </div>
      <span className="text-sm sm:text-body font-semibold text-foreground flex-1">{name}</span>
      <span className="text-sm sm:text-body text-foreground-muted font-medium">{time}</span>
    </div>
  );
}

function PrayerItemSkeleton() {
  return (
    <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-card liquid-glass">
      <Skeleton className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl" />
      <Skeleton className="h-4 w-14 sm:w-16 flex-1" />
      <Skeleton className="h-4 w-10 sm:w-12" />
    </div>
  );
}

export function PrayerTimesList() {
  const navigate = useNavigate();
  const { prayerTimes, loading } = usePrayerTimes();

  if (loading) {
    return (
      <div className="px-5 py-4">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-6 w-28" />
          <Skeleton className="h-8 w-20" />
        </div>
        <div className="space-y-2">
          <PrayerItemSkeleton />
          <PrayerItemSkeleton />
          <PrayerItemSkeleton />
          <PrayerItemSkeleton />
          <PrayerItemSkeleton />
        </div>
      </div>
    );
  }

  if (!prayerTimes) {
    return (
      <div className="px-5 py-4">
        <Card className="liquid-glass p-6">
          <p className="text-body text-foreground-muted">Unable to load prayer times</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="px-5 py-4">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h3 className="text-lg sm:text-title-2 text-foreground font-semibold">Prayer Times</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-primary text-sm"
          onClick={() => navigate("/calendar")}
        >
          Calendar
        </Button>
      </div>
      <div className="space-y-1.5 sm:space-y-2">
        {prayerTimes.prayers.map((prayer) => (
          <PrayerItem
            key={prayer.name}
            name={prayer.name}
            time={prayer.time}
            isCompleted={prayer.isCompleted}
            isNext={prayer.isNext}
          />
        ))}
      </div>
    </div>
  );
}