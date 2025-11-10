import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, BookOpen, Heart, TrendingUp } from "lucide-react";

const Dashboard = () => {
  const prayerTimes = [
    { name: "Fajr", time: "5:32 AM", completed: true },
    { name: "Dhuhr", time: "12:45 PM", completed: true },
    { name: "Asr", time: "3:58 PM", completed: false, isNext: true },
    { name: "Maghrib", time: "6:15 PM", completed: false },
    { name: "Isha", time: "7:42 PM", completed: false },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/10">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-light text-foreground">
                Assalamu Alaikum 🌿
              </h1>
              <p className="text-sm text-muted-foreground">
                Saturday, January 11, 2025 • 10 Rajab 1447
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-5xl mx-auto px-6 py-8 space-y-8">
        {/* Prayer Times Card */}
        <Card className="p-6 shadow-sm border-border bg-card animate-fade-in">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-foreground">Today's Prayer Times</h2>
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                View All
              </Button>
            </div>

            <div className="space-y-3">
              {prayerTimes.map((prayer) => (
                <div
                  key={prayer.name}
                  className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                    prayer.isNext
                      ? "bg-primary/5 border border-primary/20"
                      : "bg-accent/30"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        prayer.completed
                          ? "bg-success/20 text-success"
                          : prayer.isNext
                          ? "bg-primary/20 text-primary"
                          : "bg-muted/50 text-muted-foreground"
                      }`}
                    >
                      {prayer.completed ? "✓" : "○"}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{prayer.name}</p>
                      {prayer.isNext && (
                        <p className="text-xs text-primary">Up next</p>
                      )}
                    </div>
                  </div>
                  <p className="text-sm font-medium text-foreground">{prayer.time}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Daily Focus */}
        <Card className="p-6 shadow-sm border-border bg-card animate-fade-in">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-medium text-foreground">Daily Focus</h2>
            </div>
            <blockquote className="text-foreground/90 italic leading-relaxed border-l-2 border-primary pl-4">
              "And He found you lost and guided you."
              <footer className="text-sm text-muted-foreground mt-2 not-italic">
                — Surah Ad-Duha (93:7)
              </footer>
            </blockquote>
            <Button variant="outline" className="w-full border-border hover:bg-accent">
              Open Reflection Journal
            </Button>
          </div>
        </Card>

        {/* Progress Overview */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="p-5 shadow-sm border-border bg-card animate-fade-in">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <p className="text-sm">This Week</p>
              </div>
              <p className="text-2xl font-light text-foreground">4 Reflections</p>
              <p className="text-xs text-success">+2 from last week</p>
            </div>
          </Card>

          <Card className="p-5 shadow-sm border-border bg-card animate-fade-in">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Heart className="w-4 h-4" />
                <p className="text-sm">Duas Saved</p>
              </div>
              <p className="text-2xl font-light text-foreground">12 Duas</p>
              <p className="text-xs text-muted-foreground">3 categories</p>
            </div>
          </Card>

          <Card className="p-5 shadow-sm border-border bg-card animate-fade-in">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <TrendingUp className="w-4 h-4" />
                <p className="text-sm">Habit Streak</p>
              </div>
              <p className="text-2xl font-light text-foreground">7 Days</p>
              <p className="text-xs text-success">Keep it up! 🌟</p>
            </div>
          </Card>
        </div>

        {/* Dhikr Counter Preview */}
        <Card className="p-6 shadow-sm border-border bg-gradient-to-br from-primary/5 to-primary/10 animate-fade-in">
          <div className="text-center space-y-4">
            <h3 className="text-lg font-medium text-foreground">Dhikr Counter</h3>
            <div className="w-32 h-32 mx-auto rounded-full bg-card border-4 border-primary/30 flex items-center justify-center">
              <p className="text-3xl font-light text-foreground">33</p>
            </div>
            <Button className="bg-primary hover:bg-primary/90 text-white">
              Start Counting
            </Button>
          </div>
        </Card>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg">
        <div className="container max-w-5xl mx-auto px-6 py-3">
          <div className="flex justify-around items-center">
            {[
              { icon: "🏠", label: "Dashboard", active: true },
              { icon: "📔", label: "Journal", active: false },
              { icon: "💫", label: "Habits", active: false },
              { icon: "🤲", label: "Duas", active: false },
              { icon: "🧭", label: "Profile", active: false },
            ].map((item) => (
              <button
                key={item.label}
                className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-200 ${
                  item.active
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Dashboard;
