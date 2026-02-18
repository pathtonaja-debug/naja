import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Loader2, RefreshCw } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from 'react-i18next';

interface WeeklySummaryData {
  stats: {
    reflections: number;
    habits: { completed: number; total: number };
    dhikr: { sessions: number; totalCount: number };
  };
  summary: string;
}

const CACHE_KEY = 'naja_weekly_summary';
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24h

export function WeeklySummaryCard() {
  const { t } = useTranslation();
  const [data, setData] = useState<WeeklySummaryData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchSummary = async (force = false) => {
    // Check cache
    if (!force) {
      try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const { data: cachedData, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < CACHE_TTL) {
            setData(cachedData);
            return;
          }
        }
      } catch { /* ignore */ }
    }

    setLoading(true);
    setError(false);
    try {
      const { data: result, error: fnError } = await supabase.functions.invoke('weekly-summary');
      if (fnError) throw fnError;
      if (result?.error) throw new Error(result.error);

      setData(result);
      localStorage.setItem(CACHE_KEY, JSON.stringify({ data: result, timestamp: Date.now() }));
    } catch (err) {
      console.error('Weekly summary error:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  if (error && !data) return null; // Hide card on error with no cached data
  if (!data && !loading) return null;

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold">{t('dashboard.weeklyRecap')}</h3>
        </div>
        <button
          onClick={() => fetchSummary(true)}
          disabled={loading}
          className="p-1.5 rounded-full hover:bg-muted transition-colors"
        >
          {loading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground" />
          ) : (
            <RefreshCw className="w-3.5 h-3.5 text-muted-foreground" />
          )}
        </button>
      </div>

      {data && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {/* Stats row */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="text-center p-2 rounded-xl bg-muted/50">
              <p className="text-lg font-bold">{data.stats.habits.completed}</p>
              <p className="text-[10px] text-muted-foreground">{t('dashboard.habitsCompleted')}</p>
            </div>
            <div className="text-center p-2 rounded-xl bg-muted/50">
              <p className="text-lg font-bold">{data.stats.dhikr.totalCount}</p>
              <p className="text-[10px] text-muted-foreground">{t('nav.dhikr')}</p>
            </div>
            <div className="text-center p-2 rounded-xl bg-muted/50">
              <p className="text-lg font-bold">{data.stats.reflections}</p>
              <p className="text-[10px] text-muted-foreground">{t('nav.journal')}</p>
            </div>
          </div>

          {/* AI summary text */}
          {data.summary && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {data.summary}
            </p>
          )}
        </motion.div>
      )}
    </Card>
  );
}
