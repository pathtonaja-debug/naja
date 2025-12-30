/**
 * Quran.com API v4 Client
 * Official REST API for Quran content
 */

const API_BASE = 'https://api.quran.com/api/v4';
const TIMEOUT_MS = 15000;
const RETRY_DELAY_MS = 1000;

// Types
export interface Chapter {
  id: number;
  revelation_place: 'makkah' | 'madinah';
  revelation_order: number;
  bismillah_pre: boolean;
  name_simple: string;
  name_complex: string;
  name_arabic: string;
  verses_count: number;
  pages: number[];
  translated_name: {
    language_name: string;
    name: string;
  };
}

export interface ChapterInfo {
  id: number;
  chapter_id: number;
  language_name: string;
  short_text: string;
  source: string;
  text: string;
}

export interface Verse {
  id: number;
  verse_key: string;
  verse_number: number;
  hizb_number: number;
  rub_el_hizb_number: number;
  ruku_number: number;
  manzil_number: number;
  sajdah_number: number | null;
  page_number: number;
  juz_number: number;
  text_uthmani: string;
  text_indopak?: string;
}

export interface Translation {
  id: number;
  resource_id: number;
  text: string;
}

export interface Transliteration {
  text: string;
  language_name: string;
}

export interface Word {
  id: number;
  position: number;
  text_uthmani: string;
  text_indopak?: string;
  translation: {
    text: string;
    language_name: string;
  };
  transliteration: {
    text: string;
    language_name: string;
  };
}

export interface VerseWithDetails extends Verse {
  translations?: Translation[];
  words?: Word[];
}

export interface Tafsir {
  id: number;
  resource_id: number;
  text: string;
}

export interface ResourceInfo {
  id: number;
  name: string;
  author_name: string;
  slug: string;
  language_name: string;
  translated_name: {
    name: string;
    language_name: string;
  };
}

// Normalized app types
export interface AppVerse {
  verseKey: string;
  verseNumber: number;
  arabicText: string;
  transliteration: string;
  translationText: string;
  tafsirText?: string;
  pageNumber: number;
  juzNumber: number;
}

export interface AppChapter {
  id: number;
  nameSimple: string;
  nameArabic: string;
  translatedName: string;
  revelationPlace: 'makkah' | 'madinah';
  versesCount: number;
  pages: number[];
}

// Known resource IDs (fallback if API lookup fails)
const KNOWN_TRANSLATION_IDS = {
  'sahih_international': 20, // Sahih International (English)
};

const KNOWN_TAFSIR_IDS = {
  'ibn_kathir_en': 169, // Ibn Kathir (English)
};

// Error types
export class QuranApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public isRateLimited: boolean = false
  ) {
    super(message);
    this.name = 'QuranApiError';
  }
}

// Fetch with timeout and retry
async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retries = 1
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        ...options.headers,
      },
    });

    clearTimeout(timeoutId);

    if (response.status === 429) {
      throw new QuranApiError('Rate limited. Please try again later.', 429, true);
    }

    if (!response.ok) {
      throw new QuranApiError(
        `API request failed: ${response.statusText}`,
        response.status
      );
    }

    return response;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof QuranApiError) {
      throw error;
    }

    if (retries > 0 && !(error instanceof DOMException && error.name === 'AbortError')) {
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
      return fetchWithRetry(url, options, retries - 1);
    }

    throw new QuranApiError(
      error instanceof Error ? error.message : 'Network error occurred'
    );
  }
}

// API Functions

export async function getChapters(language = 'en'): Promise<AppChapter[]> {
  const response = await fetchWithRetry(`${API_BASE}/chapters?language=${language}`);
  const data = await response.json();

  return data.chapters.map((ch: Chapter): AppChapter => ({
    id: ch.id,
    nameSimple: ch.name_simple,
    nameArabic: ch.name_arabic,
    translatedName: ch.translated_name.name,
    revelationPlace: ch.revelation_place,
    versesCount: ch.verses_count,
    pages: ch.pages,
  }));
}

export async function getChapter(chapterId: number, language = 'en'): Promise<AppChapter> {
  const response = await fetchWithRetry(`${API_BASE}/chapters/${chapterId}?language=${language}`);
  const data = await response.json();
  const ch: Chapter = data.chapter;

  return {
    id: ch.id,
    nameSimple: ch.name_simple,
    nameArabic: ch.name_arabic,
    translatedName: ch.translated_name.name,
    revelationPlace: ch.revelation_place,
    versesCount: ch.verses_count,
    pages: ch.pages,
  };
}

export async function getChapterInfo(chapterId: number, language = 'en'): Promise<ChapterInfo> {
  const response = await fetchWithRetry(`${API_BASE}/chapters/${chapterId}/info?language=${language}`);
  const data = await response.json();
  return data.chapter_info;
}

export async function getTranslationsIndex(language = 'en'): Promise<ResourceInfo[]> {
  const response = await fetchWithRetry(`${API_BASE}/resources/translations?language=${language}`);
  const data = await response.json();
  return data.translations;
}

export async function getTafsirsIndex(language = 'en'): Promise<ResourceInfo[]> {
  const response = await fetchWithRetry(`${API_BASE}/resources/tafsirs?language=${language}`);
  const data = await response.json();
  return data.tafsirs;
}

export async function getVersesByChapter(
  chapterNumber: number,
  opts: {
    translationId?: number;
    tafsirId?: number;
    perPage?: number;
    page?: number;
    includeWords?: boolean;
  } = {}
): Promise<{ verses: AppVerse[]; totalPages: number; currentPage: number }> {
  const {
    translationId = KNOWN_TRANSLATION_IDS.sahih_international,
    perPage = 50,
    page = 1,
    includeWords = true,
  } = opts;

  const params = new URLSearchParams({
    translations: String(translationId),
    per_page: String(perPage),
    page: String(page),
    word_fields: 'text_uthmani,translation,transliteration',
  });

  if (includeWords) {
    params.set('words', 'true');
  }

  const response = await fetchWithRetry(
    `${API_BASE}/verses/by_chapter/${chapterNumber}?${params.toString()}`
  );
  const data = await response.json();

  const verses: AppVerse[] = data.verses.map((v: VerseWithDetails): AppVerse => {
    // Build transliteration from words
    let transliteration = '';
    if (v.words) {
      transliteration = v.words
        .filter(w => w.transliteration?.text)
        .map(w => w.transliteration.text)
        .join(' ');
    }

    // Get translation text
    const translationText = v.translations?.[0]?.text || '';

    return {
      verseKey: v.verse_key,
      verseNumber: v.verse_number,
      arabicText: v.text_uthmani,
      transliteration,
      translationText: cleanHtmlTags(translationText),
      pageNumber: v.page_number,
      juzNumber: v.juz_number,
    };
  });

  return {
    verses,
    totalPages: data.pagination?.total_pages || 1,
    currentPage: data.pagination?.current_page || 1,
  };
}

export async function getVerseTafsir(
  verseKey: string,
  tafsirId: number = KNOWN_TAFSIR_IDS.ibn_kathir_en
): Promise<string> {
  const response = await fetchWithRetry(
    `${API_BASE}/tafsirs/${tafsirId}/by_ayah/${verseKey}`
  );
  const data = await response.json();
  
  if (data.tafsir?.text) {
    return cleanHtmlTags(data.tafsir.text);
  }
  
  return '';
}

// Utility to resolve resource IDs
export async function resolveTranslationId(slug: string): Promise<number> {
  if (KNOWN_TRANSLATION_IDS[slug as keyof typeof KNOWN_TRANSLATION_IDS]) {
    return KNOWN_TRANSLATION_IDS[slug as keyof typeof KNOWN_TRANSLATION_IDS];
  }

  try {
    const translations = await getTranslationsIndex();
    const found = translations.find(t => t.slug === slug);
    if (found) return found.id;
  } catch {
    // Fallback to known ID
  }

  return KNOWN_TRANSLATION_IDS.sahih_international;
}

export async function resolveTafsirId(slug: string): Promise<number> {
  if (KNOWN_TAFSIR_IDS[slug as keyof typeof KNOWN_TAFSIR_IDS]) {
    return KNOWN_TAFSIR_IDS[slug as keyof typeof KNOWN_TAFSIR_IDS];
  }

  try {
    const tafsirs = await getTafsirsIndex();
    const found = tafsirs.find(t => t.slug === slug);
    if (found) return found.id;
  } catch {
    // Fallback to known ID
  }

  return KNOWN_TAFSIR_IDS.ibn_kathir_en;
}

// Helper to strip HTML tags from text
function cleanHtmlTags(text: string): string {
  return text
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}
