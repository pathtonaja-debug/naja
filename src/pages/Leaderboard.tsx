import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Crown, ChevronLeft } from 'lucide-react';
import { TopBar } from '@/components/ui/top-bar';
import BottomNav from '@/components/BottomNav';
import { useGuestProfile, SPIRITUAL_LEVELS } from '@/hooks/useGuestProfile';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface LeaderboardEntry {
  id: string;
  displayName: string;
  points: number;
  level: number;
  isCurrentUser: boolean;
}

const Leaderboard = () => {
  const navigate = useNavigate();
  const { profile } = useGuestProfile();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [timeframe, setTimeframe] = useState<'week' | 'all'>('week');

  useEffect(() => {
    // Generate mock leaderboard data
    // In a real app, this would fetch from Supabase
    const mockData: LeaderboardEntry[] = [
      { id: '1', displayName: 'Abdullah', points: 2450, level: 8, isCurrentUser: false },
      { id: '2', displayName: 'Fatima', points: 2100, level: 7, isCurrentUser: false },
      { id: '3', displayName: 'Omar', points: 1890, level: 7, isCurrentUser: false },
      { id: '4', displayName: 'Aisha', points: 1650, level: 6, isCurrentUser: false },
      { id: '5', displayName: 'Yusuf', points: 1420, level: 5, isCurrentUser: false },
      { id: '6', displayName: 'Maryam', points: 1200, level: 5, isCurrentUser: false },
      { id: '7', displayName: 'Ibrahim', points: 980, level: 4, isCurrentUser: false },
      { id: '8', displayName: 'Khadija', points: 750, level: 4, isCurrentUser: false },
    ];

    // Insert current user
    const userEntry: LeaderboardEntry = {
      id: profile.id,
      displayName: profile.displayName,
      points: profile.barakahPoints,
      level: profile.level,
      isCurrentUser: true,
    };

    // Combine and sort
    const combined = [...mockData, userEntry].sort((a, b) => b.points - a.points);
    setLeaderboard(combined);
  }, [profile]);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" />;
    return <span className="text-sm font-bold text-foreground/40">{rank}</span>;
  };

  const getRankBg = (rank: number, isCurrentUser: boolean) => {
    if (isCurrentUser) return 'bg-pastel-lavender/30 border-pastel-lavender';
    if (rank === 1) return 'bg-yellow-50 border-yellow-200';
    if (rank === 2) return 'bg-gray-50 border-gray-200';
    if (rank === 3) return 'bg-amber-50 border-amber-200';
    return 'bg-white border-border/30';
  };

  const userRank = leaderboard.findIndex(e => e.isCurrentUser) + 1;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-pastel-cream pb-24"
    >
      <TopBar 
        title="Community" 
        leftElement={
          <button onClick={() => navigate(-1)} className="p-2 -ml-2">
            <ChevronLeft className="w-5 h-5" />
          </button>
        }
      />

      {/* Header Stats */}
      <div className="px-4 pb-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-white border border-border/30 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground/60">Your Rank</p>
              <p className="text-3xl font-bold text-foreground">#{userRank}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-foreground/60">This Week</p>
              <p className="text-xl font-bold text-foreground">{profile.barakahPoints} pts</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Timeframe Toggle */}
      <div className="px-4 pb-4">
        <div className="flex gap-2 p-1 rounded-xl bg-white border border-border/30">
          {(['week', 'all'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={cn(
                "flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all",
                timeframe === t
                  ? "bg-pastel-lavender text-foreground shadow-sm"
                  : "text-foreground/50"
              )}
            >
              {t === 'week' ? 'This Week' : 'All Time'}
            </button>
          ))}
        </div>
      </div>

      {/* Leaderboard List */}
      <div className="px-4 space-y-2">
        {leaderboard.map((entry, index) => {
          const rank = index + 1;
          return (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                "p-3 rounded-2xl border flex items-center gap-3",
                getRankBg(rank, entry.isCurrentUser)
              )}
            >
              {/* Rank */}
              <div className="w-8 h-8 rounded-full bg-pastel-cream flex items-center justify-center">
                {getRankIcon(rank)}
              </div>

              {/* Avatar */}
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold",
                entry.isCurrentUser ? "bg-pastel-lavender text-foreground" : "bg-pastel-blue/50 text-foreground"
              )}>
                {entry.displayName.charAt(0).toUpperCase()}
              </div>

              {/* Info */}
              <div className="flex-1">
                <p className={cn(
                  "font-semibold text-sm",
                  entry.isCurrentUser ? "text-foreground" : "text-foreground/80"
                )}>
                  {entry.displayName}
                  {entry.isCurrentUser && <span className="text-xs text-foreground/50 ml-1">(You)</span>}
                </p>
                <p className="text-xs text-foreground/50">
                  {SPIRITUAL_LEVELS[entry.level - 1] || 'The Seeker'} · Level {entry.level}
                </p>
              </div>

              {/* Points */}
              <div className="text-right">
                <p className="font-bold text-foreground">{entry.points}</p>
                <p className="text-[10px] text-foreground/40">points</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Disclaimer */}
      <div className="px-4 py-6">
        <p className="text-[10px] text-foreground/40 text-center italic">
          Leaderboard shows anonymous participants. Focus on your own journey — 
          this is just for friendly motivation. Your niyyah is what matters.
        </p>
      </div>

      <BottomNav />
    </motion.div>
  );
};

export default Leaderboard;
