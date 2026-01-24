import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  BookOpen, ChevronRight, Flame, Star, Trophy, Brain,
  Sunrise, HandHeart, CircleDollarSign, RefreshCw, ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '@/components/BottomNav';
import { useGuestProfile, SPIRITUAL_LEVELS } from '@/hooks/useGuestProfile';
import { RamadanCountdown } from '@/components/dashboard/RamadanCountdown';
import { GoalTrackerWidget } from '@/components/dashboard/GoalTrackerWidget';
import { getLastReadPosition, LastReadPosition } from '@/services/quranReadingState';
import { cn } from '@/lib/utils';
import { WelcomePrompt, FirstActPrompt, FirstActCelebration } from '@/components/onboarding/OnboardingPrompts';
import { isNewUser, getOnboardingState, getTodayProgress } from '@/services/dailyProgressService';
import cardBgGreen from '@/assets/card-bg-green.jpg';
import cardBgOrange from '@/assets/card-bg-orange.jpg';

// Ayah keys for i18n
const AYAH_KEYS = [1, 2, 3, 4];

// Reference parsing map for Ayah navigation
const AYAH_VERSE_MAP: Record<number, { surah: number; verse: number }> = {
  1: { surah: 94, verse: 6 },
  2: { surah: 65, verse: 2 },
  3: { surah: 2, verse: 152 },
  4: { surah: 93, verse: 5 },
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

  const loadData = useCallback(() => {
    const onboarding = getOnboardingState();
    if (!onboarding.hasSeenWelcome && isNewUser()) {
      setShowWelcome(true);
    }
    
    const lastRead = getLastReadPosition();
    setLastReadPositionState(lastRead);
    
    const todayProgress = getTodayProgress();
    const completedActIds = todayProgress.acts.map(a => a.id);
    
    const anyPrayerDone = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'].some(
      prayerId => completedActIds.includes(prayerId)
    );
    
    setTodaysActsStatus({
      salah: anyPrayerDone,
      quran: completedActIds.includes('quran'),
      goodDeed: completedActIds.includes('good_deed'),
      sadaqah: completedActIds.includes('sadaqah'),
    });
    
    setActualActsCompleted(todayProgress.completed);
    refetch();
  }, [refetch]);

  useEffect(() => {
    loadData();
    
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadData();
      }
    };
    
    const handleFocus = () => {
      loadData();
    };
    
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

  useEffect(() => {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    setAyahIndex((dayOfYear % AYAH_KEYS.length) + 1);
  }, []);

  const refreshAyah = () => {
    const randomIndex = Math.floor(Math.random() * AYAH_KEYS.length) + 1;
    setAyahIndex(randomIndex);
  };

  const goToAyahVerse = () => {
    const verseData = AYAH_VERSE_MAP[ayahIndex];
    if (verseData) {
      sessionStorage.setItem('naja_scroll_to_verse', `${verseData.surah}:${verseData.verse}`);
      navigate(`/quran?surah=${verseData.surah}&verse=${verseData.verse}`);
    }
  };

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

  const actRoutes: Record<string, string> = {
    salah: '/practices',
    quran: '/quran',
    goodDeed: '/practices',
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
      {showWelcome && <WelcomePrompt onDismiss={() => setShowWelcome(false)} />}
      
      {showFirstActCelebration && (
        <FirstActCelebration 
          pointsEarned={celebrationPoints} 
          onClose={() => setShowFirstActCelebration(false)} 
        />
      )}
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-background pb-28"
      >
        {/* Header */}
        <div className="px-4 pt-6 pb-4">
          <p className="text-sm text-muted-foreground">{getGreeting()}</p>
          <h1 className="text-2xl font-bold text-foreground">{profile.displayName}</h1>
        </div>

        {/* Hero Stats Card - Green with Image */}
        <div className="px-4 pb-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-3xl"
            style={{ boxShadow: '0 20px 60px -15px rgba(45, 90, 71, 0.35)' }}
          >
            {/* Background Image */}
            <img 
              src={cardBgGreen} 
              alt="" 
              className="absolute inset-0 w-full h-full object-cover"
            />
            
            {/* Dark overlay for readability */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/30 to-black/50" />
            
            {/* Content */}
            <div className="relative z-10 p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-white/70 text-sm mb-1">{t('dashboard.totalPoints')}</p>
                  <p className="text-4xl font-bold text-white">{profile.barakahPoints}</p>
                </div>
                <div className="px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm">
                  <span className="text-white text-sm font-medium">
                    {SPIRITUAL_LEVELS[profile.level - 1] || 'The Seeker'}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <Flame className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-bold">{profile.hasanatStreak}</p>
                    <p className="text-white/60 text-xs">{t('dashboard.streak')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <Trophy className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-bold">{actualActsCompleted}</p>
                    <p className="text-white/60 text-xs">{t('dashboard.actsToday')}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quick Actions - Glass Cards */}
        <div className="px-4 pb-4">
          <div className="grid grid-cols-3 gap-3">
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              onClick={() => navigate('/practices')}
              className="glass-card p-4 flex flex-col items-center gap-2"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Sunrise className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xs font-medium text-foreground">{t('acts.salah')}</span>
            </motion.button>
            
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              onClick={() => navigate('/quran')}
              className="glass-card p-4 flex flex-col items-center gap-2"
            >
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-accent" />
              </div>
              <span className="text-xs font-medium text-foreground">{t('acts.quran')}</span>
            </motion.button>
            
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              onClick={() => navigate('/dhikr')}
              className="glass-card p-4 flex flex-col items-center gap-2"
            >
              <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                <HandHeart className="w-5 h-5 text-success" />
              </div>
              <span className="text-xs font-medium text-foreground">{t('nav.dhikr')}</span>
            </motion.button>
          </div>
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

        {/* Continue Reading Quran Widget - Orange Card */}
        {lastReadPosition && (
          <div className="px-4 pb-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => navigate('/quran')}
              className="relative overflow-hidden rounded-2xl cursor-pointer"
              style={{ boxShadow: '0 12px 40px -10px rgba(232, 152, 90, 0.3)' }}
            >
              {/* Background Image */}
              <img 
                src={cardBgOrange} 
                alt="" 
                className="absolute inset-0 w-full h-full object-cover"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-black/20" />
              
              {/* Content */}
              <div className="relative z-10 p-4 flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm text-white">{t('quran.continueReading')}</h3>
                  <p className="text-xs text-white/70">
                    {lastReadPosition.chapterName || `Surah ${lastReadPosition.chapterId}`} • {t('quran.verse')} {lastReadPosition.verseNumber}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-white/70" />
              </div>
            </motion.div>
          </div>
        )}

        {/* Level Progress Card */}
        <div className="px-4 pb-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="p-4 rounded-2xl bg-card border border-border"
            style={{ boxShadow: 'var(--shadow-card)' }}
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-semibold text-foreground">{t('dashboard.level')} {profile.level}</p>
                <p className="text-xs text-muted-foreground">{SPIRITUAL_LEVELS[profile.level - 1] || 'The Seeker'}</p>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-warn" />
                <span className="text-sm font-bold text-foreground">{todayPoints}</span>
                <span className="text-xs text-muted-foreground">{t('dashboard.today')}</span>
              </div>
            </div>
            
            {/* Gradient Progress Bar */}
            <div className="progress-gradient">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${levelProgress}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="progress-gradient-fill"
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
            <h2 className="text-lg font-bold text-foreground">{t('dashboard.ayahOfDay')}</h2>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={refreshAyah}
              className="p-2 rounded-full bg-muted/50 hover:bg-muted transition-colors"
              aria-label={t('dashboard.refreshAyah')}
            >
              <RefreshCw className="w-4 h-4 text-muted-foreground" />
            </motion.button>
          </div>
          <motion.div
            key={ayahIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-5"
          >
            <p className="text-2xl font-arabic text-center mb-3 leading-loose text-foreground">{ayahOfDay.arabic}</p>
            <p className="text-sm text-muted-foreground text-center italic mb-2">
              {ayahOfDay.transliteration}
            </p>
            <p className="text-sm text-center font-medium mb-3 text-foreground">"{ayahOfDay.translation}"</p>
            <p className="text-xs text-muted-foreground text-center mb-4">{ayahOfDay.reference}</p>
            
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={goToAyahVerse}
              className="w-full py-2.5 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary text-sm font-medium flex items-center justify-center gap-2 transition-colors"
            >
              {t('dashboard.goToVerse')}
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </motion.div>
        </div>

        {/* Today's Acts for Allah */}
        <div className="px-4 pb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-foreground">{t('dashboard.todaysActs')}</h2>
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
            className="p-4 rounded-2xl bg-card border border-border"
            style={{ boxShadow: 'var(--shadow-card)' }}
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
                    "w-12 h-12 rounded-full flex items-center justify-center transition-all",
                    act.done 
                      ? "bg-success/20 ring-2 ring-success/30" 
                      : "bg-muted hover:bg-muted/70"
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
          <h2 className="text-lg font-bold mb-3 text-foreground">{t('dashboard.quizOfDay')}</h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-4 rounded-2xl bg-card border border-border"
            style={{ boxShadow: 'var(--shadow-card)' }}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-accent/15 flex items-center justify-center">
                <Brain className="w-6 h-6 text-accent" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{t('dashboard.testKnowledge')}</h3>
                <p className="text-xs text-muted-foreground">{t('dashboard.quizDescription')}</p>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/quiz')}
                className="ios-button-dark px-4 py-2 text-sm"
              >
                {t('common.start')}
              </motion.button>
            </div>
          </motion.div>
        </div>

        <BottomNav />
      </motion.div>
    </>
  );
};

export default Dashboard;
