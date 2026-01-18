import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Info, Loader2, X, Languages } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { AppChapter, AppVerse, ChapterInfo, getVersesByChapter, getChapterInfo, getTranslationIdForLanguage } from '@/services/quranApi';
import {
  getCachedVerses,
  setCachedVerses,
  getCachedChapterInfo,
  setCachedChapterInfo,
  getStaleVerses,
  getStaleChapterInfo
} from '@/services/quranCache';
import { setLastReadPosition } from '@/services/quranReadingState';
import { loadFrenchWbw, buildChapterWordIndex, isFrenchWbwLoaded } from '@/services/quranWbwFr';
import { sanitizeChapterHtml } from '@/lib/sanitize';
import { VerseCard } from './VerseCard';
import { TafsirSheet } from './TafsirSheet';

interface SurahReaderProps {
  chapter: AppChapter;
  onBack: () => void;
}

function Sheet({
  open,
  onClose,
  title,
  subtitle,
  children
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="relative w-full max-w-2xl max-h-[85vh] bg-background rounded-t-2xl shadow-2xl overflow-hidden"
      >
        <div className="sticky top-0 z-10 bg-background border-b">
          <div className="flex items-start justify-between p-4">
            <div className="space-y-1">
              <h3 className="font-semibold text-lg text-foreground">{title}</h3>
              {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-muted transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(85vh-80px)]">
          {children}
        </div>
      </motion.div>
    </div>
  );
}

export function SurahReader({ chapter, onBack }: SurahReaderProps) {
  const { i18n, t } = useTranslation();
  const baseLang = useMemo(
    () => (i18n.language || 'en').toLowerCase().split('-')[0],
    [i18n.language]
  );
  const translationId = useMemo(() => getTranslationIdForLanguage(baseLang), [baseLang]);
  
  const [verses, setVerses] = useState<AppVerse[]>([]);
  const [chapterInfo, setChapterInfo] = useState<ChapterInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [aboutOpen, setAboutOpen] = useState(false);
  const [wordByWordEnabled, setWordByWordEnabled] = useState(false);
  const [frenchWbwReady, setFrenchWbwReady] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [tafsirVerseKey, setTafsirVerseKey] = useState<string | null>(null);
  const [tafsirOpen, setTafsirOpen] = useState(false);

  const loadingRef = useRef(false);

  // Load French word-by-word data when language is French
  useEffect(() => {
    if (baseLang === 'fr') {
      loadFrenchWbw()
        .then(() => setFrenchWbwReady(true))
        .catch(() => setFrenchWbwReady(false));
    }
  }, [baseLang]);

  const loadVerses = useCallback(async (page: number, append: boolean = false) => {
    if (loadingRef.current) return;
    loadingRef.current = true;

    if (!append) setLoading(true);
    else setLoadingMore(true);

    setError(null);

    // Only use cached data for English to avoid serving stale word-by-word translations
    if (page === 1 && !append && baseLang === 'en') {
      const cached = getCachedVerses(chapter.id, translationId);
      if (cached && cached.length > 0) {
        setVerses(cached);
        setLoading(false);
        loadingRef.current = false;
      }
    }

    try {
      const result = await getVersesByChapter(chapter.id, {
        translationId,
        page,
        perPage: 50,
        language: baseLang,
      });

      // Build French WBW index for this chapter
      if (baseLang === 'fr' && result.verses.length > 0) {
        buildChapterWordIndex(chapter.id, result.verses);
      }

      if (append) setVerses(prev => [...prev, ...result.verses]);
      else {
        setVerses(result.verses);
        if (page === 1) setCachedVerses(chapter.id, translationId, result.verses);
      }

      setTotalPages(result.totalPages);
      setCurrentPage(result.currentPage);
    } catch {
      if (page === 1) {
        const stale = getStaleVerses(chapter.id, translationId);
        if (stale && stale.length > 0) {
          setVerses(stale);
          toast('Content temporarily unavailable. Showing cached version.');
        } else {
          setError('Unable to load verses. Please check your connection and try again.');
        }
      } else {
        toast('Unable to load more verses. Please try again.');
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
      loadingRef.current = false;
    }
  }, [chapter.id, translationId, baseLang]);

  const loadChapterInfo = useCallback(async () => {
    const cached = getCachedChapterInfo(chapter.id);
    if (cached) {
      setChapterInfo(cached);
      return;
    }

    try {
      const info = await getChapterInfo(chapter.id, baseLang);
      setChapterInfo(info);
      setCachedChapterInfo(chapter.id, info);
    } catch {
      const stale = getStaleChapterInfo(chapter.id);
      if (stale) setChapterInfo(stale);
    }
  }, [chapter.id, baseLang]);

  useEffect(() => {
    loadVerses(1);
    loadChapterInfo();
  }, [loadVerses, loadChapterInfo]);

  // Scroll to verse after verses load (for Continue Reading / Deep Link)
  useEffect(() => {
    if (verses.length === 0) return;
    
    const scrollTarget = sessionStorage.getItem('naja_scroll_to_verse');
    if (!scrollTarget) return;
    
    // Parse target verse number from verseKey (e.g., "2:152" -> 152)
    const [, verseNumStr] = scrollTarget.split(':');
    const targetVerseNum = parseInt(verseNumStr, 10);
    
    // Check if target verse is loaded
    const targetVerseLoaded = verses.some(v => v.verseNumber === targetVerseNum);
    
    if (!targetVerseLoaded && currentPage < totalPages && !loadingMore) {
      // Need to load more pages to reach target verse
      loadVerses(currentPage + 1, true);
      return; // Will re-run when more verses load
    }
    
    // Target verse should be loaded now (or we've loaded all pages)
    sessionStorage.removeItem('naja_scroll_to_verse');
    
    // Wait for DOM to render
    setTimeout(() => {
      const element = document.getElementById(`verse-${scrollTarget}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Add highlight effect
        element.classList.add('ring-2', 'ring-primary', 'ring-offset-2');
        setTimeout(() => {
          element.classList.remove('ring-2', 'ring-primary', 'ring-offset-2');
        }, 2000);
      }
    }, 300);
  }, [verses, currentPage, totalPages, loadingMore, loadVerses]);

  const handleLoadMore = () => {
    if (currentPage < totalPages && !loadingMore) loadVerses(currentPage + 1, true);
  };

  const handleTafsirRequest = (verseKey: string) => {
    setTafsirVerseKey(verseKey);
    setTafsirOpen(true);
  };

  const handleSetLastRead = (verseKey: string, verseNumber: number) => {
    setLastReadPosition(chapter.id, verseNumber, verseKey, chapter.nameSimple);
    toast(t('quran.readingPositionSaved'));
  };

  const revelationLabel = chapter.revelationPlace === 'makkah' ? t('quran.meccan') : t('quran.medinan');

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b">
        <div className="flex items-center justify-between p-4 max-w-3xl mx-auto">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="font-semibold text-foreground">{chapter.nameSimple}</h1>
              <p className="text-xs text-muted-foreground">{chapter.versesCount} {t('quran.verses')} · {revelationLabel}</p>
            </div>
          </div>

          {/* Word-by-word toggle */}
          <button
            onClick={() => setWordByWordEnabled(!wordByWordEnabled)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              wordByWordEnabled 
                ? 'bg-primary/20 text-primary' 
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            <Languages className="w-3.5 h-3.5" />
            {t('quran.wordByWord')}
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-2 sm:px-4 py-4 space-y-3">
        {/* Surah Header Card */}
        <Card className="p-6 text-center bg-gradient-to-b from-primary/5 to-transparent border-primary/20">
          <p className="font-arabic text-4xl text-foreground mb-2" dir="rtl" lang="ar">
            {chapter.nameArabic}
          </p>
          <h2 className="text-xl font-semibold text-foreground mb-1">
            {chapter.nameSimple}
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            {chapter.translatedName}
          </p>

          <div className="flex justify-center gap-8 text-sm mb-4">
            <div>
              <p className="text-muted-foreground">{t('quran.verses')}</p>
              <p className="font-semibold text-foreground">{chapter.versesCount}</p>
            </div>
            <div>
              <p className="text-muted-foreground">{t('quran.revealed')}</p>
              <p className="font-semibold text-foreground">{revelationLabel}</p>
            </div>
          </div>

          {/* About button - pill shaped at bottom of card */}
          <button
            onClick={() => setAboutOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
          >
            <Info className="w-4 h-4" />
            {t('quran.aboutSurah')}
          </button>
        </Card>

        {/* Loading */}
        {loading && verses.length === 0 && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-6 space-y-4">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-5/6" />
              </Card>
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => loadVerses(1)}>Try Again</Button>
          </Card>
        )}

        {/* Verses */}
        {!loading && !error && verses.length > 0 && (
          <div className="space-y-4">
            {verses.map((verse) => (
              <VerseCard
                key={verse.verseKey}
                verse={verse}
                chapterId={chapter.id}
                chapterName={chapter.nameSimple}
                onTafsirRequest={handleTafsirRequest}
                onLastReadSet={handleSetLastRead}
                showWordByWord={wordByWordEnabled}
                useFrenchWbw={baseLang === 'fr' && frenchWbwReady && isFrenchWbwLoaded()}
              />
            ))}

            {currentPage < totalPages && (
              <Button
                variant="outline"
                className="w-full"
                onClick={handleLoadMore}
                disabled={loadingMore}
              >
                {loadingMore ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  `Load more (${currentPage}/${totalPages})`
                )}
              </Button>
            )}
          </div>
        )}
      </div>

      {/* About this Surah (Popup Sheet) */}
      <AnimatePresence>
        {aboutOpen && (
          <Sheet
            open={aboutOpen}
            onClose={() => setAboutOpen(false)}
            title={`About ${chapter.nameSimple}`}
            subtitle={chapter.translatedName}
          >
            {!chapterInfo && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            )}

              {chapterInfo && (
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-foreground mb-3">{t('quran.summary')}</h4>
                  <div 
                    className="prose prose-sm max-w-none text-foreground/90 leading-relaxed
                      [&_p]:mb-4 [&_p]:last:mb-0
                      [&_h1]:text-lg [&_h1]:font-semibold [&_h1]:mb-2
                      [&_h2]:text-base [&_h2]:font-semibold [&_h2]:mb-2
                      [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:mb-2
                      [&_ul]:list-disc [&_ul]:pl-4 [&_ul]:my-2
                      [&_ol]:list-decimal [&_ol]:pl-4 [&_ol]:my-2
                      [&_li]:mb-1"
                    dangerouslySetInnerHTML={{ __html: sanitizeChapterHtml(chapterInfo.text) }}
                  />
                </div>

                {chapterInfo.source && (
                  <p className="text-xs text-muted-foreground border-t pt-4">
                    Source: {chapterInfo.source}
                  </p>
                )}
              </div>
            )}
          </Sheet>
        )}
      </AnimatePresence>

      {/* Tafsir Sheet */}
      <TafsirSheet
        open={tafsirOpen}
        onOpenChange={setTafsirOpen}
        verseKey={tafsirVerseKey}
      />
    </div>
  );
}
