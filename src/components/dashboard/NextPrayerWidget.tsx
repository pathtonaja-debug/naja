import { Card } from "@/components/ui/card";
import { Building2, Clock } from "lucide-react";
import { usePrayerTimes } from "@/hooks/usePrayerTimes";
import { Skeleton } from "@/components/ui/skeleton";

export function NextPrayerWidget() {
  const { prayerTimes, loading, countdown } = usePrayerTimes();

  if (loading) {
    return (
      <Card className="liquid-glass p-4 sm:p-6 space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-3 w-16 sm:w-20" />
            <Skeleton className="h-6 sm:h-8 w-20 sm:w-24" />
          </div>
          <Skeleton className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl" />
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <Skeleton className="flex-1 h-2" />
          <Skeleton className="h-5 sm:h-6 w-16 sm:w-20 rounded-full" />
        </div>
      </Card>
    );
  }

  if (!prayerTimes) {
    return (
      <Card className="liquid-glass p-4 sm:p-6">
        <p className="text-sm sm:text-body text-foreground-muted">Unable to load prayer times</p>
      </Card>
    );
  }

  // Calculate progress (time elapsed since last prayer / time until next prayer)
  const progressPercent = Math.max(
    0,
    Math.min(100, 100 - (prayerTimes.nextInMinutes / 180) * 100)
  );

  return (
    <Card className="liquid-glass p-4 sm:p-6 space-y-3 sm:space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5 sm:space-y-1">
          <p className="text-[10px] sm:text-caption-1 text-foreground-muted uppercase tracking-wide">
            Next Prayer
          </p>
          <h2 className="text-2xl sm:text-title-1 font-semibold text-foreground">{prayerTimes.next}</h2>
        </div>
        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-card liquid-glass flex items-center justify-center">
          <Building2 className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <div className="flex-1 h-1.5 sm:h-2 bg-muted rounded-pill overflow-hidden">
          <div
            className="h-full bg-gradient-primary rounded-pill transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-caption-2 text-foreground-muted px-2 sm:px-3 py-1 rounded-pill liquid-glass">
          <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
          <span className="font-semibold">{countdown}</span>
        </div>
      </div>
    </Card>
  );
}