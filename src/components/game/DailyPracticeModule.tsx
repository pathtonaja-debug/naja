import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sun, Book, Heart, Sparkles, Moon, Sunrise, CloudSun, Sunset,
  HandHeart, Apple, Gift
} from 'lucide-react';
import { DailyQuestCard } from './DailyQuestCard';
import { useGuestProfile } from '@/hooks/useGuestProfile';
import { BARAKAH_REWARDS } from '@/services/localStore';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

interface Quest {
  id: string;
  type: 'prayer' | 'quran' | 'dhikr' | 'dua' | 'fasting' | 'charity';
  title: string;
  description: string;
  icon: React.ReactNode;
  pointsReward: number;
  completed: boolean;
}

const prayerIcons: Record<string, React.ReactNode> = {
  Fajr: <Sunrise className="w-5 h-5" />,
  Dhuhr: <Sun className="w-5 h-5" />,
  Asr: <CloudSun className="w-5 h-5" />,
  Maghrib: <Sunset className="w-5 h-5" />,
  Isha: <Moon className="w-5 h-5" />,
};

const PRAYER_NAMES = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

export const DailyPracticeModule = ({ onXPGained }: { onXPGained?: (amount: number) => void }) => {
  const { addBarakahPoints, updateStreak } = useGuestProfile();
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPointsEarned, setTotalPointsEarned] = useState(0);

  const loadQuests = () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Load prayer completion from localStorage
      const prayerStored = localStorage.getItem('naja_prayer_states');
      let prayerStates: Record<string, { done: boolean }> = {};
      if (prayerStored) {
        const parsed = JSON.parse(prayerStored);
        if (parsed.date === today) {
          prayerStates = parsed.states;
        }
      }

      // Build prayer quests
      const prayerQuests: Quest[] = PRAYER_NAMES.map(name => ({
        id: name.toLowerCase(),
        type: 'prayer',
        title: `${name} Prayer`,
        description: 'Complete your daily prayer',
        icon: prayerIcons[name] || <Moon className="w-5 h-5" />,
        pointsReward: BARAKAH_REWARDS.PRAYER_COMPLETED,
        completed: prayerStates[name.toLowerCase()]?.done || false,
      }));

      // Load Quran progress
      const quranStored = localStorage.getItem('naja_quran_progress_v2');
      let quranCompleted = false;
      if (quranStored) {
        const parsed = JSON.parse(quranStored);
        quranCompleted = (parsed.history?.[today] || 0) > 0;
      }

      // Load dhikr progress
      const dhikrStored = localStorage.getItem('naja_dhikr_today');
      let dhikrCompleted = false;
      if (dhikrStored) {
        const parsed = JSON.parse(dhikrStored);
        if (parsed.date === today) {
          dhikrCompleted = parsed.total >= 33;
        }
      }

      // Additional quests
      const additionalQuests: Quest[] = [
        {
          id: 'quran-reading',
          type: 'quran',
          title: "Qur'an Reading",
          description: 'Read at least one page of Quran',
          icon: <Book className="w-5 h-5" />,
          pointsReward: BARAKAH_REWARDS.QURAN_PAGE,
          completed: quranCompleted,
        },
        {
          id: 'dhikr-daily',
          type: 'dhikr',
          title: 'Daily Dhikr',
          description: 'Complete 33 dhikr today',
          icon: <Heart className="w-5 h-5" />,
          pointsReward: BARAKAH_REWARDS.DHIKR_33,
          completed: dhikrCompleted,
        },
        {
          id: 'morning-dua',
          type: 'dua',
          title: 'Morning Duas',
          description: 'Recite your morning supplications',
          icon: <Sparkles className="w-5 h-5" />,
          pointsReward: BARAKAH_REWARDS.DUA_CREATED,
          completed: false,
        },
      ];

      setQuests([...prayerQuests, ...additionalQuests]);
    } catch (error) {
      console.error('Error loading quests:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuests();
  }, []);

  const handleCompleteQuest = (questId: string, questType: string) => {
    const quest = quests.find(q => q.id === questId);
    if (!quest || quest.completed) return;

    // Optimistic update
    setQuests(prev => prev.map(q => 
      q.id === questId ? { ...q, completed: true } : q
    ));

    // Add points
    const { leveledUp, newLevel } = addBarakahPoints(quest.pointsReward);
    updateStreak();
    
    setTotalPointsEarned(prev => prev + quest.pointsReward);
    onXPGained?.(quest.pointsReward);

    if (leveledUp) {
      toast.success(`Level Up! You're now Level ${newLevel}`);
    } else {
      toast.success(`+${quest.pointsReward} Barakah Points earned`);
    }
  };

  const completedCount = quests.filter(q => q.completed).length;
  const totalCount = quests.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map(i => (
          <Skeleton key={i} className="h-20 rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with Progress */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground">Today's Acts for Allah</h2>
          <p className="text-xs text-muted-foreground">Complete tasks to earn Barakah Points</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-primary">{completedCount}/{totalCount}</p>
          <p className="text-[10px] text-muted-foreground">Completed</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative">
        <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full"
          />
        </div>
        <AnimatePresence>
          {totalPointsEarned > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute -top-6 right-0 text-xs font-bold text-primary"
            >
              +{totalPointsEarned} BP Today
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Quest Cards */}
      <motion.div layout className="space-y-3">
        {quests.map((quest, index) => (
          <motion.div
            key={quest.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <DailyQuestCard
              id={quest.id}
              title={quest.title}
              description={quest.description}
              icon={quest.icon}
              xpReward={quest.pointsReward}
              completed={quest.completed}
              onComplete={() => handleCompleteQuest(quest.id, quest.type)}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Bonus Quests */}
      <div className="pt-4 border-t border-border/30">
        <h3 className="text-sm font-semibold text-foreground mb-3">Bonus Acts</h3>
        <div className="grid grid-cols-2 gap-3">
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="p-4 rounded-xl bg-muted/30 border border-border/30 text-left"
          >
            <Apple className="w-5 h-5 text-green-500 mb-2" />
            <p className="text-xs font-semibold text-foreground">Fasting</p>
            <p className="text-[10px] text-muted-foreground">Optional fast</p>
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="p-4 rounded-xl bg-muted/30 border border-border/30 text-left"
          >
            <Gift className="w-5 h-5 text-semantic-teal-dark mb-2" />
            <p className="text-xs font-semibold text-foreground">Charity</p>
            <p className="text-[10px] text-muted-foreground">Give Sadaqah</p>
          </motion.button>
        </div>
      </div>

      {/* Niyyah disclaimer */}
      <p className="text-xs text-muted-foreground text-center italic">
        Your niyyah is what matters — points are just a tool to help you stay consistent.
      </p>
    </div>
  );
};