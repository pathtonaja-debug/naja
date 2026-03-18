/**
 * Cloud Sync Service
 * Dual-write pattern: localStorage (instant) + Supabase (async)
 * Cloud wins on conflict, local fills gaps
 */

import { supabase } from '@/integrations/supabase/client';
import { getAuthenticatedUserId } from '@/lib/auth';

// ── Sync status tracking ──

type SyncStatus = 'idle' | 'syncing' | 'done' | 'error';
let _syncStatus: SyncStatus = 'idle';
const _listeners: Set<(status: SyncStatus) => void> = new Set();

function setSyncStatus(status: SyncStatus) {
  _syncStatus = status;
  _listeners.forEach(fn => fn(status));
}

export function getSyncStatus(): SyncStatus {
  return _syncStatus;
}

export function onSyncStatusChange(fn: (status: SyncStatus) => void): () => void {
  _listeners.add(fn);
  return () => _listeners.delete(fn);
}

// ── Daily Progress Sync ──

export async function syncDailyProgress(): Promise<void> {
  try {
    const userId = await getAuthenticatedUserId();
    const localKey = 'naja_daily_progress_v1';
    const raw = localStorage.getItem(localKey);
    if (!raw) return;

    const localData: Record<string, any> = JSON.parse(raw);
    const dates = Object.keys(localData);
    if (dates.length === 0) return;

    const rows = dates.map(date => ({
      user_id: userId,
      date,
      acts: JSON.stringify(localData[date].acts || []),
      points: localData[date].points || 0,
      completed_count: localData[date].completed || 0,
      total_count: localData[date].total || 7,
    }));

    for (const row of rows) {
      await supabase
        .from('daily_progress')
        .upsert(row, { onConflict: 'user_id,date' });
    }
  } catch (e) {
    console.warn('[sync] daily progress sync failed:', e);
  }
}

// ── Quran Reading State Sync ──

export async function syncQuranReadingState(): Promise<void> {
  try {
    const userId = await getAuthenticatedUserId();
    
    const lastReadRaw = localStorage.getItem('naja_quran_lastRead_v1');
    const bookmarksRaw = localStorage.getItem('naja_quran_bookmarks_v1');
    const progressRaw = localStorage.getItem('naja_quran_progress_v2');

    const lastRead = lastReadRaw ? JSON.parse(lastReadRaw) : null;
    const bookmarks = bookmarksRaw ? JSON.parse(bookmarksRaw) : [];
    const progress = progressRaw ? JSON.parse(progressRaw) : {};

    const row: Record<string, any> = {
      user_id: userId,
      bookmarks: JSON.stringify(bookmarks),
      read_surahs: progress.readSurahs || [],
      today_pages: progress.todayPages || 0,
      daily_goal: progress.dailyGoal || 5,
      total_pages: progress.totalPages || 0,
      current_juz: progress.currentJuz || 1,
      khatams: progress.khatams || 0,
    };

    if (lastRead) {
      row.last_surah = lastRead.chapterId;
      row.last_verse = lastRead.verseNumber;
      row.last_verse_key = lastRead.verseKey;
      row.last_chapter_name = lastRead.chapterName;
    }

    await supabase
      .from('quran_reading_state')
      .upsert(row as any, { onConflict: 'user_id' });
  } catch (e) {
    console.warn('[sync] quran state sync failed:', e);
  }
}

// ── Gamification Sync ──

export async function syncGamification(): Promise<void> {
  try {
    const userId = await getAuthenticatedUserId();
    const profileRaw = localStorage.getItem('naja_guest_profile');
    if (!profileRaw) return;

    const profile = JSON.parse(profileRaw);
    const today = new Date().toISOString().split('T')[0];

    await supabase
      .from('user_gamification')
      .upsert({
        user_id: userId,
        xp: profile.barakahPoints || 0,
        level: profile.level || 1,
        streak_days: profile.hasanatStreak || 0,
        last_activity_date: profile.lastActivityDate || today,
      }, { onConflict: 'user_id' });
  } catch (e) {
    console.warn('[sync] gamification sync failed:', e);
  }
}

// ── Goals Sync ──

export async function syncGoals(): Promise<void> {
  try {
    const userId = await getAuthenticatedUserId();
    const goalRaw = localStorage.getItem('naja_active_goal');
    if (!goalRaw) return;

    const goal = JSON.parse(goalRaw);
    const completionsRaw = localStorage.getItem('naja_goal_completions');
    const completions = completionsRaw ? JSON.parse(completionsRaw) : [];

    // Calculate streak from completions
    let streak = 0;
    const sorted = [...completions].filter((c: any) => c.completed).sort((a: any, b: any) => b.date.localeCompare(a.date));
    if (sorted.length > 0) {
      const today = new Date().toISOString().split('T')[0];
      let checkDate = new Date(today);
      if (!sorted.some((c: any) => c.date === today)) {
        checkDate.setDate(checkDate.getDate() - 1);
      }
      for (const c of sorted) {
        if (c.date === checkDate.toISOString().split('T')[0]) {
          streak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else break;
      }
    }

    await supabase
      .from('user_goals')
      .upsert({
        user_id: userId,
        goal_config: goal,
        daily_completions: completions,
        streak,
        status: goal.status || 'active',
      }, { onConflict: 'user_id' });
  } catch (e) {
    console.warn('[sync] goals sync failed:', e);
  }
}

// ── Pull from Cloud (on login) ──

export async function pullFromCloud(): Promise<{ merged: boolean }> {
  try {
    const userId = await getAuthenticatedUserId();

    // Pull daily progress
    const { data: cloudProgress } = await supabase
      .from('daily_progress')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .limit(30);

    if (cloudProgress && cloudProgress.length > 0) {
      const localKey = 'naja_daily_progress_v1';
      const localRaw = localStorage.getItem(localKey);
      const localData: Record<string, any> = localRaw ? JSON.parse(localRaw) : {};

      for (const row of cloudProgress) {
        if (!localData[row.date] || new Date(row.updated_at) > new Date(localData[row.date]?.lastUpdated || 0)) {
          localData[row.date] = {
            date: row.date,
            completed: row.completed_count,
            total: row.total_count,
            points: row.points,
            acts: typeof row.acts === 'string' ? JSON.parse(row.acts) : row.acts,
          };
        }
      }

      localStorage.setItem(localKey, JSON.stringify(localData));
    }

    // Pull quran state
    const { data: cloudQuran } = await supabase
      .from('quran_reading_state')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (cloudQuran) {
      if (cloudQuran.last_surah) {
        localStorage.setItem('naja_quran_lastRead_v1', JSON.stringify({
          chapterId: cloudQuran.last_surah,
          verseNumber: cloudQuran.last_verse,
          verseKey: cloudQuran.last_verse_key,
          chapterName: cloudQuran.last_chapter_name,
          updatedAt: cloudQuran.updated_at,
        }));
      }

      const bookmarks = typeof cloudQuran.bookmarks === 'string'
        ? JSON.parse(cloudQuran.bookmarks)
        : cloudQuran.bookmarks;
      if (Array.isArray(bookmarks) && bookmarks.length > 0) {
        localStorage.setItem('naja_quran_bookmarks_v1', JSON.stringify(bookmarks));
      }

      localStorage.setItem('naja_quran_progress_v2', JSON.stringify({
        todayPages: cloudQuran.today_pages,
        dailyGoal: cloudQuran.daily_goal,
        totalPages: cloudQuran.total_pages,
        currentJuz: cloudQuran.current_juz,
        khatams: cloudQuran.khatams,
        readSurahs: cloudQuran.read_surahs || [],
      }));
    }

    // Pull gamification
    const { data: cloudGamification } = await supabase
      .from('user_gamification')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (cloudGamification) {
      const localProfile = localStorage.getItem('naja_guest_profile');
      const profile = localProfile ? JSON.parse(localProfile) : {};
      
      // Cloud wins if cloud has more points
      if (cloudGamification.xp > (profile.barakahPoints || 0)) {
        profile.barakahPoints = cloudGamification.xp;
        profile.level = cloudGamification.level;
        profile.hasanatStreak = cloudGamification.streak_days;
        profile.lastActivityDate = cloudGamification.last_activity_date;
        localStorage.setItem('naja_guest_profile', JSON.stringify(profile));
      }
    }

    // Pull goals
    const { data: cloudGoals } = await supabase
      .from('user_goals')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .maybeSingle();

    if (cloudGoals && cloudGoals.goal_config) {
      const localGoal = localStorage.getItem('naja_active_goal');
      if (!localGoal) {
        // No local goal, use cloud
        localStorage.setItem('naja_active_goal', JSON.stringify(cloudGoals.goal_config));
        localStorage.setItem('naja_goal_completions', JSON.stringify(cloudGoals.daily_completions || []));
      }
    }

    return { merged: true };
  } catch (e) {
    console.warn('[sync] pull from cloud failed:', e);
    return { merged: false };
  }
}

// ── Full Sync (push local → cloud) ──

export async function pushToCloud(): Promise<void> {
  setSyncStatus('syncing');
  try {
    await Promise.allSettled([
      syncDailyProgress(),
      syncQuranReadingState(),
      syncGamification(),
      syncGoals(),
    ]);
    setSyncStatus('done');
    setTimeout(() => setSyncStatus('idle'), 2000);
  } catch {
    setSyncStatus('error');
    setTimeout(() => setSyncStatus('idle'), 3000);
  }
}

// ── Auto-sync on activity ──

let syncTimeout: ReturnType<typeof setTimeout> | null = null;

export function scheduleSyncDebounced(): void {
  if (syncTimeout) clearTimeout(syncTimeout);
  syncTimeout = setTimeout(() => {
    pushToCloud().catch(() => {});
  }, 5000);
}
