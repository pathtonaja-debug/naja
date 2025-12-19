import { useState, useEffect, useCallback } from 'react';
import { 
  getUserGamification, 
  getAchievements, 
  getUserAchievements,
  getXPProgressInLevel,
  addXP as addXPService,
  updateStreak as updateStreakService
} from '@/services/gamification';

interface GamificationData {
  xp: number;
  level: number;
  streakDays: number;
  xpProgress: {
    current: number;
    required: number;
    percentage: number;
  };
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  xp_reward: number;
  category: string;
  requirement_type: string;
  requirement_value: number;
}

interface UserAchievement {
  id: string;
  achievement_id: string;
  earned_at: string;
  achievement: Achievement;
}

export const useGamification = () => {
  const [data, setData] = useState<GamificationData | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [gamification, allAchievements, earnedAchievements] = await Promise.all([
        getUserGamification(),
        getAchievements(),
        getUserAchievements()
      ]);

      setData({
        xp: gamification.xp,
        level: gamification.level,
        streakDays: gamification.streak_days,
        xpProgress: getXPProgressInLevel(gamification.xp)
      });
      setAchievements(allAchievements || []);
      setUserAchievements(earnedAchievements || []);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch gamification data:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addXP = async (amount: number): Promise<{ leveledUp: boolean; newLevel: number } | null> => {
    try {
      const result = await addXPService(amount);
      await fetchData(); // Refresh data
      return { leveledUp: result.leveledUp, newLevel: result.newLevel };
    } catch (err) {
      console.error('Failed to add XP:', err);
      return null;
    }
  };

  const updateStreak = async (): Promise<number | null> => {
    try {
      const newStreak = await updateStreakService();
      await fetchData(); // Refresh data
      return newStreak;
    } catch (err) {
      console.error('Failed to update streak:', err);
      return null;
    }
  };

  const earnedAchievementIds = new Set(userAchievements.map(ua => ua.achievement_id));

  return {
    data,
    achievements,
    userAchievements,
    earnedAchievementIds,
    loading,
    error,
    refetch: fetchData,
    addXP,
    updateStreak
  };
};
