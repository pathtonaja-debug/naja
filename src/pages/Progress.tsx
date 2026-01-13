import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, Flame, Star, Trophy, 
  ChevronLeft, CheckCircle2
} from 'lucide-react';
import { TopBar } from '@/components/ui/top-bar';
import BottomNav from '@/components/BottomNav';
import { useGuestProfile, SPIRITUAL_LEVELS } from '@/hooks/useGuestProfile';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

const Progress = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { profile, getProgress } = useGuestProfile();
  const [activeTab, setActiveTab] = useState<'weekly' | 'monthly'>('weekly');

  const progress = getProgress();
  const levelTitle = SPIRITUAL_LEVELS[profile.level - 1] || 'The Seeker';

  // Mock weekly data - in real app would come from localStorage
  const weeklyData = [
    { day: 'Sun', completed: 3, total: 7, points: 45 },
    { day: 'Mon', completed: 5, total: 7, points: 75 },
    { day: 'Tue', completed: 7, total: 7, points: 105 },
    { day: 'Wed', completed: 4, total: 7, points: 60 },
    { day: 'Thu', completed: 6, total: 7, points: 90 },
    { day: 'Fri', completed: 7, total: 7, points: 120 },
    { day: 'Sat', completed: 2, total: 7, points: 30 },
  ];

  const today = new Date().getDay();
  const totalWeeklyPoints = weeklyData.reduce((sum, d) => sum + d.points, 0);
  const avgCompletion = Math.round(weeklyData.reduce((sum, d) => sum + (d.completed / d.total) * 100, 0) / 7);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-pastel-cream pb-24"
    >
      <TopBar 
        title={t('profile.progress')} 
        leftElement={
          <button onClick={() => navigate(-1)} className="p-2 -ml-2">
            <ChevronLeft className="w-5 h-5" />
          </button>
        }
      />

      {/* Level Card */}
      <div className="px-4 pb-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-gradient-to-br from-pastel-lavender/50 to-pastel-pink/30 border border-pastel-lavender/30"
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-lg font-bold text-foreground">{levelTitle}</p>
              <p className="text-sm text-foreground/60">{t('dashboard.level')} {profile.level}</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-white/80 flex items-center justify-center shadow-sm">
              <span className="text-2xl font-bold text-foreground">{profile.level}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-foreground/60">{t('progress.progressToLevel')} {profile.level + 1}</span>
              <span className="font-medium text-foreground">{Math.round(progress.percentage)}%</span>
            </div>
            <div className="h-3 bg-white/50 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress.percentage}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-pastel-lavender rounded-full"
              />
            </div>
            <p className="text-xs text-foreground/50 text-center">
              {progress.current} / {progress.required} {t('dashboard.barakahPoints')}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Stats Row */}
      <div className="px-4 pb-4">
        <div className="grid grid-cols-3 gap-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-3 rounded-2xl bg-white border border-border/30 shadow-sm text-center"
          >
            <Star className="w-5 h-5 text-pastel-yellow mx-auto mb-1" />
            <p className="text-lg font-bold text-foreground">{profile.barakahPoints}</p>
            <p className="text-[10px] text-foreground/50">{t('progress.totalPoints')}</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="p-3 rounded-2xl bg-white border border-border/30 shadow-sm text-center"
          >
            <Flame className="w-5 h-5 text-orange-500 mx-auto mb-1" />
            <p className="text-lg font-bold text-foreground">{profile.hasanatStreak}</p>
            <p className="text-[10px] text-foreground/50">{t('progress.dayStreak')}</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-3 rounded-2xl bg-white border border-border/30 shadow-sm text-center"
          >
            <Trophy className="w-5 h-5 text-pastel-green mx-auto mb-1" />
            <p className="text-lg font-bold text-foreground">{avgCompletion}%</p>
            <p className="text-[10px] text-foreground/50">{t('progress.avgCompletion')}</p>
          </motion.div>
        </div>
      </div>

      {/* Tab Toggle */}
      <div className="px-4 pb-4">
        <div className="flex gap-2 p-1 rounded-xl bg-white border border-border/30">
          {(['weekly', 'monthly'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all",
                activeTab === tab
                  ? "bg-pastel-lavender text-foreground shadow-sm"
                  : "text-foreground/50"
              )}
            >
              {t(`progress.${tab}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Weekly View */}
      {activeTab === 'weekly' && (
        <div className="px-4 space-y-4">
          {/* Week Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl bg-white border border-border/30 shadow-sm"
          >
            <h3 className="text-sm font-semibold text-foreground mb-3">{t('progress.thisWeek')}</h3>
            <div className="flex justify-between items-end h-32">
              {weeklyData.map((day, i) => {
                const height = (day.completed / day.total) * 100;
                const isToday = i === today;
                
                return (
                  <div key={day.day} className="flex flex-col items-center gap-2 flex-1">
                    <div className="w-full px-1 h-24 flex items-end">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ delay: i * 0.05, duration: 0.5 }}
                        className={cn(
                          "w-full rounded-t-lg min-h-[4px]",
                          isToday ? "bg-pastel-pink" : 
                          day.completed === day.total ? "bg-pastel-green" : "bg-pastel-lavender/60"
                        )}
                      />
                    </div>
                    <span className={cn(
                      "text-xs font-medium",
                      isToday ? "text-foreground" : "text-foreground/40"
                    )}>
                      {t(`progress.days.${day.day.toLowerCase()}`)}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Daily Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-4 rounded-2xl bg-white border border-border/30 shadow-sm"
          >
            <h3 className="text-sm font-semibold text-foreground mb-3">{t('progress.dailyBreakdown')}</h3>
            <div className="space-y-2">
              {weeklyData.map((day, i) => {
                const isToday = i === today;
                const isComplete = day.completed === day.total;
                
                return (
                  <div 
                    key={day.day}
                    className={cn(
                      "flex items-center gap-3 p-2 rounded-lg",
                      isToday && "bg-pastel-cream"
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center",
                      isComplete ? "bg-pastel-green" : "bg-pastel-lavender/30"
                    )}>
                      {isComplete ? (
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      ) : (
                        <span className="text-xs font-medium text-foreground/60">{day.completed}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={cn(
                        "text-sm font-medium",
                        isToday ? "text-foreground" : "text-foreground/70"
                      )}>
                        {t(`progress.days.${day.day.toLowerCase()}`)}{isToday && ` (${t('common.today')})`}
                      </p>
                      <p className="text-xs text-foreground/50">
                        {day.completed}/{day.total} {t('progress.actsCompleted')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-foreground">+{day.points}</p>
                      <p className="text-[10px] text-foreground/40">{t('common.points')}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      )}

      {/* Monthly View */}
      {activeTab === 'monthly' && (
        <div className="px-4 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl bg-white border border-border/30 shadow-sm"
          >
            <h3 className="text-sm font-semibold text-foreground mb-3">{t('progress.monthYear')}</h3>
            
            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                <div key={`header-${i}`} className="text-center text-xs text-foreground/40 py-1">{d}</div>
              ))}
              {Array.from({ length: 31 }, (_, i) => {
                const day = i + 1;
                const isToday = day === 20;
                // Mock completion status
                const status = day < 20 ? (Math.random() > 0.3 ? 'complete' : 'partial') : 'future';
                
                return (
                  <motion.div
                    key={day}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.01 }}
                    className={cn(
                      "aspect-square rounded-lg flex items-center justify-center text-xs font-medium",
                      isToday && "ring-2 ring-pastel-pink",
                      status === 'complete' && "bg-pastel-green text-white",
                      status === 'partial' && "bg-pastel-lavender/50 text-foreground",
                      status === 'future' && "bg-pastel-cream text-foreground/30"
                    )}
                  >
                    {day}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Monthly Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-4 rounded-2xl bg-white border border-border/30 shadow-sm"
          >
            <h3 className="text-sm font-semibold text-foreground mb-3">{t('progress.monthlySummary')}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-2xl font-bold text-foreground">{totalWeeklyPoints * 4}</p>
                <p className="text-xs text-foreground/50">{t('progress.pointsEarned')}</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">85%</p>
                <p className="text-xs text-foreground/50">{t('progress.averageCompletion')}</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">18</p>
                <p className="text-xs text-foreground/50">{t('progress.perfectDays')}</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">140</p>
                <p className="text-xs text-foreground/50">{t('progress.actsCompletedTotal')}</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Niyyah disclaimer */}
      <div className="px-4 py-4">
        <p className="text-[10px] text-foreground/40 text-center italic">
          {t('dashboard.niyyahDisclaimer')}
        </p>
      </div>

      <BottomNav />
    </motion.div>
  );
};

export default Progress;
