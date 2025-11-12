import { supabase } from "@/integrations/supabase/client";

// Reflections
export async function addReflection(entry: { date: string; text: string; prompt?: string }) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  
  const { data, error } = await supabase
    .from('reflections')
    .insert({
      user_id: user.id,
      date: entry.date,
      text: entry.text,
      prompt: entry.prompt,
    })
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

export async function listReflections() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  
  const { data, error } = await supabase
    .from('reflections')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false });
    
  if (error) throw error;
  return data || [];
}

// Habits
export async function listHabits() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  
  const { data: habits, error } = await supabase
    .from('habits')
    .select('*, habit_logs(*)')
    .eq('user_id', user.id)
    .eq('is_active', true);
    
  if (error) throw error;
  
  // Calculate streaks from habit_logs
  return (habits || []).map(habit => {
    const today = new Date().toISOString().split('T')[0];
    const todayLog = habit.habit_logs?.find((log: any) => log.date === today);
    
    return {
      id: habit.id,
      name: habit.name,
      completed: todayLog?.completed || false,
      streak: calculateStreak(habit.habit_logs || []),
    };
  });
}

function calculateStreak(logs: any[]) {
  const sortedLogs = logs
    .filter(log => log.completed)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
  let streak = 0;
  const today = new Date();
  
  for (const log of sortedLogs) {
    const logDate = new Date(log.date);
    const daysDiff = Math.floor((today.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === streak) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
}

export async function toggleHabit(id: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  
  const today = new Date().toISOString().split('T')[0];
  
  // Check if log exists
  const { data: existingLog } = await supabase
    .from('habit_logs')
    .select('*')
    .eq('habit_id', id)
    .eq('date', today)
    .single();
    
  if (existingLog) {
    // Update existing log
    const { error } = await supabase
      .from('habit_logs')
      .update({ completed: !existingLog.completed })
      .eq('id', existingLog.id);
      
    if (error) throw error;
  } else {
    // Create new log
    const { error } = await supabase
      .from('habit_logs')
      .insert({
        habit_id: id,
        user_id: user.id,
        date: today,
        completed: true,
      });
      
    if (error) throw error;
  }
  
  return listHabits();
}

// Duas
export async function listDuas() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  
  const { data, error } = await supabase
    .from('duas')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  return data || [];
}

export async function saveDua(dua: { title: string; category: string; content: any }) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  
  const { data, error } = await supabase
    .from('duas')
    .insert({
      user_id: user.id,
      title: dua.title,
      category: dua.category,
      content: dua.content,
    })
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

// Dhikr sessions
export async function saveDhikrSession(phrase: string, count: number, target?: number) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  
  const { data, error } = await supabase
    .from('dhikr_sessions')
    .insert({
      user_id: user.id,
      phrase,
      count,
      target,
      date: new Date().toISOString().split('T')[0],
    })
    .select()
    .single();
    
  if (error) throw error;
  return data;
}
