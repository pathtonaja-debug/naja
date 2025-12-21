import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, Heart, PenLine, GraduationCap, Calendar, 
  ChevronRight, Flame, Star, Trophy, Coins, Brain,
  Sunrise, Moon, HandHeart, CircleDollarSign
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '@/components/BottomNav';
import { Card } from '@/components/ui/card';
import { useGuestProfile, SPIRITUAL_LEVELS } from '@/hooks/useGuestProfile';
import { cn } from '@/lib/utils';

// Sample Ayah data
const AYAHS_OF_THE_DAY = [
  {
    arabic: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا',
    transliteration: 'Inna ma\'al usri yusra',
    translation: 'Indeed, with hardship comes ease.',
    reference: 'Surah Ash-Sharh 94:6'
  },
  {
    arabic: 'وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا',
    transliteration: 'Wa man yattaqillaha yaj\'al lahu makhraja',
    translation: 'And whoever fears Allah, He will make a way out for him.',
    reference: 'Surah At-Talaq 65:2'
  },
  {
    arabic: 'فَاذْكُرُونِي أَذْكُرْكُمْ',
    transliteration: 'Fadhkuruni adhkurkum',
    translation: 'So remember Me; I will remember you.',
    reference: 'Surah Al-Baqarah 2:152'
  },
  {
    arabic: 'وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰ',
    transliteration: 'Wa lasawfa yu\'teeka rabbuka fatarda',
    translation: 'And your Lord is going to give you, and you will be satisfied.',
    reference: 'Surah Ad-Duha 93:5'
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { profile, todayPoints, actsCompleted } = useGuestProfile();
  const [ayahOfDay, setAyahOfDay] = useState(AYAHS_OF_THE_DAY[0]);
  const [todaysActsStatus, setTodaysActsStatus] = useState({
    salah: false,
    quran: false,
    goodDeed: false,
    sadaqah: false,
  });

  // Get today's ayah based on date
  useEffect(() => {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    const ayahIndex = dayOfYear % AYAHS_OF_THE_DAY.length;
    setAyahOfDay(AYAHS_OF_THE_DAY[ayahIndex]);
  }, []);

  // Load today's acts status
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    
    // Check prayer states
    const prayerStored = localStorage.getItem('naja_prayer_states');
    if (prayerStored) {
      const parsed = JSON.parse(prayerStored);
      if (parsed.date === today) {
        const anyPrayerDone = Object.values(parsed.states).some((s: any) => s.done);
        setTodaysActsStatus(prev => ({ ...prev, salah: anyPrayerDone }));
      }
    }

    // Check Quran progress
    const quranStored = localStorage.getItem('naja_quran_progress_v2');
    if (quranStored) {
      const parsed = JSON.parse(quranStored);
      const quranDone = (parsed.history && parsed.history[today] > 0);
      setTodaysActsStatus(prev => ({ ...prev, quran: quranDone }));
    }
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Assalamu Alaikum';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const quickTiles = [
    { id: 'practices', title: 'Practices', icon: <Star className="w-5 h-5" />, path: '/practices', color: 'bg-secondary/20' },
    { id: 'quran', title: "Qur'an", icon: <BookOpen className="w-5 h-5" />, path: '/quran', color: 'bg-success/20' },
    { id: 'dhikr', title: 'Dhikr', icon: <Heart className="w-5 h-5" />, path: '/dhikr', color: 'bg-primary/20' },
    { id: 'dua', title: 'Dua', icon: <Star className="w-5 h-5" />, path: '/dua', color: 'bg-warn/20' },
    { id: 'journal', title: 'Journal', icon: <PenLine className="w-5 h-5" />, path: '/journal', color: 'bg-accent/20' },
    { id: 'learn', title: 'Learn', icon: <GraduationCap className="w-5 h-5" />, path: '/learn', color: 'bg-secondary/20' },
    { id: 'dates', title: 'Dates', icon: <Calendar className="w-5 h-5" />, path: '/dates', color: 'bg-primary/20' },
    { id: 'fintech', title: 'Finance', icon: <Coins className="w-5 h-5" />, path: '/fintech', color: 'bg-success/20' },
  ];

  const levelProgress = profile.level < 10 
    ? Math.floor((profile.barakahPoints % 100) / 100 * 100) 
    : 100;

  const todaysActs = [
    { id: 'salah', name: 'Salah', icon: Sunrise, done: todaysActsStatus.salah },
    { id: 'quran', name: "Qur'an", icon: BookOpen, done: todaysActsStatus.quran },
    { id: 'goodDeed', name: 'Good Deed', icon: HandHeart, done: todaysActsStatus.goodDeed },
    { id: 'sadaqah', name: 'Sadaqah', icon: CircleDollarSign, done: todaysActsStatus.sadaqah },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background pb-24"
    >
      {/* Header */}
      <div className="px-4 pt-6 pb-4">
        <p className="text-sm text-muted-foreground">{getGreeting()}</p>
        <h1 className="text-2xl font-bold">{profile.displayName}</h1>
      </div>

      {/* Stats Cards Row */}
      <div className="px-4 pb-4">
        <div className="grid grid-cols-3 gap-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded-2xl bg-card border border-border shadow-sm"
          >
            <div className="flex items-center gap-1.5 mb-1">
              <Star className="w-4 h-4 text-warn" />
              <span className="text-xs text-muted-foreground">Today</span>
            </div>
            <p className="text-xl font-bold">{todayPoints}</p>
            <p className="text-[10px] text-muted-foreground">Barakah Points</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="p-3 rounded-2xl bg-card border border-border shadow-sm"
          >
            <div className="flex items-center gap-1.5 mb-1">
              <Flame className="w-4 h-4 text-destructive" />
              <span className="text-xs text-muted-foreground">Streak</span>
            </div>
            <p className="text-xl font-bold">{profile.hasanatStreak}</p>
            <p className="text-[10px] text-muted-foreground">Hasanat Streak</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-3 rounded-2xl bg-card border border-border shadow-sm"
          >
            <div className="flex items-center gap-1.5 mb-1">
              <Trophy className="w-4 h-4 text-success" />
              <span className="text-xs text-muted-foreground">Done</span>
            </div>
            <p className="text-xl font-bold">{actsCompleted}</p>
            <p className="text-[10px] text-muted-foreground">Acts today</p>
          </motion.div>
        </div>
      </div>

      {/* Level Progress Card */}
      <div className="px-4 pb-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="p-4 rounded-2xl bg-card border border-border shadow-sm"
        >
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-sm font-semibold">{SPIRITUAL_LEVELS[profile.level - 1] || 'The Seeker'}</p>
              <p className="text-xs text-muted-foreground">Level {profile.level}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold">{profile.barakahPoints}</p>
              <p className="text-xs text-muted-foreground">Total Points</p>
            </div>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${levelProgress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full bg-secondary rounded-full"
            />
          </div>
          <p className="text-[10px] text-muted-foreground mt-2 text-center italic">
            Your niyyah is what matters — points are just a tool to help you stay consistent.
          </p>
        </motion.div>
      </div>

      {/* Ayah of the Day */}
      <div className="px-4 pb-4">
        <h2 className="text-lg font-bold mb-3">Ayah of the Day</h2>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-5 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20"
        >
          <p className="text-2xl font-arabic text-center mb-3 leading-loose">{ayahOfDay.arabic}</p>
          <p className="text-sm text-muted-foreground text-center italic mb-2">
            {ayahOfDay.transliteration}
          </p>
          <p className="text-sm text-center font-medium mb-3">"{ayahOfDay.translation}"</p>
          <p className="text-xs text-muted-foreground text-center">{ayahOfDay.reference}</p>
        </motion.div>
      </div>

      {/* Today's Acts for Allah - Compact Recap */}
      <div className="px-4 pb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold">Today's Acts for Allah</h2>
          <button 
            onClick={() => navigate('/practices')}
            className="text-xs text-muted-foreground flex items-center gap-1"
          >
            Open <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          onClick={() => navigate('/practices')}
          className="p-4 rounded-2xl bg-card border border-border shadow-sm cursor-pointer hover:bg-muted/30 transition-colors"
        >
          <div className="grid grid-cols-4 gap-4">
            {todaysActs.map((act) => (
              <div key={act.id} className="flex flex-col items-center gap-2">
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center",
                  act.done ? "bg-success/20" : "bg-muted"
                )}>
                  <act.icon className={cn(
                    "w-5 h-5",
                    act.done ? "text-success" : "text-muted-foreground"
                  )} />
                </div>
                <span className="text-xs text-muted-foreground text-center">{act.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quiz of the Day */}
      <div className="px-4 pb-4">
        <h2 className="text-lg font-bold mb-3">Quiz of the Day</h2>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-4 bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                <Brain className="w-6 h-6 text-accent" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Test Your Knowledge</h3>
                <p className="text-xs text-muted-foreground">Quick daily quiz • Optional • +5 Points</p>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/quiz')}
                className="px-4 py-2 rounded-xl bg-accent text-accent-foreground text-sm font-medium"
              >
                Start
              </motion.button>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Quick Access Tiles */}
      <div className="px-4 pb-4">
        <h2 className="text-lg font-bold mb-3">Quick Access</h2>
        <div className="grid grid-cols-4 gap-3">
          {quickTiles.map((tile, index) => (
            <motion.button
              key={tile.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 + index * 0.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(tile.path)}
              className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-card border border-border shadow-sm"
            >
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", tile.color)}>
                {tile.icon}
              </div>
              <span className="text-[10px] font-medium">{tile.title}</span>
            </motion.button>
          ))}
        </div>
      </div>

      <BottomNav />
    </motion.div>
  );
};

export default Dashboard;
