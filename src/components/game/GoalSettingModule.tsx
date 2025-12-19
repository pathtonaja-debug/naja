import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, BookOpen, Heart, Users, Moon, Gift, Calendar, Sparkles,
  ChevronRight, Clock, CheckCircle2, ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Goal {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: string;
}

interface GoalPlan {
  goal: Goal;
  timeframe: number;
  level: 'beginner' | 'moderate' | 'consistent';
  dailyTime: number;
  weeklyPlan: WeekPlan[];
}

interface WeekPlan {
  week: number;
  tasks: string[];
  milestone: string;
}

const availableGoals: Goal[] = [
  {
    id: 'prayer-consistency',
    title: 'Improve Prayer Consistency',
    description: 'Build a strong habit of praying all five daily prayers',
    icon: <Moon className="w-5 h-5" />,
    category: 'worship',
  },
  {
    id: 'quran-reading',
    title: 'Read More Quran',
    description: 'Develop a daily Quran reading habit',
    icon: <BookOpen className="w-5 h-5" />,
    category: 'learning',
  },
  {
    id: 'islamic-knowledge',
    title: 'Increase Islamic Knowledge',
    description: 'Learn more about Islam through daily study',
    icon: <Sparkles className="w-5 h-5" />,
    category: 'learning',
  },
  {
    id: 'dhikr-habit',
    title: 'Build Daily Dhikr Habit',
    description: 'Remember Allah through consistent dhikr',
    icon: <Heart className="w-5 h-5" />,
    category: 'worship',
  },
  {
    id: 'character-improvement',
    title: 'Improve Character (Akhlaq)',
    description: 'Work on patience, kindness, and other virtues',
    icon: <Users className="w-5 h-5" />,
    category: 'character',
  },
  {
    id: 'charity-giving',
    title: 'Give More Charity',
    description: 'Build a habit of regular giving',
    icon: <Gift className="w-5 h-5" />,
    category: 'worship',
  },
];

const timeframes = [
  { days: 7, label: '1 Week', description: 'Quick challenge' },
  { days: 30, label: '30 Days', description: 'Build a habit' },
  { days: 90, label: '90 Days', description: 'Transform yourself' },
];

const levels = [
  { id: 'beginner', label: 'Beginner', description: 'Just starting out' },
  { id: 'moderate', label: 'Moderate', description: 'Some experience' },
  { id: 'consistent', label: 'Consistent', description: 'Already practicing' },
];

const dailyTimes = [5, 10, 15, 20, 30];

export const GoalSettingModule = () => {
  const [step, setStep] = useState<'select' | 'configure' | 'plan' | 'active'>('select');
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [timeframe, setTimeframe] = useState(30);
  const [level, setLevel] = useState<'beginner' | 'moderate' | 'consistent'>('beginner');
  const [dailyTime, setDailyTime] = useState(15);
  const [generatedPlan, setGeneratedPlan] = useState<WeekPlan[] | null>(null);
  const [generating, setGenerating] = useState(false);

  const generatePlan = async () => {
    if (!selectedGoal) return;
    
    setGenerating(true);
    // Simulate AI generation (in production, call AI endpoint)
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Generate a sample plan based on goal and settings
    const weekCount = Math.ceil(timeframe / 7);
    const plan: WeekPlan[] = [];

    const planTemplates: Record<string, WeekPlan[]> = {
      'prayer-consistency': [
        { week: 1, tasks: ['Track 2 daily prayers', 'Set prayer reminders', 'Learn prayer focus tips'], milestone: 'Establish tracking habit' },
        { week: 2, tasks: ['Track 3-4 daily prayers', 'Add Sunnah prayers', 'Improve concentration'], milestone: 'Increase consistency' },
        { week: 3, tasks: ['Track all 5 prayers', 'Pray on time', 'Add khushu practices'], milestone: 'Full prayer coverage' },
        { week: 4, tasks: ['Maintain all prayers', 'Add night prayer', 'Deepen reflection'], milestone: 'Complete transformation' },
      ],
      'quran-reading': [
        { week: 1, tasks: ['Read 1 page daily', 'Learn 3 new words', 'Listen to recitation'], milestone: 'Start reading habit' },
        { week: 2, tasks: ['Read 2 pages daily', 'Study tafsir of 1 ayah', 'Memorize short surah'], milestone: 'Increase reading' },
        { week: 3, tasks: ['Read 3 pages daily', 'Reflect on meanings', 'Join Quran circle'], milestone: 'Deepen understanding' },
        { week: 4, tasks: ['Read consistently', 'Complete a juz', 'Share learnings'], milestone: 'Establish routine' },
      ],
    };

    const template = planTemplates[selectedGoal.id] || planTemplates['prayer-consistency'];
    for (let i = 0; i < Math.min(weekCount, template.length); i++) {
      plan.push(template[i]);
    }

    setGeneratedPlan(plan);
    setGenerating(false);
    setStep('plan');
  };

  const activateGoal = () => {
    // In production, save goal to database
    setStep('active');
  };

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
              <h2 className="text-lg font-bold text-foreground">Set a Goal</h2>
              <p className="text-xs text-muted-foreground">Choose what you'd like to work on</p>
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
                      <h3 className="font-semibold text-sm text-foreground">{goal.title}</h3>
                      <p className="text-xs text-muted-foreground">{goal.description}</p>
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
                className="text-muted-foreground hover:text-foreground"
              >
                ←
              </button>
              <div>
                <h2 className="text-lg font-bold text-foreground">{selectedGoal.title}</h2>
                <p className="text-xs text-muted-foreground">Configure your plan</p>
              </div>
            </div>

            {/* Timeframe Selection */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Timeframe
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
                    <p className="font-bold text-sm">{tf.label}</p>
                    <p className="text-[10px] text-muted-foreground">{tf.description}</p>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Level Selection */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Target className="w-4 h-4" />
                Your Level
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
                      <p className="font-semibold text-sm">{l.label}</p>
                      <p className="text-[10px] text-muted-foreground">{l.description}</p>
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
                Daily Time Available
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
                    <p className="text-[10px] text-muted-foreground">min</p>
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
              {generating ? 'Generating Your Plan...' : 'Generate AI Plan'}
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
                className="text-muted-foreground hover:text-foreground"
              >
                ←
              </button>
              <div>
                <h2 className="text-lg font-bold text-foreground">Your AI Plan</h2>
                <p className="text-xs text-muted-foreground">{timeframe} days • {dailyTime} min/day</p>
              </div>
            </div>

            <div className="space-y-4">
              {generatedPlan.map((week, index) => (
                <motion.div
                  key={week.week}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-2xl bg-card/80 border border-border/50"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-sm text-foreground">Week {week.week}</h3>
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
            </div>

            <Button onClick={activateGoal} className="w-full">
              Start This Journey
            </Button>
          </motion.div>
        )}

        {/* Step 4: Active Goal */}
        {step === 'active' && selectedGoal && (
          <motion.div
            key="active"
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
              <h2 className="text-xl font-bold text-foreground">Goal Set!</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Your {timeframe}-day journey starts now
              </p>
            </div>
            <p className="text-xs text-muted-foreground px-8">
              Check your Daily Quests for today's tasks. May Allah make it easy for you!
            </p>
            <Button 
              variant="outline" 
              onClick={() => {
                setStep('select');
                setSelectedGoal(null);
                setGeneratedPlan(null);
              }}
            >
              Set Another Goal
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
