import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Minus, Plus, RotateCcw } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getAuthenticatedUserId } from "@/lib/auth";
import { toast } from "sonner";
import { motion } from "framer-motion";

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
    
    // Haptic feedback simulation via vibration if available
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
    
    // Celebrate when reaching target
    if (newCount === target) {
      toast.success("Target reached! SubhanAllah! 🎉");
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
    <Card className="liquid-glass p-4 sm:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-headline text-foreground">Dhikr Counter</h3>
        <Button 
          size="icon" 
          variant="ghost" 
          onClick={handleReset}
          disabled={count === 0}
          className="h-8 w-8 sm:h-9 sm:w-9"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      <div className="text-center space-y-4">
        <div className="space-y-1">
          <motion.p 
            key={count}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            className="text-5xl sm:text-6xl font-bold text-foreground"
          >
            {count}
          </motion.p>
          <p className="text-caption-1 text-foreground-muted">of {target}</p>
        </div>

        <div className="h-2 bg-muted rounded-pill overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
            className="h-full bg-gradient-primary"
          />
        </div>

        <div className="flex items-center justify-center gap-3 sm:gap-4">
          <Button
            size="icon"
            variant="ghost"
            onClick={handleDecrement}
            disabled={count === 0}
            className="h-10 w-10 sm:h-11 sm:w-11 rounded-full"
          >
            <Minus className="w-5 h-5" />
          </Button>
          <motion.div
            whileTap={{ scale: 0.95 }}
          >
            <Button
              size="lg"
              onClick={handleIncrement}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full text-xl sm:text-2xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
            >
              +1
            </Button>
          </motion.div>
          <Button
            size="icon"
            variant="ghost"
            onClick={handleIncrement}
            className="h-10 w-10 sm:h-11 sm:w-11 rounded-full"
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>
        
        {saving && (
          <p className="text-caption-2 text-foreground-muted">Saving...</p>
        )}
      </div>
    </Card>
  );
}
