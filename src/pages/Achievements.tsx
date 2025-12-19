import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AchievementCard } from "@/components/gamification";
import { useGamification } from "@/hooks/useGamification";
import { Skeleton } from "@/components/ui/skeleton";

const Achievements = () => {
  const navigate = useNavigate();
  const { achievements, earnedAchievementIds, userAchievements, loading } = useGamification();

  const categories = ['prayer', 'streak', 'quiz', 'dhikr', 'level'];

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-24">
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border px-4 py-2.5">
          <div className="flex items-center gap-2">
            <Button size="icon" variant="ghost" onClick={() => navigate(-1)} className="rounded-full h-8 w-8">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-lg font-semibold text-foreground">Achievements</h1>
          </div>
        </header>
        <main className="px-4 pt-4 space-y-4">
          {[1,2,3].map(i => <Skeleton key={i} className="h-24 rounded-2xl" />)}
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border px-4 py-2.5">
        <div className="flex items-center gap-2">
          <Button size="icon" variant="ghost" onClick={() => navigate(-1)} className="rounded-full h-8 w-8">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-lg font-semibold text-foreground">Achievements</h1>
          <span className="ml-auto text-xs text-muted-foreground">{earnedAchievementIds.size}/{achievements.length}</span>
        </div>
      </header>

      <main className="px-4 pt-4 space-y-6">
        {categories.map(category => {
          const categoryAchievements = achievements.filter(a => a.category === category);
          if (categoryAchievements.length === 0) return null;
          
          return (
            <div key={category}>
              <h2 className="text-sm font-medium text-foreground capitalize mb-3">{category}</h2>
              <div className="space-y-3">
                {categoryAchievements.map(achievement => {
                  const earned = earnedAchievementIds.has(achievement.id);
                  const userAch = userAchievements.find(ua => ua.achievement_id === achievement.id);
                  return (
                    <AchievementCard
                      key={achievement.id}
                      name={achievement.name}
                      description={achievement.description}
                      icon={achievement.icon}
                      xpReward={achievement.xp_reward}
                      earned={earned}
                      earnedAt={userAch?.earned_at}
                    />
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
