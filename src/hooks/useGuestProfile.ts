import { useState, useEffect, useCallback } from 'react';

// Generate a stable UUID for this device
const getDeviceId = (): string => {
  const stored = localStorage.getItem('naja_device_id');
  if (stored) return stored;
  
  const newId = crypto.randomUUID();
  localStorage.setItem('naja_device_id', newId);
  return newId;
};

export interface GuestProfile {
  id: string;
  displayName: string;
  level: number;
  barakahPoints: number;
  hasanatStreak: number;
  // Tracks the last date the streak counter was updated (separate from activity)
  lastStreakDate: string | null;
  lastActivityDate: string | null;
  createdAt: string;
}

const DEFAULT_PROFILE: Omit<GuestProfile, 'id' | 'createdAt'> = {
  displayName: 'Traveler',
  level: 1,
  barakahPoints: 0,
  hasanatStreak: 0,
  lastStreakDate: null,
  lastActivityDate: null,
};

// Spiritual level titles - exported as array and object
export const SPIRITUAL_LEVELS = [
  "The Seeker",
  "The Steady Heart",
  "The Growing Light",
  "The Tranquil Soul",
  "The Radiant Spirit",
  "The Grounded Believer",
  "The Beacon of Good",
  "The Striving Soul",
  "The Flourishing Faith",
  "The Soul in Balance",
];

export const LEVEL_TITLES: Record<number, string> = {
  1: "The Seeker",
  2: "The Steady Heart",
  3: "The Growing Light",
  4: "The Tranquil Soul",
  5: "The Radiant Spirit",
  6: "The Grounded Believer",
  7: "The Beacon of Good",
  8: "The Striving Soul",
  9: "The Flourishing Faith",
  10: "The Soul in Balance",
};

export const getLevelTitle = (level: number): string => {
  return LEVEL_TITLES[Math.min(Math.max(level, 1), 10)] || "The Blessed One";
};

// Calculate level from total Barakah Points
export const getLevelFromPoints = (points: number): number => {
  // Each level requires progressively more points
  // Level 1: 0, Level 2: 100, Level 3: 250, Level 4: 450, etc.
  let level = 1;
  let threshold = 0;
  
  while (points >= threshold && level <= 10) {
    level++;
    threshold += level * 50;
  }
  
  return Math.min(level - 1, 10);
};

export const getPointsForNextLevel = (currentLevel: number): number => {
  let threshold = 0;
  for (let i = 1; i <= currentLevel; i++) {
    threshold += (i + 1) * 50;
  }
  return threshold;
};

export const getProgressInLevel = (points: number): { current: number; required: number; percentage: number } => {
  const level = getLevelFromPoints(points);
  
  let previousThreshold = 0;
  for (let i = 1; i < level; i++) {
    previousThreshold += (i + 1) * 50;
  }
  
  const nextThreshold = getPointsForNextLevel(level);
  const current = points - previousThreshold;
  const required = nextThreshold - previousThreshold;

  return {
    current,
    required,
    percentage: required > 0 ? Math.min((current / required) * 100, 100) : 100
  };
};

// Daily stats storage
const getDailyStatsKey = (): string => {
  const today = new Date().toISOString().split('T')[0];
  return `naja_daily_stats_${today}`;
};

interface DailyStats {
  points: number;
  actsCompleted: number;
}

const getDefaultDailyStats = (): DailyStats => ({
  points: 0,
  actsCompleted: 0,
});

export const useGuestProfile = () => {
  const [profile, setProfile] = useState<GuestProfile | null>(null);
  const [dailyStats, setDailyStats] = useState<DailyStats>(getDefaultDailyStats());
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(() => {
    const id = getDeviceId();
    const stored = localStorage.getItem('naja_guest_profile');
    
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Recalculate level based on points
        parsed.level = getLevelFromPoints(parsed.barakahPoints || 0);
        
        // Ensure new fields exist
        parsed.lastStreakDate = parsed.lastStreakDate ?? parsed.lastActivityDate ?? null;

        // Check if streak should be reset (no activity yesterday)
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        if (
          parsed.lastStreakDate &&
          parsed.lastStreakDate !== today &&
          parsed.lastStreakDate !== yesterdayStr
        ) {
          // Streak is broken - reset to 0
          parsed.hasanatStreak = 0;
          localStorage.setItem('naja_guest_profile', JSON.stringify(parsed));
        }
        
        setProfile(parsed);
      } catch {
        // Reset to default if corrupted
        const newProfile: GuestProfile = {
          ...DEFAULT_PROFILE,
          id,
          createdAt: new Date().toISOString(),
        };
        localStorage.setItem('naja_guest_profile', JSON.stringify(newProfile));
        setProfile(newProfile);
      }
    } else {
      const newProfile: GuestProfile = {
        ...DEFAULT_PROFILE,
        id,
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem('naja_guest_profile', JSON.stringify(newProfile));
      setProfile(newProfile);
    }
    
    // Load daily stats
    const dailyStored = localStorage.getItem(getDailyStatsKey());
    if (dailyStored) {
      try {
        setDailyStats(JSON.parse(dailyStored));
      } catch {
        setDailyStats(getDefaultDailyStats());
      }
    } else {
      // Reset daily stats for a new day
      setDailyStats(getDefaultDailyStats());
    }
    
    setLoading(false);
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const updateProfile = useCallback((updates: Partial<GuestProfile>) => {
    setProfile(current => {
      if (!current) return current;
      
      const updated = { ...current, ...updates };
      // Recalculate level if points changed
      if (updates.barakahPoints !== undefined) {
        updated.level = getLevelFromPoints(updated.barakahPoints);
      }
      
      localStorage.setItem('naja_guest_profile', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const addBarakahPoints = useCallback((amount: number): { leveledUp: boolean; newLevel: number } => {
    let leveledUp = false;
    let newLevel = profile?.level || 1;
    
    setProfile(current => {
      if (!current) return current;
      
      const oldLevel = current.level;
      const newPoints = (current.barakahPoints || 0) + amount;
      newLevel = getLevelFromPoints(newPoints);
      leveledUp = newLevel > oldLevel;
      
      const updated: GuestProfile = {
        ...current,
        barakahPoints: newPoints,
        level: newLevel,
        lastActivityDate: new Date().toISOString().split('T')[0],
      };
      
      localStorage.setItem('naja_guest_profile', JSON.stringify(updated));
      return updated;
    });
    
    // Update daily stats
    setDailyStats(current => {
      const updated = { ...current, points: current.points + amount };
      localStorage.setItem(getDailyStatsKey(), JSON.stringify(updated));
      return updated;
    });
    
    return { leveledUp, newLevel };
  }, [profile?.level]);

  const incrementActsCompleted = useCallback(() => {
    setDailyStats(current => {
      const updated = { ...current, actsCompleted: current.actsCompleted + 1 };
      localStorage.setItem(getDailyStatsKey(), JSON.stringify(updated));
      return updated;
    });
  }, []);

  const updateStreak = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];

    setProfile(current => {
      if (!current) return current;

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      let newStreak = current.hasanatStreak;

      // Use lastStreakDate to avoid "points updated activity" blocking the streak increment
      if (current.lastStreakDate === today) {
        // Already counted today
        return current;
      } else if (current.lastStreakDate === yesterdayStr) {
        // Continue streak
        newStreak += 1;
      } else {
        // Streak broken, restart
        newStreak = 1;
      }

      const updated: GuestProfile = {
        ...current,
        hasanatStreak: newStreak,
        lastStreakDate: today,
        lastActivityDate: today,
      };

      localStorage.setItem('naja_guest_profile', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const updateDisplayName = useCallback((name: string) => {
    updateProfile({ displayName: name });
  }, [updateProfile]);

  const resetData = useCallback(() => {
    const id = getDeviceId();
    const newProfile: GuestProfile = {
      ...DEFAULT_PROFILE,
      id,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem('naja_guest_profile', JSON.stringify(newProfile));
    setProfile(newProfile);
    
    // Clear daily stats
    setDailyStats(getDefaultDailyStats());
    localStorage.removeItem(getDailyStatsKey());
  }, []);

  // Provide a safe profile with defaults
  const safeProfile: GuestProfile = profile || {
    id: '',
    displayName: 'Traveler',
    level: 1,
    barakahPoints: 0,
    hasanatStreak: 0,
    lastStreakDate: null,
    lastActivityDate: null,
    createdAt: new Date().toISOString(),
  };

  return {
    profile: safeProfile,
    loading,
    updateProfile,
    addBarakahPoints,
    updateStreak,
    resetProfile: resetData,
    refetch: loadProfile,
    getLevelTitle: () => getLevelTitle(safeProfile.level),
    getProgress: () => getProgressInLevel(safeProfile.barakahPoints),
    // Additional helpers for new UI
    todayPoints: dailyStats.points,
    actsCompleted: dailyStats.actsCompleted,
    updatePoints: addBarakahPoints,
    incrementActsCompleted,
    updateDisplayName,
    resetData,
  };
};
