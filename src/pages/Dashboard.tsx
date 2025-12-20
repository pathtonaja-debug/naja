import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, Heart, PenLine, GraduationCap, Calendar, 
  ChevronRight, Flame, Star, Trophy, Coins
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '@/components/BottomNav';
import { useGuestProfile, SPIRITUAL_LEVELS } from '@/hooks/useGuestProfile';
import { cn } from '@/lib/utils';

const Dashboard = () => {
  const navigate = useNavigate();
  const { profile, todayPoints, actsCompleted } = useGuestProfile();

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Assalamu Alaikum';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Quick access tiles - including Finance
  const quickTiles = [
    { id: 'practices', title: 'Practices', icon: <Star className="w-5 h-5" />, path: '/practices', color: 'bg-pastel-lavender' },
    { id: 'quran', title: "Qur'an", icon: <BookOpen className="w-5 h-5" />, path: '/quran', color: 'bg-pastel-green' },
    { id: 'dua', title: 'Dua', icon: <Heart className="w-5 h-5" />, path: '/dua', color: 'bg-pastel-pink' },
    { id: 'journal', title: 'Journal', icon: <PenLine className="w-5 h-5" />, path: '/journal', color: 'bg-pastel-yellow' },
    { id: 'learn', title: 'Learn', icon: <GraduationCap className="w-5 h-5" />, path: '/learn', color: 'bg-pastel-blue' },
    { id: 'dates', title: 'Dates', icon: <Calendar className="w-5 h-5" />, path: '/dates', color: 'bg-pastel-lavender' },
    { id: 'fintech', title: 'Finance', icon: <Coins className="w-5 h-5" />, path: '/fintech', color: 'bg-pastel-green' },
    { id: 'progress', title: 'Progress', icon: <Trophy className="w-5 h-5" />, path: '/progress', color: 'bg-pastel-yellow' },
  ];

  const levelProgress = profile.level < 10 
    ? Math.floor((profile.barakahPoints % 100) / 100 * 100) 
    : 100;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-pastel-cream pb-24"
    >
      {/* Header */}
      <div className="px-4 pt-6 pb-4">
        <p className="text-sm text-foreground/60">{getGreeting()}</p>
        <h1 className="text-2xl font-bold text-foreground">
          {profile.displayName}
        </h1>
      </div>

      {/* Stats Cards Row */}
      <div className="px-4 pb-4">
        <div className="grid grid-cols-3 gap-3">
          {/* Barakah Points */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded-2xl bg-white border border-border/30 shadow-sm"
          >
            <div className="flex items-center gap-1.5 mb-1">
              <Star className="w-4 h-4 text-pastel-yellow" />
              <span className="text-xs text-foreground/60">Today</span>
            </div>
            <p className="text-xl font-bold text-foreground">{todayPoints}</p>
            <p className="text-[10px] text-foreground/50">Barakah Points</p>
          </motion.div>

          {/* Hasanat Streak */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="p-3 rounded-2xl bg-white border border-border/30 shadow-sm"
          >
            <div className="flex items-center gap-1.5 mb-1">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-xs text-foreground/60">Streak</span>
            </div>
            <p className="text-xl font-bold text-foreground">{profile.hasanatStreak}</p>
            <p className="text-[10px] text-foreground/50">Hasanat Streak</p>
          </motion.div>

          {/* Acts Completed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-3 rounded-2xl bg-white border border-border/30 shadow-sm"
          >
            <div className="flex items-center gap-1.5 mb-1">
              <Trophy className="w-4 h-4 text-pastel-green" />
              <span className="text-xs text-foreground/60">Done</span>
            </div>
            <p className="text-xl font-bold text-foreground">{actsCompleted}</p>
            <p className="text-[10px] text-foreground/50">Acts today</p>
          </motion.div>
        </div>
      </div>

      {/* Level Progress Card */}
      <div className="px-4 pb-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="p-4 rounded-2xl bg-white border border-border/30 shadow-sm"
        >
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-sm font-semibold text-foreground">{SPIRITUAL_LEVELS[profile.level - 1] || 'The Seeker'}</p>
              <p className="text-xs text-foreground/50">Level {profile.level}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-foreground">{profile.barakahPoints}</p>
              <p className="text-xs text-foreground/50">Total Points</p>
            </div>
          </div>
          <div className="h-2 bg-pastel-lavender/30 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${levelProgress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full bg-pastel-lavender rounded-full"
            />
          </div>
          <p className="text-[10px] text-foreground/40 mt-2 text-center italic">
            Your niyyah is what matters — points are just a tool to help you stay consistent.
          </p>
        </motion.div>
      </div>

      {/* Today's Acts for Allah */}
      <div className="px-4 pb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-foreground">Today's Acts for Allah</h2>
          <button 
            onClick={() => navigate('/practices')}
            className="text-xs text-foreground/60 flex items-center gap-1"
          >
            View all <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-4 rounded-2xl bg-white border border-border/30 shadow-sm"
        >
          <TodaysActsPreview onNavigate={() => navigate('/practices')} />
        </motion.div>
      </div>

      {/* Quick Access Tiles */}
      <div className="px-4 pb-4">
        <h2 className="text-lg font-bold text-foreground mb-3">Quick Access</h2>
        <div className="grid grid-cols-4 gap-3">
          {quickTiles.map((tile, index) => (
            <motion.button
              key={tile.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + index * 0.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(tile.path)}
              className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white border border-border/30 shadow-sm"
            >
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", tile.color)}>
                {tile.icon}
              </div>
              <span className="text-[10px] font-medium text-foreground">{tile.title}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Progress Snapshot */}
      <div className="px-4 pb-4">
        <h2 className="text-lg font-bold text-foreground mb-3">This Week</h2>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-4 rounded-2xl bg-white border border-border/30 shadow-sm"
        >
          <WeeklyProgressPreview />
        </motion.div>
      </div>

      <BottomNav />
    </motion.div>
  );
};

// Today's Acts Preview Component
const TodaysActsPreview = ({ onNavigate }: { onNavigate: () => void }) => {
  const acts = [
    { name: 'Fajr Prayer', done: false },
    { name: 'Dhuhr Prayer', done: false },
    { name: 'Asr Prayer', done: false },
    { name: 'Maghrib Prayer', done: false },
    { name: 'Isha Prayer', done: false },
  ];

  return (
    <div className="space-y-2">
      {acts.slice(0, 3).map((act, i) => (
        <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-pastel-cream/50 transition-colors">
          <div className={cn(
            "w-5 h-5 rounded-full border-2 flex items-center justify-center",
            act.done ? "bg-pastel-green border-pastel-green" : "border-foreground/20"
          )}>
            {act.done && <span className="text-white text-xs">✓</span>}
          </div>
          <span className={cn("text-sm", act.done ? "text-foreground/50 line-through" : "text-foreground")}>
            {act.name}
          </span>
        </div>
      ))}
      <button 
        onClick={onNavigate}
        className="w-full py-2 text-xs text-foreground/60 hover:text-foreground transition-colors"
      >
        + {acts.length - 3} more acts
      </button>
    </div>
  );
};

// Weekly Progress Preview
const WeeklyProgressPreview = () => {
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const today = new Date().getDay();
  
  // Mock data - would come from local storage in real implementation
  const weekData = [false, true, true, false, true, true, false];

  return (
    <div className="flex items-center justify-between">
      {days.map((day, i) => {
        const isToday = i === today;
        const isComplete = weekData[i];
        
        return (
          <div key={i} className="flex flex-col items-center gap-2">
            <span className={cn(
              "text-xs font-medium",
              isToday ? "text-foreground" : "text-foreground/40"
            )}>
              {day}
            </span>
            <motion.div 
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center border-2",
                isComplete 
                  ? "bg-pastel-green border-pastel-green" 
                  : isToday 
                    ? "border-pastel-pink bg-pastel-pink/20" 
                    : "border-foreground/10"
              )}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.05 }}
            >
              {isComplete && <span className="text-white text-sm">✓</span>}
            </motion.div>
          </div>
        );
      })}
    </div>
  );
};

export default Dashboard;
