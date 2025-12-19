import { motion } from 'framer-motion';
import BottomNav from '@/components/BottomNav';
import { TopBar } from '@/components/ui/top-bar';
import { Card } from '@/components/ui/card';
import { Check, Sunrise, Sun, CloudSun, Sunset, Moon, BookOpen, Heart, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { NIYYAH_DISCLAIMER, MANDATORY_PRAYERS, BARAKAH_REWARDS } from '@/data/practiceItems';
import { useGuestProfile } from '@/hooks/useGuestProfile';
import { toast } from 'sonner';

const prayerIcons: Record<string, React.ReactNode> = {
  Fajr: <Sunrise className="w-5 h-5" />,
  Dhuhr: <Sun className="w-5 h-5" />,
  Asr: <CloudSun className="w-5 h-5" />,
  Maghrib: <Sunset className="w-5 h-5" />,
  Isha: <Moon className="w-5 h-5" />,
};

const Practices = () => {
  const { profile, addBarakahPoints, updateStreak } = useGuestProfile();
  const [completedPrayers, setCompletedPrayers] = useState<Record<string, boolean>>(() => {
    const stored = localStorage.getItem('naja_today_prayers');
    const today = new Date().toISOString().split('T')[0];
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.date === today) return parsed.completed;
    }
    return {};
  });

  const handlePrayerToggle = (prayerId: string) => {
    const newCompleted = { ...completedPrayers, [prayerId]: !completedPrayers[prayerId] };
    setCompletedPrayers(newCompleted);
    localStorage.setItem('naja_today_prayers', JSON.stringify({ date: new Date().toISOString().split('T')[0], completed: newCompleted }));
    
    if (!completedPrayers[prayerId]) {
      const { leveledUp, newLevel } = addBarakahPoints(BARAKAH_REWARDS.PRAYER_COMPLETED);
      updateStreak();
      if (leveledUp) {
        toast.success(`Level Up! You're now Level ${newLevel}! 🎉`);
      } else {
        toast.success(`+${BARAKAH_REWARDS.PRAYER_COMPLETED} Barakah Points ✨`);
      }
    }
  };

  const completedCount = Object.values(completedPrayers).filter(Boolean).length;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background pb-28">
      <TopBar title="Today's Acts for Allah" />
      
      <div className="px-4 space-y-4">
        {/* Disclaimer */}
        <p className="text-xs text-muted-foreground text-center italic px-4">{NIYYAH_DISCLAIMER}</p>

        {/* Progress */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Today's Progress</span>
            <span className="text-lg font-bold text-primary">{completedCount}/5</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(completedCount / 5) * 100}%` }}
              className="h-full bg-primary rounded-full"
            />
          </div>
        </Card>

        {/* Mandatory Prayers */}
        <div>
          <h3 className="text-sm font-semibold mb-3">Salah</h3>
          <div className="space-y-2">
            {MANDATORY_PRAYERS.map((prayer) => (
              <motion.div key={prayer.id} whileTap={{ scale: 0.98 }}>
                <Card
                  className={cn("p-4 cursor-pointer transition-all", completedPrayers[prayer.id] && "bg-primary/5 border-primary/20")}
                  onClick={() => handlePrayerToggle(prayer.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", completedPrayers[prayer.id] ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
                      {completedPrayers[prayer.id] ? <Check className="w-5 h-5" /> : prayerIcons[prayer.name]}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{prayer.name}</h4>
                      <p className="text-xs text-muted-foreground">{prayer.description}</p>
                    </div>
                    <span className="text-xs text-primary font-medium">+{prayer.barakahReward}</span>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="text-sm font-semibold mb-3">More Practices</h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: BookOpen, label: "Qur'an", color: "bg-green-500/10 text-green-600" },
              { icon: Heart, label: "Dhikr", color: "bg-pink-500/10 text-pink-600" },
              { icon: Star, label: "Dua", color: "bg-yellow-500/10 text-yellow-600" },
            ].map((item) => (
              <Card key={item.label} className="p-4 text-center cursor-pointer hover:bg-muted/50">
                <div className={cn("w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center", item.color)}>
                  <item.icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-medium">{item.label}</span>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </motion.div>
  );
};

export default Practices;
