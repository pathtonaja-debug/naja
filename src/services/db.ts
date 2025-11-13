import { supabase } from "@/integrations/supabase/client";
import { getDeviceId } from "@/lib/deviceId";
import { 
  reflectionSchema, 
  habitSchema, 
  duaSchema, 
  dhikrSessionSchema,
  companionProfileSchema 
} from "@/lib/validation";

// Reflections
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
  const deviceId = getDeviceId();
  
  const { data, error } = await supabase
    .from('reflections')
    .insert({
      device_id: deviceId,
      ...validated,
    })
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

export async function uploadReflectionPhoto(file: File): Promise<string> {
  const deviceId = getDeviceId();
  const fileExt = file.name.split('.').pop();
  const fileName = `${deviceId}/${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('reflections')
    .upload(fileName, file);

  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = supabase.storage
    .from('reflections')
    .getPublicUrl(fileName);

  return publicUrl;
}

export async function listReflections() {
  const deviceId = getDeviceId();
  
  const { data, error } = await supabase
    .from('reflections')
    .select('*')
    .eq('device_id', deviceId)
    .order('date', { ascending: false });
    
  if (error) throw error;
  return data || [];
}

// Habits
export async function listHabits() {
  const deviceId = getDeviceId();
  
  const { data: habits, error } = await supabase
    .from('habits')
    .select('*, habit_logs(*)')
    .eq('device_id', deviceId)
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
  const deviceId = getDeviceId();
  
  const today = new Date().toISOString().split('T')[0];
  
  // Check if log exists
  const { data: existingLog } = await supabase
    .from('habit_logs')
    .select('*')
    .eq('habit_id', id)
    .eq('device_id', deviceId)
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
        device_id: deviceId,
        date: today,
        completed: true,
      });
      
    if (error) throw error;
  }
  
  return listHabits();
}

// Duas
export async function listDuas() {
  const deviceId = getDeviceId();
  
  const { data, error } = await supabase
    .from('duas')
    .select('*')
    .eq('device_id', deviceId)
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  return data || [];
}

export async function saveDua(dua: { title: string; category: string; content: any }) {
  // Validate input
  const validated = duaSchema.parse(dua);
  const deviceId = getDeviceId();
  
  const { data, error } = await supabase
    .from('duas')
    .insert({
      device_id: deviceId,
      ...validated,
    })
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

// Dhikr sessions
export async function saveDhikrSession(phrase: string, count: number, target?: number) {
  // Validate input
  const validated = dhikrSessionSchema.parse({ phrase, count, target });
  const deviceId = getDeviceId();
  
  const { data, error } = await supabase
    .from('dhikr_sessions')
    .insert({
      device_id: deviceId,
      ...validated,
      date: new Date().toISOString().split('T')[0],
    })
    .select()
    .single();
    
  if (error) throw error;
  return data;
}
