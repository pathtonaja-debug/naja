import { Card } from "@/components/ui/card";
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth,
  getDay,
  isSameDay,
  isToday
} from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarItem } from "@/types/calendar";

interface YearViewProps {
  year: number;
  items: CalendarItem[];
  onMonthPress: (month: Date) => void;
}

const MonthCard = ({ 
  month, 
  items, 
  onPress 
}: { 
  month: Date; 
  items: CalendarItem[];
  onPress: () => void;
}) => {
  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Add padding days for alignment
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

  return (
    <Card
      className={cn(
        "p-4 cursor-pointer transition-all active:scale-[0.98] backdrop-blur-2xl",
        "bg-gradient-to-br from-white/20 to-white/10 border-white/15",
        isToday(month) && "ring-2 ring-primary/50"
      )}
      onClick={onPress}
    >
      <h3 className="text-[15px] font-bold text-foreground mb-3">
        {format(month, "MMMM")}
      </h3>
      
      <div className="grid grid-cols-7 gap-1">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
          <div key={i} className="text-[10px] text-foreground/50 text-center font-semibold">
            {day}
          </div>
        ))}
        
        {paddingDays.map((_, i) => (
          <div key={`pad-${i}`} />
        ))}
        
        {days.map((day) => {
          const dateKey = format(day, 'yyyy-MM-dd');
          const dayItems = itemsByDate.get(dateKey) || [];
          const hasEvents = dayItems.length > 0;
          
          return (
            <div key={day.toISOString()} className="aspect-square flex flex-col items-center justify-center">
              <span
                className={cn(
                  "text-[11px] font-medium",
                  isSameMonth(day, month) ? "text-foreground" : "text-foreground/30",
                  isToday(day) && "text-primary font-bold"
                )}
              >
                {format(day, "d")}
              </span>
              {hasEvents && (
                <div className="flex gap-0.5 mt-0.5">
                  {dayItems.slice(0, 3).map((item, idx) => (
                    <div
                      key={idx}
                      className="w-1 h-1 rounded-full"
                      style={{ backgroundColor: item.color || 'hsl(var(--primary))' }}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export const YearView = ({ year, items, onMonthPress }: YearViewProps) => {
  const months = Array.from({ length: 12 }, (_, i) => new Date(year, i, 1));

  return (
    <div className="grid grid-cols-3 gap-4 p-6">
      {months.map((month) => {
        const monthItems = items.filter(item => {
          const itemDate = new Date(item.startDateTime);
          return isSameMonth(itemDate, month);
        });
        
        return (
          <MonthCard
            key={month.toISOString()}
            month={month}
            items={monthItems}
            onPress={() => onMonthPress(month)}
          />
        );
      })}
    </div>
  );
};
