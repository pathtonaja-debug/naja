/**
 * Learn Content Generator Service
 * Generates lesson content and quizzes using AI
 * Implements caching and fallback to seed content
 */

import { supabase } from '@/integrations/supabase/client';
import {
  GeneratedLessonContent,
  GeneratedQuizQuestion,
  CONTENT_LIMITS,
  CONTENT_VERSION,
} from '@/data/learnContentModel';
import { LESSON_CONTENT, LessonContent } from '@/data/lessonContent';
import { MODULE_QUIZZES, LessonQuizQuestion } from '@/hooks/useLessonProgress';

const STORAGE_PREFIX = {
  LESSON: 'naja_learn_generated',
  QUIZ: 'naja_learn_quiz_generated',
};

// ========== Cache Helpers ==========

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

function getLessonCacheKey(lessonId: string, lang: string): string {
  return `${STORAGE_PREFIX.LESSON}_${lang}_v${CONTENT_VERSION}_${lessonId}`;
}

function getQuizCacheKey(moduleId: string, lang: string): string {
  return `${STORAGE_PREFIX.QUIZ}_${lang}_v${CONTENT_VERSION}_${moduleId}`;
}

function getCache<T>(key: string): CacheEntry<T> | null {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return null;
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

function setCache<T>(key: string, data: T): void {
  try {
    const entry: CacheEntry<T> = { data, timestamp: Date.now() };
    localStorage.setItem(key, JSON.stringify(entry));
  } catch {
    // Storage quota exceeded, try to clear old entries
    try {
      clearOldGeneratedContent();
      const entry: CacheEntry<T> = { data, timestamp: Date.now() };
      localStorage.setItem(key, JSON.stringify(entry));
    } catch {
      // ignore
    }
  }
}

function clearOldGeneratedContent(): void {
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith(STORAGE_PREFIX.LESSON) || key.startsWith(STORAGE_PREFIX.QUIZ))) {
        keysToRemove.push(key);
      }
    }
    // Remove half of the oldest entries
    keysToRemove.slice(0, Math.ceil(keysToRemove.length / 2)).forEach(k => localStorage.removeItem(k));
  } catch {
    // ignore
  }
}

// ========== Seed Content Conversion ==========

function seedToGeneratedLesson(seedContent: LessonContent, lang: 'en' | 'fr'): GeneratedLessonContent {
  return {
    id: seedContent.id,
    title: seedContent.title,
    sections: seedContent.sections,
    quiz: seedContent.quiz,
    lang,
    version: CONTENT_VERSION,
    generatedAt: new Date().toISOString(),
    source: 'seed',
  };
}

function seedQuizToGenerated(questions: LessonQuizQuestion[]): GeneratedQuizQuestion[] {
  return questions.map(q => ({
    question: q.question,
    options: q.options,
    correctIndex: q.correctIndex,
    explanation: q.explanation,
  }));
}

// ========== Content Safety ==========

// Note: We rely mainly on the AI system prompt for content safety.
// This is a minimal client-side check for extreme cases only.
const EXTREME_FORBIDDEN_TERMS = [
  'kill all', 'death to', 'destroy all',
];

function isContentSafe(text: string): boolean {
  if (!text) return true;
  const lowerText = text.toLowerCase();
  return !EXTREME_FORBIDDEN_TERMS.some(term => lowerText.includes(term));
}

function sanitizeContent(content: string, maxLength: number): string {
  if (!content) return '';
  
  // Truncate if too long
  let text = content.slice(0, maxLength);
  
  // Check for extreme content
  if (!isContentSafe(text)) {
    return ''; // Return empty to trigger fallback
  }
  
  return text.trim();
}

// ========== AI Generation ==========

async function callAIGeneration(prompt: string): Promise<string | null> {
  try {
    const { data, error } = await supabase.functions.invoke('generate-learn-content', {
      body: { prompt },
    });
    
    if (error) {
      console.warn('AI generation error:', error);
      return null;
    }
    
    return data?.content || null;
  } catch (err) {
    console.warn('AI generation failed:', err);
    return null;
  }
}

/**
 * Generate lesson content using AI
 */
export async function generateLessonContent(
  lessonId: string,
  lessonTitle: string,
  moduleTitle: string,
  lang: 'en' | 'fr'
): Promise<GeneratedLessonContent | null> {
  const cacheKey = getLessonCacheKey(lessonId, lang);
  
  // Check cache first
  const cached = getCache<GeneratedLessonContent>(cacheKey);
  if (cached && cached.data.source === 'ai') {
    return cached.data;
  }
  
  // Check if we have seed content as fallback
  const seedContent = LESSON_CONTENT[lessonId];
  
  // Build the prompt based on language
  const userPrompt = lang === 'fr'
    ? `Crée une leçon sur "${lessonTitle}" (module: ${moduleTitle}).
Format JSON strict:
{
  "sections": [
    {"heading": "Titre", "content": "Contenu (max 700 caractères)", "keyPoints": ["Point 1", "Point 2", "Point 3"]}
  ],
  "quiz": {"question": "Question?", "options": ["A","B","C","D"], "correctIndex": 0, "explanation": "Explication (max 220 caractères)"}
}
Règles: Contenu islamique mainstream, pas de politique, pas de sectarisme, éducatif et respectueux. 3-5 points clés. Répondez en JSON pur uniquement.`
    : `Create a lesson about "${lessonTitle}" (module: ${moduleTitle}).
Strict JSON format:
{
  "sections": [
    {"heading": "Title", "content": "Content (max 700 chars)", "keyPoints": ["Point 1", "Point 2", "Point 3"]}
  ],
  "quiz": {"question": "Question?", "options": ["A","B","C","D"], "correctIndex": 0, "explanation": "Explanation (max 220 chars)"}
}
Rules: Mainstream Islamic content, no politics, no sectarianism, educational and respectful. 3-5 key points. Respond with pure JSON only.`;

  try {
    const response = await callAIGeneration(userPrompt);
    
    if (response) {
      // Try to parse JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        
        // Validate and sanitize
        if (parsed.sections && Array.isArray(parsed.sections) && parsed.quiz) {
          const sanitizedSections = parsed.sections.map((s: { heading?: string; content?: string; keyPoints?: string[] }) => ({
            heading: sanitizeContent(s.heading || '', 100) || 'Section',
            content: sanitizeContent(s.content || '', CONTENT_LIMITS.SECTION_CONTENT_MAX_CHARS) || '',
            keyPoints: (s.keyPoints || [])
              .slice(0, CONTENT_LIMITS.KEY_POINTS_MAX)
              .map((p: string) => sanitizeContent(p, 150))
              .filter(Boolean),
          })).filter((s: { content: string }) => s.content);
          
          if (sanitizedSections.length > 0) {
            const result: GeneratedLessonContent = {
              id: lessonId,
              title: lessonTitle,
              sections: sanitizedSections,
              quiz: {
                question: sanitizeContent(parsed.quiz.question || '', 200) || 'Question',
                options: (parsed.quiz.options || ['A', 'B', 'C', 'D']).slice(0, 4),
                correctIndex: Math.min(3, Math.max(0, parsed.quiz.correctIndex || 0)),
                explanation: sanitizeContent(parsed.quiz.explanation || '', CONTENT_LIMITS.QUIZ_EXPLANATION_MAX_CHARS) || '',
              },
              lang,
              version: CONTENT_VERSION,
              generatedAt: new Date().toISOString(),
              source: 'ai',
            };
            
            setCache(cacheKey, result);
            return result;
          }
        }
      }
    }
  } catch (err) {
    console.warn('Failed to generate lesson content:', err);
  }
  
  // Fallback to seed content
  if (seedContent) {
    const fallback = seedToGeneratedLesson(seedContent, lang);
    setCache(cacheKey, fallback);
    return fallback;
  }
  
  return null;
}

/**
 * Generate module quiz using AI
 */
export async function generateModuleQuiz(
  moduleId: string,
  moduleTitle: string,
  lessonSummaries: string[],
  lang: 'en' | 'fr'
): Promise<GeneratedQuizQuestion[] | null> {
  const cacheKey = getQuizCacheKey(moduleId, lang);
  
  // Check cache first
  const cached = getCache<{ questions: GeneratedQuizQuestion[]; source: string }>(cacheKey);
  if (cached && cached.data.source === 'ai') {
    return cached.data.questions;
  }
  
  // Check seed content
  const seedQuiz = MODULE_QUIZZES[moduleId];
  
  const userPrompt = lang === 'fr'
    ? `Crée un quiz de 5 questions sur "${moduleTitle}".
Leçons couvertes: ${lessonSummaries.join(', ')}
Format JSON strict: {"questions": [{"question": "Question?", "options": ["A","B","C","D"], "correctIndex": 0, "explanation": "Max 220 caractères."}]}
5 questions, contenu éducatif islamique mainstream. Répondez en JSON pur uniquement.`
    : `Create a 5-question quiz about "${moduleTitle}".
Lessons covered: ${lessonSummaries.join(', ')}
Strict JSON format: {"questions": [{"question": "Question?", "options": ["A","B","C","D"], "correctIndex": 0, "explanation": "Max 220 chars"}]}
5 questions, mainstream Islamic educational content. Respond with pure JSON only.`;

  try {
    const response = await callAIGeneration(userPrompt);
    
    if (response) {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        
        if (parsed.questions && Array.isArray(parsed.questions)) {
          const sanitizedQuestions = parsed.questions
            .slice(0, CONTENT_LIMITS.MODULE_QUIZ_QUESTIONS)
            .map((q: { question?: string; options?: string[]; correctIndex?: number; explanation?: string }) => ({
              question: sanitizeContent(q.question || '', 200) || 'Question',
              options: (q.options || ['A', 'B', 'C', 'D']).slice(0, 4),
              correctIndex: Math.min(3, Math.max(0, q.correctIndex || 0)),
              explanation: sanitizeContent(q.explanation || '', CONTENT_LIMITS.QUIZ_EXPLANATION_MAX_CHARS) || '',
            }))
            .filter((q: { question: string }) => isContentSafe(q.question));
          
          if (sanitizedQuestions.length >= 3) {
            setCache(cacheKey, { questions: sanitizedQuestions, source: 'ai' });
            return sanitizedQuestions;
          }
        }
      }
    }
  } catch (err) {
    console.warn('Failed to generate module quiz:', err);
  }
  
  // Fallback to seed
  if (seedQuiz) {
    const fallback = seedQuizToGenerated(seedQuiz);
    setCache(cacheKey, { questions: fallback, source: 'seed' });
    return fallback;
  }
  
  return null;
}

/**
 * Get lesson content (cached or seed)
 */
export function getLessonContent(lessonId: string, lang: 'en' | 'fr'): GeneratedLessonContent | null {
  const cacheKey = getLessonCacheKey(lessonId, lang);
  
  // Try cache
  const cached = getCache<GeneratedLessonContent>(cacheKey);
  if (cached) return cached.data;
  
  // Try seed
  const seedContent = LESSON_CONTENT[lessonId];
  if (seedContent) {
    return seedToGeneratedLesson(seedContent, lang);
  }
  
  return null;
}

/**
 * Get module quiz (cached or seed)
 */
export function getModuleQuiz(moduleId: string, lang: 'en' | 'fr'): GeneratedQuizQuestion[] | null {
  const cacheKey = getQuizCacheKey(moduleId, lang);
  
  // Try cache
  const cached = getCache<{ questions: GeneratedQuizQuestion[] }>(cacheKey);
  if (cached) return cached.data.questions;
  
  // Try seed
  const seedQuiz = MODULE_QUIZZES[moduleId];
  if (seedQuiz) {
    return seedQuizToGenerated(seedQuiz);
  }
  
  return null;
}

/**
 * Refresh content for a lesson (regenerate from AI)
 */
export async function refreshLessonContent(
  lessonId: string,
  lessonTitle: string,
  moduleTitle: string,
  lang: 'en' | 'fr'
): Promise<GeneratedLessonContent | null> {
  // Clear cache first
  const cacheKey = getLessonCacheKey(lessonId, lang);
  try {
    localStorage.removeItem(cacheKey);
  } catch {
    // ignore
  }
  
  // Generate fresh
  return generateLessonContent(lessonId, lessonTitle, moduleTitle, lang);
}
