import { motion } from 'framer-motion';
import { Flame, Star, Trophy, Zap } from 'lucide-react';
import { getXPProgressInLevel } from '@/services/gamification';
import { cn } from '@/lib/utils';

interface GameXPBarProps {
  xp: number;
  level: number;
  streak: number;
  compact?: boolean;
}

export const GameXPBar = ({ xp, level, streak, compact = false }: GameXPBarProps) => {
  const progress = getXPProgressInLevel(xp);
  
  const levelTitles: Record<number, string> = {
    1: "Seeker",
    2: "Learner",
    3: "Devoted",
    4: "Dedicated",
    5: "Steadfast",
    6: "Consistent",
    7: "Committed",
    8: "Faithful",
    9: "Enlightened",
    10: "Master",
  };

  const title = levelTitles[Math.min(level, 10)] || "Legend";

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <motion.div 
          className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg"
          whileHover={{ scale: 1.05 }}
        >
          <span className="text-primary-foreground font-bold text-sm">{level}</span>
          <motion.div 
            className="absolute -inset-1 rounded-xl bg-primary/20"
            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.2, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-foreground">{title}</span>
            <span className="text-xs text-muted-foreground">{progress.current}/{progress.required} XP</span>
          </div>
          <div className="h-2 bg-muted/50 rounded-full overflow-hidden mt-1">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress.percentage}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full"
            />
          </div>
        </div>

        {streak > 0 && (
          <motion.div 
            className="flex items-center gap-1 px-2 py-1 rounded-full bg-orange-500/10 text-orange-500"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Flame className="w-3.5 h-3.5" />
            <span className="text-xs font-bold">{streak}</span>
          </motion.div>
        )}
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-2xl bg-gradient-to-br from-card via-card to-primary/5 border border-border/50"
    >
      <div className="flex items-center gap-4">
        {/* Level Circle */}
        <motion.div 
          className="relative"
          whileHover={{ scale: 1.05 }}
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
            <span className="text-primary-foreground font-bold text-xl">{level}</span>
          </div>
          <motion.div 
            className="absolute -inset-1 rounded-2xl bg-primary/30"
            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.2, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>

        {/* Progress Info */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <div>
              <h3 className="font-bold text-foreground">{title}</h3>
              <p className="text-xs text-muted-foreground">Level {level}</p>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              <span className="font-bold text-primary">{xp.toLocaleString()} XP</span>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="h-3 bg-muted/50 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress.percentage}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full relative"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {progress.current}/{progress.required} XP to Level {level + 1}
          </p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="flex items-center justify-around mt-4 pt-4 border-t border-border/30">
        <motion.div 
          className="flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
        >
          <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
            <Flame className="w-4 h-4 text-orange-500" />
          </div>
          <div>
            <p className="font-bold text-foreground">{streak}</p>
            <p className="text-[10px] text-muted-foreground">Day Streak</p>
          </div>
        </motion.div>

        <motion.div 
          className="flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
        >
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Star className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="font-bold text-foreground">{xp.toLocaleString()}</p>
            <p className="text-[10px] text-muted-foreground">Total XP</p>
          </div>
        </motion.div>

        <motion.div 
          className="flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
        >
          <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center">
            <Trophy className="w-4 h-4 text-yellow-500" />
          </div>
          <div>
            <p className="font-bold text-foreground">{level}</p>
            <p className="text-[10px] text-muted-foreground">Level</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
