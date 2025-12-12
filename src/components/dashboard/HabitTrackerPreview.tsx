import { Button } from "@/components/ui/button";
import { Heart, BookOpen, Dumbbell, Star, Plus, Check, Sparkles, Sunrise } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useHabitPreview } from "@/hooks/useHabits";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import blueInterior from "@/assets/blue-mosque-interior.jpg";

interface HabitPreviewProps {
  icon: string;
  name: string;
  category: string;
  progress: number;
  total: number;
  completed: boolean;
}

const iconMap: Record<string, React.ReactNode> = {
  heart: <Heart className="w-5 h-5" />,
  "book-open": <BookOpen className="w-5 h-5" />,
  star: <Star className="w-5 h-5" />,
  sparkles: <Sparkles className="w-5 h-5" />,
  sunrise: <Sunrise className="w-5 h-5" />,
  default: <Dumbbell className="w-5 h-5" />,
};

function HabitPreview({ icon, name, category, progress, total, completed }: HabitPreviewProps) {
  const iconElement = iconMap[icon] || iconMap.default;

  return (
    <motion.div 
      whileHover={{ scale: 1.01 }}
      className="sage-card p-4 border border-white/20"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-white/60 flex items-center justify-center flex-shrink-0 relative text-primary-foreground">
          {iconElement}
          {completed && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-accent rounded-full flex items-center justify-center">
              <Check className="w-3 h-3 text-accent-foreground" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm sm:text-base font-semibold text-primary-foreground truncate">{name}</h4>
          <p className="text-xs text-primary-foreground/60 font-medium">{category}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-lg font-display font-semibold text-primary-foreground">{progress}/{total}</span>
          <div className="flex gap-1">
            {Array.from({ length: Math.min(total, 7) }).map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  i < progress ? "bg-accent" : "bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function HabitSkeleton() {
  return (
    <div className="sage-card p-4">
      <div className="flex items-center gap-4">
        <Skeleton className="w-12 h-12 rounded-2xl" />
        <div className="flex-1">
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="h-6 w-10" />
      </div>
    </div>
  );
}

export function HabitTrackerPreview() {
  const navigate = useNavigate();
  const { previewHabits, loading } = useHabitPreview();

  const fallbackHabits = [
    { id: "1", icon: "heart", name: "Morning Dhikr", category: "Spiritual", progress: 5, total: 7, completed: false },
    { id: "2", icon: "book-open", name: "Quran Reading", category: "Spiritual", progress: 4, total: 7, completed: false },
    { id: "3", icon: "sunrise", name: "Fajr Prayer", category: "Prayer", progress: 3, total: 7, completed: true },
  ];

  const habits = previewHabits.length > 0 ? previewHabits : fallbackHabits;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="relative rounded-card overflow-hidden"
    >
      {/* Background Image */}
      <img 
        src={blueInterior} 
        alt="Mosque interior" 
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/60" />
      
      {/* Content */}
      <div className="relative z-10 p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl sm:text-2xl font-display font-semibold text-white">
            Habit Tracker
          </h3>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white/80 hover:text-white hover:bg-white/20"
            onClick={() => navigate("/habits")}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>
        <div className="space-y-2.5">
          {loading ? (
            <>
              <HabitSkeleton />
              <HabitSkeleton />
              <HabitSkeleton />
            </>
          ) : (
            habits.map((habit, index) => (
              <motion.div
                key={habit.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <HabitPreview {...habit} />
              </motion.div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
}
