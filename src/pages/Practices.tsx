import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { recordCompletedAct } from '@/services/dailyProgressService';
import { useTranslation } from 'react-i18next';
import BottomNav from '@/components/BottomNav';
import { TopBar } from '@/components/ui/top-bar';
import { Card } from '@/components/ui/card';
import { 
  Check, Sunrise, Sun, CloudSun, Sunset, Moon, 
  BookOpen, Heart, Star, ChevronDown, ChevronUp,
  Users, Clock, RotateCcw, Coins, Plus, Smile,
  HelpingHand, Trash2, GraduationCap, HandHeart, Stethoscope, Handshake
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useGuestProfile } from '@/hooks/useGuestProfile';
import { toast } from 'sonner';
import { BARAKAH_REWARDS } from '@/data/practiceItems';

interface PrayerState {
  done: boolean;
  onTime: boolean;
  inCongregation: boolean;
  madeUp: boolean;
}

interface SadaqahLog {
  id: string;
  typeId: string;
  date: string;
  note?: string;
  amount?: number;
}

const SADAQAH_ICONS: Record<string, React.ReactNode> = {
  'money': <Coins className="w-4 h-4" />,
  'food': <Heart className="w-4 h-4" />,
  'smile': <Smile className="w-4 h-4" />,
  'help': <HelpingHand className="w-4 h-4" />,
  'remove_harm': <Trash2 className="w-4 h-4" />,
  'knowledge': <GraduationCap className="w-4 h-4" />,
  'dua': <HandHeart className="w-4 h-4" />,
  'visit_sick': <Stethoscope className="w-4 h-4" />,
  'reconciliation': <Handshake className="w-4 h-4" />,
  'dhikr': <Star className="w-4 h-4" />,
};

const Practices = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation();
  const { addBarakahPoints, updateStreak } = useGuestProfile();
  const [activeTab, setActiveTab] = useState<'prayers' | 'sadaqah'>(() => {
    const tab = searchParams.get('tab');
    return tab === 'sadaqah' ? 'sadaqah' : 'prayers';
  });
  const [expandedSection, setExpandedSection] = useState<string | null>('fard');

  const MANDATORY_PRAYERS = [
    { id: 'fajr', name: 'Fajr', description: t('practices.prayer.fajr'), icon: Sunrise },
    { id: 'dhuhr', name: 'Dhuhr', description: t('practices.prayer.dhuhr'), icon: Sun },
    { id: 'asr', name: 'Asr', description: t('practices.prayer.asr'), icon: CloudSun },
    { id: 'maghrib', name: 'Maghrib', description: t('practices.prayer.maghrib'), icon: Sunset },
    { id: 'isha', name: 'Isha', description: t('practices.prayer.isha'), icon: Moon },
  ];

  const SUNNAH_PRAYERS = [
    { id: 'fajr_sunnah', name: t('practices.sunnah.fajrSunnah'), description: t('practices.sunnah.fajrSunnahDesc'), rakats: 2, timing: t('practices.sunnah.beforeFajr') },
    { id: 'dhuhr_before', name: t('practices.sunnah.dhuhrBefore'), description: t('practices.sunnah.dhuhrBeforeDesc'), rakats: 4, timing: t('practices.sunnah.beforeDhuhr') },
    { id: 'dhuhr_after', name: t('practices.sunnah.dhuhrAfter'), description: t('practices.sunnah.dhuhrAfterDesc'), rakats: 2, timing: t('practices.sunnah.afterDhuhr') },
    { id: 'maghrib_after', name: t('practices.sunnah.maghribAfter'), description: t('practices.sunnah.maghribAfterDesc'), rakats: 2, timing: t('practices.sunnah.afterMaghrib') },
    { id: 'isha_after', name: t('practices.sunnah.ishaAfter'), description: t('practices.sunnah.ishaAfterDesc'), rakats: 2, timing: t('practices.sunnah.afterIsha') },
    { id: 'witr', name: t('practices.sunnah.witr'), description: t('practices.sunnah.witrDesc'), rakats: 3, timing: t('practices.sunnah.afterIsha') },
    { id: 'tahajjud', name: t('practices.sunnah.tahajjud'), description: t('practices.sunnah.tahajjudDesc'), rakats: 8, timing: t('practices.sunnah.lateNight') },
    { id: 'duha', name: t('practices.sunnah.duha'), description: t('practices.sunnah.duhaDesc'), rakats: 4, timing: t('practices.sunnah.midMorning') },
  ];

  const SADAQAH_TYPES = [
    { id: 'money', name: t('sadaqah.monetary'), arabicName: 'صدقة المال', description: t('sadaqah.monetaryDesc'), examples: [t('sadaqah.monetaryExample1'), t('sadaqah.monetaryExample2'), t('sadaqah.monetaryExample3')], reward: t('sadaqah.monetaryReward'), color: 'bg-success/10 border-success/20 text-success' },
    { id: 'food', name: t('sadaqah.feeding'), arabicName: 'إطعام الطعام', description: t('sadaqah.feedingDesc'), examples: [t('sadaqah.feedingExample1'), t('sadaqah.feedingExample2'), t('sadaqah.feedingExample3')], reward: t('sadaqah.feedingReward'), color: 'bg-warn/10 border-warn/20 text-warn' },
    { id: 'smile', name: t('sadaqah.smile'), arabicName: 'التبسم والكلمة الطيبة', description: t('sadaqah.smileDesc'), examples: [t('sadaqah.smileExample1'), t('sadaqah.smileExample2'), t('sadaqah.smileExample3')], reward: t('sadaqah.smileReward'), color: 'bg-primary/10 border-primary/20 text-primary' },
    { id: 'help', name: t('sadaqah.helping'), arabicName: 'مساعدة الآخرين', description: t('sadaqah.helpingDesc'), examples: [t('sadaqah.helpingExample1'), t('sadaqah.helpingExample2'), t('sadaqah.helpingExample3')], reward: t('sadaqah.helpingReward'), color: 'bg-accent/10 border-accent/20 text-accent' },
    { id: 'remove_harm', name: t('sadaqah.removeHarm'), arabicName: 'إماطة الأذى', description: t('sadaqah.removeHarmDesc'), examples: [t('sadaqah.removeHarmExample1'), t('sadaqah.removeHarmExample2'), t('sadaqah.removeHarmExample3')], reward: t('sadaqah.removeHarmReward'), color: 'bg-secondary/10 border-secondary/20 text-secondary' },
    { id: 'knowledge', name: t('sadaqah.knowledge'), arabicName: 'نشر العلم', description: t('sadaqah.knowledgeDesc'), examples: [t('sadaqah.knowledgeExample1'), t('sadaqah.knowledgeExample2'), t('sadaqah.knowledgeExample3')], reward: t('sadaqah.knowledgeReward'), color: 'bg-info/10 border-info/20 text-info' },
  ];

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

  // Sadaqah logs
  const [sadaqahLogs, setSadaqahLogs] = useState<SadaqahLog[]>(() => {
    const stored = localStorage.getItem('naja_sadaqah_logs');
    return stored ? JSON.parse(stored) : [];
  });

  const [expandedSadaqah, setExpandedSadaqah] = useState<string | null>(null);

  // Save states
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem('naja_prayer_states', JSON.stringify({ date: today, states: prayerStates }));
  }, [prayerStates]);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem('naja_sunnah_states', JSON.stringify({ date: today, states: sunnahStates }));
  }, [sunnahStates]);

  useEffect(() => {
    localStorage.setItem('naja_sadaqah_logs', JSON.stringify(sadaqahLogs));
  }, [sadaqahLogs]);

  const togglePrayerDone = (id: string) => {
    const newState = !prayerStates[id].done;
    setPrayerStates(prev => ({
      ...prev,
      [id]: { ...prev[id], done: newState }
    }));

    if (newState) {
      const { leveledUp, newLevel } = addBarakahPoints(BARAKAH_REWARDS.PRAYER_COMPLETED);
      updateStreak();
      const prayer = MANDATORY_PRAYERS.find(p => p.id === id);
      recordCompletedAct(id, prayer?.name || id, BARAKAH_REWARDS.PRAYER_COMPLETED, 'prayer');
      window.dispatchEvent(new CustomEvent('naja_acts_updated'));

      if (leveledUp) {
        toast.success(t('practices.levelUp', { level: newLevel }));
      } else {
        toast.success(t('toast.pointsEarned', { points: BARAKAH_REWARDS.PRAYER_COMPLETED }));
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
        toast.success(t('toast.pointsEarned', { points }));
      }
    }
  };

  const toggleSunnah = (id: string) => {
    const newState = !sunnahStates[id];
    setSunnahStates(prev => ({ ...prev, [id]: newState }));
    
    if (newState) {
      addBarakahPoints(BARAKAH_REWARDS.SUNNAH_PRAYER);
      toast.success(t('toast.pointsEarned', { points: BARAKAH_REWARDS.SUNNAH_PRAYER }));
    }
  };

  const logSadaqah = (typeId: string, note?: string, amount?: number) => {
    const today = new Date().toISOString().split('T')[0];
    const newLog: SadaqahLog = {
      id: Date.now().toString(),
      typeId,
      date: today,
      note,
      amount,
    };
    setSadaqahLogs(prev => [newLog, ...prev]);
    addBarakahPoints(BARAKAH_REWARDS.CHARITY_GIVEN);
    updateStreak();
    recordCompletedAct('sadaqah', t('acts.sadaqah'), BARAKAH_REWARDS.CHARITY_GIVEN, 'habit');
    window.dispatchEvent(new CustomEvent('naja_acts_updated'));
    toast.success(t('practices.sadaqahLogged', { points: BARAKAH_REWARDS.CHARITY_GIVEN }));
    setExpandedSadaqah(null);
  };

  const getTodaySadaqahCount = () => {
    const today = new Date().toISOString().split('T')[0];
    return sadaqahLogs.filter(log => log.date === today).length;
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
      <TopBar title={t('practices.title')} />
      
      <div className="px-4 space-y-3">
        {/* Tab Selector */}
        <div className="flex gap-2 p-1 bg-muted rounded-xl">
          <button
            onClick={() => { setActiveTab('prayers'); setSearchParams({ tab: 'prayers' }); }}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all",
              activeTab === 'prayers' ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"
            )}
          >
            <Moon className="w-4 h-4" />
            {t('practices.prayers')}
          </button>
          <button
            onClick={() => { setActiveTab('sadaqah'); setSearchParams({ tab: 'sadaqah' }); }}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all",
              activeTab === 'sadaqah' ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"
            )}
          >
            <Coins className="w-4 h-4" />
            {t('practices.sadaqah')}
          </button>
        </div>

        {activeTab === 'prayers' && (
          <>
            {/* Inline Progress Bar */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                {fardCompleted}/5 {t('practices.fard')}
              </span>
              <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(fardCompleted / 5) * 100}%` }}
                  className="h-full bg-primary rounded-full"
                />
              </div>
              {sunnahCompleted > 0 && (
                <span className="text-[10px] font-medium text-secondary bg-secondary/10 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                  +{sunnahCompleted} {t('practices.sunnah.label', { defaultValue: 'sunnah' })}
                </span>
              )}
            </div>

            {/* Fard Prayers Section */}
            <div>
              <button 
                onClick={() => toggleSection('fard')}
                className="w-full flex items-center justify-between py-2"
              >
                <h3 className="text-sm font-semibold">{t('practices.fardPrayers')}</h3>
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
                    className="overflow-hidden"
                  >
                    <Card className="divide-y divide-border overflow-hidden">
                      {MANDATORY_PRAYERS.map((prayer) => {
                        const state = prayerStates[prayer.id];
                        const Icon = prayer.icon;
                        
                        return (
                          <div key={prayer.id}>
                            <div 
                              className={cn(
                                "flex items-center gap-3 py-2.5 px-3 cursor-pointer transition-all",
                                state?.done && "bg-primary/5"
                              )}
                              onClick={() => togglePrayerDone(prayer.id)}
                            >
                              <div className={cn(
                                "w-8 h-8 rounded-lg flex items-center justify-center transition-all shrink-0",
                                state?.done ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                              )}>
                                {state?.done ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-medium">{prayer.name}</h4>
                                <p className="text-[11px] text-muted-foreground">{prayer.description}</p>
                              </div>
                              <span className="text-[11px] text-primary font-medium shrink-0">+{BARAKAH_REWARDS.PRAYER_COMPLETED}</span>
                            </div>

                            {/* Prayer Options */}
                            {state?.done && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="flex gap-1.5 px-3 pb-2.5"
                              >
                                <button
                                  onClick={() => togglePrayerOption(prayer.id, 'onTime')}
                                  className={cn(
                                    "flex-1 flex items-center justify-center gap-1 py-1.5 px-1.5 rounded-lg text-[11px] font-medium transition-all",
                                    state.onTime 
                                      ? "bg-success/20 text-success" 
                                      : "bg-muted text-muted-foreground"
                                  )}
                                >
                                  <Clock className="w-3 h-3" />
                                  {t('practices.onTime')}
                                </button>
                                <button
                                  onClick={() => togglePrayerOption(prayer.id, 'inCongregation')}
                                  className={cn(
                                    "flex-1 flex items-center justify-center gap-1 py-1.5 px-1.5 rounded-lg text-[11px] font-medium transition-all",
                                    state.inCongregation 
                                      ? "bg-accent/20 text-accent" 
                                      : "bg-muted text-muted-foreground"
                                  )}
                                >
                                  <Users className="w-3 h-3" />
                                  {t('practices.inCongregation')}
                                </button>
                                <button
                                  onClick={() => togglePrayerOption(prayer.id, 'madeUp')}
                                  className={cn(
                                    "flex-1 flex items-center justify-center gap-1 py-1.5 px-1.5 rounded-lg text-[11px] font-medium transition-all",
                                    state.madeUp 
                                      ? "bg-warn/20 text-warn" 
                                      : "bg-muted text-muted-foreground"
                                  )}
                                >
                                  <RotateCcw className="w-3 h-3" />
                                  {t('practices.qada')}
                                </button>
                              </motion.div>
                            )}
                          </div>
                        );
                      })}
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Sunnah/Nafl Section */}
            <div>
              <button 
                onClick={() => toggleSection('sunnah')}
                className="w-full flex items-center justify-between py-2"
              >
                <h3 className="text-sm font-semibold">{t('practices.sunnahNafl')}</h3>
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
                    className="overflow-hidden"
                  >
                    <Card className="divide-y divide-border overflow-hidden">
                      {SUNNAH_PRAYERS.map((prayer) => (
                        <div
                          key={prayer.id}
                          className={cn(
                            "flex items-center gap-3 py-2.5 px-3 cursor-pointer transition-all",
                            sunnahStates[prayer.id] && "bg-secondary/5"
                          )}
                          onClick={() => toggleSunnah(prayer.id)}
                        >
                          <div className={cn(
                            "w-7 h-7 rounded-lg flex items-center justify-center transition-all shrink-0",
                            sunnahStates[prayer.id] 
                              ? "bg-secondary text-secondary-foreground" 
                              : "bg-muted text-muted-foreground"
                          )}>
                            {sunnahStates[prayer.id] ? (
                              <Check className="w-3.5 h-3.5" />
                            ) : (
                              <Star className="w-3.5 h-3.5" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium">
                              {prayer.name}
                              <span className="text-[11px] text-muted-foreground ml-1.5">{prayer.rakats}R</span>
                            </h4>
                          </div>
                          <span className="text-[11px] text-primary font-medium shrink-0">+{BARAKAH_REWARDS.SUNNAH_PRAYER}</span>
                        </div>
                      ))}
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Quick Actions — horizontal pills */}
            <div>
              <h3 className="text-sm font-semibold mb-2">{t('practices.morePractices')}</h3>
              <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
                {[
                  { icon: BookOpen, label: t('acts.quran'), path: '/quran', color: "bg-success/10 text-success" },
                  { icon: Heart, label: t('nav.dhikr'), path: '/dhikr', color: "bg-primary/10 text-primary" },
                  { icon: Star, label: t('nav.dua'), path: '/dua', color: "bg-warn/10 text-warn" },
                  { icon: Coins, label: t('acts.sadaqah'), onClick: () => { setActiveTab('sadaqah'); setSearchParams({ tab: 'sadaqah' }); }, color: "bg-accent/10 text-accent" },
                ].map((item) => (
                  <button
                    key={item.label}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all shrink-0",
                      item.color
                    )}
                    onClick={() => item.onClick ? item.onClick() : navigate(item.path!)}
                  >
                    <item.icon className="w-3.5 h-3.5" />
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Sadaqah Tab */}
        {activeTab === 'sadaqah' && (
          <div className="space-y-3">
            {/* Today's Summary — compact */}
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-medium text-muted-foreground">{t('practices.todaysSadaqah')}</span>
              <span className="text-sm font-bold text-primary">{getTodaySadaqahCount()}</span>
            </div>

            {/* Sadaqah Types */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold">{t('practices.logSadaqah')}</h3>
              {SADAQAH_TYPES.map((type) => (
                <motion.div key={type.id} whileTap={{ scale: 0.98 }}>
                  <Card 
                    className={cn(
                      "overflow-hidden transition-all",
                      expandedSadaqah === type.id && "ring-2 ring-primary/50"
                    )}
                  >
                    <button
                      onClick={() => setExpandedSadaqah(expandedSadaqah === type.id ? null : type.id)}
                      className="w-full p-3 text-left"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", type.color)}>
                          {SADAQAH_ICONS[type.id] || <Coins className="w-4 h-4" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm">{type.name}</h4>
                          <p className="text-[11px] text-muted-foreground">{type.arabicName}</p>
                        </div>
                        {expandedSadaqah === type.id ? (
                          <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                        )}
                      </div>
                    </button>

                    <AnimatePresence>
                      {expandedSadaqah === type.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="px-3 pb-3 space-y-2.5">
                            <p className="text-xs text-muted-foreground">{type.description}</p>
                            
                            <div>
                              <p className="text-[11px] font-medium mb-1.5">{t('common.examples')}</p>
                              <ul className="space-y-0.5">
                                {type.examples.slice(0, 3).map((ex, i) => (
                                  <li key={i} className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                                    <span className="w-1 h-1 rounded-full bg-primary shrink-0" />
                                    {ex}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="p-2.5 rounded-lg bg-primary/5 border border-primary/10">
                              <p className="text-[11px] italic text-foreground">{type.reward}</p>
                            </div>

                            <button
                              onClick={() => logSadaqah(type.id)}
                              className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm flex items-center justify-center gap-2"
                            >
                              <Plus className="w-4 h-4" />
                              {t('practices.logThis')}
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Recent Logs */}
            {sadaqahLogs.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold">{t('practices.recentActs')}</h3>
                <div className="space-y-1.5">
                  {sadaqahLogs.slice(0, 5).map((log) => {
                    const type = SADAQAH_TYPES.find(t => t.id === log.typeId);
                    if (!type) return null;
                    return (
                      <Card key={log.id} className="p-2.5">
                        <div className="flex items-center gap-2.5">
                          <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center shrink-0", type.color)}>
                            {SADAQAH_ICONS[type.id] || <Coins className="w-3.5 h-3.5" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">{type.name}</p>
                            <p className="text-[11px] text-muted-foreground">{log.date}</p>
                          </div>
                          <Check className="w-3.5 h-3.5 text-success shrink-0" />
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Disclaimer at bottom */}
        <p className="text-[11px] text-muted-foreground text-center italic px-4 pt-2">{t('dashboard.niyyahDisclaimer')}</p>
      </div>

      <BottomNav />
    </motion.div>
  );
};

export default Practices;
