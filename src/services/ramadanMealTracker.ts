/**
 * Ramadan Meal & Water Tracker
 * Local storage backed suhoor/iftar meal logging + water intake
 */

const MEALS_KEY = 'naja_ramadan_meals_v1';
const WATER_KEY = 'naja_ramadan_water_v1';

export interface DailyMeals {
  suhoor: string;
  iftar: string;
  niyyahDone: boolean;
}

export interface DailyWater {
  glasses: number; // each glass = 250ml, target = 8 glasses (2L)
}

function getDateKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

// Meals
function getMealsStore(): Record<string, DailyMeals> {
  try {
    const raw = localStorage.getItem(MEALS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function saveMealsStore(store: Record<string, DailyMeals>): void {
  try { localStorage.setItem(MEALS_KEY, JSON.stringify(store)); } catch { /* */ }
}

const DEFAULT_MEALS: DailyMeals = { suhoor: '', iftar: '', niyyahDone: false };

export function getTodayMeals(): DailyMeals {
  const store = getMealsStore();
  return store[getDateKey()] ?? { ...DEFAULT_MEALS };
}

export function updateMeals(updates: Partial<DailyMeals>): DailyMeals {
  const store = getMealsStore();
  const key = getDateKey();
  const current = store[key] ?? { ...DEFAULT_MEALS };
  const updated = { ...current, ...updates };
  store[key] = updated;
  saveMealsStore(store);
  return updated;
}

// Water
function getWaterStore(): Record<string, DailyWater> {
  try {
    const raw = localStorage.getItem(WATER_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function saveWaterStore(store: Record<string, DailyWater>): void {
  try { localStorage.setItem(WATER_KEY, JSON.stringify(store)); } catch { /* */ }
}

export function getTodayWater(): DailyWater {
  const store = getWaterStore();
  return store[getDateKey()] ?? { glasses: 0 };
}

export function addWaterGlass(): DailyWater {
  const store = getWaterStore();
  const key = getDateKey();
  const current = store[key] ?? { glasses: 0 };
  const updated = { glasses: Math.min(current.glasses + 1, 12) };
  store[key] = updated;
  saveWaterStore(store);
  return updated;
}

export function removeWaterGlass(): DailyWater {
  const store = getWaterStore();
  const key = getDateKey();
  const current = store[key] ?? { glasses: 0 };
  const updated = { glasses: Math.max(current.glasses - 1, 0) };
  store[key] = updated;
  saveWaterStore(store);
  return updated;
}
