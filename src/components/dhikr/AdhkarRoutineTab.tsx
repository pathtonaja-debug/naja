import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronLeft, ChevronRight, RotateCcw, Flame, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { getCurrentLanguage } from '@/lib/i18n';
import { hapticLight, hapticSuccess } from '@/lib/haptics';
import { useGuestProfile } from '@/hooks/useGuestProfile';
import { BARAKAH_REWARDS } from '@/data/practiceItems';
import { toast } from 'sonner';
import type { AdhkarItem } from '@/data/adhkarData';

interface AdhkarRoutineTabProps {
  routineType: 'morning' | 'evening';
  items: AdhkarItem[];
}

interface ItemProgress {
  currentCount: number;
  completed: boolean;
}

interface RoutineLog {
  date: string;
  completedAt: string;
  itemsCompleted: number;
  totalItems: number;
}

const STORAGE_PREFIX = 'naja_adhkar';

function getStorageKey(type: string) {
  return `${STORAGE_PREFIX}_${type}`;
}

function getLogKey(type: string) {
  return `${STORAGE_PREFIX}_${type}_log`;
}

function getStreakKey(type: string) {
  return `${STORAGE_PREFIX}_${type}_streak`;
}

function calculateStreak(logs: RoutineLog[]): number {
  if (logs.length === 0) return 0;
  
  const sortedDates = [...new Set(logs.map(l => l.date))].sort().reverse();
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  
  // Must have today or yesterday to have an active streak
  if (sortedDates[0] !== today && sortedDates[0] !== yesterday) return 0;
  
  let streak = 0;
  let checkDate = new Date(sortedDates[0]);
  
  for (const dateStr of sortedDates) {
    const expected = checkDate.toISOString().split('T')[0];
    if (dateStr === expected) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }
  
  return streak;
}

export function AdhkarRoutineTab({ routineType, items }: AdhkarRoutineTabProps) {
  const { t } = useTranslation();
  const lang = getCurrentLanguage();
  const { addBarakahPoints } = useGuestProfile();
  const today = new Date().toISOString().split('T')[0];
  const progressKey = `${getStorageKey(routineType)}_${today}`;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState<Record<string, ItemProgress>>(() => {
    try {
      const stored = localStorage.getItem(progressKey);
      if (stored) return JSON.parse(stored);
    } catch {}
    return items.reduce((acc, item) => ({
      ...acc,
      [item.id]: { currentCount: 0, completed: false },
    }), {});
  });
  const [showLog, setShowLog] = useState(false);

  // Persist progress
  useEffect(() => {
    localStorage.setItem(progressKey, JSON.stringify(progress));
  }, [progress, progressKey]);

  // Load logs
  const logs: RoutineLog[] = useMemo(() => {
    try {
      const stored = localStorage.getItem(getLogKey(routineType));
      if (stored) return JSON.parse(stored);
    } catch {}
    return [];
  }, [routineType]);

  const streak = useMemo(() => calculateStreak(logs), [logs]);

  const currentItem = items[currentIndex];
  const itemProgress = progress[currentItem.id] || { currentCount: 0, completed: false };
  const completedCount = Object.values(progress).filter(p => p.completed).length;
  const allDone = completedCount === items.length;
  const todayLogged = logs.some(l => l.date === today);

  // Log completion when all done
  useEffect(() => {
    if (allDone && !todayLogged) {
      const newLog: RoutineLog = {
        date: today,
        completedAt: new Date().toISOString(),
        itemsCompleted: items.length,
        totalItems: items.length,
      };
      const updatedLogs = [...logs, newLog];
      localStorage.setItem(getLogKey(routineType), JSON.stringify(updatedLogs));
      
      // Award points
      const points = BARAKAH_REWARDS.DUA_DAILY;
      addBarakahPoints(points);
      toast.success(`${routineType === 'morning' ? '🌅' : '🌙'} ${t('adhkar.routineComplete')} +${points} ${t('common.points')}`);
      
      // Update streak
      const newStreak = calculateStreak(updatedLogs);
      localStorage.setItem(getStreakKey(routineType), JSON.stringify({ streak: newStreak, date: today }));
    }
  }, [allDone, todayLogged]);

  const handleTap = () => {
    if (itemProgress.completed) return;
    
    hapticLight();
    const newCount = itemProgress.currentCount + 1;
    const completed = newCount >= currentItem.count;
    
    setProgress(prev => ({
      ...prev,
      [currentItem.id]: { currentCount: newCount, completed },
    }));

    if (completed) {
      hapticSuccess();
      if (currentIndex < items.length - 1) {
        setTimeout(() => setCurrentIndex(currentIndex + 1), 600);
      }
    }
  };

  const handleReset = () => {
    setProgress(items.reduce((acc, item) => ({
      ...acc,
      [item.id]: { currentCount: 0, completed: false },
    }), {}));
    setCurrentIndex(0);
  };

  const goNext = () => {
    if (currentIndex < items.length - 1) setCurrentIndex(currentIndex + 1);
  };

  const goPrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  // Recent logs (last 7)
  const recentLogs = [...logs].reverse().slice(0, 7);
  // Last 7 days for streak calendar
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });
  const logDates = new Set(logs.map(l => l.date));

  if (showLog) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <button onClick={() => setShowLog(false)} className="text-sm text-primary font-medium">
            ← {t('common.back')}
          </button>
          <h3 className="text-sm font-semibold text-foreground">
            {routineType === 'morning' ? '🌅' : '🌙'} {t('adhkar.history')}
          </h3>
          <div className="w-12" />
        </div>

        {/* Streak */}
        <div className="p-4 rounded-2xl bg-card border border-border text-center">
          <Flame className="w-6 h-6 text-orange-500 mx-auto mb-1" />
          <p className="text-2xl font-bold text-foreground">{streak}</p>
          <p className="text-xs text-muted-foreground">{t('adhkar.dayStreak')}</p>
        </div>

        {/* Mini calendar */}
        <div className="flex justify-center gap-2">
          {last7Days.map((day) => {
            const dayLabel = new Date(day + 'T12:00:00').toLocaleDateString(undefined, { weekday: 'short' }).slice(0, 2);
            const isToday = day === today;
            const done = logDates.has(day);
            return (
              <div key={day} className="flex flex-col items-center gap-1">
                <span className="text-[10px] text-muted-foreground">{dayLabel}</span>
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium",
                  done ? "bg-primary text-primary-foreground" : isToday ? "bg-muted ring-1 ring-primary text-foreground" : "bg-muted text-muted-foreground"
                )}>
                  {done ? <Check className="w-4 h-4" /> : new Date(day + 'T12:00:00').getDate()}
                </div>
              </div>
            );
          })}
        </div>

        {/* Log list */}
        <div className="space-y-2">
          {recentLogs.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">{t('adhkar.noHistory')}</p>
          ) : (
            recentLogs.map((log, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-card border border-border">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {new Date(log.date + 'T12:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {log.itemsCompleted}/{log.totalItems} {t('adhkar.itemsCompleted')}
                  </p>
                </div>
                <Check className="w-5 h-5 text-primary" />
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Streak + Log button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-orange-500" />
          <span className="text-sm font-semibold text-foreground">{streak} {t('adhkar.dayStreak')}</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowLog(true)} className="flex items-center gap-1 text-xs text-primary font-medium">
            <CalendarDays className="w-3.5 h-3.5" />
            {t('adhkar.viewLog')}
          </button>
          <button onClick={handleReset} className="p-1.5 rounded-full hover:bg-muted transition-colors">
            <RotateCcw className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground">
          {completedCount}/{items.length}
        </span>
        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
          <motion.div
            animate={{ width: `${(completedCount / items.length) * 100}%` }}
            className="h-full bg-primary rounded-full"
          />
        </div>
      </div>

      {/* Progress dots */}
      <div className="flex gap-1 justify-center flex-wrap">
        {items.map((item, idx) => (
          <button
            key={item.id}
            onClick={() => setCurrentIndex(idx)}
            className={cn(
              "w-2.5 h-2.5 rounded-full transition-all",
              idx === currentIndex ? "bg-primary scale-125" :
              progress[item.id]?.completed ? "bg-green-500" : "bg-muted"
            )}
          />
        ))}
      </div>

      {/* All done */}
      {allDone && (
        <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 text-center">
          <Check className="w-8 h-8 text-primary mx-auto mb-2" />
          <h3 className="font-semibold text-primary">
            {routineType === 'morning' ? '🌅' : '🌙'} {t('adhkar.allCompleted')}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">{t('dashboard.niyyahDisclaimer')}</p>
        </div>
      )}

      {/* Current dhikr card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentItem.id}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          className="p-6 rounded-3xl bg-card border border-border shadow-sm"
        >
          <p className="text-3xl font-arabic text-center leading-loose mb-4">
            {currentItem.arabic}
          </p>
          <p className="text-sm text-muted-foreground text-center italic mb-3">
            {currentItem.transliteration}
          </p>
          <p className="text-sm text-center font-medium mb-4">
            {currentItem.translation[lang]}
          </p>
          <p className="text-[10px] text-muted-foreground text-center mb-6">
            {currentItem.source}
          </p>

          {/* Counter button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleTap}
            disabled={itemProgress.completed}
            className={cn(
              "w-full py-4 rounded-2xl text-center transition-all",
              itemProgress.completed
                ? "bg-primary/5 text-primary cursor-default"
                : "bg-primary/10 text-primary active:bg-primary/20"
            )}
          >
            {itemProgress.completed ? (
              <div className="flex items-center justify-center gap-2">
                <Check className="w-5 h-5" />
                <span className="font-semibold">{t('common.done')}</span>
              </div>
            ) : (
              <div>
                <span className="text-3xl font-bold block">
                  {itemProgress.currentCount}
                </span>
                <span className="text-xs text-muted-foreground">
                  / {currentItem.count}
                </span>
              </div>
            )}
          </motion.button>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="outline" size="icon" onClick={goPrev} disabled={currentIndex === 0} className="rounded-full">
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <span className="text-sm text-muted-foreground">
          {currentIndex + 1} / {items.length}
        </span>
        <Button variant="outline" size="icon" onClick={goNext} disabled={currentIndex === items.length - 1} className="rounded-full">
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
