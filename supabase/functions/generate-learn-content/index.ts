import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { openaiChatText } from "../_shared/openai.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    // Authentication check
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getUser(token);
    
    if (claimsError || !claimsData?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json().catch(() => ({}));
    const prompt = body?.prompt;

    if (!prompt || typeof prompt !== "string") {
      return new Response(JSON.stringify({ error: "Prompt is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("[generate-learn-content] Processing for user:", claimsData.user.id, "prompt:", prompt.substring(0, 100) + "...");

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
