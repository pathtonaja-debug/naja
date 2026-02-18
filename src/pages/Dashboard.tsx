import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  BookOpen, ChevronRight, Flame, Star, Trophy, Brain,
  Sunrise, HandHeart, CircleDollarSign, RefreshCw, ArrowRight,
  MapPin, Calendar
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '@/components/BottomNav';
import { Card } from '@/components/ui/card';
import { useGuestProfile, SPIRITUAL_LEVELS, getProgressInLevel } from '@/hooks/useGuestProfile';
import { RamadanCountdown } from '@/components/dashboard/RamadanCountdown';
import { GoalTrackerWidget } from '@/components/dashboard/GoalTrackerWidget';
import { getLastReadPosition, LastReadPosition } from '@/services/quranReadingState';
import { cn } from '@/lib/utils';
import { WelcomePrompt, FirstActPrompt, FirstActCelebration } from '@/components/onboarding/OnboardingPrompts';
import { isNewUser, getOnboardingState, getTodayProgress } from '@/services/dailyProgressService';
import { usePrayerTimes } from '@/hooks/usePrayerTimes';
import { getUserLocation } from '@/services/locationStore';
import { CityOnboarding } from '@/components/onboarding/CityOnboarding';

// Ayah keys for i18n (using i18n translations)
const AYAH_KEYS = [1, 2, 3, 4];

// Reference parsing map for Ayah navigation (surah:verse)
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
  const { prayerTimes, loading: prayerLoading, countdown } = usePrayerTimes();
  
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
  const [needsLocation, setNeedsLocation] = useState(false);

  // Check if user has location set
  useEffect(() => {
    const loc = getUserLocation();
    if (!loc) setNeedsLocation(true);
  }, []);

  // Load data on mount and when returning to the page
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
      if (document.visibilityState === 'visible') loadData();
    };
    const handleFocus = () => loadData();
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

  const { percentage: levelProgress } = getProgressInLevel(profile.barakahPoints);

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

  // Show city onboarding if no location set
  if (needsLocation) {
    return (
      <CityOnboarding onComplete={() => {
        setNeedsLocation(false);
        window.location.reload();
      }} />
    );
  }

  const location = getUserLocation();

  return (
    <>
      {showWelcome && <WelcomePrompt onDismiss={() => setShowWelcome(false)} />}
      
      {showFirstActCelebration && (
        <FirstActCelebration 
          pointsEarned={celebrationPoints} 
          onClose={() => setShowFirstActCelebration(false)} 
        />
      )}
      
      <div className="min-h-screen bg-background pb-24">
      {/* Header with Hijri/Gregorian dates */}
      <div className="px-4 pt-6 pb-2">
        <p className="text-sm text-muted-foreground">{getGreeting()}</p>
        <h1 className="text-2xl font-bold">{profile.displayName}</h1>
        {location && (
          <div className="flex items-center gap-1.5 mt-1 text-muted-foreground">
            <MapPin className="w-3.5 h-3.5" />
            <span className="text-xs">{location.city}</span>
          </div>
        )}
      </div>

      {/* Dates display */}
      {prayerTimes?.hijriDate && (
        <div className="px-4 pb-4">
          <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
            <Calendar className="w-3.5 h-3.5" />
            <span className="font-medium text-foreground">{prayerTimes.hijriDate}</span>
            <span className="text-muted-foreground/50">|</span>
            <span>{prayerTimes.gregorianDate}</span>
          </div>
        </div>
      )}

      {/* Prayer Times Card */}
      {prayerTimes && (
        <div className="px-4 pb-4">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold">{t('dashboard.prayerTimes')}</h3>
              <span className="text-xs text-muted-foreground">
                {t('dashboard.nextIn', { time: countdown })}
              </span>
            </div>
            <div className="space-y-1.5">
              {prayerTimes.prayers.map((prayer) => (
                <button
                  key={prayer.name}
                  onClick={() => navigate(`/practices?prayer=${prayer.name.toLowerCase()}`)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors cursor-pointer active:scale-[0.98]",
                    prayer.isNext
                      ? "bg-primary/10 border border-primary/20"
                      : prayer.isCompleted
                      ? "opacity-50"
                      : "hover:bg-muted/50"
                  )}
                >
                  <span className={cn(
                    "text-sm font-medium",
                    prayer.isNext ? "text-primary" : "text-foreground"
                  )}>
                    {prayer.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "text-sm",
                      prayer.isNext ? "text-primary font-semibold" : "text-muted-foreground"
                    )}>
                      {prayer.time}
                    </span>
                    {prayer.isNext && (
                      <span className="text-[9px] font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded-full uppercase">
                        {t('dashboard.next')}
                      </span>
                    )}
                    <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
                  </div>
                </button>
              ))}
            </div>
          </Card>
        </div>
      )}

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
          <div
            onClick={() => navigate('/quran')}
            className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/5 border border-primary/20 cursor-pointer hover:bg-primary/15 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-sm">{t('quran.continueReading')}</h3>
                <p className="text-xs text-muted-foreground">
                  {lastReadPosition.chapterName || `Surah ${lastReadPosition.chapterId}`} • {t('quran.verse')} {lastReadPosition.verseNumber}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards Row */}
      <div className="px-4 pb-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-2xl bg-card border border-border shadow-sm">
            <div className="flex items-center gap-1.5 mb-1">
              <Star className="w-4 h-4 text-warn" />
              <span className="text-xs text-muted-foreground">{t('dashboard.today')}</span>
            </div>
            <p className="text-xl font-bold">{todayPoints}</p>
            <p className="text-[10px] text-muted-foreground">{t('dashboard.barakahPoints')}</p>
          </div>

          <div className="p-3 rounded-2xl bg-card border border-border shadow-sm">
            <div className="flex items-center gap-1.5 mb-1">
              <Flame className="w-4 h-4 text-destructive" />
              <span className="text-xs text-muted-foreground">{t('dashboard.streak')}</span>
            </div>
            <p className="text-xl font-bold">{profile.hasanatStreak}</p>
            <p className="text-[10px] text-muted-foreground">{t('dashboard.hasanatStreak')}</p>
          </div>

          <div className="p-3 rounded-2xl bg-card border border-border shadow-sm">
            <div className="flex items-center gap-1.5 mb-1">
              <Trophy className="w-4 h-4 text-success" />
              <span className="text-xs text-muted-foreground">{t('common.done')}</span>
            </div>
            <p className="text-xl font-bold">{actualActsCompleted}</p>
            <p className="text-[10px] text-muted-foreground">{t('dashboard.actsToday')}</p>
          </div>
        </div>
      </div>

      {/* Level Progress Card */}
      <div className="px-4 pb-4">
        <div className="p-4 rounded-2xl bg-card border border-border shadow-sm">
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
        </div>
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
        <div
          key={ayahIndex}
          className="p-5 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20"
        >
          <p className="text-2xl font-arabic text-center mb-3 leading-loose">{ayahOfDay.arabic}</p>
          <p className="text-sm text-muted-foreground text-center italic mb-2">
            {ayahOfDay.transliteration}
          </p>
          <p className="text-sm text-center font-medium mb-3">"{ayahOfDay.translation}"</p>
          <p className="text-xs text-muted-foreground text-center mb-4">{ayahOfDay.reference}</p>
          
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={goToAyahVerse}
            className="w-full py-2.5 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary text-sm font-medium flex items-center justify-center gap-2 transition-colors"
          >
            {t('dashboard.goToVerse')}
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
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
        
        <div className="p-4 rounded-2xl bg-card border border-border shadow-sm">
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
        </div>
      </div>

      {/* Quiz of the Day */}
      <div className="px-4 pb-4">
        <h2 className="text-lg font-bold mb-3">{t('dashboard.quizOfDay')}</h2>
        <Card className="p-4 bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
              <Brain className="w-6 h-6 text-accent" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">{t('dashboard.testKnowledge')}</h3>
              <p className="text-xs text-muted-foreground">{t('dashboard.quizDescription')}</p>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/quiz')}
              className="px-4 py-2 rounded-xl bg-accent text-accent-foreground text-sm font-medium"
            >
              {t('common.start')}
            </motion.button>
          </div>
        </Card>
      </div>

      <BottomNav />
    </div>
    </>
  );
};

export default Dashboard;
