import { supabase } from "@/integrations/supabase/client";
import { getAuthenticatedUserId } from "@/lib/auth";
import { 
  reflectionSchema, 
  habitSchema, 
  duaSchema, 
  dhikrSessionSchema,
  companionProfileSchema 
} from "@/lib/validation";

// ============== Reflections ==============

export async function addReflection(entry: { 
  date: string; 
  text: string; 
  prompt?: string;
  mood?: string;
  photo_url?: string;
  voice_note_url?: string;
}) {
  // Validate input
  const validated = reflectionSchema.parse(entry);
  const userId = await getAuthenticatedUserId();
  
  const { data, error } = await supabase
    .from('reflections')
    .insert({
      user_id: userId,
      ...validated,
    })
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

export async function uploadReflectionPhoto(file: File): Promise<string> {
  const userId = await getAuthenticatedUserId();
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('reflections')
    .upload(fileName, file);

  if (uploadError) throw uploadError;

  // Use signed URL for private bucket (1 hour expiry)
  const { data: signedUrlData, error: signedUrlError } = await supabase.storage
    .from('reflections')
    .createSignedUrl(fileName, 3600);

  if (signedUrlError) throw signedUrlError;
  
  return signedUrlData.signedUrl;
}

export async function getReflectionPhotoUrl(filePath: string): Promise<string> {
  const { data, error } = await supabase.storage
    .from('reflections')
    .createSignedUrl(filePath, 3600); // 1 hour expiry

  if (error) throw error;
  return data.signedUrl;
}

export async function listReflections() {
  const userId = await getAuthenticatedUserId();
  
  const { data, error } = await supabase
    .from('reflections')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });
    
  if (error) throw error;
  return data || [];
}

// ============== Habits ==============

export async function listHabits() {
  const userId = await getAuthenticatedUserId();
  
  const { data: habits, error } = await supabase
    .from('habits')
    .select('*, habit_logs(*)')
    .eq('user_id', userId)
    .eq('is_active', true);
    
  if (error) throw error;
  
  // Calculate streaks from habit_logs
  return (habits || []).map(habit => {
    const today = new Date().toISOString().split('T')[0];
    const todayLog = habit.habit_logs?.find((log: { date: string }) => log.date === today);
    
    return {
      id: habit.id,
      name: habit.name,
      completed: todayLog?.completed || false,
      streak: calculateStreak(habit.habit_logs || []),
    };
  });
}

function calculateStreak(logs: { date: string; completed: boolean }[]) {
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
  const userId = await getAuthenticatedUserId();
  
  const today = new Date().toISOString().split('T')[0];
  
  // Check if log exists
  const { data: existingLog } = await supabase
    .from('habit_logs')
    .select('*')
    .eq('habit_id', id)
    .eq('user_id', userId)
    .eq('date', today)
    .maybeSingle();
    
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
        user_id: userId,
        date: today,
        completed: true,
      });
      
    if (error) throw error;
  }
}

export async function createHabit(habit: {
  name: string;
  category?: string;
  frequency?: string;
  icon?: string;
  target_count?: number;
}): Promise<unknown> {
  // Validate input using habitSchema
  const validated = habitSchema.parse({
    name: habit.name,
    category: habit.category,
    frequency: habit.frequency || 'daily',
    target_count: habit.target_count || 1,
  });
  
  const userId = await getAuthenticatedUserId();
  
  const { data, error } = await supabase
    .from('habits')
    .insert({
      name: validated.name,
      category: validated.category || 'spiritual',
      frequency: validated.frequency,
      target_count: validated.target_count,
      icon: habit.icon || 'star',
      user_id: userId,
      is_active: true
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateHabit(id: string, updates: {
  name?: string;
  category?: string;
  frequency?: string;
  icon?: string;
  target_count?: number;
  reminder_time?: string;
  is_active?: boolean;
}): Promise<unknown> {
  // Build validation object for fields that have validation rules
  const validationData: Record<string, unknown> = {};
  if (updates.name !== undefined) validationData.name = updates.name;
  if (updates.category !== undefined) validationData.category = updates.category;
  if (updates.frequency !== undefined) validationData.frequency = updates.frequency;
  if (updates.target_count !== undefined) validationData.target_count = updates.target_count;
  if (updates.reminder_time !== undefined) validationData.reminder_time = updates.reminder_time;
  
  // Validate if there are validatable fields
  if (Object.keys(validationData).length > 0) {
    habitSchema.partial().parse(validationData);
  }
  
  const { data, error } = await supabase
    .from('habits')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteHabit(id: string): Promise<void> {
  const { error } = await supabase
    .from('habits')
    .update({ is_active: false })
    .eq('id', id);

  if (error) throw error;
}

export async function getHabitProgress(userId?: string, days: number = 7): Promise<{ habits: unknown[]; logs: unknown[] }> {
  const authenticatedUserId = await getAuthenticatedUserId();
  const endDate = new Date().toISOString().split('T')[0];
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const { data: habits, error: habitsError } = await supabase
    .from('habits')
    .select('id, name')
    .eq('user_id', authenticatedUserId)
    .eq('is_active', true);

  if (habitsError) throw habitsError;

  const habitIds = habits?.map(h => h.id) || [];
  
  const { data: logs, error: logsError } = await supabase
    .from('habit_logs')
    .select('*')
    .in('habit_id', habitIds)
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: true });

  if (logsError) throw logsError;

  return { habits: habits || [], logs: logs || [] };
}

export async function initializeDefaultHabits(): Promise<void> {
  const userId = await getAuthenticatedUserId();
  
  // Check if user already has any Prayer habits specifically (most critical)
  const { data: existingPrayers } = await supabase
    .from('habits')
    .select('name')
    .eq('user_id', userId)
    .eq('category', 'Prayer')
    .eq('is_active', true);

  // If user already has prayer habits, skip initialization
  if (existingPrayers && existingPrayers.length >= 5) return;

  // Define default habits
  const defaults = [
    { name: 'Fajr', category: 'Prayer', icon: 'sunrise' },
    { name: 'Dhuhr', category: 'Prayer', icon: 'sun' },
    { name: 'Asr', category: 'Prayer', icon: 'sun' },
    { name: 'Maghrib', category: 'Prayer', icon: 'sunset' },
    { name: 'Isha', category: 'Prayer', icon: 'moon' },
  ];

  // Get existing habit names to avoid duplicates
  const existingNames = new Set(existingPrayers?.map(h => h.name) || []);
  
  // Filter out habits that already exist
  const habitsToCreate = defaults.filter(d => !existingNames.has(d.name));
  
  if (habitsToCreate.length === 0) return;

  // Insert only missing habits
  const { error } = await supabase
    .from('habits')
    .insert(habitsToCreate.map(d => ({
      ...d,
      user_id: userId,
      frequency: 'daily',
      is_active: true
    })));

  // Ignore duplicate key errors (constraint will catch any race conditions)
  if (error && !error.message.includes('duplicate key')) {
    throw error;
  }
}

// ============== Duas ==============

export async function listDuas() {
  const userId = await getAuthenticatedUserId();
  
  const { data, error } = await supabase
    .from('duas')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  return data || [];
}

export async function saveDua(dua: { title: string; category: string; content: Record<string, unknown> }) {
  // Validate input
  const validated = duaSchema.parse(dua);
  const userId = await getAuthenticatedUserId();
  
  const { data, error } = await supabase
    .from('duas')
    .insert({
      user_id: userId,
      ...validated,
    })
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

// ============== Dhikr Sessions ==============

export async function saveDhikrSession(phrase: string, count: number, target?: number) {
  // Validate input
  const validated = dhikrSessionSchema.parse({ phrase, count, target });
  const userId = await getAuthenticatedUserId();
  
  const { data, error } = await supabase
    .from('dhikr_sessions')
    .insert({
      user_id: userId,
      ...validated,
      date: new Date().toISOString().split('T')[0],
    })
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

// ============== Companion Avatars (Signed URLs) ==============

export async function getCompanionAvatarUrl(filePath: string): Promise<string> {
  const { data, error } = await supabase.storage
    .from('companion-avatars')
    .createSignedUrl(filePath, 3600); // 1 hour expiry

  if (error) throw error;
  return data.signedUrl;
}

export async function uploadCompanionAvatar(file: File): Promise<string> {
  const userId = await getAuthenticatedUserId();
  const fileName = `${userId}/${Date.now()}-avatar.png`;
  
  const { error } = await supabase.storage
    .from('companion-avatars')
    .upload(fileName, file);

  if (error) throw error;

  // Return the file path - caller should use getCompanionAvatarUrl for URL
  return fileName;
}
