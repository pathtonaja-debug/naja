import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, ChevronLeft, Plus, Minus, Target, Trophy, 
  Star, Check, TrendingUp, Heart, Brain, Award, Search, X, ChevronRight
} from 'lucide-react';
import { TopBar } from '@/components/ui/top-bar';
import BottomNav from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useGuestProfile } from '@/hooks/useGuestProfile';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { BARAKAH_REWARDS } from '@/data/practiceItems';
import { SURAHS, FEATURED_AYAHS } from '@/data/quranData';

interface QuranProgress {
  todayPages: number;
  dailyGoal: number;
  totalPages: number;
  currentJuz: number;
  khatams: number;
  streak: number;
  history: Record<string, number>;
  hifdhJuz: number[];
  totalMemorized: number;
  readSurahs: number[];
}

const TOTAL_QURAN_PAGES = 604;
const PAGES_PER_JUZ = 20;
const TOTAL_JUZ = 30;

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
    streak: 0,
    history: {},
    hifdhJuz: [],
    totalMemorized: 0,
    readSurahs: [],
  });
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSurah, setSelectedSurah] = useState<typeof SURAHS[0] | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('naja_quran_progress_v2');
    if (stored) {
      const parsed = JSON.parse(stored);
      const today = new Date().toISOString().split('T')[0];
      if (!parsed.history[today]) {
        parsed.todayPages = 0;
      } else {
        parsed.todayPages = parsed.history[today];
      }
      setProgress(parsed);
    }
  }, []);

  const saveProgress = (newProgress: QuranProgress) => {
    setProgress(newProgress);
    localStorage.setItem('naja_quran_progress_v2', JSON.stringify(newProgress));
  };

  const addPage = () => {
    const today = new Date().toISOString().split('T')[0];
    const newTodayPages = progress.todayPages + 1;
    const newTotalPages = progress.totalPages + 1;
    const newCurrentJuz = Math.floor(newTotalPages / PAGES_PER_JUZ) + 1;
    let newKhatams = progress.khatams;

    if (newTotalPages > 0 && newTotalPages % TOTAL_QURAN_PAGES === 0) {
      newKhatams++;
      toast.success('SubhanAllah! Khatam completed', {
        description: `+${BARAKAH_REWARDS.QURAN_KHATAM} Barakah Points`
      });
      addBarakahPoints(BARAKAH_REWARDS.QURAN_KHATAM);
    } else {
      addBarakahPoints(BARAKAH_REWARDS.QURAN_PAGE);
      if (newTotalPages % PAGES_PER_JUZ === 0) {
        toast.success(`Juz ${newCurrentJuz - 1} completed`, {
          description: `+${BARAKAH_REWARDS.QURAN_JUZ} Barakah Points`
        });
        addBarakahPoints(BARAKAH_REWARDS.QURAN_JUZ);
      } else {
        toast.success(`+${BARAKAH_REWARDS.QURAN_PAGE} Barakah Points`);
      }
    }

    if (newTodayPages === progress.dailyGoal) {
      toast.success('Daily goal achieved! MashAllah');
    }

    saveProgress({
      ...progress,
      todayPages: newTodayPages,
      totalPages: newTotalPages,
      currentJuz: newCurrentJuz,
      khatams: newKhatams,
      history: { ...progress.history, [today]: newTodayPages },
    });

    if (navigator.vibrate) navigator.vibrate(15);
  };

  const removePage = () => {
    if (progress.todayPages <= 0) return;
    const today = new Date().toISOString().split('T')[0];
    const newTodayPages = progress.todayPages - 1;
    const newTotalPages = Math.max(0, progress.totalPages - 1);
    const newCurrentJuz = Math.floor(newTotalPages / PAGES_PER_JUZ) + 1;

    saveProgress({
      ...progress,
      todayPages: newTodayPages,
      totalPages: newTotalPages,
      currentJuz: newCurrentJuz,
      history: { ...progress.history, [today]: newTodayPages },
    });
  };

  const toggleHifdhJuz = (juz: number) => {
    const isMemorized = progress.hifdhJuz.includes(juz);
    let newHifdhJuz: number[];
    
    if (isMemorized) {
      newHifdhJuz = progress.hifdhJuz.filter(j => j !== juz);
    } else {
      newHifdhJuz = [...progress.hifdhJuz, juz];
      toast.success(`Juz ${juz} marked as memorized`, {
        description: `+${BARAKAH_REWARDS.QURAN_JUZ} Barakah Points`
      });
      addBarakahPoints(BARAKAH_REWARDS.QURAN_JUZ);
    }

    saveProgress({
      ...progress,
      hifdhJuz: newHifdhJuz,
      totalMemorized: newHifdhJuz.length * PAGES_PER_JUZ,
    });
  };

  const toggleSurahRead = (surahNumber: number) => {
    const isRead = progress.readSurahs.includes(surahNumber);
    let newReadSurahs: number[];
    
    if (isRead) {
      newReadSurahs = progress.readSurahs.filter(s => s !== surahNumber);
    } else {
      newReadSurahs = [...progress.readSurahs, surahNumber];
      toast.success(`Surah marked as read`, {
        description: `+${BARAKAH_REWARDS.QURAN_PAGE} Barakah Points`
      });
      addBarakahPoints(BARAKAH_REWARDS.QURAN_PAGE);
    }

    saveProgress({
      ...progress,
      readSurahs: newReadSurahs,
    });
  };

  const updateGoal = (newGoal: number) => {
    saveProgress({ ...progress, dailyGoal: newGoal });
    setShowGoalModal(false);
    toast.success(`Daily goal set to ${newGoal} pages`);
  };

  const filteredSurahs = SURAHS.filter(surah => 
    surah.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    surah.arabicName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    surah.number.toString().includes(searchQuery)
  );

  const todayProgress = progress.dailyGoal > 0 
    ? Math.min((progress.todayPages / progress.dailyGoal) * 100, 100) 
    : 0;
  const khatamProgress = ((progress.totalPages % TOTAL_QURAN_PAGES) / TOTAL_QURAN_PAGES) * 100;
  const hifdhProgress = (progress.hifdhJuz.length / TOTAL_JUZ) * 100;
  const surahProgress = (progress.readSurahs.length / 114) * 100;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background pb-24"
    >
      <TopBar 
        title="Qur'an" 
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
            { id: 'surahs', label: 'Surahs', icon: Search },
            { id: 'hifdh', label: 'Hifdh', icon: Brain },
            { id: 'khatam', label: 'Khatam', icon: Award },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
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

      {/* Reading Tab */}
      {activeTab === 'reading' && (
        <div className="px-4 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-2xl bg-gradient-to-br from-success/20 to-accent/10 border border-success/20"
          >
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
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={removePage}
                  disabled={progress.todayPages <= 0}
                  className="w-12 h-12 rounded-full bg-card flex items-center justify-center shadow-sm disabled:opacity-30"
                >
                  <Minus className="w-5 h-5" />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={addPage}
                  className="w-16 h-16 rounded-full bg-success flex items-center justify-center shadow-lg text-white"
                >
                  <Plus className="w-7 h-7" />
                </motion.button>
              </div>
            </div>

            <div className="space-y-1">
              <div className="h-3 bg-card/50 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${todayProgress}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full bg-success rounded-full"
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{Math.round(todayProgress)}% of daily goal</span>
                <button onClick={() => setShowGoalModal(true)} className="text-success font-medium">
                  Change goal
                </button>
              </div>
            </div>

            {progress.todayPages >= progress.dailyGoal && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-3 p-2 rounded-lg bg-success/20 flex items-center gap-2 justify-center"
              >
                <Check className="w-4 h-4 text-success" />
                <span className="text-sm font-medium">Daily goal achieved!</span>
              </motion.div>
            )}
          </motion.div>

          {/* Featured Ayah */}
          <Card className="p-4">
            <h3 className="text-xs font-semibold text-muted-foreground mb-2">FEATURED AYAH</h3>
            <p className="text-lg font-arabic text-right leading-loose mb-2">
              {FEATURED_AYAHS[0].arabic}
            </p>
            <p className="text-sm text-muted-foreground italic">
              "{FEATURED_AYAHS[0].text}"
            </p>
            <p className="text-xs text-primary mt-2">— Surah {FEATURED_AYAHS[0].surah}:{FEATURED_AYAHS[0].verse}</p>
          </Card>

          {/* Stats Cards */}
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
        </div>
      )}

      {/* Surahs Browser Tab */}
      {activeTab === 'surahs' && !selectedSurah && (
        <div className="px-4 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search surahs..."
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
              <span className="text-sm font-medium">Surahs Read</span>
              <span className="text-lg font-bold text-primary">{progress.readSurahs.length}/114</span>
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
            {filteredSurahs.map((surah) => {
              const isRead = progress.readSurahs.includes(surah.number);
              return (
                <motion.div key={surah.number} whileTap={{ scale: 0.98 }}>
                  <Card 
                    className={cn(
                      "p-3 cursor-pointer transition-all",
                      isRead && "bg-primary/5 border-primary/20"
                    )}
                    onClick={() => setSelectedSurah(surah)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm",
                        isRead ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                      )}>
                        {surah.number}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-sm">{surah.name}</h4>
                          {isRead && <Check className="w-3.5 h-3.5 text-primary" />}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {surah.verses} verses • {surah.revelationType}
                        </p>
                      </div>
                      <p className="font-arabic text-lg">{surah.arabicName}</p>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Surah Detail View */}
      {activeTab === 'surahs' && selectedSurah && (
        <div className="px-4 space-y-4">
          <button
            onClick={() => setSelectedSurah(null)}
            className="flex items-center gap-1 text-sm text-muted-foreground"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Surahs
          </button>

          <Card className="p-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary">{selectedSurah.number}</span>
            </div>
            <h2 className="font-arabic text-3xl mb-2">{selectedSurah.arabicName}</h2>
            <h3 className="text-xl font-bold mb-1">{selectedSurah.name}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {selectedSurah.meaning}
            </p>
            
            <div className="flex justify-center gap-6 text-sm">
              <div>
                <p className="text-muted-foreground">Verses</p>
                <p className="font-bold">{selectedSurah.verses}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Revealed in</p>
                <p className="font-bold">{selectedSurah.revelationType}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Juz</p>
                <p className="font-bold">{selectedSurah.juz.join(', ')}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <h4 className="font-semibold mb-2">About this Surah</h4>
            <p className="text-sm text-muted-foreground">
              {selectedSurah.name} ({selectedSurah.meaning}) is the {selectedSurah.number}th surah of the Quran, 
              containing {selectedSurah.verses} verses. It was revealed in {selectedSurah.revelationType === 'Meccan' ? 'Mecca' : 'Medina'}.
            </p>
          </Card>

          <Button
            onClick={() => toggleSurahRead(selectedSurah.number)}
            className="w-full"
            variant={progress.readSurahs.includes(selectedSurah.number) ? "secondary" : "default"}
          >
            {progress.readSurahs.includes(selectedSurah.number) ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Marked as Read
              </>
            ) : (
              <>
                <BookOpen className="w-4 h-4 mr-2" />
                Mark as Read
              </>
            )}
          </Button>
        </div>
      )}

      {/* Hifdh Tab */}
      {activeTab === 'hifdh' && (
        <div className="px-4 space-y-4">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-semibold">Memorization Progress</p>
                <p className="text-xs text-muted-foreground">
                  {progress.hifdhJuz.length} / {TOTAL_JUZ} Juz memorized
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold">{Math.round(hifdhProgress)}%</p>
              </div>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${hifdhProgress}%` }}
                className="h-full bg-primary rounded-full"
              />
            </div>
          </Card>

          <div>
            <h3 className="text-sm font-semibold mb-3">Mark Juz as Memorized</h3>
            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: TOTAL_JUZ }, (_, i) => i + 1).map((juz) => {
                const isMemorized = progress.hifdhJuz.includes(juz);
                return (
                  <motion.button
                    key={juz}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => toggleHifdhJuz(juz)}
                    className={cn(
                      "aspect-square rounded-xl flex flex-col items-center justify-center transition-all",
                      isMemorized
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {isMemorized ? (
                      <Heart className="w-4 h-4 fill-current" />
                    ) : (
                      <span className="text-sm font-medium">{juz}</span>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>

          <p className="text-xs text-muted-foreground text-center italic">
            Tap a Juz number to mark it as memorized. May Allah make it easy for you.
          </p>
        </div>
      )}

      {/* Khatam Tab */}
      {activeTab === 'khatam' && (
        <div className="px-4 space-y-4">
          <Card className="p-6 text-center">
            <div className="w-24 h-24 rounded-full bg-warn/20 flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-12 h-12 text-warn" />
            </div>
            <p className="text-4xl font-bold mb-1">{progress.khatams}</p>
            <p className="text-sm text-muted-foreground">Complete Quran Readings</p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-semibold">Current Khatam Progress</p>
                <p className="text-xs text-muted-foreground">
                  {progress.totalPages % TOTAL_QURAN_PAGES} / {TOTAL_QURAN_PAGES} pages
                </p>
              </div>
              <p className="text-lg font-bold">{Math.round(khatamProgress)}%</p>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${khatamProgress}%` }}
                className="h-full bg-success rounded-full"
              />
            </div>
          </Card>

          {/* Milestones */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Reading Milestones</h3>
            <div className="grid grid-cols-3 gap-2">
              {[1, 5, 10, 15, 20, 30].map(juz => {
                const achieved = progress.currentJuz > juz || progress.khatams > 0;
                return (
                  <Card key={juz} className={cn(
                    "p-3 text-center",
                    achieved && "bg-success/10 border-success/20"
                  )}>
                    {achieved ? (
                      <Star className="w-5 h-5 text-success mx-auto mb-1 fill-success" />
                    ) : (
                      <Star className="w-5 h-5 text-muted-foreground/30 mx-auto mb-1" />
                    )}
                    <p className={cn(
                      "text-xs font-medium",
                      achieved ? "text-success" : "text-muted-foreground"
                    )}>
                      Juz {juz}
                    </p>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Niyyah disclaimer */}
      <p className="text-xs text-muted-foreground text-center italic px-8 pt-4">
        Your niyyah is what matters — tracking is just a tool to help you stay consistent.
      </p>

      {/* Goal Modal */}
      <AnimatePresence>
        {showGoalModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={() => setShowGoalModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm bg-background rounded-2xl p-6"
              onClick={e => e.stopPropagation()}
            >
              <h2 className="text-lg font-bold text-center mb-4">Set Daily Goal</h2>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 5, 10, 15, 20, 30].map(goal => (
                  <button
                    key={goal}
                    onClick={() => updateGoal(goal)}
                    className={cn(
                      "p-3 rounded-xl text-center font-medium transition-all",
                      progress.dailyGoal === goal
                        ? "bg-success text-white"
                        : "bg-muted"
                    )}
                  >
                    {goal}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground text-center mt-3">pages per day</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav />
    </motion.div>
  );
};

export default Quran;
