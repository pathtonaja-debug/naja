import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import BottomNav from '@/components/BottomNav';
import { TopBar } from '@/components/ui/top-bar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Brain, Trophy, BookOpen, ChevronRight, Lock, Star, 
  Check, Sparkles, X, Award, AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useGuestProfile } from '@/hooks/useGuestProfile';
import { toast } from 'sonner';
import { BARAKAH_REWARDS } from '@/data/practiceItems';
import { LESSON_CONTENT, type LessonContent } from '@/data/lessonContent';
import { LESSON_CONTENT_FR } from '@/data/lessonContentFr';
import { useLessonProgress, type Module, type Lesson } from '@/hooks/useLessonProgress';
import { LessonQuizModal } from '@/components/learn/LessonQuizModal';
import { formatLessonContent } from '@/lib/formatLessonContent';

const Learn = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { addBarakahPoints } = useGuestProfile();
  const { 
    modules, 
    passLessonQuiz,
    getLessonQuiz,
    passModuleQuiz,
    getModuleProgress,
    isModuleComplete,
    canTakeQuiz,
    getModuleQuiz
  } = useLessonProgress();
  
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [showUnlockAnimation, setShowUnlockAnimation] = useState<string | null>(null);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [quizModuleId, setQuizModuleId] = useState<string | null>(null);
  const [lessonQuizMode, setLessonQuizMode] = useState<{ moduleId: string; lessonId: string } | null>(null);

  const handleLessonQuizComplete = (passed: boolean) => {
    if (passed && lessonQuizMode && selectedModule) {
      passLessonQuiz(lessonQuizMode.moduleId, lessonQuizMode.lessonId);
      addBarakahPoints(BARAKAH_REWARDS.LESSON_COMPLETED);
      toast.success(t('toast.pointsEarned', { points: BARAKAH_REWARDS.LESSON_COMPLETED }));
    }
    setLessonQuizMode(null);
    setSelectedLesson(null);
  };

  const handleStartLessonQuiz = (moduleId: string, lessonId: string) => {
    setLessonQuizMode({ moduleId, lessonId });
  };

  const handleStartQuiz = (moduleId: string) => {
    setQuizModuleId(moduleId);
    setShowQuizModal(true);
    setSelectedModule(null);
  };

  const handleQuizComplete = (passed: boolean) => {
    if (passed && quizModuleId) {
      const unlockedNext = passModuleQuiz(quizModuleId);
      addBarakahPoints(BARAKAH_REWARDS.LESSON_COMPLETED * 3); // Bonus for passing quiz
      
      if (unlockedNext) {
        const nextModuleIndex = modules.findIndex(m => m.id === quizModuleId) + 1;
        if (nextModuleIndex < modules.length) {
          setShowUnlockAnimation(modules[nextModuleIndex].id);
          toast.success(t('learn.newModuleUnlocked') + ': ' + modules[nextModuleIndex].title);
          setTimeout(() => setShowUnlockAnimation(null), 2000);
        }
      }
    }
    setShowQuizModal(false);
    setQuizModuleId(null);
  };

  const totalBadges = modules.filter(m => m.quizPassed).length;

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="min-h-screen bg-background pb-28"
    >
      <TopBar title={t('learn.title')} />
      
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
                <h3 className="font-semibold">{t('learn.dailyQuiz')}</h3>
                <p className="text-xs text-muted-foreground">{t('learn.testKnowledge')}</p>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/quiz')}
                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium"
              >
                {t('common.start')}
              </motion.button>
            </div>
          </Card>
        </motion.div>

        {/* Learning Path Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">{t('learn.learningPath')}</h3>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Trophy className="w-4 h-4 text-warn" />
            <span>{totalBadges} {t('learn.badges')}</span>
          </div>
        </div>

        {/* Modules Grid - Duolingo Style */}
        <div className="space-y-3">
          {modules.map((module, index) => {
            const progress = getModuleProgress(module);
            const isComplete = isModuleComplete(module);
            const needsQuiz = canTakeQuiz(module);
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
                    module.quizPassed && "ring-2 ring-success/50",
                    needsQuiz && "ring-2 ring-warn/50",
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
                        module.quizPassed ? <Award className="w-7 h-7 text-warn" /> : module.icon
                      ) : (
                        <Lock className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{module.title}</h4>
                        {module.quizPassed && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring" }}
                          >
                            <Star className="w-4 h-4 text-warn fill-warn" />
                          </motion.div>
                        )}
                        {needsQuiz && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-warn/20 text-warn text-xs"
                          >
                            <AlertCircle className="w-3 h-3" />
                            {t('learn.moduleQuiz')}
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
              <h4 className="font-medium text-sm">{t('learn.achievements')}</h4>
              <p className="text-xs text-muted-foreground">{totalBadges} {t('learn.badgesEarned')}</p>
            </div>
            <button 
              onClick={() => navigate('/achievements')} 
              className="text-xs text-primary font-medium"
            >
              {t('learn.viewAll')}
            </button>
          </div>
        </Card>

        {/* Niyyah Disclaimer */}
        <p className="text-xs text-muted-foreground text-center italic px-4">
          {t('dashboard.niyyahDisclaimer')}
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

              {/* Show quiz button if all lessons complete but quiz not passed */}
              {canTakeQuiz(selectedModule) && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-4 rounded-xl bg-warn/10 border border-warn/30"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <AlertCircle className="w-5 h-5 text-warn" />
                    <span className="font-medium">{t('learn.moduleQuiz')}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {t('learn.passToUnlock')}
                  </p>
                  <Button 
                    onClick={() => handleStartQuiz(selectedModule.id)}
                    className="w-full"
                  >
                    {t('common.start')} {t('learn.moduleQuiz')}
                  </Button>
                </motion.div>
              )}

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

              {(() => {
                const lang = i18n.language;
                const content: LessonContent | undefined = lang === 'fr' 
                  ? LESSON_CONTENT_FR[selectedLesson.id] 
                  : LESSON_CONTENT[selectedLesson.id];
                
                if (content) {
                  const totalSections = content.sections.length;
                  return (
                    <>
                      {/* Progress indicator */}
                      <div className="flex items-center gap-1.5 mb-4">
                        {content.sections.map((_, idx) => (
                          <div 
                            key={idx}
                            className="flex-1 h-1 rounded-full bg-primary/30"
                          />
                        ))}
                      </div>
                      
                      <div className="p-4 rounded-xl bg-muted/50 mb-6 max-h-64 overflow-y-auto scroll-smooth">
                        <div className="space-y-6">
                          {content.sections.map((section, idx) => (
                            <motion.div 
                              key={idx}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.15, duration: 0.3 }}
                              className="pb-4 border-b border-border/50 last:border-0 last:pb-0"
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                                  {idx + 1}
                                </div>
                                <h4 className="font-semibold text-sm">{section.heading}</h4>
                              </div>
                              <div className="text-sm text-muted-foreground leading-relaxed pl-8">
                                {formatLessonContent(section.content)}
                              </div>
                              {section.keyPoints && (
                                <motion.ul 
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: idx * 0.15 + 0.2 }}
                                  className="mt-3 space-y-1.5 pl-8"
                                >
                                  {section.keyPoints.map((point, i) => (
                                    <motion.li 
                                      key={i} 
                                      initial={{ opacity: 0, x: -5 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: idx * 0.15 + 0.25 + i * 0.05 }}
                                      className="text-xs text-muted-foreground flex items-start gap-2"
                                    >
                                      <Check className="w-3 h-3 text-success mt-0.5 shrink-0" />
                                      <span>{point}</span>
                                    </motion.li>
                                  ))}
                                </motion.ul>
                              )}
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </>
                  );
                }
                return (
                  <div className="p-4 rounded-xl bg-muted/50 mb-6">
                    <p className="text-sm text-foreground leading-relaxed">
                      {t('learn.contentLoading')}
                    </p>
                  </div>
                );
              })()}

              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setSelectedLesson(null)}
                >
                  {t('common.close')}
                </Button>
                <Button 
                  className="flex-1"
                  onClick={() => handleStartLessonQuiz(selectedModule.id, selectedLesson.id)}
                  disabled={selectedLesson.completed}
                >
                  {selectedLesson.completed ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      {t('common.done')}
                    </>
                  ) : (
                    <>
                      <Brain className="w-4 h-4 mr-2" />
                      {t('learn.takeQuiz')}
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lesson Quiz Modal */}
      {lessonQuizMode && (
        <LessonQuizModal
          moduleId={lessonQuizMode.moduleId}
          questions={getLessonQuiz(lessonQuizMode.lessonId, i18n.language)}
          onComplete={handleLessonQuizComplete}
          onClose={() => setLessonQuizMode(null)}
        />
      )}

      {/* Module Quiz Modal */}
      {showQuizModal && quizModuleId && (
        <LessonQuizModal
          moduleId={quizModuleId}
          questions={getModuleQuiz(quizModuleId) || []}
          onComplete={handleQuizComplete}
          onClose={() => {
            setShowQuizModal(false);
            setQuizModuleId(null);
          }}
        />
      )}

      <BottomNav />
    </motion.div>
  );
};

export default Learn;
