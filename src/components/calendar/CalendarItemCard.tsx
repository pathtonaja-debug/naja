import { CalendarItem } from "@/types/calendar";
import { Card } from "@/components/ui/card";
import { CategoryChip } from "./CategoryChip";
import { Checkbox } from "@/components/ui/checkbox";
import { Clock, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface CalendarItemCardProps {
  item: CalendarItem;
  onPress?: () => void;
  onToggleComplete?: () => void;
  showTime?: boolean;
  compact?: boolean;
}

export const CalendarItemCard = ({
  item,
  onPress,
  onToggleComplete,
  showTime = true,
  compact = false,
}: CalendarItemCardProps) => {
  const startTime = new Date(item.startDateTime);
  const endTime = item.endDateTime ? new Date(item.endDateTime) : null;
  const isCompleted = item.type === "task" && item.completion === 100;

  return (
    <Card
      className={cn(
        "p-4 cursor-pointer transition-all active:scale-[0.98] backdrop-blur-3xl border-white/15",
        compact ? "p-3" : "p-4",
        isCompleted && "opacity-60"
      )}
      onClick={onPress}
    >
      <div className="flex items-start gap-3">
        {item.type === "task" && (
          <Checkbox
            checked={isCompleted}
            onCheckedChange={onToggleComplete}
            onClick={(e) => e.stopPropagation()}
            className="mt-1"
          />
        )}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h4
              className={cn(
                "text-[15px] leading-[22px] font-semibold text-foreground",
                isCompleted && "line-through"
              )}
            >
              {item.title}
            </h4>
            <CategoryChip category={item.category} />
          </div>

          {showTime && (
            <div className="flex items-center gap-2 text-[13px] text-foreground/60">
              <Clock className="w-3.5 h-3.5" />
              {item.isAllDay ? (
                <span>All day</span>
              ) : (
                <span>
                  {format(startTime, "h:mm a")}
                  {endTime && ` - ${format(endTime, "h:mm a")}`}
                </span>
              )}
            </div>
          )}

          {item.type === "task" && !isCompleted && item.completion! > 0 && (
            <div className="flex items-center gap-2 mt-2">
              <div className="flex-1 h-1.5 bg-white/20 rounded-pill overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-secondary rounded-pill transition-all"
                  style={{ width: `${item.completion}%` }}
                />
              </div>
              <span className="text-[11px] text-foreground/60">{item.completion}%</span>
            </div>
          )}

          {isCompleted && (
            <div className="flex items-center gap-1.5 mt-2 text-[12px] text-success">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Completed</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
