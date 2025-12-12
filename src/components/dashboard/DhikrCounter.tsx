import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Minus, Plus, RotateCcw } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getAuthenticatedUserId } from "@/lib/auth";
import { toast } from "sonner";
import { motion } from "framer-motion";
import islamicArchitecture from "@/assets/islamic-architecture.jpg";

export function DhikrCounter() {
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(33);
  const [saving, setSaving] = useState(false);

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
            phrase: 'SubhanAllah',
            date: today
          });
      }
    } catch (error) {
      console.error("Error saving dhikr:", error);
    } finally {
      setSaving(false);
    }
  }, [target]);

  const handleIncrement = () => {
    const newCount = count + 1;
    setCount(newCount);
    saveSession(newCount);
    
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
    
    if (newCount === target) {
      toast.success("Target reached! SubhanAllah!");
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="relative rounded-card overflow-hidden"
    >
      {/* Background Image */}
      <img 
        src={islamicArchitecture} 
        alt="Islamic architecture" 
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/70" />
      
      {/* Content */}
      <div className="relative z-10 p-5 sm:p-7 space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-xl sm:text-2xl font-display font-semibold text-white">
            Dhikr Counter
          </h3>
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={handleReset}
            disabled={count === 0}
            className="h-9 w-9 text-white/70 hover:text-white hover:bg-white/20"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        <div className="text-center space-y-5">
          {/* Counter Display - Flowblox stat style */}
          <div className="sage-card p-6 sm:p-8 mx-auto max-w-xs">
            <motion.p 
              key={count}
              initial={{ scale: 1.15 }}
              animate={{ scale: 1 }}
              className="text-stat text-primary-foreground"
            >
              {count}
            </motion.p>
            <p className="text-sm text-primary-foreground/70 font-medium mt-1">of {target}</p>
            
            {/* Progress Bar */}
            <div className="h-2 bg-white/30 rounded-pill overflow-hidden mt-4">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
                className="h-full bg-accent rounded-pill"
              />
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4">
            <Button
              size="icon"
              variant="ghost"
              onClick={handleDecrement}
              disabled={count === 0}
              className="h-12 w-12 rounded-full bg-white/10 text-white hover:bg-white/20"
            >
              <Minus className="w-5 h-5" />
            </Button>
            <motion.div whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                onClick={handleIncrement}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full text-xl sm:text-2xl bg-accent hover:bg-accent/90 text-accent-foreground shadow-elevation-2 font-display font-semibold"
              >
                +1
              </Button>
            </motion.div>
            <Button
              size="icon"
              variant="ghost"
              onClick={handleIncrement}
              className="h-12 w-12 rounded-full bg-white/10 text-white hover:bg-white/20"
            >
              <Plus className="w-5 h-5" />
            </Button>
          </div>
          
          {saving && (
            <p className="text-xs text-white/50">Saving...</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
