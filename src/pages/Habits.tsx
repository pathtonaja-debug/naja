import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Bell, Flame, CheckCircle2, Circle } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { listHabits, toggleHabit } from "@/services/db";
import { useState, useEffect } from "react";

const Habits = () => {
  const [habits, setHabits] = useState<any[]>([]);

  async function load() {
    const data = await listHabits();
    setHabits(data);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleToggle(id: string) {
    await toggleHabit(id);
    load();
  }

  const completed = habits.filter(h => h.completed).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-olive/30 via-butter/20 to-pink/30 pb-24">
      {/* Header */}
      <header className="px-6 pt-12 pb-6">
        <div className="flex items-center justify-between mb-8">
          <Avatar className="w-12 h-12">
            <AvatarImage src="" />
            <AvatarFallback className="bg-muted">U</AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-3">
            <Button size="icon" className="rounded-full bg-foreground hover:bg-foreground/90 w-12 h-12">
              <Plus className="w-5 h-5 text-background" />
            </Button>
            <Button size="icon" variant="ghost" className="rounded-full w-12 h-12 bg-muted hover:bg-muted/80">
              <Bell className="w-5 h-5 text-foreground" />
            </Button>
          </div>
        </div>

        <h1 className="text-2xl font-medium text-foreground mb-2">
          Spiritual Habits
        </h1>
        <p className="text-sm text-muted-foreground">Build consistency with faith</p>
      </header>

      {/* Main Content */}
      <main className="px-6 space-y-4">
        {/* Progress Summary */}
        <Card className="backdrop-blur-2xl bg-gradient-to-br from-butter/40 to-olive/30 border-white/15 rounded-[2rem] p-5">
          <div className="text-center">
            <p className="text-sm text-foreground/60 mb-1">Today's Progress</p>
            <p className="text-3xl font-bold text-foreground">{completed}/{habits.length}</p>
            <p className="text-sm text-foreground/60 mt-1">habits completed</p>
          </div>
        </Card>

        {/* Habits List */}
        {habits.map((habit, idx) => {
          const gradients = [
            'bg-gradient-to-br from-pink/30 to-lilac/20',
            'bg-gradient-to-br from-sky/30 to-butter/20',
            'bg-gradient-to-br from-olive/30 to-pink/20',
            'bg-gradient-to-br from-lilac/30 to-sky/20',
          ];
          return (
            <Card key={habit.id} className={`backdrop-blur-2xl border-white/15 rounded-[2rem] p-5 ${gradients[idx % gradients.length]}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl backdrop-blur-xl border border-white/20 ${habit.completed ? 'bg-olive/40' : 'bg-white/30'} flex items-center justify-center shrink-0`}>
                    {habit.completed ? (
                      <CheckCircle2 className="w-6 h-6 text-olive" />
                    ) : (
                      <Circle className="w-6 h-6 text-foreground/40" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-foreground font-medium">{habit.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-foreground/60 mt-1">
                      <Flame className="w-4 h-4 text-pink" />
                      <span>{habit.streak} day streak</span>
                    </div>
                  </div>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleToggle(habit.id)}
                  className="rounded-full w-10 h-10 bg-white/30 backdrop-blur-xl hover:bg-white/40 border border-white/20"
                >
                  {habit.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-olive" />
                  ) : (
                    <Plus className="w-5 h-5 text-foreground" />
                  )}
                </Button>
              </div>
              {!habit.completed && (
                <Badge className="rounded-full bg-white/30 backdrop-blur-xl text-foreground/70 border border-white/20">
                  Tap to complete
                </Badge>
              )}
            </Card>
          );
        })}
      </main>

      <BottomNav />
    </div>
  );
};

export default Habits;
