import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Bell, CheckCircle2, Circle, Sparkles, BookOpen, Heart, Hand, Star, Sun, Moon, Sunrise, Sunset, Target, Trophy, ChevronLeft, ChevronRight, Pencil } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import AddHabitSheet from "@/components/habits/AddHabitSheet";
import { listHabits, toggleHabit, initializeDefaultHabits } from "@/services/db";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { format, addDays, subDays, isSameDay, startOfWeek, eachDayOfInterval } from "date-fns";

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
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { toast } = useToast();

  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: addDays(weekStart, 6) });

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
  const total = habits.length;
  const progress = total > 0 ? (completed / total) * 100 : 0;
  const score = total > 0 ? (completed / total * 10).toFixed(1) : "0.0";

  // Simulated weekly data for the bar chart
  const weeklyData = [65, 80, 45, 90, 70, 55, progress];
  const pastelColors = [
    'bg-gelato-lavender',
    'bg-gelato-pink', 
    'bg-gelato-green',
    'bg-gelato-yellow',
    'bg-gelato-blue',
    'bg-gelato-peach',
    'bg-gelato-lavender'
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background pb-20"
    >
      {/* Header */}
      <header className="px-3 pt-10 pb-2">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-title-2 text-foreground">Statistics</h1>
          <div className="flex items-center gap-2">
            <Button 
              size="icon" 
              variant="ghost"
              className="rounded-full w-9 h-9"
            >
              <Bell className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex bg-muted rounded-full p-1 mb-4">
          <button className="flex-1 py-1.5 px-3 text-xs font-semibold rounded-full bg-foreground text-background transition-all">
            Today
          </button>
          <button className="flex-1 py-1.5 px-3 text-xs font-medium text-muted-foreground rounded-full transition-all">
            Weekly
          </button>
          <button className="flex-1 py-1.5 px-3 text-xs font-medium text-muted-foreground rounded-full transition-all">
            Overall
          </button>
        </div>
      </header>

      <main className="px-3 space-y-3">
        {/* Circular Progress Wheel with Habits */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-card rounded-2xl p-4 relative overflow-hidden border-0 shadow-soft">
            <div className="relative flex items-center justify-center py-4">
              {/* Habit Ring */}
              <div className="relative w-48 h-48">
                {/* Background circle segments */}
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  {habits.map((habit, index) => {
                    const segmentAngle = 360 / Math.max(habits.length, 1);
                    const startAngle = index * segmentAngle;
                    const radius = 42;
                    const circumference = 2 * Math.PI * radius;
                    const segmentLength = (segmentAngle / 360) * circumference;
                    const gap = 4;
                    const actualLength = segmentLength - gap;
                    const offset = (startAngle / 360) * circumference;
                    
                    const colors = ['#FFCBE1', '#D6E5BD', '#F9E1A8', '#BCD8EC', '#DCCCEC', '#FFDAB4'];
                    const color = colors[index % colors.length];
                    
                    return (
                      <motion.circle
                        key={habit.id}
                        cx="50"
                        cy="50"
                        r={radius}
                        fill="none"
                        stroke={habit.completed ? color : '#f0f0f0'}
                        strokeWidth="12"
                        strokeLinecap="round"
                        strokeDasharray={`${actualLength} ${circumference - actualLength}`}
                        strokeDashoffset={-offset}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 + index * 0.1 }}
                      />
                    );
                  })}
                </svg>
                
                {/* Center Score */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <motion.span 
                    className="text-4xl font-bold text-foreground"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.3 }}
                  >
                    {score}
                  </motion.span>
                  <span className="text-xs text-muted-foreground mt-0.5">
                    Your <span className="font-semibold">daily habits</span> are
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {progress >= 80 ? 'complete!' : 'not completed.'} ⓘ
                  </span>
                </div>

                {/* Habit Icons around the ring */}
                {habits.slice(0, 6).map((habit, index) => {
                  const angle = (index * (360 / Math.max(habits.length, 1)) - 90) * (Math.PI / 180);
                  const radius = 80;
                  const x = Math.cos(angle) * radius;
                  const y = Math.sin(angle) * radius;
                  const IconComponent = iconMap[habit.icon] || Star;
                  
                  return (
                    <motion.div
                      key={habit.id}
                      className="absolute w-6 h-6 flex items-center justify-center"
                      style={{
                        left: `calc(50% + ${x}px - 12px)`,
                        top: `calc(50% + ${y}px - 12px)`,
                      }}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.4 + index * 0.1, type: "spring" }}
                    >
                      <IconComponent className="w-4 h-4 text-muted-foreground" />
                    </motion.div>
                  );
                })}
              </div>

              {/* Edit Button */}
              <Button
                size="icon"
                variant="ghost"
                className="absolute top-2 right-2 w-8 h-8 rounded-full"
              >
                <Pencil className="w-3.5 h-3.5" />
              </Button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-2 mt-2">
              <Button 
                onClick={() => setShowAddSheet(true)}
                className="rounded-full bg-foreground text-background hover:bg-foreground/90 text-xs px-4 py-2 h-8"
              >
                Add habit
              </Button>
              <Button size="icon" variant="outline" className="rounded-full w-8 h-8">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </Button>
              <Button size="icon" variant="outline" className="rounded-full w-8 h-8">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Status Alert */}
        {progress < 100 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gelato-pink/30 border-0 rounded-xl p-3">
              <p className="text-xs text-foreground">
                Your habits score dropped <span className="text-gelato-pink-dark font-semibold">12%</span> compared to yesterday.
              </p>
              <Button variant="ghost" className="mt-1.5 h-7 px-3 text-xs font-semibold bg-foreground text-background rounded-full hover:bg-foreground/90">
                Let's discuss
              </Button>
            </Card>
          </motion.div>
        )}

        {/* Summary Chart */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-card border-0 rounded-2xl p-3 shadow-soft">
            <h3 className="text-sm font-semibold text-foreground mb-3">Summary:</h3>
            <div className="flex items-end justify-between gap-1 h-24">
              {weeklyData.map((value, idx) => (
                <motion.div
                  key={idx}
                  className="flex-1 flex flex-col items-center"
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: 0.4 + idx * 0.05, duration: 0.3 }}
                  style={{ transformOrigin: 'bottom' }}
                >
                  <div className="w-full relative" style={{ height: '80px' }}>
                    {/* Secondary bar (lighter) */}
                    <div 
                      className={`absolute bottom-0 w-full rounded-t-lg opacity-50 ${pastelColors[(idx + 3) % pastelColors.length]}`}
                      style={{ height: `${Math.max(value * 0.6, 10)}%` }}
                    />
                    {/* Primary bar */}
                    <motion.div 
                      className={`absolute bottom-0 w-full rounded-t-lg ${pastelColors[idx]}`}
                      initial={{ height: 0 }}
                      animate={{ height: `${Math.max(value * 0.8, 15)}%` }}
                      transition={{ delay: 0.5 + idx * 0.05, duration: 0.4, ease: "easeOut" }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Habit List */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">Today's Habits</h3>
            <span className="text-xs text-muted-foreground">{completed}/{total}</span>
          </div>
          
          <AnimatePresence>
            {habits.map((habit, idx) => {
              const IconComponent = iconMap[habit.icon] || Star;
              const colors = ['bg-gelato-lavender', 'bg-gelato-pink', 'bg-gelato-green', 'bg-gelato-yellow', 'bg-gelato-blue', 'bg-gelato-peach'];
              const bgColor = colors[idx % colors.length];
              
              return (
                <motion.div
                  key={habit.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: 0.1 + idx * 0.05 }}
                >
                  <Card 
                    className={`${bgColor} border-0 rounded-xl p-3 transition-all duration-200 active:scale-[0.98]`}
                    onClick={() => handleToggle(habit.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-white/50 flex items-center justify-center">
                          <IconComponent className="w-4 h-4 text-foreground/70" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-foreground">{habit.name}</h4>
                          {habit.streak > 0 && (
                            <p className="text-[10px] text-foreground/60">{habit.streak} day streak</p>
                          )}
                        </div>
                      </div>
                      <motion.div
                        whileTap={{ scale: 0.9 }}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                          habit.completed 
                            ? 'bg-foreground border-foreground' 
                            : 'bg-white/50 border-foreground/30'
                        }`}
                      >
                        {habit.completed && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 500 }}
                          >
                            <CheckCircle2 className="w-4 h-4 text-background" />
                          </motion.div>
                        )}
                      </motion.div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {habits.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="bg-card rounded-2xl p-6 text-center border-0 shadow-soft">
              <div className="w-12 h-12 rounded-full bg-gelato-pink/30 mx-auto mb-3 flex items-center justify-center">
                <Star className="w-6 h-6 text-gelato-pink-dark" />
              </div>
              <h3 className="text-headline text-foreground mb-1">Start your journey</h3>
              <p className="text-xs text-muted-foreground mb-4">Add habits to track your spiritual growth</p>
              <Button 
                onClick={() => setShowAddSheet(true)}
                className="rounded-full bg-foreground text-background"
              >
                Add Your First Habit
              </Button>
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
