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
 * - Verse text in transliteration + (number)
 * - French translation + (number)
 * - Commentary follows until next verse
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
  
  // Find verse marker pattern: "(verseNumber)" at end of line
  // This matches patterns like:
  // - "Louange à Dieu, le Seigneur des mondes (2)"
  // - "yaqûlu 'âmannâ... (8)"
  const versePattern = new RegExp(
    `[^(]\\(${verseNumber}\\)[.\\s]`,
    'g'
  );
  
  let verseStart = -1;
  let match: RegExpExecArray | null;
  
  // Find all occurrences and take the first meaningful one after position 0
  while ((match = versePattern.exec(surahText)) !== null) {
    if (match.index > 0) {
      verseStart = match.index + match[0].length;
      break;
    }
  }
  
  if (verseStart === -1) {
    // Try alternative pattern for verse numbers written differently
    const altPattern = new RegExp(`\\(${verseNumber}\\)\\.?\\s*\\n`, 'g');
    const altMatch = altPattern.exec(surahText);
    if (altMatch && altMatch.index > 0) {
      verseStart = altMatch.index + altMatch[0].length;
    }
  }
  
  if (verseStart === -1) return null;
  
  // Find end of this verse's tafsir (start of next verse)
  const nextVersePattern = new RegExp(`\\(${verseNumber + 1}\\)[.\\s]`, 'g');
  nextVersePattern.lastIndex = verseStart;
  const nextMatch = nextVersePattern.exec(surahText);
  
  let verseEnd = surahText.length;
  if (nextMatch && nextMatch.index > verseStart) {
    // Go back to find the start of the next verse's Arabic/translation
    const beforeNext = surahText.slice(verseStart, nextMatch.index);
    // Find last paragraph break before the next verse marker
    const lastBreak = beforeNext.lastIndexOf('\n\n');
    if (lastBreak > 0) {
      verseEnd = verseStart + lastBreak;
    } else {
      verseEnd = nextMatch.index;
    }
  }
  
  let tafsirContent = surahText.slice(verseStart, verseEnd).trim();
  
  // Clean up the content
  tafsirContent = cleanTafsirContent(tafsirContent);
  
  return tafsirContent || null;
}

/**
 * Clean and format the tafsir content
 * 
 * Removes OCR artifacts (garbled characters from bad scans) and formats
 * the text into clean paragraphs with proper HTML structure.
 */
function cleanTafsirContent(content: string): string {
  // Step 1: Remove obvious OCR garbage patterns
  let cleaned = content
    // Remove Arabic script entirely (OCR artifacts from the original Arabic text)
    .replace(/[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]+/g, '')
    // Remove common OCR garbage patterns - sequences of single letters with spaces/symbols
    // This pattern catches things like "cS jjï » ijIj j 'J î" etc
    .replace(/\b[A-Za-zàâäéèêëïîôùûüÿçœæ]{1,2}\s*[»«*^_|:;!?.,]+\s*[A-Za-zàâäéèêëïîôùûüÿçœæ]{1,2}\b/g, '')
    // Remove sequences of short "words" (1-2 chars) separated by spaces
    .replace(/(\b[A-Za-z]{1,2}\b\s+){3,}/g, '')
    // Remove patterns like "jjï" "îlj" etc - consonant+vowel combos that are OCR garbage
    .replace(/\b[bcdfghjklmnpqrstvwxzBCDFGHJKLMNPQRSTVWXZ][îïüûùôöàâäéèêëç][A-Za-z]{0,2}\b/g, '')
    // Remove patterns with excessive accented characters mixed oddly
    .replace(/\b\w*[îïâäùûôöëê]{2,}\w*\b/g, '')
    // Remove isolated symbols and punctuation clusters
    .replace(/[»«]+/g, '')
    .replace(/\s*[*^_|\\<>]+\s*/g, ' ')
    // Remove footnote-style numbers like (1) (2) etc in the middle of text
    .replace(/\(\s*\d+\s*\)/g, '')
    // Clean up multiple spaces
    .replace(/\s{2,}/g, ' ')
    // Remove page numbers (standalone numbers on their own line)
    .replace(/^\d+\s*$/gm, '')
    // Clean up excessive whitespace and newlines
    .replace(/\n\s*\n\s*\n+/g, '\n\n');

  // Step 2: Process lines and filter out garbage lines
  const lines = cleaned.split('\n').map(line => line.trim()).filter(line => {
    // Filter out empty or very short lines
    if (line.length < 15) return false;
    
    // Count French letters vs total characters
    const frenchLetters = (line.match(/[a-zA-ZàâäéèêëïîôùûüÿçœæÀÂÄÉÈÊËÏÎÔÙÛÜŸÇŒÆ]/g) || []).length;
    const total = line.replace(/\s/g, '').length;
    
    // Line should be mostly letters (>60%)
    if (total > 0 && frenchLetters / total < 0.6) return false;
    
    // Check for too many short "words" (OCR garbage indicator)
    const words = line.split(/\s+/);
    const shortWords = words.filter(w => w.length <= 2 && !/^(à|a|au|de|du|en|et|il|je|la|le|là|ma|me|ne|ni|on|ou|où|sa|se|si|ta|te|tu|un|va|vu|y)$/i.test(w)).length;
    if (words.length > 5 && shortWords / words.length > 0.4) return false;
    
    return true;
  });

  // Step 3: Join lines into paragraphs
  const paragraphs: string[] = [];
  let currentParagraph = '';
  
  for (const line of lines) {
    if (line === '') {
      if (currentParagraph.length > 30) {
        paragraphs.push(currentParagraph.trim());
      }
      currentParagraph = '';
    } else {
      currentParagraph += (currentParagraph ? ' ' : '') + line;
    }
  }
  
  // Don't forget the last paragraph
  if (currentParagraph.length > 30) {
    paragraphs.push(currentParagraph.trim());
  }

  // Step 4: Final cleanup on each paragraph
  const cleanedParagraphs = paragraphs
    .map(p => {
      // Remove any remaining short garbage sequences
      return p
        .replace(/\s+[A-Za-z]{1,2}\s+[A-Za-z]{1,2}\s+[A-Za-z]{1,2}\s+/g, ' ')
        .replace(/\s{2,}/g, ' ')
        .trim();
    })
    .filter(p => p.length > 40); // Only keep meaningful paragraphs

  // Step 5: Format as simple HTML paragraphs
  const formatted = cleanedParagraphs
    .map(p => `<p>${escapeHtml(p)}</p>`)
    .join('\n');
  
  return formatted;
}

/**
 * Escape HTML entities to prevent XSS and rendering issues
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
