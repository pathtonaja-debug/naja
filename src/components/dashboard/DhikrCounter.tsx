import { Button } from "@/components/ui/button";
import { RotateCcw, ChevronRight } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getAuthenticatedUserId } from "@/lib/auth";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { BeadsAnimation } from "@/components/dhikr/BeadsAnimation";
import tasbihWatercolor from "@/assets/illustrations/tasbih-watercolor.png";

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

  // Save session to database
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
    
    // Celebrate when reaching target
    if (newCount === target) {
      toast.success("Target reached! SubhanAllah!");
      if (navigator.vibrate) {
        navigator.vibrate([50, 50, 50]);
      }
    }
  };

  const handleReset = () => {
    setCount(0);
    saveSession(0);
  };

  const progress = Math.min((count / target) * 100, 100);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="px-4 py-1.5"
    >
      <div className="glass-card rounded-xl p-3 relative overflow-hidden">
        {/* Watercolor decoration */}
        <motion.div 
          className="absolute -right-8 -top-8 w-24 h-24 opacity-20"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        >
          <img src={tasbihWatercolor} alt="" className="w-full h-full object-contain" />
        </motion.div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-1.5">
            <h3 className="text-[13px] font-semibold text-foreground">Dhikr Counter</h3>
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={handleReset}
              disabled={count === 0}
              className="h-6 w-6 rounded-full"
            >
              <RotateCcw className="w-3 h-3" />
            </Button>
          </div>

          {/* Phrase Display */}
          <motion.button
            onClick={() => setShowPhraseSelector(!showPhraseSelector)}
            className="w-full text-left mb-1.5 p-2 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-arabic text-primary">{currentPhrase.arabic}</p>
                <p className="text-[10px] text-foreground-muted">{currentPhrase.transliteration} · "{currentPhrase.meaning}"</p>
              </div>
              <ChevronRight className={`w-3.5 h-3.5 text-foreground-muted transition-transform ${showPhraseSelector ? 'rotate-90' : ''}`} />
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
              className="overflow-hidden mb-1.5"
            >
              <div className="space-y-0.5 p-1 bg-muted/30 rounded-lg">
                {DHIKR_PHRASES.map((phrase, index) => (
                  <motion.button
                    key={index}
                    onClick={() => {
                      setPhraseIndex(index);
                      setShowPhraseSelector(false);
                    }}
                    className={`w-full text-left p-1.5 rounded-md transition-colors ${
                      index === phraseIndex ? 'bg-primary/10' : 'hover:bg-muted/50'
                    }`}
                    whileHover={{ x: 2 }}
                  >
                    <p className="text-[11px] font-medium">{phrase.transliteration}</p>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Count Display */}
          <div className="text-center my-2">
            <motion.div
              key={count}
              initial={{ scale: 1.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="text-3xl font-bold text-foreground"
            >
              {count}
            </motion.div>
            <p className="text-[10px] text-foreground-muted">of {target}</p>
          </div>

          {/* Moving Beads Animation */}
          <BeadsAnimation 
            count={count} 
            onIncrement={handleIncrement} 
            target={target}
          />

          {/* Progress Bar */}
          <div className="mt-1.5 h-1 bg-muted/50 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
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
