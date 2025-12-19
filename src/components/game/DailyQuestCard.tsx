import { motion, AnimatePresence } from 'framer-motion';
import { Check, Sparkles, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface DailyQuestCardProps {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  xpReward: number;
  completed: boolean;
  onComplete: () => void;
}

export const DailyQuestCard = ({
  id,
  title,
  description,
  icon,
  xpReward,
  completed,
  onComplete,
}: DailyQuestCardProps) => {
  const [showReward, setShowReward] = useState(false);

  const handleTap = () => {
    if (completed) return;
    
    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate([10, 50, 10]);
    }
    
    setShowReward(true);
    setTimeout(() => setShowReward(false), 1500);
    onComplete();
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={{ scale: completed ? 1 : 0.98 }}
      onClick={handleTap}
      className={cn(
        "relative p-4 rounded-2xl border transition-all cursor-pointer overflow-hidden",
        completed
          ? "bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30"
          : "bg-card/80 border-border/50 hover:border-primary/30 hover:bg-card"
      )}
    >
      {/* Background glow effect when completed */}
      {completed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent"
        />
      )}

      <div className="relative flex items-center gap-3">
        {/* Icon Container */}
        <motion.div
          animate={completed ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 0.3 }}
          className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
            completed
              ? "bg-primary text-primary-foreground shadow-lg"
              : "bg-muted/80 text-muted-foreground"
          )}
        >
          <AnimatePresence mode="wait">
            {completed ? (
              <motion.div
                key="check"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
              >
                <Check className="w-5 h-5" strokeWidth={2.5} />
              </motion.div>
            ) : (
              <motion.div
                key="icon"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {icon}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className={cn(
            "font-semibold text-sm",
            completed ? "text-primary" : "text-foreground"
          )}>
            {title}
          </h4>
          <p className="text-xs text-muted-foreground mt-0.5 truncate">
            {description}
          </p>
        </div>

        {/* XP Reward Badge */}
        <motion.div
          animate={completed ? { scale: [1, 1.2, 1] } : {}}
          className={cn(
            "px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1",
            completed
              ? "bg-primary/20 text-primary"
              : "bg-muted text-muted-foreground"
          )}
        >
          <Star className="w-3 h-3" />
          +{xpReward}
        </motion.div>
      </div>

      {/* XP Reward Animation */}
      <AnimatePresence>
        {showReward && (
          <motion.div
            initial={{ opacity: 0, y: 0, scale: 0.5 }}
            animate={{ opacity: 1, y: -30, scale: 1 }}
            exit={{ opacity: 0, y: -60 }}
            className="absolute top-0 right-4 flex items-center gap-1 text-primary font-bold text-lg"
          >
            <Sparkles className="w-5 h-5" />
            +{xpReward} XP
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
