/**
 * Community Duas Wall
 * Anonymous shared dua requests with prayer counts
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Heart, Send, Users, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { getAuthenticatedUserId } from '@/lib/auth';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface CommunityDua {
  id: string;
  text: string;
  category: string;
  prayer_count: number;
  created_at: string;
  hasPrayed?: boolean;
}

const PRAYED_KEY = 'naja_community_prayed_v1';

function getPrayedIds(): string[] {
  try {
    const raw = localStorage.getItem(PRAYED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function markPrayed(id: string) {
  const ids = getPrayedIds();
  if (!ids.includes(id)) {
    ids.push(id);
    localStorage.setItem(PRAYED_KEY, JSON.stringify(ids));
  }
}

export function CommunityDuas() {
  const { t } = useTranslation();
  const [duas, setDuas] = useState<CommunityDua[]>([]);
  const [loading, setLoading] = useState(true);
  const [newDua, setNewDua] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const loadDuas = useCallback(async () => {
    try {
      const { data } = await supabase
        .from('community_duas')
        .select('id, text, category, prayer_count, created_at')
        .eq('is_approved', true)
        .order('created_at', { ascending: false })
        .limit(20);

      const prayedIds = getPrayedIds();
      setDuas((data || []).map(d => ({
        ...d,
        hasPrayed: prayedIds.includes(d.id),
      })));
    } catch (e) {
      console.warn('[community] load failed:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDuas();

    // Realtime subscription
    const channel = supabase
      .channel('community-duas')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'community_duas' }, () => {
        loadDuas();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [loadDuas]);

  const handlePray = async (duaId: string) => {
    const prayedIds = getPrayedIds();
    if (prayedIds.includes(duaId)) return;

    markPrayed(duaId);
    setDuas(prev => prev.map(d =>
      d.id === duaId ? { ...d, prayer_count: d.prayer_count + 1, hasPrayed: true } : d
    ));

    // Update in DB
    const dua = duas.find(d => d.id === duaId);
    if (dua) {
      await supabase
        .from('community_duas')
        .update({ prayer_count: dua.prayer_count + 1 })
        .eq('id', duaId);
    }
  };

  const handleSubmit = async () => {
    if (!newDua.trim() || newDua.length < 5) return;
    setSubmitting(true);

    try {
      const userId = await getAuthenticatedUserId();
      await supabase.from('community_duas').insert({
        user_id: userId,
        text: newDua.trim(),
        category: 'general',
      });

      setNewDua('');
      setShowForm(false);
      toast.success(t('community.duaShared'));
      loadDuas();
    } catch (e) {
      toast.error(t('community.shareFailed'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold">{t('community.duaWall')}</h3>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(!showForm)}
          className="p-1.5 rounded-lg bg-primary/10 text-primary"
        >
          <Plus className="w-4 h-4" />
        </motion.button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="flex gap-2 pb-2">
              <Input
                value={newDua}
                onChange={(e) => setNewDua(e.target.value)}
                placeholder={t('community.sharePlaceholder')}
                maxLength={200}
                className="text-sm"
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              />
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmit}
                disabled={submitting || newDua.trim().length < 5}
                className="px-3 rounded-lg bg-primary text-primary-foreground disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : duas.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-6">
          {t('community.noDuas')}
        </p>
      ) : (
        <div className="space-y-2">
          {duas.map((dua) => (
            <motion.div
              key={dua.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-xl bg-card border border-border"
            >
              <p className="text-sm mb-2">{dua.text}</p>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground">
                  {new Date(dua.created_at).toLocaleDateString()}
                </span>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handlePray(dua.id)}
                  disabled={dua.hasPrayed}
                  className={cn(
                    "flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium transition-colors",
                    dua.hasPrayed
                      ? "bg-destructive/10 text-destructive"
                      : "bg-muted text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  )}
                >
                  <Heart className={cn("w-3 h-3", dua.hasPrayed && "fill-current")} />
                  {dua.prayer_count} {t('community.prayed')}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
