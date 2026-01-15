/**
 * French Tafsir Service (Ibn Kathir - Dr. Ahmad Harakat translation)
 * 
 * This service parses and serves the French Tafsir from the local TXT file.
 * The file structure is:
 * - Surah headers: "Sûratu-l-..." or "SOURATE DE..."
 * - Verse markers: Transliteration followed by (verse number)
 * - Translation followed by (verse number)
 * - Tafsir commentary follows
 */

// Cache for the loaded tafsir data
let tafsirDataCache: string | null = null;
let loadingPromise: Promise<string> | null = null;

// Parsed tafsir sections by surah:verse
const parsedTafsirCache = new Map<string, string>();

/**
 * Load the French Tafsir TXT file
 */
async function loadTafsirFile(): Promise<string> {
  if (tafsirDataCache) return tafsirDataCache;
  
  if (loadingPromise) return loadingPromise;
  
  loadingPromise = (async () => {
    try {
      const response = await fetch('/data/tafsir-fr.txt');
      if (!response.ok) {
        throw new Error(`Failed to load French Tafsir: ${response.status}`);
      }
      const text = await response.text();
      tafsirDataCache = text;
      console.log(`[TafsirFr] Loaded ${text.length} characters`);
      return text;
    } catch (error) {
      console.error('[TafsirFr] Failed to load:', error);
      loadingPromise = null;
      throw error;
    }
  })();
  
  return loadingPromise;
}

/**
 * Surah names in French/Arabic transliteration for matching
 */
const SURAH_PATTERNS: Record<number, RegExp[]> = {
  1: [/Sûratu-l-Fâtih[h]?a/i, /FATIHA/i, /L'OUVERTURE/i],
  2: [/Sûratu-l-Baqara/i, /SOURATE DE LA VACHE/i, /BAQARA/i],
  3: [/Sûratu.*'?Imrân/i, /FAMILLE D'IMRAN/i],
  4: [/Sûratu.*Nisâ/i, /LES FEMMES/i],
  5: [/Sûratu.*Mâ'?ida/i, /LA TABLE SERVIE/i],
  6: [/Sûratu.*An'?âm/i, /LES BESTIAUX/i],
  7: [/Sûratu.*A'?râf/i, /LES MURAILLES/i],
  8: [/Sûratu.*Anfâl/i, /LE BUTIN/i],
  9: [/Sûratu.*Tawba/i, /LE REPENTIR/i],
  10: [/Sûratu.*Yûnus/i, /JONAS/i],
  // Add more as needed...
};

/**
 * Find the starting position of a surah in the text
 */
function findSurahStart(text: string, surahNumber: number): number {
  const patterns = SURAH_PATTERNS[surahNumber];
  if (patterns) {
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match.index !== undefined) {
        return match.index;
      }
    }
  }
  
  // Fallback: search for surah number pattern
  const fallbackPattern = new RegExp(`Sourate\\s+${surahNumber}\\b|Sûrat.*\\(${surahNumber}\\)`, 'i');
  const match = text.match(fallbackPattern);
  if (match && match.index !== undefined) {
    return match.index;
  }
  
  return -1;
}

/**
 * Extract tafsir content for a specific verse
 * 
 * The TXT file uses this pattern:
 * - Arabic transliteration line + (verse number)
 * - French translation line + (verse number)
 * - Commentary follows until next verse's transliteration
 * 
 * We need to identify where commentary for verse N ends and verse N+1 begins.
 */
function extractVerseTafsir(text: string, surahNumber: number, verseNumber: number): string | null {
  // Find surah section
  const surahStart = findSurahStart(text, surahNumber);
  if (surahStart === -1) return null;
  
  // Find next surah (or end of file)
  let surahEnd = text.length;
  const nextSurahPatterns = Object.values(SURAH_PATTERNS).flat();
  for (const pattern of nextSurahPatterns) {
    const match = text.slice(surahStart + 100).match(pattern);
    if (match && match.index !== undefined) {
      const potentialEnd = surahStart + 100 + match.index;
      if (potentialEnd < surahEnd && potentialEnd > surahStart + 500) {
        surahEnd = potentialEnd;
      }
    }
  }
  
  const surahText = text.slice(surahStart, surahEnd);
  
  // Pattern to find the START of a verse's section
  // This matches the French translation line with verse number at end
  // e.g., "Louange à Dieu, le Seigneur des mondes (2)."
  const verseFrenchPattern = new RegExp(
    `([A-ZÀÂÄÉÈÊËÏÎÔÙÛÜŸÇŒÆ][^(]{10,80})\\(${verseNumber}\\)\\.?`,
    'g'
  );
  
  // Also try transliteration pattern
  // e.g., "Alhamdu li-L-Lâhi Rabbi-l-'âlamîn (2)"
  const verseTranslitPattern = new RegExp(
    `([A-Z][a-zâäàáéèêëîïôöùûüÿ'-]+(?:\\s+[A-Za-zâäàáéèêëîïôöùûüÿ'-]+){1,10})\\s*\\(${verseNumber}\\)`,
    'g'
  );
  
  let verseStart = -1;
  
  // Try French translation pattern first
  let match = verseFrenchPattern.exec(surahText);
  if (match && match.index !== undefined) {
    verseStart = match.index + match[0].length;
  }
  
  // Fallback to transliteration pattern
  if (verseStart === -1) {
    match = verseTranslitPattern.exec(surahText);
    if (match && match.index !== undefined) {
      verseStart = match.index + match[0].length;
    }
  }
  
  // Final fallback: simple (N) pattern
  if (verseStart === -1) {
    const simplePattern = new RegExp(`[^(]\\(${verseNumber}\\)\\.?\\s`, 'g');
    match = simplePattern.exec(surahText);
    if (match && match.index !== undefined) {
      verseStart = match.index + match[0].length;
    }
  }
  
  if (verseStart === -1) return null;
  
  // Find end of this verse's tafsir
  // Look for the NEXT verse's transliteration or French translation
  const nextVerseNum = verseNumber + 1;
  
  // Pattern for next verse's transliteration header
  // These are standalone lines with transliteration + (N+1)
  const nextVerseTranslit = new RegExp(
    `\\n\\s*([A-Z][a-zâäàáéèêëîïôöùûüÿ'-]+(?:[\\s-]+[A-Za-zâäàáéèêëîïôöùûüÿ'-]+){1,10})\\s*\\(${nextVerseNum}\\)\\s*\\n`,
    'g'
  );
  
  // Pattern for next verse's French translation header
  const nextVerseFrench = new RegExp(
    `\\n\\s*([A-ZÀÂÄÉÈÊËÏÎÔÙÛÜŸÇŒÆ][^(\\n]{10,80})\\(${nextVerseNum}\\)\\.?\\s*\\n`,
    'g'
  );
  
  nextVerseTranslit.lastIndex = verseStart;
  nextVerseFrench.lastIndex = verseStart;
  
  const translitMatch = nextVerseTranslit.exec(surahText);
  const frenchMatch = nextVerseFrench.exec(surahText);
  
  let verseEnd = surahText.length;
  
  // Use the earliest match as the boundary
  if (translitMatch && translitMatch.index > verseStart) {
    verseEnd = Math.min(verseEnd, translitMatch.index);
  }
  if (frenchMatch && frenchMatch.index > verseStart) {
    verseEnd = Math.min(verseEnd, frenchMatch.index);
  }
  
  // Also check for page numbers or section breaks as boundaries
  const pageBreakPattern = /\n\s*\d{1,3}\s*\n/g;
  pageBreakPattern.lastIndex = verseStart;
  let pageMatch;
  while ((pageMatch = pageBreakPattern.exec(surahText)) !== null) {
    if (pageMatch.index > verseStart && pageMatch.index < verseEnd) {
      // Don't use page number as end boundary, just skip it
      continue;
    }
  }
  
  let tafsirContent = surahText.slice(verseStart, verseEnd).trim();
  
  // Clean up the content
  tafsirContent = cleanTafsirContent(tafsirContent);
  
  return tafsirContent || null;
}

/**
 * List of common French words to validate text
 */
const FRENCH_WORDS = new Set([
  // Articles
  'le', 'la', 'les', 'un', 'une', 'des', 'du', 'de', 'au', 'aux',
  // Pronouns
  'il', 'elle', 'ils', 'elles', 'je', 'tu', 'nous', 'vous', 'on', 'ce', 'qui', 'que', 'quoi',
  // Prepositions
  'à', 'dans', 'par', 'pour', 'en', 'vers', 'avec', 'sans', 'sous', 'sur', 'entre', 'chez',
  // Conjunctions
  'et', 'ou', 'mais', 'donc', 'car', 'ni', 'si', 'comme', 'quand', 'lorsque',
  // Common verbs
  'est', 'sont', 'a', 'ont', 'dit', 'fait', 'être', 'avoir', 'faire', 'dire', 'fut', 'était',
  // Common words
  'dieu', 'allah', 'coran', 'prophète', 'miséricordieux', 'seigneur', 'croyants', 'homme', 'hommes'
]);

/**
 * Check if a word looks like valid French
 */
function isValidFrenchWord(word: string): boolean {
  const cleaned = word.toLowerCase().replace(/[.,;:!?'"()]/g, '');
  if (cleaned.length === 0) return true;
  if (cleaned.length <= 2) {
    return FRENCH_WORDS.has(cleaned) || /^[a-zàâäéèêëïîôùûüÿçœæ]+$/.test(cleaned);
  }
  // Valid French word: mostly letters, no weird accent patterns
  const hasValidStructure = /^[a-zàâäéèêëïîôùûüÿçœæ'-]+$/i.test(cleaned);
  // Check for garbage patterns: consonants with random accents
  const hasGarbagePattern = /[bcdfghjklmnpqrstvwxz][îïûùôâäëê][bcdfghjklmnpqrstvwxz]/i.test(cleaned);
  return hasValidStructure && !hasGarbagePattern;
}

/**
 * Check if a segment of text is garbage
 */
function isGarbageSegment(segment: string): boolean {
  const words = segment.trim().split(/\s+/);
  if (words.length === 0) return true;
  
  // Count valid French words
  let validCount = 0;
  let garbageCount = 0;
  
  for (const word of words) {
    if (isValidFrenchWord(word)) {
      validCount++;
    } else {
      garbageCount++;
    }
  }
  
  // If more than 30% of words are garbage, the segment is garbage
  const garbageRatio = garbageCount / words.length;
  return garbageRatio > 0.3;
}

/**
 * Clean a sentence by removing garbage segments
 */
function cleanSentence(sentence: string): string {
  // Split by common garbage delimiters
  let cleaned = sentence
    // Remove square-bracket OCR junk but keep Quran references like "[Coran XI, 123]"
    .replace(/\[(?!\s*Coran\b)[^\]]*\]/gi, '')
    // Remove content inside parentheses that looks like garbage
    .replace(/\([^)]*[ÂÎÛîïûùâäëê][^)]*\)/g, '')
    .replace(/\([^)]*[A-Z][a-z]?-[A-Z][^)]*\)/g, '')
    // Remove parenthesized transliteration/OCR junk like "(r-J')" or "(c-âÂ-...)"
    .replace(/\([^)]*\b[A-Za-z]{1,2}-[A-Za-z]{1,2}['’]?\b[^)]*\)/g, '')
    // Remove patterns like "jhh :Jlî £)t"
    .replace(/\b\w{1,3}\s*[:;]\s*\w{1,4}[îïûùâäëê]\w*\s*[£$€)(\[\]]+\w*/g, '')
    // Remove bracket/inline OCR junk containing symbol clusters (e.g. "A*tShk*" "C’itj*")
    .replace(/\b\w{1,8}[*^_|]{1,}\w{0,8}\b/g, '')
    // Remove patterns with squares/boxes
    .replace(/[■□▪▫]+/g, '')
    // Remove short garbage sequences
    .replace(/\b[A-Z][a-z]?[îïûùâäëê][A-Za-z]{0,3}\b/g, '')
    // Remove patterns like "-...Tj OU H"
    .replace(/-\.{2,}[A-Za-z]{1,3}\s+[A-Z]{1,3}\s+[A-Z]\b/g, '')
    // Remove "oljj)" type patterns
    .replace(/\b[a-z]{2,4}[jJ]{2,}[)\]]*\)?/g, '')
    // Remove isolated fragments like "ùUa-iit —J À Ojl"
    .replace(/\b[ùûîï][A-Za-z]{1,4}[-—][a-z]{2,4}\s+[—-]?[A-Z]\s+[ÀÂ]\s+[A-Z][a-z]{1,3}\b/g, '')
    // Remove patterns with ¿ (Spanish, not French)
    .replace(/[¿¡][^.!?]*[.!?]?/g, '')
    .replace(/\([^)]*¿[^)]*\)/g, '')
    // Remove remaining OCR garbage patterns
    .replace(/\b[A-Z][a-z]?-[A-Z][a-z]?['']?\)?/g, '')
    // Remove patterns like "c-âÂ-19 tt UJI jjj"
    .replace(/[a-z]-[âäàáéèêëîïôöùûüÿ][ÂÄÀÁÉÈÊËÎÏÔÖÙÛÜŸ]-\d+\s+[a-z]{2}\s+[A-Z]{2,4}\s+[a-z]{2,4}/gi, '')
    // Remove "tojai IfjJaî" type words
    .replace(/\b[a-z]{2,6}[jJ][aeiouâäàáéèêëîïôöùûüÿ][îïûùâäëê]\b/gi, '')
    // Clean up multiple spaces
    .replace(/\s{2,}/g, ' ')
    .trim();

  return cleaned;
}

/**
 * Clean and format the tafsir content - deep sentence-level cleanup
 */
function cleanTafsirContent(content: string): string {
  // Step 1: Initial cleanup
  let cleaned = content
    // Remove Arabic script
    .replace(/[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]+/g, '')
    // Remove page numbers
    .replace(/^\d+\s*$/gm, '')
    // Normalize whitespace
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n');

  // Step 2: Split into sentences and clean each one
  const sentences = cleaned.split(/(?<=[.!?])\s+/);
  const cleanedSentences: string[] = [];
  
  for (const sentence of sentences) {
    const cleanedSentence = cleanSentence(sentence);
    
    // Check if the cleaned sentence is meaningful
    if (cleanedSentence.length > 20 && !isGarbageSegment(cleanedSentence)) {
      // Additional check: ensure the sentence ends properly or continues a thought
      cleanedSentences.push(cleanedSentence);
    }
  }
  
  // Step 3: Join sentences and split into paragraphs
  const text = cleanedSentences.join(' ');
  const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 50);
  
  // Step 4: Final cleanup on each paragraph
  const finalParagraphs = paragraphs.map(p => {
    return p
      // Remove any remaining short garbage at start/end
      .replace(/^\s*[A-Za-z]{1,2}\s+[A-Za-z]{1,2}\s+/, '')
      .replace(/\s+[A-Za-z]{1,2}\s+[A-Za-z]{1,2}\s*$/, '')
      // Clean spaces
      .replace(/\s{2,}/g, ' ')
      .trim();
  }).filter(p => p.length > 50 && !isGarbageSegment(p));
  
  // Step 5: Format as HTML
  return finalParagraphs
    .map(p => `<p>${escapeHtml(p)}</p>`)
    .join('\n');
}

/**
 * Escape HTML entities
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Get French Tafsir for a specific verse
 */
export async function getFrenchTafsir(verseKey: string): Promise<string | null> {
  // Check cache first
  const cached = parsedTafsirCache.get(verseKey);
  if (cached) return cached;
  
  // Parse verse key
  const [surahStr, verseStr] = verseKey.split(':');
  const surahNumber = parseInt(surahStr, 10);
  const verseNumber = parseInt(verseStr, 10);
  
  if (isNaN(surahNumber) || isNaN(verseNumber)) {
    console.error('[TafsirFr] Invalid verse key:', verseKey);
    return null;
  }
  
  try {
    const text = await loadTafsirFile();
    const tafsir = extractVerseTafsir(text, surahNumber, verseNumber);
    
    if (tafsir) {
      parsedTafsirCache.set(verseKey, tafsir);
    }
    
    return tafsir;
  } catch (error) {
    console.error('[TafsirFr] Error getting tafsir:', error);
    return null;
  }
}

/**
 * Preload the French Tafsir file
 */
export function preloadFrenchTafsir(): void {
  loadTafsirFile().catch(() => {
    // Silently fail - we'll try again when needed
  });
}

/**
 * Check if French Tafsir data is loaded
 */
export function isFrenchTafsirLoaded(): boolean {
  return tafsirDataCache !== null;
}
