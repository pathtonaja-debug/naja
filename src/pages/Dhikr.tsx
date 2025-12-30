import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, RotateCcw, Check, Sparkles } from 'lucide-react';
import { TopBar } from '@/components/ui/top-bar';
import BottomNav from '@/components/BottomNav';
import { TasbihArc } from '@/components/dhikr/TasbihArc';
import { useGuestProfile } from '@/hooks/useGuestProfile';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { BARAKAH_REWARDS } from '@/data/practiceItems';

interface DhikrPreset {
  id: string;
  arabic: string;
  transliteration: string;
  translation: string;
  target: number;
}

const DHIKR_PRESETS: DhikrPreset[] = [
  {
    id: 'subhanallah',
    arabic: 'سُبْحَانَ اللَّهِ',
    transliteration: 'SubhanAllah',
    translation: 'Glory be to Allah',
    target: 33,
  },
  {
    id: 'alhamdulillah',
    arabic: 'الْحَمْدُ لِلَّهِ',
    transliteration: 'Alhamdulillah',
    translation: 'All praise is due to Allah',
    target: 33,
  },
  {
    id: 'allahuakbar',
    arabic: 'اللَّهُ أَكْبَرُ',
    transliteration: 'Allahu Akbar',
    translation: 'Allah is the Greatest',
    target: 33,
  },
  {
    id: 'istighfar',
    arabic: 'أَسْتَغْفِرُ اللَّهَ',
    transliteration: 'Astaghfirullah',
    translation: 'I seek forgiveness from Allah',
    target: 33,
  },
  {
    id: 'salawat',
    arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ',
    transliteration: 'Allahumma salli ala Muhammad',
    translation: 'O Allah, send blessings upon Muhammad',
    target: 33,
  },
];

const TARGET_OPTIONS = [33, 99, 100];

const Dhikr = () => {
  const navigate = useNavigate();
  const { addBarakahPoints } = useGuestProfile();
  const [selectedPreset, setSelectedPreset] = useState<DhikrPreset>(DHIKR_PRESETS[0]);
  const [count, setCount] = useState(0);
  const [customTarget, setCustomTarget] = useState(33);
  const [showCompleted, setShowCompleted] = useState(false);
  const [totalToday, setTotalToday] = useState(0);

  // Load today's progress
  useEffect(() => {
    const stored = localStorage.getItem('naja_dhikr_today');
    const today = new Date().toISOString().split('T')[0];
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.date === today) {
        setTotalToday(parsed.total);
      }
    }
  }, []);

  const handleIncrement = () => {
    const newCount = count + 1;
    setCount(newCount);

    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(15);
    }

    // Check if target reached
    if (newCount === customTarget) {
      setShowCompleted(true);
      
      // Award points
      const points = BARAKAH_REWARDS.DHIKR_33;
      addBarakahPoints(points);
      
      // Update today's total
      const today = new Date().toISOString().split('T')[0];
      const newTotal = totalToday + customTarget;
      setTotalToday(newTotal);
      localStorage.setItem('naja_dhikr_today', JSON.stringify({ date: today, total: newTotal }));
      
      toast.success(`MashAllah! ${customTarget} completed. +${points} Barakah Points`);
      
      // Auto-reset after animation
      setTimeout(() => {
        setShowCompleted(false);
        setCount(0);
      }, 2000);
    }
  };

  const handleReset = () => {
    setCount(0);
    setShowCompleted(false);
  };

  const selectPreset = (preset: DhikrPreset) => {
    setSelectedPreset(preset);
    setCustomTarget(preset.target);
    setCount(0);
    setShowCompleted(false);
  };

  const progress = (count / customTarget) * 100;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background pb-24"
    >
      <TopBar 
        title="Dhikr" 
        leftElement={
          <button onClick={() => navigate(-1)} className="p-2 -ml-2">
            <ChevronLeft className="w-5 h-5" />
          </button>
        }
        rightElement={
          <button 
            onClick={handleReset}
            className="p-2 rounded-full hover:bg-muted transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        }
      />

      {/* Preset Selector */}
      <div className="px-4 pb-4">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {DHIKR_PRESETS.map((preset) => (
            <motion.button
              key={preset.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => selectPreset(preset)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                selectedPreset.id === preset.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {preset.transliteration}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Main Dhikr Display */}
      <div className="px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative p-6 rounded-3xl bg-card border border-border shadow-sm overflow-hidden"
        >
          {/* Completion Overlay */}
          <AnimatePresence>
            {showCompleted && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-card/95 backdrop-blur-sm"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 10 }}
                  className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-4"
                >
                  <Check className="w-10 h-10 text-primary" />
                </motion.div>
                <h3 className="text-xl font-bold text-foreground mb-1">MashAllah!</h3>
                <p className="text-sm text-muted-foreground">May Allah accept your dhikr</p>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center gap-2 mt-3 px-4 py-2 rounded-full bg-primary/10"
                >
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-primary">+{BARAKAH_REWARDS.DHIKR_33} Points</span>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Arabic Text */}
          <div className="text-center mb-4">
            <h2 className="text-4xl font-arabic text-foreground mb-2 leading-relaxed">
              {selectedPreset.arabic}
            </h2>
            <p className="text-lg font-medium text-foreground">
              {selectedPreset.transliteration}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {selectedPreset.translation}
            </p>
          </div>

          {/* Counter Display */}
          <div className="text-center mb-6">
            <motion.span
              key={count}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-6xl font-bold text-foreground"
            >
              {count}
            </motion.span>
            <span className="text-2xl text-muted-foreground ml-2">/ {customTarget}</span>
          </div>

          {/* Progress Bar */}
          <div className="h-3 bg-muted rounded-full overflow-hidden mb-6">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
              className="h-full bg-primary rounded-full"
            />
          </div>

          {/* Realistic Tasbih Arc */}
          <TasbihArc 
            count={count} 
            onIncrement={handleIncrement} 
            target={customTarget} 
          />
        </motion.div>
      </div>

      {/* Target Selector */}
      <div className="px-4 pt-4">
        <p className="text-xs text-muted-foreground text-center mb-2">Target Count</p>
        <div className="flex justify-center gap-2">
          {TARGET_OPTIONS.map((target) => (
            <button
              key={target}
              onClick={() => {
                setCustomTarget(target);
                setCount(0);
              }}
              className={cn(
                "w-16 h-10 rounded-xl text-sm font-medium transition-all",
                customTarget === target
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {target}
            </button>
          ))}
        </div>
      </div>

      {/* Today's Stats */}
      <div className="px-4 pt-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-4 rounded-2xl bg-card border border-border shadow-sm text-center"
        >
          <p className="text-xs text-muted-foreground mb-1">Today's Total</p>
          <p className="text-2xl font-bold text-foreground">{totalToday}</p>
          <p className="text-xs text-muted-foreground">dhikr counted</p>
        </motion.div>
      </div>

      {/* Niyyah Disclaimer */}
      <p className="text-xs text-muted-foreground text-center italic px-8 pt-4">
        Your niyyah is what matters — points are just a tool to help you stay consistent.
      </p>

      <BottomNav />
    </motion.div>
  );
};

export default Dhikr;
