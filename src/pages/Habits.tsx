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
import { motion, AnimatePresence } from "framer-motion";
import tasbihWatercolor from "@/assets/illustrations/tasbih-watercolor.png";
import mosqueWatercolor from "@/assets/illustrations/mosque-watercolor.png";

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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground/60">Loading...</div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-background pb-24 relative overflow-hidden"
    >
      {/* Watercolor decorations */}
      <motion.img 
        src={tasbihWatercolor}
        alt=""
        className="absolute top-20 right-0 w-32 h-32 object-contain opacity-20 pointer-events-none"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 0.2, x: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      />
      <motion.img 
        src={mosqueWatercolor}
        alt=""
        className="absolute bottom-40 left-0 w-28 h-28 object-contain opacity-15 pointer-events-none"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 0.15, x: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      />

      {/* Header */}
      <header className="px-6 pt-12 pb-6">
        <motion.div 
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Avatar className="w-12 h-12 border border-border">
            <AvatarImage src="" />
            <AvatarFallback className="bg-muted text-foreground">N</AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-3">
            <Button 
              size="icon" 
              onClick={() => setShowAddSheet(true)}
              className="rounded-full w-12 h-12 shadow-lg"
            >
              <Plus className="w-5 h-5" />
            </Button>
            <Button size="icon" variant="outline" className="rounded-full w-12 h-12">
              <Bell className="w-5 h-5 text-foreground" />
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h1 className="text-3xl font-semibold text-foreground mb-2">
            Spiritual Habits
          </h1>
          <p className="text-sm text-muted-foreground">Build consistency with faith</p>
        </motion.div>
      </header>

      {/* Main Content */}
      <main className="px-6 space-y-4">
        {/* Progress Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card className="bg-accent border-none rounded-3xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-accent-foreground/60 mb-1">Today's Progress</p>
                <p className="text-4xl font-bold text-accent-foreground">{completed}/{habits.length}</p>
                <p className="text-sm text-accent-foreground/60 mt-1">habits completed</p>
              </div>
              <ProgressRing 
                progress={progress} 
                size={100} 
                strokeWidth={8}
              />
            </div>
          </Card>
        </motion.div>

        {/* Empty State */}
        {habits.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-card rounded-3xl p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center">
                <Star className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-medium text-foreground mb-2">Let's build your spiritual habits</h3>
              <p className="text-sm text-muted-foreground mb-6">Choose small, meaningful actions to strengthen your routine</p>
              <Button 
                onClick={() => setShowAddSheet(true)}
                className="rounded-full"
              >
                Add Your First Habit
              </Button>
            </Card>
          </motion.div>
        )}

        {/* Habits List */}
        <AnimatePresence>
          {habits.map((habit, idx) => {
            const IconComponent = iconMap[habit.icon] || Star;
            
            return (
              <motion.div
                key={habit.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: 0.1 + idx * 0.05 }}
              >
                <Card className="bg-card rounded-3xl p-5 transition-all duration-300 hover:shadow-md">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-300 ${
                        habit.completed ? 'bg-primary/20' : 'bg-muted'
                      }`}>
                        {habit.completed ? (
                          <CheckCircle2 className="w-7 h-7 text-primary" />
                        ) : (
                          <IconComponent className="w-7 h-7 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-foreground font-semibold text-lg">{habit.name}</h3>
                        {habit.streak > 0 && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                            <Flame className="w-4 h-4 text-orange-500" />
                            <span>{habit.streak} day streak</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <Button
                      size="icon"
                      variant={habit.completed ? "default" : "outline"}
                      onClick={() => handleToggle(habit.id)}
                      className="rounded-full w-12 h-12 transition-all duration-300 active:scale-95"
                    >
                      {habit.completed ? (
                        <CheckCircle2 className="w-6 h-6" />
                      ) : (
                        <Circle className="w-6 h-6" />
                      )}
                    </Button>
                  </div>
                  {!habit.completed && (
                    <Badge variant="secondary" className="rounded-full">
                      Tap to complete
                    </Badge>
                  )}
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Weekly Progress */}
        {habits.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <WeeklyProgress />
          </motion.div>
        )}

        {/* Add Habit Button */}
        {habits.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <Card 
              onClick={() => setShowAddSheet(true)}
              className="bg-card border-2 border-dashed border-border rounded-3xl p-6 text-center cursor-pointer hover:bg-muted/50 transition-all duration-300 active:scale-[0.98]"
            >
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Plus className="w-5 h-5" />
                <span className="font-medium">Add New Habit</span>
              </div>
            </Card>
          </motion.div>
        )}
      </main>

      <AddHabitSheet 
        open={showAddSheet} 
        onOpenChange={setShowAddSheet}
        onSuccess={load}
      />

      <BottomNav />
    </motion.div>
  );
};

export default Habits;
