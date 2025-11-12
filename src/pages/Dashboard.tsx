import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Plus,
  Bell,
  Clock,
  Sparkles,
  ArrowRight,
  Calendar as CalendarIcon,
  Heart
} from "lucide-react";
import BottomNav from "@/components/BottomNav";
import AICompanion from "@/components/AICompanion";
import { getTodayPrayerTimes, type PrayerTimes } from "@/services/prayer";
import { saveDhikrSession } from "@/services/db";
import { useState, useEffect } from "react";

const Dashboard = () => {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [dhikrCount, setDhikrCount] = useState(0);
  const [showAI, setShowAI] = useState(false);

  useEffect(() => {
    (async () => {
      const times = await getTodayPrayerTimes();
      setPrayerTimes(times);
    })();
  }, []);

  const handleSaveDhikr = async () => {
    if (dhikrCount > 0) {
      await saveDhikrSession("SubhanAllah", dhikrCount, 33);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Hero Header */}
      <header className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5 px-6 pt-12 pb-8 rounded-b-[3rem]">
        <div className="flex items-center justify-between mb-6">
          <Avatar className="w-14 h-14 ring-2 ring-primary/20">
            <AvatarImage src="" />
            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-secondary/20 text-foreground font-medium">
              N
            </AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-2">
            <Button 
              onClick={() => setShowAI(true)} 
              size="icon" 
              className="rounded-full bg-primary hover:bg-primary/90 w-11 h-11 shadow-lg"
            >
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </Button>
            <Button 
              size="icon" 
              variant="ghost" 
              className="rounded-full w-11 h-11 bg-card/50 hover:bg-card/80 backdrop-blur-sm"
            >
              <Bell className="w-5 h-5 text-foreground" />
            </Button>
          </div>
        </div>

        <div className="space-y-1">
          <h1 className="text-3xl font-semibold text-foreground tracking-tight">
            Assalamu Alaikum
          </h1>
          <p className="text-muted-foreground">Saturday, January 11, 2025</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 space-y-5 -mt-4">
        {/* Next Prayer Card - Featured */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-accent via-accent to-accent/90 border-none shadow-card rounded-[1.5rem] p-6">
          {prayerTimes ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-accent-foreground/60 text-sm font-medium">Next Prayer</p>
                  <h2 className="text-accent-foreground text-3xl font-bold">{prayerTimes.next}</h2>
                </div>
                <div className="w-16 h-16 rounded-2xl bg-primary/20 backdrop-blur-sm flex items-center justify-center">
                  <span className="text-3xl">🕌</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-accent-foreground/10 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: '65%' }} />
                </div>
                <div className="flex items-center gap-1.5 text-accent-foreground/80 text-sm font-medium">
                  <Clock className="w-4 h-4" />
                  <span>{prayerTimes.nextInMinutes}m</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-accent-foreground/60">Loading prayer times...</div>
          )}
        </Card>

        {/* Prayer Times Grid */}
        {prayerTimes && (
          <div className="grid grid-cols-5 gap-2">
            {[
              { name: 'Fajr', time: prayerTimes.fajr, icon: '🌅' },
              { name: 'Dhuhr', time: prayerTimes.dhuhr, icon: '☀️' },
              { name: 'Asr', time: prayerTimes.asr, icon: '🌤️' },
              { name: 'Maghrib', time: prayerTimes.maghrib, icon: '🌆' },
              { name: 'Isha', time: prayerTimes.isha, icon: '🌙' }
            ].map((prayer) => (
              <Card 
                key={prayer.name} 
                className="border-border bg-card rounded-2xl p-3 text-center hover:shadow-md transition-shadow"
              >
                <div className="text-2xl mb-2">{prayer.icon}</div>
                <p className="text-xs text-muted-foreground mb-1">{prayer.name}</p>
                <p className="text-xs font-semibold text-foreground">{prayer.time}</p>
              </Card>
            ))}
          </div>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="border-border bg-gradient-to-br from-secondary/30 to-secondary/10 rounded-2xl p-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Streak</span>
                <span className="text-xl">🔥</span>
              </div>
              <p className="text-3xl font-bold text-foreground">7</p>
              <p className="text-xs text-muted-foreground">days strong</p>
            </div>
          </Card>

          <Card className="border-border bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl p-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Today</span>
                <span className="text-xl">✨</span>
              </div>
              <p className="text-3xl font-bold text-foreground">3/5</p>
              <p className="text-xs text-muted-foreground">prayers completed</p>
            </div>
          </Card>
        </div>

        {/* Dhikr Counter - Interactive */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-primary/5 border border-primary/20 rounded-[1.5rem] p-6">
          <div className="text-center space-y-4">
            <div className="space-y-1">
              <h3 className="text-foreground font-semibold text-lg">Dhikr Counter</h3>
              <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
                <Sparkles className="w-4 h-4" />
                <span>SubhanAllah × 33</span>
              </div>
            </div>

            {/* Circular Progress */}
            <div className="relative w-40 h-40 mx-auto">
              <svg className="w-full h-full -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="none"
                  stroke="hsl(var(--muted))"
                  strokeWidth="8"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="8"
                  strokeDasharray={`${(dhikrCount / 33) * 439.8} 439.8`}
                  strokeLinecap="round"
                  className="transition-all duration-300"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-5xl font-bold text-foreground">{dhikrCount}</span>
              </div>
            </div>

            <div className="flex gap-3 justify-center">
              <Button 
                onClick={() => setDhikrCount(prev => Math.min(prev + 1, 33))}
                className="rounded-full px-8 py-6 bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                Tap
              </Button>
              <Button 
                onClick={() => {
                  handleSaveDhikr();
                  setDhikrCount(0);
                }}
                variant="ghost"
                className="rounded-full px-6 py-6 bg-card hover:bg-muted/80 border border-border"
              >
                Reset
              </Button>
            </div>
          </div>
        </Card>

        {/* Daily Reflection */}
        <Card className="border-border bg-card rounded-[1.5rem] p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary/40 to-secondary/20 flex items-center justify-center shrink-0">
              <Heart className="w-6 h-6 text-secondary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-foreground font-semibold mb-1">Morning Reflection</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-3.5 h-3.5" />
                <span>10:00 AM - 10:30 AM</span>
              </div>
            </div>
            <Button 
              size="icon"
              className="rounded-full w-10 h-10 bg-accent hover:bg-accent/90 shrink-0"
            >
              <ArrowRight className="w-4 h-4 text-accent-foreground" />
            </Button>
          </div>
        </Card>

        {/* Community Card */}
        <Card className="border-border bg-card rounded-[1.5rem] p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-foreground font-semibold">Community</h3>
            <Badge className="rounded-full bg-primary/10 text-primary border-primary/20">
              3 active
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex -space-x-3">
              {[1, 2, 3].map((i) => (
                <Avatar key={i} className="w-11 h-11 border-2 border-card ring-1 ring-border">
                  <AvatarFallback className="bg-gradient-to-br from-muted to-muted/50 text-muted-foreground font-medium">
                    {i}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
            <Button 
              size="sm"
              className="rounded-full bg-foreground hover:bg-foreground/90 text-background h-9 px-4"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Invite
            </Button>
          </div>
        </Card>
      </main>

      <BottomNav />
      {showAI && <AICompanion onClose={() => setShowAI(false)} />}
    </div>
  );
};

export default Dashboard;
