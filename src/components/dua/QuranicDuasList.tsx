import { BookOpen, Sparkles } from 'lucide-react';
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

  const goToVerse = (dua: QuranicDua) => {
    navigate(`/quran?surah=${dua.surah}&verse=${dua.verse}`);
  };

  return (
    <div className="space-y-3">
      {QURANIC_DUAS.map((dua) => {
        const translation = lang === 'fr' ? dua.translationKeyFr : dua.translationKeyEn;

        return (
          <Card
            key={dua.id}
            className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">#{dua.id}</h3>
                <p className="text-xs text-muted-foreground">{dua.verseLabel}</p>
              </div>
            </div>

            <p className="text-lg font-arabic text-right leading-loose mb-2">
              {dua.arabic}
            </p>
            <p className="text-xs text-muted-foreground italic mb-1">
              {dua.transliteration}
            </p>
            <p className="text-sm text-foreground mb-3">
              {translation}
            </p>

            <button
              onClick={() => goToVerse(dua)}
              className="flex items-center gap-2 text-xs font-medium text-primary hover:underline"
            >
              <BookOpen className="w-3.5 h-3.5" />
              {t('quranicDuas.viewInQuran')} ({dua.verseLabel})
            </button>
          </Card>
        );
      })}
    </div>
  );
}
