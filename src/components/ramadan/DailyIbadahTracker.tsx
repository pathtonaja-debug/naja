import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, HandHeart, Moon as MoonIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { ProgressRing } from '@/components/ui/progress-ring';
import { cn } from '@/lib/utils';
import {
  getTodayIbadah,
  updateIbadah,
  getCompletionPercent,
  getIbadahStreak,
  type DailyIbadah,
} from '@/services/ramadanDailyTracker';

const PRAYERS = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const;

export function DailyIbadahTracker() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [ibadah, setIbadah] = useState<DailyIbadah>(getTodayIbadah());
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    setStreak(getIbadahStreak());
  }, []);

  const pct = getCompletionPercent(ibadah);

  const update = useCallback((updates: Partial<DailyIbadah>) => {
    const updated = updateIbadah(updates);
    setIbadah(updated);
    setStreak(getIbadahStreak());
  }, []);

  const togglePrayer = (prayer: string) => {
    const newPrayers = { ...ibadah.prayers, [prayer]: !ibadah.prayers[prayer] };
    update({ prayers: newPrayers });
  };

  return (
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
          {PRAYERS.map((prayer) => (
            <button
              key={prayer}
              onClick={() => togglePrayer(prayer)}
              className="flex flex-col items-center gap-1 flex-1"
            >
              <motion.div
                whileTap={{ scale: 0.85 }}
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-caption-2 font-medium transition-colors",
                  ibadah.prayers[prayer]
                    ? "bg-success/20 text-success"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {ibadah.prayers[prayer] ? '✓' : prayer[0]}
              </motion.div>
              <span className="text-caption-2 text-muted-foreground">{prayer}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Toggle grid */}
      <div className="grid grid-cols-3 gap-2">
        {/* Taraweeh */}
        <button
          onClick={() => update({ taraweeh: !ibadah.taraweeh })}
          className={cn(
            "p-3 rounded-xl text-center transition-colors",
            ibadah.taraweeh ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"
          )}
        >
          <MoonIcon className="w-4 h-4 mx-auto mb-1" />
          <span className="text-caption-1 font-medium">{t('ramadan.ibadah.taraweeh')}</span>
        </button>

        {/* Quran */}
        <button
          onClick={() => update({ quranPages: ibadah.quranPages + 4 })}
          className={cn(
            "p-3 rounded-xl text-center transition-colors",
            ibadah.quranPages > 0 ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"
          )}
        >
          <BookOpen className="w-4 h-4 mx-auto mb-1" />
          <span className="text-caption-1 font-medium">
            {ibadah.quranPages > 0 ? `${ibadah.quranPages}p` : t('ramadan.ibadah.quran')}
          </span>
        </button>

        {/* Dhikr */}
        <button
          onClick={() => navigate('/dhikr')}
          className="p-3 rounded-xl text-center bg-muted text-muted-foreground transition-colors hover:bg-muted/80"
        >
          <span className="text-base mb-1 block">📿</span>
          <span className="text-caption-1 font-medium">{t('ramadan.ibadah.dhikr')}</span>
        </button>

        {/* Charity */}
        <button
          onClick={() => update({ charityDone: !ibadah.charityDone })}
          className={cn(
            "p-3 rounded-xl text-center transition-colors",
            ibadah.charityDone ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"
          )}
        >
          <HandHeart className="w-4 h-4 mx-auto mb-1" />
          <span className="text-caption-1 font-medium">{t('ramadan.ibadah.charity')}</span>
        </button>

        {/* Tahajjud */}
        <button
          onClick={() => update({ tahajjud: !ibadah.tahajjud })}
          className={cn(
            "p-3 rounded-xl text-center transition-colors",
            ibadah.tahajjud ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"
          )}
        >
          <span className="text-base mb-1 block">🌙</span>
          <span className="text-caption-1 font-medium">{t('ramadan.ibadah.tahajjud')}</span>
        </button>
      </div>
    </Card>
  );
}
