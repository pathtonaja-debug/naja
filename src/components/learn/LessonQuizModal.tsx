import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, XCircle, Trophy, RefreshCw, ChevronRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import type { LessonQuizQuestion } from '@/hooks/useLessonProgress';

interface LessonQuizModalProps {
  moduleId: string;
  questions: LessonQuizQuestion[];
  onComplete: (passed: boolean) => void;
  onClose: () => void;
  onNextLesson?: () => void;
  hasNextLesson?: boolean;
  lessonTitle?: string;
}

export function LessonQuizModal({ moduleId, questions, onComplete, onClose, onNextLesson, hasNextLesson, lessonTitle }: LessonQuizModalProps) {
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
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-3 pb-safe">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />
      <motion.div
        initial={{ scale: 0.97, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.97, opacity: 0 }}
        className="relative w-full max-w-md max-h-[84vh] bg-background rounded-2xl shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div>
            <h3 className="font-semibold text-sm text-foreground">{t('learn.moduleQuiz')}</h3>
            <p className="text-xs text-muted-foreground capitalize">{moduleId.replace(/-/g, ' ')}</p>
          </div>
          <button onClick={handleClose} className="p-2 rounded-full hover:bg-muted transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {!quizComplete ? (
          <div className="px-4 py-4 space-y-4 overflow-y-auto max-h-[calc(84vh-52px)] pb-20">
            {/* Progress */}
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground">
                {currentQuestion + 1} {t('learn.of')} {questions.length}
              </span>
            </div>

            {/* Question */}
            <div>
              <p className="font-medium text-base mb-3 leading-snug">{question.question}</p>
              
              <div className="space-y-2">
                {question.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelectAnswer(index)}
                    disabled={showResult}
                    className={cn(
                      "w-full px-3 py-3 rounded-xl text-left transition-all border-2",
                      !showResult && selectedAnswer === index && "border-primary bg-primary/10",
                      !showResult && selectedAnswer !== index && "border-border hover:border-primary/50",
                      showResult && index === question.correctIndex && "border-success bg-success/10",
                      showResult && selectedAnswer === index && index !== question.correctIndex && "border-destructive bg-destructive/10",
                      showResult && selectedAnswer !== index && index !== question.correctIndex && "border-border opacity-50"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold",
                        !showResult && selectedAnswer === index && "bg-primary text-primary-foreground",
                        !showResult && selectedAnswer !== index && "bg-muted text-muted-foreground",
                        showResult && index === question.correctIndex && "bg-success text-white",
                        showResult && selectedAnswer === index && index !== question.correctIndex && "bg-destructive text-white"
                      )}>
                        {showResult && index === question.correctIndex ? (
                          <Check className="w-3.5 h-3.5" />
                        ) : showResult && selectedAnswer === index ? (
                          <XCircle className="w-3.5 h-3.5" />
                        ) : (
                          String.fromCharCode(65 + index)
                        )}
                      </div>
                      <span className="text-sm leading-snug">{option}</span>
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
                    "p-3 rounded-xl",
                    isCorrect ? "bg-success/10" : "bg-destructive/10"
                  )}
                >
                  <p className={cn(
                    "font-semibold mb-1 text-sm",
                    isCorrect ? "text-success" : "text-destructive"
                  )}>
                    {isCorrect ? t('learn.correct') : t('learn.incorrect')}
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {question.explanation}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Actions */}
            <div className="sticky bottom-0 -mx-4 px-4 py-3 bg-background/95 backdrop-blur border-t border-border/60">
              <div className="flex gap-3">
                {!showResult ? (
                  <Button 
                    onClick={handleCheckAnswer} 
                    disabled={selectedAnswer === null}
                    className="flex-1 h-10 text-sm"
                  >
                    {t('learn.checkAnswer')}
                  </Button>
                ) : (
                  <Button onClick={handleNext} className="flex-1 h-10 text-sm">
                    {currentQuestion < questions.length - 1 ? t('common.next') : t('common.done')}
                  </Button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center space-y-6">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 15 }}
              className={cn(
                "w-20 h-20 rounded-full flex items-center justify-center mx-auto",
                passed ? "bg-success/20" : "bg-destructive/20"
              )}
            >
              {passed ? (
                <Trophy className="w-10 h-10 text-success" />
              ) : (
                <XCircle className="w-10 h-10 text-destructive" />
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-xl font-bold mb-2">{t('learn.quizComplete')}</h3>
              {lessonTitle && (
                <p className="text-sm text-muted-foreground mb-2">{lessonTitle}</p>
              )}
              <p className="text-3xl font-bold mb-2">
                {displayCorrect}/{questions.length}
              </p>
              <p className="text-muted-foreground">
                {t('learn.yourScore')}: {Math.round((displayCorrect / questions.length) * 100)}%
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className={cn(
                "p-3 rounded-xl",
                passed ? "bg-success/10" : "bg-destructive/10"
              )}
            >
              <p className={cn(
                "font-medium flex items-center justify-center gap-2",
                passed ? "text-success" : "text-destructive"
              )}>
                {passed ? (
                  <>
                    <Sparkles className="w-4 h-4" />
                    {t('learn.lessonUnlocked')}
                  </>
                ) : (
                  t('learn.failed')
                )}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col gap-3"
            >
              {!passed && (
                <Button onClick={handleRetry} variant="outline" className="w-full">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  {t('learn.retryQuiz')}
                </Button>
              )}
              
              {passed && hasNextLesson && onNextLesson && (
                <Button onClick={onNextLesson} className="w-full">
                  {t('learn.nextLesson')}
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              )}
              
              <Button 
                onClick={handleClose} 
                variant={passed && hasNextLesson ? "outline" : "default"}
                className="w-full"
              >
                {passed ? t('learn.backToModule') : t('common.close')}
              </Button>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
