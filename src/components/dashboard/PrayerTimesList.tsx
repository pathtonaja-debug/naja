import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Check, Circle, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getTodayPrayerTimes, type PrayerTimes } from "@/services/prayer";

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
    <div className={`flex items-center gap-4 p-4 rounded-card liquid-glass ${bgColor} transition-all`}>
      <div className={`w-12 h-12 rounded-2xl ${iconBg} flex items-center justify-center flex-shrink-0`}>
        <Icon className={`w-5 h-5 ${isNext ? "text-primary" : isCompleted ? "text-secondary" : "text-muted-foreground"}`} />
      </div>
      <span className="text-body font-semibold text-foreground flex-1">{name}</span>
      <span className="text-body text-foreground-muted font-medium">{time}</span>
    </div>
  );
}

export function PrayerTimesList() {
  const navigate = useNavigate();
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);

  useEffect(() => {
    (async () => {
      const times = await getTodayPrayerTimes();
      setPrayerTimes(times);
    })();
  }, []);

  if (!prayerTimes) {
    return (
      <div className="px-5 py-4">
        <Card className="liquid-glass p-6">
          <p className="text-body text-foreground-muted">Loading prayer times...</p>
        </Card>
      </div>
    );
  }

  const prayers = [
    { name: "Fajr", time: prayerTimes.fajr, isCompleted: true },
    { name: "Dhuhr", time: prayerTimes.dhuhr, isCompleted: true },
    { name: "Asr", time: prayerTimes.asr, isCompleted: true },
    { name: "Maghrib", time: prayerTimes.maghrib, isCompleted: false },
    { name: "Isha", time: prayerTimes.isha, isCompleted: false },
  ];

  const nextPrayerIndex = prayers.findIndex(p => !p.isCompleted);

  return (
    <div className="px-5 py-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-title-2 text-foreground font-semibold">Prayer Times</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-primary"
          onClick={() => navigate("/calendar")}
        >
          Calendar
        </Button>
      </div>
      <div className="space-y-2">
        {prayers.map((prayer, index) => (
          <PrayerItem
            key={prayer.name}
            name={prayer.name}
            time={prayer.time}
            isCompleted={prayer.isCompleted}
            isNext={index === nextPrayerIndex}
          />
        ))}
      </div>
    </div>
  );
}
