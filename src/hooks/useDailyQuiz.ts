import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getTodayQuizAttempt, addQuizAttempt, addBarakahPoints, BARAKAH_REWARDS } from '@/services/localStore';

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

export interface QuizAttempt {
  id: string;
  quiz_date: string;
  score: number;
  total_questions: number;
  answers: number[];
  points_earned: number;
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

      // Check local storage for today's attempt first
      const localAttempt = getTodayQuizAttempt();
      if (localAttempt) {
        setAttempt(localAttempt);
      }

      // Try to fetch quiz from Supabase (public read)
      let { data: existingQuiz, error: quizError } = await supabase
        .from('daily_quizzes')
        .select('*')
        .eq('quiz_date', today)
        .single();

      if (quizError && quizError.code !== 'PGRST116') {
        console.error('Quiz fetch error:', quizError);
      }

      if (!existingQuiz) {
        // Try to generate new quiz via edge function
        setGenerating(true);
        try {
          const { data: funcData, error: funcError } = await supabase.functions.invoke('daily-quiz');
          
          if (funcError) {
            throw new Error(funcError.message || 'Failed to generate quiz');
          }
          
          if (funcData?.error) {
            throw new Error(funcData.error);
          }
          
          existingQuiz = funcData;
        } catch (genError) {
          console.error('Quiz generation failed:', genError);
          setError('Quiz unavailable. Please try again later.');
          return;
        }
        setGenerating(false);
      }

      if (existingQuiz) {
        const questions = typeof existingQuiz.questions === 'string' 
          ? JSON.parse(existingQuiz.questions) 
          : existingQuiz.questions;
        
        setQuiz({
          ...existingQuiz,
          questions
        });
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

  const submitQuiz = async (answers: number[]): Promise<{ score: number; pointsEarned: number } | null> => {
    if (!quiz) return null;

    try {
      // Calculate score
      let score = 0;
      quiz.questions.forEach((q, i) => {
        if (answers[i] === q.correct_index) {
          score++;
        }
      });

      // Calculate points
      const basePoints = score * BARAKAH_REWARDS.QUIZ_CORRECT_ANSWER;
      const perfectBonus = score === quiz.questions.length ? BARAKAH_REWARDS.QUIZ_PERFECT_SCORE : 0;
      const pointsEarned = basePoints + perfectBonus;

      // Save attempt locally
      const today = new Date().toISOString().split('T')[0];
      const newAttempt = addQuizAttempt({
        quiz_date: today,
        score,
        total_questions: quiz.questions.length,
        answers,
        points_earned: pointsEarned,
      });

      setAttempt(newAttempt);

      // Award points
      addBarakahPoints(pointsEarned);

      return { score, pointsEarned };
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
