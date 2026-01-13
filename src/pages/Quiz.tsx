import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Brain, CheckCircle2, XCircle, Star, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import BottomNav from '@/components/BottomNav';
import { useDailyQuiz, QuizAttempt } from '@/hooks/useDailyQuiz';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

const Quiz = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { quiz, loading, generating, hasCompletedToday, attempt, submitQuiz, refetch } = useDailyQuiz();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [quizResult, setQuizResult] = useState<{ score: number; pointsEarned: number } | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const questions = quiz?.questions as any[] || [];
  const currentQ = questions[currentQuestion];

  const handleSelectAnswer = (answerIndex: number) => {
    if (showExplanation) return;
    
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
    setShowExplanation(true);

    // Auto-advance after showing explanation
    setTimeout(() => {
      setShowExplanation(false);
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        // Submit quiz
        handleSubmit(newAnswers);
      }
    }, 2500);
  };

  const handleSubmit = async (answers: number[]) => {
    const result = await submitQuiz(answers);
    setQuizResult(result);
    setShowResult(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-24">
        <div className="p-4 space-y-4">
          <Skeleton className="h-12 w-32" />
          <Skeleton className="h-48 rounded-2xl" />
          <div className="space-y-3">
            {[1,2,3,4].map(i => <Skeleton key={i} className="h-16 rounded-xl" />)}
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  // Already completed today
  if (hasCompletedToday && attempt) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-background pb-24"
      >
        <div className="px-4 pt-4 pb-2 flex items-center gap-3">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </motion.button>
          <div>
            <h1 className="text-xl font-bold text-foreground">{t('quiz.dailyQuiz')}</h1>
            <p className="text-xs text-muted-foreground">{quiz?.topic || t('quiz.islamicKnowledge')}</p>
          </div>
        </div>

        <div className="px-4 py-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-24 h-24 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle2 className="w-12 h-12 text-green-500" />
          </motion.div>
          <h2 className="text-2xl font-bold text-foreground mb-2">{t('quiz.quizComplete')}</h2>
          <p className="text-muted-foreground mb-6">{t('quiz.alreadyCompleted')}</p>
          
          <div className="p-6 rounded-2xl bg-card/80 border border-border/50 max-w-sm mx-auto">
            <div className="flex items-center justify-center gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">{attempt.score}/{attempt.total_questions}</p>
                <p className="text-xs text-muted-foreground">{t('quiz.score')}</p>
              </div>
              <div className="h-12 w-px bg-border" />
              <div className="text-center">
                <p className="text-3xl font-bold text-yellow-500">+{attempt.points_earned}</p>
                <p className="text-xs text-muted-foreground">{t('dashboard.barakahPoints')}</p>
              </div>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mt-8">{t('quiz.comeBackTomorrow')}</p>
          
          <Button 
            variant="outline" 
            onClick={() => navigate('/dashboard')}
            className="mt-4"
          >
            {t('quiz.backToDashboard')}
          </Button>
        </div>

        <BottomNav />
      </motion.div>
    );
  }

  // No quiz available
  if (!quiz || !questions.length) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-background pb-24"
      >
        <div className="px-4 pt-4 pb-2 flex items-center gap-3">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </motion.button>
          <h1 className="text-xl font-bold text-foreground">{t('quiz.dailyQuiz')}</h1>
        </div>

        <div className="px-4 py-8 text-center">
          {generating ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4"
              >
                <Brain className="w-8 h-8 text-primary" />
              </motion.div>
              <h2 className="text-xl font-bold text-foreground">{t('quiz.generatingQuiz')}</h2>
              <p className="text-sm text-muted-foreground mt-2">{t('quiz.aiCreatingQuestions')}</p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-bold text-foreground">{t('quiz.noQuizAvailable')}</h2>
              <p className="text-sm text-muted-foreground mt-2">{t('quiz.checkBackLater')}</p>
              <Button onClick={refetch} className="mt-4">
                {t('common.retry')}
              </Button>
            </>
          )}
        </div>

        <BottomNav />
      </motion.div>
    );
  }

  // Show result screen
  if (showResult && quizResult) {
    const percentage = Math.round((quizResult.score / questions.length) * 100);
    const isPerfect = quizResult.score === questions.length;
    
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-background pb-24"
      >
        <div className="px-4 pt-4 pb-2">
          <h1 className="text-xl font-bold text-foreground text-center">{t('quiz.quizComplete')}</h1>
        </div>

        <div className="px-4 py-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className={cn(
              "w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6",
              isPerfect 
                ? "bg-gradient-to-br from-yellow-400 to-orange-500" 
                : "bg-gradient-to-br from-primary to-primary/70"
            )}
          >
            {isPerfect ? (
              <Star className="w-16 h-16 text-white" />
            ) : (
              <span className="text-4xl font-bold text-white">{percentage}%</span>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {isPerfect && (
              <div className="flex items-center justify-center gap-2 text-yellow-500 mb-4">
                <Sparkles className="w-5 h-5" />
                <span className="font-bold">{t('quiz.perfectScore')}</span>
                <Sparkles className="w-5 h-5" />
              </div>
            )}
            
            <h2 className="text-2xl font-bold text-foreground">
              {quizResult.score}/{questions.length} {t('quiz.correct')}
            </h2>
            
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary/10 text-primary font-bold text-lg mt-4"
            >
              <Star className="w-5 h-5" />
              +{quizResult.pointsEarned} {t('dashboard.barakahPoints')}
            </motion.div>
          </motion.div>

          <div className="mt-8 space-y-3">
            <Button onClick={() => navigate('/dashboard')} className="w-full max-w-xs">
              {t('common.continue')}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/achievements')}
              className="w-full max-w-xs"
            >
              {t('quiz.viewAchievements')}
            </Button>
          </div>
        </div>

        <BottomNav />
      </motion.div>
    );
  }

  // Quiz in progress
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background pb-24"
    >
      {/* Header */}
      <div className="px-4 pt-4 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </motion.button>
          <div>
            <h1 className="text-lg font-bold text-foreground">{t('quiz.dailyQuiz')}</h1>
            <p className="text-xs text-muted-foreground">{quiz.topic}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-primary">{currentQuestion + 1}/{questions.length}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-4 py-2">
        <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full"
          />
        </div>
      </div>

      {/* Question */}
      <div className="px-4 py-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            {/* Question Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-purple-500/20">
              <div className="flex items-center gap-2 mb-4">
                <Brain className="w-5 h-5 text-purple-500" />
                <span className="text-xs font-medium text-purple-500">{t('quiz.question')} {currentQuestion + 1}</span>
              </div>
              <h2 className="text-lg font-bold text-foreground">{currentQ?.question}</h2>
            </div>

            {/* Answer Options */}
            <div className="space-y-3">
              {currentQ?.options?.map((option: string, index: number) => {
                const isSelected = selectedAnswers[currentQuestion] === index;
                const isCorrect = index === currentQ.correct_answer;
                const showCorrectness = showExplanation;
                
                return (
                  <motion.button
                    key={index}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelectAnswer(index)}
                    disabled={showExplanation}
                    className={cn(
                      "w-full p-4 rounded-xl border text-left transition-all",
                      showCorrectness && isCorrect
                        ? "bg-green-500/10 border-green-500/50"
                        : showCorrectness && isSelected && !isCorrect
                        ? "bg-red-500/10 border-red-500/50"
                        : isSelected
                        ? "bg-primary/10 border-primary/50"
                        : "bg-card/80 border-border/50 hover:border-primary/30"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0",
                        showCorrectness && isCorrect
                          ? "bg-green-500 text-white"
                          : showCorrectness && isSelected && !isCorrect
                          ? "bg-red-500 text-white"
                          : isSelected
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      )}>
                        {showCorrectness && isCorrect ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : showCorrectness && isSelected && !isCorrect ? (
                          <XCircle className="w-5 h-5" />
                        ) : (
                          String.fromCharCode(65 + index)
                        )}
                      </div>
                      <span className={cn(
                        "text-sm",
                        (showCorrectness && isCorrect) || isSelected
                          ? "text-foreground font-medium"
                          : "text-muted-foreground"
                      )}>
                        {option}
                      </span>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Explanation */}
            <AnimatePresence>
              {showExplanation && currentQ?.explanation && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="p-4 rounded-xl bg-primary/5 border border-primary/20"
                >
                  <p className="text-sm text-foreground">{currentQ.explanation}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </div>

      <BottomNav />
    </motion.div>
  );
};

export default Quiz;
