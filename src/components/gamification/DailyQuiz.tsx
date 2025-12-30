import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, CheckCircle2, XCircle, Sparkles, 
  ChevronRight, Trophy, Loader2, RefreshCw 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDailyQuiz } from '@/hooks/useDailyQuiz';
import { toast } from 'sonner';

interface DailyQuizProps {
  onComplete?: (pointsEarned: number) => void;
}

export const DailyQuiz = ({ onComplete }: DailyQuizProps) => {
  const { quiz, attempt, loading, generating, error, hasCompletedToday, submitQuiz, refetch } = useDailyQuiz();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return (
      <Card className="p-4 rounded-2xl border-border">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <span className="ml-2 text-sm text-muted-foreground">Loading quiz...</span>
        </div>
      </Card>
    );
  }

  if (generating) {
    return (
      <Card className="p-4 rounded-2xl border-border">
        <div className="flex flex-col items-center justify-center py-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-8 h-8 text-primary" />
          </motion.div>
          <p className="mt-3 text-sm text-muted-foreground">Generating today's quiz...</p>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-4 rounded-2xl border-border">
        <div className="flex flex-col items-center justify-center py-6">
          <p className="text-sm text-muted-foreground mb-3">{error}</p>
          <Button variant="outline" size="sm" onClick={refetch}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      </Card>
    );
  }

  if (!quiz) {
    return null;
  }

  // Already completed today
  if (hasCompletedToday && attempt) {
    return (
      <Card className="p-4 rounded-2xl border-border bg-gradient-to-br from-primary/5 to-transparent">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Trophy className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-sm">Quiz Completed</h3>
            <p className="text-xs text-muted-foreground">{quiz.topic}</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between bg-card rounded-xl p-3 mb-3">
          <div>
            <p className="text-2xl font-bold text-foreground">{attempt.score}/{attempt.total_questions}</p>
            <p className="text-xs text-muted-foreground">Correct answers</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-primary">+{attempt.points_earned}</p>
            <p className="text-xs text-muted-foreground">Barakah Points</p>
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          Come back tomorrow for a new quiz
        </p>
      </Card>
    );
  }

  const question = quiz.questions[currentQuestion];
  const totalQuestions = quiz.questions.length;

  const handleSelectAnswer = (index: number) => {
    if (showResult) return;
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = index;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = async () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(prev => prev + 1);
      setShowResult(false);
    } else {
      // Submit quiz
      setSubmitting(true);
      const result = await submitQuiz(selectedAnswers);
      if (result) {
        // Points are already awarded in submitQuiz - do not double-award
        toast.success(`Quiz completed. +${result.pointsEarned} Barakah Points`);
        onComplete?.(result.pointsEarned);
      }
      setSubmitting(false);
    }
  };

  const handleCheckAnswer = () => {
    setShowResult(true);
  };

  const isCorrect = showResult && selectedAnswers[currentQuestion] === question.correct_index;
  const isWrong = showResult && selectedAnswers[currentQuestion] !== question.correct_index;

  return (
    <Card className="p-4 rounded-2xl border-border overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-sm">Daily Quiz</h3>
            <p className="text-[10px] text-muted-foreground">{quiz.topic}</p>
          </div>
        </div>
        <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
          {currentQuestion + 1}/{totalQuestions}
        </span>
      </div>

      {/* Progress dots */}
      <div className="flex gap-1.5 mb-4">
        {quiz.questions.map((_, i) => (
          <div 
            key={i}
            className={cn(
              "h-1 flex-1 rounded-full transition-all",
              i === currentQuestion 
                ? "bg-primary" 
                : i < currentQuestion 
                  ? "bg-primary/50" 
                  : "bg-muted"
            )}
          />
        ))}
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-3"
        >
          <p className="text-sm font-medium text-foreground leading-relaxed">
            {question.question}
          </p>

          {/* Options */}
          <div className="space-y-2">
            {question.options.map((option, i) => {
              const isSelected = selectedAnswers[currentQuestion] === i;
              const isCorrectOption = showResult && i === question.correct_index;
              const isWrongSelection = showResult && isSelected && i !== question.correct_index;

              return (
                <motion.button
                  key={i}
                  onClick={() => handleSelectAnswer(i)}
                  disabled={showResult}
                  className={cn(
                    "w-full p-3 rounded-xl text-left text-sm transition-all border",
                    isCorrectOption 
                      ? "bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-400"
                      : isWrongSelection
                        ? "bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-400"
                        : isSelected
                          ? "bg-primary/10 border-primary/30 text-foreground"
                          : "bg-muted/30 border-border text-foreground hover:bg-muted/50"
                  )}
                  whileTap={{ scale: showResult ? 1 : 0.98 }}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {isCorrectOption && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                    {isWrongSelection && <XCircle className="w-4 h-4 text-red-500" />}
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Explanation */}
          {showResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "p-3 rounded-xl text-xs",
                isCorrect 
                  ? "bg-green-500/10 text-green-700 dark:text-green-400"
                  : "bg-amber-500/10 text-amber-700 dark:text-amber-400"
              )}
            >
              <p className="font-medium mb-1">{isCorrect ? "Correct!" : "Not quite!"}</p>
              <p className="opacity-90">{question.explanation}</p>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Actions */}
      <div className="mt-4 flex gap-2">
        {!showResult ? (
          <Button 
            className="flex-1" 
            onClick={handleCheckAnswer}
            disabled={selectedAnswers[currentQuestion] === undefined}
          >
            Check Answer
          </Button>
        ) : (
          <Button 
            className="flex-1" 
            onClick={handleNext}
            disabled={submitting}
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : currentQuestion < totalQuestions - 1 ? (
              <>Next <ChevronRight className="w-4 h-4 ml-1" /></>
            ) : (
              <>Complete Quiz <Sparkles className="w-4 h-4 ml-1" /></>
            )}
          </Button>
        )}
      </div>
    </Card>
  );
};
