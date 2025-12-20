import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, ChevronLeft, Plus, Minus, Target, Trophy, 
  Star, Flame, Check, TrendingUp
} from 'lucide-react';
import { TopBar } from '@/components/ui/top-bar';
import BottomNav from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { useGuestProfile } from '@/hooks/useGuestProfile';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { BARAKAH_REWARDS } from '@/data/practiceItems';

interface QuranProgress {
  todayPages: number;
  dailyGoal: number;
  totalPages: number;
  currentJuz: number;
  khatams: number;
  streak: number;
  history: Record<string, number>;
}

const TOTAL_QURAN_PAGES = 604;
const PAGES_PER_JUZ = 20;

const Quran = () => {
  const navigate = useNavigate();
  const { addBarakahPoints } = useGuestProfile();
  const [progress, setProgress] = useState<QuranProgress>({
    todayPages: 0,
    dailyGoal: 5,
    totalPages: 0,
    currentJuz: 1,
    khatams: 0,
    streak: 0,
    history: {},
  });
  const [showGoalModal, setShowGoalModal] = useState(false);

  useEffect(() => {
    // Load from localStorage
    const stored = localStorage.getItem('naja_quran_progress');
    if (stored) {
      const parsed = JSON.parse(stored);
      const today = new Date().toISOString().split('T')[0];
      
      // Reset today's count if it's a new day
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
    localStorage.setItem('naja_quran_progress', JSON.stringify(newProgress));
  };

  const addPage = () => {
    const today = new Date().toISOString().split('T')[0];
    const newTodayPages = progress.todayPages + 1;
    const newTotalPages = progress.totalPages + 1;
    const newCurrentJuz = Math.floor(newTotalPages / PAGES_PER_JUZ) + 1;
    let newKhatams = progress.khatams;

    // Check for Khatam
    if (newTotalPages > 0 && newTotalPages % TOTAL_QURAN_PAGES === 0) {
      newKhatams++;
      toast.success('SubhanAllah! Khatam completed! 🎉', {
        description: `+${BARAKAH_REWARDS.QURAN_KHATAM} Barakah Points`
      });
      addBarakahPoints(BARAKAH_REWARDS.QURAN_KHATAM);
    } else {
      // Regular page points
      addBarakahPoints(BARAKAH_REWARDS.QURAN_PAGE);
      
      // Check for Juz milestone
      if (newTotalPages % PAGES_PER_JUZ === 0) {
        toast.success(`Juz ${newCurrentJuz - 1} completed! 📖`, {
          description: `+${BARAKAH_REWARDS.QURAN_JUZ} Barakah Points`
        });
        addBarakahPoints(BARAKAH_REWARDS.QURAN_JUZ);
      } else {
        toast.success(`+${BARAKAH_REWARDS.QURAN_PAGE} Barakah Points ✨`);
      }
    }

    // Check if goal met
    if (newTodayPages === progress.dailyGoal) {
      toast.success('Daily goal achieved! MashAllah! 🌟');
    }

    saveProgress({
      ...progress,
      todayPages: newTodayPages,
      totalPages: newTotalPages,
      currentJuz: newCurrentJuz,
      khatams: newKhatams,
      history: {
        ...progress.history,
        [today]: newTodayPages,
      },
    });

    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(15);
    }
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
      history: {
        ...progress.history,
        [today]: newTodayPages,
      },
    });
  };

  const updateGoal = (newGoal: number) => {
    saveProgress({ ...progress, dailyGoal: newGoal });
    setShowGoalModal(false);
    toast.success(`Daily goal set to ${newGoal} pages`);
  };

  const todayProgress = progress.dailyGoal > 0 
    ? Math.min((progress.todayPages / progress.dailyGoal) * 100, 100) 
    : 0;

  const juzProgress = ((progress.totalPages % PAGES_PER_JUZ) / PAGES_PER_JUZ) * 100;
  const khatamProgress = ((progress.totalPages % TOTAL_QURAN_PAGES) / TOTAL_QURAN_PAGES) * 100;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-pastel-cream pb-24"
    >
      <TopBar 
        title="Qur'an Tracker" 
        leftElement={
          <button onClick={() => navigate(-1)} className="p-2 -ml-2">
            <ChevronLeft className="w-5 h-5" />
          </button>
        }
      />

      {/* Today's Reading */}
      <div className="px-4 pb-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl bg-gradient-to-br from-pastel-green/40 to-pastel-blue/30 border border-pastel-green/30"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-foreground/60">Today's Reading</p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-foreground">{progress.todayPages}</span>
                <span className="text-lg text-foreground/50">/ {progress.dailyGoal}</span>
              </div>
              <p className="text-xs text-foreground/50">pages</p>
            </div>
            
            {/* Counter buttons */}
            <div className="flex items-center gap-2">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={removePage}
                disabled={progress.todayPages <= 0}
                className="w-12 h-12 rounded-full bg-white/80 flex items-center justify-center shadow-sm disabled:opacity-30"
              >
                <Minus className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={addPage}
                className="w-16 h-16 rounded-full bg-pastel-green flex items-center justify-center shadow-lg"
              >
                <Plus className="w-7 h-7 text-white" />
              </motion.button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="space-y-1">
            <div className="h-3 bg-white/50 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${todayProgress}%` }}
                transition={{ duration: 0.5 }}
                className="h-full bg-pastel-green rounded-full"
              />
            </div>
            <div className="flex justify-between text-xs text-foreground/50">
              <span>{Math.round(todayProgress)}% of daily goal</span>
              <button 
                onClick={() => setShowGoalModal(true)}
                className="text-pastel-green font-medium"
              >
                Change goal
              </button>
            </div>
          </div>

          {progress.todayPages >= progress.dailyGoal && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-3 p-2 rounded-lg bg-pastel-green/30 flex items-center gap-2 justify-center"
            >
              <Check className="w-4 h-4 text-pastel-green" />
              <span className="text-sm font-medium text-foreground">Daily goal achieved!</span>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Stats Cards */}
      <div className="px-4 pb-4">
        <div className="grid grid-cols-2 gap-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-4 rounded-2xl bg-white border border-border/30 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-4 h-4 text-pastel-lavender" />
              <span className="text-xs text-foreground/60">Total Pages</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{progress.totalPages}</p>
            <p className="text-[10px] text-foreground/40">pages read</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="p-4 rounded-2xl bg-white border border-border/30 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-4 h-4 text-pastel-yellow" />
              <span className="text-xs text-foreground/60">Khatams</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{progress.khatams}</p>
            <p className="text-[10px] text-foreground/40">completed</p>
          </motion.div>
        </div>
      </div>

      {/* Juz Progress */}
      <div className="px-4 pb-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-4 rounded-2xl bg-white border border-border/30 shadow-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-semibold text-foreground">Current Juz</p>
              <p className="text-xs text-foreground/50">Juz {Math.min(progress.currentJuz, 30)} of 30</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-pastel-lavender/20 flex items-center justify-center">
              <span className="text-lg font-bold text-pastel-lavender">{Math.min(progress.currentJuz, 30)}</span>
            </div>
          </div>
          
          <div className="h-2 bg-pastel-lavender/20 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${juzProgress}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-pastel-lavender rounded-full"
            />
          </div>
          <p className="text-xs text-foreground/40 mt-1">
            {progress.totalPages % PAGES_PER_JUZ} / {PAGES_PER_JUZ} pages in current Juz
          </p>
        </motion.div>
      </div>

      {/* Khatam Progress */}
      <div className="px-4 pb-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="p-4 rounded-2xl bg-white border border-border/30 shadow-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-semibold text-foreground">Khatam Progress</p>
              <p className="text-xs text-foreground/50">{progress.totalPages % TOTAL_QURAN_PAGES} / {TOTAL_QURAN_PAGES} pages</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-foreground">{Math.round(khatamProgress)}%</p>
            </div>
          </div>
          
          <div className="h-2 bg-pastel-green/20 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${khatamProgress}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-pastel-green rounded-full"
            />
          </div>
        </motion.div>
      </div>

      {/* Milestones */}
      <div className="px-4 pb-4">
        <h2 className="text-sm font-semibold text-foreground mb-3">Milestones</h2>
        <div className="grid grid-cols-3 gap-2">
          {[1, 5, 10, 15, 20, 30].map(juz => {
            const achieved = progress.currentJuz > juz || (progress.khatams > 0);
            return (
              <motion.div
                key={juz}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: juz * 0.02 }}
                className={cn(
                  "p-3 rounded-xl text-center border",
                  achieved 
                    ? "bg-pastel-green/20 border-pastel-green/30" 
                    : "bg-white border-border/30"
                )}
              >
                {achieved ? (
                  <Star className="w-5 h-5 text-pastel-green mx-auto mb-1 fill-pastel-green" />
                ) : (
                  <Star className="w-5 h-5 text-foreground/20 mx-auto mb-1" />
                )}
                <p className={cn(
                  "text-xs font-medium",
                  achieved ? "text-pastel-green" : "text-foreground/40"
                )}>
                  Juz {juz}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Niyyah disclaimer */}
      <div className="px-4 pb-4">
        <p className="text-[10px] text-foreground/40 text-center italic">
          Your niyyah is what matters — tracking is just a tool to help you stay consistent.
        </p>
      </div>

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
              className="w-full max-w-sm bg-pastel-cream rounded-2xl p-6"
              onClick={e => e.stopPropagation()}
            >
              <h2 className="text-lg font-bold text-foreground mb-4 text-center">
                Set Daily Goal
              </h2>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 5, 10, 15, 20, 30].map(goal => (
                  <button
                    key={goal}
                    onClick={() => updateGoal(goal)}
                    className={cn(
                      "p-3 rounded-xl text-center font-medium transition-all",
                      progress.dailyGoal === goal
                        ? "bg-pastel-green text-white"
                        : "bg-white border border-border/30"
                    )}
                  >
                    {goal}
                  </button>
                ))}
              </div>
              <p className="text-xs text-foreground/50 text-center mt-3">pages per day</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav />
    </motion.div>
  );
};

export default Quran;
