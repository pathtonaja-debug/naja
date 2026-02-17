import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Star, BookOpen, Moon, HandHeart, Sparkles, Heart } from 'lucide-react';
import { Card } from '@/components/ui/card';
import type { DailyIbadah } from '@/services/ramadanDailyTracker';

const DEFAULT_IBADAH: DailyIbadah = {
  fasting: null,
  prayers: { Fajr: false, Dhuhr: false, Asr: false, Maghrib: false, Isha: false },
  taraweeh: false,
  quranPages: 0,
  dhikrDone: false,
  charityDone: false,
  tahajjud: false,
};

function getAllStats() {
  try {
    const raw = localStorage.getItem('naja_ramadan_ibadah_v1');
    const store: Record<string, DailyIbadah> = raw ? JSON.parse(raw) : {};
    const days = Object.values(store);

    let fastingDays = 0;
    let totalPrayers = 0;
    let taraweehNights = 0;
    let quranPages = 0;
    let charityDays = 0;
    let tahajjudNights = 0;
    let dhikrDays = 0;

    for (const day of days) {
      const d = { ...DEFAULT_IBADAH, ...day };
      if (d.fasting === 'fasting') fastingDays++;
      totalPrayers += Object.values(d.prayers).filter(Boolean).length;
      if (d.taraweeh) taraweehNights++;
      quranPages += d.quranPages || 0;
      if (d.charityDone) charityDays++;
      if (d.tahajjud) tahajjudNights++;
      if (d.dhikrDone) dhikrDays++;
    }

    return { fastingDays, totalPrayers, taraweehNights, quranPages, charityDays, tahajjudNights, dhikrDays, totalDays: days.length };
  } catch {
    return { fastingDays: 0, totalPrayers: 0, taraweehNights: 0, quranPages: 0, charityDays: 0, tahajjudNights: 0, dhikrDays: 0, totalDays: 0 };
  }
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } },
};

interface StatItemProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  color: string;
}

function StatItem({ icon, value, label, color }: StatItemProps) {
  return (
    <motion.div variants={itemVariants} className="flex flex-col items-center gap-1.5 p-3">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${color}`}>
        {icon}
      </div>
      <span className="text-title-2 font-bold">{value}</span>
      <span className="text-caption-1 text-muted-foreground text-center">{label}</span>
    </motion.div>
  );
}

export function EidSummaryCard() {
  const { t } = useTranslation();
  const stats = useMemo(() => getAllStats(), []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
    >
      <Card className="relative overflow-hidden p-6 border-[hsl(var(--ramadan-gold)/0.3)] bg-gradient-to-br from-[hsl(var(--ramadan-gold)/0.08)] to-[hsl(var(--ramadan-olive)/0.04)]">
        {/* Decorative stars */}
        <div className="absolute top-3 right-4 flex gap-2">
          {[1, 2, 3].map(i => (
            <Star key={i} className="w-3 h-3 ramadan-star" style={{ color: 'hsl(var(--ramadan-gold))' }} />
          ))}
        </div>

        {/* Header */}
        <div className="text-center mb-5">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[hsl(var(--ramadan-gold)/0.15)] mb-3"
          >
            <Sparkles className="w-4 h-4" style={{ color: 'hsl(var(--ramadan-gold))' }} />
            <span className="text-subhead font-semibold" style={{ color: 'hsl(var(--ramadan-gold))' }}>
              {t('ramadan.eid.summaryBadge')}
            </span>
          </motion.div>
          <h2 className="text-title-1 font-bold mb-1">{t('ramadan.eid.summaryTitle')}</h2>
          <p className="text-footnote text-muted-foreground">{t('ramadan.eid.summarySubtitle')}</p>
        </div>

        {/* Stats grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-3 gap-1 mb-5"
        >
          <StatItem
            icon={<Moon className="w-4 h-4" />}
            value={stats.fastingDays}
            label={t('ramadan.eid.fastingDays')}
            color="bg-primary/15 text-primary"
          />
          <StatItem
            icon={<Heart className="w-4 h-4" />}
            value={stats.totalPrayers}
            label={t('ramadan.eid.prayers')}
            color="bg-success/15 text-success"
          />
          <StatItem
            icon={<Star className="w-4 h-4" />}
            value={stats.taraweehNights}
            label={t('ramadan.eid.taraweeh')}
            color="bg-accent/15 text-accent"
          />
          <StatItem
            icon={<BookOpen className="w-4 h-4" />}
            value={stats.quranPages}
            label={t('ramadan.eid.quranPages')}
            color="bg-secondary/15 text-secondary-foreground"
          />
          <StatItem
            icon={<HandHeart className="w-4 h-4" />}
            value={stats.charityDays}
            label={t('ramadan.eid.charityDays')}
            color="bg-warn/15 text-warn"
          />
          <StatItem
            icon={<Moon className="w-4 h-4" />}
            value={stats.tahajjudNights}
            label={t('ramadan.eid.tahajjud')}
            color="bg-primary/15 text-primary"
          />
        </motion.div>

        {/* Closing message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center p-4 rounded-xl bg-background/60"
        >
          <p className="text-body text-foreground italic">"{t('ramadan.eid.closingMessage')}"</p>
          <p className="text-caption-1 text-muted-foreground mt-2">{t('ramadan.eid.disclaimer')}</p>
        </motion.div>
      </Card>
    </motion.div>
  );
}
