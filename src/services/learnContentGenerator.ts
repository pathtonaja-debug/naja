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

const STORAGE_KEYS = {
  LESSON_CACHE: 'naja_learn_generated',
  QUIZ_CACHE: 'naja_learn_quiz_generated',
};

// ========== Cache Helpers ==========

function getLessonCacheKey(lessonId: string, lang: string): string {
  return `${STORAGE_KEYS.LESSON_CACHE}_${lang}_${CONTENT_VERSION}_${lessonId}`;
}

function getQuizCacheKey(moduleId: string, lang: string): string {
  return `${STORAGE_KEYS.QUIZ_CACHE}_${lang}_${CONTENT_VERSION}_${moduleId}`;
}

function getCached<T>(key: string): T | null {
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
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // Storage quota exceeded, clear old entries
    try {
      clearOldGeneratedContent();
      localStorage.setItem(key, JSON.stringify(data));
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
      if (key && (key.startsWith(STORAGE_KEYS.LESSON_CACHE) || key.startsWith(STORAGE_KEYS.QUIZ_CACHE))) {
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

const FORBIDDEN_TERMS = [
  'takfir', 'kafir', 'infidel', 'apostate',
  'sect', 'sectarian', 'shia', 'sunni', 'wahabi', 'salafi',
  'political', 'vote', 'election', 'government',
  'violence', 'jihad war', 'attack', 'kill',
];

function isContentSafe(text: string): boolean {
  const lowerText = text.toLowerCase();
  return !FORBIDDEN_TERMS.some(term => lowerText.includes(term));
}

function sanitizeContent(content: string, maxLength: number): string {
  // Truncate if too long
  let text = content.slice(0, maxLength);
  
  // Remove any potentially problematic content
  if (!isContentSafe(text)) {
    return ''; // Return empty to trigger fallback
  }
  
  return text;
}

// ========== AI Generation ==========

interface GenerationPrompt {
  lessonId: string;
  lessonTitle: string;
  moduleTitle: string;
  lang: 'en' | 'fr';
}

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
  const cached = getCached<GeneratedLessonContent>(cacheKey);
  if (cached && cached.source === 'ai') {
    return cached;
  }
  
  // Check if we have seed content as fallback
  const seedContent = LESSON_CONTENT[lessonId];
  
  // Build the prompt
  const systemPrompt = lang === 'fr' 
    ? `Tu es un éducateur islamique bienveillant. Génère du contenu éducatif sur l'Islam.`
    : `You are a kind Islamic educator. Generate educational content about Islam.`;
  
  const userPrompt = lang === 'fr'
    ? `Crée une leçon sur "${lessonTitle}" (module: ${moduleTitle}).
Format JSON:
{
  "sections": [
    {"heading": "Titre", "content": "Contenu (max 700 car.)", "keyPoints": ["Point 1", "Point 2", "Point 3"]}
  ],
  "quiz": {"question": "?", "options": ["A","B","C","D"], "correctIndex": 0, "explanation": "Explication (max 220 car.)"}
}
Règles: Contenu mainstream, pas de politique, pas de sectarisme, éducatif et respectueux.`
    : `Create a lesson about "${lessonTitle}" (module: ${moduleTitle}).
JSON format:
{
  "sections": [
    {"heading": "Title", "content": "Content (max 700 chars)", "keyPoints": ["Point 1", "Point 2", "Point 3"]}
  ],
  "quiz": {"question": "?", "options": ["A","B","C","D"], "correctIndex": 0, "explanation": "Explanation (max 220 chars)"}
}
Rules: Mainstream content, no politics, no sectarianism, educational and respectful.`;

  const fullPrompt = `${systemPrompt}\n\n${userPrompt}`;
  
  try {
    const response = await callAIGeneration(fullPrompt);
    
    if (response) {
      // Try to parse JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        
        // Validate and sanitize
        if (parsed.sections && Array.isArray(parsed.sections) && parsed.quiz) {
          const sanitizedSections = parsed.sections.map((s: any) => ({
            heading: sanitizeContent(s.heading || '', 100) || 'Section',
            content: sanitizeContent(s.content || '', CONTENT_LIMITS.SECTION_CONTENT_MAX_CHARS) || '',
            keyPoints: (s.keyPoints || [])
              .slice(0, CONTENT_LIMITS.KEY_POINTS_MAX)
              .map((p: string) => sanitizeContent(p, 150))
              .filter(Boolean),
          })).filter((s: any) => s.content);
          
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
  const cached = getCached<{ questions: GeneratedQuizQuestion[]; source: string }>(cacheKey);
  if (cached && cached.source === 'ai') {
    return cached.questions;
  }
  
  // Check seed content
  const seedQuiz = MODULE_QUIZZES[moduleId];
  
  const systemPrompt = lang === 'fr'
    ? `Tu es un éducateur islamique. Génère un quiz de 5 questions.`
    : `You are an Islamic educator. Generate a 5-question quiz.`;
    
  const userPrompt = lang === 'fr'
    ? `Crée un quiz sur "${moduleTitle}".
Leçons couvertes: ${lessonSummaries.join(', ')}
Format JSON: {"questions": [{"question": "?", "options": ["A","B","C","D"], "correctIndex": 0, "explanation": "Max 220 car."}]}
5 questions, contenu éducatif mainstream.`
    : `Create a quiz about "${moduleTitle}".
Lessons covered: ${lessonSummaries.join(', ')}
JSON format: {"questions": [{"question": "?", "options": ["A","B","C","D"], "correctIndex": 0, "explanation": "Max 220 chars"}]}
5 questions, mainstream educational content.`;

  try {
    const response = await callAIGeneration(`${systemPrompt}\n\n${userPrompt}`);
    
    if (response) {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        
        if (parsed.questions && Array.isArray(parsed.questions)) {
          const sanitizedQuestions = parsed.questions
            .slice(0, CONTENT_LIMITS.MODULE_QUIZ_QUESTIONS)
            .map((q: any) => ({
              question: sanitizeContent(q.question || '', 200) || 'Question',
              options: (q.options || ['A', 'B', 'C', 'D']).slice(0, 4),
              correctIndex: Math.min(3, Math.max(0, q.correctIndex || 0)),
              explanation: sanitizeContent(q.explanation || '', CONTENT_LIMITS.QUIZ_EXPLANATION_MAX_CHARS) || '',
            }))
            .filter((q: any) => isContentSafe(q.question));
          
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
  const cached = getCached<GeneratedLessonContent>(cacheKey);
  if (cached) return cached;
  
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
  const cached = getCached<{ questions: GeneratedQuizQuestion[] }>(cacheKey);
  if (cached) return cached.questions;
  
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
