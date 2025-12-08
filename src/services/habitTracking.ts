import { supabase } from "@/integrations/supabase/client";
import { getAuthenticatedUserId } from "@/lib/auth";

export interface Habit {
  id: string;
  name: string;
  category: string;
  notes?: string;
  icon?: string;
  is_all_day: boolean;
  habit_time?: string;
  repeat_pattern: any;
  sync_to_calendar: boolean;
  color?: string;
  frequency?: string;
  target_count?: number;
  created_at: string;
}

export interface HabitLog {
  id: string;
  habit_id: string;
  date: string;
  completed: boolean;
  count?: number;
}

export interface HabitStats {
  habit_id: string;
  current_streak: number;
  longest_streak: number;
  total_completions: number;
  last_completed_date?: string;
  weekly_breakdown: any;
  monthly_breakdown: any;
}

export interface CategoryProgress {
  category: string;
  total: number;
  completed: number;
  percentage: number;
}

// Get all habits
export async function getAllHabits(): Promise<Habit[]> {
  const userId = await getAuthenticatedUserId();
  
  const { data, error } = await supabase
    .from('habits')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .order('created_at', { ascending: true });
    
  if (error) throw error;
  return data || [];
}

// Get habits by category
export async function getHabitsByCategory(category: string): Promise<Habit[]> {
  const userId = await getAuthenticatedUserId();
  
  const { data, error } = await supabase
    .from('habits')
    .select('*')
    .eq('user_id', userId)
    .eq('category', category)
    .eq('is_active', true)
    .order('created_at', { ascending: true });
    
  if (error) throw error;
  return data || [];
}

// Get habit with stats
export async function getHabitWithStats(habitId: string) {
  const { data: habit, error: habitError } = await supabase
    .from('habits')
    .select('*')
    .eq('id', habitId)
    .single();
    
  if (habitError) throw habitError;
  
  const { data: stats, error: statsError } = await supabase
    .from('habit_stats')
    .select('*')
    .eq('habit_id', habitId)
    .maybeSingle();
    
  if (statsError) throw statsError;
  
  return { habit, stats };
}

// Create new habit
export async function createHabit(habit: Omit<Habit, 'id' | 'created_at'>): Promise<Habit> {
  const userId = await getAuthenticatedUserId();
  
  const { data, error } = await supabase
    .from('habits')
    .insert({
      ...habit,
      user_id: userId,
      is_active: true
    })
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

// Update habit
export async function updateHabit(id: string, updates: Partial<Habit>): Promise<Habit> {
  const { data, error } = await supabase
    .from('habits')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

// Delete habit
export async function deleteHabit(id: string): Promise<void> {
  const { error } = await supabase
    .from('habits')
    .update({ is_active: false })
    .eq('id', id);
    
  if (error) throw error;
}

// Log habit completion
export async function logHabitCompletion(habitId: string, completed: boolean, count?: number): Promise<void> {
  const userId = await getAuthenticatedUserId();
  const today = new Date().toISOString().split('T')[0];
  
  const { data: existingLog } = await supabase
    .from('habit_logs')
    .select('*')
    .eq('habit_id', habitId)
    .eq('user_id', userId)
    .eq('date', today)
    .maybeSingle();
    
  if (existingLog) {
    const { error } = await supabase
      .from('habit_logs')
      .update({ completed, count })
      .eq('id', existingLog.id);
      
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from('habit_logs')
      .insert({
        habit_id: habitId,
        user_id: userId,
        date: today,
        completed,
        count
      });
      
    if (error) throw error;
  }
}

// Get today's habit logs
export async function getTodayHabitLogs(): Promise<HabitLog[]> {
  const userId = await getAuthenticatedUserId();
  const today = new Date().toISOString().split('T')[0];
  
  const { data, error } = await supabase
    .from('habit_logs')
    .select('*')
    .eq('user_id', userId)
    .eq('date', today);
    
  if (error) throw error;
  return data || [];
}

// Get habit logs for date range
export async function getHabitLogs(habitId: string, startDate: string, endDate: string): Promise<HabitLog[]> {
  const userId = await getAuthenticatedUserId();
  
  const { data, error } = await supabase
    .from('habit_logs')
    .select('*')
    .eq('habit_id', habitId)
    .eq('user_id', userId)
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: true });
    
  if (error) throw error;
  return data || [];
}

// Get category progress for today
export async function getCategoryProgress(): Promise<CategoryProgress[]> {
  const userId = await getAuthenticatedUserId();
  const today = new Date().toISOString().split('T')[0];
  
  const { data: habits } = await supabase
    .from('habits')
    .select('id, category')
    .eq('user_id', userId)
    .eq('is_active', true);
    
  if (!habits) return [];
  
  const { data: logs } = await supabase
    .from('habit_logs')
    .select('habit_id, completed')
    .eq('user_id', userId)
    .eq('date', today);
    
  const logMap = new Map(logs?.map(l => [l.habit_id, l.completed]) || []);
  
  const categoryMap = new Map<string, { total: number; completed: number }>();
  
  habits.forEach(habit => {
    const current = categoryMap.get(habit.category) || { total: 0, completed: 0 };
    current.total++;
    if (logMap.get(habit.id)) current.completed++;
    categoryMap.set(habit.category, current);
  });
  
  return Array.from(categoryMap.entries()).map(([category, data]) => ({
    category,
    total: data.total,
    completed: data.completed,
    percentage: data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0
  }));
}

// Initialize default habits
export async function initializeDefaultHabits(): Promise<void> {
  const userId = await getAuthenticatedUserId();
  
  const { data: existing } = await supabase
    .from('habits')
    .select('id')
    .eq('user_id', userId)
    .limit(1);
    
  if (existing && existing.length > 0) return;
  
  const defaults = [
    { name: 'Fajr', category: 'Salah', icon: 'sunrise', color: '#FFE5D9', habit_time: '05:00:00' },
    { name: 'Dhuhr', category: 'Salah', icon: 'sun', color: '#FFD6A5', habit_time: '13:00:00' },
    { name: 'Asr', category: 'Salah', icon: 'sun', color: '#FDFFB6', habit_time: '16:30:00' },
    { name: 'Maghrib', category: 'Salah', icon: 'sunset', color: '#FFADAD', habit_time: '18:30:00' },
    { name: 'Isha', category: 'Salah', icon: 'moon', color: '#9BF6FF', habit_time: '20:00:00' },
    { name: 'Qur\'an Reading', category: 'Quran', icon: 'book-open', color: '#BDB2FF' },
    { name: 'Daily Dhikr', category: 'Dhikr', icon: 'sparkles', color: '#FFC6FF', target_count: 100 },
    { name: 'Morning Dua', category: 'Dua', icon: 'hand', color: '#CAFFBF' },
    { name: 'Good Deed', category: 'One good deed of the day', icon: 'heart', color: '#A0C4FF' },
    { name: 'Gratitude', category: 'Custom', icon: 'smile', color: '#FFD6A5' }
  ];
  
  const { error } = await supabase
    .from('habits')
    .insert(defaults.map(d => ({
      ...d,
      user_id: userId,
      frequency: 'daily',
      is_active: true,
      is_all_day: !d.habit_time,
      repeat_pattern: { type: 'daily' },
      sync_to_calendar: false
    })));
    
  if (error) throw error;
}
