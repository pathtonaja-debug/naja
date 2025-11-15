import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { 
  format, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval,
  isSameDay,
  isToday,
  addWeeks,
  subWeeks,
  startOfDay,
  differenceInMinutes,
  parseISO
} from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarItem } from "@/types/calendar";
import { CategoryChip } from "./CategoryChip";

interface WeekViewProps {
  week: Date;
  items: CalendarItem[];
  onWeekChange: (week: Date) => void;
  onItemPress: (item: CalendarItem) => void;
}

const HOUR_HEIGHT = 60; // pixels per hour
const HOURS = Array.from({ length: 19 }, (_, i) => i + 5); // 5 AM to 11 PM

export const WeekView = ({ week, items, onWeekChange, onItemPress }: WeekViewProps) => {
  const weekStart = startOfWeek(week);
  const weekEnd = endOfWeek(week);
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });
  
  // Filter out all-day events and tasks without specific times
  const timedEvents = items.filter(
    item => item.type === 'event' && !item.isAllDay && item.endDateTime
  );
  
  const weekTasks = items.filter(item => item.type === 'task');
  
  const getEventPosition = (item: CalendarItem) => {
    const start = parseISO(item.startDateTime);
    const end = item.endDateTime ? parseISO(item.endDateTime) : start;
    
    const dayStart = startOfDay(start);
    const minutesFromMidnight = differenceInMinutes(start, dayStart);
    const durationMinutes = differenceInMinutes(end, start);
    
    // Convert to position in grid (starting at 5 AM = 0)
    const top = ((minutesFromMidnight - 300) / 60) * HOUR_HEIGHT; // 300 = 5 AM in minutes
    const height = Math.max((durationMinutes / 60) * HOUR_HEIGHT, 30); // Minimum 30px
    
    return { top, height };
  };

  return (
    <div className="flex flex-col h-full">
      {/* Week Navigation */}
      <div className="flex items-center justify-between p-6 pb-4">
        <h2 className="text-[28px] font-bold text-foreground">
          {format(weekStart, "MMM d")} - {format(weekEnd, "MMM d, yyyy")}
        </h2>
        <div className="flex gap-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onWeekChange(subWeeks(week, 1))}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onWeekChange(addWeeks(week, 1))}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6">
        {/* Day Pills */}
        <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide pb-2">
          {days.map((day) => {
            const isCurrentDay = isToday(day);
            return (
              <button
                key={day.toISOString()}
                className={cn(
                  "flex-shrink-0 flex flex-col items-center justify-center",
                  "px-4 py-3 rounded-[18px] transition-all",
                  "backdrop-blur-xl border",
                  isCurrentDay
                    ? "bg-pink text-foreground border-pink/20 shadow-elevation-2"
                    : "bg-white/20 border-white/15 hover:bg-white/30"
                )}
              >
                <span className="text-[11px] font-semibold uppercase tracking-wide opacity-60">
                  {format(day, "EEE")}
                </span>
                <span className="text-[20px] font-bold mt-1">{format(day, "d")}</span>
              </button>
            );
          })}
        </div>

        {/* Week Schedule */}
        <Card className="backdrop-blur-2xl border-white/15 overflow-hidden">
          <div className="flex">
            {/* Hour Labels */}
            <div className="w-16 flex-shrink-0 border-r border-white/10">
              <div className="h-12" /> {/* Spacer for day headers */}
              {HOURS.map((hour) => (
                <div
                  key={hour}
                  className="relative"
                  style={{ height: HOUR_HEIGHT }}
                >
                  <span className="absolute -top-2 right-2 text-[11px] text-foreground/50">
                    {format(new Date().setHours(hour, 0), "ha")}
                  </span>
                </div>
              ))}
            </div>

            {/* Day Columns */}
            <div className="flex-1 overflow-x-auto">
              <div className="flex min-w-max">
                {days.map((day, dayIndex) => {
                  const dayEvents = timedEvents.filter(item =>
                    isSameDay(parseISO(item.startDateTime), day)
                  );

                  return (
                    <div
                      key={day.toISOString()}
                      className={cn(
                        "flex-1 min-w-[100px] border-r border-white/10 last:border-r-0",
                        isToday(day) && "bg-primary/5"
                      )}
                    >
                      {/* Day Header */}
                      <div className="h-12 flex items-center justify-center border-b border-white/10">
                        <span className="text-[13px] font-semibold text-foreground/70">
                          {format(day, "EEE")}
                        </span>
                      </div>

                      {/* Hour Cells */}
                      <div className="relative">
                        {HOURS.map((hour) => (
                          <div
                            key={hour}
                            className="border-b border-white/5"
                            style={{ height: HOUR_HEIGHT }}
                          />
                        ))}

                        {/* Event Cards */}
                        {dayEvents.map((event) => {
                          const { top, height } = getEventPosition(event);
                          
                          return (
                            <button
                              key={event.id}
                              onClick={() => onItemPress(event)}
                              className="absolute left-1 right-1 rounded-[12px] p-2 text-left transition-all active:scale-95"
                              style={{
                                top: `${top}px`,
                                height: `${height}px`,
                                backgroundColor: event.color || 'hsl(var(--primary) / 0.3)',
                                border: '1px solid hsl(var(--white) / 0.2)',
                              }}
                            >
                              <p className="text-[11px] font-bold text-foreground line-clamp-1">
                                {event.title}
                              </p>
                              <p className="text-[10px] text-foreground/70">
                                {format(parseISO(event.startDateTime), "h:mm a")}
                              </p>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Card>

        {/* Week Tasks */}
        {weekTasks.length > 0 && (
          <div className="mt-6 space-y-3">
            <h3 className="text-[17px] font-bold text-foreground">This Week's Tasks</h3>
            <div className="space-y-2">
              {weekTasks.slice(0, 5).map((task) => (
                <Card
                  key={task.id}
                  className="p-3 flex items-center gap-3 cursor-pointer backdrop-blur-2xl border-white/15"
                  onClick={() => onItemPress(task)}
                >
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: task.color || 'hsl(var(--primary))' }}
                  />
                  <span className="flex-1 text-[14px] text-foreground">{task.title}</span>
                  <CategoryChip category={task.category} size="sm" />
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
