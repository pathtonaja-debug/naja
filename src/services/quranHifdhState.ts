/**
 * Quran Hifdh (Memorization) State Service
 * Tracks memorization status per ayah
 */

const STORAGE_KEY = 'naja_quran_hifdh_v1';

export type HifdhStatus = 'none' | 'memorizing' | 'solid';

export interface HifdhEntry {
  status: HifdhStatus;
  updatedAt: string;
}

export interface HifdhState {
  [verseKey: string]: HifdhEntry;
}

export interface SurahHifdhStats {
  total: number;
  memorizing: number;
  solid: number;
  percentComplete: number;
}

// Core state management

function getHifdhState(): HifdhState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return {};
    return JSON.parse(stored);
  } catch {
    return {};
  }
}

function saveHifdhState(state: HifdhState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// Public API

export function getVerseHifdhStatus(verseKey: string): HifdhStatus {
  const state = getHifdhState();
  return state[verseKey]?.status || 'none';
}

export function setVerseHifdhStatus(verseKey: string, status: HifdhStatus): void {
  const state = getHifdhState();
  
  if (status === 'none') {
    delete state[verseKey];
  } else {
    state[verseKey] = {
      status,
      updatedAt: new Date().toISOString(),
    };
  }
  
  saveHifdhState(state);
}

export function cycleVerseHifdhStatus(verseKey: string): HifdhStatus {
  const current = getVerseHifdhStatus(verseKey);
  let next: HifdhStatus;
  
  switch (current) {
    case 'none':
      next = 'memorizing';
      break;
    case 'memorizing':
      next = 'solid';
      break;
    case 'solid':
      next = 'none';
      break;
    default:
      next = 'none';
  }
  
  setVerseHifdhStatus(verseKey, next);
  return next;
}

export function setRangeHifdhStatus(
  chapterId: number,
  startVerse: number,
  endVerse: number,
  status: HifdhStatus
): void {
  const state = getHifdhState();
  const now = new Date().toISOString();
  
  for (let i = startVerse; i <= endVerse; i++) {
    const verseKey = `${chapterId}:${i}`;
    if (status === 'none') {
      delete state[verseKey];
    } else {
      state[verseKey] = { status, updatedAt: now };
    }
  }
  
  saveHifdhState(state);
}

export function getSurahHifdhStats(chapterId: number, totalVerses: number): SurahHifdhStats {
  const state = getHifdhState();
  let memorizing = 0;
  let solid = 0;
  
  for (let i = 1; i <= totalVerses; i++) {
    const verseKey = `${chapterId}:${i}`;
    const entry = state[verseKey];
    
    if (entry?.status === 'memorizing') memorizing++;
    else if (entry?.status === 'solid') solid++;
  }
  
  const complete = solid;
  const percentComplete = totalVerses > 0 ? Math.round((complete / totalVerses) * 100) : 0;
  
  return {
    total: totalVerses,
    memorizing,
    solid,
    percentComplete,
  };
}

export function getAllSurahsHifdhStats(
  surahsData: Array<{ id: number; versesCount: number }>
): Map<number, SurahHifdhStats> {
  const results = new Map<number, SurahHifdhStats>();
  
  for (const surah of surahsData) {
    results.set(surah.id, getSurahHifdhStats(surah.id, surah.versesCount));
  }
  
  return results;
}

export function getTotalHifdhStats(): { memorizing: number; solid: number; total: number } {
  const state = getHifdhState();
  let memorizing = 0;
  let solid = 0;
  
  for (const entry of Object.values(state)) {
    if (entry.status === 'memorizing') memorizing++;
    else if (entry.status === 'solid') solid++;
  }
  
  return { memorizing, solid, total: memorizing + solid };
}

export function clearChapterHifdh(chapterId: number, totalVerses: number): void {
  setRangeHifdhStatus(chapterId, 1, totalVerses, 'none');
}

export function getHifdhByChapter(chapterId: number): Map<number, HifdhStatus> {
  const state = getHifdhState();
  const result = new Map<number, HifdhStatus>();
  
  const prefix = `${chapterId}:`;
  for (const [key, entry] of Object.entries(state)) {
    if (key.startsWith(prefix)) {
      const verseNum = parseInt(key.split(':')[1], 10);
      result.set(verseNum, entry.status);
    }
  }
  
  return result;
}
