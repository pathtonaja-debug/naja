import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Bell, Flame } from "lucide-react";
import BottomNav from "@/components/BottomNav";

const Habits = () => {
  const habits = [
    { name: "Salah on Time", streak: 7, completed: true, color: "bg-primary" },
    { name: "Dhikr 33×", streak: 5, completed: true, color: "bg-secondary" },
    { name: "Qur'an 2 Pages", streak: 3, completed: false, color: "bg-accent" },
    { name: "Gratitude Note", streak: 12, completed: false, color: "bg-primary/20" },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
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
        {/* Habits List */}
        {habits.map((habit, i) => (
          <Card key={i} className="border-border bg-card rounded-[2rem] p-5 shadow-card">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl ${habit.color} flex items-center justify-center shrink-0`}>
                  <span className="text-lg">{habit.completed ? "✓" : "○"}</span>
                </div>
                <div>
                  <h3 className="text-foreground font-medium">{habit.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                    <Flame className="w-4 h-4 text-primary" />
                    <span>{habit.streak} day streak</span>
                  </div>
                </div>
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="rounded-full w-10 h-10 bg-muted hover:bg-muted/80"
              >
                <span className="text-lg">{habit.completed ? "✓" : "+"}</span>
              </Button>
            </div>
            {!habit.completed && (
              <Badge className="rounded-full bg-muted text-muted-foreground hover:bg-muted/80">
                Tap to complete
              </Badge>
            )}
          </Card>
        ))}
      </main>

      <BottomNav />
    </div>
  );
};

export default Habits;
