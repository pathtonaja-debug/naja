/**
 * Ramadan State Service
 * Handles phase detection, Quran plans, preparation checklist, and Ramadan progress
 */

const STORAGE_KEYS = {
  QURAN_PLAN: 'naja_ramadan_quran_plan_v1',
  RAMADAN_PROGRESS: 'naja_ramadan_progress_v1',
  PREP_CHECKLIST: 'naja_ramadan_prep', // suffix: _${hijriYear}
} as const;

// Hijri month names
export const HIJRI_MONTHS = [
  'Muharram', 'Safar', 'Rabi al-Awwal', 'Rabi al-Thani',
  'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', 'Sha\'ban',
  'Ramadan', 'Shawwal', 'Dhu al-Qi\'dah', 'Dhu al-Hijjah'
];

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

// === Accurate Hijri Date Calculation ===
// Using the Umm al-Qura calendar approximation

function gregorianToJulianDay(year: number, month: number, day: number): number {
  if (month <= 2) {
    year -= 1;
    month += 12;
  }
  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5;
}

function julianDayToHijri(jd: number): { day: number; month: number; year: number } {
  // Hijri epoch in Julian Day
  const HIJRI_EPOCH = 1948439.5;
  
  const jd2 = jd + 0.5;
  const days = Math.floor(jd2 - HIJRI_EPOCH);
  
  // Approximate calculation for Hijri
  const cycles = Math.floor((30 * days + 10646) / 10631);
  let remaining = days - Math.floor((10631 * cycles - 10646) / 30);
  
  const year = 30 * Math.floor((remaining + 10631) / 10631) + cycles;
  remaining = remaining - Math.floor((10631 * Math.floor((remaining + 10631) / 10631) - 10646) / 30);
  
  // More accurate month calculation
  let month = Math.min(12, Math.ceil((remaining + 0.5) / 29.5));
  if (month <= 0) month = 12;
  
  const day = remaining - Math.floor(29.5001 * (month - 1) + 0.99) + 1;
  
  return {
    day: Math.max(1, Math.min(30, Math.round(day))),
    month: Math.max(1, Math.min(12, month)),
    year: Math.max(1, year)
  };
}

function hijriToJulianDay(year: number, month: number, day: number): number {
  const HIJRI_EPOCH = 1948439.5;
  return day + Math.ceil(29.5001 * (month - 1) + 0.99) + 
         (year - 1) * 354 + Math.floor((3 + 11 * year) / 30) + HIJRI_EPOCH - 385;
}

export function hijriToGregorian(hijriYear: number, hijriMonth: number, hijriDay: number): Date {
  const jd = hijriToJulianDay(hijriYear, hijriMonth, hijriDay);
  
  const Z = Math.floor(jd + 0.5);
  const F = (jd + 0.5) - Z;
  
  let A = Z;
  if (Z >= 2299161) {
    const alpha = Math.floor((Z - 1867216.25) / 36524.25);
    A = Z + 1 + alpha - Math.floor(alpha / 4);
  }
  
  const B = A + 1524;
  const C = Math.floor((B - 122.1) / 365.25);
  const D = Math.floor(365.25 * C);
  const E = Math.floor((B - D) / 30.6001);
  
  const day = B - D - Math.floor(30.6001 * E) + F;
  const month = E < 14 ? E - 1 : E - 13;
  const year = month > 2 ? C - 4716 : C - 4715;
  
  return new Date(year, month - 1, Math.round(day));
}

export function getCurrentHijriDate(): { day: number; month: number; year: number } {
  const now = new Date();
  const jd = gregorianToJulianDay(now.getFullYear(), now.getMonth() + 1, now.getDate());
  return julianDayToHijri(jd);
}

export function getCurrentHijriYear(): number {
  return getCurrentHijriDate().year;
}

// === Phase Detection ===

export function getRamadanPhase(): PhaseInfo {
  const hijri = getCurrentHijriDate();
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  
  let daysUntilRamadan = 0;
  let currentDayOfRamadan: number | null = null;
  let phase: RamadanPhase = 'preparing';
  
  // Ramadan is month 9, Shawwal is month 10
  if (hijri.month < 9) {
    // Before Ramadan - preparing phase
    const ramadanStart = hijriToGregorian(hijri.year, 9, 1);
    ramadanStart.setHours(0, 0, 0, 0);
    daysUntilRamadan = Math.ceil((ramadanStart.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
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
    const nextRamadanStart = hijriToGregorian(hijri.year + 1, 9, 1);
    nextRamadanStart.setHours(0, 0, 0, 0);
    daysUntilRamadan = Math.ceil((nextRamadanStart.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
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
      year: hijri.year,
    },
  };
}

// Get next Ramadan start date for countdown
export function getNextRamadanDate(): Date {
  const hijri = getCurrentHijriDate();
  
  if (hijri.month < 9) {
    return hijriToGregorian(hijri.year, 9, 1);
  } else if (hijri.month === 9) {
    // Currently in Ramadan
    return hijriToGregorian(hijri.year, 9, 1);
  } else {
    // After Ramadan, get next year
    return hijriToGregorian(hijri.year + 1, 9, 1);
  }
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

export function setTodayQuranProgress(pagesRead: number, prayer?: string): QuranPlanState | null {
  const plan = getQuranPlan();
  if (!plan) return null;
  
  const today = new Date().toISOString().split('T')[0];
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
  
  const today = new Date().toISOString().split('T')[0];
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

// === Preparation Checklist ===

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

// === Ramadan Progress ===

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
