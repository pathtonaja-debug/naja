import { motion } from 'framer-motion';
import { Brain, ChevronRight, Clock, Sparkles } from 'lucide-react';
import { useDailyQuiz } from '@/hooks/useDailyQuiz';
import { cn } from '@/lib/utils';

interface QuickQuizWidgetProps {
  onStartQuiz: () => void;
}

export const QuickQuizWidget = ({ onStartQuiz }: QuickQuizWidgetProps) => {
  const { quiz, loading, hasCompletedToday } = useDailyQuiz();

  if (loading) {
    return (
      <div className="p-4 rounded-2xl bg-semantic-lavender-soft border border-border/30 animate-pulse">
        <div className="h-12" />
      </div>
    );
  }

  if (hasCompletedToday) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 rounded-2xl bg-semantic-green-soft border border-border/30"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-semantic-green-dark flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-sm text-foreground">Quiz Complete!</h3>
            <p className="text-xs text-muted-foreground">Come back tomorrow for a new challenge</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={{ scale: 0.98 }}
      onClick={onStartQuiz}
      className="w-full p-4 rounded-2xl bg-semantic-lavender-soft border border-border/30 text-left"
    >
      <div className="flex items-center gap-3">
        <motion.div 
          className="w-12 h-12 rounded-xl bg-semantic-lavender-dark flex items-center justify-center"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Brain className="w-6 h-6 text-white" />
        </motion.div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-sm text-foreground">Daily Quiz</h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-semantic-lavender-soft text-semantic-lavender-dark border border-semantic-lavender-dark/20">
              +50 Barakah
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Islamic Knowledge • 4 questions
          </p>
        </div>
        <div className="flex items-center gap-1 text-semantic-lavender-dark">
          <Clock className="w-4 h-4" />
          <ChevronRight className="w-5 h-5" />
        </div>
      </div>
    </motion.button>
  );
};
