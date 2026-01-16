import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, BookOpen, Heart, Users, Moon, Gift, Calendar, Sparkles,
  ChevronRight, Clock, CheckCircle2, ArrowRight, ArrowLeft
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ActiveGoalView } from './ActiveGoalView';
import {
  getActiveGoal,
  createGoal,
  generateExtendedPlan,
  GoalConfig,
  WeekPlan,
} from '@/services/goalsStore';

interface Goal {
  id: string;
  titleKey: string;
  descriptionKey: string;
  icon: React.ReactNode;
  iconName: string;
  category: string;
}

const availableGoals: Goal[] = [
  {
    id: 'prayer-consistency',
    titleKey: 'goals.goalTypes.prayerConsistency.title',
    descriptionKey: 'goals.goalTypes.prayerConsistency.description',
    icon: <Moon className="w-5 h-5" />,
    iconName: 'Moon',
    category: 'worship',
  },
  {
    id: 'quran-reading',
    titleKey: 'goals.goalTypes.quranReading.title',
    descriptionKey: 'goals.goalTypes.quranReading.description',
    icon: <BookOpen className="w-5 h-5" />,
    iconName: 'BookOpen',
    category: 'learning',
  },
  {
    id: 'islamic-knowledge',
    titleKey: 'goals.goalTypes.islamicKnowledge.title',
    descriptionKey: 'goals.goalTypes.islamicKnowledge.description',
    icon: <Sparkles className="w-5 h-5" />,
    iconName: 'Sparkles',
    category: 'learning',
  },
  {
    id: 'dhikr-habit',
    titleKey: 'goals.goalTypes.dhikrHabit.title',
    descriptionKey: 'goals.goalTypes.dhikrHabit.description',
    icon: <Heart className="w-5 h-5" />,
    iconName: 'Heart',
    category: 'worship',
  },
  {
    id: 'character-improvement',
    titleKey: 'goals.goalTypes.characterImprovement.title',
    descriptionKey: 'goals.goalTypes.characterImprovement.description',
    icon: <Users className="w-5 h-5" />,
    iconName: 'Users',
    category: 'character',
  },
  {
    id: 'charity-giving',
    titleKey: 'goals.goalTypes.charityGiving.title',
    descriptionKey: 'goals.goalTypes.charityGiving.description',
    icon: <Gift className="w-5 h-5" />,
    iconName: 'Gift',
    category: 'worship',
  },
];

const timeframes = [
  { days: 7, labelKey: 'goals.timeframes.oneWeek', descKey: 'goals.quickChallenge' },
  { days: 30, labelKey: 'goals.timeframes.thirtyDays', descKey: 'goals.buildHabit' },
  { days: 90, labelKey: 'goals.timeframes.ninetyDays', descKey: 'goals.transformYourself' },
];

const levels = [
  { id: 'beginner', labelKey: 'goals.levels.beginner', descKey: 'goals.levelDescs.beginner' },
  { id: 'moderate', labelKey: 'goals.levels.moderate', descKey: 'goals.levelDescs.moderate' },
  { id: 'consistent', labelKey: 'goals.levels.consistent', descKey: 'goals.levelDescs.consistent' },
];

const dailyTimes = [5, 10, 15, 20, 30];

export const GoalSettingModule = () => {
  const { t } = useTranslation();
  const [hasActiveGoal, setHasActiveGoal] = useState(false);
  const [step, setStep] = useState<'select' | 'configure' | 'plan' | 'success'>('select');
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [timeframe, setTimeframe] = useState(30);
  const [level, setLevel] = useState<'beginner' | 'moderate' | 'consistent'>('beginner');
  const [dailyTime, setDailyTime] = useState(15);
  const [generatedPlan, setGeneratedPlan] = useState<WeekPlan[] | null>(null);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    checkActiveGoal();
  }, []);

  const checkActiveGoal = () => {
    const activeGoal = getActiveGoal();
    setHasActiveGoal(!!activeGoal);
  };

  const generatePlan = async () => {
    if (!selectedGoal) return;
    
    setGenerating(true);
    // Simulate generation delay for UX
    await new Promise(resolve => setTimeout(resolve, 1000));

    const plan = generateExtendedPlan(selectedGoal.id, timeframe, level);
    setGeneratedPlan(plan);
    setGenerating(false);
    setStep('plan');
  };

  const activateGoal = () => {
    if (!selectedGoal || !generatedPlan) return;

    createGoal(
      selectedGoal.id,
      t(selectedGoal.titleKey),
      selectedGoal.iconName,
      timeframe,
      level,
      dailyTime,
      generatedPlan
    );

    setStep('success');
  };

  const handleGoalEnded = () => {
    setHasActiveGoal(false);
    setStep('select');
    setSelectedGoal(null);
    setGeneratedPlan(null);
  };

  const handleSetAnotherGoal = () => {
    setStep('select');
    setSelectedGoal(null);
    setGeneratedPlan(null);
    checkActiveGoal();
  };

  // If there's an active goal, show the tracking view
  if (hasActiveGoal && step !== 'success') {
    return <ActiveGoalView onGoalEnded={handleGoalEnded} />;
  }

  return (
    <div className="space-y-4">
      <AnimatePresence mode="wait">
        {/* Step 1: Select Goal */}
        {step === 'select' && (
          <motion.div
            key="select"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div>
              <h2 className="text-lg font-bold text-foreground">{t('goals.setAGoal')}</h2>
              <p className="text-xs text-muted-foreground">{t('goals.chooseWhatToWorkOn')}</p>
            </div>

            <div className="space-y-3">
              {availableGoals.map((goal) => (
                <motion.button
                  key={goal.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setSelectedGoal(goal);
                    setStep('configure');
                  }}
                  className={cn(
                    "w-full p-4 rounded-2xl border text-left transition-all",
                    "bg-card/80 border-border/50 hover:border-primary/30"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      {goal.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm text-foreground">{t(goal.titleKey)}</h3>
                      <p className="text-xs text-muted-foreground">{t(goal.descriptionKey)}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 2: Configure Goal */}
        {step === 'configure' && selectedGoal && (
          <motion.div
            key="configure"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setStep('select')}
                className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center"
              >
                <ArrowLeft className="w-5 h-5 text-muted-foreground" />
              </button>
              <div>
                <h2 className="text-lg font-bold text-foreground">{t(selectedGoal.titleKey)}</h2>
                <p className="text-xs text-muted-foreground">{t('goals.configureYourPlan')}</p>
              </div>
            </div>

            {/* Timeframe Selection */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {t('goals.timeframe')}
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {timeframes.map((tf) => (
                  <motion.button
                    key={tf.days}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setTimeframe(tf.days)}
                    className={cn(
                      "p-3 rounded-xl border text-center transition-all",
                      timeframe === tf.days
                        ? "bg-primary/10 border-primary/50 text-primary"
                        : "bg-card/80 border-border/50"
                    )}
                  >
                    <p className="font-bold text-sm">{t(tf.labelKey)}</p>
                    <p className="text-[10px] text-muted-foreground">{t(tf.descKey)}</p>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Level Selection */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Target className="w-4 h-4" />
                {t('goals.yourLevel')}
              </h3>
              <div className="space-y-2">
                {levels.map((l) => (
                  <motion.button
                    key={l.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setLevel(l.id as any)}
                    className={cn(
                      "w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between",
                      level === l.id
                        ? "bg-primary/10 border-primary/50"
                        : "bg-card/80 border-border/50"
                    )}
                  >
                    <div>
                      <p className="font-semibold text-sm">{t(l.labelKey)}</p>
                      <p className="text-[10px] text-muted-foreground">{t(l.descKey)}</p>
                    </div>
                    {level === l.id && (
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Daily Time */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {t('goals.dailyTimeAvailable')}
              </h3>
              <div className="flex gap-2">
                {dailyTimes.map((time) => (
                  <motion.button
                    key={time}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setDailyTime(time)}
                    className={cn(
                      "flex-1 p-2 rounded-xl border text-center transition-all",
                      dailyTime === time
                        ? "bg-primary/10 border-primary/50 text-primary"
                        : "bg-card/80 border-border/50"
                    )}
                  >
                    <p className="font-bold text-sm">{time}</p>
                    <p className="text-[10px] text-muted-foreground">{t('common.min')}</p>
                  </motion.button>
                ))}
              </div>
            </div>

            <Button 
              onClick={generatePlan} 
              className="w-full"
              disabled={generating}
            >
              {generating ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                </motion.div>
              ) : (
                <Sparkles className="w-4 h-4 mr-2" />
              )}
              {generating ? t('goals.generatingPlan') : t('goals.generatePlan')}
            </Button>
          </motion.div>
        )}

        {/* Step 3: View Plan */}
        {step === 'plan' && selectedGoal && generatedPlan && (
          <motion.div
            key="plan"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setStep('configure')}
                className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center"
              >
                <ArrowLeft className="w-5 h-5 text-muted-foreground" />
              </button>
              <div>
                <h2 className="text-lg font-bold text-foreground">{t('goals.yourPlan')}</h2>
                <p className="text-xs text-muted-foreground">
                  {timeframe} {t('goals.days')} • {dailyTime} {t('goals.minPerDayShort')}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {generatedPlan.slice(0, 6).map((week, index) => (
                <motion.div
                  key={week.week}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-2xl bg-card/80 border border-border/50"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-sm text-foreground">
                      {t('goals.weekN', { n: week.week })}
                    </h3>
                    <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                      {week.milestone}
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {week.tasks.map((task, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <ArrowRight className="w-3 h-3 text-primary" />
                        {task}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
              
              {generatedPlan.length > 6 && (
                <p className="text-xs text-muted-foreground text-center py-2">
                  +{generatedPlan.length - 6} {t('goals.moreWeeks')}
                </p>
              )}
            </div>

            <Button onClick={activateGoal} className="w-full">
              {t('goals.startThisJourney')}
            </Button>
          </motion.div>
        )}

        {/* Step 4: Success */}
        {step === 'success' && selectedGoal && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8 space-y-4"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto"
            >
              <CheckCircle2 className="w-10 h-10 text-primary" />
            </motion.div>
            <div>
              <h2 className="text-xl font-bold text-foreground">{t('goals.goalSet')}</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {t('goals.journeyStartsNow', { timeframe })}
              </p>
            </div>
            <p className="text-xs text-muted-foreground px-8">
              {t('goals.mayAllahHelp')}
            </p>
            <Button 
              variant="outline" 
              onClick={handleSetAnotherGoal}
            >
              {t('goals.setAnotherGoal')}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
