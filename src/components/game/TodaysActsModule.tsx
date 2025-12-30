import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sun, Book, Heart, Moon, Sunrise, CloudSun, Sunset,
  Apple, Gift, Check
} from 'lucide-react';
import { useGuestProfile } from '@/hooks/useGuestProfile';
import { MANDATORY_PRAYERS, BARAKAH_REWARDS } from '@/data/practiceItems';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Act {
  id: string;
  title: string;
  icon: React.ReactNode;
  points: number;
  completed: boolean;
  category: string;
}

const prayerIcons: Record<string, React.ReactNode> = {
  fajr: <Sunrise className="w-4 h-4" />,
  dhuhr: <Sun className="w-4 h-4" />,
  asr: <CloudSun className="w-4 h-4" />,
  maghrib: <Sunset className="w-4 h-4" />,
  isha: <Moon className="w-4 h-4" />,
};

export const TodaysActsModule = ({ onPointsEarned }: { onPointsEarned?: (amount: number) => void }) => {
  const { addBarakahPoints, incrementActsCompleted } = useGuestProfile();
  const [acts, setActs] = useState<Act[]>([]);
  const [totalPointsEarned, setTotalPointsEarned] = useState(0);

  useEffect(() => {
    // Build acts from practice items
    const prayerActs: Act[] = MANDATORY_PRAYERS.map(p => ({
      id: p.id,
      title: p.name,
      icon: prayerIcons[p.id] || <Moon className="w-4 h-4" />,
      points: p.barakahReward,
      completed: false,
      category: 'prayer',
    }));

    const otherActs: Act[] = [
      {
        id: 'quran',
        title: "Qur'an Reading",
        icon: <Book className="w-4 h-4" />,
        points: BARAKAH_REWARDS.QURAN_PAGE,
        completed: false,
        category: 'quran',
      },
      {
        id: 'dhikr',
        title: 'Daily Dhikr',
        icon: <Heart className="w-4 h-4" />,
        points: BARAKAH_REWARDS.DHIKR_33,
        completed: false,
        category: 'dhikr',
      },
    ];

    // Load completed state from localStorage
    const today = new Date().toISOString().split('T')[0];
    const saved = localStorage.getItem(`acts_${today}`);
    const completedIds = saved ? JSON.parse(saved) : [];
    
    const allActs = [...prayerActs, ...otherActs].map(a => ({
      ...a,
      completed: completedIds.includes(a.id)
    }));
    
    setActs(allActs);
  }, []);

  const handleComplete = (actId: string) => {
    const act = acts.find(a => a.id === actId);
    if (!act || act.completed) return;

    // Update state
    setActs(prev => prev.map(a => 
      a.id === actId ? { ...a, completed: true } : a
    ));

    // Save to localStorage
    const today = new Date().toISOString().split('T')[0];
    const saved = localStorage.getItem(`acts_${today}`);
    const completedIds = saved ? JSON.parse(saved) : [];
    completedIds.push(actId);
    localStorage.setItem(`acts_${today}`, JSON.stringify(completedIds));

    // Update points
    addBarakahPoints(act.points);
    incrementActsCompleted();
    setTotalPointsEarned(prev => prev + act.points);
    onPointsEarned?.(act.points);

    // Celebration
    toast.success(`+${act.points} Barakah Points`, {
      description: `MashAllah! ${act.title} completed.`
    });

    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(20);
    }
  };

  const completedCount = acts.filter(a => a.completed).length;
  const totalCount = acts.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="space-y-4">
      {/* Header with Progress */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground">Today's Acts for Allah</h2>
          <p className="text-xs text-foreground/50">Complete acts to earn Barakah Points</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-foreground">{completedCount}/{totalCount}</p>
          <p className="text-[10px] text-foreground/50">Completed</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative">
        <div className="h-2 bg-pastel-lavender/30 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="h-full bg-pastel-lavender rounded-full"
          />
        </div>
        <AnimatePresence>
          {totalPointsEarned > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute -top-6 right-0 text-xs font-bold text-pastel-lavender"
            >
              +{totalPointsEarned} Today
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Act Cards */}
      <motion.div layout className="space-y-2">
        {acts.map((act, index) => (
          <motion.button
            key={act.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleComplete(act.id)}
            disabled={act.completed}
            className={cn(
              "w-full p-3 rounded-xl border flex items-center gap-3 transition-all",
              act.completed 
                ? "bg-pastel-green/20 border-pastel-green/30" 
                : "bg-white border-border/30 hover:border-pastel-lavender/50"
            )}
          >
            {/* Checkbox */}
            <div className={cn(
              "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
              act.completed 
                ? "bg-pastel-green border-pastel-green" 
                : "border-foreground/20"
            )}>
              {act.completed && <Check className="w-3 h-3 text-white" />}
            </div>

            {/* Icon */}
            <div className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center",
              act.completed ? "bg-pastel-green/30 text-pastel-green" : "bg-pastel-lavender/30 text-pastel-lavender"
            )}>
              {act.icon}
            </div>

            {/* Title */}
            <span className={cn(
              "flex-1 text-left text-sm font-medium",
              act.completed ? "text-foreground/50 line-through" : "text-foreground"
            )}>
              {act.title}
            </span>

            {/* Points */}
            <span className={cn(
              "text-xs font-semibold",
              act.completed ? "text-pastel-green" : "text-foreground/40"
            )}>
              +{act.points}
            </span>
          </motion.button>
        ))}
      </motion.div>

      {/* Bonus Acts */}
      <div className="pt-4 border-t border-border/30">
        <h3 className="text-sm font-semibold text-foreground mb-3">Bonus Acts</h3>
        <div className="grid grid-cols-2 gap-3">
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="p-4 rounded-xl bg-white border border-border/30 text-left"
          >
            <Apple className="w-5 h-5 text-pastel-green mb-2" />
            <p className="text-xs font-semibold text-foreground">Fasting</p>
            <p className="text-[10px] text-foreground/50">Optional fast</p>
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="p-4 rounded-xl bg-white border border-border/30 text-left"
          >
            <Gift className="w-5 h-5 text-pastel-pink mb-2" />
            <p className="text-xs font-semibold text-foreground">Charity</p>
            <p className="text-[10px] text-foreground/50">Give Sadaqah</p>
          </motion.button>
        </div>
      </div>

      {/* Niyyah disclaimer */}
      <p className="text-[10px] text-foreground/40 text-center italic pt-2">
        Your niyyah is what matters — points are just a tool to help you stay consistent.
      </p>
    </div>
  );
};
