/**
 * Streak Calendar Widget
 * GitHub-style contribution calendar showing daily activity
 */

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Flame } from 'lucide-react';
import { getAllDailyProgress } from '@/services/dailyProgressService';
import { cn } from '@/lib/utils';

export function StreakCalendar() {
  const { t } = useTranslation();

  const { days, activeDays, maxPoints } = useMemo(() => {
    const all = getAllDailyProgress();
    const result: Array<{ date: string; points: number; completed: number }> = [];
    let active = 0;
    let max = 0;

    // Last 28 days (4 weeks)
    for (let i = 27; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      const progress = all[key];
      const points = progress?.points || 0;
      const completed = progress?.completed || 0;

      if (completed > 0) active++;
      if (points > max) max = points;

      result.push({ date: key, points, completed });
    }

    return { days: result, activeDays: active, maxPoints: max || 1 };
  }, []);

  const getIntensity = (points: number): string => {
    if (points === 0) return 'bg-muted';
    const ratio = points / maxPoints;
    if (ratio < 0.25) return 'bg-success/25';
    if (ratio < 0.5) return 'bg-success/45';
    if (ratio < 0.75) return 'bg-success/65';
    return 'bg-success';
  };

  const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-2xl bg-card border border-border shadow-sm"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-destructive" />
          <h3 className="text-sm font-semibold">{t('dashboard.streakCalendar')}</h3>
        </div>
        <span className="text-xs text-muted-foreground">
          {activeDays} {t('dashboard.activeDays')}
        </span>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {dayLabels.map((label, i) => (
          <span key={i} className="text-[9px] text-muted-foreground text-center">{label}</span>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, i) => (
          <motion.div
            key={day.date}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.01 }}
            className={cn(
              "aspect-square rounded-sm transition-colors",
              getIntensity(day.points)
            )}
            title={`${day.date}: ${day.points} pts`}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-1 mt-2">
        <span className="text-[9px] text-muted-foreground">{t('dashboard.less')}</span>
        {['bg-muted', 'bg-success/25', 'bg-success/45', 'bg-success/65', 'bg-success'].map((cls, i) => (
          <div key={i} className={cn("w-2.5 h-2.5 rounded-sm", cls)} />
        ))}
        <span className="text-[9px] text-muted-foreground">{t('dashboard.more')}</span>
      </div>
    </motion.div>
  );
}
