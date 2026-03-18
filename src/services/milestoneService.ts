/**
 * Milestone & Badge Auto-Award Service
 * Checks point thresholds and activity milestones, awards badges automatically.
 */

import { supabase } from '@/integrations/supabase/client';
import { getAuthenticatedUserId } from '@/lib/auth';

// Milestone thresholds with bonus points
export const MILESTONES = [
  { threshold: 100, bonus: 25, badge: 'first_century', name: 'First Century' },
  { threshold: 500, bonus: 50, badge: 'rising_star', name: 'Rising Star' },
  { threshold: 1000, bonus: 100, badge: 'devoted_soul', name: 'Devoted Soul' },
  { threshold: 2500, bonus: 150, badge: 'steadfast', name: 'The Steadfast' },
  { threshold: 5000, bonus: 250, badge: 'beacon_of_light', name: 'Beacon of Light' },
] as const;

// Activity-based badge definitions
export const ACTIVITY_BADGES = [
  { id: 'first_prayer', requirement_type: 'prayer_count', requirement_value: 1, name: 'First Prayer Logged', description: 'Logged your first prayer', icon: '🕌', xp: 25 },
  { id: 'week_streak', requirement_type: 'streak_days', requirement_value: 7, name: '7-Day Streak', description: 'Maintained a 7-day streak', icon: '🔥', xp: 50 },
  { id: 'month_streak', requirement_type: 'streak_days', requirement_value: 30, name: '30-Day Streak', description: 'Maintained a 30-day streak', icon: '⭐', xp: 100 },
  { id: 'quran_reader', requirement_type: 'quran_pages', requirement_value: 10, name: 'Quran Reader', description: 'Read 10 pages of Quran', icon: '📖', xp: 50 },
  { id: 'quran_khatam', requirement_type: 'quran_khatams', requirement_value: 1, name: 'Khatam al-Quran', description: 'Completed the entire Quran', icon: '🏆', xp: 200 },
  { id: 'dhikr_master', requirement_type: 'dhikr_count', requirement_value: 1000, name: 'Dhikr Master', description: '1000 dhikr beads counted', icon: '📿', xp: 75 },
  { id: 'generous_soul', requirement_type: 'sadaqah_count', requirement_value: 10, name: 'Generous Soul', description: 'Logged 10 acts of sadaqah', icon: '💝', xp: 50 },
] as const;

const MILESTONE_STORAGE_KEY = 'naja_milestones_awarded';

/**
 * Check if a points milestone was just crossed and return bonus info
 */
export function checkMilestone(oldPoints: number, newPoints: number): { bonus: number; milestoneName: string } | null {
  const awarded = getAwardedMilestones();
  
  for (const milestone of MILESTONES) {
    if (oldPoints < milestone.threshold && newPoints >= milestone.threshold && !awarded.includes(milestone.badge)) {
      // Mark as awarded
      awarded.push(milestone.badge);
      try {
        localStorage.setItem(MILESTONE_STORAGE_KEY, JSON.stringify(awarded));
      } catch {}
      
      return { bonus: milestone.bonus, milestoneName: milestone.name };
    }
  }
  return null;
}

function getAwardedMilestones(): string[] {
  try {
    const raw = localStorage.getItem(MILESTONE_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Check and award activity-based badges to the cloud
 */
export async function checkAndAwardBadges(): Promise<string[]> {
  try {
    const userId = await getAuthenticatedUserId();
    
    // Get current stats from various localStorage keys
    const profileRaw = localStorage.getItem('naja_guest_profile');
    const profile = profileRaw ? JSON.parse(profileRaw) : {};
    const quranRaw = localStorage.getItem('naja_quran_progress_v2');
    const quran = quranRaw ? JSON.parse(quranRaw) : {};
    
    const stats: Record<string, number> = {
      streak_days: profile.hasanatStreak || 0,
      quran_pages: quran.totalPages || 0,
      quran_khatams: quran.khatams || 0,
    };

    // Get already-earned achievements from cloud
    const { data: earned } = await supabase
      .from('user_achievements')
      .select('achievement_id')
      .eq('user_id', userId);
    
    const earnedIds = new Set((earned || []).map(e => e.achievement_id));
    
    // Get all achievements from the DB
    const { data: allAchievements } = await supabase
      .from('achievements')
      .select('*');

    if (!allAchievements) return [];
    
    const newlyAwarded: string[] = [];

    for (const achievement of allAchievements) {
      if (earnedIds.has(achievement.id)) continue;
      
      const statValue = stats[achievement.requirement_type] || 0;
      if (statValue >= achievement.requirement_value) {
        // Award this achievement
        await supabase
          .from('user_achievements')
          .insert({ user_id: userId, achievement_id: achievement.id });
        
        newlyAwarded.push(achievement.name);
      }
    }

    return newlyAwarded;
  } catch (e) {
    console.warn('[badges] auto-award check failed:', e);
    return [];
  }
}
