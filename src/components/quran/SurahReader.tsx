import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Info, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { AppChapter, AppVerse, ChapterInfo, getVersesByChapter, getChapterInfo } from '@/services/quranApi';
import { 
  getCachedVerses, 
  setCachedVerses, 
  getCachedChapterInfo, 
  setCachedChapterInfo,
  getStaleVerses,
  getStaleChapterInfo 
} from '@/services/quranCache';
import { setLastReadPosition } from '@/services/quranReadingState';
import { VerseCard } from './VerseCard';
import { TafsirSheet } from './TafsirSheet';

interface SurahReaderProps {
  chapter: AppChapter;
  onBack: () => void;
}

const TRANSLATION_ID = 20; // Sahih International

export function SurahReader({ chapter, onBack }: SurahReaderProps) {
  const [verses, setVerses] = useState<AppVerse[]>([]);
  const [chapterInfo, setChapterInfo] = useState<ChapterInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [tafsirVerseKey, setTafsirVerseKey] = useState<string | null>(null);
  const [tafsirOpen, setTafsirOpen] = useState(false);
  
  const loadingRef = useRef(false);

  const loadVerses = useCallback(async (page: number, append: boolean = false) => {
    if (loadingRef.current) return;
    loadingRef.current = true;

    if (!append) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    setError(null);

    // Check cache for first page
    if (page === 1 && !append) {
      const cached = getCachedVerses(chapter.id, TRANSLATION_ID);
      if (cached && cached.length > 0) {
        setVerses(cached);
        setLoading(false);
        loadingRef.current = false;
        // Still fetch in background to update
      }
    }

    try {
      const result = await getVersesByChapter(chapter.id, {
        translationId: TRANSLATION_ID,
        page,
        perPage: 50,
      });

      if (append) {
        setVerses(prev => [...prev, ...result.verses]);
      } else {
        setVerses(result.verses);
        // Cache the first page results
        if (page === 1) {
          setCachedVerses(chapter.id, TRANSLATION_ID, result.verses);
        }
      }

      setTotalPages(result.totalPages);
      setCurrentPage(result.currentPage);
    } catch (err) {
      // Try stale cache on error
      if (page === 1) {
        const stale = getStaleVerses(chapter.id, TRANSLATION_ID);
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
  }, [chapter.id]);

  const loadChapterInfo = useCallback(async () => {
    // Check cache first
    const cached = getCachedChapterInfo(chapter.id);
    if (cached) {
      setChapterInfo(cached);
      return;
    }

    try {
      const info = await getChapterInfo(chapter.id);
      setChapterInfo(info);
      setCachedChapterInfo(chapter.id, info);
    } catch {
      // Try stale cache
      const stale = getStaleChapterInfo(chapter.id);
      if (stale) {
        setChapterInfo(stale);
      }
    }
  }, [chapter.id]);

  useEffect(() => {
    loadVerses(1);
    loadChapterInfo();
  }, [loadVerses, loadChapterInfo]);

  const handleLoadMore = () => {
    if (currentPage < totalPages && !loadingMore) {
      loadVerses(currentPage + 1, true);
    }
  };

  const handleTafsirRequest = (verseKey: string) => {
    setTafsirVerseKey(verseKey);
    setTafsirOpen(true);
  };

  const handleSetLastRead = (verseKey: string, verseNumber: number) => {
    setLastReadPosition(chapter.id, verseNumber, verseKey, chapter.nameSimple);
    toast('Reading position saved');
  };

  const revelationLabel = chapter.revelationPlace === 'makkah' ? 'Meccan' : 'Medinan';

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <button
          onClick={onBack}
          className="p-2 -ml-2 hover:bg-muted rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h2 className="font-semibold">{chapter.nameSimple}</h2>
          <p className="text-xs text-muted-foreground">{chapter.versesCount} verses</p>
        </div>
      </div>

      {/* Surah Header Card */}
      <Card className="p-6 text-center bg-gradient-to-br from-primary/5 to-accent/5">
        <h2 className="font-arabic text-3xl mb-2">{chapter.nameArabic}</h2>
        <h3 className="text-xl font-semibold mb-1">{chapter.nameSimple}</h3>
        <p className="text-sm text-muted-foreground mb-3">{chapter.translatedName}</p>
        
        <div className="flex justify-center gap-6 text-sm">
          <div>
            <p className="text-muted-foreground">Verses</p>
            <p className="font-bold">{chapter.versesCount}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Revealed in</p>
            <p className="font-bold">{revelationLabel}</p>
          </div>
        </div>

        {/* About this Surah toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowInfo(!showInfo)}
          className="mt-4"
        >
          <Info className="w-4 h-4 mr-1" />
          About this Surah
        </Button>

        {showInfo && chapterInfo && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="mt-4 text-left"
          >
            <div 
              className="text-sm text-muted-foreground leading-relaxed prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ 
                __html: chapterInfo.text.replace(/<[^>]*>/g, (tag) => {
                  // Allow only safe tags
                  if (tag.match(/^<\/?(?:p|br|strong|em|b|i)>/i)) {
                    return tag;
                  }
                  return '';
                })
              }}
            />
            {chapterInfo.source && (
              <p className="text-xs text-muted-foreground mt-2 italic">
                Source: {chapterInfo.source}
              </p>
            )}
          </motion.div>
        )}
      </Card>

      {/* Loading State */}
      {loading && verses.length === 0 && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-4 space-y-3">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </Card>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <Card className="p-6 text-center">
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => loadVerses(1)}>Try Again</Button>
        </Card>
      )}

      {/* Verses List */}
      {!loading && !error && verses.length > 0 && (
        <div className="space-y-3">
          {verses.map((verse) => (
            <VerseCard
              key={verse.verseKey}
              verse={verse}
              chapterId={chapter.id}
              chapterName={chapter.nameSimple}
              onTafsirRequest={handleTafsirRequest}
              onLastReadSet={handleSetLastRead}
            />
          ))}

          {/* Load More */}
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

      {/* Tafsir Sheet */}
      <TafsirSheet
        open={tafsirOpen}
        onOpenChange={setTafsirOpen}
        verseKey={tafsirVerseKey}
      />
    </div>
  );
}
