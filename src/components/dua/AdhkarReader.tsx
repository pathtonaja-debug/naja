import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Check, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TopBar } from '@/components/ui/top-bar';
import BottomNav from '@/components/BottomNav';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { getCurrentLanguage } from '@/lib/i18n';
import { hapticLight, hapticSuccess } from '@/lib/haptics';
import type { AdhkarItem } from '@/data/adhkarData';

interface AdhkarReaderProps {
  title: string;
  items: AdhkarItem[];
  storageKey: string;
  onBack: () => void;
}

interface ItemProgress {
  currentCount: number;
  completed: boolean;
}

export function AdhkarReader({ title, items, storageKey, onBack }: AdhkarReaderProps) {
  const { t } = useTranslation();
  const lang = getCurrentLanguage();
  const today = new Date().toISOString().split('T')[0];
  const fullKey = `${storageKey}_${today}`;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState<Record<string, ItemProgress>>(() => {
    const stored = localStorage.getItem(fullKey);
    if (stored) return JSON.parse(stored);
    return items.reduce((acc, item) => ({
      ...acc,
      [item.id]: { currentCount: 0, completed: false },
    }), {});
  });

  useEffect(() => {
    localStorage.setItem(fullKey, JSON.stringify(progress));
  }, [progress, fullKey]);

  const currentItem = items[currentIndex];
  const itemProgress = progress[currentItem.id] || { currentCount: 0, completed: false };
  const completedCount = Object.values(progress).filter(p => p.completed).length;
  const allDone = completedCount === items.length;

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
      // Auto-advance after a short delay
      if (currentIndex < items.length - 1) {
        setTimeout(() => setCurrentIndex(currentIndex + 1), 600);
      }
    }
  };

  const goNext = () => {
    if (currentIndex < items.length - 1) setCurrentIndex(currentIndex + 1);
  };

  const goPrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const handleReset = () => {
    setProgress(items.reduce((acc, item) => ({
      ...acc,
      [item.id]: { currentCount: 0, completed: false },
    }), {}));
    setCurrentIndex(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background pb-24"
    >
      <TopBar
        title={title}
        leftElement={
          <button onClick={onBack} className="p-2 -ml-2">
            <ChevronLeft className="w-5 h-5" />
          </button>
        }
        rightElement={
          <button onClick={handleReset} className="p-2 rounded-full hover:bg-muted transition-colors">
            <RotateCcw className="w-5 h-5" />
          </button>
        }
      />

      {/* Progress bar */}
      <div className="px-4 pb-4">
        <div className="flex items-center gap-2 mb-2">
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
                idx === currentIndex
                  ? "bg-primary scale-125"
                  : progress[item.id]?.completed
                  ? "bg-success"
                  : "bg-muted"
              )}
            />
          ))}
        </div>
      </div>

      {/* All done celebration */}
      {allDone && (
        <div className="px-4 pb-4">
          <div className="p-4 rounded-2xl bg-success/10 border border-success/20 text-center">
            <Check className="w-8 h-8 text-success mx-auto mb-2" />
            <h3 className="font-semibold text-success">{t('adhkar.allCompleted')}</h3>
            <p className="text-xs text-muted-foreground mt-1">{t('dashboard.niyyahDisclaimer')}</p>
          </div>
        </div>
      )}

      {/* Current dhikr card */}
      <div className="px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentItem.id}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="p-6 rounded-3xl bg-card border border-border shadow-sm"
          >
            {/* Arabic */}
            <p className="text-3xl font-arabic text-center leading-loose mb-4">
              {currentItem.arabic}
            </p>

            {/* Transliteration */}
            <p className="text-sm text-muted-foreground text-center italic mb-3">
              {currentItem.transliteration}
            </p>

            {/* Translation */}
            <p className="text-sm text-center font-medium mb-4">
              {currentItem.translation[lang]}
            </p>

            {/* Source */}
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
                  ? "bg-success/10 text-success cursor-default"
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
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between px-4 pt-4">
        <Button
          variant="outline"
          size="icon"
          onClick={goPrev}
          disabled={currentIndex === 0}
          className="rounded-full"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>

        <span className="text-sm text-muted-foreground">
          {currentIndex + 1} / {items.length}
        </span>

        <Button
          variant="outline"
          size="icon"
          onClick={goNext}
          disabled={currentIndex === items.length - 1}
          className="rounded-full"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      <BottomNav />
    </motion.div>
  );
}
