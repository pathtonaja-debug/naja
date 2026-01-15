import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { getTodayQuizAttempt, addQuizAttempt, addBarakahPoints, BARAKAH_REWARDS, getCompletedQuizIds } from '@/services/localStore';
import { QUIZZES, getNextQuizId, Quiz, QuizQuestion } from '@/data/quizData';

export interface QuizAttempt {
  id: string;
  quiz_id: number;
  quiz_date: string;
  score: number;
  total_questions: number;
  answers: number[];
  points_earned: number;
  completed_at: string;
}

interface LocalizedQuiz {
  id: number;
  difficulty: 'easy' | 'intermediate' | 'difficult';
  questions: QuizQuestion[];
}

export const useDailyQuiz = () => {
  const { i18n } = useTranslation();
  const [quiz, setQuiz] = useState<LocalizedQuiz | null>(null);
  const [attempt, setAttempt] = useState<QuizAttempt | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuiz = useCallback(() => {
    try {
      setLoading(true);
      setError(null);

      // Check local storage for today's attempt
      const localAttempt = getTodayQuizAttempt();
      if (localAttempt) {
        setAttempt(localAttempt as QuizAttempt);
      }

      // Get next quiz based on completed quizzes
      const completedIds = getCompletedQuizIds();
      const nextQuizId = getNextQuizId(completedIds);
      const quizData = QUIZZES.find(q => q.id === nextQuizId);

      if (quizData) {
        // Get language-specific questions
        const lang = i18n.language === 'fr' ? 'fr' : 'en';
        setQuiz({
          id: quizData.id,
          difficulty: quizData.difficulty,
          questions: quizData.questions[lang]
        });
      } else {
        setError('Quiz unavailable');
      }
    } catch (err) {
      console.error('Failed to fetch quiz:', err);
      setError(err instanceof Error ? err.message : 'Failed to load quiz');
    } finally {
      setLoading(false);
    }
  }, [i18n.language]);

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
        quiz_id: quiz.id,
        quiz_date: today,
        score,
        total_questions: quiz.questions.length,
        answers,
        points_earned: pointsEarned,
      });

      setAttempt(newAttempt as QuizAttempt);

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
    generating: false, // No longer generating via AI
    error,
    hasCompletedToday,
    submitQuiz,
    refetch: fetchQuiz
  };
};
