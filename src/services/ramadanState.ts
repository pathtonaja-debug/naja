/**
 * Ramadan State Service
 * Handles phase detection, Quran plans, preparation checklist, and Ramadan progress
 * Uses Islamic Calendar API for accurate Hijri dates with timezone safety
 */

import {
  fetchTodayHijriDate,
  fetchGregorianForHijri,
  getCurrentHijriYearSync,
  getHijriDateFallback,
  hijriToGregorianFallback,
  getLocalISODate,
  getUserTimeZone,
  HijriDate,
  HIJRI_MONTHS,
} from './islamicCalendarApi';

const STORAGE_KEYS = {
  QURAN_PLAN: 'naja_ramadan_quran_plan_v1',
  RAMADAN_PROGRESS: 'naja_ramadan_progress_v1',
  PREP_CHECKLIST: 'naja_ramadan_prep', // suffix: _${hijriYear}
  PHASE_CACHE: 'naja_ramadan_phase_v1',
} as const;

// Re-export for convenience
export { HIJRI_MONTHS };

// Phase Types
export type RamadanPhase = 'preparing' | 'active' | 'eid' | 'shawwal';

export interface PhaseInfo {
  phase: RamadanPhase;
  daysUntilRamadan: number;
  currentDayOfRamadan: number | null;
  isLastTenNights: boolean;
  hijriDate: { day: number; month: number; monthName: string; year: number };
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
  fastingDays: string[];
  tarawihDays: string[];
  streakCurrent: number;
  streakBest: number;
  quranPagesTotal: number;
  khatamsCompleted: number;
}

// Preparation Checklist
export type ChecklistItemStatus = 'not_started' | 'in_progress' | 'done';

export interface ChecklistItem {
  id: string;
  titleKey: string;
  descriptionKey: string;
  ctaPath?: string;
  ctaLabelKey?: string;
  status: ChecklistItemStatus;
}

export interface PrepChecklistState {
  year: number;
  items: Record<string, ChecklistItemStatus>;
}

// ========== Helper: Get today's local date string ==========

function getTodayLocalISO(): string {
  return getLocalISODate(new Date(), getUserTimeZone());
}

// ========== Phase Detection ==========

/**
 * Get Ramadan phase (async, API-driven)
 */
export async function getRamadanPhaseAsync(): Promise<PhaseInfo> {
  try {
    const hijri = await fetchTodayHijriDate();
    return await computePhaseFromHijriAsync(hijri);
  } catch (error) {
    console.warn('Failed to get Ramadan phase from API:', error);
    // Fallback to local calculation
    const hijri = getHijriDateFallback();
    return computePhaseFromHijriSync(hijri);
  }
}

/**
 * Get Ramadan phase (sync, uses cached data or fallback)
 */
export function getRamadanPhase(): PhaseInfo {
  // Try to use cached phase
  try {
    const cached = localStorage.getItem(STORAGE_KEYS.PHASE_CACHE);
    if (cached) {
      const parsed = JSON.parse(cached);
      const cachedDate = parsed.localDate;
      const today = getTodayLocalISO();
      
      // Check if cache is from today (timezone-safe)
      if (cachedDate === today) {
        return parsed.phase;
      }
    }
  } catch {
    // ignore
  }

  // Fallback to local calculation
  const hijri = getHijriDateFallback();
  const phase = computePhaseFromHijriSync(hijri);
  
  // Cache the result
  try {
    localStorage.setItem(STORAGE_KEYS.PHASE_CACHE, JSON.stringify({
      phase,
      localDate: getTodayLocalISO(),
      timestamp: Date.now(),
    }));
  } catch {
    // ignore
  }
  
  return phase;
}

function computePhaseFromHijriSync(hijri: HijriDate): PhaseInfo {
  const todayISO = getTodayLocalISO();
  const todayMidnight = new Date(todayISO + 'T00:00:00');
  
  let daysUntilRamadan = 0;
  let currentDayOfRamadan: number | null = null;
  let phase: RamadanPhase = 'preparing';
  
  // Ramadan is month 9, Shawwal is month 10
  if (hijri.month < 9) {
    // Before Ramadan - preparing phase
    const ramadanStartISO = hijriToGregorianFallback(hijri.year, 9, 1);
    const ramadanStart = new Date(ramadanStartISO + 'T00:00:00');
    daysUntilRamadan = Math.ceil((ramadanStart.getTime() - todayMidnight.getTime()) / (1000 * 60 * 60 * 24));
    phase = 'preparing';
  } else if (hijri.month === 9) {
    // During Ramadan - active phase
    currentDayOfRamadan = hijri.day;
    phase = 'active';
  } else if (hijri.month === 10 && hijri.day <= 3) {
    // Eid al-Fitr period (first 3 days of Shawwal)
    phase = 'eid';
  } else if (hijri.month === 10) {
    // Rest of Shawwal
    phase = 'shawwal';
  } else {
    // After Shawwal - preparing for next year
    const nextRamadanStartISO = hijriToGregorianFallback(hijri.year + 1, 9, 1);
    const nextRamadanStart = new Date(nextRamadanStartISO + 'T00:00:00');
    daysUntilRamadan = Math.ceil((nextRamadanStart.getTime() - todayMidnight.getTime()) / (1000 * 60 * 60 * 24));
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
      monthName: hijri.monthName || HIJRI_MONTHS[hijri.month - 1],
      year: hijri.year,
    },
  };
}

async function computePhaseFromHijriAsync(hijri: HijriDate): Promise<PhaseInfo> {
  const todayISO = getTodayLocalISO();
  const todayMidnight = new Date(todayISO + 'T00:00:00');
  
  let daysUntilRamadan = 0;
  let currentDayOfRamadan: number | null = null;
  let phase: RamadanPhase = 'preparing';
  
  if (hijri.month < 9) {
    // Before Ramadan - get accurate start date
    try {
      const ramadanStartISO = await fetchGregorianForHijri({ day: 1, month: 9, year: hijri.year });
      const ramadanStart = new Date(ramadanStartISO + 'T00:00:00');
      daysUntilRamadan = Math.ceil((ramadanStart.getTime() - todayMidnight.getTime()) / (1000 * 60 * 60 * 24));
    } catch {
      const ramadanStartISO = hijriToGregorianFallback(hijri.year, 9, 1);
      const ramadanStart = new Date(ramadanStartISO + 'T00:00:00');
      daysUntilRamadan = Math.ceil((ramadanStart.getTime() - todayMidnight.getTime()) / (1000 * 60 * 60 * 24));
    }
    phase = 'preparing';
  } else if (hijri.month === 9) {
    currentDayOfRamadan = hijri.day;
    phase = 'active';
  } else if (hijri.month === 10 && hijri.day <= 3) {
    phase = 'eid';
  } else if (hijri.month === 10) {
    phase = 'shawwal';
  } else {
    // After Shawwal - get next year's Ramadan
    try {
      const nextRamadanStartISO = await fetchGregorianForHijri({ day: 1, month: 9, year: hijri.year + 1 });
      const nextRamadanStart = new Date(nextRamadanStartISO + 'T00:00:00');
      daysUntilRamadan = Math.ceil((nextRamadanStart.getTime() - todayMidnight.getTime()) / (1000 * 60 * 60 * 24));
    } catch {
      const nextRamadanStartISO = hijriToGregorianFallback(hijri.year + 1, 9, 1);
      const nextRamadanStart = new Date(nextRamadanStartISO + 'T00:00:00');
      daysUntilRamadan = Math.ceil((nextRamadanStart.getTime() - todayMidnight.getTime()) / (1000 * 60 * 60 * 24));
    }
    phase = 'preparing';
  }
  
  const result: PhaseInfo = {
    phase,
    daysUntilRamadan: Math.max(0, daysUntilRamadan),
    currentDayOfRamadan,
    isLastTenNights: hijri.month === 9 && hijri.day >= 21,
    hijriDate: {
      day: hijri.day,
      month: hijri.month,
      monthName: hijri.monthName || HIJRI_MONTHS[hijri.month - 1],
      year: hijri.year,
    },
  };
  
  // Cache the result
  try {
    localStorage.setItem(STORAGE_KEYS.PHASE_CACHE, JSON.stringify({
      phase: result,
      localDate: todayISO,
      timestamp: Date.now(),
    }));
  } catch {
    // ignore
  }
  
  return result;
}

/**
 * Get next Ramadan start date (async, API-driven)
 */
export async function getNextRamadanDateAsync(): Promise<Date> {
  try {
    const hijri = await fetchTodayHijriDate();
    
    let targetYear = hijri.year;
    // If we're in or past Ramadan, get next year's Ramadan
    if (hijri.month >= 9) {
      targetYear = hijri.year + 1;
    }
    
    const isoDate = await fetchGregorianForHijri({ day: 1, month: 9, year: targetYear });
    return new Date(isoDate + 'T00:00:00');
  } catch (error) {
    console.warn('Failed to get Ramadan start from API:', error);
    return getNextRamadanDate();
  }
}

/**
 * Get next Ramadan start date (sync fallback)
 */
export function getNextRamadanDate(): Date {
  const hijri = getHijriDateFallback();
  
  if (hijri.month < 9) {
    const isoDate = hijriToGregorianFallback(hijri.year, 9, 1);
    return new Date(isoDate + 'T00:00:00');
  } else if (hijri.month === 9) {
    // Currently in Ramadan - return current Ramadan start
    const isoDate = hijriToGregorianFallback(hijri.year, 9, 1);
    return new Date(isoDate + 'T00:00:00');
  } else {
    // After Ramadan, get next year
    const isoDate = hijriToGregorianFallback(hijri.year + 1, 9, 1);
    return new Date(isoDate + 'T00:00:00');
  }
}

/**
 * Get current Hijri year (sync)
 */
export function getCurrentHijriYear(): number {
  return getCurrentHijriYearSync();
}

// ========== Quran Plan Management ==========

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
    startDate: getTodayLocalISO(),
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
  
  const today = getTodayLocalISO();
  const todayProgress = plan.dailyProgress[today] || { pagesRead: 0, prayerBreakdown: {} };
  
  todayProgress.pagesRead += pagesRead;
  if (prayer) {
    todayProgress.prayerBreakdown[prayer] = (todayProgress.prayerBreakdown[prayer] || 0) + pagesRead;
  }
  
  plan.dailyProgress[today] = todayProgress;
  localStorage.setItem(STORAGE_KEYS.QURAN_PLAN, JSON.stringify(plan));
  
  return plan;
}

export function setTodayQuranProgress(pagesRead: number, prayer?: string): QuranPlanState | null {
  const plan = getQuranPlan();
  if (!plan) return null;
  
  const today = getTodayLocalISO();
  const todayProgress = plan.dailyProgress[today] || { pagesRead: 0, prayerBreakdown: {} };
  
  if (prayer) {
    todayProgress.prayerBreakdown[prayer] = pagesRead;
    todayProgress.pagesRead = Object.values(todayProgress.prayerBreakdown).reduce((a, b) => a + b, 0);
  } else {
    todayProgress.pagesRead = pagesRead;
  }
  
  plan.dailyProgress[today] = todayProgress;
  localStorage.setItem(STORAGE_KEYS.QURAN_PLAN, JSON.stringify(plan));
  
  return plan;
}

export function getTodayQuranProgress(): { pagesRead: number; target: number; prayerBreakdown: Record<string, number> } | null {
  const plan = getQuranPlan();
  if (!plan) return null;
  
  const today = getTodayLocalISO();
  const todayProgress = plan.dailyProgress[today] || { pagesRead: 0, prayerBreakdown: {} };
  
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

// ========== Preparation Checklist ==========

const DEFAULT_CHECKLIST_ITEMS: Omit<ChecklistItem, 'status'>[] = [
  {
    id: 'fasting-practice',
    titleKey: 'ramadan.checklist.fastingPractice',
    descriptionKey: 'ramadan.checklist.fastingPracticeDesc',
    ctaPath: '/practices',
    ctaLabelKey: 'ramadan.checklist.goToPractices',
  },
  {
    id: 'quran-increase',
    titleKey: 'ramadan.checklist.quranIncrease',
    descriptionKey: 'ramadan.checklist.quranIncreaseDesc',
    ctaPath: '/quran',
    ctaLabelKey: 'ramadan.checklist.goToQuran',
  },
  {
    id: 'learn-duas',
    titleKey: 'ramadan.checklist.learnDuas',
    descriptionKey: 'ramadan.checklist.learnDuasDesc',
    ctaPath: '/dua',
    ctaLabelKey: 'ramadan.checklist.goToDua',
  },
  {
    id: 'sleep-schedule',
    titleKey: 'ramadan.checklist.sleepSchedule',
    descriptionKey: 'ramadan.checklist.sleepScheduleDesc',
  },
  {
    id: 'reduce-distractions',
    titleKey: 'ramadan.checklist.reduceDistractions',
    descriptionKey: 'ramadan.checklist.reduceDistractionsDesc',
  },
  {
    id: 'set-niyyah',
    titleKey: 'ramadan.checklist.setNiyyah',
    descriptionKey: 'ramadan.checklist.setNiyyahDesc',
  },
  {
    id: 'plan-charity',
    titleKey: 'ramadan.checklist.planCharity',
    descriptionKey: 'ramadan.checklist.planCharityDesc',
    ctaPath: '/fintech',
    ctaLabelKey: 'ramadan.checklist.goToFinance',
  },
  {
    id: 'laylatul-qadr',
    titleKey: 'ramadan.checklist.laylatulQadrSigns',
    descriptionKey: 'ramadan.checklist.laylatulQadrSignsDesc',
  },
];

export function getPrepChecklist(): PrepChecklistState {
  const hijriYear = getCurrentHijriYear();
  const storageKey = `${STORAGE_KEYS.PREP_CHECKLIST}_${hijriYear}`;
  
  try {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.year === hijriYear) {
        return parsed;
      }
    }
  } catch {
    // ignore
  }
  
  // Create new checklist for current Hijri year
  const items: Record<string, ChecklistItemStatus> = {};
  DEFAULT_CHECKLIST_ITEMS.forEach(item => {
    items[item.id] = 'not_started';
  });
  
  const state: PrepChecklistState = { year: hijriYear, items };
  localStorage.setItem(storageKey, JSON.stringify(state));
  return state;
}

export function updateChecklistItemStatus(itemId: string, status: ChecklistItemStatus): PrepChecklistState {
  const hijriYear = getCurrentHijriYear();
  const storageKey = `${STORAGE_KEYS.PREP_CHECKLIST}_${hijriYear}`;
  
  const state = getPrepChecklist();
  state.items[itemId] = status;
  localStorage.setItem(storageKey, JSON.stringify(state));
  return state;
}

export function getChecklistItems(): ChecklistItem[] {
  const state = getPrepChecklist();
  return DEFAULT_CHECKLIST_ITEMS.map(item => ({
    ...item,
    status: state.items[item.id] || 'not_started',
  }));
}

export function getChecklistProgress(): { completed: number; total: number; percentage: number } {
  const state = getPrepChecklist();
  const total = Object.keys(state.items).length;
  const completed = Object.values(state.items).filter(s => s === 'done').length;
  return {
    completed,
    total,
    percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
  };
}

// ========== Ramadan Progress ==========

export function getRamadanProgress(): RamadanProgressState {
  const hijriYear = getCurrentHijriYear();
  
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.RAMADAN_PROGRESS);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.year === hijriYear) {
        return parsed;
      }
    }
  } catch {
    // ignore
  }
  
  return createNewRamadanProgress(hijriYear);
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
  const day = date || getTodayLocalISO();
  
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
  const day = date || getTodayLocalISO();
  
  if (!progress.tarawihDays.includes(day)) {
    progress.tarawihDays.push(day);
    localStorage.setItem(STORAGE_KEYS.RAMADAN_PROGRESS, JSON.stringify(progress));
  }
  
  return progress;
}

export function addQuranPages(pages: number): RamadanProgressState {
  const progress = getRamadanProgress();
  progress.quranPagesTotal += pages;
  
  // Check for khatam completion (604 pages total)
  const khatams = Math.floor(progress.quranPagesTotal / 604);
  if (khatams > progress.khatamsCompleted) {
    progress.khatamsCompleted = khatams;
  }
  
  localStorage.setItem(STORAGE_KEYS.RAMADAN_PROGRESS, JSON.stringify(progress));
  return progress;
}

/**
 * Initialize phase on app start (call this to warm up the cache)
 */
export async function initializeRamadanPhase(): Promise<PhaseInfo> {
  const phase = await getRamadanPhaseAsync();
  return phase;
}
