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
  lastActivityDate: string | null;
  createdAt: string;
}

const DEFAULT_PROFILE: Omit<GuestProfile, 'id' | 'createdAt'> = {
  displayName: 'Guest',
  level: 1,
  barakahPoints: 0,
  hasanatStreak: 0,
  lastActivityDate: null,
};

// Spiritual level titles
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

export const useGuestProfile = () => {
  const [profile, setProfile] = useState<GuestProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(() => {
    const id = getDeviceId();
    const stored = localStorage.getItem('naja_guest_profile');
    
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Recalculate level based on points
        parsed.level = getLevelFromPoints(parsed.barakahPoints || 0);
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
    
    return { leveledUp, newLevel };
  }, [profile?.level]);

  const updateStreak = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    
    setProfile(current => {
      if (!current) return current;
      
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      let newStreak = current.hasanatStreak;
      
      if (current.lastActivityDate === today) {
        // Already active today
        return current;
      } else if (current.lastActivityDate === yesterdayStr) {
        // Continue streak
        newStreak += 1;
      } else {
        // Streak broken, restart
        newStreak = 1;
      }
      
      const updated: GuestProfile = {
        ...current,
        hasanatStreak: newStreak,
        lastActivityDate: today,
      };
      
      localStorage.setItem('naja_guest_profile', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const resetProfile = useCallback(() => {
    const id = getDeviceId();
    const newProfile: GuestProfile = {
      ...DEFAULT_PROFILE,
      id,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem('naja_guest_profile', JSON.stringify(newProfile));
    setProfile(newProfile);
  }, []);

  return {
    profile,
    loading,
    updateProfile,
    addBarakahPoints,
    updateStreak,
    resetProfile,
    refetch: loadProfile,
    getLevelTitle: () => getLevelTitle(profile?.level || 1),
    getProgress: () => getProgressInLevel(profile?.barakahPoints || 0),
  };
};
