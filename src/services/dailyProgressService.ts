// Daily Progress Tracking Service
// Stores historical data for each day including acts completed, points earned, etc.

import { generateUUID } from '@/lib/uuid';

const STORAGE_KEY = 'naja_daily_progress_v1';
const ONBOARDING_KEY = 'naja_onboarding_state';

// ============== Types ==============
export interface DailyProgress {
  date: string; // YYYY-MM-DD
  completed: number; // Acts completed
  total: number; // Total acts available
  points: number; // Points earned
  acts: CompletedAct[]; // Detailed list of completed acts
}

export interface CompletedAct {
  id: string;
  name: string;
  points: number;
  completedAt: string; // ISO timestamp
  category: 'prayer' | 'quran' | 'dhikr' | 'habit' | 'reflection' | 'dua' | 'quiz' | 'other';
}

export interface OnboardingState {
  hasCompletedFirstAct: boolean;
  hasEarnedFirstPoints: boolean;
  hasSeenWelcome: boolean;
  firstActDate: string | null;
  dismissedPrompts: string[];
}

// ============== Storage Helpers ==============
function getStorage<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return defaultValue;
    return JSON.parse(stored) as T;
  } catch {
    return defaultValue;
  }
}

function setStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

// ============== Daily Progress Functions ==============
export function getAllDailyProgress(): Record<string, DailyProgress> {
  return getStorage<Record<string, DailyProgress>>(STORAGE_KEY, {});
}

export function getDailyProgressForDate(date: string): DailyProgress | null {
  const all = getAllDailyProgress();
  return all[date] || null;
}

export function getTodayProgress(): DailyProgress {
  const today = new Date().toISOString().split('T')[0];
  const stored = getDailyProgressForDate(today);
  
  if (stored) return stored;
  
  return {
    date: today,
    completed: 0,
    total: 7, // Default: 5 prayers + Quran + Dhikr
    points: 0,
    acts: [],
  };
}

export function recordCompletedAct(
  actId: string,
  actName: string,
  points: number,
  category: CompletedAct['category'],
  totalActsForToday?: number
): DailyProgress {
  const today = new Date().toISOString().split('T')[0];
  const all = getAllDailyProgress();
  const current = all[today] || {
    date: today,
    completed: 0,
    total: totalActsForToday || 7,
    points: 0,
    acts: [],
  };
  
  // Check if act already recorded today
  const alreadyRecorded = current.acts.some(a => a.id === actId);
  if (alreadyRecorded) {
    return current;
  }
  
  // Add the new act
  const newAct: CompletedAct = {
    id: actId,
    name: actName,
    points,
    completedAt: new Date().toISOString(),
    category,
  };
  
  current.acts.push(newAct);
  current.completed = current.acts.length;
  current.points = current.acts.reduce((sum, a) => sum + a.points, 0);
  if (totalActsForToday) {
    current.total = totalActsForToday;
  }
  
  // Save
  all[today] = current;
  setStorage(STORAGE_KEY, all);
  
  // Update onboarding state
  const onboarding = getOnboardingState();
  if (!onboarding.hasCompletedFirstAct) {
    updateOnboardingState({
      hasCompletedFirstAct: true,
      hasEarnedFirstPoints: true,
      firstActDate: today,
    });
  }
  
  return current;
}

export function updateTodayTotalActs(total: number): void {
  const today = new Date().toISOString().split('T')[0];
  const all = getAllDailyProgress();
  const current = all[today] || {
    date: today,
    completed: 0,
    total,
    points: 0,
    acts: [],
  };
  
  current.total = total;
  all[today] = current;
  setStorage(STORAGE_KEY, all);
}

// Get progress for a specific number of days back
export function getProgressHistory(days: number): DailyProgress[] {
  const all = getAllDailyProgress();
  const result: DailyProgress[] = [];
  
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateKey = date.toISOString().split('T')[0];
    const progress = all[dateKey];
    
    if (progress) {
      result.push(progress);
    }
  }
  
  return result;
}

// Get weekly summary
export function getWeeklySummary(): {
  totalPoints: number;
  totalActs: number;
  activeDays: number;
  avgCompletion: number;
} {
  const history = getProgressHistory(7);
  
  const totalPoints = history.reduce((sum, d) => sum + d.points, 0);
  const totalActs = history.reduce((sum, d) => sum + d.completed, 0);
  const activeDays = history.length;
  
  const avgCompletion = history.length > 0
    ? Math.round(
        history.reduce((sum, d) => sum + (d.total > 0 ? (d.completed / d.total) * 100 : 0), 0) / history.length
      )
    : 0;
  
  return { totalPoints, totalActs, activeDays, avgCompletion };
}

// Calculate streak from daily progress data
export function calculateStreakFromProgress(): number {
  const all = getAllDailyProgress();
  let streak = 0;
  const today = new Date();
  
  // Start checking from today and go backwards
  for (let i = 0; i < 365; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() - i);
    const dateKey = checkDate.toISOString().split('T')[0];
    const progress = all[dateKey];
    
    // If there's activity for this day, increment streak
    if (progress && progress.completed > 0) {
      streak++;
    } else if (i === 0) {
      // If today has no activity yet, continue checking (don't break streak yet)
      continue;
    } else {
      // No activity on a previous day, streak is broken
      break;
    }
  }
  
  return streak;
}

// ============== Onboarding State Functions ==============
const DEFAULT_ONBOARDING: OnboardingState = {
  hasCompletedFirstAct: false,
  hasEarnedFirstPoints: false,
  hasSeenWelcome: false,
  firstActDate: null,
  dismissedPrompts: [],
};

export function getOnboardingState(): OnboardingState {
  return getStorage<OnboardingState>(ONBOARDING_KEY, DEFAULT_ONBOARDING);
}

export function updateOnboardingState(updates: Partial<OnboardingState>): OnboardingState {
  const current = getOnboardingState();
  const updated = { ...current, ...updates };
  setStorage(ONBOARDING_KEY, updated);
  return updated;
}

export function dismissPrompt(promptId: string): void {
  const current = getOnboardingState();
  if (!current.dismissedPrompts.includes(promptId)) {
    updateOnboardingState({
      dismissedPrompts: [...current.dismissedPrompts, promptId],
    });
  }
}

export function isPromptDismissed(promptId: string): boolean {
  const state = getOnboardingState();
  return state.dismissedPrompts.includes(promptId);
}

export function resetOnboardingState(): void {
  setStorage(ONBOARDING_KEY, DEFAULT_ONBOARDING);
}

// Check if user is a new user (no progress recorded)
export function isNewUser(): boolean {
  const all = getAllDailyProgress();
  const onboarding = getOnboardingState();
  
  return Object.keys(all).length === 0 && !onboarding.hasCompletedFirstAct;
}

// Check if user has completed any acts today
export function hasActivityToday(): boolean {
  const today = getTodayProgress();
  return today.completed > 0;
}
