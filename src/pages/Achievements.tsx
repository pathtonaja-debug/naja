import { Button } from "@/components/ui/button";
import { ArrowLeft, Trophy, Star, Lock } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useGuestProfile } from "@/hooks/useGuestProfile";
import { useTranslation } from "react-i18next";

const Achievements = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { profile } = useGuestProfile();

  // Local achievements definition with i18n keys
  const LOCAL_ACHIEVEMENTS = [
    { id: '1', nameKey: 'achievements.firstSteps', descKey: 'achievements.firstStepsDesc', icon: 'star', category: 'general', points: 50, requirement: 1 },
    { id: '2', nameKey: 'achievements.weekWarrior', descKey: 'achievements.weekWarriorDesc', icon: 'flame', category: 'streak', points: 100, requirement: 7 },
    { id: '3', nameKey: 'achievements.dedicated', descKey: 'achievements.dedicatedDesc', icon: 'trophy', category: 'streak', points: 300, requirement: 30 },
    { id: '4', nameKey: 'achievements.level5', descKey: 'achievements.level5Desc', icon: 'award', category: 'level', points: 150, requirement: 5 },
    { id: '5', nameKey: 'achievements.level10', descKey: 'achievements.level10Desc', icon: 'crown', category: 'level', points: 500, requirement: 10 },
    { id: '6', nameKey: 'achievements.quizMaster', descKey: 'achievements.quizMasterDesc', icon: 'brain', category: 'quiz', points: 200, requirement: 10 },
  ];

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

  const categories = [
    { key: 'general', labelKey: 'achievements.general' },
    { key: 'streak', labelKey: 'achievements.streak' },
    { key: 'level', labelKey: 'achievements.level' },
    { key: 'quiz', labelKey: 'achievements.quiz' },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border px-4 py-2.5">
        <div className="flex items-center gap-2">
          <Button size="icon" variant="ghost" onClick={() => navigate(-1)} className="rounded-full h-8 w-8">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-lg font-semibold text-foreground">{t('achievements.title')}</h1>
          <span className="ml-auto text-xs text-muted-foreground">{earnedIds.size}/{LOCAL_ACHIEVEMENTS.length}</span>
        </div>
      </header>

      <main className="px-4 pt-4 space-y-6">
        {categories.map(({ key: category, labelKey }) => {
          const categoryAchievements = LOCAL_ACHIEVEMENTS.filter(a => a.category === category);
          if (categoryAchievements.length === 0) return null;
          
          return (
            <div key={category}>
              <h2 className="text-sm font-medium text-foreground mb-3">{t(labelKey)}</h2>
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
                          <h3 className="font-medium text-foreground">{t(achievement.nameKey)}</h3>
                          <p className="text-xs text-muted-foreground">{t(achievement.descKey)}</p>
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
