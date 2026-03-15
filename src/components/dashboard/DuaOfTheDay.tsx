/**
 * Dua of the Day Widget
 * Rotates through Quranic duas daily
 */

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { HandHeart, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { QURANIC_DUAS } from '@/data/quranicDuas';
import { getCurrentLanguage } from '@/lib/i18n';

export function DuaOfTheDay() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const dua = useMemo(() => {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    return QURANIC_DUAS[dayOfYear % QURANIC_DUAS.length];
  }, []);

  const lang = getCurrentLanguage();
  const translation = lang === 'fr' ? dua.translationKeyFr : dua.translationKeyEn;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-2xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <HandHeart className="w-4 h-4 text-accent" />
          <h3 className="text-sm font-semibold">{t('dashboard.duaOfDay')}</h3>
        </div>
        <span className="text-[10px] text-muted-foreground">{dua.verseLabel}</span>
      </div>

      <p className="text-lg font-arabic text-center mb-2 leading-relaxed">{dua.arabic}</p>
      <p className="text-xs text-muted-foreground text-center italic mb-1">{dua.transliteration}</p>
      <p className="text-xs text-center font-medium mb-3">"{translation}"</p>

      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={() => navigate('/dua')}
        className="w-full py-2 rounded-xl bg-accent/10 hover:bg-accent/20 text-accent text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
      >
        {t('dashboard.moreDuas')}
        <ChevronRight className="w-3.5 h-3.5" />
      </motion.button>
    </motion.div>
  );
}
