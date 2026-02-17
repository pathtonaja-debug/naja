import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Moon, Star, Sun, CloudMoon, Check } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ProgressRing } from '@/components/ui/progress-ring';
import { usePrayerTimes } from '@/hooks/usePrayerTimes';
import { getTodayIbadah, getCompletionPercent } from '@/services/ramadanDailyTracker';
import type { PhaseInfo } from '@/services/ramadanState';

interface RamadanHeaderProps {
  phaseInfo: PhaseInfo;
  fastingStatus: 'fasting' | 'excused' | null;
  onFastingStatusChange: (status: 'fasting' | 'excused') => void;
}

export function RamadanHeader({ phaseInfo, fastingStatus, onFastingStatusChange }: RamadanHeaderProps) {
  const { t } = useTranslation();
  const { prayerTimes } = usePrayerTimes();
  const [completionPct, setCompletionPct] = useState(0);

  useEffect(() => {
    setCompletionPct(getCompletionPercent(getTodayIbadah()));
  }, []);

  // Countdown calculations
  const getCountdown = (targetTime: string | undefined) => {
    if (!targetTime) return '--:--';
    const [h, m] = targetTime.split(':').map(Number);
    const now = new Date();
    const nowMin = now.getHours() * 60 + now.getMinutes();
    const targetMin = h * 60 + m;
    let diff = targetMin - nowMin;
    if (diff < 0) diff += 24 * 60;
    const hours = Math.floor(diff / 60);
    const mins = diff % 60;
    return `${hours}h ${String(mins).padStart(2, '0')}m`;
  };

  const iftarCountdown = getCountdown(prayerTimes?.maghrib);
  const suhoorCountdown = getCountdown(prayerTimes?.fajr);

  return (
    <Card className="relative overflow-hidden p-5 border-none bg-gradient-to-br from-[hsl(var(--ramadan-olive)/0.08)] to-[hsl(var(--ramadan-gold)/0.06)]">
      {/* Decorative elements */}
      <div className="absolute top-3 right-4 flex gap-2">
        <Star className="w-3 h-3 ramadan-star" style={{ color: 'hsl(var(--ramadan-gold))' }} />
        <Star className="w-2 h-2 ramadan-star" style={{ color: 'hsl(var(--ramadan-gold))' }} />
        <Moon className="w-4 h-4 ramadan-crescent" style={{ color: 'hsl(var(--ramadan-gold))' }} />
        <Star className="w-2.5 h-2.5 ramadan-star" style={{ color: 'hsl(var(--ramadan-gold))' }} />
      </div>

      {/* Day counter + date */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-title-2 text-foreground">
            {t('ramadan.dayOf', { day: phaseInfo.currentDayOfRamadan })}
          </h2>
          <p className="text-footnote text-muted-foreground mt-0.5">
            {phaseInfo.hijriDate.day} {phaseInfo.hijriDate.monthName} {phaseInfo.hijriDate.year} AH
          </p>
        </div>
        <ProgressRing
          progress={completionPct}
          size={44}
          strokeWidth={3}
          label={`${completionPct}%`}
        />
      </div>

      {/* Countdowns */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-background/60">
          <Sun className="w-4 h-4 text-muted-foreground" />
          <div>
            <p className="text-caption-1 text-muted-foreground">{t('ramadan.countdown.iftar')}</p>
            <p className="text-subhead font-semibold">{iftarCountdown}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-background/60">
          <CloudMoon className="w-4 h-4 text-muted-foreground" />
          <div>
            <p className="text-caption-1 text-muted-foreground">{t('ramadan.countdown.suhoor')}</p>
            <p className="text-subhead font-semibold">{suhoorCountdown}</p>
          </div>
        </div>
      </div>

      {/* Fasting status toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => onFastingStatusChange('fasting')}
          className={cn(
            "flex-1 py-2 px-3 rounded-xl text-subhead font-medium transition-colors",
            fastingStatus === 'fasting'
              ? "bg-success/20 text-success"
              : "bg-muted text-muted-foreground"
          )}
        >
          {fastingStatus === 'fasting' ? (
            <Check className="w-4 h-4 mr-1.5 inline-block" />
          ) : (
            <Moon className="w-4 h-4 mr-1.5 inline-block opacity-50" />
          )}
          {t('ramadan.fastingToday')}
        </button>
        <button
          onClick={() => onFastingStatusChange('excused')}
          className={cn(
            "flex-1 py-2 px-3 rounded-xl text-subhead font-medium transition-colors",
            fastingStatus === 'excused'
              ? "bg-muted-foreground/20 text-muted-foreground"
              : "bg-muted text-muted-foreground"
          )}
        >
          <Moon className="w-4 h-4 mr-1.5 inline-block opacity-50" />
          {t('ramadan.excused')}
        </button>
      </div>
    </Card>
  );
}
