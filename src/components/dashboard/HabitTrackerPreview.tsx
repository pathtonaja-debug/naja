import { Button } from "@/components/ui/button";
import { Heart, BookOpen, Dumbbell, Star, Plus, Check, Sparkles, Sunrise } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useHabitPreview } from "@/hooks/useHabits";
import { Skeleton } from "@/components/ui/skeleton";

interface HabitPreviewProps {
  icon: string;
  name: string;
  category: string;
  progress: number;
  total: number;
  completed: boolean;
}

const iconMap: Record<string, React.ReactNode> = {
  heart: <Heart className="w-6 h-6 text-primary-foreground" />,
  "book-open": <BookOpen className="w-6 h-6 text-secondary-foreground" />,
  star: <Star className="w-6 h-6 text-accent-foreground" />,
  sparkles: <Sparkles className="w-6 h-6 text-primary-foreground" />,
  sunrise: <Sunrise className="w-6 h-6 text-primary-foreground" />,
  default: <Dumbbell className="w-6 h-6 text-accent-foreground" />,
};

const colorMap: Record<string, { bg: string; iconBg: string }> = {
  Prayer: { bg: "bg-primary/5", iconBg: "bg-primary" },
  Dhikr: { bg: "bg-secondary/5", iconBg: "bg-secondary" },
  Reflection: { bg: "bg-accent/5", iconBg: "bg-accent" },
  Quran: { bg: "bg-primary/5", iconBg: "bg-primary" },
  Spiritual: { bg: "bg-primary/5", iconBg: "bg-primary" },
  Health: { bg: "bg-accent/5", iconBg: "bg-accent" },
  default: { bg: "bg-muted/5", iconBg: "bg-muted" },
};

function HabitPreview({ icon, name, category, progress, total, completed }: HabitPreviewProps) {
  const colors = colorMap[category] || colorMap.default;
  const iconElement = iconMap[icon] || iconMap.default;

  return (
    <div className={`liquid-glass p-4 rounded-card ${colors.bg} border border-border/10`}>
      <div className="flex items-center gap-4">
        <div className={`w-14 h-14 rounded-2xl ${colors.iconBg} flex items-center justify-center flex-shrink-0 relative`}>
          {iconElement}
          {completed && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <Check className="w-3 h-3 text-white" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-body font-semibold text-foreground truncate">{name}</h4>
          <p className="text-caption-2 text-foreground-muted">{category}</p>
        </div>
        <div className="flex gap-1">
          {Array.from({ length: Math.min(total, 7) }).map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-colors ${
                i < progress ? colors.iconBg : "bg-muted"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function HabitSkeleton() {
  return (
    <div className="liquid-glass p-4 rounded-card">
      <div className="flex items-center gap-4">
        <Skeleton className="w-14 h-14 rounded-2xl" />
        <div className="flex-1">
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-3 w-16" />
        </div>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <Skeleton key={i} className="w-2 h-2 rounded-full" />
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
    {
      id: "1",
      icon: "heart",
      name: "Morning Dhikr",
      category: "Spiritual",
      progress: 5,
      total: 7,
      completed: false,
    },
    {
      id: "2",
      icon: "book-open",
      name: "Quran Reading",
      category: "Spiritual",
      progress: 4,
      total: 7,
      completed: false,
    },
    {
      id: "3",
      icon: "sunrise",
      name: "Fajr Prayer",
      category: "Prayer",
      progress: 3,
      total: 7,
      completed: true,
    },
  ];

  const habits = previewHabits.length > 0 ? previewHabits : fallbackHabits;

  return (
    <div className="px-5 py-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-title-2 text-foreground font-semibold">Habit Tracker</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-primary"
          onClick={() => navigate("/habits")}
        >
          <Plus className="w-4 h-4 mr-1" />
          Add
        </Button>
      </div>
      <div className="space-y-3">
        {loading ? (
          <>
            <HabitSkeleton />
            <HabitSkeleton />
            <HabitSkeleton />
          </>
        ) : (
          habits.map((habit) => (
            <HabitPreview key={habit.id} {...habit} />
          ))
        )}
      </div>
    </div>
  );
}