import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, Flame, Check, Calendar, Clock, 
  ChevronRight, Pause, Play, X, Edit2, CheckCircle2,
  Moon, BookOpen, Heart, Users, Gift, Sparkles
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  getActiveGoal,
  getTodayCompletion,
  toggleTaskCompletion,
  markTodayComplete,
  getGoalStreak,
  getCurrentDayNumber,
  getCurrentWeekNumber,
  isWeekCompleted,
  getTodayTasks,
  pauseGoal,
  resumeGoal,
  clearActiveGoal,
  updateGoalDailyTime,
  getTodayReflection,
  saveReflection,
  GoalConfig,
  DayCompletion,
} from '@/services/goalsStore';

const iconMap: Record<string, React.ElementType> = {
  'Moon': Moon,
  'BookOpen': BookOpen,
  'Heart': Heart,
  'Users': Users,
  'Gift': Gift,
  'Sparkles': Sparkles,
};

interface ActiveGoalViewProps {
  onGoalEnded: () => void;
}

export const ActiveGoalView = ({ onGoalEnded }: ActiveGoalViewProps) => {
  const { t } = useTranslation();
  const [goal, setGoal] = useState<GoalConfig | null>(null);
  const [todayCompletion, setTodayCompletion] = useState<DayCompletion | null>(null);
  const [streak, setStreak] = useState(0);
  const [reflection, setReflection] = useState('');
  const [showEditTime, setShowEditTime] = useState(false);
  const [newDailyTime, setNewDailyTime] = useState(15);

  useEffect(() => {
    loadGoalData();
  }, []);

  const loadGoalData = () => {
    const activeGoal = getActiveGoal();
    setGoal(activeGoal);
    if (activeGoal) {
      setTodayCompletion(getTodayCompletion());
      setStreak(getGoalStreak());
      setReflection(getTodayReflection());
      setNewDailyTime(activeGoal.dailyTime);
    }
  };

  const handleToggleTask = (index: number) => {
    const updated = toggleTaskCompletion(index);
    setTodayCompletion(updated);
    setStreak(getGoalStreak());
  };

  const handleMarkComplete = () => {
    markTodayComplete();
    loadGoalData();
  };

  const handlePauseResume = () => {
    if (goal?.status === 'paused') {
      resumeGoal();
    } else {
      pauseGoal();
    }
    loadGoalData();
  };

  const handleEndGoal = () => {
    clearActiveGoal();
    onGoalEnded();
  };

  const handleSaveTime = () => {
    updateGoalDailyTime(newDailyTime);
    setShowEditTime(false);
    loadGoalData();
  };

  const handleReflectionChange = (text: string) => {
    setReflection(text);
    saveReflection(text);
  };

  if (!goal) return null;

  const IconComponent = iconMap[goal.goalIcon] || Target;
  const currentDay = getCurrentDayNumber();
  const currentWeek = getCurrentWeekNumber();
  const todayTasks = getTodayTasks(goal);
  const progress = (currentDay / goal.timeframe) * 100;
  const completedTasksCount = todayCompletion?.tasksCompleted.filter(Boolean).length || 0;
  const allTasksDone = completedTasksCount === todayTasks.length && todayTasks.length > 0;

  const dailyTimes = [5, 10, 15, 20, 30];

  return (
    <div className="space-y-4">
      {/* Paused Banner */}
      <AnimatePresence>
        {goal.status === 'paused' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-3 rounded-xl bg-warn/10 border border-warn/30 flex items-center justify-between"
          >
            <span className="text-sm text-warn font-medium">{t('goals.goalPaused')}</span>
            <Button size="sm" variant="ghost" onClick={handlePauseResume}>
              <Play className="w-4 h-4 mr-1" />
              {t('goals.resumeGoal')}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Goal Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
            <IconComponent className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-foreground">{goal.goalTitle}</h3>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span>{t('goals.dayXOfY', { x: currentDay, y: goal.timeframe })}</span>
              <span>•</span>
              <span>{t('goals.minPerDay', { m: goal.dailyTime })}</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{t('goals.levels.' + goal.level)}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-primary rounded-full"
            />
          </div>
        </div>
      </motion.div>

      {/* Today's Tasks */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-4 rounded-2xl bg-card border border-border"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-foreground">{t('goals.todaysTasks')}</h3>
          <span className="text-xs text-muted-foreground">
            {t('goals.tasksDoneToday', { done: completedTasksCount, total: todayTasks.length })}
          </span>
        </div>

        <div className="space-y-2 mb-4">
          {todayTasks.map((task, index) => {
            const isCompleted = todayCompletion?.tasksCompleted[index] || false;
            return (
              <motion.button
                key={index}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleToggleTask(index)}
                className={cn(
                  "w-full p-3 rounded-xl border text-left flex items-center gap-3 transition-all",
                  isCompleted
                    ? "bg-success/10 border-success/30"
                    : "bg-muted/30 border-border hover:border-primary/30"
                )}
              >
                <div className={cn(
                  "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                  isCompleted
                    ? "bg-success border-success"
                    : "border-muted-foreground"
                )}>
                  {isCompleted && <Check className="w-4 h-4 text-success-foreground" />}
                </div>
                <span className={cn(
                  "text-sm flex-1",
                  isCompleted ? "text-muted-foreground line-through" : "text-foreground"
                )}>
                  {task}
                </span>
              </motion.button>
            );
          })}
        </div>

        <Button
          onClick={handleMarkComplete}
          disabled={!allTasksDone || todayCompletion?.completed}
          className="w-full"
        >
          <CheckCircle2 className="w-4 h-4 mr-2" />
          {todayCompletion?.completed ? t('common.done') : t('goals.markTodayComplete')}
        </Button>
      </motion.div>

      {/* Weekly Milestones */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-4 rounded-2xl bg-card border border-border"
      >
        <h3 className="font-semibold text-foreground mb-3">{t('goals.weeklyMilestones')}</h3>
        
        <div className="space-y-2">
          {goal.weeklyPlan.slice(0, 6).map((week) => {
            const isCurrentWeek = week.week === currentWeek;
            const isCompleted = isWeekCompleted(week.week);
            const isPast = week.week < currentWeek;
            
            return (
              <div
                key={week.week}
                className={cn(
                  "p-3 rounded-xl border transition-all",
                  isCurrentWeek
                    ? "bg-primary/10 border-primary/30"
                    : isCompleted || isPast
                    ? "bg-muted/30 border-border"
                    : "bg-muted/10 border-border/50 opacity-60"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-success" />
                    ) : isCurrentWeek ? (
                      <Calendar className="w-5 h-5 text-primary" />
                    ) : (
                      <Calendar className="w-5 h-5 text-muted-foreground" />
                    )}
                    <span className={cn(
                      "font-medium text-sm",
                      isCurrentWeek ? "text-primary" : "text-foreground"
                    )}>
                      {t('goals.weekN', { n: week.week })}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground px-2 py-1 rounded-full bg-muted/50">
                    {week.milestone}
                  </span>
                </div>
              </div>
            );
          })}
          
          {goal.weeklyPlan.length > 6 && (
            <p className="text-xs text-muted-foreground text-center py-2">
              +{goal.weeklyPlan.length - 6} {t('goals.moreWeeks')}
            </p>
          )}
        </div>
      </motion.div>

      {/* Streak & Reflection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-4 rounded-2xl bg-card border border-border"
      >
        <div className="flex items-center gap-2 mb-3">
          <Flame className="w-5 h-5 text-destructive" />
          <span className="font-semibold">{t('goals.streakDays', { n: streak })}</span>
        </div>
        
        <div>
          <label className="text-xs text-muted-foreground block mb-2">
            {t('goals.whatHelpedYou')}
          </label>
          <input
            type="text"
            value={reflection}
            onChange={(e) => handleReflectionChange(e.target.value)}
            placeholder={t('goals.reflectionPlaceholder')}
            className="w-full p-3 rounded-xl bg-muted/30 border border-border text-sm focus:outline-none focus:border-primary/50"
          />
        </div>
      </motion.div>

      {/* Manage Goal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="p-4 rounded-2xl bg-card border border-border"
      >
        <h3 className="font-semibold text-foreground mb-3">{t('goals.manageGoal')}</h3>
        
        <div className="space-y-2">
          {/* Edit Daily Time */}
          <AnimatePresence>
            {showEditTime ? (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-3 rounded-xl bg-muted/30 border border-border"
              >
                <p className="text-sm font-medium mb-2">{t('goals.editDailyTime')}</p>
                <div className="flex gap-2 mb-2">
                  {dailyTimes.map((time) => (
                    <button
                      key={time}
                      onClick={() => setNewDailyTime(time)}
                      className={cn(
                        "flex-1 p-2 rounded-lg text-sm transition-all",
                        newDailyTime === time
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted/50"
                      )}
                    >
                      {time}m
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSaveTime} className="flex-1">
                    {t('common.save')}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setShowEditTime(false)}>
                    {t('common.cancel')}
                  </Button>
                </div>
              </motion.div>
            ) : (
              <button
                onClick={() => setShowEditTime(true)}
                className="w-full p-3 rounded-xl bg-muted/30 border border-border text-left flex items-center justify-between hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Edit2 className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{t('goals.editDailyTime')}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </AnimatePresence>

          {/* Pause/Resume */}
          <button
            onClick={handlePauseResume}
            className="w-full p-3 rounded-xl bg-muted/30 border border-border text-left flex items-center justify-between hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-2">
              {goal.status === 'paused' ? (
                <>
                  <Play className="w-4 h-4 text-success" />
                  <span className="text-sm">{t('goals.resumeGoal')}</span>
                </>
              ) : (
                <>
                  <Pause className="w-4 h-4 text-warn" />
                  <span className="text-sm">{t('goals.pauseGoal')}</span>
                </>
              )}
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>

          {/* End Goal */}
          <button
            onClick={handleEndGoal}
            className="w-full p-3 rounded-xl bg-destructive/10 border border-destructive/30 text-left flex items-center justify-between hover:bg-destructive/20 transition-colors"
          >
            <div className="flex items-center gap-2">
              <X className="w-4 h-4 text-destructive" />
              <span className="text-sm text-destructive">{t('goals.endGoal')}</span>
            </div>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
