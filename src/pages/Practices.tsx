import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import BottomNav from '@/components/BottomNav';
import { TopBar } from '@/components/ui/top-bar';
import { Card } from '@/components/ui/card';
import { 
  Check, Sunrise, Sun, CloudSun, Sunset, Moon, 
  BookOpen, Heart, Star, ChevronDown, ChevronUp,
  Users, Clock, RotateCcw, Coins
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useGuestProfile } from '@/hooks/useGuestProfile';
import { toast } from 'sonner';
import { NIYYAH_DISCLAIMER, BARAKAH_REWARDS } from '@/data/practiceItems';

interface PrayerState {
  done: boolean;
  onTime: boolean;
  inCongregation: boolean;
  madeUp: boolean;
}

interface SunnahPrayer {
  id: string;
  name: string;
  description: string;
  rakats: number;
  timing: string;
}

const MANDATORY_PRAYERS = [
  { id: 'fajr', name: 'Fajr', description: 'Dawn prayer', icon: Sunrise },
  { id: 'dhuhr', name: 'Dhuhr', description: 'Noon prayer', icon: Sun },
  { id: 'asr', name: 'Asr', description: 'Afternoon prayer', icon: CloudSun },
  { id: 'maghrib', name: 'Maghrib', description: 'Sunset prayer', icon: Sunset },
  { id: 'isha', name: 'Isha', description: 'Night prayer', icon: Moon },
];

const SUNNAH_PRAYERS: SunnahPrayer[] = [
  { id: 'fajr_sunnah', name: 'Fajr Sunnah', description: '2 rakats before Fajr', rakats: 2, timing: 'Before Fajr' },
  { id: 'dhuhr_before', name: 'Dhuhr Sunnah (Before)', description: '4 rakats before Dhuhr', rakats: 4, timing: 'Before Dhuhr' },
  { id: 'dhuhr_after', name: 'Dhuhr Sunnah (After)', description: '2 rakats after Dhuhr', rakats: 2, timing: 'After Dhuhr' },
  { id: 'maghrib_after', name: 'Maghrib Sunnah', description: '2 rakats after Maghrib', rakats: 2, timing: 'After Maghrib' },
  { id: 'isha_after', name: 'Isha Sunnah', description: '2 rakats after Isha', rakats: 2, timing: 'After Isha' },
  { id: 'witr', name: 'Witr', description: 'Odd-numbered prayer', rakats: 3, timing: 'After Isha' },
  { id: 'tahajjud', name: 'Tahajjud', description: 'Night vigil prayer', rakats: 8, timing: 'Late night' },
  { id: 'duha', name: 'Duha', description: 'Forenoon prayer', rakats: 4, timing: 'Mid-morning' },
];

const Practices = () => {
  const navigate = useNavigate();
  const { addBarakahPoints, updateStreak } = useGuestProfile();
  const [expandedSection, setExpandedSection] = useState<string | null>('fard');
  
  // Prayer states
  const [prayerStates, setPrayerStates] = useState<Record<string, PrayerState>>(() => {
    const today = new Date().toISOString().split('T')[0];
    const stored = localStorage.getItem('naja_prayer_states');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.date === today) return parsed.states;
    }
    return MANDATORY_PRAYERS.reduce((acc, p) => ({
      ...acc,
      [p.id]: { done: false, onTime: false, inCongregation: false, madeUp: false }
    }), {});
  });

  // Sunnah states
  const [sunnahStates, setSunnahStates] = useState<Record<string, boolean>>(() => {
    const today = new Date().toISOString().split('T')[0];
    const stored = localStorage.getItem('naja_sunnah_states');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.date === today) return parsed.states;
    }
    return SUNNAH_PRAYERS.reduce((acc, p) => ({ ...acc, [p.id]: false }), {});
  });

  // Save states
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem('naja_prayer_states', JSON.stringify({ date: today, states: prayerStates }));
  }, [prayerStates]);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem('naja_sunnah_states', JSON.stringify({ date: today, states: sunnahStates }));
  }, [sunnahStates]);

  const togglePrayerDone = (id: string) => {
    const newState = !prayerStates[id].done;
    setPrayerStates(prev => ({
      ...prev,
      [id]: { ...prev[id], done: newState }
    }));
    
    if (newState) {
      const { leveledUp, newLevel } = addBarakahPoints(BARAKAH_REWARDS.PRAYER_COMPLETED);
      updateStreak();
      if (leveledUp) {
        toast.success(`Level Up! You're now Level ${newLevel}! 🎉`);
      } else {
        toast.success(`+${BARAKAH_REWARDS.PRAYER_COMPLETED} Barakah Points ✨`);
      }
    }
  };

  const togglePrayerOption = (id: string, option: 'onTime' | 'inCongregation' | 'madeUp') => {
    setPrayerStates(prev => ({
      ...prev,
      [id]: { ...prev[id], [option]: !prev[id][option] }
    }));
    
    if (!prayerStates[id][option]) {
      let points = 0;
      if (option === 'onTime') points = BARAKAH_REWARDS.PRAYER_ON_TIME;
      if (option === 'inCongregation') points = BARAKAH_REWARDS.PRAYER_IN_JAMAAH;
      if (points > 0) {
        addBarakahPoints(points);
        toast.success(`+${points} Barakah Points ✨`);
      }
    }
  };

  const toggleSunnah = (id: string) => {
    const newState = !sunnahStates[id];
    setSunnahStates(prev => ({ ...prev, [id]: newState }));
    
    if (newState) {
      addBarakahPoints(BARAKAH_REWARDS.SUNNAH_PRAYER);
      toast.success(`+${BARAKAH_REWARDS.SUNNAH_PRAYER} Barakah Points ✨`);
    }
  };

  const fardCompleted = Object.values(prayerStates).filter(p => p.done).length;
  const sunnahCompleted = Object.values(sunnahStates).filter(Boolean).length;

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="min-h-screen bg-background pb-28"
    >
      <TopBar title="Today's Acts for Allah" />
      
      <div className="px-4 space-y-4">
        {/* Disclaimer */}
        <p className="text-xs text-muted-foreground text-center italic px-4">{NIYYAH_DISCLAIMER}</p>

        {/* Overall Progress */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium">Today's Progress</span>
            <span className="text-lg font-bold text-primary">{fardCompleted}/5 Fard</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(fardCompleted / 5) * 100}%` }}
              className="h-full bg-primary rounded-full"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            {sunnahCompleted} Sunnah prayers completed
          </p>
        </Card>

        {/* Fard Prayers Section */}
        <div>
          <button 
            onClick={() => toggleSection('fard')}
            className="w-full flex items-center justify-between py-3"
          >
            <h3 className="text-sm font-semibold">Fard (Obligatory) Prayers</h3>
            {expandedSection === 'fard' ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
          
          <AnimatePresence>
            {expandedSection === 'fard' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-2 overflow-hidden"
              >
                {MANDATORY_PRAYERS.map((prayer) => {
                  const state = prayerStates[prayer.id];
                  const Icon = prayer.icon;
                  
                  return (
                    <motion.div key={prayer.id} whileTap={{ scale: 0.98 }}>
                      <Card className={cn(
                        "p-4 transition-all",
                        state.done && "bg-primary/5 border-primary/20"
                      )}>
                        <div 
                          className="flex items-center gap-3 cursor-pointer"
                          onClick={() => togglePrayerDone(prayer.id)}
                        >
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                            state.done ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                          )}>
                            {state.done ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{prayer.name}</h4>
                            <p className="text-xs text-muted-foreground">{prayer.description}</p>
                          </div>
                          <span className="text-xs text-primary font-medium">+{BARAKAH_REWARDS.PRAYER_COMPLETED}</span>
                        </div>

                        {/* Prayer Options */}
                        {state.done && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="flex gap-2 mt-3 pt-3 border-t border-border"
                          >
                            <button
                              onClick={() => togglePrayerOption(prayer.id, 'onTime')}
                              className={cn(
                                "flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-medium transition-all",
                                state.onTime 
                                  ? "bg-success/20 text-success" 
                                  : "bg-muted text-muted-foreground"
                              )}
                            >
                              <Clock className="w-3.5 h-3.5" />
                              On time
                            </button>
                            <button
                              onClick={() => togglePrayerOption(prayer.id, 'inCongregation')}
                              className={cn(
                                "flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-medium transition-all",
                                state.inCongregation 
                                  ? "bg-accent/20 text-accent" 
                                  : "bg-muted text-muted-foreground"
                              )}
                            >
                              <Users className="w-3.5 h-3.5" />
                              In congregation
                            </button>
                            <button
                              onClick={() => togglePrayerOption(prayer.id, 'madeUp')}
                              className={cn(
                                "flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-medium transition-all",
                                state.madeUp 
                                  ? "bg-warn/20 text-warn" 
                                  : "bg-muted text-muted-foreground"
                              )}
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              Qada
                            </button>
                          </motion.div>
                        )}
                      </Card>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sunnah/Nafl Section */}
        <div>
          <button 
            onClick={() => toggleSection('sunnah')}
            className="w-full flex items-center justify-between py-3"
          >
            <h3 className="text-sm font-semibold">Sunnah & Nafl (Optional)</h3>
            {expandedSection === 'sunnah' ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </button>

          <AnimatePresence>
            {expandedSection === 'sunnah' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-2 overflow-hidden"
              >
                {SUNNAH_PRAYERS.map((prayer) => (
                  <motion.div key={prayer.id} whileTap={{ scale: 0.98 }}>
                    <Card 
                      className={cn(
                        "p-4 cursor-pointer transition-all",
                        sunnahStates[prayer.id] && "bg-secondary/10 border-secondary/20"
                      )}
                      onClick={() => toggleSunnah(prayer.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                          sunnahStates[prayer.id] 
                            ? "bg-secondary text-secondary-foreground" 
                            : "bg-muted text-muted-foreground"
                        )}>
                          {sunnahStates[prayer.id] ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <Star className="w-4 h-4" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{prayer.name}</h4>
                          <p className="text-xs text-muted-foreground">{prayer.description}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-muted-foreground">{prayer.rakats}R</span>
                          <p className="text-xs text-primary font-medium">+{BARAKAH_REWARDS.SUNNAH_PRAYER}</p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="text-sm font-semibold mb-3">More Practices</h3>
          <div className="grid grid-cols-4 gap-3">
            {[
              { icon: BookOpen, label: "Qur'an", path: '/quran', color: "bg-success/10 text-success" },
              { icon: Heart, label: "Dhikr", path: '/dhikr', color: "bg-primary/10 text-primary" },
              { icon: Star, label: "Dua", path: '/dua', color: "bg-warn/10 text-warn" },
              { icon: Coins, label: "Sadaqah", path: '/practices', color: "bg-accent/10 text-accent" },
            ].map((item) => (
              <Card 
                key={item.label} 
                className="p-3 text-center cursor-pointer hover:bg-muted/50 transition-all"
                onClick={() => navigate(item.path)}
              >
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
