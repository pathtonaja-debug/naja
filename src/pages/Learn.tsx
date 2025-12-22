import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import BottomNav from '@/components/BottomNav';
import { TopBar } from '@/components/ui/top-bar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Brain, Trophy, BookOpen, ChevronRight, Lock, Star, 
  Check, Sparkles, X, Award
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useGuestProfile } from '@/hooks/useGuestProfile';
import { toast } from 'sonner';
import { BARAKAH_REWARDS } from '@/data/practiceItems';
import { LESSON_CONTENT } from '@/data/lessonContent';

interface Lesson {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

interface Module {
  id: string;
  title: string;
  description: string;
  icon: string;
  lessons: Lesson[];
  unlocked: boolean;
  color: string;
}

const INITIAL_MODULES: Module[] = [
  { 
    id: 'basics', 
    title: 'Islamic Basics', 
    description: 'Foundation of faith',
    icon: '🕌',
    color: 'bg-primary/10 border-primary/20',
    unlocked: true,
    lessons: [
      { id: 'b1', title: 'The Five Pillars', description: 'Core principles of Islam', completed: false },
      { id: 'b2', title: 'Shahada: Declaration of Faith', description: 'The first pillar', completed: false },
      { id: 'b3', title: 'Importance of Niyyah', description: 'Intention in worship', completed: false },
      { id: 'b4', title: 'The Six Articles of Faith', description: 'Iman fundamentals', completed: false },
      { id: 'b5', title: 'Halal & Haram Basics', description: 'Permissible and forbidden', completed: false },
    ]
  },
  { 
    id: 'pillars', 
    title: 'Pillars of Islam', 
    description: 'The five pillars in depth',
    icon: '🏛️',
    color: 'bg-accent/10 border-accent/20',
    unlocked: true,
    lessons: [
      { id: 'p1', title: 'Salah: The Daily Prayers', description: 'How and why we pray', completed: false },
      { id: 'p2', title: 'Zakah: Purifying Wealth', description: 'Charity obligations', completed: false },
      { id: 'p3', title: 'Sawm: Fasting in Ramadan', description: 'The blessed month', completed: false },
      { id: 'p4', title: 'Hajj: The Sacred Pilgrimage', description: 'Journey to Makkah', completed: false },
      { id: 'p5', title: 'Living the Pillars Daily', description: 'Practical application', completed: false },
    ]
  },
  { 
    id: 'seerah', 
    title: 'Life of the Prophet ﷺ', 
    description: 'The prophetic biography',
    icon: '📖',
    color: 'bg-success/10 border-success/20',
    unlocked: false,
    lessons: [
      { id: 's1', title: 'Before the Revelation', description: 'Early life in Makkah', completed: false },
      { id: 's2', title: 'The First Revelation', description: 'Cave of Hira', completed: false },
      { id: 's3', title: 'The Early Muslims', description: 'First companions', completed: false },
      { id: 's4', title: 'The Hijrah', description: 'Migration to Madinah', completed: false },
      { id: 's5', title: 'Building the Ummah', description: 'Community in Madinah', completed: false },
      { id: 's6', title: 'The Conquest of Makkah', description: 'Triumphant return', completed: false },
      { id: 's7', title: 'The Farewell Sermon', description: 'Final guidance', completed: false },
      { id: 's8', title: 'Legacy & Character', description: 'His beautiful example', completed: false },
    ]
  },
  { 
    id: 'finance', 
    title: 'Halal Finance', 
    description: 'Islamic economics',
    icon: '💰',
    color: 'bg-warn/10 border-warn/20',
    unlocked: false,
    lessons: [
      { id: 'f1', title: 'Riba: Understanding Interest', description: 'Why interest is prohibited', completed: false },
      { id: 'f2', title: 'Halal Investments', description: 'Ethical investing', completed: false },
      { id: 'f3', title: 'Islamic Banking', description: 'How it works', completed: false },
      { id: 'f4', title: 'Zakah Calculations', description: 'Calculating your dues', completed: false },
      { id: 'f5', title: 'Business Ethics', description: 'Trading guidelines', completed: false },
      { id: 'f6', title: 'Wealth & Contentment', description: 'Balancing dunya', completed: false },
    ]
  },
];

const Learn = () => {
  const navigate = useNavigate();
  const { addBarakahPoints } = useGuestProfile();
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [showUnlockAnimation, setShowUnlockAnimation] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('naja_learn_progress');
    if (stored) {
      setModules(JSON.parse(stored));
    } else {
      setModules(INITIAL_MODULES);
      localStorage.setItem('naja_learn_progress', JSON.stringify(INITIAL_MODULES));
    }
  }, []);

  const saveProgress = (newModules: Module[]) => {
    setModules(newModules);
    localStorage.setItem('naja_learn_progress', JSON.stringify(newModules));
  };

  const completeLesson = (moduleId: string, lessonId: string) => {
    const updatedModules = modules.map(mod => {
      if (mod.id === moduleId) {
        const updatedLessons = mod.lessons.map(lesson => 
          lesson.id === lessonId ? { ...lesson, completed: true } : lesson
        );
        return { ...mod, lessons: updatedLessons };
      }
      return mod;
    });

    // Check if module is complete to unlock next
    const completedModule = updatedModules.find(m => m.id === moduleId);
    if (completedModule) {
      const allCompleted = completedModule.lessons.every(l => l.completed);
      if (allCompleted) {
        const moduleIndex = updatedModules.findIndex(m => m.id === moduleId);
        if (moduleIndex < updatedModules.length - 1 && !updatedModules[moduleIndex + 1].unlocked) {
          updatedModules[moduleIndex + 1].unlocked = true;
          setShowUnlockAnimation(updatedModules[moduleIndex + 1].id);
          toast.success(`New module unlocked: ${updatedModules[moduleIndex + 1].title}! 🎉`);
          setTimeout(() => setShowUnlockAnimation(null), 2000);
        }
      }
    }

    saveProgress(updatedModules);
    addBarakahPoints(BARAKAH_REWARDS.LESSON_COMPLETED);
    toast.success(`+${BARAKAH_REWARDS.LESSON_COMPLETED} Barakah Points ✨`);
    setSelectedLesson(null);
  };

  const getModuleProgress = (module: Module) => {
    const completed = module.lessons.filter(l => l.completed).length;
    return Math.round((completed / module.lessons.length) * 100);
  };

  const totalBadges = modules.filter(m => 
    m.lessons.every(l => l.completed)
  ).length;

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="min-h-screen bg-background pb-28"
    >
      <TopBar title="Learn" />
      
      <div className="px-4 space-y-4">
        {/* Daily Quiz Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
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
        </motion.div>

        {/* Learning Path Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Learning Path</h3>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Trophy className="w-4 h-4 text-warn" />
            <span>{totalBadges} badges</span>
          </div>
        </div>

        {/* Modules Grid - Duolingo Style */}
        <div className="space-y-3">
          {modules.map((module, index) => {
            const progress = getModuleProgress(module);
            const isComplete = progress === 100;
            const isUnlocking = showUnlockAnimation === module.id;

            return (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  scale: isUnlocking ? [1, 1.05, 1] : 1 
                }}
                transition={{ 
                  delay: index * 0.05,
                  scale: { duration: 0.5, repeat: isUnlocking ? 2 : 0 }
                }}
              >
                <Card 
                  className={cn(
                    "p-4 cursor-pointer transition-all",
                    !module.unlocked && "opacity-50",
                    isComplete && "ring-2 ring-success/50",
                    module.color
                  )}
                  onClick={() => module.unlocked && setSelectedModule(module)}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-14 h-14 rounded-2xl flex items-center justify-center text-2xl",
                      module.unlocked ? "bg-card" : "bg-muted"
                    )}>
                      {module.unlocked ? (
                        isComplete ? <Award className="w-7 h-7 text-warn" /> : module.icon
                      ) : (
                        <Lock className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{module.title}</h4>
                        {isComplete && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring" }}
                          >
                            <Star className="w-4 h-4 text-warn fill-warn" />
                          </motion.div>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{module.description}</p>
                      {module.unlocked && (
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${progress}%` }}
                              className="h-full bg-primary rounded-full"
                            />
                          </div>
                          <span className="text-xs font-medium text-muted-foreground">
                            {module.lessons.filter(l => l.completed).length}/{module.lessons.length}
                          </span>
                        </div>
                      )}
                    </div>
                    {module.unlocked && <ChevronRight className="w-5 h-5 text-muted-foreground" />}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Achievements Preview */}
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Trophy className="w-5 h-5 text-warn" />
            <div className="flex-1">
              <h4 className="font-medium text-sm">Achievements</h4>
              <p className="text-xs text-muted-foreground">{totalBadges} badges earned</p>
            </div>
            <button 
              onClick={() => navigate('/achievements')} 
              className="text-xs text-primary font-medium"
            >
              View All
            </button>
          </div>
        </Card>

        {/* Niyyah Disclaimer */}
        <p className="text-xs text-muted-foreground text-center italic px-4">
          Your niyyah is what matters — points are just a tool to help you stay consistent.
        </p>
      </div>

      {/* Module Detail Sheet */}
      <AnimatePresence>
        {selectedModule && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-end"
            onClick={() => setSelectedModule(null)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="w-full bg-background rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{selectedModule.icon}</span>
                  <div>
                    <h2 className="text-lg font-bold">{selectedModule.title}</h2>
                    <p className="text-sm text-muted-foreground">{selectedModule.description}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedModule(null)}>
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              <div className="space-y-2">
                {selectedModule.lessons.map((lesson, i) => (
                  <motion.button
                    key={lesson.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={cn(
                      "w-full p-4 rounded-xl text-left transition-all flex items-center gap-3",
                      lesson.completed 
                        ? "bg-success/10 border border-success/20" 
                        : "bg-muted hover:bg-muted/80"
                    )}
                    onClick={() => setSelectedLesson(lesson)}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                      lesson.completed 
                        ? "bg-success text-white" 
                        : "bg-primary/20 text-primary"
                    )}>
                      {lesson.completed ? <Check className="w-4 h-4" /> : i + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{lesson.title}</h4>
                      <p className="text-xs text-muted-foreground">{lesson.description}</p>
                    </div>
                    {!lesson.completed && (
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lesson Modal */}
      <AnimatePresence>
        {selectedLesson && selectedModule && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={() => setSelectedLesson(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md bg-background rounded-2xl p-6"
              onClick={e => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-xl font-bold">{selectedLesson.title}</h2>
                <p className="text-sm text-muted-foreground mt-1">{selectedLesson.description}</p>
              </div>

              <div className="p-4 rounded-xl bg-muted/50 mb-6 max-h-64 overflow-y-auto">
                {LESSON_CONTENT[selectedLesson.id] ? (
                  <div className="space-y-4">
                    {LESSON_CONTENT[selectedLesson.id].sections.map((section, idx) => (
                      <div key={idx}>
                        <h4 className="font-semibold text-sm mb-2">{section.heading}</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{section.content}</p>
                        {section.keyPoints && (
                          <ul className="mt-2 space-y-1">
                            {section.keyPoints.map((point, i) => (
                              <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                                <Check className="w-3 h-3 text-success mt-0.5 shrink-0" />
                                {point}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-foreground leading-relaxed">
                    Educational content about {selectedLesson.title.toLowerCase()}.
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setSelectedLesson(null)}
                >
                  Close
                </Button>
                <Button 
                  className="flex-1"
                  onClick={() => completeLesson(selectedModule.id, selectedLesson.id)}
                  disabled={selectedLesson.completed}
                >
                  {selectedLesson.completed ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Completed
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Complete
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav />
    </motion.div>
  );
};

export default Learn;
