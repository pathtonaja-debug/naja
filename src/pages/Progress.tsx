import { useState, useEffect, useCallback } from 'react';
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
import { format, startOfWeek, addDays, isSameDay, isToday, subDays, getDaysInMonth, startOfMonth } from 'date-fns';
import { 
  getAllDailyProgress, 
  calculateStreakFromProgress,
  DailyProgress as FullDailyProgress 
} from '@/services/dailyProgressService';

// Simplified type for display
interface DailyProgressDisplay {
  date: string;
  completed: number;
  total: number;
  points: number;
}

const STORAGE_KEY = 'naja_daily_progress_v1';

// Get stored daily progress
function getDailyProgress(): Record<string, DailyProgressDisplay> {
  const all = getAllDailyProgress();
  const result: Record<string, DailyProgressDisplay> = {};
  
  for (const [key, value] of Object.entries(all)) {
    result[key] = {
      date: value.date,
      completed: value.completed,
      total: value.total,
      points: value.points,
    };
  }
  
  return result;
}

const Progress = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { profile, getProgress, refetch } = useGuestProfile();
  const [activeTab, setActiveTab] = useState<'weekly' | 'monthly'>('weekly');
  const [weeklyData, setWeeklyData] = useState<DailyProgressDisplay[]>([]);
  const [monthlyData, setMonthlyData] = useState<Record<string, DailyProgressDisplay>>({});
  const [calculatedStreak, setCalculatedStreak] = useState(0);

  const progress = getProgress();
  const levelTitle = SPIRITUAL_LEVELS[profile.level - 1] || 'The Seeker';

  // Load progress data
  const loadProgressData = useCallback(() => {
    const allProgress = getDailyProgress();
    
    // Calculate streak from progress data
    setCalculatedStreak(calculateStreakFromProgress());
    
    // Build weekly data (current week, starting Monday)
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    const weekData: DailyProgressDisplay[] = [];
    
    for (let i = 0; i < 7; i++) {
      const date = addDays(weekStart, i);
      const dateKey = format(date, 'yyyy-MM-dd');
      const dayProgress = allProgress[dateKey];
      
      weekData.push({
        date: dateKey,
        completed: dayProgress?.completed || 0,
        total: dayProgress?.total || 0,
        points: dayProgress?.points || 0,
      });
    }
    
    setWeeklyData(weekData);
    setMonthlyData(allProgress);
    refetch();
  }, [refetch]);

  useEffect(() => {
    loadProgressData();
  }, [loadProgressData]);

  // Reload when page becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadProgressData();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [loadProgressData]);

  const today = new Date();
  const todayIndex = weeklyData.findIndex(d => d.date === format(today, 'yyyy-MM-dd'));
  const totalWeeklyPoints = weeklyData.reduce((sum, d) => sum + d.points, 0);
  
  // Calculate avg completion only for days that have data
  const daysWithData = weeklyData.filter(d => d.total > 0);
  const avgCompletion = daysWithData.length > 0 
    ? Math.round(daysWithData.reduce((sum, d) => sum + (d.completed / d.total) * 100, 0) / daysWithData.length)
    : 0;

  // Monthly calculations
  const currentMonth = new Date();
  const daysInMonth = getDaysInMonth(currentMonth);
  const monthStart = startOfMonth(currentMonth);
  
  const monthlyProgress = Array.from({ length: daysInMonth }, (_, i) => {
    const date = addDays(monthStart, i);
    const dateKey = format(date, 'yyyy-MM-dd');
    return {
      day: i + 1,
      date: dateKey,
      progress: monthlyData[dateKey],
      isToday: isToday(date),
      isFuture: date > today,
    };
  });

  const monthlyPointsTotal = Object.values(monthlyData)
    .filter(p => p.date.startsWith(format(currentMonth, 'yyyy-MM')))
    .reduce((sum, p) => sum + p.points, 0);

  const completedDaysThisMonth = monthlyProgress.filter(d => d.progress && d.progress.completed === d.progress.total && d.progress.total > 0).length;
  const daysWithActsThisMonth = monthlyProgress.filter(d => d.progress && d.progress.total > 0);
  const monthlyAvgCompletion = daysWithActsThisMonth.length > 0
    ? Math.round(daysWithActsThisMonth.reduce((sum, d) => sum + ((d.progress?.completed || 0) / (d.progress?.total || 1)) * 100, 0) / daysWithActsThisMonth.length)
    : 0;
  const totalActsThisMonth = daysWithActsThisMonth.reduce((sum, d) => sum + (d.progress?.completed || 0), 0);

  const dayNames = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background pb-24"
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
          className="p-4 rounded-2xl bg-gradient-to-br from-secondary/20 to-primary/10 border border-secondary/30"
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-lg font-bold text-foreground">{levelTitle}</p>
              <p className="text-sm text-muted-foreground">{t('dashboard.level')} {profile.level}</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-card flex items-center justify-center shadow-sm">
              <span className="text-2xl font-bold text-foreground">{profile.level}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">{t('progress.progressToLevel')} {profile.level + 1}</span>
              <span className="font-medium text-foreground">{Math.round(progress.percentage)}%</span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress.percentage}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-secondary rounded-full"
              />
            </div>
            <p className="text-xs text-muted-foreground text-center">
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
            className="p-3 rounded-2xl bg-card border border-border shadow-sm text-center"
          >
            <Star className="w-5 h-5 text-warn mx-auto mb-1" />
            <p className="text-lg font-bold text-foreground">{profile.barakahPoints}</p>
            <p className="text-[10px] text-muted-foreground">{t('progress.totalPoints')}</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="p-3 rounded-2xl bg-card border border-border shadow-sm text-center"
          >
            <Flame className="w-5 h-5 text-destructive mx-auto mb-1" />
            <p className="text-lg font-bold text-foreground">{calculatedStreak || profile.hasanatStreak}</p>
            <p className="text-[10px] text-muted-foreground">{t('progress.dayStreak')}</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-3 rounded-2xl bg-card border border-border shadow-sm text-center"
          >
            <Trophy className="w-5 h-5 text-success mx-auto mb-1" />
            <p className="text-lg font-bold text-foreground">{avgCompletion}%</p>
            <p className="text-[10px] text-muted-foreground">{t('progress.avgCompletion')}</p>
          </motion.div>
        </div>
      </div>

      {/* Tab Toggle */}
      <div className="px-4 pb-4">
        <div className="flex gap-2 p-1 rounded-xl bg-card border border-border">
          {(['weekly', 'monthly'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all",
                activeTab === tab
                  ? "bg-secondary text-secondary-foreground shadow-sm"
                  : "text-muted-foreground"
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
            className="p-4 rounded-2xl bg-card border border-border shadow-sm"
          >
            <h3 className="text-sm font-semibold text-foreground mb-3">{t('progress.thisWeek')}</h3>
            
            {daysWithData.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground text-sm">{t('progress.noDataYet')}</p>
                <p className="text-xs text-muted-foreground mt-1">{t('progress.startTracking')}</p>
              </div>
            ) : (
              <div className="flex justify-between items-end h-32">
                {weeklyData.map((day, i) => {
                  const height = day.total > 0 ? (day.completed / day.total) * 100 : 0;
                  const isCurrentDay = i === todayIndex;
                  const dayDate = new Date(day.date);
                  const dayName = dayNames[dayDate.getDay()];
                  
                  return (
                    <div key={day.date} className="flex flex-col items-center gap-2 flex-1">
                      <div className="w-full px-1 h-24 flex items-end">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${Math.max(height, day.total > 0 ? 4 : 0)}%` }}
                          transition={{ delay: i * 0.05, duration: 0.5 }}
                          className={cn(
                            "w-full rounded-t-lg",
                            day.total === 0 ? "bg-muted/30" :
                            isCurrentDay ? "bg-primary" : 
                            day.completed === day.total ? "bg-success" : "bg-secondary/60"
                          )}
                          style={{ minHeight: day.total > 0 ? '4px' : '0' }}
                        />
                      </div>
                      <span className={cn(
                        "text-xs font-medium",
                        isCurrentDay ? "text-foreground" : "text-muted-foreground"
                      )}>
                        {t(`progress.days.${dayName}`)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>

          {/* Daily Breakdown */}
          {daysWithData.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-4 rounded-2xl bg-card border border-border shadow-sm"
            >
              <h3 className="text-sm font-semibold text-foreground mb-3">{t('progress.dailyBreakdown')}</h3>
              <div className="space-y-2">
                {weeklyData.filter(d => d.total > 0).map((day) => {
                  const dayDate = new Date(day.date);
                  const isCurrentDay = isToday(dayDate);
                  const isComplete = day.completed === day.total && day.total > 0;
                  const dayName = dayNames[dayDate.getDay()];
                  
                  return (
                    <div 
                      key={day.date}
                      className={cn(
                        "flex items-center gap-3 p-2 rounded-lg",
                        isCurrentDay && "bg-muted/50"
                      )}
                    >
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center",
                        isComplete ? "bg-success" : "bg-secondary/30"
                      )}>
                        {isComplete ? (
                          <CheckCircle2 className="w-4 h-4 text-success-foreground" />
                        ) : (
                          <span className="text-xs font-medium text-muted-foreground">{day.completed}</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={cn(
                          "text-sm font-medium",
                          isCurrentDay ? "text-foreground" : "text-foreground/70"
                        )}>
                          {t(`progress.days.${dayName}`)}{isCurrentDay && ` (${t('common.today')})`}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {day.completed}/{day.total} {t('progress.actsCompleted')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-foreground">+{day.points}</p>
                        <p className="text-[10px] text-muted-foreground">{t('common.points')}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* Monthly View */}
      {activeTab === 'monthly' && (
        <div className="px-4 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl bg-card border border-border shadow-sm"
          >
            <h3 className="text-sm font-semibold text-foreground mb-3">
              {format(currentMonth, 'MMMM yyyy')}
            </h3>
            
            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                <div key={`header-${i}`} className="text-center text-xs text-muted-foreground py-1">{d}</div>
              ))}
              {/* Add empty cells for days before the first of the month */}
              {Array.from({ length: (monthStart.getDay() + 6) % 7 }, (_, i) => (
                <div key={`empty-${i}`} className="aspect-square" />
              ))}
              {monthlyProgress.map((dayData) => {
                const hasData = dayData.progress && dayData.progress.total > 0;
                const isComplete = hasData && dayData.progress!.completed === dayData.progress!.total;
                const isPartial = hasData && dayData.progress!.completed > 0 && !isComplete;
                
                return (
                  <motion.div
                    key={dayData.day}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: dayData.day * 0.01 }}
                    className={cn(
                      "aspect-square rounded-lg flex items-center justify-center text-xs font-medium",
                      dayData.isToday && "ring-2 ring-primary",
                      isComplete && "bg-success text-success-foreground",
                      isPartial && "bg-secondary/50 text-foreground",
                      !hasData && !dayData.isFuture && "bg-muted/30 text-muted-foreground",
                      dayData.isFuture && "bg-muted/10 text-muted-foreground/50"
                    )}
                  >
                    {dayData.day}
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
            className="p-4 rounded-2xl bg-card border border-border shadow-sm"
          >
            <h3 className="text-sm font-semibold text-foreground mb-3">{t('progress.monthlySummary')}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-2xl font-bold text-foreground">{monthlyPointsTotal}</p>
                <p className="text-xs text-muted-foreground">{t('progress.pointsEarned')}</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{monthlyAvgCompletion}%</p>
                <p className="text-xs text-muted-foreground">{t('progress.averageCompletion')}</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{completedDaysThisMonth}</p>
                <p className="text-xs text-muted-foreground">{t('progress.perfectDays')}</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{totalActsThisMonth}</p>
                <p className="text-xs text-muted-foreground">{t('progress.actsCompletedTotal')}</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Niyyah disclaimer */}
      <div className="px-4 py-4">
        <p className="text-[10px] text-muted-foreground text-center italic">
          {t('dashboard.niyyahDisclaimer')}
        </p>
      </div>

      <BottomNav />
    </motion.div>
  );
};

export default Progress;