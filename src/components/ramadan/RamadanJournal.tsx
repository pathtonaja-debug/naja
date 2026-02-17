import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { BookHeart, Save } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  getTodayReflection,
  updateReflection,
  type DailyReflection,
} from '@/services/ramadanReflectionTracker';

const QUESTIONS = [
  { key: 'struggle', emoji: '🤔', translationKey: 'ramadan.journal.struggle' },
  { key: 'wentWell', emoji: '✨', translationKey: 'ramadan.journal.wentWell' },
  { key: 'gratitude', emoji: '💛', translationKey: 'ramadan.journal.gratitude' },
] as const;

export function RamadanJournal() {
  const { t } = useTranslation();
  const [reflection, setReflection] = useState<DailyReflection>(getTodayReflection());
  const [saved, setSaved] = useState(false);

  const hasContent = reflection.struggle || reflection.wentWell || reflection.gratitude;

  const handleChange = (field: keyof DailyReflection, value: string) => {
    const updated = updateReflection({ [field]: value });
    setReflection(updated);
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <BookHeart className="w-4 h-4 text-primary" />
        <h3 className="text-headline font-semibold">{t('ramadan.journal.title')}</h3>
      </div>

      <Card className="p-4 space-y-4">
        {QUESTIONS.map(({ key, emoji, translationKey }) => (
          <div key={key}>
            <label className="flex items-center gap-2 text-subhead font-medium mb-1.5">
              <span>{emoji}</span>
              {t(translationKey)}
            </label>
            <Textarea
              placeholder={t(`${translationKey}Placeholder`)}
              value={reflection[key]}
              onChange={(e) => handleChange(key, e.target.value)}
              className="min-h-[50px] text-sm resize-none"
              rows={2}
            />
          </div>
        ))}

        <div className="flex items-center justify-between pt-1">
          <p className="text-caption-1 text-muted-foreground italic">
            {t('ramadan.journal.hint')}
          </p>
          <motion.div
            animate={saved ? { scale: [1, 1.15, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            <Button
              size="sm"
              variant={saved ? "default" : "outline"}
              onClick={handleSave}
              disabled={!hasContent}
              className={cn(saved && "bg-success text-success-foreground")}
            >
              {saved ? (
                <><span>✓</span> {t('ramadan.journal.saved')}</>
              ) : (
                <><Save className="w-3.5 h-3.5 mr-1" /> {t('common.save')}</>
              )}
            </Button>
          </motion.div>
        </div>
      </Card>
    </div>
  );
}
