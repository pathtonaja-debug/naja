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
  {
    id: 'islamic-banking',
    title: 'Islamic Banking Basics',
    description: 'How Islamic banks operate',
    icon: <Scale className="w-5 h-5" />,
    content: [
      "Islamic banks don't charge or pay interest (riba).",
      "They use profit-sharing models like Mudarabah and Musharakah.",
      "Products are based on real economic activity and asset-backing.",
      "Risk is shared between the bank and customer."
    ],
    quiz: {
      question: "What is the key difference between Islamic and conventional banking?",
      options: [
        "Islamic banks are only in Muslim countries",
        "Islamic banks share risk and avoid interest",
        "Islamic banks don't lend money",
        "Islamic banks are smaller"
      ],
      correctIndex: 1,
      explanation: "Islamic banks operate on risk-sharing principles and avoid interest, instead using trade and investment-based contracts."
    },
    completed: false,
    xpReward: 35,
  },
  {
    id: 'murabaha-explained',
    title: 'Murabaha Financing',
    description: 'Cost-plus sale structure',
    icon: <Coins className="w-5 h-5" />,
    content: [
      "Murabaha is a cost-plus sale where the bank buys an asset and sells it to you at a markup.",
      "The price is agreed upfront and fixed - no hidden fees.",
      "Unlike a loan, the bank actually owns the asset before selling it to you.",
      "Commonly used for car financing and equipment purchases."
    ],
    quiz: {
      question: "In Murabaha financing, who owns the asset before it's sold to the customer?",
      options: [
        "The customer owns it from the start",
        "The bank owns it first, then sells to customer",
        "A third party holds ownership",
        "Nobody owns it until final payment"
      ],
      correctIndex: 1,
      explanation: "In Murabaha, the bank purchases the asset and takes ownership, then sells it to the customer at an agreed markup."
    },
    completed: false,
    xpReward: 35,
  },
  {
    id: 'halal-investing',
    title: 'Halal Stock Investing',
    description: 'Screening stocks for compliance',
    icon: <Scale className="w-5 h-5" />,
    content: [
      "Companies must pass ethical screening - no alcohol, gambling, pork, weapons, or adult entertainment.",
      "Financial ratios matter: debt-to-assets typically must be under 33%.",
      "Interest income should be less than 5% of total revenue.",
      "Purification is needed for any dividends that include non-halal income."
    ],
    quiz: {
      question: "What is a common debt-to-asset threshold for halal stock screening?",
      options: [
        "Under 10%",
        "Under 33%",
        "Under 50%",
        "No limit exists"
      ],
      correctIndex: 1,
      explanation: "Most Islamic scholars and screening standards use 33% as the maximum debt-to-assets ratio for halal investments."
    },
    completed: false,
    xpReward: 40,
  },
  {
    id: 'takaful-insurance',
    title: 'Takaful Insurance',
    description: 'Islamic cooperative insurance',
    icon: <Heart className="w-5 h-5" />,
    content: [
      "Takaful is based on mutual cooperation (ta'awun) among participants.",
      "Contributions go into a shared pool to help those who experience loss.",
      "Surplus is shared among participants or donated to charity.",
      "Avoids gharar (uncertainty) and riba found in conventional insurance."
    ],
    quiz: {
      question: "What happens to surplus funds in Takaful?",
      options: [
        "The company keeps all profits",
        "Surplus is shared with participants or given to charity",
        "It's transferred to government",
        "It disappears"
      ],
      correctIndex: 1,
      explanation: "In Takaful, any surplus from the contribution pool is shared among participants or donated to charity, unlike conventional insurance where profits go to shareholders."
    },
    completed: false,
    xpReward: 35,
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
  {
    id: 'mortgage-dilemma',
    title: 'The Home Buying Dilemma',
    situation: "You want to buy a house but don't have enough savings. What's the best approach?",
    options: [
      { text: "Take a conventional mortgage with interest", isCorrect: false, explanation: "Conventional mortgages involve riba. There are halal alternatives available." },
      { text: "Use Islamic financing like Murabaha or Ijarah", isCorrect: true, explanation: "Islamic home financing uses cost-plus sale (Murabaha) or lease-to-own (Ijarah) structures that avoid interest." },
      { text: "Give up on home ownership", isCorrect: false, explanation: "There are halal pathways to home ownership - don't give up!" },
    ],
  },
  {
    id: 'investment-screening',
    title: 'Stock Investment Screening',
    situation: "You want to invest in stocks. A company looks profitable but makes 8% of its revenue from alcohol sales. What do you do?",
    options: [
      { text: "Invest anyway since alcohol is a small percentage", isCorrect: false, explanation: "Most scholars recommend avoiding companies with more than 5% revenue from haram sources." },
      { text: "Invest but donate the 8% of dividends to charity", isCorrect: false, explanation: "While purification is encouraged, it's better to avoid investments that exceed tolerance thresholds." },
      { text: "Find a company that passes halal screening criteria", isCorrect: true, explanation: "Correct! Look for companies that pass financial and ethical screening - under 5% from haram sources, acceptable debt ratios." },
    ],
  },
  {
    id: 'crypto-trading',
    title: 'Cryptocurrency Question',
    situation: "A friend tells you about a crypto 'guaranteed returns' scheme promising 30% monthly returns. Should you invest?",
    options: [
      { text: "Yes, if the returns are guaranteed it's safe", isCorrect: false, explanation: "Guaranteed returns that are too good to be true often indicate Ponzi schemes or fraud - this is haram regardless of the asset class." },
      { text: "Only invest what you can afford to lose in legitimate crypto", isCorrect: true, explanation: "Correct! Legitimate crypto investment (without leverage/gambling) may be permissible, but 'guaranteed' high returns are a red flag for scams." },
      { text: "Crypto is always haram so avoid it completely", isCorrect: false, explanation: "While scholars differ, many permit crypto as a medium of exchange. The issue here is the unrealistic promises, not crypto itself." },
    ],
  },
  {
    id: 'insurance-decision',
    title: 'Insurance Needs',
    situation: "You need health insurance for your family. What's the most Islamic approach?",
    options: [
      { text: "Buy conventional insurance - it's a necessity", isCorrect: false, explanation: "While some scholars allow it out of necessity, there are often takaful alternatives worth exploring first." },
      { text: "Look for Takaful (Islamic cooperative insurance)", isCorrect: true, explanation: "Takaful is based on mutual cooperation and shared responsibility, avoiding the gharar (uncertainty) issues in conventional insurance." },
      { text: "Don't get any insurance and rely on Allah", isCorrect: false, explanation: "While tawakkul is important, taking reasonable precautions (like Islamic insurance) is also encouraged - 'tie your camel and trust in Allah.'" },
    ],
  },
  {
    id: 'business-partnership',
    title: 'Starting a Business',
    situation: "You and a friend want to start a restaurant. How should you structure the partnership?",
    options: [
      { text: "Silent partner gives money, active partner does all work, profits split 50/50", isCorrect: false, explanation: "In Mudarabah, the capital provider's share should reflect only capital contribution, while the working partner's share reflects effort." },
      { text: "Use Musharakah with agreed profit ratios and both contribute work", isCorrect: true, explanation: "Musharakah (full partnership) where both contribute capital and/or effort with pre-agreed profit ratios is ideal for active partnerships." },
      { text: "Guarantee the investor a fixed return regardless of profit", isCorrect: false, explanation: "Guaranteed returns for a capital provider is riba. In Islamic finance, returns must be tied to actual business performance." },
    ],
  },
  {
    id: 'debt-management',
    title: 'Debt Consolidation',
    situation: "You have multiple debts with high interest rates. A company offers to consolidate them at a lower rate. What do you do?",
    options: [
      { text: "Take the consolidation loan to reduce overall interest", isCorrect: false, explanation: "This replaces one riba-based loan with another. It doesn't address the underlying issue." },
      { text: "Seek a qard hasan (interest-free loan) from family or Islamic institutions", isCorrect: true, explanation: "Prioritize interest-free options first. Many communities and Islamic credit unions offer qard hasan for debt relief." },
      { text: "Declare bankruptcy to escape the debt", isCorrect: false, explanation: "Islam encourages fulfilling obligations where possible. Explore all halal repayment options before considering this." },
    ],
  },
  {
    id: 'emergency-fund',
    title: 'Building Emergency Savings',
    situation: "You want to build an emergency fund. Where should you keep this money?",
    options: [
      { text: "High-yield savings account at a conventional bank", isCorrect: false, explanation: "Interest earned from conventional savings accounts is riba and should be avoided." },
      { text: "Islamic savings account or invest in low-risk halal assets", isCorrect: true, explanation: "Islamic banks offer profit-sharing savings accounts, or you can keep it in a non-interest checking account while the core fund is preserved." },
      { text: "Under your mattress to avoid any interest", isCorrect: false, explanation: "While avoiding interest is good, there are legitimate halal options that can provide some return while keeping money safe." },
    ],
  },
  {
    id: 'gold-investment',
    title: 'Gold Investment Rules',
    situation: "You want to buy gold as an investment. Your jeweler offers to exchange your old gold jewelry for new gold jewelry plus cash. Is this permissible?",
    options: [
      { text: "Yes, as long as the cash amount is fair", isCorrect: false, explanation: "Gold for gold exchanges require equal weight and immediate exchange. Adding cash creates riba al-fadl (excess in exchange)." },
      { text: "Sell your old gold for cash, then separately buy new gold", isCorrect: true, explanation: "Correct! This creates two separate transactions, avoiding the prohibition on unequal gold-for-gold exchange." },
      { text: "It doesn't matter since it's just jewelry", isCorrect: false, explanation: "Islamic rules on gold exchange apply whether it's jewelry or bullion. The form doesn't change the ruling." },
    ],
  },
];

export const FintechEducationModule = ({ onXPGained }: { onXPGained?: (amount: number) => void }) => {
  const { t } = useTranslation();
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
