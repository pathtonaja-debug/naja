/**
 * Ramadan Daily Reflection / Journal
 * Local storage backed 3-question daily reflection
 */

const REFLECTIONS_KEY = 'naja_ramadan_reflections_v1';

export interface DailyReflection {
  struggle: string;
  wentWell: string;
  gratitude: string;
}

function getDateKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

function getStore(): Record<string, DailyReflection> {
  try {
    const raw = localStorage.getItem(REFLECTIONS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function saveStore(store: Record<string, DailyReflection>): void {
  try { localStorage.setItem(REFLECTIONS_KEY, JSON.stringify(store)); } catch { /* */ }
}

const DEFAULT: DailyReflection = { struggle: '', wentWell: '', gratitude: '' };

export function getTodayReflection(): DailyReflection {
  const store = getStore();
  return store[getDateKey()] ?? { ...DEFAULT };
}

export function updateReflection(updates: Partial<DailyReflection>): DailyReflection {
  const store = getStore();
  const key = getDateKey();
  const current = store[key] ?? { ...DEFAULT };
  const updated = { ...current, ...updates };
  store[key] = updated;
  saveStore(store);
  return updated;
}

export function getAllReflections(): Record<string, DailyReflection> {
  return getStore();
}

/** Get the Ramadan report — summary stats from all reflections */
export function getRamadanReport(): {
  totalDays: number;
  topGratitude: string[];
  filledDays: number;
} {
  const store = getStore();
  const entries = Object.values(store);
  const filledDays = entries.filter(e => e.struggle || e.wentWell || e.gratitude).length;
  const topGratitude = entries
    .map(e => e.gratitude)
    .filter(Boolean)
    .slice(-5);

  return {
    totalDays: Object.keys(store).length,
    filledDays,
    topGratitude,
  };
}
