import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, XCircle, Trophy, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import type { LessonQuizQuestion } from '@/hooks/useLessonProgress';

interface LessonQuizModalProps {
  moduleId: string;
  questions: LessonQuizQuestion[];
  onComplete: (passed: boolean) => void;
  onClose: () => void;
}

export function LessonQuizModal({ moduleId, questions, onComplete, onClose }: LessonQuizModalProps) {
  const { t } = useTranslation();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);

  const question = questions[currentQuestion];
  const isCorrect = selectedAnswer === question?.correctIndex;
  const passThreshold = 0.7;
  // Use finalCorrectCount for display after quiz completion
  const [finalCorrectCount, setFinalCorrectCount] = useState<number | null>(null);
  const displayCorrect = finalCorrectCount !== null ? finalCorrectCount : correctAnswers;
  const passed = displayCorrect / questions.length >= passThreshold;

  const handleSelectAnswer = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
  };

  const handleCheckAnswer = () => {
    if (selectedAnswer === null) return;
    
    if (selectedAnswer === question.correctIndex) {
      setCorrectAnswers(prev => prev + 1);
    }
    setShowResult(true);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      // Check if passed - calculate correct count including current question
      const finalCorrect = isCorrect ? correctAnswers + 1 : correctAnswers;
      setFinalCorrectCount(finalCorrect);
      setQuizComplete(true);
      const didPass = finalCorrect / questions.length >= passThreshold;
      onComplete(didPass);
    }
  };

  const handleRetry = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setCorrectAnswers(0);
    setQuizComplete(false);
    setFinalCorrectCount(null);
  };

  const handleClose = () => {
    handleRetry();
    onClose();
  };

  // Always render when mounted (parent controls visibility)
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative w-full max-w-lg bg-background rounded-2xl shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h3 className="font-semibold text-foreground">{t('learn.moduleQuiz')}</h3>
            <p className="text-sm text-muted-foreground capitalize">{moduleId.replace(/-/g, ' ')}</p>
          </div>
          <button onClick={handleClose} className="p-2 rounded-full hover:bg-muted transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {!quizComplete ? (
          <div className="p-6 space-y-6">
            {/* Progress */}
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                />
              </div>
              <span className="text-sm text-muted-foreground">
                {currentQuestion + 1} {t('learn.of')} {questions.length}
              </span>
            </div>

            {/* Question */}
            <div>
              <p className="font-medium text-lg mb-4">{question.question}</p>
              
              <div className="space-y-2">
                {question.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelectAnswer(index)}
                    disabled={showResult}
                    className={cn(
                      "w-full p-4 rounded-xl text-left transition-all border-2",
                      !showResult && selectedAnswer === index && "border-primary bg-primary/10",
                      !showResult && selectedAnswer !== index && "border-border hover:border-primary/50",
                      showResult && index === question.correctIndex && "border-success bg-success/10",
                      showResult && selectedAnswer === index && index !== question.correctIndex && "border-destructive bg-destructive/10",
                      showResult && selectedAnswer !== index && index !== question.correctIndex && "border-border opacity-50"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                        !showResult && selectedAnswer === index && "bg-primary text-primary-foreground",
                        !showResult && selectedAnswer !== index && "bg-muted text-muted-foreground",
                        showResult && index === question.correctIndex && "bg-success text-white",
                        showResult && selectedAnswer === index && index !== question.correctIndex && "bg-destructive text-white"
                      )}>
                        {showResult && index === question.correctIndex ? (
                          <Check className="w-4 h-4" />
                        ) : showResult && selectedAnswer === index ? (
                          <XCircle className="w-4 h-4" />
                        ) : (
                          String.fromCharCode(65 + index)
                        )}
                      </div>
                      <span>{option}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Explanation */}
            <AnimatePresence>
              {showResult && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className={cn(
                    "p-4 rounded-xl",
                    isCorrect ? "bg-success/10" : "bg-destructive/10"
                  )}
                >
                  <p className={cn(
                    "font-semibold mb-1",
                    isCorrect ? "text-success" : "text-destructive"
                  )}>
                    {isCorrect ? t('learn.correct') : t('learn.incorrect')}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {question.explanation}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Actions */}
            <div className="flex gap-3">
              {!showResult ? (
                <Button 
                  onClick={handleCheckAnswer} 
                  disabled={selectedAnswer === null}
                  className="flex-1"
                >
                  {t('learn.checkAnswer')}
                </Button>
              ) : (
                <Button onClick={handleNext} className="flex-1">
                  {currentQuestion < questions.length - 1 ? t('common.next') : t('common.done')}
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="p-6 text-center space-y-6">
            <div className={cn(
              "w-20 h-20 rounded-full flex items-center justify-center mx-auto",
              passed ? "bg-success/20" : "bg-destructive/20"
            )}>
              {passed ? (
                <Trophy className="w-10 h-10 text-success" />
              ) : (
                <XCircle className="w-10 h-10 text-destructive" />
              )}
            </div>

            <div>
              <h3 className="text-xl font-bold mb-2">{t('learn.quizComplete')}</h3>
              <p className="text-3xl font-bold mb-2">
                {displayCorrect}/{questions.length}
              </p>
              <p className="text-muted-foreground">
                {t('learn.yourScore')}: {Math.round((displayCorrect / questions.length) * 100)}%
              </p>
            </div>

            <p className={cn(
              "font-medium",
              passed ? "text-success" : "text-destructive"
            )}>
              {passed ? t('learn.passed') : t('learn.failed')}
            </p>

            <div className="flex gap-3">
              {!passed && (
                <Button onClick={handleRetry} variant="outline" className="flex-1">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  {t('learn.retryQuiz')}
                </Button>
              )}
              <Button onClick={handleClose} className="flex-1">
                {t('common.close')}
              </Button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
