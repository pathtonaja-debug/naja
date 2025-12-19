import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import BottomNav from '@/components/BottomNav';
import { TopBar } from '@/components/ui/top-bar';
import { Card } from '@/components/ui/card';
import { Brain, Trophy, BookOpen, ChevronRight, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

const Learn = () => {
  const navigate = useNavigate();

  const modules = [
    { id: 'basics', title: 'Islamic Basics', lessons: 5, completed: 0, unlocked: true },
    { id: 'pillars', title: 'Pillars of Islam', lessons: 5, completed: 0, unlocked: true },
    { id: 'seerah', title: 'Life of the Prophet ﷺ', lessons: 8, completed: 0, unlocked: false },
    { id: 'finance', title: 'Halal Finance', lessons: 6, completed: 0, unlocked: false },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background pb-28">
      <TopBar title="Learn" />
      
      <div className="px-4 space-y-4">
        {/* Daily Quiz */}
        <Card className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <Brain className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">Daily Quiz</h3>
              <p className="text-xs text-muted-foreground">Test your knowledge today</p>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/quiz')}
              className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium"
            >
              Start
            </motion.button>
          </div>
        </Card>

        {/* Learning Modules */}
        <div>
          <h3 className="text-sm font-semibold mb-3">Learning Path</h3>
          <div className="space-y-3">
            {modules.map((module, index) => (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className={cn("p-4", !module.unlocked && "opacity-60")}>
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center",
                      module.unlocked ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                    )}>
                      {module.unlocked ? <BookOpen className="w-5 h-5" /> : <Lock className="w-4 h-4" />}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{module.title}</h4>
                      <p className="text-xs text-muted-foreground">{module.completed}/{module.lessons} lessons</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                  {module.unlocked && (
                    <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${(module.completed / module.lessons) * 100}%` }}
                      />
                    </div>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Achievements Preview */}
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <div className="flex-1">
              <h4 className="font-medium text-sm">Achievements</h4>
              <p className="text-xs text-muted-foreground">0 badges earned</p>
            </div>
            <button onClick={() => navigate('/achievements')} className="text-xs text-primary font-medium">View All</button>
          </div>
        </Card>
      </div>

      <BottomNav />
    </motion.div>
  );
};

export default Learn;
