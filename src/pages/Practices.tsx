import { useState, useEffect, useRef } from 'react';
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
import { hapticSuccess, hapticLight } from '@/lib/haptics';
import type { LucideIcon } from 'lucide-react';

/* ── Types ── */

interface PrayerState {
  done: boolean;
  onTime: boolean;
  inCongregation: boolean;
  madeUp: boolean;
}

interface SunnahItem {
  id: string;
  nameKey: string;
  rakats: number;
  position: 'before' | 'after';
  muakkadah: boolean; // emphasized sunnah
}

interface PrayerGroup {
  id: string;
  name: string;
  descriptionKey: string;
  icon: LucideIcon;
  fardRakats: number;
  spikeLabel?: string; // e.g. "Sunnah Mu'akkadah" badge
  sunnahs: SunnahItem[];
}

interface SadaqahLog {
  id: string;
  typeId: string;
  date: string;
  note?: string;
  amount?: number;
}

/* ── Sadaqah icons (compact w-4) ── */

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

/* ── Component ── */

const Practices = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation();
  const { addBarakahPoints, updateStreak } = useGuestProfile();

  const [activeTab, setActiveTab] = useState<'prayers' | 'sadaqah'>(() => {
    const tab = searchParams.get('tab');
    return tab === 'sadaqah' ? 'sadaqah' : 'prayers';
  });

  /* ── Grouped prayer data ── */

  const PRAYER_GROUPS: PrayerGroup[] = [
    {
      id: 'fajr',
      name: 'Fajr',
      descriptionKey: 'practices.prayer.fajr',
      icon: Sunrise,
      fardRakats: 2,
      sunnahs: [
        { id: 'fajr_sunnah', nameKey: 'practices.sunnah.fajrSunnah', rakats: 2, position: 'before', muakkadah: true },
      ],
    },
    {
      id: 'dhuhr',
      name: 'Dhuhr',
      descriptionKey: 'practices.prayer.dhuhr',
      icon: Sun,
      fardRakats: 4,
      sunnahs: [
        { id: 'dhuhr_before', nameKey: 'practices.sunnah.dhuhrBefore', rakats: 4, position: 'before', muakkadah: true },
        { id: 'dhuhr_after', nameKey: 'practices.sunnah.dhuhrAfter', rakats: 2, position: 'after', muakkadah: true },
      ],
    },
    {
      id: 'asr',
      name: 'Asr',
      descriptionKey: 'practices.prayer.asr',
      icon: CloudSun,
      fardRakats: 4,
      sunnahs: [], // No mu'akkadah sunnah for Asr
    },
    {
      id: 'maghrib',
      name: 'Maghrib',
      descriptionKey: 'practices.prayer.maghrib',
      icon: Sunset,
      fardRakats: 3,
      sunnahs: [
        { id: 'maghrib_after', nameKey: 'practices.sunnah.maghribAfter', rakats: 2, position: 'after', muakkadah: true },
      ],
    },
    {
      id: 'isha',
      name: 'Isha',
      descriptionKey: 'practices.prayer.isha',
      icon: Moon,
      fardRakats: 4,
      sunnahs: [
        { id: 'isha_after', nameKey: 'practices.sunnah.ishaAfter', rakats: 2, position: 'after', muakkadah: true },
        { id: 'witr', nameKey: 'practices.sunnah.witr', rakats: 3, position: 'after', muakkadah: true },
      ],
    },
  ];

  const STANDALONE_PRAYERS = [
    { id: 'tahajjud', nameKey: 'practices.sunnah.tahajjud', descKey: 'practices.sunnah.tahajjudDesc', rakats: 8, icon: Moon },
    { id: 'duha', nameKey: 'practices.sunnah.duha', descKey: 'practices.sunnah.duhaDesc', rakats: 4, icon: Sun },
  ];

  const SADAQAH_TYPES = [
    { id: 'money', name: t('sadaqah.monetary'), arabicName: 'صدقة المال', description: t('sadaqah.monetaryDesc'), examples: [t('sadaqah.monetaryExample1'), t('sadaqah.monetaryExample2'), t('sadaqah.monetaryExample3')], reward: t('sadaqah.monetaryReward'), color: 'bg-success/10 border-success/20 text-success' },
    { id: 'food', name: t('sadaqah.feeding'), arabicName: 'إطعام الطعام', description: t('sadaqah.feedingDesc'), examples: [t('sadaqah.feedingExample1'), t('sadaqah.feedingExample2'), t('sadaqah.feedingExample3')], reward: t('sadaqah.feedingReward'), color: 'bg-warn/10 border-warn/20 text-warn' },
    { id: 'smile', name: t('sadaqah.smile'), arabicName: 'التبسم والكلمة الطيبة', description: t('sadaqah.smileDesc'), examples: [t('sadaqah.smileExample1'), t('sadaqah.smileExample2'), t('sadaqah.smileExample3')], reward: t('sadaqah.smileReward'), color: 'bg-primary/10 border-primary/20 text-primary' },
    { id: 'help', name: t('sadaqah.helping'), arabicName: 'مساعدة الآخرين', description: t('sadaqah.helpingDesc'), examples: [t('sadaqah.helpingExample1'), t('sadaqah.helpingExample2'), t('sadaqah.helpingExample3')], reward: t('sadaqah.helpingReward'), color: 'bg-accent/10 border-accent/20 text-accent' },
    { id: 'remove_harm', name: t('sadaqah.removeHarm'), arabicName: 'إماطة الأذى', description: t('sadaqah.removeHarmDesc'), examples: [t('sadaqah.removeHarmExample1'), t('sadaqah.removeHarmExample2'), t('sadaqah.removeHarmExample3')], reward: t('sadaqah.removeHarmReward'), color: 'bg-secondary/10 border-secondary/20 text-secondary' },
    { id: 'knowledge', name: t('sadaqah.knowledge'), arabicName: 'نشر العلم', description: t('sadaqah.knowledgeDesc'), examples: [t('sadaqah.knowledgeExample1'), t('sadaqah.knowledgeExample2'), t('sadaqah.knowledgeExample3')], reward: t('sadaqah.knowledgeReward'), color: 'bg-info/10 border-info/20 text-info' },
  ];

  /* ── State ── */

  const [prayerStates, setPrayerStates] = useState<Record<string, PrayerState>>(() => {
    const today = new Date().toISOString().split('T')[0];
    const stored = localStorage.getItem('naja_prayer_states');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.date === today) return parsed.states;
    }
    return PRAYER_GROUPS.reduce((acc, g) => ({
      ...acc,
      [g.id]: { done: false, onTime: false, inCongregation: false, madeUp: false }
    }), {});
  });

  const [sunnahStates, setSunnahStates] = useState<Record<string, boolean>>(() => {
    const today = new Date().toISOString().split('T')[0];
    const stored = localStorage.getItem('naja_sunnah_states');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.date === today) return parsed.states;
    }
    const allSunnahs = [
      ...PRAYER_GROUPS.flatMap(g => g.sunnahs),
      ...STANDALONE_PRAYERS,
    ];
    return allSunnahs.reduce((acc, s) => ({ ...acc, [s.id]: false }), {});
  });

  const [expandedGroup, setExpandedGroup] = useState<string | null>(() => {
    const prayerParam = searchParams.get('prayer');
    return prayerParam || 'fajr';
  });

  // Refs for auto-scroll
  const groupRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Auto-scroll to prayer param on mount
  useEffect(() => {
    const prayerParam = searchParams.get('prayer');
    if (prayerParam && groupRefs.current[prayerParam]) {
      setTimeout(() => {
        groupRefs.current[prayerParam]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    }
  }, []);

  const [sadaqahLogs, setSadaqahLogs] = useState<SadaqahLog[]>(() => {
    const stored = localStorage.getItem('naja_sadaqah_logs');
    return stored ? JSON.parse(stored) : [];
  });

  const [expandedSadaqah, setExpandedSadaqah] = useState<string | null>(null);

  /* ── Persistence ── */

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

  /* ── Handlers ── */

  const togglePrayerDone = (id: string) => {
    const newState = !prayerStates[id]?.done;
    setPrayerStates(prev => ({
      ...prev,
      [id]: { ...(prev[id] || { done: false, onTime: false, inCongregation: false, madeUp: false }), done: newState }
    }));

    if (newState) {
      hapticSuccess();
      const { leveledUp, newLevel } = addBarakahPoints(BARAKAH_REWARDS.PRAYER_COMPLETED);
      updateStreak();
      const group = PRAYER_GROUPS.find(g => g.id === id);
      recordCompletedAct(id, group?.name || id, BARAKAH_REWARDS.PRAYER_COMPLETED, 'prayer');
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
      [id]: { ...prev[id], [option]: !prev[id]?.[option] }
    }));
    
    if (!prayerStates[id]?.[option]) {
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
      hapticLight();
      addBarakahPoints(BARAKAH_REWARDS.SUNNAH_PRAYER);
      toast.success(t('toast.pointsEarned', { points: BARAKAH_REWARDS.SUNNAH_PRAYER }));
    }
  };

  const logSadaqah = (typeId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const newLog: SadaqahLog = {
      id: Date.now().toString(),
      typeId,
      date: today,
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

  /* ── Derived ── */

  const fardCompleted = PRAYER_GROUPS.filter(g => prayerStates[g.id]?.done).length;
  const allSunnahIds = [
    ...PRAYER_GROUPS.flatMap(g => g.sunnahs.map(s => s.id)),
    ...STANDALONE_PRAYERS.map(s => s.id),
  ];
  const sunnahCompleted = allSunnahIds.filter(id => sunnahStates[id]).length;

  /* ── Sunnah sub-row renderer ── */

  const renderSunnahRow = (s: SunnahItem) => (
    <div
      key={s.id}
      className={cn(
        "flex items-center gap-2.5 py-2 px-3 pl-12 cursor-pointer transition-all",
        sunnahStates[s.id] && "bg-secondary/5"
      )}
      onClick={() => toggleSunnah(s.id)}
    >
      <div className={cn(
        "w-6 h-6 rounded-md flex items-center justify-center transition-all shrink-0",
        sunnahStates[s.id] ? "bg-secondary text-secondary-foreground" : "bg-muted text-muted-foreground"
      )}>
        {sunnahStates[s.id] ? <Check className="w-3 h-3" /> : <Star className="w-3 h-3" />}
      </div>
      <div className="flex-1 min-w-0">
        <span className="text-xs font-medium">
          {t(s.nameKey)}
          <span className="text-muted-foreground ml-1">({s.rakats}R)</span>
        </span>
      </div>
      <span className="text-[10px] text-primary font-medium shrink-0">+{BARAKAH_REWARDS.SUNNAH_PRAYER}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-background pb-28">
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
            {/* Inline Progress */}
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
                  +{sunnahCompleted} sunnah
                </span>
              )}
            </div>

            {/* Prayer Groups */}
            <div className="space-y-2">
              {PRAYER_GROUPS.map((group) => {
                const state = prayerStates[group.id];
                const Icon = group.icon;
                const isExpanded = expandedGroup === group.id;
                const sunnahsBefore = group.sunnahs.filter(s => s.position === 'before');
                const sunnahsAfter = group.sunnahs.filter(s => s.position === 'after');
                const groupSunnahDone = group.sunnahs.filter(s => sunnahStates[s.id]).length;

                return (
                  <Card key={group.id} ref={(el) => { groupRefs.current[group.id] = el; }} className="overflow-hidden">
                    {/* Fard header row */}
                    <div
                      className={cn(
                        "flex items-center gap-3 py-2.5 px-3 cursor-pointer transition-all",
                        state?.done && "bg-primary/5"
                      )}
                      onClick={() => setExpandedGroup(isExpanded ? null : group.id)}
                    >
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center transition-all shrink-0",
                        state?.done ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                      )}>
                        {state?.done ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-sm font-semibold">{group.name}</h4>
                          <span className="text-[10px] text-muted-foreground">{group.fardRakats}R</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground">{t(group.descriptionKey)}</p>
                      </div>

                      {/* mini progress for group sunnahs */}
                      {group.sunnahs.length > 0 && (
                        <span className={cn(
                          "text-[10px] font-medium px-1.5 py-0.5 rounded-full shrink-0",
                          groupSunnahDone === group.sunnahs.length
                            ? "bg-secondary/20 text-secondary"
                            : "bg-muted text-muted-foreground"
                        )}>
                          {groupSunnahDone}/{group.sunnahs.length}
                        </span>
                      )}

                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                      )}
                    </div>

                    {/* Expanded content */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="border-t border-border">
                            {/* Sunnahs before */}
                            {sunnahsBefore.length > 0 && (
                              <div>
                                <p className="text-[10px] uppercase tracking-wider text-muted-foreground px-3 pt-2 pb-1 pl-12">
                                  {t('practices.beforeFard')}
                                </p>
                                {sunnahsBefore.map(renderSunnahRow)}
                              </div>
                            )}

                            {/* Fard row (toggle) */}
                            <div
                              className={cn(
                                "flex items-center gap-2.5 py-2.5 px-3 cursor-pointer transition-all border-y border-border/50",
                                state?.done ? "bg-primary/8" : "bg-muted/20"
                              )}
                              onClick={() => togglePrayerDone(group.id)}
                            >
                              <div className={cn(
                                "w-7 h-7 rounded-lg flex items-center justify-center transition-all shrink-0 ml-[22px]",
                                state?.done ? "bg-primary text-primary-foreground" : "bg-primary/20 text-primary"
                              )}>
                                {state?.done ? <Check className="w-3.5 h-3.5" /> : <Icon className="w-3.5 h-3.5" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <span className="text-xs font-semibold text-primary">
                                  {t('practices.fard')} — {group.fardRakats} {t('practices.rakats', { defaultValue: "rak'at" })}
                                </span>
                              </div>
                              <span className="text-[10px] text-primary font-medium shrink-0">+{BARAKAH_REWARDS.PRAYER_COMPLETED}</span>
                            </div>

                            {/* Prayer options chips */}
                            {state?.done && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="flex gap-1.5 px-3 py-2 pl-12"
                              >
                                <button
                                  onClick={() => togglePrayerOption(group.id, 'onTime')}
                                  className={cn(
                                    "flex-1 flex items-center justify-center gap-1 py-1.5 px-1.5 rounded-lg text-[11px] font-medium transition-all",
                                    state.onTime ? "bg-success/20 text-success" : "bg-muted text-muted-foreground"
                                  )}
                                >
                                  <Clock className="w-3 h-3" />
                                  {t('practices.onTime')}
                                </button>
                                <button
                                  onClick={() => togglePrayerOption(group.id, 'inCongregation')}
                                  className={cn(
                                    "flex-1 flex items-center justify-center gap-1 py-1.5 px-1.5 rounded-lg text-[11px] font-medium transition-all",
                                    state.inCongregation ? "bg-accent/20 text-accent" : "bg-muted text-muted-foreground"
                                  )}
                                >
                                  <Users className="w-3 h-3" />
                                  {t('practices.inCongregation')}
                                </button>
                                <button
                                  onClick={() => togglePrayerOption(group.id, 'madeUp')}
                                  className={cn(
                                    "flex-1 flex items-center justify-center gap-1 py-1.5 px-1.5 rounded-lg text-[11px] font-medium transition-all",
                                    state.madeUp ? "bg-warn/20 text-warn" : "bg-muted text-muted-foreground"
                                  )}
                                >
                                  <RotateCcw className="w-3 h-3" />
                                  {t('practices.qada')}
                                </button>
                              </motion.div>
                            )}

                            {/* Sunnahs after */}
                            {sunnahsAfter.length > 0 && (
                              <div>
                                <p className="text-[10px] uppercase tracking-wider text-muted-foreground px-3 pt-2 pb-1 pl-12">
                                  {t('practices.afterFard')}
                                </p>
                                {sunnahsAfter.map(renderSunnahRow)}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                );
              })}
            </div>

            {/* Standalone Prayers (Tahajjud, Duha) */}
            <div>
              <h3 className="text-sm font-semibold mb-2">{t('practices.standalonePrayers')}</h3>
              <Card className="divide-y divide-border overflow-hidden">
                {STANDALONE_PRAYERS.map((prayer) => {
                  const Icon = prayer.icon;
                  return (
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
                        sunnahStates[prayer.id] ? "bg-secondary text-secondary-foreground" : "bg-muted text-muted-foreground"
                      )}>
                        {sunnahStates[prayer.id] ? <Check className="w-3.5 h-3.5" /> : <Icon className="w-3.5 h-3.5" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium">
                          {t(prayer.nameKey)}
                          <span className="text-[11px] text-muted-foreground ml-1.5">{prayer.rakats}R</span>
                        </h4>
                        <p className="text-[11px] text-muted-foreground">{t(prayer.descKey)}</p>
                      </div>
                      <span className="text-[11px] text-primary font-medium shrink-0">+{BARAKAH_REWARDS.SUNNAH_PRAYER}</span>
                    </div>
                  );
                })}
              </Card>
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
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-medium text-muted-foreground">{t('practices.todaysSadaqah')}</span>
              <span className="text-sm font-bold text-primary">{getTodaySadaqahCount()}</span>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold">{t('practices.logSadaqah')}</h3>
              {SADAQAH_TYPES.map((type) => (
                <motion.div key={type.id} whileTap={{ scale: 0.98 }}>
                  <Card className={cn("overflow-hidden transition-all", expandedSadaqah === type.id && "ring-2 ring-primary/50")}>
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
    </div>
  );
};

export default Practices;
