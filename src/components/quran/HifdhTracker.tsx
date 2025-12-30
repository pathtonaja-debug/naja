import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, Check, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { AppChapter, getChapters } from '@/services/quranApi';
import { getCachedChapters, setCachedChapters } from '@/services/quranCache';
import { 
  getSurahHifdhStats, 
  getTotalHifdhStats, 
  HifdhStatus, 
  setRangeHifdhStatus,
  getHifdhByChapter,
  SurahHifdhStats 
} from '@/services/quranHifdhState';
import { toast } from 'sonner';

interface HifdhTrackerProps {
  onSelectSurah?: (chapter: AppChapter) => void;
}

export function HifdhTracker({ onSelectSurah }: HifdhTrackerProps) {
  const [chapters, setChapters] = useState<AppChapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChapter, setSelectedChapter] = useState<AppChapter | null>(null);
  const [surahStats, setSurahStats] = useState<Map<number, SurahHifdhStats>>(new Map());
  const [totalStats, setTotalStats] = useState({ memorizing: 0, solid: 0, total: 0 });

  useEffect(() => {
    const loadChapters = async () => {
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
      } catch {
        // Use empty if failed
      } finally {
        setLoading(false);
      }
    };

    loadChapters();
  }, []);

  useEffect(() => {
    if (chapters.length === 0) return;

    const stats = new Map<number, SurahHifdhStats>();
    for (const ch of chapters) {
      stats.set(ch.id, getSurahHifdhStats(ch.id, ch.versesCount));
    }
    setSurahStats(stats);
    setTotalStats(getTotalHifdhStats());
  }, [chapters, selectedChapter]);

  const handleMarkRange = (status: HifdhStatus) => {
    if (!selectedChapter) return;
    setRangeHifdhStatus(selectedChapter.id, 1, selectedChapter.versesCount, status);
    
    // Refresh stats
    const newStats = new Map(surahStats);
    newStats.set(selectedChapter.id, getSurahHifdhStats(selectedChapter.id, selectedChapter.versesCount));
    setSurahStats(newStats);
    setTotalStats(getTotalHifdhStats());
    
    if (status === 'solid') {
      toast('Surah marked as memorized. MashAllah!');
    } else if (status === 'memorizing') {
      toast('Surah marked as in progress');
    } else {
      toast('Progress cleared');
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-24 w-full" />
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  // Surah Detail View
  if (selectedChapter) {
    const stats = surahStats.get(selectedChapter.id) || { total: 0, memorizing: 0, solid: 0, percentComplete: 0 };
    const verseStatuses = getHifdhByChapter(selectedChapter.id);

    return (
      <div className="space-y-4">
        <button
          onClick={() => setSelectedChapter(null)}
          className="flex items-center gap-1 text-sm text-muted-foreground"
        >
          <ChevronRight className="w-4 h-4 rotate-180" />
          Back to Hifdh
        </button>

        <Card className="p-6">
          <div className="text-center mb-4">
            <h3 className="font-arabic text-2xl mb-1">{selectedChapter.nameArabic}</h3>
            <p className="font-semibold">{selectedChapter.nameSimple}</p>
            <p className="text-sm text-muted-foreground">{selectedChapter.versesCount} verses</p>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between text-sm">
              <span className="text-success">Solid: {stats.solid}</span>
              <span className="text-warn">Memorizing: {stats.memorizing}</span>
              <span className="text-muted-foreground">Remaining: {stats.total - stats.solid - stats.memorizing}</span>
            </div>
            <Progress value={stats.percentComplete} className="h-3" />
            <p className="text-center text-sm text-muted-foreground">
              {stats.percentComplete}% complete
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => handleMarkRange('memorizing')}
              className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium text-warn border border-warn/30 hover:bg-warn/10 transition-colors"
            >
              Mark All Memorizing
            </button>
            <button
              onClick={() => handleMarkRange('solid')}
              className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium text-success border border-success/30 hover:bg-success/10 transition-colors"
            >
              Mark All Solid
            </button>
            <button
              onClick={() => handleMarkRange('none')}
              className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium text-muted-foreground border border-border hover:bg-muted transition-colors"
            >
              Clear All
            </button>
          </div>
        </Card>

        {/* Verse Grid */}
        <Card className="p-4">
          <h4 className="text-sm font-medium mb-3">Verse Status</h4>
          <div className="grid grid-cols-10 gap-1">
            {Array.from({ length: selectedChapter.versesCount }, (_, i) => {
              const verseNum = i + 1;
              const status = verseStatuses.get(verseNum) || 'none';
              
              return (
                <div
                  key={verseNum}
                  className={cn(
                    "w-6 h-6 rounded text-xs flex items-center justify-center font-medium",
                    status === 'none' && "bg-muted text-muted-foreground",
                    status === 'memorizing' && "bg-warn/20 text-warn",
                    status === 'solid' && "bg-success/20 text-success"
                  )}
                  title={`Verse ${verseNum}: ${status}`}
                >
                  {verseNum}
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    );
  }

  // Main Hifdh List
  const totalVerses = 6236; // Total verses in Quran
  const overallProgress = Math.round((totalStats.solid / totalVerses) * 100);

  return (
    <div className="space-y-4">
      {/* Overall Stats */}
      <Card className="p-4 bg-gradient-to-br from-success/10 to-accent/5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center">
            <Brain className="w-6 h-6 text-success" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Memorized</p>
            <p className="text-2xl font-bold">{totalStats.solid} <span className="text-sm font-normal text-muted-foreground">/ 6236 verses</span></p>
          </div>
        </div>
        <Progress value={overallProgress} className="h-2" />
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>{totalStats.memorizing} in progress</span>
          <span>{overallProgress}% complete</span>
        </div>
      </Card>

      <p className="text-xs text-muted-foreground text-center px-4">
        Your niyyah is what matters - points are just a tool to help you stay consistent.
      </p>

      {/* Surah List with Progress */}
      <div className="space-y-2">
        {chapters.map((chapter) => {
          const stats = surahStats.get(chapter.id) || { total: 0, memorizing: 0, solid: 0, percentComplete: 0 };
          const hasProgress = stats.memorizing > 0 || stats.solid > 0;
          
          return (
            <motion.div key={chapter.id} whileTap={{ scale: 0.98 }}>
              <Card
                className={cn(
                  "p-3 cursor-pointer transition-all",
                  stats.percentComplete === 100 && "bg-success/5 border-success/20"
                )}
                onClick={() => setSelectedChapter(chapter)}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm",
                    stats.percentComplete === 100 
                      ? "bg-success text-success-foreground" 
                      : hasProgress 
                        ? "bg-warn/20 text-warn" 
                        : "bg-muted text-muted-foreground"
                  )}>
                    {stats.percentComplete === 100 ? <Check className="w-5 h-5" /> : chapter.id}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-sm truncate">{chapter.nameSimple}</h4>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Progress value={stats.percentComplete} className="h-1.5 flex-1" />
                      <span className="text-xs text-muted-foreground w-10 text-right">
                        {stats.percentComplete}%
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
