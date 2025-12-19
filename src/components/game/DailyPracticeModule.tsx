import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sun, Book, Heart, Sparkles, Moon, Sunrise, CloudSun, Sunset,
  HandHeart, Apple, Gift
} from 'lucide-react';
import { DailyQuestCard } from './DailyQuestCard';
import { addXP, XP_REWARDS, updateStreak, checkPrayerAchievements, checkDhikrAchievements } from '@/services/gamification';
import { getPrayerHabits, logHabitCompletion } from '@/services/habitTracking';
import { supabase } from '@/integrations/supabase/client';
import { getAuthenticatedUserId } from '@/lib/auth';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

interface Quest {
  id: string;
  type: 'prayer' | 'quran' | 'dhikr' | 'dua' | 'fasting' | 'charity';
  title: string;
  description: string;
  icon: React.ReactNode;
  xpReward: number;
  completed: boolean;
}

const prayerIcons: Record<string, React.ReactNode> = {
  Fajr: <Sunrise className="w-5 h-5" />,
  Dhuhr: <Sun className="w-5 h-5" />,
  Asr: <CloudSun className="w-5 h-5" />,
  Maghrib: <Sunset className="w-5 h-5" />,
  Isha: <Moon className="w-5 h-5" />,
};

export const DailyPracticeModule = ({ onXPGained }: { onXPGained?: (amount: number) => void }) => {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalXPEarned, setTotalXPEarned] = useState(0);

  const loadQuests = async () => {
    try {
      // Load prayer habits
      const prayers = await getPrayerHabits();
      const prayerQuests: Quest[] = prayers.map(p => ({
        id: p.id,
        type: 'prayer',
        title: `${p.name} Prayer`,
        description: 'Complete your daily prayer',
        icon: prayerIcons[p.name] || <Moon className="w-5 h-5" />,
        xpReward: XP_REWARDS.PRAYER_COMPLETED,
        completed: p.completed,
      }));

      // Load Quran reading habit
      const userId = await getAuthenticatedUserId();
      const today = new Date().toISOString().split('T')[0];
      
      // Check for Quran habit
      const { data: quranHabit } = await supabase
        .from('habits')
        .select('id')
        .eq('user_id', userId)
        .eq('category', 'Spiritual')
        .ilike('name', '%quran%')
        .single();

      let quranCompleted = false;
      if (quranHabit) {
        const { data: quranLog } = await supabase
          .from('habit_logs')
          .select('completed')
          .eq('habit_id', quranHabit.id)
          .eq('date', today)
          .single();
        quranCompleted = quranLog?.completed || false;
      }

      // Check for dhikr today
      const { data: dhikrSessions } = await supabase
        .from('dhikr_sessions')
        .select('count')
        .eq('user_id', userId)
        .eq('date', today);
      
      const dhikrCount = dhikrSessions?.reduce((sum, s) => sum + s.count, 0) || 0;
      const dhikrCompleted = dhikrCount >= 33;

      // Additional quests
      const additionalQuests: Quest[] = [
        {
          id: 'quran-reading',
          type: 'quran',
          title: "Qur'an Reading",
          description: 'Read at least one page of Quran',
          icon: <Book className="w-5 h-5" />,
          xpReward: XP_REWARDS.HABIT_COMPLETED,
          completed: quranCompleted,
        },
        {
          id: 'dhikr-daily',
          type: 'dhikr',
          title: 'Daily Dhikr',
          description: 'Complete 33 dhikr today',
          icon: <Heart className="w-5 h-5" />,
          xpReward: XP_REWARDS.DHIKR_TARGET,
          completed: dhikrCompleted,
        },
        {
          id: 'morning-dua',
          type: 'dua',
          title: 'Morning Duas',
          description: 'Recite your morning supplications',
          icon: <Sparkles className="w-5 h-5" />,
          xpReward: XP_REWARDS.HABIT_COMPLETED,
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

  const handleCompleteQuest = async (questId: string, questType: string) => {
    const quest = quests.find(q => q.id === questId);
    if (!quest || quest.completed) return;

    // Optimistic update
    setQuests(prev => prev.map(q => 
      q.id === questId ? { ...q, completed: true } : q
    ));

    try {
      // Different handling based on quest type
      if (questType === 'prayer') {
        await logHabitCompletion(questId, true);
        await checkPrayerAchievements(quests.filter(q => q.type === 'prayer' && q.completed).length + 1);
      }

      // Add XP
      const { newXP, leveledUp, newLevel } = await addXP(quest.xpReward);
      await updateStreak();
      
      setTotalXPEarned(prev => prev + quest.xpReward);
      onXPGained?.(quest.xpReward);

      if (leveledUp) {
        toast.success(`Level Up! You're now Level ${newLevel}! 🎉`);
      } else {
        toast.success(`+${quest.xpReward} XP earned! ✨`);
      }
    } catch (error) {
      // Revert on error
      setQuests(prev => prev.map(q => 
        q.id === questId ? { ...q, completed: false } : q
      ));
      toast.error('Failed to complete quest');
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
          <h2 className="text-lg font-bold text-foreground">Daily Quests</h2>
          <p className="text-xs text-muted-foreground">Complete tasks to earn XP</p>
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
          {totalXPEarned > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute -top-6 right-0 text-xs font-bold text-primary"
            >
              +{totalXPEarned} XP Today
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
              xpReward={quest.xpReward}
              completed={quest.completed}
              onComplete={() => handleCompleteQuest(quest.id, quest.type)}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Bonus Quests */}
      <div className="pt-4 border-t border-border/30">
        <h3 className="text-sm font-semibold text-foreground mb-3">Bonus Quests</h3>
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
            <Gift className="w-5 h-5 text-pink-500 mb-2" />
            <p className="text-xs font-semibold text-foreground">Charity</p>
            <p className="text-[10px] text-muted-foreground">Give Sadaqah</p>
          </motion.button>
        </div>
      </div>
    </div>
  );
};
