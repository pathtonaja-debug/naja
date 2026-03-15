/**
 * Juz-based Navigation for Quran
 * Shows 30 Juz with surah ranges
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { BookOpen, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// Juz boundaries (starting surah:verse for each Juz)
const JUZ_DATA: Array<{ juz: number; startSurah: number; startVerse: number; endSurah: number; endVerse: number; name: string }> = [
  { juz: 1, startSurah: 1, startVerse: 1, endSurah: 2, endVerse: 141, name: "Alif Lam Meem" },
  { juz: 2, startSurah: 2, startVerse: 142, endSurah: 2, endVerse: 252, name: "Sayaqul" },
  { juz: 3, startSurah: 2, startVerse: 253, endSurah: 3, endVerse: 92, name: "Tilka ar-Rusul" },
  { juz: 4, startSurah: 3, startVerse: 93, endSurah: 4, endVerse: 23, name: "Lan Tanaloo" },
  { juz: 5, startSurah: 4, startVerse: 24, endSurah: 4, endVerse: 147, name: "Wal Muhsanat" },
  { juz: 6, startSurah: 4, startVerse: 148, endSurah: 5, endVerse: 81, name: "La Yuhibbu Allah" },
  { juz: 7, startSurah: 5, startVerse: 82, endSurah: 6, endVerse: 110, name: "Wa Idha Sami'u" },
  { juz: 8, startSurah: 6, startVerse: 111, endSurah: 7, endVerse: 87, name: "Wa Law Annana" },
  { juz: 9, startSurah: 7, startVerse: 88, endSurah: 8, endVerse: 40, name: "Qal al-Mala'" },
  { juz: 10, startSurah: 8, startVerse: 41, endSurah: 9, endVerse: 92, name: "Wa A'lamu" },
  { juz: 11, startSurah: 9, startVerse: 93, endSurah: 11, endVerse: 5, name: "Ya'tadhirun" },
  { juz: 12, startSurah: 11, startVerse: 6, endSurah: 12, endVerse: 52, name: "Wa Ma Min Dabbah" },
  { juz: 13, startSurah: 12, startVerse: 53, endSurah: 14, endVerse: 52, name: "Wa Ma Ubarri'u" },
  { juz: 14, startSurah: 15, startVerse: 1, endSurah: 16, endVerse: 128, name: "Rubama" },
  { juz: 15, startSurah: 17, startVerse: 1, endSurah: 18, endVerse: 74, name: "Subhana Alladhi" },
  { juz: 16, startSurah: 18, startVerse: 75, endSurah: 20, endVerse: 135, name: "Qal Alam" },
  { juz: 17, startSurah: 21, startVerse: 1, endSurah: 22, endVerse: 78, name: "Iqtaraba" },
  { juz: 18, startSurah: 23, startVerse: 1, endSurah: 25, endVerse: 20, name: "Qad Aflaha" },
  { juz: 19, startSurah: 25, startVerse: 21, endSurah: 27, endVerse: 55, name: "Wa Qal Alladhina" },
  { juz: 20, startSurah: 27, startVerse: 56, endSurah: 29, endVerse: 45, name: "A'man Khalaqa" },
  { juz: 21, startSurah: 29, startVerse: 46, endSurah: 33, endVerse: 30, name: "Utlu Ma Uhiya" },
  { juz: 22, startSurah: 33, startVerse: 31, endSurah: 36, endVerse: 27, name: "Wa Man Yaqnut" },
  { juz: 23, startSurah: 36, startVerse: 28, endSurah: 39, endVerse: 31, name: "Wa Mali" },
  { juz: 24, startSurah: 39, startVerse: 32, endSurah: 41, endVerse: 46, name: "Fa Man Azlamu" },
  { juz: 25, startSurah: 41, startVerse: 47, endSurah: 45, endVerse: 37, name: "Ilayhi Yuraddu" },
  { juz: 26, startSurah: 46, startVerse: 1, endSurah: 51, endVerse: 30, name: "Ha Meem" },
  { juz: 27, startSurah: 51, startVerse: 31, endSurah: 57, endVerse: 29, name: "Qala Fa Ma Khatbukum" },
  { juz: 28, startSurah: 58, startVerse: 1, endSurah: 66, endVerse: 12, name: "Qad Sami'a" },
  { juz: 29, startSurah: 67, startVerse: 1, endSurah: 77, endVerse: 50, name: "Tabaraka Alladhi" },
  { juz: 30, startSurah: 78, startVerse: 1, endSurah: 114, endVerse: 6, name: "'Amma" },
];

interface JuzNavigationProps {
  onSelectJuz: (surah: number, verse: number) => void;
  currentJuz?: number;
}

export function JuzNavigation({ onSelectJuz, currentJuz = 1 }: JuzNavigationProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-2">
      <Card className="p-4 mb-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{t('quran.currentJuz')}</span>
          <span className="text-lg font-bold text-primary">{t('quran.juz')} {currentJuz}</span>
        </div>
      </Card>

      {JUZ_DATA.map((juz) => (
        <motion.div key={juz.juz} whileTap={{ scale: 0.98 }}>
          <Card
            className={cn(
              "p-3 cursor-pointer transition-all hover:shadow-md",
              juz.juz === currentJuz && "bg-primary/5 border-primary/20"
            )}
            onClick={() => onSelectJuz(juz.startSurah, juz.startVerse)}
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm",
                juz.juz === currentJuz ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              )}>
                {juz.juz}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm truncate">{juz.name}</h4>
                <p className="text-xs text-muted-foreground">
                  {t('quran.surah')} {juz.startSurah}:{juz.startVerse} — {juz.endSurah}:{juz.endVerse}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
