import { Card } from "@/components/ui/card";
import { Building2, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { getTodayPrayerTimes, type PrayerTimes } from "@/services/prayer";
import { cn } from "@/lib/utils";

export function NextPrayerWidget() {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);

  useEffect(() => {
    (async () => {
      const times = await getTodayPrayerTimes();
      setPrayerTimes(times);
    })();
  }, []);

  if (!prayerTimes) {
    return (
      <Card className="liquid-glass p-6">
        <p className="text-body text-foreground-muted">Loading...</p>
      </Card>
    );
  }

  return (
    <Card className="liquid-glass p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-caption-1 text-foreground-muted uppercase tracking-wide">
            Next Prayer
          </p>
          <h2 className="text-title-1 text-foreground">{prayerTimes.next}</h2>
        </div>
        <div className="w-16 h-16 rounded-card liquid-glass flex items-center justify-center">
          <Building2 className="w-8 h-8 text-primary" />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 bg-muted rounded-pill overflow-hidden">
          <div
            className="h-full bg-gradient-primary rounded-pill transition-all"
            style={{ width: "65%" }}
          />
        </div>
        <div className="flex items-center gap-2 text-caption-2 text-foreground-muted px-3 py-1 rounded-pill liquid-glass">
          <Clock className="w-3 h-3" />
          <span className="font-semibold">2h 15m</span>
        </div>
      </div>
    </Card>
  );
}
