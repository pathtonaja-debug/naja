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
 */
function cleanTafsirContent(content: string): string {
  // Remove OCR artifacts and clean up
  let cleaned = content
    // Remove page numbers (standalone numbers on their own line)
    .replace(/^\d+\s*$/gm, '')
    // Remove Arabic text artifacts from OCR
    .replace(/[؀-ۿ\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]+/g, '')
    // Remove lone special characters
    .replace(/^[^\w\s«»().,;:!?'-]+$/gm, '')
    // Clean up multiple blank lines
    .replace(/\n{3,}/g, '\n\n')
    // Remove leading/trailing whitespace per line
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .join('\n');
  
  // Format for HTML rendering
  const paragraphs = cleaned.split('\n\n');
  const formatted = paragraphs
    .filter(p => p.trim().length > 20) // Filter out very short lines (likely artifacts)
    .map(p => {
      const text = p.replace(/\n/g, ' ').trim();
      
      // Check if it's a Quran reference (contains [Coran ...])
      if (text.includes('[Coran')) {
        return `<p class="verse-reference">${text}</p>`;
      }
      
      // Check if it's a hadith (contains "Rapporté par")
      if (text.includes('Rapporté par') || text.includes('rapporté par')) {
        return `<p class="hadith-reference"><em>${text}</em></p>`;
      }
      
      // Check if it starts with a dash (list item)
      if (text.startsWith('-')) {
        return `<p class="list-item">${text}</p>`;
      }
      
      return `<p>${text}</p>`;
    })
    .join('\n');
  
  return formatted;
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
