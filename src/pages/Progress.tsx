import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress as ProgressBar } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import AICompanion from "@/components/AICompanion";
import { 
  ArrowLeft,
  Calendar as CalendarIcon,
  MoreVertical,
  Flame,
  Home as HomeIcon,
  BookOpen,
  Sparkles,
  Moon,
  Trophy,
  Star,
  Medal,
  ChevronRight
} from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getDeviceId } from "@/lib/deviceId";
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, eachDayOfInterval, isSameDay } from "date-fns";

type TimePeriod = 'week' | 'month' | 'year' | 'all';

interface ProgressStats {
  currentStreak: number;
  bestStreak: number;
  totalDays: number;
  weekCompletion: number;
  totalPrayers: number;
  completedPrayers: number;
  quranMinutes: number;
  dhikrSessions: number;
  nightPrayers: number;
  completedDays: Date[];
}

const Progress = () => {
  const navigate = useNavigate();
  const [period, setPeriod] = useState<TimePeriod>('week');
  const [companionOpen, setCompanionOpen] = useState(false);
  const [stats, setStats] = useState<ProgressStats>({
    currentStreak: 0,
    bestStreak: 0,
    totalDays: 0,
    weekCompletion: 0,
    totalPrayers: 0,
    completedPrayers: 0,
    quranMinutes: 0,
    dhikrSessions: 0,
    nightPrayers: 0,
    completedDays: []
  });

  useEffect(() => {
    loadProgressStats();
  }, [period]);

  const loadProgressStats = async () => {
    const deviceId = getDeviceId();
    const now = new Date();
    let startDate: Date;
    let endDate: Date = now;

    switch (period) {
      case 'week':
        startDate = startOfWeek(now, { weekStartsOn: 1 });
        endDate = endOfWeek(now, { weekStartsOn: 1 });
        break;
      case 'month':
        startDate = startOfMonth(now);
        endDate = endOfMonth(now);
        break;
      case 'year':
        startDate = startOfYear(now);
        endDate = endOfYear(now);
        break;
      default:
        startDate = new Date(2025, 0, 1); // Default to start of year
    }

    // Fetch habit logs
    const { data: habitLogs } = await supabase
      .from('habit_logs')
      .select('*')
      .eq('device_id', deviceId)
      .gte('date', format(startDate, 'yyyy-MM-dd'))
      .lte('date', format(endDate, 'yyyy-MM-dd'));

    // Fetch dhikr sessions
    const { data: dhikrSessions } = await supabase
      .from('dhikr_sessions')
      .select('*')
      .eq('device_id', deviceId)
      .gte('date', format(startDate, 'yyyy-MM-dd'))
      .lte('date', format(endDate, 'yyyy-MM-dd'));

    // Calculate stats
    const completedDays = habitLogs
      ? [...new Set(habitLogs.filter(log => log.completed).map(log => log.date))]
          .map(date => new Date(date))
      : [];

    const totalPrayers = period === 'week' ? 35 : period === 'month' ? 150 : 365 * 5;
    const completedPrayers = habitLogs?.filter(log => log.completed).length || 0;
    const weekCompletion = totalPrayers > 0 ? Math.round((completedPrayers / totalPrayers) * 100) : 0;

    const quranMinutes = Math.floor(Math.random() * 300) + 100; // Mock data
    const nightPrayers = habitLogs?.filter(log => log.completed && Math.random() > 0.4).length || 0;

    // Calculate streaks
    const { currentStreak, bestStreak, totalDays } = calculateStreaks(completedDays);

    setStats({
      currentStreak,
      bestStreak,
      totalDays,
      weekCompletion,
      totalPrayers,
      completedPrayers,
      quranMinutes,
      dhikrSessions: dhikrSessions?.length || 0,
      nightPrayers,
      completedDays
    });
  };

  const calculateStreaks = (dates: Date[]) => {
    if (dates.length === 0) return { currentStreak: 0, bestStreak: 0, totalDays: 0 };

    const sortedDates = dates.sort((a, b) => a.getTime() - b.getTime());
    let currentStreak = 1;
    let bestStreak = 1;
    let tempStreak = 1;

    for (let i = 1; i < sortedDates.length; i++) {
      const diffDays = Math.floor((sortedDates[i].getTime() - sortedDates[i-1].getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        tempStreak++;
        bestStreak = Math.max(bestStreak, tempStreak);
      } else {
        tempStreak = 1;
      }
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastDate = sortedDates[sortedDates.length - 1];
    lastDate.setHours(0, 0, 0, 0);
    const daysSinceLastActivity = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

    if (daysSinceLastActivity <= 1) {
      currentStreak = tempStreak;
    } else {
      currentStreak = 0;
    }

    return { currentStreak, bestStreak, totalDays: sortedDates.length };
  };

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const monthDays = eachDayOfInterval({ start: startOfMonth(new Date()), end: endOfMonth(new Date()) });

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={() => navigate('/dashboard')}
              className="rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-semibold text-foreground">Progress</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button size="icon" variant="ghost" className="rounded-full">
              <CalendarIcon className="w-5 h-5" />
            </Button>
            <Button size="icon" variant="ghost" className="rounded-full">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="px-6 pt-6 space-y-6">
        {/* Time Period Tabs */}
        <div className="flex gap-2">
          {(['week', 'month', 'year', 'all'] as TimePeriod[]).map((p) => (
            <Button
              key={p}
              onClick={() => setPeriod(p)}
              variant={period === p ? "default" : "ghost"}
              className={`rounded-full capitalize px-6 ${
                period === p 
                  ? "bg-accent text-accent-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {p === 'all' ? 'All Time' : p}
            </Button>
          ))}
        </div>

        {/* Current Streak Card */}
        <Card className="bg-accent border-none rounded-[2rem] p-8 text-center">
          <p className="text-accent-foreground/70 text-sm mb-4">Current Streak</p>
          <div className="flex items-center justify-center gap-3 mb-3">
            <Flame className="w-10 h-10 text-primary" />
            <span className="text-6xl font-bold text-accent-foreground">{stats.currentStreak}</span>
          </div>
          <p className="text-accent-foreground/70 text-lg mb-6">Days in a row</p>
          
          <div className="h-px bg-accent-foreground/10 my-6" />
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-3xl font-bold text-accent-foreground mb-1">{stats.totalDays}</p>
              <p className="text-accent-foreground/70 text-sm">Total Days</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-accent-foreground mb-1">{stats.bestStreak}</p>
              <p className="text-accent-foreground/70 text-sm">Best Streak</p>
            </div>
          </div>
        </Card>

        {/* This Week Overview */}
        <Card className="border-border bg-card rounded-[2rem] p-6">
          <h3 className="text-foreground font-medium text-lg mb-4">This Week</h3>
          
          <div className="grid grid-cols-7 gap-2 mb-6">
            {weekDays.map((day, i) => (
              <div key={day} className="text-center">
                <p className="text-xs text-muted-foreground mb-2">{day}</p>
                <div className={`w-full h-1.5 rounded-full ${
                  i < 5 ? 'bg-primary' : 'bg-muted'
                }`} />
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-4xl font-bold text-foreground mb-1">{stats.weekCompletion}%</p>
              <p className="text-sm text-muted-foreground">Completion</p>
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold text-foreground mb-1">
                {stats.completedPrayers}/{stats.totalPrayers}
              </p>
              <p className="text-sm text-muted-foreground">Prayers</p>
            </div>
          </div>
        </Card>

        {/* Activity Breakdown */}
        <div className="space-y-4">
          <h3 className="text-foreground font-medium text-lg">Activity Breakdown</h3>

          {/* Prayers */}
          <Card className="border-border bg-card rounded-[2rem] p-5">
            <div className="flex items-start gap-4 mb-3">
              <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center shrink-0">
                <HomeIcon className="w-6 h-6 text-accent-foreground" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-foreground">Prayers</h4>
                  <span className="text-lg font-semibold text-foreground">
                    {Math.round((stats.completedPrayers / stats.totalPrayers) * 100)}%
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {stats.completedPrayers} of {stats.totalPrayers} completed
                </p>
                <ProgressBar 
                  value={(stats.completedPrayers / stats.totalPrayers) * 100} 
                  className="h-2"
                />
              </div>
            </div>
          </Card>

          {/* Quran Reading */}
          <Card className="border-border bg-card rounded-[2rem] p-5">
            <div className="flex items-start gap-4 mb-3">
              <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center shrink-0">
                <BookOpen className="w-6 h-6 text-secondary-foreground" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-foreground">Quran Reading</h4>
                  <span className="text-lg font-semibold text-foreground">94%</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {Math.floor(stats.quranMinutes / 60)}h {stats.quranMinutes % 60}m this week
                </p>
                <ProgressBar value={94} className="h-2" />
              </div>
            </div>
          </Card>

          {/* Dhikr */}
          <Card className="border-border bg-card rounded-[2rem] p-5">
            <div className="flex items-start gap-4 mb-3">
              <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center shrink-0">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-foreground">Dhikr</h4>
                  <span className="text-lg font-semibold text-foreground">
                    {Math.round((stats.dhikrSessions / 35) * 100)}%
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {stats.dhikrSessions} of 35 sessions
                </p>
                <ProgressBar value={(stats.dhikrSessions / 35) * 100} className="h-2" />
              </div>
            </div>
          </Card>

          {/* Night Prayer */}
          <Card className="border-border bg-card rounded-[2rem] p-5">
            <div className="flex items-start gap-4 mb-3">
              <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center shrink-0">
                <Moon className="w-6 h-6 text-foreground" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-foreground">Night Prayer</h4>
                  <span className="text-lg font-semibold text-foreground">
                    {Math.round((stats.nightPrayers / 7) * 100)}%
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {stats.nightPrayers} of 7 nights
                </p>
                <ProgressBar value={(stats.nightPrayers / 7) * 100} className="h-2" />
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Achievements */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-foreground font-medium text-lg">Recent Achievements</h3>
            <Button variant="ghost" className="text-primary hover:text-primary/80">
              View All
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Card className="border-border bg-card rounded-[2rem] p-5 text-center">
              <Avatar className="w-16 h-16 mx-auto mb-3 bg-muted">
                <AvatarFallback className="bg-muted">
                  <Trophy className="w-8 h-8 text-foreground" />
                </AvatarFallback>
              </Avatar>
              <h4 className="font-medium text-foreground text-sm mb-1">7 Day Streak</h4>
              <p className="text-xs text-muted-foreground">Jan 15</p>
            </Card>

            <Card className="border-border bg-card rounded-[2rem] p-5 text-center">
              <Avatar className="w-16 h-16 mx-auto mb-3 bg-muted">
                <AvatarFallback className="bg-muted">
                  <Star className="w-8 h-8 text-foreground" />
                </AvatarFallback>
              </Avatar>
              <h4 className="font-medium text-foreground text-sm mb-1">Juz Completed</h4>
              <p className="text-xs text-muted-foreground">Jan 12</p>
            </Card>

            <Card className="border-border bg-card rounded-[2rem] p-5 text-center">
              <Avatar className="w-16 h-16 mx-auto mb-3 bg-muted">
                <AvatarFallback className="bg-muted">
                  <Medal className="w-8 h-8 text-foreground" />
                </AvatarFallback>
              </Avatar>
              <h4 className="font-medium text-foreground text-sm mb-1">100 Prayers</h4>
              <p className="text-xs text-muted-foreground">Jan 8</p>
            </Card>
          </div>
        </div>

        {/* Activity Calendar */}
        <Card className="border-border bg-card rounded-[2rem] p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-foreground font-medium text-lg">January 2025</h3>
            <Button size="icon" variant="ghost" className="rounded-full">
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-6">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day) => (
              <div key={day} className="text-center text-sm text-muted-foreground">
                {day}
              </div>
            ))}
            {monthDays.map((day, i) => {
              const isCompleted = stats.completedDays.some(d => isSameDay(d, day));
              const isToday = isSameDay(day, new Date());
              
              return (
                <div
                  key={i}
                  className={`aspect-square flex items-center justify-center rounded-xl text-sm font-medium ${
                    isCompleted
                      ? 'bg-accent text-accent-foreground'
                      : isToday
                      ? 'bg-muted text-foreground'
                      : 'text-muted-foreground'
                  }`}
                >
                  {format(day, 'd')}
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-accent" />
              <span className="text-muted-foreground">Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-muted" />
              <span className="text-muted-foreground">Upcoming</span>
            </div>
          </div>
        </Card>
      </main>

      <AICompanion onClose={() => setCompanionOpen(false)} isOpen={companionOpen} />
      <BottomNav onChatbotOpen={() => setCompanionOpen(true)} />
    </div>
  );
};

export default Progress;
