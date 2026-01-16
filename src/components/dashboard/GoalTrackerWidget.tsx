import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target, ChevronRight, Moon, BookOpen, Heart, Users, Gift, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import {
  getActiveGoal,
  getCurrentDayNumber,
  getTodayCompletion,
  getTodayTasks,
  GoalConfig,
} from '@/services/goalsStore';

const iconMap: Record<string, React.ElementType> = {
  'Moon': Moon,
  'BookOpen': BookOpen,
  'Heart': Heart,
  'Users': Users,
  'Gift': Gift,
  'Sparkles': Sparkles,
};

export const GoalTrackerWidget = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [goal, setGoal] = useState<GoalConfig | null>(null);
  const [completedCount, setCompletedCount] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);

  useEffect(() => {
    const activeGoal = getActiveGoal();
    setGoal(activeGoal);
    
    if (activeGoal) {
      const todayCompletion = getTodayCompletion();
      const tasks = getTodayTasks(activeGoal);
      setTotalTasks(tasks.length);
      setCompletedCount(todayCompletion?.tasksCompleted.filter(Boolean).length || 0);
    }
  }, []);

  // Don't render if no active goal
  if (!goal) return null;

  const currentDay = getCurrentDayNumber();
  const progress = (currentDay / goal.timeframe) * 100;
  const IconComponent = iconMap[goal.goalIcon] || Target;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate('/goals')}
      className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 cursor-pointer hover:border-primary/40 transition-colors"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <IconComponent className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">{t('goals.goalTracker')}</h3>
            <p className="text-xs text-muted-foreground">{goal.goalTitle}</p>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
      </div>

      <div className="flex items-center justify-between text-xs mb-2">
        <span className="text-muted-foreground">
          {t('goals.dayXOfY', { x: currentDay, y: goal.timeframe })}
        </span>
        <span className="text-muted-foreground">
          {completedCount}/{totalTasks} {t('common.today').toLowerCase()}
        </span>
      </div>

      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="h-full bg-primary rounded-full"
        />
      </div>
    </motion.div>
  );
};
