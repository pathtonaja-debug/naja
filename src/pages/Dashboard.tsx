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
    <div className="min-h-screen bg-bg pb-24">
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
      <div className="px-5 pt-2 pb-6">
        <h1 className="text-[28px] leading-[32px] font-semibold text-ink mb-1">
          Assalamu Alaikum
        </h1>
        <p className="text-[15px] leading-[22px] text-inkMuted">
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
        {/* Next Prayer Card - Sage */}
        <Card className="relative overflow-hidden bg-sage border-sage-deep/20 p-6">
          {prayerTimes ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-ink/70 text-[12px] leading-[18px] font-medium">Next Prayer</p>
                  <h2 className="text-ink text-[28px] leading-[32px] font-semibold">{prayerTimes.next}</h2>
                </div>
                <div className="w-16 h-16 rounded-xl2 bg-white/60 backdrop-blur-sm flex items-center justify-center shadow-soft">
                  <span className="text-3xl">🕌</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-ink/10 rounded-pill overflow-hidden">
                  <div className="h-full bg-sage-deep rounded-pill transition-all duration-med ease-ios" style={{ width: '65%' }} />
                </div>
                <div className="flex items-center gap-1.5 text-ink/80 text-[12px] leading-[18px] font-medium">
                  <Clock className="w-4 h-4" />
                  <span>{prayerTimes.nextInMinutes}m</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-ink/60">Loading prayer times...</div>
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
                className="p-3 text-center transition-all duration-nja ease-nja hover:shadow-soft active:scale-[0.98]"
              >
                <div className="text-2xl mb-2">{prayer.icon}</div>
                <p className="text-[12px] leading-[18px] text-inkMuted mb-1">{prayer.name}</p>
                <p className="text-[12px] leading-[18px] font-semibold text-ink">{prayer.time}</p>
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
              <p className="text-[15px] leading-[22px] font-medium text-ink">{dhikrCount}</p>
              <p className="text-[12px] leading-[18px] text-inkMuted">Dhikr</p>
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
              <p className="text-[15px] leading-[22px] font-medium text-ink">3/5</p>
              <p className="text-[12px] leading-[18px] text-inkMuted">Prayers</p>
            </div>
          </Card>

          {/* Streak */}
          <Card className="p-4 flex flex-col items-center justify-center">
            <div className="text-3xl mb-2">🔥</div>
            <div className="text-center">
              <p className="text-[15px] leading-[22px] font-medium text-ink">7</p>
              <p className="text-[12px] leading-[18px] text-inkMuted">Day streak</p>
            </div>
          </Card>
        </div>

        {/* Dhikr Counter - Interactive - Lavender */}
        <Card className="p-6 bg-lavender border-lavender-deep/20">
          <div className="text-center space-y-4">
            <div className="space-y-1">
              <h3 className="text-[22px] leading-[28px] font-semibold text-ink">Dhikr Counter</h3>
              <div className="flex items-center justify-center gap-2 text-[12px] leading-[18px] text-ink/70">
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
                <span className="text-[48px] leading-[52px] font-bold text-ink">{dhikrCount}</span>
              </div>
            </div>

            <div className="flex gap-3 justify-center">
              <Button 
                onClick={() => setDhikrCount(prev => Math.min(prev + 1, 33))}
                className="px-8 bg-chip text-chip-text shadow-chip hover:scale-[1.01] active:scale-[0.99] transition-transform duration-nja"
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
                className="border-ink/20"
              >
                Reset
              </Button>
            </div>
          </div>
        </Card>

        {/* Daily Reflection */}
        <Card className="p-5 transition-all duration-nja ease-nja hover:shadow-soft active:scale-[0.98] cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl2 bg-sage/40 flex items-center justify-center shrink-0">
              <Heart className="w-6 h-6 text-ink" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-[15px] leading-[22px] font-semibold text-ink mb-1">Morning Reflection</h3>
              <div className="flex items-center gap-2 text-[12px] leading-[18px] text-inkMuted">
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
            <h3 className="text-[15px] leading-[22px] font-semibold text-ink">Community</h3>
            <Badge className="rounded-pill bg-sage/30 text-ink border-sage-deep/20 text-[12px]">
              3 active
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex -space-x-3">
              {[1, 2, 3].map((i) => (
                <div 
                  key={i} 
                  className="w-11 h-11 rounded-full border-2 border-surface bg-surfaceAlt flex items-center justify-center text-[15px] font-medium text-inkMuted"
                >
                  {i}
                </div>
              ))}
            </div>
            <Button 
              size="sm"
              className="h-9 px-4 bg-chip text-chip-text shadow-chip"
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
