import { motion } from 'framer-motion';
import { Star, Zap } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface XPBarProps {
  level: number;
  currentXP: number;
  requiredXP: number;
  percentage: number;
  totalXP: number;
  compact?: boolean;
}

export const XPBar = ({ level, currentXP, requiredXP, percentage, totalXP, compact = false }: XPBarProps) => {
  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 bg-primary/10 rounded-full px-2 py-0.5">
          <Star className="w-3 h-3 text-primary fill-primary" />
          <span className="text-xs font-semibold text-primary">Lv.{level}</span>
        </div>
        <div className="flex-1 max-w-20">
          <Progress value={percentage} className="h-1.5" />
        </div>
        <span className="text-[10px] text-muted-foreground">{totalXP} XP</span>
      </div>
    );
  }

  return (
    <motion.div 
      className="bg-card border border-border rounded-2xl p-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <motion.div 
            className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Star className="w-5 h-5 text-primary fill-primary" />
          </motion.div>
          <div>
            <p className="text-lg font-bold text-foreground">Level {level}</p>
            <p className="text-xs text-muted-foreground">{totalXP} Total XP</p>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-accent rounded-full px-3 py-1">
          <Zap className="w-3.5 h-3.5 text-primary" />
          <span className="text-sm font-medium text-foreground">{currentXP}/{requiredXP}</span>
        </div>
      </div>
      
      <div className="space-y-1.5">
        <Progress value={percentage} className="h-2.5" />
        <p className="text-[11px] text-muted-foreground text-center">
          {requiredXP - currentXP} XP to Level {level + 1}
        </p>
      </div>
    </motion.div>
  );
};
