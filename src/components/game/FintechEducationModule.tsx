import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Coins, Scale, Heart, BookOpen, CheckCircle2, XCircle, 
  ArrowRight, Star, Trophy, Sparkles
} from 'lucide-react';
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

const lessons: Lesson[] = [
  {
    id: 'what-is-riba',
    title: 'What is Riba?',
    description: 'Understanding interest in Islam',
    icon: <Coins className="w-5 h-5" />,
    content: [
      "Riba (interest) is prohibited in Islam because it creates unfair gain without effort or risk.",
      "It can harm the borrower and lead to exploitation.",
      "Islam encourages risk-sharing and ethical transactions.",
      "Alternatives like profit-sharing (Mudarabah) are preferred."
    ],
    quiz: {
      question: "Why is riba (interest) prohibited in Islam?",
      options: [
        "Because it creates unfair gain without shared risk",
        "Because banks are not allowed in Islam",
        "Because money should never grow",
        "Because only gold can be used for trade"
      ],
      correctIndex: 0,
      explanation: "Riba creates unfair gain for the lender without sharing in any risk, which goes against Islamic principles of fairness and equity."
    },
    completed: false,
    xpReward: 30,
  },
  {
    id: 'halal-vs-haram',
    title: 'Halal vs Haram Money',
    description: 'Distinguishing ethical earnings',
    icon: <Scale className="w-5 h-5" />,
    content: [
      "Halal income comes from honest work, fair trade, and ethical business.",
      "Haram sources include gambling, interest, fraud, and harmful products.",
      "The intention (niyyah) behind earning matters too.",
      "Purifying wealth through charity is encouraged."
    ],
    quiz: {
      question: "Which of these is a halal source of income?",
      options: [
        "Interest from savings accounts",
        "Selling alcohol",
        "Teaching beneficial knowledge",
        "Running a gambling website"
      ],
      correctIndex: 2,
      explanation: "Teaching beneficial knowledge is halal as it provides genuine value to others through honest effort."
    },
    completed: false,
    xpReward: 30,
  },
  {
    id: 'charity-types',
    title: 'Types of Islamic Charity',
    description: 'Zakat, Sadaqah, and Waqf',
    icon: <Heart className="w-5 h-5" />,
    content: [
      "Zakat is obligatory (2.5% of savings) for eligible Muslims.",
      "Sadaqah is voluntary charity given any time.",
      "Waqf is endowment for ongoing benefit (like wells, schools).",
      "All forms of charity purify wealth and help others."
    ],
    quiz: {
      question: "What is Waqf?",
      options: [
        "A type of loan",
        "A mandatory tax",
        "An endowment for ongoing benefit",
        "A one-time donation"
      ],
      correctIndex: 2,
      explanation: "Waqf is an endowment where assets are dedicated for ongoing charitable purposes, like building wells or schools."
    },
    completed: false,
    xpReward: 30,
  },
  {
    id: 'ethical-spending',
    title: 'Ethical Spending',
    description: 'Making mindful money choices',
    icon: <BookOpen className="w-5 h-5" />,
    content: [
      "Spend on needs before wants.",
      "Avoid wastefulness (israf) - it's disliked in Islam.",
      "Consider the impact of purchases on others and environment.",
      "Balance between saving and being generous."
    ],
    quiz: {
      question: "What does Islam say about wastefulness (israf)?",
      options: [
        "It's encouraged if you can afford it",
        "It's disliked and should be avoided",
        "It only applies to food",
        "It's only forbidden in Ramadan"
      ],
      correctIndex: 1,
      explanation: "Wastefulness (israf) is disliked in Islam. Allah loves moderation and balance in all things, including spending."
    },
    completed: false,
    xpReward: 30,
  },
];

interface Scenario {
  id: string;
  title: string;
  situation: string;
  options: { text: string; isCorrect: boolean; explanation: string }[];
}

const scenarios: Scenario[] = [
  {
    id: 'loan-choice',
    title: 'The Loan Decision',
    situation: "Your friend needs to borrow money for a small business. How should you help?",
    options: [
      { text: "Lend with 10% interest", isCorrect: false, explanation: "Charging interest is riba and not allowed." },
      { text: "Invest as a partner, sharing profit and loss", isCorrect: true, explanation: "This is called Musharakah - a halal partnership model!" },
      { text: "Refuse to help", isCorrect: false, explanation: "While not wrong, there are better ways to help ethically." },
    ],
  },
  {
    id: 'charity-allocation',
    title: 'Charity Budget',
    situation: "You have $100 to give in charity. How would you allocate it wisely?",
    options: [
      { text: "Give all to one big organization", isCorrect: false, explanation: "Valid, but diversifying impact can help more people." },
      { text: "Split between local needy, orphans, and education", isCorrect: true, explanation: "Great thinking! Diversifying charity maximizes impact and benefit." },
      { text: "Keep it for later", isCorrect: false, explanation: "It's better to give sooner - charity never decreases wealth." },
    ],
  },
];

export const FintechEducationModule = ({ onXPGained }: { onXPGained?: (amount: number) => void }) => {
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
          <h2 className="text-lg font-bold text-foreground">Ethical Finance</h2>
          <p className="text-xs text-muted-foreground">Learn Islamic finance basics</p>
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
            {tab}
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
              ← Back to Lessons
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
                  Take Quiz
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
                  <h2 className="text-xl font-bold text-foreground">Lesson Complete!</h2>
                  <p className="text-sm text-primary font-bold">+{selectedLesson.xpReward} XP</p>
                </div>
                <Button onClick={resetLesson}>Continue Learning</Button>
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
                  ← Back
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
                  {badge.earned ? "Earned!" : "Locked"}
                </p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
