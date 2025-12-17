import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Clock, MapPin, BookOpen, Users } from "lucide-react";
import { 
  format, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval,
  isSameDay,
  isToday,
  addWeeks,
  subWeeks,
  parseISO
} from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarItem } from "@/types/calendar";

interface WeekViewProps {
  week: Date;
  items: CalendarItem[];
  onWeekChange: (week: Date) => void;
  onItemPress: (item: CalendarItem) => void;
}

// Mock Islamic dates - in production, use a proper Hijri calendar library
const getHijriDate = (date: Date) => {
  // Simplified mock - would use actual Hijri conversion
  return { month: "Jumada Al-Awwal", year: 1447 };
};

const upcomingIslamicDates = [
  { name: "Laylat al-Qadr", hijriDate: "27 Ramadan 1447", daysAway: 145 },
  { name: "Eid al-Fitr", hijriDate: "1 Shawwal 1447", daysAway: 148 },
  { name: "Day of Arafah", hijriDate: "9 Dhul Hijjah 1447", daysAway: 218 },
];

const getCategoryIcon = (category: string) => {
  switch (category?.toLowerCase()) {
    case 'prayer':
      return <MapPin className="w-4 h-4 text-muted-foreground" />;
    case 'study':
      return <BookOpen className="w-4 h-4 text-muted-foreground" />;
    case 'community':
      return <Users className="w-4 h-4 text-muted-foreground" />;
    default:
      return <Clock className="w-4 h-4 text-muted-foreground" />;
  }
};

export const WeekView = ({ week, items, onWeekChange, onItemPress }: WeekViewProps) => {
  const weekStart = startOfWeek(week);
  const weekEnd = endOfWeek(week);
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });
  const hijri = getHijriDate(week);
  
  // Get today's events
  const todayEvents = items.filter(item => 
    item.type === 'event' && isSameDay(parseISO(item.startDateTime), new Date())
  );

  // Check which days have events
  const daysWithEvents = new Set(
    items.map(item => format(parseISO(item.startDateTime), 'yyyy-MM-dd'))
  );

  return (
    <div className="flex flex-col px-4">
      {/* Month/Year Header */}
      <div className="flex items-center justify-between py-3">
        <Button
          size="icon"
          variant="ghost"
          className="w-8 h-8"
          onClick={() => onWeekChange(subWeeks(week, 1))}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <div className="text-center">
          <p className="text-sm font-semibold text-foreground">{hijri.month} {hijri.year}</p>
          <p className="text-xs text-muted-foreground">{format(week, "MMMM yyyy")}</p>
        </div>
        <Button
          size="icon"
          variant="ghost"
          className="w-8 h-8"
          onClick={() => onWeekChange(addWeeks(week, 1))}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Separator */}
      <div className="h-px bg-border mb-3" />

      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center text-[10px] text-muted-foreground font-medium">
            {day}
          </div>
        ))}
      </div>

      {/* Week Days Strip */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {days.map((day) => {
          const isCurrentDay = isToday(day);
          const dateKey = format(day, 'yyyy-MM-dd');
          const hasEvents = daysWithEvents.has(dateKey);
          const isSelected = isCurrentDay; // Can be expanded for selection state
          
          return (
            <button
              key={day.toISOString()}
              className="flex flex-col items-center py-1"
            >
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all",
                isSelected 
                  ? "bg-foreground text-background" 
                  : "text-foreground hover:bg-muted"
              )}>
                {format(day, "d")}
              </div>
              {hasEvents && (
                <div className="w-1 h-1 rounded-full bg-foreground mt-0.5" />
              )}
            </button>
          );
        })}
      </div>

      {/* Today's Events Section */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Today's Events</h3>
        
        {todayEvents.length === 0 ? (
          <Card className="p-4 bg-card border-border">
            <p className="text-xs text-muted-foreground text-center">No events today</p>
          </Card>
        ) : (
          <div className="space-y-2">
            {todayEvents.map((event) => (
              <Card
                key={event.id}
                className="p-3 bg-card border-border cursor-pointer active:scale-[0.98] transition-transform"
                onClick={() => onItemPress(event)}
              >
                <div className="flex items-start gap-3">
                  {/* Colored left border indicator */}
                  <div 
                    className="w-1 self-stretch rounded-full flex-shrink-0"
                    style={{ backgroundColor: event.color || 'hsl(var(--primary))' }}
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-foreground">{event.title}</p>
                        {event.notes && (
                          <p className="text-xs text-muted-foreground mt-0.5">{event.notes}</p>
                        )}
                      </div>
                      {getCategoryIcon(event.category)}
                    </div>
                    
                    <div className="flex items-center gap-1 mt-2 text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span className="text-xs">
                        {format(parseISO(event.startDateTime), "h:mm a")}
                        {event.endDateTime && ` - ${format(parseISO(event.endDateTime), "h:mm a")}`}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Upcoming Islamic Dates */}
      <div className="mt-6 space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Upcoming Islamic Dates</h3>
        
        <Card className="bg-card border-border divide-y divide-border">
          {upcomingIslamicDates.map((date, index) => (
            <div key={index} className="px-3 py-2.5 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">{date.name}</p>
                <p className="text-xs text-muted-foreground">{date.hijriDate}</p>
              </div>
              <span className="text-xs text-muted-foreground">in {date.daysAway} days</span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
};
