import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth,
  getDay,
  isSameDay,
  isToday,
  addMonths,
  subMonths
} from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarItem } from "@/types/calendar";
import { CalendarItemCard } from "./CalendarItemCard";
import { useState } from "react";

interface MonthViewProps {
  month: Date;
  items: CalendarItem[];
  onMonthChange: (month: Date) => void;
  onDayPress: (day: Date) => void;
  onItemPress: (item: CalendarItem) => void;
  onToggleComplete: (item: CalendarItem) => void;
}

export const MonthView = ({
  month,
  items,
  onMonthChange,
  onDayPress,
  onItemPress,
  onToggleComplete,
}: MonthViewProps) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  const firstDayOfWeek = getDay(monthStart);
  const paddingDays = Array(firstDayOfWeek).fill(null);
  
  const itemsByDate = new Map<string, CalendarItem[]>();
  items.forEach(item => {
    const dateKey = format(new Date(item.startDateTime), 'yyyy-MM-dd');
    if (!itemsByDate.has(dateKey)) {
      itemsByDate.set(dateKey, []);
    }
    itemsByDate.get(dateKey)!.push(item);
  });

  const selectedDateKey = format(selectedDate, 'yyyy-MM-dd');
  const selectedDayItems = itemsByDate.get(selectedDateKey) || [];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-6 pb-4">
        <h2 className="text-[28px] font-bold text-foreground">
          {format(month, "MMMM yyyy")}
        </h2>
        <div className="flex gap-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onMonthChange(subMonths(month, 1))}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onMonthChange(addMonths(month, 1))}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 space-y-6">
        {/* Calendar Grid */}
        <Card className="p-6 backdrop-blur-2xl bg-gradient-to-br from-white/20 to-white/10 border-white/15">
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-[13px] text-foreground/60 text-center font-semibold">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-2">
            {paddingDays.map((_, i) => (
              <div key={`pad-${i}`} />
            ))}
            
            {days.map((day) => {
              const dateKey = format(day, 'yyyy-MM-dd');
              const dayItems = itemsByDate.get(dateKey) || [];
              const isSelected = isSameDay(day, selectedDate);
              const isCurrentDay = isToday(day);
              
              return (
                <button
                  key={day.toISOString()}
                  onClick={() => setSelectedDate(day)}
                  className={cn(
                    "aspect-square rounded-full flex flex-col items-center justify-center",
                    "transition-all duration-200",
                    isSameMonth(day, month) ? "text-foreground" : "text-foreground/30",
                    isSelected && "bg-pink text-foreground shadow-elevation-2",
                    !isSelected && isCurrentDay && "ring-2 ring-primary",
                    !isSelected && "hover:bg-white/20"
                  )}
                >
                  <span className="text-[15px] font-semibold">{format(day, "d")}</span>
                  {dayItems.length > 0 && (
                    <div className="flex gap-0.5 mt-1">
                      {dayItems.slice(0, 3).map((item, idx) => (
                        <div
                          key={idx}
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: item.color || 'hsl(var(--primary))' }}
                        />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </Card>

        {/* Selected Day Items */}
        <div className="space-y-3 pb-6">
          <div className="flex items-center justify-between">
            <h3 className="text-[17px] font-bold text-foreground">
              {format(selectedDate, "EEEE, MMMM d")}
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDayPress(selectedDate)}
            >
              Open Day
            </Button>
          </div>
          
          {selectedDayItems.length === 0 ? (
            <Card className="p-6 text-center backdrop-blur-2xl border-white/15">
              <p className="text-foreground/60">No events or tasks for this day</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {selectedDayItems
                .sort((a, b) => {
                  // Events first, then tasks
                  if (a.type !== b.type) return a.type === 'event' ? -1 : 1;
                  // Sort by time
                  return new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime();
                })
                .map((item) => (
                  <CalendarItemCard
                    key={item.id}
                    item={item}
                    onPress={() => onItemPress(item)}
                    onToggleComplete={() => onToggleComplete(item)}
                  />
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
