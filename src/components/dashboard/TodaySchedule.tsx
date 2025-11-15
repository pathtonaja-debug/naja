import { Card } from "@/components/ui/card";
import { CheckCircle2, Circle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScheduleItem {
  id: string;
  title: string;
  time: string;
  completed: boolean;
  type: "habit" | "event";
}

const mockItems: ScheduleItem[] = [
  { id: "1", title: "Fajr Prayer", time: "05:30 AM", completed: true, type: "habit" },
  { id: "2", title: "Morning Quran", time: "06:00 AM", completed: true, type: "habit" },
  { id: "3", title: "Team Meeting", time: "10:00 AM", completed: false, type: "event" },
  { id: "4", title: "Dhuhr Prayer", time: "12:45 PM", completed: false, type: "habit" },
  { id: "5", title: "Asr Prayer", time: "03:30 PM", completed: false, type: "habit" },
];

export function TodaySchedule() {
  return (
    <Card className="liquid-glass p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-headline text-foreground">Today's Schedule</h3>
        <span className="text-caption-2 text-foreground-muted">
          {mockItems.filter(i => i.completed).length} of {mockItems.length}
        </span>
      </div>

      <div className="space-y-2">
        {mockItems.map((item) => (
          <div
            key={item.id}
            className={cn(
              "flex items-center gap-3 p-3 rounded-button transition-all",
              item.completed ? "opacity-60" : ""
            )}
          >
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center",
              item.completed ? "bg-primary/20" : "bg-muted"
            )}>
              {item.completed ? (
                <CheckCircle2 className="w-4 h-4 text-primary" />
              ) : (
                <Circle className="w-4 h-4 text-foreground-muted" />
              )}
            </div>
            <div className="flex-1">
              <p className={cn(
                "text-subheadline",
                item.completed ? "line-through text-foreground-muted" : "text-foreground"
              )}>
                {item.title}
              </p>
              <div className="flex items-center gap-1 mt-0.5">
                <Clock className="w-3 h-3 text-foreground-muted" />
                <span className="text-caption-2 text-foreground-muted">{item.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
