import { motion } from 'framer-motion';
import { Flame, Star, Trophy } from 'lucide-react';
import { SPIRITUAL_LEVELS } from '@/hooks/useGuestProfile';

interface BarakahPointsBarProps {
  points: number;
  level: number;
  streak: number;
  compact?: boolean;
}

export const BarakahPointsBar = ({ points, level, streak, compact = false }: BarakahPointsBarProps) => {
  const levelProgress = level < 10 ? Math.floor((points % 100) / 100 * 100) : 100;
  const title = SPIRITUAL_LEVELS[level - 1] || 'The Seeker';

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <motion.div 
          className="relative w-10 h-10 rounded-xl bg-semantic-lavender-soft flex items-center justify-center shadow-sm"
          whileHover={{ scale: 1.05 }}
        >
          <span className="text-foreground font-bold text-sm">{level}</span>
        </motion.div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-foreground">{title}</span>
            <span className="text-xs text-foreground/50">{points} BP</span>
          </div>
          <div className="h-2 bg-semantic-lavender-soft rounded-full overflow-hidden mt-1">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${levelProgress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full bg-semantic-lavender-dark rounded-full"
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
      className="p-4 rounded-2xl bg-card border border-border shadow-sm"
    >
      <div className="flex items-center gap-4">
        {/* Level Circle */}
        <motion.div 
          className="relative"
          whileHover={{ scale: 1.05 }}
        >
          <div className="w-16 h-16 rounded-2xl bg-semantic-lavender-soft flex items-center justify-center shadow-sm">
            <span className="text-foreground font-bold text-xl">{level}</span>
          </div>
        </motion.div>

        {/* Progress Info */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <div>
              <h3 className="font-bold text-foreground">{title}</h3>
              <p className="text-xs text-foreground/50">Level {level}</p>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-semantic-yellow-dark" />
              <span className="font-bold text-foreground">{points.toLocaleString()}</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-3 bg-semantic-lavender-soft rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${levelProgress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full bg-semantic-lavender-dark rounded-full relative"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>
          </div>
          <p className="text-xs text-foreground/50 mt-1">
            Barakah Points to Level {level + 1}
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
            <p className="text-[10px] text-foreground/50">Hasanat Streak</p>
          </div>
        </motion.div>

        <motion.div 
          className="flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
        >
          <div className="w-8 h-8 rounded-lg bg-semantic-yellow-soft flex items-center justify-center">
            <Star className="w-4 h-4 text-semantic-yellow-dark" />
          </div>
          <div>
            <p className="font-bold text-foreground">{points.toLocaleString()}</p>
            <p className="text-[10px] text-foreground/50">Total Points</p>
          </div>
        </motion.div>

        <motion.div 
          className="flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
        >
          <div className="w-8 h-8 rounded-lg bg-semantic-green-soft flex items-center justify-center">
            <Trophy className="w-4 h-4 text-semantic-green-dark" />
          </div>
          <div>
            <p className="font-bold text-foreground">{level}</p>
            <p className="text-[10px] text-foreground/50">Level</p>
          </div>
        </motion.div>
      </div>

      {/* Niyyah disclaimer */}
      <p className="text-[10px] text-foreground/40 mt-3 text-center italic">
        Your niyyah is what matters — points are just a tool to help you stay consistent.
      </p>
    </motion.div>
  );
};
