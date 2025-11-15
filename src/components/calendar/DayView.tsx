import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { 
  format, 
  addDays,
  subDays,
  isToday,
  startOfDay,
  differenceInMinutes,
  parseISO
} from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarItem } from "@/types/calendar";
import { CalendarItemCard } from "./CalendarItemCard";

interface DayViewProps {
  day: Date;
  items: CalendarItem[];
  onDayChange: (day: Date) => void;
  onItemPress: (item: CalendarItem) => void;
  onToggleComplete: (item: CalendarItem) => void;
}

const HOUR_HEIGHT = 80;
const HOURS = Array.from({ length: 19 }, (_, i) => i + 5);

export const DayView = ({ day, items, onDayChange, onItemPress, onToggleComplete }: DayViewProps) => {
  const dayEvents = items.filter(item => item.type === 'event' && !item.isAllDay);
  const dayTasks = items.filter(item => item.type === 'task');
  const allDayEvents = items.filter(item => item.type === 'event' && item.isAllDay);
  
  const getEventPosition = (item: CalendarItem) => {
    const start = parseISO(item.startDateTime);
    const end = item.endDateTime ? parseISO(item.endDateTime) : start;
    
    const dayStart = startOfDay(start);
    const minutesFromMidnight = differenceInMinutes(start, dayStart);
    const durationMinutes = differenceInMinutes(end, start);
    
    const top = ((minutesFromMidnight - 300) / 60) * HOUR_HEIGHT;
    const height = Math.max((durationMinutes / 60) * HOUR_HEIGHT, 40);
    
    return { top, height };
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-6 pb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-[28px] font-bold text-foreground">
            {format(day, "EEEE d")}
          </h2>
          {isToday(day) && (
            <Badge className="rounded-pill bg-primary/30 text-primary-foreground border-primary/20">
              Today
            </Badge>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onDayChange(subDays(day, 1))}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onDayChange(addDays(day, 1))}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-6">
        {/* All-Day Events */}
        {allDayEvents.length > 0 && (
          <div className="space-y-2">
            {allDayEvents.map(event => (
              <Card
                key={event.id}
                className="p-4 backdrop-blur-2xl border-white/15 cursor-pointer"
                style={{ backgroundColor: event.color ? `${event.color}30` : undefined }}
                onClick={() => onItemPress(event)}
              >
                <p className="text-[15px] font-semibold text-foreground">{event.title}</p>
                <p className="text-[13px] text-foreground/60 mt-1">All day</p>
              </Card>
            ))}
          </div>
        )}

        {/* Timeline */}
        <Card className="backdrop-blur-2xl border-white/15 overflow-hidden">
          <div className="flex">
            {/* Hour Labels */}
            <div className="w-20 flex-shrink-0 border-r border-white/10">
              {HOURS.map((hour) => (
                <div
                  key={hour}
                  className="relative border-b border-white/5"
                  style={{ height: HOUR_HEIGHT }}
                >
                  <span className="absolute -top-2 right-3 text-[13px] text-foreground/50 font-medium">
                    {format(new Date().setHours(hour, 0), "h a")}
                  </span>
                </div>
              ))}
            </div>

            {/* Events Column */}
            <div className="flex-1 relative">
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
                    className="absolute left-2 right-2 rounded-[16px] p-3 text-left transition-all active:scale-[0.98] shadow-elevation-2"
                    style={{
                      top: `${top}px`,
                      height: `${height}px`,
                      backgroundColor: event.color || 'hsl(var(--primary) / 0.4)',
                      border: '1px solid hsl(var(--white) / 0.2)',
                    }}
                  >
                    <p className="text-[15px] font-bold text-foreground line-clamp-2">
                      {event.title}
                    </p>
                    <p className="text-[13px] text-foreground/80 mt-1">
                      {format(parseISO(event.startDateTime), "h:mm a")}
                      {event.endDateTime && ` - ${format(parseISO(event.endDateTime), "h:mm a")}`}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Tasks */}
        {dayTasks.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-[20px] font-bold text-foreground">Today's Tasks</h3>
            <div className="space-y-3">
              {dayTasks.map((task) => (
                <CalendarItemCard
                  key={task.id}
                  item={task}
                  onPress={() => onItemPress(task)}
                  onToggleComplete={() => onToggleComplete(task)}
                  showTime={false}
                />
              ))}
            </div>
          </div>
        )}

        {dayTasks.length === 0 && dayEvents.length === 0 && allDayEvents.length === 0 && (
          <Card className="p-8 text-center backdrop-blur-2xl border-white/15">
            <p className="text-foreground/60">No events or tasks for this day</p>
          </Card>
        )}
      </div>
    </div>
  );
};
