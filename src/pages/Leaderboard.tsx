import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Crown, ChevronLeft, Users, Eye, EyeOff } from 'lucide-react';
import { TopBar } from '@/components/ui/top-bar';
import BottomNav from '@/components/BottomNav';
import { useGuestProfile, SPIRITUAL_LEVELS } from '@/hooks/useGuestProfile';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { getAuthenticatedUserId } from '@/lib/auth';
import { CommunityDuas } from '@/components/social/CommunityDuas';

interface LeaderboardEntry {
  id: string;
  displayName: string;
  points: number;
  level: number;
  isCurrentUser: boolean;
}

const Leaderboard = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { profile } = useGuestProfile();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [timeframe, setTimeframe] = useState<'week' | 'all'>('week');
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'community'>('leaderboard');

  useEffect(() => {
    loadLeaderboard();
  }, [profile]);

  const loadLeaderboard = async () => {
    try {
      const userId = await getAuthenticatedUserId();

      // Check if user is visible
      const { data: myProfile } = await supabase
        .from('profiles')
        .select('leaderboard_visible')
        .eq('id', userId)
        .maybeSingle();
      
      setIsVisible(myProfile?.leaderboard_visible ?? false);

      // Fetch leaderboard from user_gamification + profiles
      const { data: gamificationData } = await supabase
        .from('user_gamification')
        .select('user_id, xp, level')
        .order('xp', { ascending: false })
        .limit(50);

      if (!gamificationData || gamificationData.length === 0) {
        // Only show current user
        setLeaderboard([{
          id: profile.id,
          displayName: profile.displayName,
          points: profile.barakahPoints,
          level: profile.level,
          isCurrentUser: true,
        }]);
        return;
      }

      // Get display names for visible users
      const userIds = gamificationData.map(g => g.user_id);
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, display_name, leaderboard_visible')
        .in('id', userIds);

      const profileMap = new Map((profiles || []).map(p => [p.id, p]));

      const entries: LeaderboardEntry[] = gamificationData
        .filter(g => {
          const p = profileMap.get(g.user_id);
          return p?.leaderboard_visible || g.user_id === userId;
        })
        .map(g => {
          const p = profileMap.get(g.user_id);
          return {
            id: g.user_id,
            displayName: p?.display_name || 'Anonymous',
            points: g.xp,
            level: g.level,
            isCurrentUser: g.user_id === userId,
          };
        });

      // Ensure current user is in the list
      if (!entries.some(e => e.isCurrentUser)) {
        entries.push({
          id: profile.id,
          displayName: profile.displayName,
          points: profile.barakahPoints,
          level: profile.level,
          isCurrentUser: true,
        });
      }

      setLeaderboard(entries);
    } catch {
      // Fallback: just show current user
      setLeaderboard([{
        id: profile.id,
        displayName: profile.displayName,
        points: profile.barakahPoints,
        level: profile.level,
        isCurrentUser: true,
      }]);
    }
  };

  const toggleVisibility = async () => {
    try {
      const userId = await getAuthenticatedUserId();
      const newVisible = !isVisible;
      await supabase
        .from('profiles')
        .update({ leaderboard_visible: newVisible })
        .eq('id', userId);
      setIsVisible(newVisible);
      loadLeaderboard();
    } catch {
      // ignore
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-warn" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-muted-foreground" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-warn" />;
    return <span className="text-sm font-bold text-muted-foreground">{rank}</span>;
  };

  const getRankBg = (rank: number, isCurrentUser: boolean) => {
    if (isCurrentUser) return 'bg-secondary/20 border-secondary';
    if (rank === 1) return 'bg-warn/10 border-warn/30';
    if (rank === 2) return 'bg-muted/50 border-border';
    if (rank === 3) return 'bg-warn/5 border-warn/20';
    return 'bg-card border-border';
  };

  const userRank = leaderboard.findIndex(e => e.isCurrentUser) + 1;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background pb-24"
    >
      <TopBar 
        title={t('leaderboard.community')} 
        leftElement={
          <button onClick={() => navigate(-1)} className="p-2 -ml-2">
            <ChevronLeft className="w-5 h-5" />
          </button>
        }
      />

      {/* Tab Toggle */}
      <div className="px-4 pb-4">
        <div className="flex gap-2 p-1 rounded-xl bg-card border border-border">
          {(['leaderboard', 'community'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all",
                activeTab === tab
                  ? "bg-secondary text-secondary-foreground shadow-sm"
                  : "text-muted-foreground"
              )}
            >
              {tab === 'leaderboard' ? t('leaderboard.rankings') : t('community.duaWall')}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'leaderboard' && (
        <>
          {/* Header Stats */}
          <div className="px-4 pb-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl bg-card border border-border shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t('leaderboard.yourRank')}</p>
                  <p className="text-3xl font-bold text-foreground">#{userRank}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">{t('leaderboard.thisWeek')}</p>
                  <p className="text-xl font-bold text-foreground">{profile.barakahPoints} {t('leaderboard.pts')}</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Visibility Toggle */}
          <div className="px-4 pb-4">
            <button
              onClick={toggleVisibility}
              className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              {isVisible ? t('leaderboard.visibleOn') : t('leaderboard.visibleOff')}
            </button>
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
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    {getRankIcon(rank)}
                  </div>
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold",
                    entry.isCurrentUser ? "bg-secondary text-secondary-foreground" : "bg-primary/20 text-foreground"
                  )}>
                    {entry.displayName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className={cn(
                      "font-semibold text-sm",
                      entry.isCurrentUser ? "text-foreground" : "text-foreground/80"
                    )}>
                      {entry.displayName}
                      {entry.isCurrentUser && <span className="text-xs text-muted-foreground ml-1">({t('leaderboard.you')})</span>}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {SPIRITUAL_LEVELS[entry.level - 1] || 'The Seeker'} · {t('dashboard.level')} {entry.level}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-foreground">{entry.points}</p>
                    <p className="text-[10px] text-muted-foreground">{t('common.points')}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {leaderboard.length <= 1 && (
            <div className="px-4 py-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 rounded-2xl bg-gradient-to-br from-secondary/10 to-primary/5 border border-secondary/20 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{t('leaderboard.soloJourney')}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {t('leaderboard.soloJourneyDescription')}
                </p>
              </motion.div>
            </div>
          )}
        </>
      )}

      {activeTab === 'community' && (
        <div className="px-4">
          <CommunityDuas />
        </div>
      )}

      {/* Disclaimer */}
      <div className="px-4 py-6">
        <p className="text-[10px] text-muted-foreground text-center italic">
          {t('leaderboard.disclaimer')}
        </p>
      </div>

      <BottomNav />
    </motion.div>
  );
};

export default Leaderboard;
