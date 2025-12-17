import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { 
  format, 
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
  getDay,
  parseISO
} from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarItem } from "@/types/calendar";
import { useState, useMemo } from "react";

interface DayViewProps {
  day: Date;
  items: CalendarItem[];
  onDayChange: (day: Date) => void;
  onItemPress: (item: CalendarItem) => void;
  onToggleComplete: (item: CalendarItem) => void;
}

// Mock Hijri date conversion
const getHijriDate = (date: Date) => {
  return { month: "Jumada Al-Awwal", year: 1447 };
};

// Event type colors for legend
const eventTypes = [
  { name: "Prayer Events", color: "bg-foreground" },
  { name: "Study Sessions", color: "bg-primary" },
  { name: "Community Events", color: "bg-muted-foreground" },
];

export const DayView = ({ day, items, onDayChange, onItemPress, onToggleComplete }: DayViewProps) => {
  const [currentMonth, setCurrentMonth] = useState(day);
  const [selectedDate, setSelectedDate] = useState(day);
  
  const hijri = getHijriDate(currentMonth);
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const firstDayOfWeek = getDay(monthStart);
  const paddingDays = Array(firstDayOfWeek).fill(null);

  // Map items by date
  const itemsByDate = useMemo(() => {
    const map = new Map<string, CalendarItem[]>();
    items.forEach(item => {
      const dateKey = format(parseISO(item.startDateTime), 'yyyy-MM-dd');
      if (!map.has(dateKey)) {
        map.set(dateKey, []);
      }
      map.get(dateKey)!.push(item);
    });
    return map;
  }, [items]);

  // Calculate monthly progress
  const monthlyStats = useMemo(() => {
    const prayerEvents = items.filter(i => i.category?.toLowerCase() === 'prayer').length;
    const studySessions = items.filter(i => i.category?.toLowerCase() === 'study').length;
    const totalPrayers = 30 * 5; // 30 days * 5 prayers
    return {
      prayersCompleted: prayerEvents,
      prayersTotal: totalPrayers,
      studySessions,
    };
  }, [items]);

  const handleMonthChange = (direction: 'prev' | 'next') => {
    const newMonth = direction === 'prev' 
      ? subMonths(currentMonth, 1) 
      : addMonths(currentMonth, 1);
    setCurrentMonth(newMonth);
  };

  const handleDaySelect = (date: Date) => {
    setSelectedDate(date);
    onDayChange(date);
  };

  return (
    <div className="flex flex-col px-4">
      {/* Month/Year Header */}
      <div className="flex items-center justify-between py-3">
        <Button
          size="icon"
          variant="ghost"
          className="w-8 h-8"
          onClick={() => handleMonthChange('prev')}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <div className="text-center">
          <p className="text-sm font-semibold text-foreground">{format(currentMonth, "MMMM yyyy")}</p>
          <p className="text-xs text-muted-foreground">{hijri.month} {hijri.year}</p>
        </div>
        <Button
          size="icon"
          variant="ghost"
          className="w-8 h-8"
          onClick={() => handleMonthChange('next')}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Separator */}
      <div className="h-px bg-border mb-3" />

      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((dayName) => (
          <div key={dayName} className="text-center text-[10px] text-muted-foreground font-medium">
            {dayName}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {paddingDays.map((_, i) => (
          <div key={`pad-${i}`} className="aspect-square" />
        ))}
        
        {days.map((date) => {
          const dateKey = format(date, 'yyyy-MM-dd');
          const dayItems = itemsByDate.get(dateKey) || [];
          const isSelected = isSameDay(date, selectedDate);
          const isCurrentDay = isToday(date);
          const hasEvents = dayItems.length > 0;
          const inCurrentMonth = isSameMonth(date, currentMonth);
          
          return (
            <button
              key={date.toISOString()}
              onClick={() => handleDaySelect(date)}
              className={cn(
                "aspect-square flex flex-col items-center justify-center rounded-lg text-xs font-medium transition-all relative",
                !inCurrentMonth && "text-muted-foreground/40",
                inCurrentMonth && !isSelected && "text-foreground",
                isSelected && "bg-foreground text-background",
                !isSelected && isCurrentDay && "ring-1 ring-foreground",
                !isSelected && hasEvents && "ring-1 ring-border bg-card",
                !isSelected && !hasEvents && "hover:bg-muted"
              )}
            >
              {format(date, "d")}
              {hasEvents && !isSelected && (
                <div className="absolute bottom-1 flex gap-0.5">
                  {dayItems.slice(0, 3).map((item, idx) => (
                    <div
                      key={idx}
                      className="w-1 h-1 rounded-full"
                      style={{ backgroundColor: item.color || 'currentColor' }}
                    />
                  ))}
                </div>
              )}
              {isSelected && hasEvents && (
                <div className="absolute bottom-1 w-1 h-1 rounded-full bg-background" />
              )}
            </button>
          );
        })}
      </div>

      {/* Event Types Legend */}
      <Card className="p-3 bg-card border-border mb-4">
        <h4 className="text-xs font-semibold text-foreground mb-2">Event Types</h4>
        <div className="space-y-1.5">
          {eventTypes.map((type, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className={cn("w-2 h-2 rounded-full", type.color)} />
              <span className="text-xs text-muted-foreground">{type.name}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Monthly Progress */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">
          {format(currentMonth, "MMMM")} Progress
        </h3>
        
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-3 bg-card border-border text-center">
            <p className="text-lg font-bold text-foreground">
              {monthlyStats.prayersCompleted}/{monthlyStats.prayersTotal}
            </p>
            <p className="text-[10px] text-muted-foreground mb-2">Prayers Completed</p>
            <Progress 
              value={(monthlyStats.prayersCompleted / monthlyStats.prayersTotal) * 100} 
              className="h-1"
            />
          </Card>
          
          <Card className="p-3 bg-card border-border text-center">
            <p className="text-lg font-bold text-foreground">{monthlyStats.studySessions}</p>
            <p className="text-[10px] text-muted-foreground mb-2">Study Sessions</p>
            <Progress 
              value={Math.min((monthlyStats.studySessions / 10) * 100, 100)} 
              className="h-1"
            />
          </Card>
        </div>
      </div>
    </div>
  );
};
