import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, HandHeart, Moon as MoonIcon, Check } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { ProgressRing } from '@/components/ui/progress-ring';
import { CelebrationOverlay } from '@/components/ui/celebration-overlay';
import { cn } from '@/lib/utils';
import {
  getTodayIbadah,
  updateIbadah,
  getCompletionPercent,
  getIbadahStreak,
  type DailyIbadah,
} from '@/services/ramadanDailyTracker';

const PRAYERS = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const;

const checkVariants = {
  unchecked: { scale: 1 },
  checked: {
    scale: [1, 1.3, 0.9, 1.05, 1],
    transition: { duration: 0.4, times: [0, 0.2, 0.5, 0.75, 1] },
  },
};

const checkmarkVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { type: 'spring' as const, stiffness: 500, damping: 15 } },
  exit: { scale: 0, opacity: 0, transition: { duration: 0.15 } },
};

const CELEBRATED_KEY = 'naja_ramadan_celebrated_100';

export function DailyIbadahTracker() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [ibadah, setIbadah] = useState<DailyIbadah>(getTodayIbadah());
  const [streak, setStreak] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const prevPctRef = useRef<number>(0);

  useEffect(() => {
    setStreak(getIbadahStreak());
    prevPctRef.current = getCompletionPercent(getTodayIbadah());
  }, []);

  const pct = getCompletionPercent(ibadah);

  const update = useCallback((updates: Partial<DailyIbadah>) => {
    const updated = updateIbadah(updates);
    setIbadah(updated);
    setStreak(getIbadahStreak());

    const newPct = getCompletionPercent(updated);
    // Celebrate when hitting 100% for the first time today
    if (newPct >= 100 && prevPctRef.current < 100) {
      const today = new Date().toISOString().slice(0, 10);
      const celebrated = localStorage.getItem(CELEBRATED_KEY);
      if (celebrated !== today) {
        localStorage.setItem(CELEBRATED_KEY, today);
        setShowCelebration(true);
      }
    }
    prevPctRef.current = newPct;
  }, []);

  const togglePrayer = (prayer: string) => {
    const newPrayers = { ...ibadah.prayers, [prayer]: !ibadah.prayers[prayer] };
    update({ prayers: newPrayers });
  };

  return (
    <>
    <CelebrationOverlay
      isVisible={showCelebration}
      onComplete={() => setShowCelebration(false)}
      message="ما شاء الله! 🌙"
      subMessage={t('ramadan.ibadah.completionMessage')}
    />
    <Card className="p-4">
      {/* Header with progress */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-headline font-semibold">{t('ramadan.ibadah.title')}</h3>
          {streak > 0 && (
            <p className="text-caption-1 text-muted-foreground">
              🔥 {streak} {t('ramadan.ibadah.streak')}
            </p>
          )}
        </div>
        <ProgressRing progress={pct} size={48} strokeWidth={3.5} label={`${pct}%`} />
      </div>

      {/* Prayer dots */}
      <div className="mb-3">
        <p className="text-caption-1 text-muted-foreground mb-2">{t('ramadan.ibadah.prayers')}</p>
        <div className="flex gap-2">
          {PRAYERS.map((prayer) => {
            const done = ibadah.prayers[prayer];
            return (
              <button
                key={prayer}
                onClick={() => togglePrayer(prayer)}
                className="flex flex-col items-center gap-1 flex-1"
              >
                <motion.div
                  animate={done ? 'checked' : 'unchecked'}
                  variants={checkVariants}
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-caption-2 font-medium transition-colors",
                    done ? "bg-success/20 text-success" : "bg-muted text-muted-foreground"
                  )}
                >
                  <AnimatePresence mode="wait">
                    {done ? (
                      <motion.div key="check" variants={checkmarkVariants} initial="hidden" animate="visible" exit="exit">
                        <Check className="w-3.5 h-3.5" />
                      </motion.div>
                    ) : (
                      <motion.span key="letter" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        {prayer[0]}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
                <span className="text-caption-2 text-muted-foreground">{prayer}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Toggle grid */}
      <div className="grid grid-cols-3 gap-2">
        <ToggleCell
          active={ibadah.taraweeh}
          onToggle={() => update({ taraweeh: !ibadah.taraweeh })}
          icon={<MoonIcon className="w-4 h-4" />}
          label={t('ramadan.ibadah.taraweeh')}
        />
        <ToggleCell
          active={ibadah.quranPages > 0}
          onToggle={() => update({ quranPages: ibadah.quranPages + 4 })}
          icon={<BookOpen className="w-4 h-4" />}
          label={ibadah.quranPages > 0 ? `${ibadah.quranPages}p` : t('ramadan.ibadah.quran')}
        />
        <button
          onClick={() => navigate('/dhikr')}
          className="p-3 rounded-xl text-center bg-muted text-muted-foreground transition-colors hover:bg-muted/80"
        >
          <span className="text-base mb-1 block">📿</span>
          <span className="text-caption-1 font-medium">{t('ramadan.ibadah.dhikr')}</span>
        </button>
        <ToggleCell
          active={ibadah.charityDone}
          onToggle={() => update({ charityDone: !ibadah.charityDone })}
          icon={<HandHeart className="w-4 h-4" />}
          label={t('ramadan.ibadah.charity')}
        />
        <ToggleCell
          active={ibadah.tahajjud}
          onToggle={() => update({ tahajjud: !ibadah.tahajjud })}
          icon={<span className="text-base">🌙</span>}
          label={t('ramadan.ibadah.tahajjud')}
        />
      </div>
    </Card>
    </>
  );
}

interface ToggleCellProps {
  active: boolean;
  onToggle: () => void;
  icon: React.ReactNode;
  label: string;
}

function ToggleCell({ active, onToggle, icon, label }: ToggleCellProps) {
  return (
    <motion.button
      onClick={onToggle}
      animate={active ? 'checked' : 'unchecked'}
      variants={checkVariants}
      className={cn(
        "p-3 rounded-xl text-center transition-colors",
        active ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"
      )}
    >
      <div className="mx-auto mb-1 w-4 h-4 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {active ? (
            <motion.div key="check" variants={checkmarkVariants} initial="hidden" animate="visible" exit="exit">
              <Check className="w-4 h-4" />
            </motion.div>
          ) : (
            <motion.div key="icon" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {icon}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <span className="text-caption-1 font-medium">{label}</span>
    </motion.button>
  );
}
