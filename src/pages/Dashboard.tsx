import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  BookOpen, ChevronRight, Flame, Star, Trophy, Brain,
  Sunrise, HandHeart, CircleDollarSign, RefreshCw, ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '@/components/BottomNav';
import { Card } from '@/components/ui/card';
import { useGuestProfile, SPIRITUAL_LEVELS } from '@/hooks/useGuestProfile';
import { RamadanCountdown } from '@/components/dashboard/RamadanCountdown';
import { GoalTrackerWidget } from '@/components/dashboard/GoalTrackerWidget';
import { getLastReadPosition, LastReadPosition } from '@/services/quranReadingState';
import { cn } from '@/lib/utils';
import { WelcomePrompt, FirstActPrompt, FirstActCelebration } from '@/components/onboarding/OnboardingPrompts';
import { isNewUser, getOnboardingState, getTodayProgress } from '@/services/dailyProgressService';

// Ayah keys for i18n (using i18n translations)
const AYAH_KEYS = [1, 2, 3, 4];

// Reference parsing map for Ayah navigation (surah:verse)
const AYAH_VERSE_MAP: Record<number, { surah: number; verse: number }> = {
  1: { surah: 94, verse: 6 },   // Ash-Sharh 94:6
  2: { surah: 65, verse: 2 },   // At-Talaq 65:2
  3: { surah: 2, verse: 152 },  // Al-Baqarah 2:152
  4: { surah: 93, verse: 5 },   // Ad-Duha 93:5
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { profile, todayPoints, actsCompleted, refetch } = useGuestProfile();
  
  const [ayahIndex, setAyahIndex] = useState(0);
  const [lastReadPosition, setLastReadPositionState] = useState<LastReadPosition | null>(null);
  const [todaysActsStatus, setTodaysActsStatus] = useState({
    salah: false,
    quran: false,
    goodDeed: false,
    sadaqah: false,
  });
  const [showWelcome, setShowWelcome] = useState(false);
  const [showFirstActCelebration, setShowFirstActCelebration] = useState(false);
  const [celebrationPoints, setCelebrationPoints] = useState(0);
  const [actualActsCompleted, setActualActsCompleted] = useState(0);
  const [, setReloadKey] = useState(0);

  // Load data on mount and when returning to the page
  const loadData = useCallback(() => {
    // Check if should show welcome prompt
    const onboarding = getOnboardingState();
    if (!onboarding.hasSeenWelcome && isNewUser()) {
      setShowWelcome(true);
    }
    
    // Load Quran last read position
    const lastRead = getLastReadPosition();
    setLastReadPositionState(lastRead);
    
    
    
    // Get today's progress from daily progress service
    const todayProgress = getTodayProgress();
    const completedActIds = todayProgress.acts.map(a => a.id);
    
    // Check prayer states - any prayer counts for salah
    const anyPrayerDone = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'].some(
      prayerId => completedActIds.includes(prayerId)
    );
    
    // Check each act category from the daily progress
    setTodaysActsStatus({
      salah: anyPrayerDone,
      quran: completedActIds.includes('quran'),
      goodDeed: completedActIds.includes('good_deed'),
      sadaqah: completedActIds.includes('sadaqah'),
    });
    
    // Update actual acts completed count
    setActualActsCompleted(todayProgress.completed);
    
    // Refetch profile to get updated stats
    refetch();
  }, [refetch]);

  // Load data on mount and set up focus/visibility listeners
  useEffect(() => {
    loadData();
    
    // Reload when page becomes visible (user returns from another tab)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadData();
      }
    };
    
    // Reload on window focus (works better for SPA navigation)
    const handleFocus = () => {
      loadData();
    };
    
    // Also listen for custom event from acts module
    const handleActsUpdated = () => {
      setReloadKey(prev => prev + 1);
      loadData();
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('naja_acts_updated', handleActsUpdated);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('naja_acts_updated', handleActsUpdated);
    };
  }, [loadData]);

  // Get today's ayah based on date
  useEffect(() => {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    setAyahIndex((dayOfYear % AYAH_KEYS.length) + 1);
  }, []);

  // Randomize ayah function
  const refreshAyah = () => {
    const randomIndex = Math.floor(Math.random() * AYAH_KEYS.length) + 1;
    setAyahIndex(randomIndex);
  };

  // Navigate to the verse in Quran
  const goToAyahVerse = () => {
    const verseData = AYAH_VERSE_MAP[ayahIndex];
    if (verseData) {
      // Let Quran page & SurahReader pick this up and auto-scroll
      sessionStorage.setItem('naja_scroll_to_verse', `${verseData.surah}:${verseData.verse}`);
      navigate(`/quran?surah=${verseData.surah}&verse=${verseData.verse}`);
    }
  };

  // Build ayah object from i18n
  const ayahOfDay = {
    arabic: t(`ayah.${ayahIndex}.arabic`),
    transliteration: t(`ayah.${ayahIndex}.transliteration`),
    translation: t(`ayah.${ayahIndex}.translation`),
    reference: t(`ayah.${ayahIndex}.reference`),
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('dashboard.greeting.morning');
    if (hour < 17) return t('dashboard.greeting.afternoon');
    return t('dashboard.greeting.evening');
  };

  const levelProgress = profile.level < 10
    ? Math.floor((profile.barakahPoints % 100) / 100 * 100) 
    : 100;

  // Route map for each act
  const actRoutes: Record<string, string> = {
    salah: '/practices',
    quran: '/quran',
    goodDeed: '/practices',
    // Deep-link to Sadaqah tab
    sadaqah: '/practices?tab=sadaqah',
  };

  const todaysActs = [
    { id: 'salah', name: t('acts.salah'), icon: Sunrise, done: todaysActsStatus.salah },
    { id: 'quran', name: t('acts.quran'), icon: BookOpen, done: todaysActsStatus.quran },
    { id: 'goodDeed', name: t('acts.goodDeed'), icon: HandHeart, done: todaysActsStatus.goodDeed },
    { id: 'sadaqah', name: t('acts.sadaqah'), icon: CircleDollarSign, done: todaysActsStatus.sadaqah },
  ];

  return (
    <>
      {/* Onboarding Welcome Prompt */}
      {showWelcome && <WelcomePrompt onDismiss={() => setShowWelcome(false)} />}
      
      {/* First Act Celebration */}
      {showFirstActCelebration && (
        <FirstActCelebration 
          pointsEarned={celebrationPoints} 
          onClose={() => setShowFirstActCelebration(false)} 
        />
      )}
      
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

      {/* Ramadan Countdown Widget */}
      <div className="px-4 pb-4">
        <RamadanCountdown />
      </div>

      {/* First Act Prompt for new users */}
      <div className="px-4 pb-4">
        <FirstActPrompt />
      </div>

      {/* Goal Tracker Widget */}
      <div className="px-4 pb-4">
        <GoalTrackerWidget />
      </div>

      {/* Continue Reading Quran Widget */}
      {lastReadPosition && (
        <div className="px-4 pb-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => navigate('/quran')}
            className="p-4 rounded-2xl bg-semantic-lavender-soft border border-semantic-lavender-dark/20 cursor-pointer hover:bg-semantic-lavender-soft/80 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-semantic-lavender-dark/20 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-semantic-lavender-dark" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-sm">{t('quran.continueReading')}</h3>
                <p className="text-xs text-muted-foreground">
                  {lastReadPosition.chapterName || `Surah ${lastReadPosition.chapterId}`} • {t('quran.verse')} {lastReadPosition.verseNumber}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </motion.div>
        </div>
      )}

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
              <span className="text-xs text-muted-foreground">{t('dashboard.today')}</span>
            </div>
            <p className="text-xl font-bold">{todayPoints}</p>
            <p className="text-[10px] text-muted-foreground">{t('dashboard.barakahPoints')}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="p-3 rounded-2xl bg-card border border-border shadow-sm"
          >
            <div className="flex items-center gap-1.5 mb-1">
              <Flame className="w-4 h-4 text-destructive" />
              <span className="text-xs text-muted-foreground">{t('dashboard.streak')}</span>
            </div>
            <p className="text-xl font-bold">{profile.hasanatStreak}</p>
            <p className="text-[10px] text-muted-foreground">{t('dashboard.hasanatStreak')}</p>
          </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-3 rounded-2xl bg-card border border-border shadow-sm"
            >
              <div className="flex items-center gap-1.5 mb-1">
                <Trophy className="w-4 h-4 text-success" />
                <span className="text-xs text-muted-foreground">{t('common.done')}</span>
              </div>
              <p className="text-xl font-bold">{actualActsCompleted}</p>
              <p className="text-[10px] text-muted-foreground">{t('dashboard.actsToday')}</p>
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
              <p className="text-xs text-muted-foreground">{t('dashboard.level')} {profile.level}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold">{profile.barakahPoints}</p>
              <p className="text-xs text-muted-foreground">{t('dashboard.totalPoints')}</p>
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
            {t('dashboard.niyyahDisclaimer')}
          </p>
        </motion.div>
      </div>

      {/* Ayah of the Day */}
      <div className="px-4 pb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold">{t('dashboard.ayahOfDay')}</h2>
          <div className="flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={refreshAyah}
              className="p-2 rounded-full bg-muted/50 hover:bg-muted transition-colors"
              aria-label={t('dashboard.refreshAyah')}
            >
              <RefreshCw className="w-4 h-4 text-muted-foreground" />
            </motion.button>
          </div>
        </div>
        <motion.div
          key={ayahIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-5 rounded-2xl bg-semantic-yellow-soft border border-semantic-yellow-dark/20"
        >
          <p className="text-2xl font-arabic text-center mb-3 leading-loose">{ayahOfDay.arabic}</p>
          <p className="text-sm text-muted-foreground text-center italic mb-2">
            {ayahOfDay.transliteration}
          </p>
          <p className="text-sm text-center font-medium mb-3">"{ayahOfDay.translation}"</p>
          <p className="text-xs text-muted-foreground text-center mb-4">{ayahOfDay.reference}</p>
          
          {/* Go to verse button */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={goToAyahVerse}
            className="w-full py-2.5 rounded-xl bg-semantic-yellow-dark/15 hover:bg-semantic-yellow-dark/25 text-semantic-yellow-dark text-sm font-medium flex items-center justify-center gap-2 transition-colors"
          >
            {t('dashboard.goToVerse')}
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>
      </div>

      {/* Today's Acts for Allah - Compact Recap */}
      <div className="px-4 pb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold">{t('dashboard.todaysActs')}</h2>
          <button 
            onClick={() => navigate('/practices')}
            className="text-xs text-muted-foreground flex items-center gap-1"
          >
            {t('dashboard.open')} <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="p-4 rounded-2xl bg-card border border-border shadow-sm"
        >
          <div className="grid grid-cols-4 gap-4">
            {todaysActs.map((act) => (
              <motion.button
                key={act.id}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(actRoutes[act.id] || '/practices');
                }}
                className="flex flex-col items-center gap-2 cursor-pointer"
              >
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center transition-colors",
                  act.done ? "bg-success/20" : "bg-muted hover:bg-muted/70"
                )}>
                  <act.icon className={cn(
                    "w-5 h-5",
                    act.done ? "text-success" : "text-muted-foreground"
                  )} />
                </div>
                <span className="text-xs text-muted-foreground text-center">{act.name}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quiz of the Day */}
      <div className="px-4 pb-4">
        <h2 className="text-lg font-bold mb-3">{t('dashboard.quizOfDay')}</h2>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-4 bg-semantic-lavender-soft border-semantic-lavender-dark/20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-semantic-lavender-dark/20 flex items-center justify-center">
                <Brain className="w-6 h-6 text-semantic-lavender-dark" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{t('dashboard.testKnowledge')}</h3>
                <p className="text-xs text-muted-foreground">{t('dashboard.quizDescription')}</p>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/quiz')}
                className="px-4 py-2 rounded-xl bg-semantic-lavender-dark text-white text-sm font-medium"
              >
                {t('common.start')}
              </motion.button>
            </div>
          </Card>
        </motion.div>
      </div>

      <BottomNav />
    </motion.div>
    </>
  );
};

export default Dashboard;
