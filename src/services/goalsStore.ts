// Goals persistence service
// Stores active goal, daily completion state, and streak data

import { generateUUID } from '@/lib/uuid';

// ============== Storage Keys ==============
const KEYS = {
  ACTIVE_GOAL: 'naja_active_goal',
  GOAL_COMPLETIONS: 'naja_goal_completions',
  GOAL_REFLECTIONS: 'naja_goal_reflections',
} as const;

// ============== Types ==============
export interface GoalConfig {
  id: string;
  goalId: string;
  goalTitle: string;
  goalIcon: string; // Icon name from lucide
  timeframe: number; // days
  level: 'beginner' | 'moderate' | 'consistent';
  dailyTime: number; // minutes
  startDate: string; // YYYY-MM-DD
  weeklyPlan: WeekPlan[];
  status: 'active' | 'paused' | 'completed';
}

export interface WeekPlan {
  week: number;
  tasks: string[];
  milestone: string;
}

export interface DayCompletion {
  date: string; // YYYY-MM-DD
  tasksCompleted: boolean[];
  completed: boolean; // All tasks done for that day
}

export interface GoalReflection {
  date: string;
  text: string;
}

// ============== Helpers ==============
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

// ============== Active Goal ==============
export function getActiveGoal(): GoalConfig | null {
  return getStorage<GoalConfig | null>(KEYS.ACTIVE_GOAL, null);
}

export function setActiveGoal(goal: GoalConfig): void {
  setStorage(KEYS.ACTIVE_GOAL, goal);
}

export function clearActiveGoal(): void {
  localStorage.removeItem(KEYS.ACTIVE_GOAL);
  localStorage.removeItem(KEYS.GOAL_COMPLETIONS);
  localStorage.removeItem(KEYS.GOAL_REFLECTIONS);
}

export function pauseGoal(): void {
  const goal = getActiveGoal();
  if (goal) {
    goal.status = 'paused';
    setActiveGoal(goal);
  }
}

export function resumeGoal(): void {
  const goal = getActiveGoal();
  if (goal) {
    goal.status = 'active';
    setActiveGoal(goal);
  }
}

export function updateGoalDailyTime(minutes: number): void {
  const goal = getActiveGoal();
  if (goal) {
    goal.dailyTime = minutes;
    setActiveGoal(goal);
  }
}

// ============== Day Completions ==============
export function getCompletions(): DayCompletion[] {
  return getStorage<DayCompletion[]>(KEYS.GOAL_COMPLETIONS, []);
}

export function getTodayCompletion(): DayCompletion | null {
  const today = new Date().toISOString().split('T')[0];
  return getCompletions().find(c => c.date === today) || null;
}

export function toggleTaskCompletion(taskIndex: number): DayCompletion {
  const today = new Date().toISOString().split('T')[0];
  const completions = getCompletions();
  let todayCompletion = completions.find(c => c.date === today);
  
  const goal = getActiveGoal();
  const todayTasks = getTodayTasks(goal);
  
  if (!todayCompletion) {
    todayCompletion = {
      date: today,
      tasksCompleted: new Array(todayTasks.length).fill(false),
      completed: false,
    };
    completions.push(todayCompletion);
  }
  
  // Toggle the task
  todayCompletion.tasksCompleted[taskIndex] = !todayCompletion.tasksCompleted[taskIndex];
  
  // Check if all tasks are completed
  todayCompletion.completed = todayCompletion.tasksCompleted.every(t => t);
  
  setStorage(KEYS.GOAL_COMPLETIONS, completions);
  return todayCompletion;
}

export function markTodayComplete(): void {
  const today = new Date().toISOString().split('T')[0];
  const completions = getCompletions();
  let todayCompletion = completions.find(c => c.date === today);
  
  if (todayCompletion) {
    todayCompletion.completed = true;
    todayCompletion.tasksCompleted = todayCompletion.tasksCompleted.map(() => true);
    setStorage(KEYS.GOAL_COMPLETIONS, completions);
  }
}

// ============== Reflections ==============
export function getReflections(): GoalReflection[] {
  return getStorage<GoalReflection[]>(KEYS.GOAL_REFLECTIONS, []);
}

export function saveReflection(text: string): void {
  const today = new Date().toISOString().split('T')[0];
  const reflections = getReflections();
  const existing = reflections.findIndex(r => r.date === today);
  
  if (existing >= 0) {
    reflections[existing].text = text;
  } else {
    reflections.push({ date: today, text });
  }
  
  setStorage(KEYS.GOAL_REFLECTIONS, reflections);
}

export function getTodayReflection(): string {
  const today = new Date().toISOString().split('T')[0];
  const reflections = getReflections();
  return reflections.find(r => r.date === today)?.text || '';
}

// ============== Streak Calculation ==============
export function getGoalStreak(): number {
  const goal = getActiveGoal();
  if (!goal) return 0;
  
  const completions = getCompletions();
  const today = new Date().toISOString().split('T')[0];
  
  // Sort by date descending
  const sorted = [...completions]
    .filter(c => c.completed)
    .sort((a, b) => b.date.localeCompare(a.date));
  
  if (sorted.length === 0) return 0;
  
  let streak = 0;
  let currentDate = new Date(today);
  
  // If today is not completed, start from yesterday
  if (!sorted.some(c => c.date === today)) {
    currentDate.setDate(currentDate.getDate() - 1);
  }
  
  for (const completion of sorted) {
    const expectedDate = currentDate.toISOString().split('T')[0];
    if (completion.date === expectedDate) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }
  
  return streak;
}

// ============== Current Day & Week ==============
export function getCurrentDayNumber(): number {
  const goal = getActiveGoal();
  if (!goal) return 0;
  
  const startDate = new Date(goal.startDate);
  const today = new Date();
  const diffTime = today.getTime() - startDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
  
  return Math.min(diffDays, goal.timeframe);
}

export function getCurrentWeekNumber(): number {
  return Math.ceil(getCurrentDayNumber() / 7);
}

export function isWeekCompleted(weekNumber: number): boolean {
  const goal = getActiveGoal();
  if (!goal) return false;
  
  const completions = getCompletions();
  const startDate = new Date(goal.startDate);
  
  // Calculate week date range
  const weekStartDay = (weekNumber - 1) * 7 + 1;
  const weekEndDay = Math.min(weekNumber * 7, goal.timeframe);
  
  // Check if all days in the week are completed
  for (let day = weekStartDay; day <= weekEndDay; day++) {
    const dayDate = new Date(startDate);
    dayDate.setDate(startDate.getDate() + day - 1);
    const dateStr = dayDate.toISOString().split('T')[0];
    
    const completion = completions.find(c => c.date === dateStr);
    if (!completion?.completed) return false;
  }
  
  return true;
}

// ============== Today's Tasks ==============
export function getTodayTasks(goal: GoalConfig | null): string[] {
  if (!goal) return [];
  
  const currentWeek = getCurrentWeekNumber();
  const weekPlan = goal.weeklyPlan.find(w => w.week === currentWeek);
  
  if (!weekPlan) {
    // If we're past the planned weeks, use the last week's tasks
    const lastWeek = goal.weeklyPlan[goal.weeklyPlan.length - 1];
    return lastWeek?.tasks || [];
  }
  
  return weekPlan.tasks;
}

// ============== Plan Generation ==============
export function generateExtendedPlan(
  goalId: string, 
  timeframe: number, 
  level: 'beginner' | 'moderate' | 'consistent'
): WeekPlan[] {
  const weekCount = Math.ceil(timeframe / 7);
  const plan: WeekPlan[] = [];
  
  const planTemplates: Record<string, WeekPlan[]> = {
    'prayer-consistency': [
      { week: 1, tasks: ['Track 2 daily prayers', 'Set prayer reminders', 'Learn prayer focus tips'], milestone: 'Establish tracking habit' },
      { week: 2, tasks: ['Track 3-4 daily prayers', 'Add Sunnah prayers', 'Improve concentration'], milestone: 'Increase consistency' },
      { week: 3, tasks: ['Track all 5 prayers', 'Pray on time', 'Add khushu practices'], milestone: 'Full prayer coverage' },
      { week: 4, tasks: ['Maintain all prayers', 'Add night prayer', 'Deepen reflection'], milestone: 'Complete transformation' },
    ],
    'quran-reading': [
      { week: 1, tasks: ['Read 1 page daily', 'Learn 3 new words', 'Listen to recitation'], milestone: 'Start reading habit' },
      { week: 2, tasks: ['Read 2 pages daily', 'Study tafsir of 1 ayah', 'Memorize short surah'], milestone: 'Increase reading' },
      { week: 3, tasks: ['Read 3 pages daily', 'Reflect on meanings', 'Join Quran circle'], milestone: 'Deepen understanding' },
      { week: 4, tasks: ['Read consistently', 'Complete a juz', 'Share learnings'], milestone: 'Establish routine' },
    ],
    'islamic-knowledge': [
      { week: 1, tasks: ['Read 10 min daily', 'Take notes', 'Learn 1 hadith'], milestone: 'Start learning habit' },
      { week: 2, tasks: ['Study Seerah', 'Watch lecture', 'Discuss with others'], milestone: 'Expand knowledge' },
      { week: 3, tasks: ['Deep dive topic', 'Review notes', 'Apply learnings'], milestone: 'Deepen understanding' },
      { week: 4, tasks: ['Teach someone', 'Create summary', 'Set new topic'], milestone: 'Share knowledge' },
    ],
    'dhikr-habit': [
      { week: 1, tasks: ['33 SubhanAllah daily', 'Set dhikr reminders', 'Learn meanings'], milestone: 'Start dhikr habit' },
      { week: 2, tasks: ['Add Alhamdulillah', 'Morning adhkar', 'Evening adhkar'], milestone: 'Expand practice' },
      { week: 3, tasks: ['Full tasbih set', 'Istighfar 100x', 'Mindful presence'], milestone: 'Deepen practice' },
      { week: 4, tasks: ['Multiple sessions', 'Add salawat', 'Constant remembrance'], milestone: 'Living dhikr' },
    ],
    'character-improvement': [
      { week: 1, tasks: ['Daily patience practice', 'Control one reaction', 'Reflect on character'], milestone: 'Awareness building' },
      { week: 2, tasks: ['Practice gratitude', 'One act of kindness', 'Avoid backbiting'], milestone: 'Active improvement' },
      { week: 3, tasks: ['Forgive someone', 'Help a neighbor', 'Improve one relationship'], milestone: 'Relationship focus' },
      { week: 4, tasks: ['Lead by example', 'Mentor someone', 'Consistent practice'], milestone: 'Character embodiment' },
    ],
    'charity-giving': [
      { week: 1, tasks: ['Give small daily', 'Research charities', 'Set giving goal'], milestone: 'Start giving habit' },
      { week: 2, tasks: ['Volunteer 1 hour', 'Help neighbor', 'Smile as sadaqah'], milestone: 'Expand giving types' },
      { week: 3, tasks: ['Plan monthly budget', 'Support local cause', 'Encourage others'], milestone: 'Systematic giving' },
      { week: 4, tasks: ['Set up recurring', 'Zakat calculation', 'Teach children charity'], milestone: 'Sustainable giving' },
    ],
  };
  
  const template = planTemplates[goalId] || planTemplates['prayer-consistency'];
  
  // Generate weeks based on timeframe
  for (let i = 1; i <= weekCount; i++) {
    if (i <= template.length) {
      plan.push({ ...template[i - 1], week: i });
    } else {
      // Extended weeks with variation
      const baseWeek = template[(i - 1) % template.length];
      const phase = Math.floor((i - 1) / template.length);
      
      let milestone: string;
      if (i % 4 === 0) {
        milestone = 'Review & reflect week';
      } else if (phase === 1) {
        milestone = 'Maintain & deepen';
      } else if (phase === 2) {
        milestone = 'Master & excel';
      } else {
        milestone = 'Continue & grow';
      }
      
      // Slightly modify tasks for variation
      const modifiedTasks = baseWeek.tasks.map(task => {
        if (phase > 0) {
          return task.replace('Track', 'Perfect').replace('Read', 'Study deeply').replace('Practice', 'Master');
        }
        return task;
      });
      
      plan.push({
        week: i,
        tasks: modifiedTasks,
        milestone,
      });
    }
  }
  
  return plan;
}

// ============== Create New Goal ==============
export function createGoal(
  goalId: string,
  goalTitle: string,
  goalIcon: string,
  timeframe: number,
  level: 'beginner' | 'moderate' | 'consistent',
  dailyTime: number,
  weeklyPlan: WeekPlan[]
): GoalConfig {
  const goal: GoalConfig = {
    id: generateUUID(),
    goalId,
    goalTitle,
    goalIcon,
    timeframe,
    level,
    dailyTime,
    startDate: new Date().toISOString().split('T')[0],
    weeklyPlan,
    status: 'active',
  };
  
  setActiveGoal(goal);
  // Clear old completions
  setStorage(KEYS.GOAL_COMPLETIONS, []);
  setStorage(KEYS.GOAL_REFLECTIONS, []);
  
  return goal;
}
