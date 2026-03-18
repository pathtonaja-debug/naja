/**
 * Weekly Challenges Widget
 * Shows current week's challenges with progress
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Target, Check, BookOpen, Moon, Heart, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getAllDailyProgress } from '@/services/dailyProgressService';

interface ChallengeData {
  id: string;
  type: string;
  titleKey: string;
  descKey: string;
  target: number;
  progress: number;
  iconType: 'moon' | 'book' | 'heart' | 'star';
  reward: number;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  moon: <Moon className="w-4 h-4" />,
  book: <BookOpen className="w-4 h-4" />,
  heart: <Heart className="w-4 h-4" />,
  star: <Star className="w-4 h-4" />,
};

const STORAGE_KEY = 'naja_weekly_challenges_v1';

function getWeekStart(): string {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff)).toISOString().split('T')[0];
}

function generateChallenges(weekStart: string): ChallengeData[] {
  const weekNum = Math.floor(new Date(weekStart).getTime() / (7 * 86400000));
  const templates = [
    { type: 'prayer', titleKey: 'challenges.pray5Days', descKey: 'challenges.pray5DaysDesc', target: 5, iconType: 'moon' as const, reward: 75 },
    { type: 'quran', titleKey: 'challenges.readQuran', descKey: 'challenges.readQuranDesc', target: 3, iconType: 'book' as const, reward: 50 },
    { type: 'sadaqah', titleKey: 'challenges.giveSadaqah', descKey: 'challenges.giveSadaqahDesc', target: 2, iconType: 'heart' as const, reward: 40 },
    { type: 'streak', titleKey: 'challenges.keepStreak', descKey: 'challenges.keepStreakDesc', target: 7, iconType: 'star' as const, reward: 100 },
  ];

  const picked = [
    templates[weekNum % 4],
    templates[(weekNum + 1) % 4],
    templates[(weekNum + 2) % 4],
  ];

  return picked.map((t, i) => ({
    id: `${weekStart}-${i}`,
    ...t,
    progress: 0,
  }));
}

function computeProgress(challenges: ChallengeData[]): ChallengeData[] {
  const all = getAllDailyProgress();
  const weekStart = getWeekStart();
  
  return challenges.map(ch => {
    let progress = 0;
    
    for (let i = 0; i < 7; i++) {
      const d = new Date(weekStart);
      d.setDate(d.getDate() + i);
      const key = d.toISOString().split('T')[0];
      const day = all[key];
      if (!day) continue;

      if (ch.type === 'prayer' && day.acts?.some((a: any) => a.category === 'prayer')) progress++;
      if (ch.type === 'quran' && day.acts?.some((a: any) => a.category === 'quran')) progress++;
      if (ch.type === 'sadaqah' && day.acts?.some((a: any) => a.id === 'sadaqah')) progress++;
      if (ch.type === 'streak' && day.completed > 0) progress++;
    }

    return { ...ch, progress: Math.min(progress, ch.target) };
  });
}

export function WeeklyChallenges() {
  const { t } = useTranslation();
  const [challenges, setChallenges] = useState<ChallengeData[]>([]);

  useEffect(() => {
    const weekStart = getWeekStart();
    const stored = localStorage.getItem(STORAGE_KEY);
    let current: ChallengeData[];

    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.weekStart === weekStart) {
        current = parsed.challenges;
      } else {
        current = generateChallenges(weekStart);
      }
    } else {
      current = generateChallenges(weekStart);
    }

    const withProgress = computeProgress(current);
    setChallenges(withProgress);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ weekStart, challenges: withProgress }));
  }, []);

  if (challenges.length === 0) return null;

  const completedCount = challenges.filter(c => c.progress >= c.target).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-2xl bg-card border border-border shadow-sm"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold">{t('dashboard.weeklyChallenges')}</h3>
        </div>
        <span className="text-xs text-muted-foreground">
          {completedCount}/{challenges.length}
        </span>
      </div>

      <div className="space-y-2.5">
        {challenges.map((ch) => {
          const isComplete = ch.progress >= ch.target;
          const pct = Math.round((ch.progress / ch.target) * 100);

          return (
            <div key={ch.id} className="flex items-center gap-3">
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center",
                isComplete ? "bg-success/20 text-success" : "bg-muted text-muted-foreground"
              )}>
                {isComplete ? <Check className="w-4 h-4" /> : ICON_MAP[ch.iconType]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className={cn("text-xs font-medium truncate", isComplete && "line-through text-muted-foreground")}>
                    {t(ch.titleKey)}
                  </p>
                  <span className="text-[10px] text-muted-foreground ml-2">
                    {ch.progress}/{ch.target}
                  </span>
                </div>
                <div className="h-1.5 bg-muted rounded-full mt-1 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    className={cn("h-full rounded-full", isComplete ? "bg-success" : "bg-primary")}
                  />
                </div>
              </div>
              {isComplete && (
                <span className="text-[9px] text-success font-medium">+{ch.reward}</span>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
