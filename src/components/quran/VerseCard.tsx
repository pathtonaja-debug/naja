import { useMemo, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bookmark,
  BookMarked,
  BookOpen,
  Brain,
  ChevronDown,
  ChevronUp,
  StickyNote,
  X,
  Languages
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { AppVerse } from '@/services/quranApi';
import { HifdhStatus, cycleVerseHifdhStatus, getVerseHifdhStatus } from '@/services/quranHifdhState';
import { isBookmarked, toggleBookmark } from '@/services/quranReadingState';
import { getNote, setNote, hasNote as checkHasNote } from '@/services/quranNotesState';
import { getFrenchWordTranslation } from '@/services/quranWbwFr';

interface VerseCardProps {
  verse: AppVerse;
  chapterId: number;
  chapterName: string;
  onTafsirRequest: (verseKey: string) => void;
  onLastReadSet?: (verseKey: string, verseNumber: number) => void;
  showWordByWord?: boolean;
  useFrenchWbw?: boolean;
}

const ALLOWED_TAGS = new Set(['P', 'BR', 'STRONG', 'EM', 'B', 'I', 'UL', 'OL', 'LI', 'SUP']);

function sanitizeBasicHtml(html: string): string {
  if (!html) return '';
  const doc = new DOMParser().parseFromString(html, 'text/html');

  const walk = (node: Element) => {
    [...node.children].forEach((child) => {
      if (!ALLOWED_TAGS.has(child.tagName)) {
        const fragment = document.createDocumentFragment();
        while (child.firstChild) fragment.appendChild(child.firstChild);
        child.replaceWith(fragment);
      } else {
        walk(child);
      }
    });
  };

  walk(doc.body);
  return doc.body.innerHTML;
}

function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        className="relative w-full max-w-lg max-h-[80vh] bg-background rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold text-foreground">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 overflow-y-auto max-h-[60vh]">
          {children}
        </div>
      </motion.div>
    </div>
  );
}

function useTranslationNodes(verse: AppVerse, onFootnotePress: (id: string) => void) {
  return useMemo(() => {
    const html = (verse.translationHtml || '').trim();

    if (html) {
      const safe = sanitizeBasicHtml(html);
      const doc = new DOMParser().parseFromString(safe, 'text/html');

      const convert = (node: ChildNode, key: string): React.ReactNode => {
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent || '';
          // Convert inline footnote patterns like "word,1" or "word.2" to superscripts
          const parts = text.split(/([,.\u061B\u061F!?])\s*(\d{1,2})\b/g);
          const result: React.ReactNode[] = [];
          
          for (let i = 0; i < parts.length; i += 3) {
            const textPart = parts[i];
            const punct = parts[i + 1];
            const num = parts[i + 2];
            
            if (textPart) result.push(textPart);
            if (punct) result.push(punct);
            if (num) {
              result.push(
                <button
                  key={`fn-${key}-${i}`}
                  onClick={() => onFootnotePress(num)}
                  className="ml-0.5 align-super text-[10px] text-primary hover:underline underline-offset-2 font-medium"
                  aria-label={`Footnote ${num}`}
                >
                  {num}
                </button>
              );
            }
          }
          
          return result.length > 1 ? <>{result}</> : text;
        }

        if (node.nodeType === Node.ELEMENT_NODE) {
          const el = node as HTMLElement;
          const tag = el.tagName.toLowerCase();

          if (tag === 'sup') {
            const id = (el.textContent || '').trim();
            if (!id) return null;
            return (
              <button
                key={key}
                onClick={() => onFootnotePress(id)}
                className="ml-0.5 align-super text-[10px] text-primary hover:underline underline-offset-2 font-medium"
                aria-label={`Footnote ${id}`}
              >
                {id}
              </button>
            );
          }

          const children = Array.from(el.childNodes).map((c, i) => convert(c, `${key}-${i}`));

          if (tag === 'br') return <br key={key} />;
          if (tag === 'p') return <p key={key} className="mb-2 last:mb-0">{children}</p>;
          if (tag === 'strong' || tag === 'b') return <strong key={key}>{children}</strong>;
          if (tag === 'em' || tag === 'i') return <em key={key}>{children}</em>;
          if (tag === 'ul') return <ul key={key} className="list-disc pl-4 my-2">{children}</ul>;
          if (tag === 'ol') return <ol key={key} className="list-decimal pl-4 my-2">{children}</ol>;
          if (tag === 'li') return <li key={key} className="mb-1">{children}</li>;

          return <span key={key}>{children}</span>;
        }

        return null;
      };

      const nodes: React.ReactNode[] = [];
      doc.body.childNodes.forEach((n, idx) => {
        const converted = convert(n, String(idx));
        if (converted) nodes.push(converted);
      });
      return nodes;
    }

    // Fallback: plain translationText
    return [verse.translationText || ''];
  }, [verse.translationHtml, verse.translationText, onFootnotePress]);
}

export function VerseCard({
  verse,
  chapterId,
  chapterName,
  onTafsirRequest,
  onLastReadSet,
  showWordByWord = false,
  useFrenchWbw = false
}: VerseCardProps) {
  const { t } = useTranslation();
  const [showTransliteration, setShowTransliteration] = useState(false);
  const [hifdhStatus, setHifdhStatus] = useState<HifdhStatus>(() => getVerseHifdhStatus(verse.verseKey));
  const [bookmarked, setBookmarked] = useState(() => isBookmarked(verse.verseKey));

  // Footnotes popup
  const [footnoteOpen, setFootnoteOpen] = useState(false);
  const [footnoteId, setFootnoteId] = useState<string | null>(null);

  // Notes popup
  const [notesOpen, setNotesOpen] = useState(false);
  const [noteDraft, setNoteDraft] = useState(() => getNote(verse.verseKey)?.text ?? '');
  const [hasNoteState, setHasNoteState] = useState(() => checkHasNote(verse.verseKey));

  const HIFDH_STATUS_CONFIG: Record<HifdhStatus, { label: string; className: string }> = {
    none: { label: t('quran.notStarted'), className: 'bg-muted text-muted-foreground' },
    memorizing: { label: t('quran.memorizing'), className: 'bg-amber-500/20 text-amber-600 dark:text-amber-400' },
    solid: { label: t('quran.solid'), className: 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' },
  };

  const hifdhConfig = HIFDH_STATUS_CONFIG[hifdhStatus];

  const handleBookmarkToggle = () => {
    const nowBookmarked = toggleBookmark(verse.verseKey, chapterId, verse.verseNumber, chapterName);
    setBookmarked(nowBookmarked);
  };

  const handleHifdhCycle = () => {
    const newStatus = cycleVerseHifdhStatus(verse.verseKey);
    setHifdhStatus(newStatus);
  };

  const handleSetLastRead = () => onLastReadSet?.(verse.verseKey, verse.verseNumber);

  const onFootnotePress = useCallback((id: string) => {
    setFootnoteId(id);
    setFootnoteOpen(true);
  }, []);

  const handleSaveNote = () => {
    setNote(verse.verseKey, noteDraft);
    setHasNoteState(noteDraft.trim().length > 0);
    setNotesOpen(false);
  };

  const handleClearNote = () => {
    setNoteDraft('');
    setNote(verse.verseKey, '');
    setHasNoteState(false);
  };

  const translationNodes = useTranslationNodes(verse, onFootnotePress);

  // Use actual word data from API for word-by-word
  const wordByWordData = useMemo(() => {
    if (!showWordByWord) return null;
    
    // Use actual words from API if available
    if (verse.words && verse.words.length > 0) {
      return verse.words
        .filter((w) => w.text_uthmani && w.char_type_name !== 'end') // Exclude end markers
        .map((w) => {
          // Try to get French translation if enabled
          let translation = w.translation?.text || '';
          if (useFrenchWbw && w.position) {
            const frenchTrans = getFrenchWordTranslation(verse.verseKey, w.position, chapterId);
            if (frenchTrans) {
              translation = frenchTrans;
            }
          }
          
          return {
            arabic: w.text_uthmani,
            transliteration: w.transliteration?.text || '',
            translation,
          };
        });
    }
    
    // Fallback: split Arabic text and transliteration
    if (!verse.arabicText) return null;
    const arabicWords = verse.arabicText.split(/\s+/).filter(Boolean);
    const translitWords = verse.transliteration?.split(/\s+/).filter(Boolean) || [];
    
    return arabicWords.map((word, idx) => ({
      arabic: word,
      transliteration: translitWords[idx] || '',
      translation: '',
    }));
  }, [showWordByWord, verse.words, verse.arabicText, verse.transliteration, useFrenchWbw, verse.verseKey, chapterId]);

  return (
    <>
      <Card 
        id={`verse-${verse.verseKey}`}
        className="overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm mx-0"
      >
        <div className="p-3 sm:p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-9 h-9 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                {verse.verseNumber}
              </span>
              <div>
                <p className="font-medium text-sm text-foreground">{verse.verseKey}</p>
                <p className="text-xs text-muted-foreground">
                  {t('quran.page')} {verse.pageNumber} · {t('quran.juz')} {verse.juzNumber}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  setNoteDraft(getNote(verse.verseKey)?.text ?? '');
                  setNotesOpen(true);
                }}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  hasNoteState ? "text-primary bg-primary/10" : "text-muted-foreground hover:bg-muted"
                )}
                aria-label="Open notes"
              >
                <StickyNote className="w-4 h-4" />
              </button>

              <button onClick={handleBookmarkToggle} className="p-2 rounded-lg text-muted-foreground hover:bg-muted transition-colors">
                {bookmarked ? <BookMarked className="w-4 h-4 text-primary" /> : <Bookmark className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Separator */}
          <div className="border-t border-border/30" />

          {/* Arabic Text - Always visible, RTL, prominent */}
          {showWordByWord && wordByWordData ? (
            <div className="py-3" dir="rtl">
              <div className="flex flex-wrap gap-x-4 gap-y-3 justify-end">
                {wordByWordData.map((word, idx) => (
                  <div key={idx} className="text-center min-w-0">
                    <p className="font-arabic text-xl sm:text-2xl text-foreground leading-relaxed mb-0.5">
                      {word.arabic}
                    </p>
                    {word.translation && (
                      <p className="text-[10px] text-primary font-medium">
                        {word.translation}
                      </p>
                    )}
                    {word.transliteration && (
                      <p className="text-[10px] text-muted-foreground italic">
                        {word.transliteration}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : verse.arabicText ? (
            <div className="py-3">
              <p
                className="font-arabic text-2xl sm:text-3xl leading-[2.2] text-foreground text-right"
                dir="rtl"
                lang="ar"
              >
                {verse.arabicText}
              </p>
            </div>
          ) : null}

          {/* Transliteration (collapsible) */}
          {verse.transliteration && !showWordByWord && (
            <div>
              <button
                onClick={() => setShowTransliteration(!showTransliteration)}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {showTransliteration ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                {t('quran.transliteration')}
              </button>

              <AnimatePresence>
                {showTransliteration && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="text-sm text-muted-foreground italic leading-relaxed mt-2 pl-2 border-l-2 border-primary/30">
                      {verse.transliteration}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Translation */}
          <div className="text-sm text-foreground/90 leading-relaxed">
            {translationNodes}
          </div>

          {/* Separator */}
          <div className="border-t border-border/30" />

          {/* Actions - Compact pill buttons on single line */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleHifdhCycle}
              className={cn(
                "inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium transition-colors",
                hifdhConfig.className
              )}
            >
              <Brain className="w-3 h-3 shrink-0" />
              <span className="truncate">{hifdhConfig.label}</span>
            </button>

            <button
              onClick={() => onTafsirRequest(verse.verseKey)}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
            >
              <BookOpen className="w-3 h-3 shrink-0" />
              {t('quran.tafsir')}
            </button>

            {onLastReadSet && (
              <button
                onClick={handleSetLastRead}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium text-muted-foreground hover:bg-muted transition-colors ml-auto"
              >
                <Bookmark className="w-3 h-3 shrink-0" />
                {t('quran.markHere')}
              </button>
            )}
          </div>
        </div>
      </Card>

      {/* Footnote popup */}
      <AnimatePresence>
        {footnoteOpen && (
          <Modal
            open={footnoteOpen}
            onClose={() => setFootnoteOpen(false)}
            title={`Footnote ${footnoteId ?? ''}`}
          >
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Reference marker for verse {verse.verseKey}.
              </p>
              <p className="text-sm text-foreground/80 leading-relaxed">
                Footnote content from Quran.com translations provides additional context for specific words or phrases. 
                This marker indicates supplementary scholarly notes in the source translation.
              </p>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* Notes popup */}
      <AnimatePresence>
        {notesOpen && (
          <Modal
            open={notesOpen}
            onClose={handleSaveNote}
            title={`Notes · ${verse.verseKey}`}
          >
            <div className="space-y-4">
              <p className="text-xs text-muted-foreground">
                Private notes saved on this device.
              </p>
              <textarea
                value={noteDraft}
                onChange={(e) => setNoteDraft(e.target.value)}
                placeholder="Write your reflections, reminders, or insights..."
                className="w-full min-h-[180px] rounded-xl border border-border bg-background p-3 text-sm leading-6 outline-none focus:ring-2 focus:ring-primary/30 resize-none"
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={handleClearNote}>
                  Clear
                </Button>
                <Button size="sm" onClick={handleSaveNote}>
                  Save
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}
