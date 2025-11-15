import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProgressRing } from "@/components/ui/progress-ring";
import { Plus, Bell, Flame, CheckCircle2, Circle, Sparkles, BookOpen, Heart, Hand, Star, Sun, Moon, Sunrise, Sunset, Target, Trophy } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import AddHabitSheet from "@/components/habits/AddHabitSheet";
import WeeklyProgress from "@/components/habits/WeeklyProgress";
import { listHabits, toggleHabit, initializeDefaultHabits } from "@/services/db";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

const iconMap: Record<string, any> = {
  'book-open': BookOpen,
  'heart': Heart,
  'hand': Hand,
  'sparkles': Sparkles,
  'star': Star,
  'sun': Sun,
  'moon': Moon,
  'sunrise': Sunrise,
  'sunset': Sunset,
  'target': Target,
  'trophy': Trophy
};

const Habits = () => {
  const [habits, setHabits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddSheet, setShowAddSheet] = useState(false);
  const { toast } = useToast();

  async function load() {
    try {
      await initializeDefaultHabits();
      const data = await listHabits();
      setHabits(data);
    } catch (error) {
      console.error("Error loading habits:", error);
      toast({ title: "Failed to load habits", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleToggle(id: string) {
    try {
      await toggleHabit(id);
      await load();
      toast({ title: "Habit updated" });
    } catch (error) {
      console.error("Error toggling habit:", error);
      toast({ title: "Failed to update habit", variant: "destructive" });
    }
  }

  const completed = habits.filter(h => h.completed).length;
  const progress = habits.length > 0 ? (completed / habits.length) * 100 : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-olive/30 via-butter/20 to-pink/30 flex items-center justify-center">
        <div className="text-foreground/60">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-olive/30 via-butter/20 to-pink/30 pb-24">
      {/* Header */}
      <header className="px-6 pt-12 pb-6">
        <div className="flex items-center justify-between mb-8">
          <Avatar className="w-12 h-12 backdrop-blur-xl bg-white/30 border border-white/20">
            <AvatarImage src="" />
            <AvatarFallback className="bg-transparent text-foreground">N</AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-3">
            <Button 
              size="icon" 
              onClick={() => setShowAddSheet(true)}
              className="rounded-full bg-foreground hover:bg-foreground/90 w-12 h-12 shadow-lg"
            >
              <Plus className="w-5 h-5 text-background" />
            </Button>
            <Button size="icon" variant="ghost" className="rounded-full w-12 h-12 backdrop-blur-xl bg-white/30 hover:bg-white/40 border border-white/20">
              <Bell className="w-5 h-5 text-foreground" />
            </Button>
          </div>
        </div>

        <h1 className="text-3xl font-semibold text-foreground mb-2">
          Spiritual Habits
        </h1>
        <p className="text-sm text-foreground/60">Build consistency with faith</p>
      </header>

      {/* Main Content */}
      <main className="px-6 space-y-4">
        {/* Progress Summary */}
        <Card className="backdrop-blur-3xl bg-gradient-to-br from-butter/40 to-olive/30 border-white/15 rounded-[2rem] p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground/60 mb-1">Today's Progress</p>
              <p className="text-4xl font-bold text-foreground">{completed}/{habits.length}</p>
              <p className="text-sm text-foreground/60 mt-1">habits completed</p>
            </div>
            <ProgressRing 
              progress={progress} 
              size={100} 
              strokeWidth={8}
            />
          </div>
        </Card>

        {/* AI Companion Insight */}
        {completed > 0 && (
          <Card className="backdrop-blur-3xl bg-gradient-to-br from-lilac/30 to-pink/20 border-white/15 rounded-[2rem] p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full backdrop-blur-xl bg-white/40 border border-white/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-lilac" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Your companion left you a message</p>
                <p className="text-xs text-foreground/60 mt-0.5">Tap to view insight</p>
              </div>
            </div>
          </Card>
        )}

        {/* Empty State */}
        {habits.length === 0 && (
          <Card className="backdrop-blur-3xl bg-gradient-to-br from-sky/30 to-butter/20 border-white/15 rounded-[2rem] p-8 text-center">
            <div className="w-16 h-16 rounded-full backdrop-blur-xl bg-white/40 border border-white/20 mx-auto mb-4 flex items-center justify-center">
              <Star className="w-8 h-8 text-butter" />
            </div>
            <h3 className="text-xl font-medium text-foreground mb-2">Let's build your spiritual habits</h3>
            <p className="text-sm text-foreground/60 mb-6">Choose small, meaningful actions to strengthen your routine</p>
            <Button 
              onClick={() => setShowAddSheet(true)}
              className="rounded-full bg-foreground text-background hover:bg-foreground/90"
            >
              Add Your First Habit
            </Button>
          </Card>
        )}

        {/* Habits List */}
        {habits.map((habit, idx) => {
          const gradients = [
            'bg-gradient-to-br from-pink/30 to-lilac/20',
            'bg-gradient-to-br from-sky/30 to-butter/20',
            'bg-gradient-to-br from-olive/30 to-pink/20',
            'bg-gradient-to-br from-lilac/30 to-sky/20',
          ];
          
          const IconComponent = iconMap[habit.icon] || Star;
          
          return (
            <Card 
              key={habit.id} 
              className={`backdrop-blur-3xl border-white/15 rounded-[2rem] p-5 transition-all duration-300 hover:scale-[1.02] ${gradients[idx % gradients.length]}`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-14 h-14 rounded-2xl backdrop-blur-xl border border-white/20 flex items-center justify-center shrink-0 transition-all duration-300 ${
                    habit.completed ? 'bg-olive/50 shadow-lg' : 'bg-white/40'
                  }`}>
                    {habit.completed ? (
                      <CheckCircle2 className="w-7 h-7 text-olive" />
                    ) : (
                      <IconComponent className="w-7 h-7 text-foreground/70" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-foreground font-semibold text-lg">{habit.name}</h3>
                    {habit.streak > 0 && (
                      <div className="flex items-center gap-1 text-sm text-foreground/60 mt-1">
                        <Flame className="w-4 h-4 text-pink" />
                        <span>{habit.streak} day streak</span>
                      </div>
                    )}
                  </div>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleToggle(habit.id)}
                  className="rounded-full w-12 h-12 backdrop-blur-xl bg-white/30 hover:bg-white/50 border border-white/20 transition-all duration-300 active:scale-95"
                >
                  {habit.completed ? (
                    <CheckCircle2 className="w-6 h-6 text-olive" />
                  ) : (
                    <Circle className="w-6 h-6 text-foreground/40" />
                  )}
                </Button>
              </div>
              {!habit.completed && (
                <Badge className="rounded-full backdrop-blur-xl bg-white/40 text-foreground/70 border border-white/20">
                  Tap to complete
                </Badge>
              )}
            </Card>
          );
        })}

        {/* Weekly Progress */}
        {habits.length > 0 && <WeeklyProgress />}

        {/* Add Habit Button */}
        {habits.length > 0 && (
          <Card 
            onClick={() => setShowAddSheet(true)}
            className="backdrop-blur-3xl bg-gradient-to-br from-white/30 to-white/20 border-white/15 border-2 border-dashed rounded-[2rem] p-6 text-center cursor-pointer hover:bg-white/40 transition-all duration-300 active:scale-98"
          >
            <div className="flex items-center justify-center gap-2 text-foreground/70">
              <Plus className="w-5 h-5" />
              <span className="font-medium">Add New Habit</span>
            </div>
          </Card>
        )}
      </main>

      <AddHabitSheet 
        open={showAddSheet} 
        onOpenChange={setShowAddSheet}
        onSuccess={load}
      />

      <BottomNav />
    </div>
  );
};

export default Habits;
