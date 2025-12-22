import { Button } from "@/components/ui/button";
import { ArrowLeft, Trophy, Star, Lock } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useGuestProfile, getLevelTitle } from "@/hooks/useGuestProfile";

// Local achievements definition (no Supabase required)
const LOCAL_ACHIEVEMENTS = [
  { id: '1', name: 'First Steps', description: 'Complete your first act', icon: 'star', category: 'general', points: 50, requirement: 1 },
  { id: '2', name: 'Week Warrior', description: '7-day streak', icon: 'flame', category: 'streak', points: 100, requirement: 7 },
  { id: '3', name: 'Dedicated', description: '30-day streak', icon: 'trophy', category: 'streak', points: 300, requirement: 30 },
  { id: '4', name: 'Level 5', description: 'Reach level 5', icon: 'award', category: 'level', points: 150, requirement: 5 },
  { id: '5', name: 'Level 10', description: 'Reach level 10', icon: 'crown', category: 'level', points: 500, requirement: 10 },
  { id: '6', name: 'Quiz Master', description: 'Complete 10 quizzes', icon: 'brain', category: 'quiz', points: 200, requirement: 10 },
];

const Achievements = () => {
  const navigate = useNavigate();
  const { profile, getProgress } = useGuestProfile();
  const progress = getProgress();

  // Determine which achievements are earned based on local profile
  const earnedIds = new Set<string>();
  
  // Check streak achievements
  if (profile.hasanatStreak >= 7) earnedIds.add('2');
  if (profile.hasanatStreak >= 30) earnedIds.add('3');
  
  // Check level achievements
  if (profile.level >= 5) earnedIds.add('4');
  if (profile.level >= 10) earnedIds.add('5');
  
  // First steps - if they have any points
  if (profile.barakahPoints > 0) earnedIds.add('1');

  const categories = ['general', 'streak', 'level', 'quiz'];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border px-4 py-2.5">
        <div className="flex items-center gap-2">
          <Button size="icon" variant="ghost" onClick={() => navigate(-1)} className="rounded-full h-8 w-8">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-lg font-semibold text-foreground">Achievements</h1>
          <span className="ml-auto text-xs text-muted-foreground">{earnedIds.size}/{LOCAL_ACHIEVEMENTS.length}</span>
        </div>
      </header>

      <main className="px-4 pt-4 space-y-6">
        {categories.map(category => {
          const categoryAchievements = LOCAL_ACHIEVEMENTS.filter(a => a.category === category);
          if (categoryAchievements.length === 0) return null;
          
          return (
            <div key={category}>
              <h2 className="text-sm font-medium text-foreground capitalize mb-3">{category}</h2>
              <div className="space-y-3">
                {categoryAchievements.map(achievement => {
                  const earned = earnedIds.has(achievement.id);
                  return (
                    <div
                      key={achievement.id}
                      className={`p-4 rounded-2xl border ${
                        earned 
                          ? 'bg-primary/5 border-primary/20' 
                          : 'bg-card border-border opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          earned ? 'bg-primary/20' : 'bg-muted'
                        }`}>
                          {earned ? (
                            <Trophy className="w-5 h-5 text-primary" />
                          ) : (
                            <Lock className="w-4 h-4 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-foreground">{achievement.name}</h3>
                          <p className="text-xs text-muted-foreground">{achievement.description}</p>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-primary">
                          <Star className="w-3 h-3" />
                          <span>{achievement.points}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </main>
      <BottomNav />
    </motion.div>
  );
};

export default Achievements;
