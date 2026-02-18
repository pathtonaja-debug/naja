import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { storyId, title, summary, category, language } = await req.json();

    const safeTitle = (title || "").slice(0, 200);
    const safeSummary = (summary || "").slice(0, 500);
    const safeCategory = (category || "").slice(0, 50);
    const lang = language === "fr" ? "French" : "English";

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: "LOVABLE_API_KEY is not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const systemPrompt = `You are a knowledgeable Islamic scholar and historian. You generate detailed, accurate stories related to Ramadan and Islamic history.

CRITICAL RULES:
- Only use information from authentic Islamic sources: Sahih al-Bukhari, Sahih Muslim, Quran, Ibn Kathir's works, and other well-known reliable hadith collections and tafsir.
- Always cite your sources (hadith collection name + number when possible, or Quran surah:ayah).
- Do NOT invent, fabricate, or embellish facts. If you are unsure about a detail, say so.
- Do NOT include weak or fabricated hadiths. Only use sahih (authentic) or hasan (good) narrations.
- Write in a warm, engaging, storytelling tone suitable for a Muslim audience.
- Respond in ${lang}.
- Format using markdown with clear sections.
- Keep the response between 400-800 words.`;

    const userPrompt = `Generate a detailed story about: "${safeTitle}"

Category: ${safeCategory}
Brief summary context: ${safeSummary}

Please include:
1. The historical context and setting
2. The main narrative with key events
3. Lessons and reflections for Muslims today, especially during Ramadan
4. Source citations (hadith references, Quran verses)

Remember: only use authentic, verified Islamic sources.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI usage limit reached. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(
        JSON.stringify({ error: "Failed to generate story" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("generate-story error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
