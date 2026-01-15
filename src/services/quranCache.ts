/**
 * Quran Content Cache Service
 * Local-first caching with TTL support
 */

import { AppChapter, AppVerse, ChapterInfo, ResourceInfo } from './quranApi';

// Cache keys
const CACHE_KEYS = {
  CHAPTERS: 'naja_quran_chapters_v1',
  CHAPTER_INFO: (id: number) => `naja_quran_chapterInfo_${id}_v1`,
  VERSES: (chapterId: number, translationId: number) => 
    `naja_quran_verses_${chapterId}_${translationId}_v1`,
  TRANSLATIONS_INDEX: 'naja_quran_resources_translations_v1',
  TAFSIRS_INDEX: 'naja_quran_resources_tafsirs_v1',
  VERSE_TAFSIR: (verseKey: string, tafsirId: number) =>
    `naja_quran_tafsir_${verseKey.replace(':', '_')}_${tafsirId}_v1`,
  FRENCH_TAFSIR: (verseKey: string) =>
    `naja_tafsir_fr_${verseKey.replace(':', '_')}_v1`,
} as const;

// TTL defaults (in milliseconds)
const TTL = {
  RESOURCES_INDEX: 30 * 24 * 60 * 60 * 1000, // 30 days
  CHAPTERS: 30 * 24 * 60 * 60 * 1000, // 30 days
  CHAPTER_INFO: 30 * 24 * 60 * 60 * 1000, // 30 days
  VERSES: 7 * 24 * 60 * 60 * 1000, // 7 days
  TAFSIR: 30 * 24 * 60 * 60 * 1000, // 30 days
};

interface CacheEntry<T> {
  cachedAt: number;
  ttlMs: number;
  data: T;
}

function getCache<T>(key: string): T | null {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return null;

    const entry: CacheEntry<T> = JSON.parse(stored);
    const now = Date.now();

    // Check if expired
    if (now - entry.cachedAt > entry.ttlMs) {
      return null; // Expired, but don't delete yet (stale-while-revalidate)
    }

    return entry.data;
  } catch {
    return null;
  }
}

function setCache<T>(key: string, data: T, ttlMs: number): void {
  try {
    const entry: CacheEntry<T> = {
      cachedAt: Date.now(),
      ttlMs,
      data,
    };
    localStorage.setItem(key, JSON.stringify(entry));
  } catch (error) {
    // Storage might be full, silently fail
    console.warn('Failed to cache Quran data:', error);
  }
}

function getStaleCache<T>(key: string): T | null {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return null;

    const entry: CacheEntry<T> = JSON.parse(stored);
    return entry.data;
  } catch {
    return null;
  }
}

function isCacheStale(key: string): boolean {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return true;

    const entry: CacheEntry<unknown> = JSON.parse(stored);
    return Date.now() - entry.cachedAt > entry.ttlMs;
  } catch {
    return true;
  }
}

// Public API

export function getCachedChapters(): AppChapter[] | null {
  return getCache<AppChapter[]>(CACHE_KEYS.CHAPTERS);
}

export function setCachedChapters(chapters: AppChapter[]): void {
  setCache(CACHE_KEYS.CHAPTERS, chapters, TTL.CHAPTERS);
}

export function getStaleChapters(): AppChapter[] | null {
  return getStaleCache<AppChapter[]>(CACHE_KEYS.CHAPTERS);
}

export function isChaptersCacheStale(): boolean {
  return isCacheStale(CACHE_KEYS.CHAPTERS);
}

export function getCachedChapterInfo(chapterId: number): ChapterInfo | null {
  return getCache<ChapterInfo>(CACHE_KEYS.CHAPTER_INFO(chapterId));
}

export function setCachedChapterInfo(chapterId: number, info: ChapterInfo): void {
  setCache(CACHE_KEYS.CHAPTER_INFO(chapterId), info, TTL.CHAPTER_INFO);
}

export function getStaleChapterInfo(chapterId: number): ChapterInfo | null {
  return getStaleCache<ChapterInfo>(CACHE_KEYS.CHAPTER_INFO(chapterId));
}

export function getCachedVerses(chapterId: number, translationId: number): AppVerse[] | null {
  return getCache<AppVerse[]>(CACHE_KEYS.VERSES(chapterId, translationId));
}

export function setCachedVerses(chapterId: number, translationId: number, verses: AppVerse[]): void {
  setCache(CACHE_KEYS.VERSES(chapterId, translationId), verses, TTL.VERSES);
}

export function getStaleVerses(chapterId: number, translationId: number): AppVerse[] | null {
  return getStaleCache<AppVerse[]>(CACHE_KEYS.VERSES(chapterId, translationId));
}

export function isVersesCacheStale(chapterId: number, translationId: number): boolean {
  return isCacheStale(CACHE_KEYS.VERSES(chapterId, translationId));
}

export function getCachedTranslationsIndex(): ResourceInfo[] | null {
  return getCache<ResourceInfo[]>(CACHE_KEYS.TRANSLATIONS_INDEX);
}

export function setCachedTranslationsIndex(translations: ResourceInfo[]): void {
  setCache(CACHE_KEYS.TRANSLATIONS_INDEX, translations, TTL.RESOURCES_INDEX);
}

export function getCachedTafsirsIndex(): ResourceInfo[] | null {
  return getCache<ResourceInfo[]>(CACHE_KEYS.TAFSIRS_INDEX);
}

export function setCachedTafsirsIndex(tafsirs: ResourceInfo[]): void {
  setCache(CACHE_KEYS.TAFSIRS_INDEX, tafsirs, TTL.RESOURCES_INDEX);
}

export function getCachedVerseTafsir(verseKey: string, tafsirId: number): string | null {
  return getCache<string>(CACHE_KEYS.VERSE_TAFSIR(verseKey, tafsirId));
}

export function setCachedVerseTafsir(verseKey: string, tafsirId: number, text: string): void {
  setCache(CACHE_KEYS.VERSE_TAFSIR(verseKey, tafsirId), text, TTL.TAFSIR);
}

// French tafsir translation cache
export function getCachedFrenchTafsir(verseKey: string): string | null {
  return getCache<string>(CACHE_KEYS.FRENCH_TAFSIR(verseKey));
}

export function setCachedFrenchTafsir(verseKey: string, text: string): void {
  setCache(CACHE_KEYS.FRENCH_TAFSIR(verseKey), text, TTL.TAFSIR);
}

// Clear all Quran cache (for debugging or forced refresh)
export function clearQuranCache(): void {
  const keysToRemove: string[] = [];
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith('naja_quran_')) {
      keysToRemove.push(key);
    }
  }
  
  keysToRemove.forEach(key => localStorage.removeItem(key));
}
