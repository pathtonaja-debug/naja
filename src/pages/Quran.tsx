import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ChevronLeft, Plus, Minus, Target, Trophy, Brain, Award, BookMarked } from 'lucide-react';
import { TopBar } from '@/components/ui/top-bar';
import BottomNav from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useGuestProfile } from '@/hooks/useGuestProfile';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { BARAKAH_REWARDS } from '@/data/practiceItems';
import { AppChapter } from '@/services/quranApi';
import { getLastReadPosition, getBookmarks, Bookmark, LastReadPosition } from '@/services/quranReadingState';
import { SurahList } from '@/components/quran/SurahList';
import { SurahReader } from '@/components/quran/SurahReader';
import { HifdhTracker } from '@/components/quran/HifdhTracker';

interface QuranProgress {
  todayPages: number;
  dailyGoal: number;
  totalPages: number;
  currentJuz: number;
  khatams: number;
  readSurahs: number[];
}

const TOTAL_QURAN_PAGES = 604;
const PAGES_PER_JUZ = 20;

const Quran = () => {
  const navigate = useNavigate();
  const { addBarakahPoints } = useGuestProfile();
  const [activeTab, setActiveTab] = useState<'reading' | 'surahs' | 'hifdh' | 'khatam'>('reading');
  const [progress, setProgress] = useState<QuranProgress>({
    todayPages: 0,
    dailyGoal: 5,
    totalPages: 0,
    currentJuz: 1,
    khatams: 0,
    readSurahs: [],
  });
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState<AppChapter | null>(null);
  const [lastRead, setLastRead] = useState<LastReadPosition | null>(null);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('naja_quran_progress_v2');
    if (stored) {
      const parsed = JSON.parse(stored);
      const today = new Date().toISOString().split('T')[0];
      if (!parsed.history?.[today]) {
        parsed.todayPages = 0;
      } else {
        parsed.todayPages = parsed.history[today];
      }
      setProgress(parsed);
    }
    
    setLastRead(getLastReadPosition());
    setBookmarks(getBookmarks());
  }, []);

  const saveProgress = (newProgress: QuranProgress) => {
    setProgress(newProgress);
    const today = new Date().toISOString().split('T')[0];
    const withHistory = {
      ...newProgress,
      history: { ...(progress as any).history, [today]: newProgress.todayPages }
    };
    localStorage.setItem('naja_quran_progress_v2', JSON.stringify(withHistory));
  };

  const addPage = () => {
    const newTodayPages = progress.todayPages + 1;
    const newTotalPages = progress.totalPages + 1;
    const newCurrentJuz = Math.floor(newTotalPages / PAGES_PER_JUZ) + 1;
    let newKhatams = progress.khatams;

    if (newTotalPages > 0 && newTotalPages % TOTAL_QURAN_PAGES === 0) {
      newKhatams++;
      toast('Khatam completed. MashAllah!');
      addBarakahPoints(BARAKAH_REWARDS.QURAN_KHATAM);
    } else {
      addBarakahPoints(BARAKAH_REWARDS.QURAN_PAGE);
      if (newTotalPages % PAGES_PER_JUZ === 0) {
        toast(`Juz ${newCurrentJuz - 1} completed`);
        addBarakahPoints(BARAKAH_REWARDS.QURAN_JUZ);
      }
    }

    if (newTodayPages === progress.dailyGoal) {
      toast('Daily goal achieved. MashAllah!');
    }

    saveProgress({
      ...progress,
      todayPages: newTodayPages,
      totalPages: newTotalPages,
      currentJuz: newCurrentJuz,
      khatams: newKhatams,
    });

    if (navigator.vibrate) navigator.vibrate(15);
  };

  const removePage = () => {
    if (progress.todayPages <= 0) return;
    const newTodayPages = progress.todayPages - 1;
    const newTotalPages = Math.max(0, progress.totalPages - 1);
    const newCurrentJuz = Math.floor(newTotalPages / PAGES_PER_JUZ) + 1;

    saveProgress({
      ...progress,
      todayPages: newTodayPages,
      totalPages: newTotalPages,
      currentJuz: newCurrentJuz,
    });
  };

  const updateGoal = (newGoal: number) => {
    saveProgress({ ...progress, dailyGoal: newGoal });
    setShowGoalModal(false);
    toast(`Daily goal set to ${newGoal} pages`);
  };

  const handleSurahSelect = (chapter: AppChapter) => {
    setSelectedChapter(chapter);
  };

  const handleBackFromReader = () => {
    setSelectedChapter(null);
    setBookmarks(getBookmarks());
    setLastRead(getLastReadPosition());
  };

  const todayProgress = progress.dailyGoal > 0 
    ? Math.min((progress.todayPages / progress.dailyGoal) * 100, 100) 
    : 0;
  const khatamProgress = ((progress.totalPages % TOTAL_QURAN_PAGES) / TOTAL_QURAN_PAGES) * 100;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background pb-24"
    >
      <TopBar 
        title="Quran" 
        leftElement={
          <button onClick={() => navigate(-1)} className="p-2 -ml-2">
            <ChevronLeft className="w-5 h-5" />
          </button>
        }
      />

      {/* Tab Selector */}
      <div className="px-4 pb-4">
        <div className="flex gap-1 p-1 bg-muted rounded-xl">
          {[
            { id: 'reading', label: 'Read', icon: BookOpen },
            { id: 'surahs', label: 'Surahs', icon: BookMarked },
            { id: 'hifdh', label: 'Hifdh', icon: Brain },
            { id: 'khatam', label: 'Khatam', icon: Award },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id as any); setSelectedChapter(null); }}
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all",
                activeTab === tab.id
                  ? "bg-card shadow-sm text-foreground"
                  : "text-muted-foreground"
              )}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4">
        {/* Reading Tab */}
        {activeTab === 'reading' && (
          <div className="space-y-4">
            {/* Continue Reading */}
            {lastRead && (
              <Card 
                className="p-4 cursor-pointer hover:shadow-md transition-all active:scale-[0.99]"
                onClick={() => {
                  // Navigate to the surah reader with the chapter and scroll target
                  const chapterData: AppChapter = { 
                    id: lastRead.chapterId, 
                    nameSimple: lastRead.chapterName || `Surah ${lastRead.chapterId}`,
                    nameArabic: '',
                    translatedName: '',
                    revelationPlace: 'makkah',
                    versesCount: 0,
                    pages: []
                  };
                  setSelectedChapter(chapterData);
                  // Store scroll target in sessionStorage for SurahReader to pick up
                  sessionStorage.setItem('naja_scroll_to_verse', lastRead.verseKey);
                  setActiveTab('surahs');
                }}
              >
                <p className="text-xs text-muted-foreground mb-1">Continue Reading</p>
                <p className="font-medium">{lastRead.chapterName || `Surah ${lastRead.chapterId}`}</p>
                <p className="text-sm text-primary">Verse {lastRead.verseNumber}</p>
              </Card>
            )}

            {/* Page Counter */}
            <Card className="p-6 bg-gradient-to-br from-success/20 to-accent/10 border-success/20">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Today's Reading</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">{progress.todayPages}</span>
                    <span className="text-lg text-muted-foreground">/ {progress.dailyGoal}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">pages</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={removePage}
                    disabled={progress.todayPages <= 0}
                    className="w-12 h-12 rounded-full bg-card flex items-center justify-center shadow-sm disabled:opacity-30"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <button
                    onClick={addPage}
                    className="w-16 h-16 rounded-full bg-success flex items-center justify-center shadow-lg text-white"
                  >
                    <Plus className="w-7 h-7" />
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <div className="h-3 bg-card/50 rounded-full overflow-hidden">
                  <div style={{ width: `${todayProgress}%` }} className="h-full bg-success rounded-full transition-all" />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{Math.round(todayProgress)}% of daily goal</span>
                  <button onClick={() => setShowGoalModal(true)} className="text-success font-medium">
                    Change goal
                  </button>
                </div>
              </div>
            </Card>

            {/* Bookmarks */}
            {bookmarks.length > 0 && (
              <Card className="p-4">
                <h3 className="text-sm font-medium mb-3">Bookmarks</h3>
                <div className="space-y-2">
                  {bookmarks.slice(0, 5).map((bm) => (
                    <div key={bm.verseKey} className="flex items-center justify-between text-sm">
                      <span>{bm.chapterName || `Surah ${bm.chapterId}`}</span>
                      <span className="text-muted-foreground">{bm.verseKey}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="w-4 h-4 text-secondary" />
                  <span className="text-xs text-muted-foreground">Total Pages</span>
                </div>
                <p className="text-2xl font-bold">{progress.totalPages}</p>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="w-4 h-4 text-warn" />
                  <span className="text-xs text-muted-foreground">Khatams</span>
                </div>
                <p className="text-2xl font-bold">{progress.khatams}</p>
              </Card>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              Your niyyah is what matters - points are just a tool to help you stay consistent.
            </p>
          </div>
        )}

        {/* Surahs Tab */}
        {activeTab === 'surahs' && !selectedChapter && (
          <SurahList 
            onSelectSurah={handleSurahSelect} 
            readSurahs={progress.readSurahs} 
          />
        )}

        {activeTab === 'surahs' && selectedChapter && (
          <SurahReader chapter={selectedChapter} onBack={handleBackFromReader} />
        )}

        {/* Hifdh Tab */}
        {activeTab === 'hifdh' && (
          <HifdhTracker onSelectSurah={handleSurahSelect} />
        )}

        {/* Khatam Tab */}
        {activeTab === 'khatam' && (
          <div className="space-y-4">
            <Card className="p-6 text-center">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Award className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-1">{progress.khatams}</h3>
              <p className="text-muted-foreground">Khatams Completed</p>
            </Card>

            <Card className="p-4">
              <h4 className="text-sm font-medium mb-3">Current Progress</h4>
              <div className="h-3 bg-muted rounded-full overflow-hidden mb-2">
                <div style={{ width: `${khatamProgress}%` }} className="h-full bg-primary rounded-full" />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{progress.totalPages % TOTAL_QURAN_PAGES} / {TOTAL_QURAN_PAGES} pages</span>
                <span>{Math.round(khatamProgress)}%</span>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Goal Modal */}
      {showGoalModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="p-6 w-full max-w-sm">
            <h3 className="font-semibold mb-4">Set Daily Goal</h3>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {[1, 3, 5, 10].map((g) => (
                <Button key={g} variant={progress.dailyGoal === g ? "default" : "outline"} onClick={() => updateGoal(g)}>
                  {g}
                </Button>
              ))}
            </div>
            <Button variant="ghost" className="w-full" onClick={() => setShowGoalModal(false)}>Cancel</Button>
          </Card>
        </div>
      )}

      <BottomNav />
    </motion.div>
  );
};

export default Quran;
