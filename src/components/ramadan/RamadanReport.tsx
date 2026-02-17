import { useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FileText, Share2, BookOpen, Moon, Heart, HandHeart, Star, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import type { DailyIbadah } from '@/services/ramadanDailyTracker';
import { getCompletionPercent } from '@/services/ramadanDailyTracker';
import { getTotalDonations } from '@/services/ramadanCharityTracker';
import { getRamadanReport } from '@/services/ramadanReflectionTracker';

const IBADAH_KEY = 'naja_ramadan_ibadah_v1';

const DEFAULT_IBADAH: DailyIbadah = {
  fasting: null,
  prayers: { Fajr: false, Dhuhr: false, Asr: false, Maghrib: false, Isha: false },
  taraweeh: false,
  quranPages: 0,
  dhikrDone: false,
  charityDone: false,
  tahajjud: false,
};

function getAllIbadahStats() {
  try {
    const raw = localStorage.getItem(IBADAH_KEY);
    const store: Record<string, DailyIbadah> = raw ? JSON.parse(raw) : {};
    const entries = Object.entries(store).sort(([a], [b]) => a.localeCompare(b));

    let fastingDays = 0, totalPrayers = 0, taraweehNights = 0;
    let quranPages = 0, charityDays = 0, tahajjudNights = 0, dhikrDays = 0;
    let bestPct = 0, bestDayNum = 0;
    let streak = 0, maxStreak = 0, currentStreak = 0;

    entries.forEach(([, data], i) => {
      const d = { ...DEFAULT_IBADAH, ...data };
      if (d.fasting === 'fasting') fastingDays++;
      totalPrayers += Object.values(d.prayers).filter(Boolean).length;
      if (d.taraweeh) taraweehNights++;
      quranPages += d.quranPages || 0;
      if (d.charityDone) charityDays++;
      if (d.tahajjud) tahajjudNights++;
      if (d.dhikrDone) dhikrDays++;

      const pct = getCompletionPercent(d);
      if (pct > bestPct) { bestPct = pct; bestDayNum = i + 1; }

      if (pct >= 50) {
        currentStreak++;
        if (currentStreak > maxStreak) maxStreak = currentStreak;
      } else {
        currentStreak = 0;
      }
    });

    return {
      totalDays: entries.length,
      fastingDays, totalPrayers, taraweehNights,
      quranPages, charityDays, tahajjudNights, dhikrDays,
      bestPct, bestDayNum, maxStreak,
      avgPct: entries.length > 0
        ? Math.round(entries.reduce((s, [, d]) => s + getCompletionPercent({ ...DEFAULT_IBADAH, ...d }), 0) / entries.length)
        : 0,
    };
  } catch {
    return {
      totalDays: 0, fastingDays: 0, totalPrayers: 0, taraweehNights: 0,
      quranPages: 0, charityDays: 0, tahajjudNights: 0, dhikrDays: 0,
      bestPct: 0, bestDayNum: 0, maxStreak: 0, avgPct: 0,
    };
  }
}

function StatRow({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string | number; color: string }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
        {icon}
      </div>
      <span className="flex-1 text-subhead">{label}</span>
      <span className="text-headline font-bold">{value}</span>
    </div>
  );
}

export function RamadanReport() {
  const { t } = useTranslation();
  const reportRef = useRef<HTMLDivElement>(null);

  const ibadah = useMemo(() => getAllIbadahStats(), []);
  const reflections = useMemo(() => getRamadanReport(), []);
  const totalDonations = useMemo(() => getTotalDonations(), []);

  const handleShare = async () => {
    const text = [
      `🌙 ${t('ramadan.report.title')}`,
      '',
      `📊 ${t('ramadan.report.avgCompletion')}: ${ibadah.avgPct}%`,
      `🍽️ ${t('ramadan.report.fastingDays')}: ${ibadah.fastingDays}`,
      `🕌 ${t('ramadan.report.prayers')}: ${ibadah.totalPrayers}`,
      `🌙 ${t('ramadan.report.taraweeh')}: ${ibadah.taraweehNights}`,
      `📖 ${t('ramadan.report.quranPages')}: ${ibadah.quranPages}`,
      `💛 ${t('ramadan.report.charity')}: ${totalDonations.toFixed(0)}`,
      `🔥 ${t('ramadan.report.longestStreak')}: ${ibadah.maxStreak}`,
      `⭐ ${t('ramadan.report.strongestDay')}: Day ${ibadah.bestDayNum} (${ibadah.bestPct}%)`,
      '',
      t('ramadan.report.closingDua'),
    ].join('\n');

    if (navigator.share) {
      try {
        await navigator.share({ title: t('ramadan.report.title'), text });
      } catch { /* cancelled */ }
    } else {
      await navigator.clipboard.writeText(text);
    }
  };

  if (ibadah.totalDays < 1) {
    return (
      <Card className="p-6 text-center">
        <FileText className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
        <p className="text-muted-foreground">{t('ramadan.report.noData')}</p>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" />
          <h3 className="text-headline font-semibold">{t('ramadan.report.title')}</h3>
        </div>
        <Button size="sm" variant="outline" onClick={handleShare}>
          <Share2 className="w-3.5 h-3.5 mr-1" />
          {t('ramadan.report.share')}
        </Button>
      </div>

      <div ref={reportRef}>
        {/* Score card */}
        <Card className="p-5 text-center mb-3 bg-gradient-to-br from-[hsl(var(--ramadan-gold)/0.08)] to-transparent border-[hsl(var(--ramadan-gold)/0.2)]">
          <Sparkles className="w-6 h-6 mx-auto mb-2" style={{ color: 'hsl(var(--ramadan-gold))' }} />
          <p className="text-4xl font-bold text-primary mb-1">{ibadah.avgPct}%</p>
          <p className="text-subhead text-muted-foreground">{t('ramadan.report.overallScore')}</p>
          <div className="mt-3">
            <Progress value={ibadah.avgPct} className="h-2" />
          </div>
        </Card>

        {/* Detail stats */}
        <Card className="p-4 mb-3 divide-y divide-border">
          <StatRow
            icon={<Moon className="w-4 h-4" />}
            label={t('ramadan.report.fastingDays')}
            value={`${ibadah.fastingDays}/${ibadah.totalDays}`}
            color="bg-primary/10 text-primary"
          />
          <StatRow
            icon={<Heart className="w-4 h-4" />}
            label={t('ramadan.report.prayers')}
            value={`${ibadah.totalPrayers}/${ibadah.totalDays * 5}`}
            color="bg-success/10 text-success"
          />
          <StatRow
            icon={<Star className="w-4 h-4" />}
            label={t('ramadan.report.taraweeh')}
            value={`${ibadah.taraweehNights} ${t('ramadan.goals.nights')}`}
            color="bg-accent/10 text-accent-foreground"
          />
          <StatRow
            icon={<BookOpen className="w-4 h-4" />}
            label={t('ramadan.report.quranPages')}
            value={ibadah.quranPages}
            color="bg-secondary/10 text-secondary-foreground"
          />
          <StatRow
            icon={<HandHeart className="w-4 h-4" />}
            label={t('ramadan.report.charity')}
            value={totalDonations.toFixed(0)}
            color="bg-warn/10 text-warn"
          />
        </Card>

        {/* Achievements */}
        <Card className="p-4 mb-3 space-y-2">
          <p className="text-subhead font-semibold">{t('ramadan.report.achievements')}</p>
          <div className="flex items-center gap-2 text-subhead">
            <span>🔥</span>
            <span>{t('ramadan.report.longestStreak')}: <strong>{ibadah.maxStreak} {t('ramadan.report.days')}</strong></span>
          </div>
          <div className="flex items-center gap-2 text-subhead">
            <span>⭐</span>
            <span>{t('ramadan.report.strongestDay')}: <strong>Day {ibadah.bestDayNum}</strong> ({ibadah.bestPct}%)</span>
          </div>
          {reflections.filledDays > 0 && (
            <div className="flex items-center gap-2 text-subhead">
              <span>📝</span>
              <span>{t('ramadan.report.reflectionDays')}: <strong>{reflections.filledDays}</strong></span>
            </div>
          )}
        </Card>

        {/* Gratitude highlights */}
        {reflections.topGratitude.length > 0 && (
          <Card className="p-4 space-y-2">
            <p className="text-subhead font-semibold">{t('ramadan.report.gratitudeHighlights')}</p>
            {reflections.topGratitude.map((g, i) => (
              <p key={i} className="text-caption-1 text-muted-foreground italic">"{g}"</p>
            ))}
          </Card>
        )}
      </div>

      {/* Closing */}
      <Card className="p-4 text-center bg-muted/30">
        <p className="text-body italic text-foreground">"{t('ramadan.report.closingDua')}"</p>
        <p className="text-caption-1 text-muted-foreground mt-2">{t('ramadan.report.disclaimer')}</p>
      </Card>
    </motion.div>
  );
}
