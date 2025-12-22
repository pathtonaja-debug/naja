// Local storage service for guest mode
// All data persists locally keyed by device UUID

import { getDeviceId } from '@/lib/guestAuth';

// ============== Storage Keys ==============
const KEYS = {
  REFLECTIONS: 'naja_reflections',
  DUAS: 'naja_duas',
  DUA_FOLDERS: 'naja_dua_folders',
  QUIZ_ATTEMPTS: 'naja_quiz_attempts',
  ACHIEVEMENTS: 'naja_achievements',
  GAMIFICATION: 'naja_gamification',
} as const;

// ============== Types ==============
export interface LocalReflection {
  id: string;
  date: string;
  text: string;
  prompt?: string;
  mood?: string;
  created_at: string;
}

export interface LocalDua {
  id: string;
  title: string;
  topic: string | null;
  folder_id: string | null;
  final_text: string;
  is_favorite: boolean;
  created_at: string;
  selected_names: string[] | null;
  request_text?: string | null;
  ummah_prayers?: string[] | null;
  include_salawat?: boolean;
}

export interface LocalDuaFolder {
  id: string;
  name: string;
  created_at: string;
}

export interface LocalQuizAttempt {
  id: string;
  quiz_date: string;
  score: number;
  total_questions: number;
  answers: number[];
  completed_at: string;
}

export interface LocalAchievement {
  id: string;
  achievement_id: string;
  earned_at: string;
}

export interface LocalGamification {
  barakahPoints: number;
  level: number;
  hasanatStreak: number;
  lastActivityDate: string | null;
  totalDhikr: number;
  totalPrayers: number;
  totalQuizzes: number;
}

// ============== Helpers ==============
function getStorage<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setStorage<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

// ============== Reflections ==============
export function getReflections(): LocalReflection[] {
  return getStorage<LocalReflection[]>(KEYS.REFLECTIONS, []);
}

export function addReflection(entry: Omit<LocalReflection, 'id' | 'created_at'>): LocalReflection {
  const reflections = getReflections();
  const newReflection: LocalReflection = {
    ...entry,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
  };
  reflections.unshift(newReflection);
  setStorage(KEYS.REFLECTIONS, reflections);
  return newReflection;
}

export function deleteReflection(id: string): void {
  const reflections = getReflections().filter(r => r.id !== id);
  setStorage(KEYS.REFLECTIONS, reflections);
}

// ============== Duas ==============
export function getDuas(): LocalDua[] {
  return getStorage<LocalDua[]>(KEYS.DUAS, []);
}

export function addDua(dua: Omit<LocalDua, 'id' | 'created_at'>): LocalDua {
  const duas = getDuas();
  const newDua: LocalDua = {
    ...dua,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
  };
  duas.unshift(newDua);
  setStorage(KEYS.DUAS, duas);
  return newDua;
}

export function updateDua(id: string, updates: Partial<LocalDua>): void {
  const duas = getDuas().map(d => 
    d.id === id ? { ...d, ...updates } : d
  );
  setStorage(KEYS.DUAS, duas);
}

export function deleteDua(id: string): void {
  const duas = getDuas().filter(d => d.id !== id);
  setStorage(KEYS.DUAS, duas);
}

// ============== Dua Folders ==============
export function getDuaFolders(): LocalDuaFolder[] {
  return getStorage<LocalDuaFolder[]>(KEYS.DUA_FOLDERS, []);
}

export function addDuaFolder(name: string): LocalDuaFolder {
  const folders = getDuaFolders();
  const newFolder: LocalDuaFolder = {
    id: crypto.randomUUID(),
    name,
    created_at: new Date().toISOString(),
  };
  folders.unshift(newFolder);
  setStorage(KEYS.DUA_FOLDERS, folders);
  return newFolder;
}

export function deleteDuaFolder(id: string): void {
  // Remove folder
  const folders = getDuaFolders().filter(f => f.id !== id);
  setStorage(KEYS.DUA_FOLDERS, folders);
  
  // Clear folder_id from associated duas
  const duas = getDuas().map(d => 
    d.folder_id === id ? { ...d, folder_id: null } : d
  );
  setStorage(KEYS.DUAS, duas);
}

// ============== Quiz Attempts ==============
export function getQuizAttempts(): LocalQuizAttempt[] {
  return getStorage<LocalQuizAttempt[]>(KEYS.QUIZ_ATTEMPTS, []);
}

export function getTodayQuizAttempt(): LocalQuizAttempt | null {
  const today = new Date().toISOString().split('T')[0];
  return getQuizAttempts().find(a => a.quiz_date === today) || null;
}

export function addQuizAttempt(attempt: Omit<LocalQuizAttempt, 'id' | 'completed_at'>): LocalQuizAttempt {
  const attempts = getQuizAttempts();
  const newAttempt: LocalQuizAttempt = {
    ...attempt,
    id: crypto.randomUUID(),
    completed_at: new Date().toISOString(),
  };
  attempts.unshift(newAttempt);
  setStorage(KEYS.QUIZ_ATTEMPTS, attempts);
  return newAttempt;
}

// ============== Achievements (Local) ==============
export function getLocalAchievements(): LocalAchievement[] {
  return getStorage<LocalAchievement[]>(KEYS.ACHIEVEMENTS, []);
}

export function addLocalAchievement(achievementId: string): LocalAchievement | null {
  const achievements = getLocalAchievements();
  if (achievements.some(a => a.achievement_id === achievementId)) {
    return null; // Already earned
  }
  
  const newAchievement: LocalAchievement = {
    id: crypto.randomUUID(),
    achievement_id: achievementId,
    earned_at: new Date().toISOString(),
  };
  achievements.push(newAchievement);
  setStorage(KEYS.ACHIEVEMENTS, achievements);
  return newAchievement;
}

// ============== Gamification Stats ==============
const DEFAULT_GAMIFICATION: LocalGamification = {
  barakahPoints: 0,
  level: 1,
  hasanatStreak: 0,
  lastActivityDate: null,
  totalDhikr: 0,
  totalPrayers: 0,
  totalQuizzes: 0,
};

export function getGamification(): LocalGamification {
  return getStorage<LocalGamification>(KEYS.GAMIFICATION, DEFAULT_GAMIFICATION);
}

export function updateGamification(updates: Partial<LocalGamification>): LocalGamification {
  const current = getGamification();
  const updated = { ...current, ...updates };
  setStorage(KEYS.GAMIFICATION, updated);
  return updated;
}

// Point rewards
export const BARAKAH_REWARDS = {
  PRAYER_COMPLETED: 15,
  HABIT_COMPLETED: 10,
  DHIKR_TARGET: 20,
  QUIZ_CORRECT_ANSWER: 25,
  QUIZ_PERFECT_SCORE: 50,
  DAILY_LOGIN: 5,
  REFLECTION_WRITTEN: 15,
  DUA_CREATED: 10,
} as const;

// Level calculations
export function getLevelFromPoints(points: number): number {
  let level = 1;
  let threshold = 0;
  
  while (points >= threshold && level <= 10) {
    level++;
    threshold += level * 50;
  }
  
  return Math.min(level - 1, 10);
}

export function getPointsForNextLevel(currentLevel: number): number {
  let threshold = 0;
  for (let i = 1; i <= currentLevel; i++) {
    threshold += (i + 1) * 50;
  }
  return threshold;
}

export function addBarakahPoints(amount: number): { leveledUp: boolean; newLevel: number } {
  const current = getGamification();
  const oldLevel = current.level;
  const newPoints = current.barakahPoints + amount;
  const newLevel = getLevelFromPoints(newPoints);
  const leveledUp = newLevel > oldLevel;
  
  updateGamification({
    barakahPoints: newPoints,
    level: newLevel,
    lastActivityDate: new Date().toISOString().split('T')[0],
  });
  
  return { leveledUp, newLevel };
}

export function updateStreak(): number {
  const current = getGamification();
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  
  let newStreak = current.hasanatStreak;
  
  if (current.lastActivityDate === today) {
    return newStreak;
  } else if (current.lastActivityDate === yesterday) {
    newStreak = current.hasanatStreak + 1;
  } else {
    newStreak = 1;
  }
  
  updateGamification({
    hasanatStreak: newStreak,
    lastActivityDate: today,
  });
  
  return newStreak;
}
