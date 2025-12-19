import { supabase } from "@/integrations/supabase/client";
import { getAuthenticatedUserId } from "@/lib/auth";

// XP requirements per level (increases progressively)
export const getXPForLevel = (level: number): number => {
  return Math.floor(100 * Math.pow(1.5, level - 1));
};

export const getLevelFromXP = (xp: number): number => {
  let level = 1;
  let totalXP = 0;
  while (totalXP + getXPForLevel(level) <= xp) {
    totalXP += getXPForLevel(level);
    level++;
  }
  return level;
};

export const getXPProgressInLevel = (xp: number): { current: number; required: number; percentage: number } => {
  let level = 1;
  let totalXP = 0;
  while (totalXP + getXPForLevel(level) <= xp) {
    totalXP += getXPForLevel(level);
    level++;
  }
  const currentLevelXP = xp - totalXP;
  const requiredXP = getXPForLevel(level);
  return {
    current: currentLevelXP,
    required: requiredXP,
    percentage: Math.round((currentLevelXP / requiredXP) * 100)
  };
};

// XP rewards for different actions
export const XP_REWARDS = {
  PRAYER_COMPLETED: 15,
  HABIT_COMPLETED: 10,
  DHIKR_TARGET: 20,
  QUIZ_CORRECT_ANSWER: 25,
  QUIZ_PERFECT_SCORE: 50,
  DAILY_LOGIN: 5,
  REFLECTION_WRITTEN: 15,
};

export const getUserGamification = async () => {
  const userId = await getAuthenticatedUserId();
  
  const { data, error } = await supabase
    .from('user_gamification')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error && error.code === 'PGRST116') {
    // No record exists, create one
    const { data: newData, error: insertError } = await supabase
      .from('user_gamification')
      .insert({ user_id: userId })
      .select()
      .single();
    
    if (insertError) throw insertError;
    return newData;
  }
  
  if (error) throw error;
  return data;
};

export const addXP = async (amount: number, reason?: string): Promise<{ newXP: number; leveledUp: boolean; newLevel: number }> => {
  const userId = await getAuthenticatedUserId();
  
  // Get current gamification data
  const current = await getUserGamification();
  const oldLevel = current.level;
  const newXP = current.xp + amount;
  const newLevel = getLevelFromXP(newXP);
  const leveledUp = newLevel > oldLevel;
  
  // Update gamification data
  const { error } = await supabase
    .from('user_gamification')
    .update({ 
      xp: newXP, 
      level: newLevel,
      last_activity_date: new Date().toISOString().split('T')[0]
    })
    .eq('user_id', userId);
  
  if (error) throw error;
  
  // Check for level achievements
  if (leveledUp) {
    await checkLevelAchievements(userId, newLevel);
  }
  
  return { newXP, leveledUp, newLevel };
};

export const updateStreak = async (): Promise<number> => {
  const userId = await getAuthenticatedUserId();
  const current = await getUserGamification();
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  
  let newStreak = current.streak_days;
  
  if (current.last_activity_date === today) {
    // Already logged activity today
    return newStreak;
  } else if (current.last_activity_date === yesterday) {
    // Continuing streak
    newStreak = current.streak_days + 1;
  } else {
    // Streak broken, start new one
    newStreak = 1;
  }
  
  const { error } = await supabase
    .from('user_gamification')
    .update({ 
      streak_days: newStreak,
      last_activity_date: today
    })
    .eq('user_id', userId);
  
  if (error) throw error;
  
  // Check for streak achievements
  await checkStreakAchievements(userId, newStreak);
  
  return newStreak;
};

export const getAchievements = async () => {
  const { data, error } = await supabase
    .from('achievements')
    .select('*')
    .order('requirement_value', { ascending: true });
  
  if (error) throw error;
  return data;
};

export const getUserAchievements = async () => {
  const userId = await getAuthenticatedUserId();
  
  const { data, error } = await supabase
    .from('user_achievements')
    .select(`
      *,
      achievement:achievements(*)
    `)
    .eq('user_id', userId);
  
  if (error) throw error;
  return data;
};

export const earnAchievement = async (achievementId: string): Promise<boolean> => {
  const userId = await getAuthenticatedUserId();
  
  // Check if already earned
  const { data: existing } = await supabase
    .from('user_achievements')
    .select('id')
    .eq('user_id', userId)
    .eq('achievement_id', achievementId)
    .single();
  
  if (existing) return false;
  
  // Get achievement details
  const { data: achievement } = await supabase
    .from('achievements')
    .select('*')
    .eq('id', achievementId)
    .single();
  
  if (!achievement) return false;
  
  // Award achievement
  const { error } = await supabase
    .from('user_achievements')
    .insert({
      user_id: userId,
      achievement_id: achievementId
    });
  
  if (error) {
    if (error.code === '23505') return false; // Already exists
    throw error;
  }
  
  // Award XP for achievement
  await addXP(achievement.xp_reward, `Achievement: ${achievement.name}`);
  
  return true;
};

const checkLevelAchievements = async (userId: string, level: number) => {
  const { data: achievements } = await supabase
    .from('achievements')
    .select('id')
    .eq('requirement_type', 'level_reached')
    .lte('requirement_value', level);
  
  if (achievements) {
    for (const achievement of achievements) {
      await earnAchievement(achievement.id);
    }
  }
};

const checkStreakAchievements = async (userId: string, streak: number) => {
  const { data: achievements } = await supabase
    .from('achievements')
    .select('id')
    .eq('requirement_type', 'streak_days')
    .lte('requirement_value', streak);
  
  if (achievements) {
    for (const achievement of achievements) {
      await earnAchievement(achievement.id);
    }
  }
};

export const checkPrayerAchievements = async (totalPrayers: number) => {
  const userId = await getAuthenticatedUserId();
  
  const { data: achievements } = await supabase
    .from('achievements')
    .select('id')
    .eq('requirement_type', 'prayers_completed')
    .lte('requirement_value', totalPrayers);
  
  if (achievements) {
    for (const achievement of achievements) {
      await earnAchievement(achievement.id);
    }
  }
};

export const checkDhikrAchievements = async (totalDhikr: number) => {
  const userId = await getAuthenticatedUserId();
  
  const { data: achievements } = await supabase
    .from('achievements')
    .select('id')
    .eq('requirement_type', 'dhikr_count')
    .lte('requirement_value', totalDhikr);
  
  if (achievements) {
    for (const achievement of achievements) {
      await earnAchievement(achievement.id);
    }
  }
};

export const checkQuizAchievements = async (totalQuizzesPassed: number) => {
  const userId = await getAuthenticatedUserId();
  
  const { data: achievements } = await supabase
    .from('achievements')
    .select('id')
    .eq('requirement_type', 'quizzes_passed')
    .lte('requirement_value', totalQuizzesPassed);
  
  if (achievements) {
    for (const achievement of achievements) {
      await earnAchievement(achievement.id);
    }
  }
};
