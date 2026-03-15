/**
 * Cloud Sync Service
 * Dual-write pattern: localStorage (instant) + Supabase (async)
 * Cloud wins on conflict, local fills gaps
 */

import { supabase } from '@/integrations/supabase/client';
import { getAuthenticatedUserId } from '@/lib/auth';

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

    // Batch upsert local data to cloud
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
    
    // Read local state
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
        // Cloud wins on conflict
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
      // Update last read
      if (cloudQuran.last_surah) {
        localStorage.setItem('naja_quran_lastRead_v1', JSON.stringify({
          chapterId: cloudQuran.last_surah,
          verseNumber: cloudQuran.last_verse,
          verseKey: cloudQuran.last_verse_key,
          chapterName: cloudQuran.last_chapter_name,
          updatedAt: cloudQuran.updated_at,
        }));
      }

      // Update bookmarks
      const bookmarks = typeof cloudQuran.bookmarks === 'string'
        ? JSON.parse(cloudQuran.bookmarks)
        : cloudQuran.bookmarks;
      if (Array.isArray(bookmarks) && bookmarks.length > 0) {
        localStorage.setItem('naja_quran_bookmarks_v1', JSON.stringify(bookmarks));
      }

      // Update progress
      localStorage.setItem('naja_quran_progress_v2', JSON.stringify({
        todayPages: cloudQuran.today_pages,
        dailyGoal: cloudQuran.daily_goal,
        totalPages: cloudQuran.total_pages,
        currentJuz: cloudQuran.current_juz,
        khatams: cloudQuran.khatams,
        readSurahs: cloudQuran.read_surahs || [],
      }));
    }

    return { merged: true };
  } catch (e) {
    console.warn('[sync] pull from cloud failed:', e);
    return { merged: false };
  }
}

// ── Full Sync (push local → cloud) ──

export async function pushToCloud(): Promise<void> {
  await Promise.allSettled([
    syncDailyProgress(),
    syncQuranReadingState(),
  ]);
}

// ── Auto-sync on activity ──

let syncTimeout: ReturnType<typeof setTimeout> | null = null;

export function scheduleSyncDebounced(): void {
  if (syncTimeout) clearTimeout(syncTimeout);
  syncTimeout = setTimeout(() => {
    pushToCloud().catch(() => {});
  }, 5000); // 5 second debounce
}
