/**
 * Static French Tafsir Service
 * 
 * Loads pre-generated French tafsir translations from a static JSON file.
 * Provides instant, synchronous access to French tafsir content.
 */

interface TafsirData {
  version: number;
  generatedAt: string;
  source: string;
  verses: { [verseKey: string]: string };
}

let tafsirData: TafsirData | null = null;
let loadingPromise: Promise<TafsirData | null> | null = null;
let loadAttempted = false;

/**
 * Load the French tafsir JSON file
 * This is called once on first access and cached in memory
 */
export async function loadFrenchTafsir(): Promise<boolean> {
  if (tafsirData) return true;
  if (loadAttempted && !loadingPromise) return false;

  if (!loadingPromise) {
    loadAttempted = true;
    loadingPromise = (async () => {
      try {
        const response = await fetch('/data/tafsir-fr.json');
        if (!response.ok) {
          console.warn('[TafsirFrStatic] Failed to load:', response.status);
          return null;
        }
        
        const data: TafsirData = await response.json();
        tafsirData = data;
        
        const verseCount = Object.keys(data.verses || {}).length;
        console.log(`[TafsirFrStatic] Loaded ${verseCount} French tafsirs (v${data.version})`);
        
        return data;
      } catch (error) {
        console.warn('[TafsirFrStatic] Error loading:', error);
        return null;
      } finally {
        loadingPromise = null;
      }
    })();
  }

  await loadingPromise;
  return tafsirData !== null;
}

/**
 * Get French tafsir for a verse - synchronous after initial load
 * Returns null if not loaded or verse not found
 */
export function getFrenchTafsirSync(verseKey: string): string | null {
  if (!tafsirData?.verses) return null;
  return tafsirData.verses[verseKey] || null;
}

/**
 * Get French tafsir with async loading fallback
 * Ensures data is loaded before returning
 */
export async function getFrenchTafsir(verseKey: string): Promise<string | null> {
  await loadFrenchTafsir();
  return getFrenchTafsirSync(verseKey);
}

/**
 * Check if French tafsir data is loaded
 */
export function isFrenchTafsirLoaded(): boolean {
  return tafsirData !== null;
}

/**
 * Get the source attribution for the French tafsir
 */
export function getFrenchTafsirSource(): string {
  return tafsirData?.source || 'Ibn Kathir, traduit en français';
}

/**
 * Get the total number of translated verses
 */
export function getFrenchTafsirCount(): number {
  return tafsirData?.verses ? Object.keys(tafsirData.verses).length : 0;
}

/**
 * Preload the French tafsir in background
 * Call this early (e.g., when entering Quran section)
 */
export function preloadFrenchTafsir(): void {
  loadFrenchTafsir().catch(() => {
    // Silently fail - will try again when needed
  });
}
