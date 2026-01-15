/**
 * French Tafsir Generation Script
 * 
 * This script generates a complete French tafsir JSON file by:
 * 1. Iterating through all 114 surahs
 * 2. Calling the batch-translate-tafsir edge function for each surah
 * 3. Aggregating results into a single JSON file
 * 
 * Usage:
 *   npx ts-node scripts/generate-french-tafsir.ts
 * 
 * Or with environment variables:
 *   SUPABASE_URL=https://xxx.supabase.co npx ts-node scripts/generate-french-tafsir.ts
 * 
 * The script supports resumption - it will skip surahs that already exist in the output file.
 */

import * as fs from 'fs';
import * as path from 'path';

// Surah info: [surahNumber, versesCount]
const SURAH_VERSES: [number, number][] = [
  [1, 7], [2, 286], [3, 200], [4, 176], [5, 120], [6, 165], [7, 206], [8, 75],
  [9, 129], [10, 109], [11, 123], [12, 111], [13, 43], [14, 52], [15, 99], [16, 128],
  [17, 111], [18, 110], [19, 98], [20, 135], [21, 112], [22, 78], [23, 118], [24, 64],
  [25, 77], [26, 227], [27, 93], [28, 88], [29, 69], [30, 60], [31, 34], [32, 30],
  [33, 73], [34, 54], [35, 45], [36, 83], [37, 182], [38, 88], [39, 75], [40, 85],
  [41, 54], [42, 53], [43, 89], [44, 59], [45, 37], [46, 35], [47, 38], [48, 29],
  [49, 18], [50, 45], [51, 60], [52, 49], [53, 62], [54, 55], [55, 78], [56, 96],
  [57, 29], [58, 22], [59, 24], [60, 13], [61, 14], [62, 11], [63, 11], [64, 18],
  [65, 12], [66, 12], [67, 30], [68, 52], [69, 52], [70, 44], [71, 28], [72, 28],
  [73, 20], [74, 56], [75, 40], [76, 31], [77, 50], [78, 40], [79, 46], [80, 42],
  [81, 29], [82, 19], [83, 36], [84, 25], [85, 22], [86, 17], [87, 19], [88, 26],
  [89, 30], [90, 20], [91, 15], [92, 21], [93, 11], [94, 8], [95, 8], [96, 19],
  [97, 5], [98, 8], [99, 8], [100, 11], [101, 11], [102, 8], [103, 3], [104, 9],
  [105, 5], [106, 4], [107, 7], [108, 3], [109, 6], [110, 3], [111, 5], [112, 4],
  [113, 5], [114, 6]
];

const OUTPUT_FILE = path.join(__dirname, '../public/data/tafsir-fr.json');
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://owgdybzybohvgaiebvar.supabase.co';
const EDGE_FUNCTION_URL = `${SUPABASE_URL}/functions/v1/batch-translate-tafsir`;

interface TafsirData {
  version: number;
  generatedAt: string;
  source: string;
  lastSurahCompleted: number;
  verses: { [verseKey: string]: string };
}

async function loadExistingData(): Promise<TafsirData> {
  try {
    if (fs.existsSync(OUTPUT_FILE)) {
      const content = fs.readFileSync(OUTPUT_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.log('No existing data found, starting fresh');
  }
  
  return {
    version: 1,
    generatedAt: new Date().toISOString(),
    source: 'Ibn Kathir (Quran.com API), AI-translated to French via Lovable AI',
    lastSurahCompleted: 0,
    verses: {}
  };
}

function saveData(data: TafsirData): void {
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`Saved to ${OUTPUT_FILE}`);
}

async function translateSurah(surahNumber: number, versesCount: number): Promise<{ [key: string]: string }> {
  console.log(`\n📖 Translating Surah ${surahNumber} (${versesCount} verses)...`);
  
  const response = await fetch(EDGE_FUNCTION_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      surahNumber,
      startVerse: 1,
      endVerse: versesCount
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API error for surah ${surahNumber}: ${response.status} - ${errorText}`);
  }

  const result = await response.json();
  
  if (result.error) {
    throw new Error(result.error);
  }

  console.log(`✓ Surah ${surahNumber}: ${result.translatedCount}/${versesCount} verses translated`);
  
  if (result.errors && result.errors.length > 0) {
    console.warn(`  ⚠️ Errors:`, result.errors.slice(0, 3).join(', '));
  }

  return result.translations || {};
}

async function main() {
  console.log('🚀 French Tafsir Generation Script');
  console.log('===================================');
  console.log(`Using: ${EDGE_FUNCTION_URL}`);
  console.log(`Output: ${OUTPUT_FILE}`);
  
  const data = await loadExistingData();
  const startFrom = data.lastSurahCompleted + 1;
  
  console.log(`\nStarting from Surah ${startFrom}`);
  console.log(`Existing verses: ${Object.keys(data.verses).length}`);

  let totalTranslated = Object.keys(data.verses).length;
  const totalVerses = SURAH_VERSES.reduce((sum, [_, count]) => sum + count, 0);

  for (const [surahNumber, versesCount] of SURAH_VERSES) {
    if (surahNumber < startFrom) {
      continue;
    }

    try {
      const translations = await translateSurah(surahNumber, versesCount);
      
      // Merge translations
      Object.assign(data.verses, translations);
      data.lastSurahCompleted = surahNumber;
      data.generatedAt = new Date().toISOString();
      totalTranslated += Object.keys(translations).length;
      
      // Save after each surah for resumption
      saveData(data);
      
      console.log(`📊 Progress: ${totalTranslated}/${totalVerses} verses (${((totalTranslated/totalVerses)*100).toFixed(1)}%)`);
      
      // Delay between surahs to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch (err) {
      console.error(`❌ Failed on Surah ${surahNumber}:`, err);
      console.log('Saving progress and stopping...');
      saveData(data);
      process.exit(1);
    }
  }

  console.log('\n✅ Generation complete!');
  console.log(`Total verses: ${Object.keys(data.verses).length}`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
