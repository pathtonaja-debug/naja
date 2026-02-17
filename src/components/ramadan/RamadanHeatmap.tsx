import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { getCompletionPercent, type DailyIbadah } from '@/services/ramadanDailyTracker';

interface RamadanHeatmapProps {
  currentDay: number;
  totalDays?: number;
}

const DEFAULT_IBADAH: DailyIbadah = {
  fasting: null,
  prayers: { Fajr: false, Dhuhr: false, Asr: false, Maghrib: false, Isha: false },
  taraweeh: false,
  quranPages: 0,
  dhikrDone: false,
  charityAmount: 0,
  tahajjud: false,
};

function getStore(): Record<string, DailyIbadah> {
  try {
    const raw = localStorage.getItem('naja_ramadan_ibadah_v1');
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/** Return the date key for day N of Ramadan (1-indexed), approximated from today */
function dateKeyForDay(dayNum: number, currentDay: number): string {
  const today = new Date();
  const diff = dayNum - currentDay;
  const d = new Date(today);
  d.setDate(d.getDate() + diff);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getColorClass(pct: number, isFuture: boolean, isToday: boolean): string {
  if (isFuture) return 'bg-muted/40';
  if (isToday) return 'ring-2 ring-primary ring-offset-1 ring-offset-background';
  if (pct === 0) return 'bg-muted';
  if (pct < 30) return 'bg-primary/15';
  if (pct < 60) return 'bg-primary/30';
  if (pct < 85) return 'bg-primary/55';
  return 'bg-primary/85';
}

export function RamadanHeatmap({ currentDay, totalDays = 30 }: RamadanHeatmapProps) {
  const { t } = useTranslation();
  const store = useMemo(() => getStore(), []);

  const days = useMemo(() => {
    return Array.from({ length: totalDays }, (_, i) => {
      const dayNum = i + 1;
      const isFuture = dayNum > currentDay;
      const isToday = dayNum === currentDay;
      const dateKey = dateKeyForDay(dayNum, currentDay);
      const ibadah = store[dateKey] ? { ...DEFAULT_IBADAH, ...store[dateKey] } : DEFAULT_IBADAH;
      const pct = isFuture ? 0 : getCompletionPercent(ibadah);
      const isLastTen = dayNum >= 21;
      return { dayNum, pct, isFuture, isToday, isLastTen };
    });
  }, [currentDay, totalDays, store]);

  const completedDays = days.filter(d => !d.isFuture && d.pct >= 50).length;

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-headline font-semibold">{t('ramadan.heatmap.title')}</h3>
        <span className="text-caption-1 text-muted-foreground">
          {completedDays}/{currentDay} {t('ramadan.heatmap.daysActive')}
        </span>
      </div>

      {/* 6 columns x 5 rows grid */}
      <div className="grid grid-cols-6 gap-1.5">
        {days.map((day) => (
          <div
            key={day.dayNum}
            className={cn(
              "aspect-square rounded-md flex items-center justify-center text-caption-2 font-medium transition-colors relative",
              day.isFuture && 'bg-muted/40 text-muted-foreground/50',
              !day.isFuture && day.pct === 0 && 'bg-muted text-muted-foreground',
              !day.isFuture && day.pct > 0 && day.pct < 30 && 'bg-primary/15 text-primary',
              !day.isFuture && day.pct >= 30 && day.pct < 60 && 'bg-primary/30 text-primary',
              !day.isFuture && day.pct >= 60 && day.pct < 85 && 'bg-primary/55 text-primary-foreground',
              !day.isFuture && day.pct >= 85 && 'bg-primary/85 text-primary-foreground',
              day.isToday && 'ring-2 ring-primary ring-offset-1 ring-offset-background',
              day.isLastTen && 'border border-[hsl(var(--ramadan-gold)/0.3)]',
            )}
            title={`Day ${day.dayNum}: ${day.pct}%`}
          >
            {day.dayNum}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between mt-3 text-caption-2 text-muted-foreground">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm bg-muted" />
          <span>0%</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm bg-primary/30" />
          <span>30%</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm bg-primary/55" />
          <span>60%</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm bg-primary/85" />
          <span>85%+</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm border border-[hsl(var(--ramadan-gold)/0.5)]" />
          <span>{t('ramadan.heatmap.lastTen')}</span>
        </div>
      </div>
    </Card>
  );
}
