import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bookmark, BookMarked, BookOpen, Brain, ChevronDown, ChevronUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AppVerse } from '@/services/quranApi';
import { HifdhStatus, cycleVerseHifdhStatus, getVerseHifdhStatus } from '@/services/quranHifdhState';
import { isBookmarked, toggleBookmark } from '@/services/quranReadingState';

interface VerseCardProps {
  verse: AppVerse;
  chapterId: number;
  chapterName: string;
  onTafsirRequest: (verseKey: string) => void;
  onLastReadSet?: (verseKey: string, verseNumber: number) => void;
}

const HIFDH_STATUS_CONFIG: Record<HifdhStatus, { label: string; className: string }> = {
  none: { label: 'Not started', className: 'bg-muted text-muted-foreground' },
  memorizing: { label: 'Memorizing', className: 'bg-warn/20 text-warn' },
  solid: { label: 'Solid', className: 'bg-success/20 text-success' },
};

export function VerseCard({ 
  verse, 
  chapterId, 
  chapterName, 
  onTafsirRequest,
  onLastReadSet 
}: VerseCardProps) {
  const [showTransliteration, setShowTransliteration] = useState(false);
  const [hifdhStatus, setHifdhStatus] = useState<HifdhStatus>(() => 
    getVerseHifdhStatus(verse.verseKey)
  );
  const [bookmarked, setBookmarked] = useState(() => isBookmarked(verse.verseKey));

  const handleBookmarkToggle = () => {
    const nowBookmarked = toggleBookmark(
      verse.verseKey,
      chapterId,
      verse.verseNumber,
      chapterName
    );
    setBookmarked(nowBookmarked);
  };

  const handleHifdhCycle = () => {
    const newStatus = cycleVerseHifdhStatus(verse.verseKey);
    setHifdhStatus(newStatus);
  };

  const handleSetLastRead = () => {
    onLastReadSet?.(verse.verseKey, verse.verseNumber);
  };

  const hifdhConfig = HIFDH_STATUS_CONFIG[hifdhStatus];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="p-4 space-y-3">
        {/* Verse Number Badge */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold">
              {verse.verseNumber}
            </span>
            <span className="text-xs text-muted-foreground">{verse.verseKey}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <button
              onClick={handleBookmarkToggle}
              className={cn(
                "p-2 rounded-lg transition-colors",
                bookmarked ? "text-primary bg-primary/10" : "text-muted-foreground hover:bg-muted"
              )}
              aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}
            >
              {bookmarked ? <BookMarked className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Arabic Text */}
        <p className="text-2xl font-arabic leading-loose text-right" dir="rtl">
          {verse.arabicText}
        </p>

        {/* Transliteration (collapsible) */}
        {verse.transliteration && (
          <div>
            <button
              onClick={() => setShowTransliteration(!showTransliteration)}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {showTransliteration ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              Transliteration
            </button>
            {showTransliteration && (
              <motion.p
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className="text-sm text-muted-foreground italic mt-1"
              >
                {verse.transliteration}
              </motion.p>
            )}
          </div>
        )}

        {/* Translation */}
        <p className="text-sm text-foreground/80 leading-relaxed">
          {verse.translationText}
        </p>

        {/* Action Row */}
        <div className="flex items-center gap-2 pt-2 border-t border-border/50">
          {/* Hifdh Status */}
          <button
            onClick={handleHifdhCycle}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors",
              hifdhConfig.className
            )}
          >
            <Brain className="w-3.5 h-3.5" />
            {hifdhConfig.label}
          </button>

          {/* Tafsir Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onTafsirRequest(verse.verseKey)}
            className="text-xs"
          >
            <BookOpen className="w-3.5 h-3.5 mr-1" />
            Tafsir
          </Button>

          {/* Set as Current */}
          {onLastReadSet && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSetLastRead}
              className="text-xs ml-auto"
            >
              Set as current
            </Button>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
