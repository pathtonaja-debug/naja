import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, X, Check, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { AppChapter, getChapters } from '@/services/quranApi';
import { getCachedChapters, setCachedChapters, getStaleChapters } from '@/services/quranCache';

interface SurahListProps {
  onSelectSurah: (chapter: AppChapter) => void;
  readSurahs: number[];
}

export function SurahList({ onSelectSurah, readSurahs }: SurahListProps) {
  const { t } = useTranslation();
  const [chapters, setChapters] = useState<AppChapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadChapters = async () => {
      setLoading(true);
      setError(null);

      // Check cache first
      const cached = getCachedChapters();
      if (cached && cached.length > 0) {
        setChapters(cached);
        setLoading(false);
        return;
      }

      try {
        const data = await getChapters();
        setChapters(data);
        setCachedChapters(data);
      } catch (err) {
        // Try stale cache
        const stale = getStaleChapters();
        if (stale && stale.length > 0) {
          setChapters(stale);
        } else {
          setError('Unable to load surahs. Please check your connection.');
        }
      } finally {
        setLoading(false);
      }
    };

    loadChapters();
  }, []);

  const filteredChapters = chapters.filter(ch =>
    ch.nameSimple.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ch.nameArabic.includes(searchQuery) ||
    ch.translatedName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ch.id.toString() === searchQuery
  );

  const surahProgress = chapters.length > 0 
    ? Math.round((readSurahs.length / chapters.length) * 100) 
    : 0;

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-20 w-full" />
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6 text-center">
        <p className="text-muted-foreground">{error}</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder={t('quran.searchSurahs')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Progress Summary */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">{t('quran.surahsRead')}</span>
          <span className="text-lg font-bold text-primary">{readSurahs.length}/114</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${surahProgress}%` }}
            className="h-full bg-primary rounded-full"
          />
        </div>
      </Card>

      {/* Surah List */}
      <div className="space-y-2">
        {filteredChapters.map((chapter) => {
          const isRead = readSurahs.includes(chapter.id);
          const revelationLabel = chapter.revelationPlace === 'makkah' ? t('quran.meccan') : t('quran.medinan');
          
          return (
            <motion.div key={chapter.id} whileTap={{ scale: 0.98 }}>
              <Card
                className={cn(
                  "p-3 cursor-pointer transition-all hover:shadow-md",
                  isRead && "bg-primary/5 border-primary/20"
                )}
                onClick={() => onSelectSurah(chapter)}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm",
                    isRead ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  )}>
                    {chapter.id}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-sm truncate">{chapter.nameSimple}</h4>
                      {isRead && <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" />}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {chapter.versesCount} {t('quran.verses')} • {revelationLabel}
                    </p>
                  </div>
                  <p className="font-arabic text-lg">{chapter.nameArabic}</p>
                  <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                </div>
              </Card>
            </motion.div>
          );
        })}

        {filteredChapters.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            No surahs found matching "{searchQuery}"
          </p>
        )}
      </div>
    </div>
  );
}
