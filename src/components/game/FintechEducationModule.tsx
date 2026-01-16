import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Coins, Scale, Heart, BookOpen, CheckCircle2, XCircle, 
  ArrowRight, Star, Trophy, Sparkles
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Lesson {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  content: string[];
  quiz: QuizQuestion;
  completed: boolean;
  xpReward: number;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface ScenarioOption {
  text: string;
  isCorrect: boolean;
  explanation: string;
}

interface Scenario {
  id: string;
  title: string;
  situation: string;
  options: ScenarioOption[];
}

// Lesson data structure that uses translation keys
const getLessons = (t: (key: string) => string): Lesson[] => [
  {
    id: 'what-is-riba',
    title: t('fintech.lesson.whatIsRiba.title'),
    description: t('fintech.lesson.whatIsRiba.description'),
    icon: <Coins className="w-5 h-5" />,
    content: [
      t('fintech.lessonContent.riba1'),
      t('fintech.lessonContent.riba2'),
      t('fintech.lessonContent.riba3'),
      t('fintech.lessonContent.riba4'),
    ],
    quiz: {
      question: t('fintech.quiz.ribaQuestion'),
      options: [
        t('fintech.quiz.ribaOption1'),
        t('fintech.quiz.ribaOption2'),
        t('fintech.quiz.ribaOption3'),
        t('fintech.quiz.ribaOption4'),
      ],
      correctIndex: 0,
      explanation: t('fintech.quiz.ribaExplanation'),
    },
    completed: false,
    xpReward: 30,
  },
  {
    id: 'halal-vs-haram',
    title: t('fintech.lesson.halalVsHaram.title'),
    description: t('fintech.lesson.halalVsHaram.description'),
    icon: <Scale className="w-5 h-5" />,
    content: [
      t('fintech.lessonContent.halal1'),
      t('fintech.lessonContent.halal2'),
      t('fintech.lessonContent.halal3'),
      t('fintech.lessonContent.halal4'),
    ],
    quiz: {
      question: t('fintech.quiz.halalQuestion'),
      options: [
        t('fintech.quiz.halalOption1'),
        t('fintech.quiz.halalOption2'),
        t('fintech.quiz.halalOption3'),
        t('fintech.quiz.halalOption4'),
      ],
      correctIndex: 2,
      explanation: t('fintech.quiz.halalExplanation'),
    },
    completed: false,
    xpReward: 30,
  },
  {
    id: 'charity-types',
    title: t('fintech.lesson.charityTypes.title'),
    description: t('fintech.lesson.charityTypes.description'),
    icon: <Heart className="w-5 h-5" />,
    content: [
      t('fintech.lessonContent.charity1'),
      t('fintech.lessonContent.charity2'),
      t('fintech.lessonContent.charity3'),
      t('fintech.lessonContent.charity4'),
    ],
    quiz: {
      question: t('fintech.quiz.waqfQuestion'),
      options: [
        t('fintech.quiz.waqfOption1'),
        t('fintech.quiz.waqfOption2'),
        t('fintech.quiz.waqfOption3'),
        t('fintech.quiz.waqfOption4'),
      ],
      correctIndex: 2,
      explanation: t('fintech.quiz.waqfExplanation'),
    },
    completed: false,
    xpReward: 30,
  },
  {
    id: 'ethical-spending',
    title: t('fintech.lesson.ethicalSpending.title'),
    description: t('fintech.lesson.ethicalSpending.description'),
    icon: <BookOpen className="w-5 h-5" />,
    content: [
      t('fintech.lessonContent.spending1'),
      t('fintech.lessonContent.spending2'),
      t('fintech.lessonContent.spending3'),
      t('fintech.lessonContent.spending4'),
    ],
    quiz: {
      question: t('fintech.quiz.israfQuestion'),
      options: [
        t('fintech.quiz.israfOption1'),
        t('fintech.quiz.israfOption2'),
        t('fintech.quiz.israfOption3'),
        t('fintech.quiz.israfOption4'),
      ],
      correctIndex: 1,
      explanation: t('fintech.quiz.israfExplanation'),
    },
    completed: false,
    xpReward: 30,
  },
  {
    id: 'islamic-banking',
    title: t('fintech.lesson.islamicBanking.title'),
    description: t('fintech.lesson.islamicBanking.description'),
    icon: <Scale className="w-5 h-5" />,
    content: [
      t('fintech.lessonContent.banking1'),
      t('fintech.lessonContent.banking2'),
      t('fintech.lessonContent.banking3'),
      t('fintech.lessonContent.banking4'),
    ],
    quiz: {
      question: t('fintech.quiz.bankingQuestion'),
      options: [
        t('fintech.quiz.bankingOption1'),
        t('fintech.quiz.bankingOption2'),
        t('fintech.quiz.bankingOption3'),
        t('fintech.quiz.bankingOption4'),
      ],
      correctIndex: 1,
      explanation: t('fintech.quiz.bankingExplanation'),
    },
    completed: false,
    xpReward: 35,
  },
  {
    id: 'murabaha-explained',
    title: t('fintech.lesson.murabaha.title'),
    description: t('fintech.lesson.murabaha.description'),
    icon: <Coins className="w-5 h-5" />,
    content: [
      t('fintech.lessonContent.murabaha1'),
      t('fintech.lessonContent.murabaha2'),
      t('fintech.lessonContent.murabaha3'),
      t('fintech.lessonContent.murabaha4'),
    ],
    quiz: {
      question: t('fintech.quiz.murabahaQuestion'),
      options: [
        t('fintech.quiz.murabahaOption1'),
        t('fintech.quiz.murabahaOption2'),
        t('fintech.quiz.murabahaOption3'),
        t('fintech.quiz.murabahaOption4'),
      ],
      correctIndex: 1,
      explanation: t('fintech.quiz.murabahaExplanation'),
    },
    completed: false,
    xpReward: 35,
  },
  {
    id: 'halal-investing',
    title: t('fintech.lesson.halalInvesting.title'),
    description: t('fintech.lesson.halalInvesting.description'),
    icon: <Scale className="w-5 h-5" />,
    content: [
      t('fintech.lessonContent.investing1'),
      t('fintech.lessonContent.investing2'),
      t('fintech.lessonContent.investing3'),
      t('fintech.lessonContent.investing4'),
    ],
    quiz: {
      question: t('fintech.quiz.investingQuestion'),
      options: [
        t('fintech.quiz.investingOption1'),
        t('fintech.quiz.investingOption2'),
        t('fintech.quiz.investingOption3'),
        t('fintech.quiz.investingOption4'),
      ],
      correctIndex: 1,
      explanation: t('fintech.quiz.investingExplanation'),
    },
    completed: false,
    xpReward: 40,
  },
  {
    id: 'takaful-insurance',
    title: t('fintech.lesson.takaful.title'),
    description: t('fintech.lesson.takaful.description'),
    icon: <Heart className="w-5 h-5" />,
    content: [
      t('fintech.lessonContent.takaful1'),
      t('fintech.lessonContent.takaful2'),
      t('fintech.lessonContent.takaful3'),
      t('fintech.lessonContent.takaful4'),
    ],
    quiz: {
      question: t('fintech.quiz.takafulQuestion'),
      options: [
        t('fintech.quiz.takafulOption1'),
        t('fintech.quiz.takafulOption2'),
        t('fintech.quiz.takafulOption3'),
        t('fintech.quiz.takafulOption4'),
      ],
      correctIndex: 1,
      explanation: t('fintech.quiz.takafulExplanation'),
    },
    completed: false,
    xpReward: 35,
  },
];

const getScenarios = (t: (key: string) => string): Scenario[] => [
  {
    id: 'loan-choice',
    title: t('fintech.scenario.loanDecision.title'),
    situation: t('fintech.scenario.loanDecision.situation'),
    options: [
      { text: t('fintech.scenario.loanOption1'), isCorrect: false, explanation: t('fintech.scenario.loanOption1Explanation') },
      { text: t('fintech.scenario.loanOption2'), isCorrect: true, explanation: t('fintech.scenario.loanOption2Explanation') },
      { text: t('fintech.scenario.loanOption3'), isCorrect: false, explanation: t('fintech.scenario.loanOption3Explanation') },
    ],
  },
  {
    id: 'charity-allocation',
    title: t('fintech.scenario.charityBudget.title'),
    situation: t('fintech.scenario.charityBudget.situation'),
    options: [
      { text: t('fintech.scenario.charityOption1'), isCorrect: false, explanation: t('fintech.scenario.charityOption1Explanation') },
      { text: t('fintech.scenario.charityOption2'), isCorrect: true, explanation: t('fintech.scenario.charityOption2Explanation') },
      { text: t('fintech.scenario.charityOption3'), isCorrect: false, explanation: t('fintech.scenario.charityOption3Explanation') },
    ],
  },
  {
    id: 'mortgage-dilemma',
    title: t('fintech.scenario.homeBuying.title'),
    situation: t('fintech.scenario.homeBuying.situation'),
    options: [
      { text: t('fintech.scenario.mortgageOption1'), isCorrect: false, explanation: t('fintech.scenario.mortgageOption1Explanation') },
      { text: t('fintech.scenario.mortgageOption2'), isCorrect: true, explanation: t('fintech.scenario.mortgageOption2Explanation') },
      { text: t('fintech.scenario.mortgageOption3'), isCorrect: false, explanation: t('fintech.scenario.mortgageOption3Explanation') },
    ],
  },
  {
    id: 'investment-screening',
    title: t('fintech.scenario.stockScreening.title'),
    situation: t('fintech.scenario.stockScreening.situation'),
    options: [
      { text: t('fintech.scenario.stockOption1'), isCorrect: false, explanation: t('fintech.scenario.stockOption1Explanation') },
      { text: t('fintech.scenario.stockOption2'), isCorrect: false, explanation: t('fintech.scenario.stockOption2Explanation') },
      { text: t('fintech.scenario.stockOption3'), isCorrect: true, explanation: t('fintech.scenario.stockOption3Explanation') },
    ],
  },
  {
    id: 'crypto-trading',
    title: t('fintech.scenario.crypto.title'),
    situation: t('fintech.scenario.crypto.situation'),
    options: [
      { text: t('fintech.scenario.cryptoOption1'), isCorrect: false, explanation: t('fintech.scenario.cryptoOption1Explanation') },
      { text: t('fintech.scenario.cryptoOption2'), isCorrect: true, explanation: t('fintech.scenario.cryptoOption2Explanation') },
      { text: t('fintech.scenario.cryptoOption3'), isCorrect: false, explanation: t('fintech.scenario.cryptoOption3Explanation') },
    ],
  },
];

export const FintechEducationModule = ({ onXPGained }: { onXPGained?: (amount: number) => void }) => {
  const { t } = useTranslation();
  
  // Generate lessons and scenarios with translations
  const lessons = getLessons(t);
  const scenarios = getScenarios(t);
  
  const [activeTab, setActiveTab] = useState<'lessons' | 'scenarios' | 'badges'>('lessons');
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [lessonStep, setLessonStep] = useState<'content' | 'quiz' | 'complete'>('content');
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);

  const [activeScenario, setActiveScenario] = useState<Scenario | null>(null);
  const [scenarioAnswer, setScenarioAnswer] = useState<number | null>(null);

  const handleAnswerSelect = (index: number) => {
    if (showExplanation) return;
    setSelectedAnswer(index);
    setShowExplanation(true);
    
    if (selectedLesson && index === selectedLesson.quiz.correctIndex) {
      // Correct answer
      setTimeout(() => {
        setLessonStep('complete');
        setCompletedLessons(prev => [...prev, selectedLesson.id]);
        onXPGained?.(selectedLesson.xpReward);
      }, 2000);
    }
  };

  const handleScenarioAnswer = (index: number) => {
    setScenarioAnswer(index);
  };

  const resetLesson = () => {
    setSelectedLesson(null);
    setLessonStep('content');
    setSelectedAnswer(null);
    setShowExplanation(false);
  };

  const totalXPEarned = completedLessons.length * 30;
  const badges = [
    { name: 'Ethical Thinker', earned: completedLessons.length >= 1 },
    { name: 'Charity Champion', earned: completedLessons.includes('charity-types') },
    { name: 'Fair Trade Mindset', earned: completedLessons.length >= 3 },
    { name: 'Finance Scholar', earned: completedLessons.length >= 4 },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground">{t('fintech.ethicalFinance')}</h2>
          <p className="text-xs text-muted-foreground">{t('fintech.learnBasics')}</p>
        </div>
        <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary">
          <Star className="w-4 h-4" />
          <span className="text-sm font-bold">{totalXPEarned} XP</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 p-1 rounded-xl bg-muted/30">
        {(['lessons', 'scenarios', 'badges'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all capitalize",
              activeTab === tab
                ? "bg-card shadow-sm text-foreground"
                : "text-muted-foreground"
            )}
          >
            {t(`fintech.${tab}`)}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Lessons Tab */}
        {activeTab === 'lessons' && !selectedLesson && (
          <motion.div
            key="lessons-list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            {lessons.map((lesson) => {
              const isCompleted = completedLessons.includes(lesson.id);
              return (
                <motion.button
                  key={lesson.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => !isCompleted && setSelectedLesson(lesson)}
                  className={cn(
                    "w-full p-4 rounded-2xl border text-left transition-all",
                    isCompleted
                      ? "bg-primary/5 border-primary/20"
                      : "bg-card/80 border-border/50 hover:border-primary/30"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center",
                      isCompleted ? "bg-primary text-primary-foreground" : "bg-muted/80 text-muted-foreground"
                    )}>
                      {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : lesson.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm text-foreground">{lesson.title}</h3>
                      <p className="text-xs text-muted-foreground">{lesson.description}</p>
                    </div>
                    {!isCompleted && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Star className="w-3 h-3" />
                        +{lesson.xpReward}
                      </div>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </motion.div>
        )}

        {/* Active Lesson */}
        {activeTab === 'lessons' && selectedLesson && (
          <motion.div
            key="lesson-view"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <button 
              onClick={resetLesson}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              ← {t('fintech.backToLessons')}
            </button>

            {lessonStep === 'content' && (
              <>
                <div className="p-4 rounded-2xl bg-card/80 border border-border/50">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      {selectedLesson.icon}
                    </div>
                    <h3 className="font-bold text-foreground">{selectedLesson.title}</h3>
                  </div>
                  <div className="space-y-3">
                    {selectedLesson.content.map((point, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-start gap-2"
                      >
                        <ArrowRight className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                        <p className="text-sm text-muted-foreground">{point}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
                <Button onClick={() => setLessonStep('quiz')} className="w-full">
                  {t('fintech.takeQuiz')}
                </Button>
              </>
            )}

            {lessonStep === 'quiz' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-card/80 border border-border/50">
                  <h3 className="font-bold text-foreground mb-4">{selectedLesson.quiz.question}</h3>
                  <div className="space-y-2">
                    {selectedLesson.quiz.options.map((option, i) => {
                      const isCorrect = i === selectedLesson.quiz.correctIndex;
                      const isSelected = selectedAnswer === i;
                      return (
                        <motion.button
                          key={i}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleAnswerSelect(i)}
                          disabled={showExplanation}
                          className={cn(
                            "w-full p-3 rounded-xl border text-left transition-all text-sm",
                            showExplanation && isCorrect
                              ? "bg-green-500/10 border-green-500/50 text-green-700 dark:text-green-400"
                              : showExplanation && isSelected && !isCorrect
                              ? "bg-red-500/10 border-red-500/50 text-red-700 dark:text-red-400"
                              : isSelected
                              ? "bg-primary/10 border-primary/50"
                              : "bg-muted/30 border-border/30 hover:border-primary/30"
                          )}
                        >
                          <div className="flex items-center gap-2">
                            {showExplanation && isCorrect && <CheckCircle2 className="w-4 h-4" />}
                            {showExplanation && isSelected && !isCorrect && <XCircle className="w-4 h-4" />}
                            {option}
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {showExplanation && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-2xl bg-primary/5 border border-primary/20"
                  >
                    <p className="text-sm text-foreground">{selectedLesson.quiz.explanation}</p>
                  </motion.div>
                )}
              </div>
            )}

            {lessonStep === 'complete' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8 space-y-4"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring" }}
                  className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto"
                >
                  <Sparkles className="w-10 h-10 text-primary" />
                </motion.div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">{t('fintech.lessonComplete')}</h2>
                  <p className="text-sm text-primary font-bold">+{selectedLesson.xpReward} XP</p>
                </div>
                <Button onClick={resetLesson}>{t('fintech.continueLearning')}</Button>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Scenarios Tab */}
        {activeTab === 'scenarios' && (
          <motion.div
            key="scenarios"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            {!activeScenario ? (
              scenarios.map((scenario) => (
                <motion.button
                  key={scenario.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveScenario(scenario)}
                  className="w-full p-4 rounded-2xl border bg-card/80 border-border/50 text-left"
                >
                  <h3 className="font-semibold text-sm text-foreground">{scenario.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{scenario.situation}</p>
                </motion.button>
              ))
            ) : (
              <div className="space-y-4">
                <button 
                  onClick={() => { setActiveScenario(null); setScenarioAnswer(null); }}
                  className="text-sm text-muted-foreground"
                >
                  ← {t('common.back')}
                </button>
                <div className="p-4 rounded-2xl bg-card/80 border border-border/50">
                  <h3 className="font-bold text-foreground mb-2">{activeScenario.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{activeScenario.situation}</p>
                  <div className="space-y-2">
                    {activeScenario.options.map((opt, i) => (
                      <motion.button
                        key={i}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleScenarioAnswer(i)}
                        className={cn(
                          "w-full p-3 rounded-xl border text-left text-sm",
                          scenarioAnswer === i
                            ? opt.isCorrect
                              ? "bg-green-500/10 border-green-500/50"
                              : "bg-red-500/10 border-red-500/50"
                            : "bg-muted/30 border-border/30"
                        )}
                      >
                        {opt.text}
                        {scenarioAnswer === i && (
                          <p className="text-xs mt-2 text-muted-foreground">{opt.explanation}</p>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Badges Tab */}
        {activeTab === 'badges' && (
          <motion.div
            key="badges"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-2 gap-3"
          >
            {badges.map((badge) => (
              <motion.div
                key={badge.name}
                className={cn(
                  "p-4 rounded-2xl border text-center",
                  badge.earned
                    ? "bg-primary/5 border-primary/30"
                    : "bg-muted/20 border-border/30 opacity-50"
                )}
              >
                <div className={cn(
                  "w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center",
                  badge.earned ? "bg-primary/10" : "bg-muted"
                )}>
                  <Trophy className={cn(
                    "w-6 h-6",
                    badge.earned ? "text-primary" : "text-muted-foreground"
                  )} />
                </div>
                <p className="text-xs font-semibold">{badge.name}</p>
                <p className="text-[10px] text-muted-foreground">
                  {badge.earned ? t('fintech.earned') : t('fintech.locked')}
                </p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
