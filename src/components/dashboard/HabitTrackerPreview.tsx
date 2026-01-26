import { Button } from "@/components/ui/button";
import { Heart, BookOpen, Dumbbell, Star, Plus, Check, Sparkles, Sunrise, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useHabitPreview } from "@/hooks/useHabits";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface HabitPreviewProps {
  icon: string;
  name: string;
  category: string;
  progress: number;
  total: number;
  completed: boolean;
  index: number;
}

const iconMap: Record<string, React.ReactNode> = {
  heart: <Heart className="w-4 h-4 text-primary-foreground" />,
  "book-open": <BookOpen className="w-4 h-4 text-primary-foreground" />,
  star: <Star className="w-4 h-4 text-primary-foreground" />,
  sparkles: <Sparkles className="w-4 h-4 text-primary-foreground" />,
  sunrise: <Sunrise className="w-4 h-4 text-primary-foreground" />,
  default: <Dumbbell className="w-4 h-4 text-primary-foreground" />,
};

// Semantic color mapping for categories
const colorMap: Record<string, { bg: string; iconBg: string }> = {
  Prayer: { bg: "bg-semantic-yellow-soft", iconBg: "bg-semantic-yellow-dark" },
  Dhikr: { bg: "bg-semantic-lavender-soft", iconBg: "bg-semantic-lavender-dark" },
  Reflection: { bg: "bg-semantic-green-soft", iconBg: "bg-semantic-green-dark" },
  Quran: { bg: "bg-semantic-blue-soft", iconBg: "bg-semantic-blue-dark" },
  Spiritual: { bg: "bg-semantic-lavender-soft", iconBg: "bg-semantic-lavender-dark" },
  Health: { bg: "bg-semantic-teal-soft", iconBg: "bg-semantic-teal-dark" },
  default: { bg: "bg-muted", iconBg: "bg-muted-foreground" },
};

function HabitPreview({ icon, name, category, progress, total, completed, index }: HabitPreviewProps) {
  const colors = colorMap[category] || colorMap.default;
  const iconElement = iconMap[icon] || iconMap.default;

  return (
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.2 }}
      whileHover={{ scale: 1.01, x: 4 }}
      className={cn(
        "p-2.5 rounded-xl border border-border/30 cursor-pointer",
        colors.bg
      )}
    >
      <div className="flex items-center gap-2.5">
        <div className={cn(
          "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 relative",
          colors.iconBg
        )}>
          <div className="w-4 h-4">{iconElement}</div>
          {completed && (
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-semantic-green-dark rounded-full flex items-center justify-center shadow-sm"
            >
              <Check className="w-2 h-2 text-white" />
            </motion.div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-xs font-medium text-foreground truncate">{name}</h4>
          <p className="text-[9px] text-foreground-muted">{category}</p>
        </div>
        <div className="flex gap-0.5">
          {Array.from({ length: Math.min(total, 7) }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1 + i * 0.03 }}
              className={cn(
                "w-1.5 h-1.5 rounded-full transition-colors",
                i < progress ? colors.iconBg : "bg-muted/50"
              )}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function HabitSkeleton() {
  return (
    <div className="p-2.5 rounded-xl border border-border/30">
      <div className="flex items-center gap-2.5">
        <Skeleton className="w-8 h-8 rounded-lg" />
        <div className="flex-1">
          <Skeleton className="h-3 w-20 mb-1" />
          <Skeleton className="h-2 w-12" />
        </div>
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="w-1.5 h-1.5 rounded-full" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function HabitTrackerPreview() {
  const navigate = useNavigate();
  const { previewHabits, loading } = useHabitPreview();

  // Fallback static habits if no data
  const fallbackHabits = [
    { id: "1", icon: "heart", name: "Morning Dhikr", category: "Spiritual", progress: 5, total: 7, completed: false },
    { id: "2", icon: "book-open", name: "Quran Reading", category: "Spiritual", progress: 4, total: 7, completed: false },
    { id: "3", icon: "sunrise", name: "Fajr Prayer", category: "Prayer", progress: 3, total: 7, completed: true },
  ];

  const habits = previewHabits.length > 0 ? previewHabits : fallbackHabits;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="px-3 py-2"
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm text-foreground font-semibold">Habits</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-foreground text-xs h-7 px-2"
          onClick={() => navigate("/habits")}
        >
          <Plus className="w-3 h-3 mr-0.5" />
          Add
        </Button>
      </div>
      <div className="space-y-1.5">
        {loading ? (
          <>
            <HabitSkeleton />
            <HabitSkeleton />
            <HabitSkeleton />
          </>
        ) : (
          habits.map((habit, index) => (
            <HabitPreview key={habit.id} {...habit} index={index} />
          ))
        )}
      </div>
      
      {/* View All Button */}
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={() => navigate("/habits")}
        className="w-full mt-2 py-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors flex items-center justify-center gap-1 text-[10px] text-foreground-muted font-medium"
      >
        View All Habits
        <ChevronRight className="w-3 h-3" />
      </motion.button>
    </motion.div>
  );
}
