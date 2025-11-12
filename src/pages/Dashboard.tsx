import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TopBar } from "@/components/ui/top-bar";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { ProgressRing } from "@/components/ui/progress-ring";
import { 
  Plus,
  Bell,
  Clock,
  Sparkles,
  ArrowRight,
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
  const [timeView, setTimeView] = useState("today");

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
      {/* Top Bar */}
      <TopBar
        avatarFallback="N"
        rightElement={
          <div className="flex items-center gap-2">
            <Button 
              onClick={() => setShowAI(true)} 
              size="icon" 
              variant="ghost"
              className="w-11 h-11"
            >
              <Sparkles className="w-5 h-5" />
            </Button>
            <Button 
              size="icon" 
              variant="ghost"
              className="w-11 h-11"
            >
              <Bell className="w-5 h-5" />
            </Button>
          </div>
        }
      />

      {/* Greeting Section */}
      <div className="px-5 pt-2 pb-6">
        <h1 className="text-[28px] leading-[32px] font-semibold text-foreground mb-1">
          Assalamu Alaikum
        </h1>
        <p className="text-[15px] leading-[22px] text-foreground-muted">
          Saturday, January 11, 2025
        </p>
      </div>

      {/* Time View Segmented Control */}
      <div className="px-5 pb-5">
        <SegmentedControl
          value={timeView}
          onValueChange={setTimeView}
          options={[
            { label: "Today", value: "today" },
            { label: "Week", value: "week" },
            { label: "Month", value: "month" },
          ]}
        />
      </div>

      {/* Main Content */}
      <main className="px-5 space-y-5">
        {/* Next Prayer Card */}
        <Card className="relative overflow-hidden bg-accent border-none p-6">
          {prayerTimes ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-accent-foreground/70 text-[12px] leading-[18px] font-medium">Next Prayer</p>
                  <h2 className="text-accent-foreground text-[28px] leading-[32px] font-semibold">{prayerTimes.next}</h2>
                </div>
                <div className="w-16 h-16 rounded-card bg-primary/20 backdrop-blur-sm flex items-center justify-center">
                  <span className="text-3xl">🕌</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-accent-foreground/10 rounded-pill overflow-hidden">
                  <div className="h-full bg-primary rounded-pill transition-all duration-med ease-ios" style={{ width: '65%' }} />
                </div>
                <div className="flex items-center gap-1.5 text-accent-foreground/80 text-[12px] leading-[18px] font-medium">
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
                className="p-3 text-center transition-all duration-fast ease-ios hover:shadow-elevation-2 active:scale-[0.98]"
              >
                <div className="text-2xl mb-2">{prayer.icon}</div>
                <p className="text-[12px] leading-[18px] text-foreground-muted mb-1">{prayer.name}</p>
                <p className="text-[12px] leading-[18px] font-semibold text-foreground">{prayer.time}</p>
              </Card>
            ))}
          </div>
        )}

        {/* Stats & Habits Grid */}
        <div className="grid grid-cols-3 gap-3">
          {/* Dhikr Ring */}
          <Card className="p-4 flex flex-col items-center justify-center">
            <ProgressRing 
              progress={(dhikrCount / 33) * 100} 
              size={56} 
              strokeWidth={5}
            />
            <div className="mt-2 text-center">
              <p className="text-[15px] leading-[22px] font-medium text-foreground">{dhikrCount}</p>
              <p className="text-[12px] leading-[18px] text-foreground-muted">Dhikr</p>
            </div>
          </Card>

          {/* Prayer Progress */}
          <Card className="p-4 flex flex-col items-center justify-center">
            <ProgressRing 
              progress={60} 
              size={56} 
              strokeWidth={5}
            />
            <div className="mt-2 text-center">
              <p className="text-[15px] leading-[22px] font-medium text-foreground">3/5</p>
              <p className="text-[12px] leading-[18px] text-foreground-muted">Prayers</p>
            </div>
          </Card>

          {/* Streak */}
          <Card className="p-4 flex flex-col items-center justify-center">
            <div className="text-3xl mb-2">🔥</div>
            <div className="text-center">
              <p className="text-[15px] leading-[22px] font-medium text-foreground">7</p>
              <p className="text-[12px] leading-[18px] text-foreground-muted">Day streak</p>
            </div>
          </Card>
        </div>

        {/* Dhikr Counter - Interactive */}
        <Card className="p-6">
          <div className="text-center space-y-4">
            <div className="space-y-1">
              <h3 className="text-[22px] leading-[28px] font-semibold text-foreground">Dhikr Counter</h3>
              <div className="flex items-center justify-center gap-2 text-[12px] leading-[18px] text-foreground-muted">
                <Sparkles className="w-4 h-4" />
                <span>SubhanAllah × 33</span>
              </div>
            </div>

            {/* Circular Progress */}
            <div className="py-4">
              <ProgressRing 
                progress={(dhikrCount / 33) * 100}
                size={160}
                strokeWidth={12}
              />
              <div className="mt-4">
                <span className="text-[48px] leading-[52px] font-bold text-foreground">{dhikrCount}</span>
              </div>
            </div>

            <div className="flex gap-3 justify-center">
              <Button 
                onClick={() => setDhikrCount(prev => Math.min(prev + 1, 33))}
                className="px-8"
              >
                <Plus className="w-5 h-5 mr-2" />
                Tap
              </Button>
              <Button 
                onClick={() => {
                  handleSaveDhikr();
                  setDhikrCount(0);
                }}
                variant="outline"
              >
                Reset
              </Button>
            </div>
          </div>
        </Card>

        {/* Daily Reflection */}
        <Card className="p-5 transition-all duration-fast ease-ios hover:shadow-elevation-2 active:scale-[0.98] cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-card bg-secondary/30 flex items-center justify-center shrink-0">
              <Heart className="w-6 h-6 text-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-[15px] leading-[22px] font-semibold text-foreground mb-1">Morning Reflection</h3>
              <div className="flex items-center gap-2 text-[12px] leading-[18px] text-foreground-muted">
                <Clock className="w-3.5 h-3.5" />
                <span>10:00 AM - 10:30 AM</span>
              </div>
            </div>
            <Button 
              size="icon"
              variant="ghost"
              className="shrink-0"
            >
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </Card>

        {/* Community Card */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[15px] leading-[22px] font-semibold text-foreground">Community</h3>
            <Badge className="rounded-pill bg-primary/10 text-primary border-primary/20 text-[12px]">
              3 active
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex -space-x-3">
              {[1, 2, 3].map((i) => (
                <div 
                  key={i} 
                  className="w-11 h-11 rounded-full border-2 border-surface bg-muted flex items-center justify-center text-[15px] font-medium text-foreground-muted"
                >
                  {i}
                </div>
              ))}
            </div>
            <Button 
              size="sm"
              className="h-9 px-4"
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
