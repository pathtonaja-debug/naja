import { Button } from "@/components/ui/button";
import { Minus, Plus, RotateCcw, ChevronRight } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getAuthenticatedUserId } from "@/lib/auth";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import tasbihIllustration from "@/assets/illustrations/tasbih-illustration.png";

const DHIKR_PHRASES = [
  { arabic: "سُبْحَانَ ٱللَّٰهِ", transliteration: "SubhanAllah", meaning: "Glory be to Allah" },
  { arabic: "ٱلْحَمْدُ لِلَّٰهِ", transliteration: "Alhamdulillah", meaning: "Praise be to Allah" },
  { arabic: "ٱللَّٰهُ أَكْبَرُ", transliteration: "Allahu Akbar", meaning: "Allah is the Greatest" },
  { arabic: "لَا إِلَٰهَ إِلَّا ٱللَّٰهُ", transliteration: "La ilaha illallah", meaning: "There is no god but Allah" },
];

export function DhikrCounter() {
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(33);
  const [saving, setSaving] = useState(false);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [showPhraseSelector, setShowPhraseSelector] = useState(false);

  const currentPhrase = DHIKR_PHRASES[phraseIndex];

  // Load today's dhikr session
  useEffect(() => {
    const loadSession = async () => {
      try {
        const userId = await getAuthenticatedUserId();
        const today = new Date().toISOString().split('T')[0];
        
        const { data } = await supabase
          .from('dhikr_sessions')
          .select('count, target')
          .eq('user_id', userId)
          .eq('date', today)
          .maybeSingle();
          
        if (data) {
          setCount(data.count);
          setTarget(data.target || 33);
        }
      } catch (error) {
        console.error("Error loading dhikr session:", error);
      }
    };
    
    loadSession();
  }, []);

  // Save session to database (debounced)
  const saveSession = useCallback(async (newCount: number) => {
    setSaving(true);
    try {
      const userId = await getAuthenticatedUserId();
      const today = new Date().toISOString().split('T')[0];
      
      const { data: existing } = await supabase
        .from('dhikr_sessions')
        .select('id')
        .eq('user_id', userId)
        .eq('date', today)
        .maybeSingle();
        
      if (existing) {
        await supabase
          .from('dhikr_sessions')
          .update({ count: newCount })
          .eq('id', existing.id);
      } else {
        await supabase
          .from('dhikr_sessions')
          .insert({
            user_id: userId,
            count: newCount,
            target,
            phrase: currentPhrase.transliteration,
            date: today
          });
      }
    } catch (error) {
      console.error("Error saving dhikr:", error);
    } finally {
      setSaving(false);
    }
  }, [target, currentPhrase.transliteration]);

  const handleIncrement = () => {
    const newCount = count + 1;
    setCount(newCount);
    saveSession(newCount);
    
    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
    
    // Celebrate when reaching target
    if (newCount === target) {
      toast.success("Target reached! SubhanAllah! 🎉");
      if (navigator.vibrate) {
        navigator.vibrate([50, 50, 50]);
      }
    }
  };

  const handleDecrement = () => {
    if (count > 0) {
      const newCount = count - 1;
      setCount(newCount);
      saveSession(newCount);
    }
  };

  const handleReset = () => {
    setCount(0);
    saveSession(0);
  };

  const progress = Math.min((count / target) * 100, 100);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="px-3 py-2"
    >
      <div className="liquid-glass rounded-xl p-3 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute -right-8 -top-8 w-24 h-24 opacity-10">
          <img src={tasbihIllustration} alt="" className="w-full h-full object-contain" />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-foreground">Dhikr Counter</h3>
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={handleReset}
              disabled={count === 0}
              className="h-6 w-6"
            >
              <RotateCcw className="w-3 h-3" />
            </Button>
          </div>

          {/* Phrase Display */}
          <motion.button
            onClick={() => setShowPhraseSelector(!showPhraseSelector)}
            className="w-full text-left mb-3 p-2 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base font-arabic text-primary">{currentPhrase.arabic}</p>
                <p className="text-[10px] text-foreground-muted">{currentPhrase.transliteration} · "{currentPhrase.meaning}"</p>
              </div>
              <ChevronRight className={`w-4 h-4 text-foreground-muted transition-transform ${showPhraseSelector ? 'rotate-90' : ''}`} />
            </div>
          </motion.button>

          {/* Phrase Selector */}
          <AnimatePresence>
            {showPhraseSelector && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden mb-3"
              >
                <div className="space-y-1">
                  {DHIKR_PHRASES.map((phrase, index) => (
                    <motion.button
                      key={index}
                      onClick={() => {
                        setPhraseIndex(index);
                        setShowPhraseSelector(false);
                      }}
                      className={`w-full text-left p-2 rounded-lg transition-colors ${
                        index === phraseIndex ? 'bg-primary/10' : 'hover:bg-muted/50'
                      }`}
                      whileHover={{ x: 4 }}
                    >
                      <p className="text-xs font-medium">{phrase.transliteration}</p>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Counter Display */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-4 mb-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleDecrement}
                disabled={count === 0}
                className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center disabled:opacity-30"
              >
                <Minus className="w-4 h-4 text-foreground-muted" />
              </motion.button>
              
              <div className="relative">
                <motion.div
                  key={count}
                  initial={{ scale: 1.3, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="text-3xl sm:text-4xl font-bold text-foreground"
                >
                  {count}
                </motion.div>
                <p className="text-[10px] text-foreground-muted">of {target}</p>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleIncrement}
                className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center"
              >
                <Plus className="w-4 h-4 text-foreground-muted" />
              </motion.button>
            </div>

            {/* Main Tap Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleIncrement}
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm shadow-md"
            >
              Tap to Count
            </motion.button>
          </div>

          {/* Progress Bar */}
          <div className="mt-3 h-1.5 bg-muted/50 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
              className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full"
            />
          </div>
          
          {saving && (
            <p className="text-[9px] text-foreground-muted text-center mt-1">Saving...</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
