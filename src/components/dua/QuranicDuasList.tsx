import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { QURANIC_DUAS, type QuranicDua } from '@/data/quranicDuas';
import { getCurrentLanguage } from '@/lib/i18n';

interface QuranicDuasListProps {
  onBack: () => void;
}

export function QuranicDuasList({ onBack }: QuranicDuasListProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const lang = getCurrentLanguage();
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const goToVerse = (dua: QuranicDua) => {
    navigate(`/quran?surah=${dua.surah}&verse=${dua.verse}`);
  };

  return (
    <div className="space-y-3">
      {QURANIC_DUAS.map((dua) => {
        const isExpanded = expandedId === dua.id;
        const translation = lang === 'fr' ? dua.translationKeyFr : dua.translationKeyEn;

        return (
          <Card
            key={dua.id}
            className="overflow-hidden transition-all"
          >
            <button
              onClick={() => setExpandedId(isExpanded ? null : dua.id)}
              className="w-full p-4 text-left"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                      {dua.verseLabel}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      #{dua.id}
                    </span>
                  </div>
                  <p className="text-base font-arabic text-right leading-loose mt-2">
                    {dua.arabic}
                  </p>
                </div>
                <ChevronRight className={`w-4 h-4 text-muted-foreground mt-1 transition-transform shrink-0 ${isExpanded ? 'rotate-90' : ''}`} />
              </div>
            </button>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 space-y-3 border-t border-border pt-3">
                    <p className="text-sm text-muted-foreground italic">
                      {dua.transliteration}
                    </p>
                    <p className="text-sm text-foreground">
                      {translation}
                    </p>
                    <button
                      onClick={() => goToVerse(dua)}
                      className="flex items-center gap-2 text-xs font-medium text-primary hover:underline"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      {t('quranicDuas.viewInQuran')} ({dua.verseLabel})
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        );
      })}
    </div>
  );
}
