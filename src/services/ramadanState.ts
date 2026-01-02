/**
 * Ramadan State Service
 * Handles phase detection, Quran plans, and Ramadan-specific progress
 */

import { getCurrentHijriYear, hijriToGregorian, HIJRI_MONTHS } from '@/data/islamicDates';

const STORAGE_KEYS = {
  QURAN_PLAN: 'naja_ramadan_quran_plan_v1',
  RAMADAN_PROGRESS: 'naja_ramadan_progress_v1',
} as const;

// Phase Types
export type RamadanPhase = 'preparing' | 'active' | 'eid' | 'shawwal';

export interface PhaseInfo {
  phase: RamadanPhase;
  daysUntilRamadan: number;
  currentDayOfRamadan: number;
  isLastTenNights: boolean;
  hijriDate: { day: number; month: number; monthName: string };
}

// Quran Plan
export interface QuranPlanState {
  planId: string; // 'one-khatam' | 'two-khatams' | 'three-khatams'
  startDate: string;
  dailyProgress: Record<string, { pagesRead: number; prayerBreakdown: Record<string, number> }>;
}

// Ramadan Progress (streaks, completions)
export interface RamadanProgressState {
  year: number;
  fastingDays: string[]; // ISO dates of completed fasts
  tarawihDays: string[];
  streakCurrent: number;
  streakBest: number;
  quranPagesTotal: number;
  khatamsCompleted: number;
}

// === Phase Detection ===

export function getCurrentHijriDate(): { day: number; month: number; year: number } {
  const now = new Date();
  const hijriYear = getCurrentHijriYear();
  
  // Approximate reverse calculation
  const HIJRI_EPOCH = new Date('622-07-16').getTime();
  const LUNAR_MONTH = 29.530588853;
  const LUNAR_YEAR = 354.36667;
  
  const daysSinceEpoch = (now.getTime() - HIJRI_EPOCH) / (1000 * 60 * 60 * 24);
  const totalDays = daysSinceEpoch - (hijriYear - 1) * LUNAR_YEAR;
  const month = Math.floor(totalDays / LUNAR_MONTH) + 1;
  const day = Math.floor(totalDays % LUNAR_MONTH) + 1;
  
  return { 
    day: Math.min(Math.max(day, 1), 30), 
    month: Math.min(Math.max(month, 1), 12), 
    year: hijriYear 
  };
}

export function getRamadanPhase(): PhaseInfo {
  const hijri = getCurrentHijriDate();
  const hijriYear = getCurrentHijriYear();
  
  // Calculate days until Ramadan starts (month 9)
  let daysUntilRamadan = 0;
  let currentDayOfRamadan = 0;
  let phase: RamadanPhase = 'preparing';
  
  if (hijri.month < 9) {
    // Before Ramadan
    const ramadanStart = hijriToGregorian(hijriYear, 9, 1);
    daysUntilRamadan = Math.ceil((ramadanStart.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    phase = 'preparing';
  } else if (hijri.month === 9) {
    // During Ramadan
    currentDayOfRamadan = hijri.day;
    phase = 'active';
  } else if (hijri.month === 10 && hijri.day <= 3) {
    // Eid al-Fitr period (first 3 days of Shawwal)
    phase = 'eid';
  } else if (hijri.month === 10) {
    // Rest of Shawwal
    phase = 'shawwal';
  } else {
    // After Shawwal - back to preparing for next year
    const nextRamadanStart = hijriToGregorian(hijriYear + 1, 9, 1);
    daysUntilRamadan = Math.ceil((nextRamadanStart.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    phase = 'preparing';
  }
  
  return {
    phase,
    daysUntilRamadan: Math.max(0, daysUntilRamadan),
    currentDayOfRamadan,
    isLastTenNights: hijri.month === 9 && hijri.day >= 21,
    hijriDate: {
      day: hijri.day,
      month: hijri.month,
      monthName: HIJRI_MONTHS[hijri.month - 1],
    },
  };
}

// === Quran Plan Management ===

export function getQuranPlan(): QuranPlanState | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.QURAN_PLAN);
    if (!stored) return null;
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function setQuranPlan(planId: string): QuranPlanState {
  const plan: QuranPlanState = {
    planId,
    startDate: new Date().toISOString().split('T')[0],
    dailyProgress: {},
  };
  localStorage.setItem(STORAGE_KEYS.QURAN_PLAN, JSON.stringify(plan));
  return plan;
}

export function updateQuranPlanProgress(
  pagesRead: number,
  prayer?: string
): QuranPlanState | null {
  const plan = getQuranPlan();
  if (!plan) return null;
  
  const today = new Date().toISOString().split('T')[0];
  const todayProgress = plan.dailyProgress[today] || { pagesRead: 0, prayerBreakdown: {} };
  
  todayProgress.pagesRead += pagesRead;
  if (prayer) {
    todayProgress.prayerBreakdown[prayer] = (todayProgress.prayerBreakdown[prayer] || 0) + pagesRead;
  }
  
  plan.dailyProgress[today] = todayProgress;
  localStorage.setItem(STORAGE_KEYS.QURAN_PLAN, JSON.stringify(plan));
  
  return plan;
}

export function getTodayQuranProgress(): { pagesRead: number; target: number; prayerBreakdown: Record<string, number> } | null {
  const plan = getQuranPlan();
  if (!plan) return null;
  
  const today = new Date().toISOString().split('T')[0];
  const todayProgress = plan.dailyProgress[today] || { pagesRead: 0, prayerBreakdown: {} };
  
  // Get target based on plan
  const targetMap: Record<string, number> = {
    'one-khatam': 20,
    'two-khatams': 40,
    'three-khatams': 60,
  };
  
  return {
    pagesRead: todayProgress.pagesRead,
    target: targetMap[plan.planId] || 20,
    prayerBreakdown: todayProgress.prayerBreakdown,
  };
}

// === Ramadan Progress ===

export function getRamadanProgress(): RamadanProgressState {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.RAMADAN_PROGRESS);
    if (stored) {
      const parsed = JSON.parse(stored);
      const currentYear = getCurrentHijriYear();
      // Reset if it's a new year
      if (parsed.year !== currentYear) {
        return createNewRamadanProgress(currentYear);
      }
      return parsed;
    }
  } catch {
    // ignore
  }
  return createNewRamadanProgress(getCurrentHijriYear());
}

function createNewRamadanProgress(year: number): RamadanProgressState {
  const progress: RamadanProgressState = {
    year,
    fastingDays: [],
    tarawihDays: [],
    streakCurrent: 0,
    streakBest: 0,
    quranPagesTotal: 0,
    khatamsCompleted: 0,
  };
  localStorage.setItem(STORAGE_KEYS.RAMADAN_PROGRESS, JSON.stringify(progress));
  return progress;
}

export function recordFastingDay(date?: string): RamadanProgressState {
  const progress = getRamadanProgress();
  const day = date || new Date().toISOString().split('T')[0];
  
  if (!progress.fastingDays.includes(day)) {
    progress.fastingDays.push(day);
    progress.streakCurrent += 1;
    if (progress.streakCurrent > progress.streakBest) {
      progress.streakBest = progress.streakCurrent;
    }
    localStorage.setItem(STORAGE_KEYS.RAMADAN_PROGRESS, JSON.stringify(progress));
  }
  
  return progress;
}

export function recordTarawih(date?: string): RamadanProgressState {
  const progress = getRamadanProgress();
  const day = date || new Date().toISOString().split('T')[0];
  
  if (!progress.tarawihDays.includes(day)) {
    progress.tarawihDays.push(day);
    localStorage.setItem(STORAGE_KEYS.RAMADAN_PROGRESS, JSON.stringify(progress));
  }
  
  return progress;
}
