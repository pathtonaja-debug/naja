import { motion } from 'framer-motion';
import { 
  Trophy, Sun, Sunrise, Moon, Flame, Zap, Award, 
  BookOpen, GraduationCap, Library, Heart, Sparkles, 
  Star, TrendingUp, Crown, Gem, LucideIcon 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const iconMap: Record<string, LucideIcon> = {
  trophy: Trophy,
  sun: Sun,
  sunrise: Sunrise,
  moon: Moon,
  flame: Flame,
  zap: Zap,
  award: Award,
  'book-open': BookOpen,
  'graduation-cap': GraduationCap,
  library: Library,
  heart: Heart,
  sparkles: Sparkles,
  star: Star,
  'trending-up': TrendingUp,
  crown: Crown,
  gem: Gem,
};

interface AchievementCardProps {
  name: string;
  description: string;
  icon: string;
  xpReward: number;
  earned: boolean;
  earnedAt?: string;
  compact?: boolean;
}

export const AchievementCard = ({ 
  name, 
  description, 
  icon, 
  xpReward, 
  earned, 
  earnedAt,
  compact = false 
}: AchievementCardProps) => {
  const Icon = iconMap[icon] || Trophy;

  if (compact) {
    return (
      <motion.div
        className={cn(
          "flex items-center gap-2 p-2 rounded-xl border transition-all",
          earned 
            ? "bg-primary/5 border-primary/20" 
            : "bg-muted/30 border-border opacity-50"
        )}
        whileHover={{ scale: earned ? 1.02 : 1 }}
      >
        <div className={cn(
          "w-8 h-8 rounded-lg flex items-center justify-center",
          earned ? "bg-primary/10" : "bg-muted"
        )}>
          <Icon className={cn(
            "w-4 h-4",
            earned ? "text-primary" : "text-muted-foreground"
          )} />
        </div>
        <div className="flex-1 min-w-0">
          <p className={cn(
            "text-xs font-medium truncate",
            earned ? "text-foreground" : "text-muted-foreground"
          )}>{name}</p>
        </div>
        {earned && (
          <span className="text-[10px] text-primary font-medium">+{xpReward}</span>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={cn(
        "p-4 rounded-2xl border transition-all",
        earned 
          ? "bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20" 
          : "bg-muted/30 border-border"
      )}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: earned ? 1.02 : 1 }}
    >
      <div className="flex items-start gap-3">
        <motion.div 
          className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center",
            earned ? "bg-primary/10" : "bg-muted"
          )}
          animate={earned ? { 
            boxShadow: ['0 0 0 0 rgba(var(--primary), 0)', '0 0 0 4px rgba(var(--primary), 0.1)', '0 0 0 0 rgba(var(--primary), 0)'] 
          } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Icon className={cn(
            "w-6 h-6",
            earned ? "text-primary" : "text-muted-foreground"
          )} />
        </motion.div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className={cn(
              "font-semibold text-sm",
              earned ? "text-foreground" : "text-muted-foreground"
            )}>{name}</h4>
            <span className={cn(
              "text-xs font-medium px-2 py-0.5 rounded-full",
              earned ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
            )}>+{xpReward} XP</span>
          </div>
          <p className={cn(
            "text-xs mt-1",
            earned ? "text-muted-foreground" : "text-muted-foreground/70"
          )}>{description}</p>
          {earned && earnedAt && (
            <p className="text-[10px] text-primary mt-2">
              Earned {new Date(earnedAt).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};
