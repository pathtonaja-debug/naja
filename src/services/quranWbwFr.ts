/**
 * French Word-by-Word Quran Translation Service
 * Data source: Dr. Usama Nonnenmacher (CoranMot project)
 * https://github.com/DrUsamaN/CoranMot
 * 
 * The TXT file contains one French translation per line,
 * in sequential order of all words in the Quran.
 * We index by global word position (0-indexed line number).
 */

// Cache for loaded French translations
let frenchWordsCache: string[] | null = null;
let loadingPromise: Promise<string[]> | null = null;

/**
 * Load the French word-by-word translations from the TXT file.
 * Returns an array where index = global word position (0-indexed).
 */
export async function loadFrenchWbw(): Promise<string[]> {
  // Return cached data if available
  if (frenchWordsCache) {
    return frenchWordsCache;
  }

  // Return existing promise if already loading
  if (loadingPromise) {
    return loadingPromise;
  }

  loadingPromise = (async () => {
    try {
      const response = await fetch('/data/quran-wbw-fr.txt');
      if (!response.ok) {
        throw new Error(`Failed to load French WBW data: ${response.status}`);
      }

      const text = await response.text();
      // Split by newlines, filter empty lines
      const lines = text.split('\n').filter(line => line.trim() !== '');
      
      frenchWordsCache = lines;
      console.log(`[QuranWbwFr] Loaded ${lines.length} French word translations`);
      
      return lines;
    } catch (error) {
      console.error('[QuranWbwFr] Failed to load French WBW:', error);
      loadingPromise = null;
      throw error;
    }
  })();

  return loadingPromise;
}

/**
 * Quran structure: number of words per surah.
 * This allows us to calculate the global word index from surah:verse:position.
 * 
 * Data derived from standard Quran word counts.
 */
const SURAH_WORD_COUNTS: number[] = [
  // Surah 1-10
  29, 6140, 3502, 3765, 2838, 3056, 3345, 1244, 1556, 1293,
  // Surah 11-20
  1946, 1499, 855, 831, 658, 1845, 1557, 1596, 1083, 1251,
  // Surah 21-30
  1174, 1058, 1055, 1319, 892, 1322, 1165, 1479, 980, 891,
  // Surah 31-40
  550, 375, 1303, 884, 778, 1018, 866, 800, 1179, 1228,
  // Surah 41-50
  796, 860, 571, 346, 489, 648, 600, 475, 399, 373,
  // Surah 51-60
  360, 312, 360, 342, 352, 379, 575, 472, 445, 352,
  // Surah 61-70
  226, 176, 247, 242, 289, 251, 431, 376, 267, 324,
  // Surah 71-80
  227, 285, 199, 256, 243, 210, 181, 174, 195, 133,
  // Surah 81-90
  104, 81, 123, 83, 109, 70, 72, 92, 108, 82,
  // Surah 91-100
  54, 71, 40, 27, 29, 76, 24, 46, 36, 40,
  // Surah 101-110
  36, 28, 13, 30, 19, 17, 25, 10, 21, 27,
  // Surah 111-114
  23, 19, 19, 20
];

// Cumulative word counts per surah (for quick lookup)
let cumulativeWordCounts: number[] | null = null;

function getCumulativeWordCounts(): number[] {
  if (cumulativeWordCounts) return cumulativeWordCounts;
  
  cumulativeWordCounts = [];
  let total = 0;
  for (const count of SURAH_WORD_COUNTS) {
    cumulativeWordCounts.push(total);
    total += count;
  }
  return cumulativeWordCounts;
}

/**
 * Verse word counts for all surahs.
 * This is needed to calculate exact global position from surah:verse:wordPosition.
 * 
 * For now, we use a simpler approach: map word.id from the API directly.
 * The Quran.com API word IDs are sequential within the database but not globally sequential.
 * 
 * Alternative approach: Use position within chapter based on API response order.
 */

// Map to store word position within each chapter
// Key: `${chapterNumber}` → Map of verseKey:position → globalIndex
const chapterWordIndexMap = new Map<number, Map<string, number>>();

/**
 * Build word index for a chapter based on API response.
 * Call this when loading verses to establish the mapping.
 * 
 * IMPORTANT: The API includes "end" markers (verse numbers) as words,
 * but the CoranMot data only has actual words. We must filter out non-word entries.
 */
export function buildChapterWordIndex(
  chapterNumber: number,
  verses: Array<{
    verseKey: string;
    words?: Array<{ position: number; char_type_name?: string; text_uthmani?: string }>;
  }>
): void {
  const cumulative = getCumulativeWordCounts();
  const chapterStartIndex = cumulative[chapterNumber - 1] || 0;
  
  const indexMap = new Map<string, number>();
  let wordOffset = 0;

  for (const verse of verses) {
    if (verse.words) {
      for (const word of verse.words) {
        // Skip "end" markers (verse numbers) - they're not in the French data
        // Check char_type_name if available, otherwise check if text looks like a number
        const isEndMarker = (word as any).char_type_name === 'end';
        if (isEndMarker) continue;
        
        // Create key like "1:1:1" for surah 1, verse 1, position 1
        const key = `${verse.verseKey}:${word.position}`;
        indexMap.set(key, chapterStartIndex + wordOffset);
        wordOffset++;
      }
    }
  }

  chapterWordIndexMap.set(chapterNumber, indexMap);
  console.log(`[QuranWbwFr] Built index for chapter ${chapterNumber}: ${wordOffset} words`);
}

/**
 * Get French translation for a specific word.
 * @param verseKey - e.g., "1:1"
 * @param position - word position within the verse (1-indexed from API)
 * @param chapterNumber - the chapter number
 */
export function getFrenchWordTranslation(
  verseKey: string,
  position: number,
  chapterNumber: number
): string | null {
  if (!frenchWordsCache) return null;

  const indexMap = chapterWordIndexMap.get(chapterNumber);
  if (!indexMap) return null;

  const key = `${verseKey}:${position}`;
  const globalIndex = indexMap.get(key);
  
  if (globalIndex === undefined || globalIndex >= frenchWordsCache.length) {
    return null;
  }

  return frenchWordsCache[globalIndex];
}

/**
 * Check if French WBW data is loaded
 */
export function isFrenchWbwLoaded(): boolean {
  return frenchWordsCache !== null && frenchWordsCache.length > 0;
}

/**
 * Preload French WBW data (call this early for better UX)
 */
export function preloadFrenchWbw(): void {
  loadFrenchWbw().catch(() => {
    // Silently fail - we'll try again when needed
  });
}
