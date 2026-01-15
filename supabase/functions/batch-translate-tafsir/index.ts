import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const QURAN_API_BASE = 'https://api.quran.com/api/v4';
const TAFSIR_ID = 169; // Ibn Kathir English

interface TafsirResponse {
  tafsir: {
    text: string;
  };
}

interface SurahInfo {
  verses_count: number;
}

interface TranslationResult {
  [verseKey: string]: string;
}

async function fetchVerseTafsir(verseKey: string): Promise<string> {
  const url = `${QURAN_API_BASE}/tafsirs/${TAFSIR_ID}/by_ayah/${verseKey}`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch tafsir for ${verseKey}: ${response.status}`);
  }
  
  const data: TafsirResponse = await response.json();
  return data.tafsir?.text || '';
}

async function translateToFrench(text: string, verseKey: string): Promise<string> {
  const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
  if (!LOVABLE_API_KEY) {
    throw new Error('LOVABLE_API_KEY not configured');
  }

  const systemPrompt = `You are a professional translator specializing in Islamic religious texts. Translate the following English tafsir (Quranic exegesis) to French.

Rules:
- Preserve all Islamic terminology with their French equivalents (e.g., "Allah" stays "Allah", "Prophet" becomes "Prophète")
- Maintain the scholarly tone and reverence
- Keep paragraph structure
- Do not add any commentary or notes
- Return ONLY the French translation`;

  const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${LOVABLE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'google/gemini-2.5-flash',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Translate this tafsir for verse ${verseKey} to French:\n\n${text}` }
      ],
      max_tokens: 4000,
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Translation API error: ${response.status} - ${errorText}`);
  }

  const result = await response.json();
  return result.choices?.[0]?.message?.content || '';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { surahNumber, startVerse = 1, endVerse } = await req.json();

    if (!surahNumber || typeof surahNumber !== 'number') {
      return new Response(
        JSON.stringify({ error: 'surahNumber is required and must be a number' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get surah info for verse count
    const surahInfoRes = await fetch(`${QURAN_API_BASE}/chapters/${surahNumber}`);
    const surahInfo = await surahInfoRes.json();
    const versesCount = surahInfo.chapter?.verses_count || endVerse || 7;
    
    const actualEndVerse = endVerse || versesCount;
    const translations: TranslationResult = {};
    const errors: string[] = [];

    console.log(`[BatchTranslate] Processing Surah ${surahNumber}, verses ${startVerse}-${actualEndVerse}`);

    for (let verse = startVerse; verse <= actualEndVerse; verse++) {
      const verseKey = `${surahNumber}:${verse}`;
      
      try {
        // Fetch English tafsir
        const englishTafsir = await fetchVerseTafsir(verseKey);
        
        if (!englishTafsir || englishTafsir.length < 10) {
          console.log(`[BatchTranslate] Skipping ${verseKey} - no tafsir available`);
          continue;
        }

        // Translate to French
        const frenchTafsir = await translateToFrench(englishTafsir, verseKey);
        
        if (frenchTafsir) {
          translations[verseKey] = frenchTafsir;
          console.log(`[BatchTranslate] ✓ Translated ${verseKey} (${frenchTafsir.length} chars)`);
        }

        // Small delay to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (err) {
        const errorMsg = `Failed to translate ${verseKey}: ${err instanceof Error ? err.message : 'Unknown error'}`;
        console.error(`[BatchTranslate] ${errorMsg}`);
        errors.push(errorMsg);
      }
    }

    return new Response(
      JSON.stringify({
        surah: surahNumber,
        startVerse,
        endVerse: actualEndVerse,
        translations,
        translatedCount: Object.keys(translations).length,
        errors: errors.length > 0 ? errors : undefined,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[BatchTranslate] Error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
