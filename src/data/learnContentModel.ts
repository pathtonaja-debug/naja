/**
 * Learn Content Model
 * Defines types for generated lesson content
 */

export interface GeneratedLessonSection {
  heading: string;
  content: string;
  keyPoints?: string[];
}

export interface GeneratedLessonContent {
  id: string;
  title: string;
  sections: GeneratedLessonSection[];
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  // Metadata
  lang: 'en' | 'fr';
  version: string;
  generatedAt: string;
  source: 'ai' | 'seed';
}

export interface GeneratedQuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface GeneratedModuleQuiz {
  moduleId: string;
  questions: GeneratedQuizQuestion[];
  lang: 'en' | 'fr';
  version: string;
  generatedAt: string;
  source: 'ai' | 'seed';
}

// Limits for content generation
export const CONTENT_LIMITS = {
  SECTION_CONTENT_MAX_CHARS: 700,
  KEY_POINTS_MIN: 3,
  KEY_POINTS_MAX: 5,
  QUIZ_EXPLANATION_MAX_CHARS: 220,
  QUIZ_OPTIONS_COUNT: 4,
  MODULE_QUIZ_QUESTIONS: 5,
};

// Content version
export const CONTENT_VERSION = 'v1';
