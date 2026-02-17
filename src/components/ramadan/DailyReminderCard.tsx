import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { getDailyContent, type DailyContent } from '@/data/ramadanDailyContent';

interface DailyReminderCardProps {
  dayOfRamadan: number;
}

export function DailyReminderCard({ dayOfRamadan }: DailyReminderCardProps) {
  const { t } = useTranslation();
  const content: DailyContent = getDailyContent(dayOfRamadan);

  const typeLabel = t(`ramadan.reminder.${content.type}`);
  const typeEmoji = {
    hadith: '📖',
    dua: '🤲',
    tafsir: '✨',
    reflection: '💭',
  }[content.type];

  return (
    <div>
      <h3 className="text-headline font-semibold mb-3">{t('ramadan.reminder.title')}</h3>
      <AnimatePresence mode="wait">
        <motion.div
          key={dayOfRamadan}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-4 bg-gradient-to-br from-[hsl(var(--ramadan-gold)/0.06)] to-transparent">
            <div className="flex items-center gap-2 mb-3">
              <span>{typeEmoji}</span>
              <span className="text-caption-1 font-medium text-muted-foreground uppercase tracking-wider">
                {typeLabel}
              </span>
            </div>

            {content.arabic && (
              <p className="text-lg font-arabic text-center my-3 leading-loose text-foreground">
                {content.arabic}
              </p>
            )}

            {content.transliteration && (
              <p className="text-subhead text-muted-foreground italic text-center mb-2">
                {content.transliteration}
              </p>
            )}

            <p className="text-body text-center text-foreground">
              {t(content.translationKey)}
            </p>

            {content.sourceKey && (
              <p className="text-caption-1 text-muted-foreground text-center mt-2">
                — {t(content.sourceKey)}
              </p>
            )}
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
