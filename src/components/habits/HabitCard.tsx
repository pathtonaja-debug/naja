import { motion } from "framer-motion";
import { Check } from "lucide-react";
import * as Icons from "lucide-react";
import { cn } from "@/lib/utils";

interface HabitCardProps {
  id: string;
  name: string;
  icon?: string;
  color?: string;
  isAllDay: boolean;
  time?: string;
  completed: boolean;
  onToggle: (id: string) => void;
  onClick: (id: string) => void;
}

export default function HabitCard({
  id,
  name,
  icon = "target",
  color = "#E8EAED",
  isAllDay,
  time,
  completed,
  onToggle,
  onClick
}: HabitCardProps) {
  const IconComponent = (Icons as any)[icon] || Icons.Target;

  const formatTime = (timeString?: string) => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-background/40 backdrop-blur-xl rounded-2xl p-4 border border-border/50 shadow-sm"
    >
      <div className="flex items-center gap-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: color }}
        >
          <IconComponent className="w-6 h-6 text-foreground/80" strokeWidth={1.5} />
        </div>

        <div 
          className="flex-1 min-w-0 cursor-pointer"
          onClick={() => onClick(id)}
        >
          <h4 className="text-[15px] font-medium text-foreground truncate">
            {name}
          </h4>
          <p className="text-[13px] text-muted-foreground">
            {isAllDay ? "All day" : formatTime(time)}
          </p>
        </div>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            onToggle(id);
          }}
          className={cn(
            "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0",
            completed
              ? "bg-primary border-primary"
              : "border-border/50 hover:border-primary/50"
          )}
        >
          {completed && <Check className="w-5 h-5 text-primary-foreground" strokeWidth={3} />}
        </motion.button>
      </div>
    </motion.div>
  );
}
