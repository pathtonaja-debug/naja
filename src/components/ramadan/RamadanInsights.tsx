import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart3, TrendingUp, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { type DailyIbadah, getCompletionPercent } from '@/services/ramadanDailyTracker';
import { getTotalDonations } from '@/services/ramadanCharityTracker';

const IBADAH_KEY = 'naja_ramadan_ibadah_v1';

interface DayStats {
  date: string;
  pct: number;
  prayerCount: number;
  taraweeh: boolean;
  quranPages: number;
  fasting: boolean;
  charity: boolean;
  tahajjud: boolean;
}

function loadAllStats(): DayStats[] {
  try {
    const raw = localStorage.getItem(IBADAH_KEY);
    const store: Record<string, DailyIbadah> = raw ? JSON.parse(raw) : {};
    return Object.entries(store)
      .map(([date, data]) => {
        const ibadah: DailyIbadah = {
          fasting: null, prayers: {}, taraweeh: false,
          quranPages: 0, dhikrDone: false, charityDone: false, tahajjud: false,
          ...data,
        };
        return {
          date,
          pct: getCompletionPercent(ibadah),
          prayerCount: Object.values(ibadah.prayers).filter(Boolean).length,
          taraweeh: ibadah.taraweeh,
          quranPages: ibadah.quranPages,
          fasting: ibadah.fasting === 'fasting',
          charity: ibadah.charityDone,
          tahajjud: ibadah.tahajjud,
        };
      })
      .sort((a, b) => a.date.localeCompare(b.date));
  } catch { return []; }
}

interface InsightRowProps {
  label: string;
  value: string | number;
  pct: number;
  emoji: string;
}

function InsightRow({ label, value, pct, emoji }: InsightRowProps) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-caption-1 text-muted-foreground flex items-center gap-1.5">
          <span>{emoji}</span> {label}
        </span>
        <span className="text-subhead font-semibold">{value}</span>
      </div>
      <Progress value={pct} className="h-1" />
    </div>
  );
}

/** Weekly breakdown helper */
function getWeeklyBreakdown(stats: DayStats[]) {
  const weeks: { label: string; stats: DayStats[] }[] = [];
  for (let i = 0; i < stats.length; i += 7) {
    const chunk = stats.slice(i, i + 7);
    const weekNum = Math.floor(i / 7) + 1;
    weeks.push({ label: `Week ${weekNum}`, stats: chunk });
  }
  return weeks;
}

function WeekCard({ label, stats }: { label: string; stats: DayStats[] }) {
  const { t } = useTranslation();
  if (stats.length === 0) return null;

  const avgPct = Math.round(stats.reduce((s, d) => s + d.pct, 0) / stats.length);
  const fastingDays = stats.filter(s => s.fasting).length;
  const prayers = stats.reduce((s, d) => s + d.prayerCount, 0);
  const quranPages = stats.reduce((s, d) => s + d.quranPages, 0);
  const taraweeh = stats.filter(s => s.taraweeh).length;

  return (
    <Card className="p-3 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-subhead font-semibold">{label}</span>
        <span className={cn(
          "text-caption-1 font-bold px-2 py-0.5 rounded-full",
          avgPct >= 75 ? "bg-success/15 text-success" :
          avgPct >= 50 ? "bg-warn/15 text-warn" :
          "bg-muted text-muted-foreground"
        )}>
          {avgPct}%
        </span>
      </div>
      <div className="grid grid-cols-4 gap-2 text-center">
        <div>
          <p className="text-subhead font-bold">{fastingDays}/{stats.length}</p>
          <p className="text-caption-2 text-muted-foreground">🍽️ {t('ramadan.insights.fasting')}</p>
        </div>
        <div>
          <p className="text-subhead font-bold">{prayers}/{stats.length * 5}</p>
          <p className="text-caption-2 text-muted-foreground">🕌 {t('ramadan.insights.prayers')}</p>
        </div>
        <div>
          <p className="text-subhead font-bold">{quranPages}</p>
          <p className="text-caption-2 text-muted-foreground">📖 {t('ramadan.insights.pages')}</p>
        </div>
        <div>
          <p className="text-subhead font-bold">{taraweeh}/{stats.length}</p>
          <p className="text-caption-2 text-muted-foreground">🌙 {t('ramadan.insights.taraweehShort')}</p>
        </div>
      </div>
    </Card>
  );
}

export function RamadanInsights() {
  const { t } = useTranslation();
  const [stats, setStats] = useState<DayStats[]>([]);

  useEffect(() => {
    setStats(loadAllStats());
  }, []);

  const insights = useMemo(() => {
    if (stats.length === 0) return null;

    const totalDays = stats.length;
    const fastingDays = stats.filter(s => s.fasting).length;
    const totalPrayers = stats.reduce((s, d) => s + d.prayerCount, 0);
    const maxPrayers = totalDays * 5;
    const taraweehNights = stats.filter(s => s.taraweeh).length;
    const totalQuranPages = stats.reduce((s, d) => s + d.quranPages, 0);
    const charityDays = stats.filter(s => s.charity).length;
    const tahajjudNights = stats.filter(s => s.tahajjud).length;
    const totalDonations = getTotalDonations();

    const strongest = stats.reduce((best, d) => d.pct > best.pct ? d : best, stats[0]);
    const strongestDayNum = stats.indexOf(strongest) + 1;
    const avgPct = Math.round(stats.reduce((s, d) => s + d.pct, 0) / totalDays);

    let streak = 0;
    for (let i = stats.length - 1; i >= 0; i--) {
      if (stats[i].pct >= 50) streak++;
      else break;
    }

    return {
      totalDays, fastingDays, totalPrayers, maxPrayers,
      taraweehNights, totalQuranPages, charityDays, tahajjudNights,
      totalDonations, strongestDayNum, strongest, avgPct, streak,
    };
  }, [stats]);

  const weeks = useMemo(() => getWeeklyBreakdown(stats), [stats]);

  if (!insights || insights.totalDays < 1) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <BarChart3 className="w-4 h-4 text-primary" />
        <h3 className="text-headline font-semibold">{t('ramadan.insights.title')}</h3>
      </div>

      {/* Average + streak header */}
      <Card className="p-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-primary">{insights.avgPct}%</p>
            <p className="text-caption-1 text-muted-foreground">{t('ramadan.insights.avgCompletion')}</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-primary">{insights.streak}</p>
            <p className="text-caption-1 text-muted-foreground">{t('ramadan.insights.currentStreak')}</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-primary">{insights.totalDays}</p>
            <p className="text-caption-1 text-muted-foreground">{t('ramadan.insights.daysTracked')}</p>
          </div>
        </div>
      </Card>

      {/* Weekly breakdown */}
      {weeks.length > 1 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-subhead font-medium text-muted-foreground">{t('ramadan.insights.weeklyBreakdown')}</span>
          </div>
          {weeks.map((w, i) => (
            <WeekCard key={i} label={w.label} stats={w.stats} />
          ))}
        </div>
      )}

      {/* Detailed stats */}
      <Card className="p-4 space-y-3">
        <InsightRow
          emoji="🍽️"
          label={t('ramadan.insights.fastingConsistency')}
          value={`${insights.fastingDays}/${insights.totalDays}`}
          pct={Math.round((insights.fastingDays / insights.totalDays) * 100)}
        />
        <InsightRow
          emoji="🕌"
          label={t('ramadan.insights.prayerCompletion')}
          value={`${insights.totalPrayers}/${insights.maxPrayers}`}
          pct={Math.round((insights.totalPrayers / insights.maxPrayers) * 100)}
        />
        <InsightRow
          emoji="🌙"
          label={t('ramadan.insights.taraweehNights')}
          value={`${insights.taraweehNights}/${insights.totalDays}`}
          pct={Math.round((insights.taraweehNights / insights.totalDays) * 100)}
        />
        <InsightRow
          emoji="📖"
          label={t('ramadan.insights.quranPages')}
          value={insights.totalQuranPages}
          pct={Math.min(100, Math.round((insights.totalQuranPages / 604) * 100))}
        />
        <InsightRow
          emoji="💛"
          label={t('ramadan.insights.charityDays')}
          value={`${insights.charityDays}/${insights.totalDays}`}
          pct={Math.round((insights.charityDays / insights.totalDays) * 100)}
        />
        <InsightRow
          emoji="🌃"
          label={t('ramadan.insights.tahajjudNights')}
          value={`${insights.tahajjudNights}/${insights.totalDays}`}
          pct={Math.round((insights.tahajjudNights / insights.totalDays) * 100)}
        />
      </Card>

      {/* Strongest day */}
      <Card className="p-3 bg-gradient-to-r from-[hsl(var(--ramadan-gold)/0.08)] to-transparent">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4" style={{ color: 'hsl(var(--ramadan-gold))' }} />
          <p className="text-subhead">
            <span className="font-semibold">{t('ramadan.insights.strongestDay')}</span>{' '}
            {t('ramadan.insights.dayNumber', { day: insights.strongestDayNum })} ({insights.strongest.pct}%)
          </p>
        </div>
      </Card>

      {/* Total charity */}
      {insights.totalDonations > 0 && (
        <div className="flex items-center justify-between px-1">
          <span className="text-subhead text-muted-foreground">{t('ramadan.insights.charityTotal')}</span>
          <span className="text-headline font-bold text-primary">{insights.totalDonations.toFixed(0)}</span>
        </div>
      )}
    </div>
  );
}
