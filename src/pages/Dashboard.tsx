import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Target, Coins, Brain, Settings, Bell,
  ChevronRight, Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '@/components/BottomNav';
import { GameXPBar } from '@/components/game/GameXPBar';
import { DailyPracticeModule } from '@/components/game/DailyPracticeModule';
import { QuickQuizWidget } from '@/components/game/QuickQuizWidget';
import { LevelUpModal } from '@/components/gamification/LevelUpModal';
import { useGamification } from '@/hooks/useGamification';
import { useProfile } from '@/hooks/useProfile';
import { Skeleton } from '@/components/ui/skeleton';
import ErrorBoundary from '@/components/ErrorBoundary';
import { cn } from '@/lib/utils';

const Dashboard = () => {
  const navigate = useNavigate();
  const { profile, loading: profileLoading } = useProfile();
  const { gamification, loading: gamificationLoading, refetch } = useGamification();
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [newLevel, setNewLevel] = useState(1);
  const [activeTab, setActiveTab] = useState<'quests' | 'goals' | 'learn'>('quests');

  const handleXPGained = (amount: number) => {
    // Refetch gamification data after XP is gained
    refetch();
  };

  const loading = profileLoading || gamificationLoading;

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Quick access modules
  const quickModules = [
    { 
      id: 'achievements', 
      title: 'Achievements', 
      icon: <Trophy className="w-5 h-5" />, 
      color: 'from-yellow-500 to-orange-500',
      path: '/achievements'
    },
    { 
      id: 'goals', 
      title: 'Goals', 
      icon: <Target className="w-5 h-5" />, 
      color: 'from-blue-500 to-cyan-500',
      path: '/goals'
    },
    { 
      id: 'fintech', 
      title: 'Finance', 
      icon: <Coins className="w-5 h-5" />, 
      color: 'from-green-500 to-emerald-500',
      path: '/fintech'
    },
    { 
      id: 'quiz', 
      title: 'Quiz', 
      icon: <Brain className="w-5 h-5" />, 
      color: 'from-purple-500 to-indigo-500',
      path: '/quiz'
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-24">
        <div className="p-4 space-y-4">
          <Skeleton className="h-12 w-48" />
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-20 rounded-2xl" />
          <div className="grid grid-cols-4 gap-3">
            {[1,2,3,4].map(i => <Skeleton key={i} className="h-20 rounded-xl" />)}
          </div>
          <Skeleton className="h-64 rounded-2xl" />
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background pb-24"
    >
      {/* Header */}
      <div className="px-4 pt-4 pb-2 flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">{getGreeting()}</p>
          <h1 className="text-xl font-bold text-foreground">
            {profile?.display_name || 'Player'}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center"
          >
            <Bell className="w-5 h-5 text-muted-foreground" />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/profile')}
            className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center"
          >
            <Settings className="w-5 h-5 text-muted-foreground" />
          </motion.button>
        </div>
      </div>

      {/* XP & Level Bar */}
      <div className="px-4 py-2">
        <ErrorBoundary fallback={<div className="h-32 bg-muted rounded-2xl" />}>
          <GameXPBar 
            xp={gamification?.xp || 0}
            level={gamification?.level || 1}
            streak={gamification?.streak_days || 0}
          />
        </ErrorBoundary>
      </div>

      {/* Daily Quiz Widget */}
      <div className="px-4 py-2">
        <ErrorBoundary fallback={<div className="h-16 bg-muted rounded-2xl" />}>
          <QuickQuizWidget onStartQuiz={() => navigate('/quiz')} />
        </ErrorBoundary>
      </div>

      {/* Quick Access Modules */}
      <div className="px-4 py-2">
        <div className="grid grid-cols-4 gap-2">
          {quickModules.map((module, index) => (
            <motion.button
              key={module.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(module.path)}
              className="flex flex-col items-center gap-1 p-3 rounded-xl bg-card/80 border border-border/50"
            >
              <div className={cn(
                "w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center text-white",
                module.color
              )}>
                {module.icon}
              </div>
              <span className="text-[10px] font-medium text-foreground">{module.title}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="px-4 py-2">
        <div className="flex gap-2 p-1 rounded-xl bg-muted/30">
          {(['quests', 'goals', 'learn'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all capitalize",
                activeTab === tab
                  ? "bg-card shadow-sm text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {tab === 'quests' ? 'Daily Quests' : tab === 'goals' ? 'My Goals' : 'Learn'}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-4 py-2">
        <AnimatePresence mode="wait">
          {activeTab === 'quests' && (
            <motion.div
              key="quests"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <ErrorBoundary fallback={<div className="h-64 bg-muted rounded-2xl" />}>
                <DailyPracticeModule onXPGained={handleXPGained} />
              </ErrorBoundary>
            </motion.div>
          )}

          {activeTab === 'goals' && (
            <motion.div
              key="goals"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              <div className="text-center py-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4"
                >
                  <Target className="w-8 h-8 text-primary" />
                </motion.div>
                <h3 className="font-bold text-foreground">No Active Goals</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Set a spiritual goal and get an AI-generated plan
                </p>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/goals')}
                  className="mt-4 px-6 py-2 rounded-full bg-primary text-primary-foreground font-medium text-sm"
                >
                  Set a Goal
                </motion.button>
              </div>
            </motion.div>
          )}

          {activeTab === 'learn' && (
            <motion.div
              key="learn"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-3"
            >
              {/* Learning Categories */}
              {[
                { title: 'Daily Quiz', desc: 'Test your Islamic knowledge', icon: <Brain className="w-5 h-5" />, path: '/quiz' },
                { title: 'Ethical Finance', desc: 'Learn Islamic finance basics', icon: <Coins className="w-5 h-5" />, path: '/fintech' },
                { title: 'Progress & Stats', desc: 'View your learning journey', icon: <Trophy className="w-5 h-5" />, path: '/progress' },
              ].map((item, index) => (
                <motion.button
                  key={item.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(item.path)}
                  className="w-full p-4 rounded-2xl bg-card/80 border border-border/50 text-left flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm text-foreground">{item.title}</h3>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Level Up Modal */}
      <LevelUpModal 
        isOpen={showLevelUp} 
        onClose={() => setShowLevelUp(false)} 
        level={newLevel} 
      />

      <BottomNav />
    </motion.div>
  );
};

export default Dashboard;
