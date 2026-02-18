/**
 * Local storage service for tracking story read status & quiz scores.
 * Keys: naja_story_read, naja_story_quiz
 */

const READ_KEY = 'naja_story_read';
const QUIZ_KEY = 'naja_story_quiz';

export interface StoryQuizResult {
  score: number; // 0-3
  completedAt: string; // ISO date
}

// ── Read status ──

export function getReadStories(): Set<string> {
  try {
    const raw = localStorage.getItem(READ_KEY);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw) as string[]);
  } catch {
    return new Set();
  }
}

export function markStoryRead(storyId: string): void {
  const read = getReadStories();
  read.add(storyId);
  localStorage.setItem(READ_KEY, JSON.stringify([...read]));
}

export function isStoryRead(storyId: string): boolean {
  return getReadStories().has(storyId);
}

// ── Quiz results ──

export function getQuizResults(): Record<string, StoryQuizResult> {
  try {
    const raw = localStorage.getItem(QUIZ_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export function saveQuizResult(storyId: string, score: number): void {
  const results = getQuizResults();
  results[storyId] = { score, completedAt: new Date().toISOString() };
  localStorage.setItem(QUIZ_KEY, JSON.stringify(results));
}

export function getQuizResult(storyId: string): StoryQuizResult | null {
  return getQuizResults()[storyId] ?? null;
}

export function getStoriesProgress(): { read: number; quizzed: number; totalScore: number } {
  const read = getReadStories().size;
  const results = getQuizResults();
  const entries = Object.values(results);
  return {
    read,
    quizzed: entries.length,
    totalScore: entries.reduce((sum, r) => sum + r.score, 0),
  };
}
