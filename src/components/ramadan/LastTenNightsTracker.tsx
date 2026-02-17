import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Star, Moon, BookOpen, Heart, Check } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const STORAGE_KEY = 'naja_ramadan_lastTen_v1';

interface NightChecklist {
  qiyam: boolean;
  istighfar: boolean;
  extraQuran: boolean;
  longDua: boolean;
  itikaaf: boolean;
}

interface LastTenStore {
  [date: string]: NightChecklist;
}

const DEFAULT_CHECKLIST: NightChecklist = {
  qiyam: false,
  istighfar: false,
  extraQuran: false,
  longDua: false,
  itikaaf: false,
};

function getDateKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

function getStore(): LastTenStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveStore(store: LastTenStore): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch { /* ignore */ }
}

interface LastTenNightsProps {
  currentDayOfRamadan: number;
}

const CHECKLIST_ITEMS: { key: keyof NightChecklist; icon: React.ReactNode; labelKey: string }[] = [
  { key: 'qiyam', icon: <Moon className="w-4 h-4" />, labelKey: 'ramadan.lastTen.qiyam' },
  { key: 'istighfar', icon: <Heart className="w-4 h-4" />, labelKey: 'ramadan.lastTen.istighfar' },
  { key: 'extraQuran', icon: <BookOpen className="w-4 h-4" />, labelKey: 'ramadan.lastTen.extraQuran' },
  { key: 'longDua', icon: <Sparkles className="w-4 h-4" />, labelKey: 'ramadan.lastTen.longDua' },
  { key: 'itikaaf', icon: <Star className="w-4 h-4" />, labelKey: 'ramadan.lastTen.itikaaf' },
];

// Odd nights of last 10 (21, 23, 25, 27, 29)
function isOddNight(day: number): boolean {
  return day >= 21 && day % 2 === 1;
}

export function LastTenNightsTracker({ currentDayOfRamadan }: LastTenNightsProps) {
  const { t } = useTranslation();
  const [checklist, setChecklist] = useState<NightChecklist>(DEFAULT_CHECKLIST);

  useEffect(() => {
    const store = getStore();
    const today = getDateKey();
    setChecklist(store[today] ? { ...DEFAULT_CHECKLIST, ...store[today] } : DEFAULT_CHECKLIST);
  }, []);

  const toggle = useCallback((key: keyof NightChecklist) => {
    setChecklist(prev => {
      const updated = { ...prev, [key]: !prev[key] };
      const store = getStore();
      store[getDateKey()] = updated;
      saveStore(store);
      return updated;
    });
  }, []);

  const completed = Object.values(checklist).filter(Boolean).length;
  const oddNight = isOddNight(currentDayOfRamadan);

  // Track which nights of the last 10 have been active
  const nightDots = Array.from({ length: 10 }, (_, i) => {
    const dayNum = 21 + i;
    const isPast = dayNum < currentDayOfRamadan;
    const isCurrent = dayNum === currentDayOfRamadan;
    const isOdd = dayNum % 2 === 1;
    return { dayNum, isPast, isCurrent, isOdd };
  });

  return (
    <div className="space-y-4">
      {/* Special header */}
      <Card className="relative overflow-hidden p-5 border-none bg-gradient-to-br from-[hsl(var(--ramadan-olive)/0.12)] to-[hsl(var(--ramadan-gold)/0.08)]">
        {/* Stars decoration */}
        <div className="absolute top-2 right-3 flex gap-1.5">
          {[1, 2, 3, 4, 5].map(i => (
            <Star
              key={i}
              className="ramadan-star"
              style={{ color: 'hsl(var(--ramadan-gold))', width: `${6 + Math.random() * 6}px`, height: `${6 + Math.random() * 6}px` }}
            />
          ))}
        </div>

        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5" style={{ color: 'hsl(var(--ramadan-gold))' }} />
          <h2 className="text-title-2 font-bold">{t('ramadan.lastTen.title')}</h2>
        </div>
        <p className="text-footnote text-muted-foreground mb-3">
          {t('ramadan.lastTen.subtitle')}
        </p>

        {oddNight && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="px-3 py-2 rounded-xl bg-[hsl(var(--ramadan-gold)/0.15)] border border-[hsl(var(--ramadan-gold)/0.25)]"
          >
            <p className="text-caption-1 font-medium" style={{ color: 'hsl(var(--ramadan-gold-soft))' }}>
              ✨ {t('ramadan.lastTen.oddNight', { night: currentDayOfRamadan })}
            </p>
          </motion.div>
        )}

        {/* Night dots */}
        <div className="flex gap-1.5 mt-3">
          {nightDots.map(nd => (
            <div
              key={nd.dayNum}
              className={cn(
                "flex-1 h-2 rounded-full transition-colors",
                nd.isCurrent && "ring-1 ring-[hsl(var(--ramadan-gold))] ring-offset-1 ring-offset-background",
                nd.isPast ? "bg-primary/60" : nd.isCurrent ? "bg-primary" : "bg-muted/60",
                nd.isOdd && !nd.isPast && !nd.isCurrent && "bg-[hsl(var(--ramadan-gold)/0.2)]",
              )}
              title={`Night ${nd.dayNum}`}
            />
          ))}
        </div>
        <div className="flex justify-between mt-1 text-caption-2 text-muted-foreground">
          <span>21</span>
          <span>30</span>
        </div>
      </Card>

      {/* Night checklist */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-headline font-semibold">{t('ramadan.lastTen.checklist')}</h3>
          <span className="text-caption-1 text-muted-foreground">{completed}/5</span>
        </div>

        <div className="space-y-2">
          {CHECKLIST_ITEMS.map(item => {
            const done = checklist[item.key];
            return (
              <motion.button
                key={item.key}
                animate={done ? { scale: [1, 1.03, 0.97, 1] } : { scale: 1 }}
                transition={{ duration: 0.35 }}
                onClick={() => toggle(item.key)}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-xl transition-colors",
                  done ? "bg-success/10 text-success" : "bg-muted/50 text-muted-foreground"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                  done ? "bg-success/20" : "bg-muted"
                )}>
                  <AnimatePresence mode="wait">
                    {done ? (
                      <motion.div
                        key="check"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                      >
                        <Check className="w-4 h-4" />
                      </motion.div>
                    ) : (
                      <motion.div key="icon" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        {item.icon}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <span className="text-subhead font-medium">{t(item.labelKey)}</span>
              </motion.button>
            );
          })}
        </div>
      </Card>

      {/* Dua of Laylatul Qadr */}
      <Card className="p-4 bg-gradient-to-br from-[hsl(var(--ramadan-gold)/0.06)] to-transparent border-[hsl(var(--ramadan-gold)/0.15)]">
        <h4 className="text-subhead font-semibold mb-2">{t('ramadan.lastTen.duaTitle')}</h4>
        <p className="text-xl font-arabic text-center my-3 leading-loose">
          اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي
        </p>
        <p className="text-caption-1 text-muted-foreground text-center italic">
          Allahumma innaka 'afuwwun tuhibbul 'afwa fa'fu 'anni
        </p>
        <p className="text-caption-1 text-center mt-1">{t('ramadan.lastTen.duaTranslation')}</p>
        <p className="text-caption-2 text-muted-foreground text-center mt-1">Tirmidhi 3513</p>
      </Card>
    </div>
  );
}
