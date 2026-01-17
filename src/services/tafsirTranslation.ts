/**
 * Tafsir Translation Service
 * Translates English tafsir to French using AI
 */

import { supabase } from "@/integrations/supabase/client";

const TRANSLATE_TAFSIR_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/translate-tafsir`;

export interface TranslationResult {
  translation: string;
  verseKey: string;
}

export interface TranslationError {
  error: string;
}

/**
 * Translate English tafsir text to French
 */
export async function translateTafsirToFrench(
  englishText: string,
  verseKey: string
): Promise<string> {
  try {
    // Get the user's session token for authentication
    const { data: sessionData } = await supabase.auth.getSession();
    const accessToken = sessionData?.session?.access_token;
    
    if (!accessToken) {
      throw new Error("User must be authenticated to translate tafsir");
    }

    const response = await fetch(TRANSLATE_TAFSIR_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ text: englishText, verseKey }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      if (response.status === 429) {
        throw new Error("Limite de requêtes atteinte, veuillez réessayer plus tard.");
      }
      if (response.status === 402) {
        throw new Error("Crédits insuffisants pour la traduction.");
      }
      
      throw new Error(errorData.error || `Translation failed: ${response.status}`);
    }

    const data: TranslationResult = await response.json();
    return data.translation;
  } catch (error) {
    console.error("[tafsirTranslation] Translation error:", error);
    throw error;
  }
}
