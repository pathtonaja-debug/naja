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
  Heart,
  Building2,
  Target,
  BookOpen,
  Users,
  Flame
} from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { getTodayPrayerTimes, type PrayerTimes } from "@/services/prayer";
import { saveDhikrSession } from "@/services/db";
import { useState, useEffect } from "react";

const Dashboard = () => {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [dhikrCount, setDhikrCount] = useState(0);
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
    <div className="min-h-screen bg-gradient-to-br from-pink/40 via-lilac/30 to-sky/40 pb-24">
      {/* Top Bar */}
      <TopBar
        avatarFallback="N"
        rightElement={
          <Button 
            size="icon" 
            variant="ghost"
            className="w-11 h-11"
          >
            <Bell className="w-5 h-5" />
          </Button>
        }
      />

      {/* Greeting Section */}
      <div className="px-6 pt-4 pb-8">
        <h1 className="text-[34px] leading-[40px] font-bold text-foreground mb-2">
          Assalamu Alaikum
        </h1>
        <p className="text-[17px] leading-[24px] text-foreground-muted font-medium">
          Saturday, January 11, 2025
        </p>
      </div>

      {/* Time View Segmented Control */}
      <div className="px-6 pb-6">
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
      <main className="px-6 space-y-6">
        {/* Next Prayer Card - Gradient */}
        <Card className="relative overflow-hidden bg-gradient-pink-butter border-pink/20 p-8 backdrop-blur-2xl">
          {prayerTimes ? (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-foreground/60 text-[13px] leading-[18px] font-semibold uppercase tracking-wide">Next Prayer</p>
                  <h2 className="text-foreground text-[32px] leading-[38px] font-bold">{prayerTimes.next}</h2>
                </div>
                <div className="w-20 h-20 rounded-[28px] bg-white/30 backdrop-blur-2xl flex items-center justify-center shadow-[0_12px_32px_rgba(28,28,30,0.12)] dark:bg-white/20 border border-white/20">
                  <Building2 className="w-10 h-10 text-pink" />
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2.5 bg-white/30 rounded-pill overflow-hidden backdrop-blur-xl">
                  <div className="h-full bg-gradient-to-r from-pink to-butter rounded-pill transition-all duration-[220ms] ease-[cubic-bezier(0.2,0.8,0.2,1)]" style={{ width: '65%' }} />
                </div>
                <div className="flex items-center gap-2 text-foreground/80 text-[13px] leading-[18px] font-bold px-3 py-1.5 rounded-pill bg-white/30 backdrop-blur-xl">
                  <Clock className="w-4 h-4" />
                  <span>{prayerTimes.nextInMinutes}m</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-foreground/60">Loading prayer times...</div>
          )}
        </Card>

        {/* Prayer Times Grid */}
        {prayerTimes && (
          <div className="grid grid-cols-5 gap-3">
            {[
              { name: 'Fajr', time: prayerTimes.fajr, gradient: 'from-sky/40 to-lilac/30' },
              { name: 'Dhuhr', time: prayerTimes.dhuhr, gradient: 'from-butter/40 to-sky/30' },
              { name: 'Asr', time: prayerTimes.asr, gradient: 'from-olive/40 to-butter/30' },
              { name: 'Maghrib', time: prayerTimes.maghrib, gradient: 'from-pink/40 to-olive/30' },
              { name: 'Isha', time: prayerTimes.isha, gradient: 'from-lilac/40 to-pink/30' }
            ].map((prayer) => (
              <Card 
                key={prayer.name} 
                className={`p-4 text-center backdrop-blur-2xl border-white/15 bg-gradient-to-br ${prayer.gradient}`}
              >
                <p className="text-[13px] leading-[18px] text-foreground/70 font-semibold mb-1">{prayer.name}</p>
                <p className="text-[14px] leading-[20px] font-bold text-foreground">{prayer.time}</p>
              </Card>
            ))}
          </div>
        )}

        {/* Stats & Habits Grid */}
        <div className="grid grid-cols-3 gap-4">
          {/* Dhikr Ring */}
          <Card className="p-5 flex flex-col items-center justify-center backdrop-blur-2xl bg-gradient-to-br from-olive/40 to-butter/30 border-olive/20">
            <ProgressRing 
              progress={(dhikrCount / 33) * 100} 
              size={64} 
              strokeWidth={6}
            />
            <div className="mt-3 text-center">
              <p className="text-[17px] leading-[24px] font-bold text-foreground">{dhikrCount}</p>
              <p className="text-[13px] leading-[18px] text-foreground-muted font-semibold">Dhikr</p>
            </div>
          </Card>

          {/* Prayer Progress */}
          <Card className="p-5 flex flex-col items-center justify-center backdrop-blur-2xl bg-gradient-to-br from-lilac/40 to-pink/30 border-lilac/20">
            <ProgressRing 
              progress={60} 
              size={64} 
              strokeWidth={6}
            />
            <div className="mt-3 text-center">
              <p className="text-[17px] leading-[24px] font-bold text-foreground">3/5</p>
              <p className="text-[13px] leading-[18px] text-foreground-muted font-semibold">Prayers</p>
            </div>
          </Card>

          {/* Streak */}
          <Card className="p-5 flex flex-col items-center justify-center backdrop-blur-2xl bg-gradient-to-br from-sky/40 to-lilac/30 border-sky/20">
            <div className="w-12 h-12 rounded-2xl bg-white/30 backdrop-blur-xl flex items-center justify-center mb-2 border border-white/20">
              <Flame className="w-6 h-6 text-pink" />
            </div>
            <div className="text-center">
              <p className="text-[17px] leading-[24px] font-bold text-foreground">7</p>
              <p className="text-[13px] leading-[18px] text-foreground-muted font-semibold">Streak</p>
            </div>
          </Card>
        </div>

        {/* Dhikr Counter - Interactive - Gradient */}
        <Card className="p-8 bg-gradient-pink-lilac border-pink/20 backdrop-blur-2xl">
          <div className="text-center space-y-5">
            <div className="space-y-2">
              <h3 className="text-[26px] leading-[32px] font-bold text-foreground">Dhikr Counter</h3>
              <div className="flex items-center justify-center gap-2 text-[14px] leading-[20px] text-foreground/70 font-semibold">
                <Sparkles className="w-5 h-5" />
                <span>SubhanAllah × 33</span>
              </div>
            </div>

            {/* Circular Progress */}
            <div className="py-6">
              <ProgressRing 
                progress={(dhikrCount / 33) * 100}
                size={180}
                strokeWidth={14}
              />
              <div className="mt-5">
                <span className="text-[56px] leading-[60px] font-bold text-foreground">{dhikrCount}</span>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <Button 
                onClick={() => setDhikrCount(prev => Math.min(prev + 1, 33))}
                size="lg"
                className="px-10 backdrop-blur-2xl"
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
                size="lg"
              >
                Reset
              </Button>
            </div>
          </div>
        </Card>

        {/* Daily Reflection */}
        <Card className="p-6 backdrop-blur-2xl cursor-pointer active:scale-[0.98] transition-transform bg-gradient-to-br from-butter/40 to-olive/30 border-butter/20">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-[24px] bg-gradient-to-br from-pink/50 to-butter/50 backdrop-blur-xl flex items-center justify-center shrink-0 shadow-elevation-2">
              <Heart className="w-7 h-7 text-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-[17px] leading-[24px] font-bold text-foreground mb-1">Morning Reflection</h3>
              <div className="flex items-center gap-2 text-[14px] leading-[20px] text-foreground-muted font-semibold">
                <Clock className="w-4 h-4" />
                <span>10:00 AM - 10:30 AM</span>
              </div>
            </div>
            <Button 
              size="icon"
              variant="ghost"
              className="shrink-0"
            >
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </Card>

        {/* Community Card */}
        <Card className="p-6 backdrop-blur-2xl bg-gradient-to-br from-sky/40 to-lilac/30 border-sky/20">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-[17px] leading-[24px] font-bold text-foreground">Community</h3>
            <Badge className="rounded-pill bg-white/30 backdrop-blur-xl text-foreground border-white/20 text-[13px] px-3 py-1">
              3 active
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex -space-x-3">
              {[1, 2, 3].map((i) => (
                <div 
                  key={i} 
                  className="w-12 h-12 rounded-full border-3 border-white/80 bg-gradient-to-br from-lilac/70 to-sky/70 backdrop-blur-xl flex items-center justify-center text-[16px] font-bold text-foreground shadow-elevation-2"
                >
                  {i}
                </div>
              ))}
            </div>
            <Button 
              size="sm"
              className="backdrop-blur-2xl"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Invite
            </Button>
          </div>
        </Card>
      </main>

      <BottomNav />
    </div>
  );
};

export default Dashboard;
