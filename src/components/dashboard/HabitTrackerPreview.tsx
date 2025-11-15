import { Button } from "@/components/ui/button";
import { Heart, BookOpen, Dumbbell, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface HabitPreviewProps {
  icon: React.ReactNode;
  name: string;
  category: string;
  progress: number;
  total: number;
  color: string;
  bgColor: string;
}

function HabitPreview({ icon, name, category, progress, total, color, bgColor }: HabitPreviewProps) {
  return (
    <div className={`liquid-glass p-4 rounded-card ${bgColor} border border-${color}/10`}>
      <div className="flex items-center gap-4">
        <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center flex-shrink-0`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-body font-semibold text-foreground truncate">{name}</h4>
          <p className="text-caption-2 text-foreground-muted">{category}</p>
        </div>
        <div className="flex gap-1">
          {Array.from({ length: total }).map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full ${
                i < progress ? color.replace("bg-", "bg-") : "bg-muted"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function HabitTrackerPreview() {
  const navigate = useNavigate();

  const habits = [
    {
      icon: <Heart className="w-6 h-6 text-primary-foreground" />,
      name: "Morning Dhikr",
      category: "Spiritual",
      progress: 5,
      total: 7,
      color: "bg-primary",
      bgColor: "bg-primary/5"
    },
    {
      icon: <BookOpen className="w-6 h-6 text-secondary-foreground" />,
      name: "Quran Reading",
      category: "Spiritual",
      progress: 4,
      total: 7,
      color: "bg-secondary",
      bgColor: "bg-secondary/5"
    },
    {
      icon: <Dumbbell className="w-6 h-6 text-accent-foreground" />,
      name: "Exercise",
      category: "Health",
      progress: 3,
      total: 7,
      color: "bg-accent",
      bgColor: "bg-accent/5"
    },
  ];

  return (
    <div className="px-5 py-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-title-2 text-foreground font-semibold">Habit Tracker</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-primary"
          onClick={() => navigate("/habit-tracker")}
        >
          <Plus className="w-4 h-4 mr-1" />
          Add
        </Button>
      </div>
      <div className="space-y-3">
        {habits.map((habit) => (
          <HabitPreview key={habit.name} {...habit} />
        ))}
      </div>
    </div>
  );
}
