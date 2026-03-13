/**
 * Post-Ramadan Resolutions Store
 * Persists Ramadan goals as year-round resolutions tracked monthly until next Ramadan.
 * Storage key: naja_ramadan_resolutions_v1
 */

const STORAGE_KEY = 'naja_ramadan_resolutions_v1';
const GOALS_KEY = 'naja_ramadan_goals_v1';

export interface Resolution {
  id: string;
  name: string;
  type: 'build' | 'leave';
  monthlyCheckins: Record<string, boolean>; // "2026-04" => true
}

export interface WeeklyQuranGoal {
  pagesPerWeek: number;
  weeklyCheckins: Record<string, boolean>; // "2026-W15" => true
}

export interface ResolutionsState {
  sourceYear: number; // Hijri year the Ramadan came from
  createdAt: string;
  resolutions: Resolution[];
  quranGoal: WeeklyQuranGoal | null;
  shawwalFasts: number; // 0-6
}

function load(): ResolutionsState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function save(state: ResolutionsState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch { /* ignore */ }
}

/**
 * Import resolutions from RamadanGoals (called once after Ramadan ends).
 * If already imported for this hijri year, returns existing state.
 */
export function importFromRamadanGoals(hijriYear: number): ResolutionsState {
  const existing = load();
  if (existing && existing.sourceYear === hijriYear) return existing;

  // Read Ramadan goals
  let habitsToBuild: Array<{ id: string; name: string }> = [];
  let habitsToLeave: Array<{ id: string; name: string }> = [];

  try {
    const raw = localStorage.getItem(GOALS_KEY);
    if (raw) {
      const goals = JSON.parse(raw);
      habitsToBuild = goals.habitsToBuild || [];
      habitsToLeave = goals.habitsToLeave || [];
    }
  } catch { /* ignore */ }

  const resolutions: Resolution[] = [
    ...habitsToBuild.map(h => ({
      id: h.id,
      name: h.name,
      type: 'build' as const,
      monthlyCheckins: {},
    })),
    ...habitsToLeave.map(h => ({
      id: h.id,
      name: h.name,
      type: 'leave' as const,
      monthlyCheckins: {},
    })),
  ];

  const state: ResolutionsState = {
    sourceYear: hijriYear,
    createdAt: new Date().toISOString(),
    resolutions,
    quranGoal: { pagesPerWeek: 20, weeklyCheckins: {} },
    shawwalFasts: 0,
  };

  save(state);
  return state;
}

export function getResolutions(): ResolutionsState | null {
  return load();
}

export function addResolution(name: string, type: 'build' | 'leave'): ResolutionsState | null {
  const state = load();
  if (!state) return null;
  state.resolutions.push({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    name,
    type,
    monthlyCheckins: {},
  });
  save(state);
  return state;
}

export function removeResolution(id: string): ResolutionsState | null {
  const state = load();
  if (!state) return null;
  state.resolutions = state.resolutions.filter(r => r.id !== id);
  save(state);
  return state;
}

export function toggleMonthlyCheckin(resolutionId: string, monthKey: string): ResolutionsState | null {
  const state = load();
  if (!state) return null;
  const resolution = state.resolutions.find(r => r.id === resolutionId);
  if (!resolution) return state;
  resolution.monthlyCheckins[monthKey] = !resolution.monthlyCheckins[monthKey];
  save(state);
  return state;
}

export function updateShawwalFasts(count: number): ResolutionsState | null {
  const state = load();
  if (!state) return null;
  state.shawwalFasts = Math.min(6, Math.max(0, count));
  save(state);
  return state;
}

export function updateQuranGoal(pagesPerWeek: number): ResolutionsState | null {
  const state = load();
  if (!state) return null;
  if (!state.quranGoal) {
    state.quranGoal = { pagesPerWeek, weeklyCheckins: {} };
  } else {
    state.quranGoal.pagesPerWeek = pagesPerWeek;
  }
  save(state);
  return state;
}

export function toggleQuranWeeklyCheckin(weekKey: string): ResolutionsState | null {
  const state = load();
  if (!state || !state.quranGoal) return state;
  state.quranGoal.weeklyCheckins[weekKey] = !state.quranGoal.weeklyCheckins[weekKey];
  save(state);
  return state;
}

/**
 * Get current month key (YYYY-MM)
 */
export function getCurrentMonthKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

/**
 * Get current ISO week key (YYYY-Www)
 */
export function getCurrentWeekKey(): string {
  const d = new Date();
  const startOfYear = new Date(d.getFullYear(), 0, 1);
  const diff = d.getTime() - startOfYear.getTime();
  const weekNum = Math.ceil((diff / 86400000 + startOfYear.getDay() + 1) / 7);
  return `${d.getFullYear()}-W${String(weekNum).padStart(2, '0')}`;
}

/**
 * Get all month keys from creation until now (for progress display)
 */
export function getMonthKeysSinceCreation(createdAt: string): string[] {
  const start = new Date(createdAt);
  const now = new Date();
  const keys: string[] = [];
  const current = new Date(start.getFullYear(), start.getMonth(), 1);
  while (current <= now) {
    keys.push(`${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}`);
    current.setMonth(current.getMonth() + 1);
  }
  return keys;
}

/**
 * Get overall consistency percentage for a resolution
 */
export function getResolutionConsistency(resolution: Resolution, createdAt: string): number {
  const months = getMonthKeysSinceCreation(createdAt);
  if (months.length === 0) return 0;
  const checked = months.filter(m => resolution.monthlyCheckins[m]).length;
  return Math.round((checked / months.length) * 100);
}
