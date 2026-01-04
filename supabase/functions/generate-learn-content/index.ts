import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { openaiChatText } from "../_shared/openai.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json().catch(() => ({}));
    const prompt = body?.prompt;

    if (!prompt || typeof prompt !== "string") {
      return new Response(JSON.stringify({ error: "Prompt is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("[generate-learn-content] Processing prompt:", prompt.substring(0, 100) + "...");

    const system = `You are an Islamic education content generator.
Rules:
- Mainstream and acceptable to all Muslims
- No sectarian polemics, no politics
- Respectful, educational tone
- Based on Qur'an and authentic Hadith (general references; avoid controversial claims)
- No takfir language, no violence advocacy
- Output MUST be valid JSON ONLY (no markdown, no extra text).
If you cannot comply, output: {"error":"cannot_comply"}`;

    const content = await openaiChatText({
      system,
      user: prompt,
      maxTokens: 1400,
      temperature: 0.5,
    });

    console.log("[generate-learn-content] Successfully generated content");

    return new Response(JSON.stringify({ content }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    const error = err as { status?: number; message?: string };
    const status = error?.status && Number.isFinite(error.status) ? error.status : 500;
    const message = error?.message || "Unknown error";
    console.error("[generate-learn-content] Error:", message);
    return new Response(JSON.stringify({ error: message }), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
