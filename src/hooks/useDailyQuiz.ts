import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getAuthenticatedUserId } from '@/lib/auth';

interface QuizQuestion {
  question: string;
  options: string[];
  correct_index: number;
  explanation: string;
}

interface DailyQuiz {
  id: string;
  quiz_date: string;
  topic: string;
  questions: QuizQuestion[];
}

interface QuizAttempt {
  id: string;
  quiz_id: string;
  score: number;
  total_questions: number;
  answers: number[];
  xp_earned: number;
  completed_at: string;
}

export const useDailyQuiz = () => {
  const [quiz, setQuiz] = useState<DailyQuiz | null>(null);
  const [attempt, setAttempt] = useState<QuizAttempt | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuiz = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const today = new Date().toISOString().split('T')[0];
      const userId = await getAuthenticatedUserId();

      // Check if quiz exists for today
      let { data: existingQuiz, error: quizError } = await supabase
        .from('daily_quizzes')
        .select('*')
        .eq('quiz_date', today)
        .single();

      if (quizError && quizError.code !== 'PGRST116') {
        throw quizError;
      }

      if (!existingQuiz) {
        // Generate new quiz via edge function
        setGenerating(true);
        const { data: funcData, error: funcError } = await supabase.functions.invoke('daily-quiz');
        
        if (funcError) {
          throw new Error(funcError.message || 'Failed to generate quiz');
        }
        
        if (funcData?.error) {
          throw new Error(funcData.error);
        }
        
        existingQuiz = funcData;
        setGenerating(false);
      }

      if (existingQuiz) {
        // Parse questions if it's a string
        const questions = typeof existingQuiz.questions === 'string' 
          ? JSON.parse(existingQuiz.questions) 
          : existingQuiz.questions;
        
        setQuiz({
          ...existingQuiz,
          questions
        });

        // Check if user has already attempted this quiz
        const { data: existingAttempt } = await supabase
          .from('quiz_attempts')
          .select('*')
          .eq('user_id', userId)
          .eq('quiz_id', existingQuiz.id)
          .single();

        if (existingAttempt) {
          const answers = typeof existingAttempt.answers === 'string'
            ? JSON.parse(existingAttempt.answers)
            : existingAttempt.answers;
          setAttempt({ ...existingAttempt, answers });
        }
      }
    } catch (err) {
      console.error('Failed to fetch quiz:', err);
      setError(err instanceof Error ? err.message : 'Failed to load quiz');
    } finally {
      setLoading(false);
      setGenerating(false);
    }
  }, []);

  useEffect(() => {
    fetchQuiz();
  }, [fetchQuiz]);

  const submitQuiz = async (answers: number[]): Promise<{ score: number; xpEarned: number } | null> => {
    if (!quiz) return null;

    try {
      const userId = await getAuthenticatedUserId();
      
      // Calculate score
      let score = 0;
      quiz.questions.forEach((q, i) => {
        if (answers[i] === q.correct_index) {
          score++;
        }
      });

      // Calculate XP: 25 per correct answer + 50 bonus for perfect score
      const baseXP = score * 25;
      const perfectBonus = score === quiz.questions.length ? 50 : 0;
      const xpEarned = baseXP + perfectBonus;

      // Save attempt
      const { data: newAttempt, error: attemptError } = await supabase
        .from('quiz_attempts')
        .insert({
          user_id: userId,
          quiz_id: quiz.id,
          score,
          total_questions: quiz.questions.length,
          answers,
          xp_earned: xpEarned
        })
        .select()
        .single();

      if (attemptError) {
        if (attemptError.code === '23505') {
          // Already submitted
          return null;
        }
        throw attemptError;
      }

      setAttempt({
        ...newAttempt,
        answers
      });

      return { score, xpEarned };
    } catch (err) {
      console.error('Failed to submit quiz:', err);
      return null;
    }
  };

  const hasCompletedToday = !!attempt;

  return {
    quiz,
    attempt,
    loading,
    generating,
    error,
    hasCompletedToday,
    submitQuiz,
    refetch: fetchQuiz
  };
};
