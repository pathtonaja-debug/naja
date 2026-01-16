import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { openaiChatText } from "../_shared/openai.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const QURANIC_DUAS = [
  { topic: "guidance", text: "Our Lord, give us good in this world and good in the Hereafter, and protect us from the punishment of the Fire." },
  { topic: "guidance", text: "Our Lord, do not let our hearts deviate after You have guided us and grant us mercy from Yourself. Indeed, You are the Bestower." },
  { topic: "forgiveness", text: "Our Lord, we have wronged ourselves, and if You do not forgive us and have mercy upon us, we will surely be among the losers." },
  { topic: "forgiveness", text: "Our Lord, forgive us our sins and the excess in our affairs and plant firmly our feet and give us victory over the disbelieving people." },
  { topic: "protection", text: "Our Lord, do not impose blame upon us if we forget or make a mistake. Our Lord, and lay not upon us a burden like that which You laid upon those before us." },
  { topic: "protection", text: "Our Lord, avert from us the punishment of Hell. Indeed, its punishment is ever adhering; Indeed, it is evil as a settlement and residence." },
  { topic: "health", text: "And when I am ill, it is He who cures me." },
  { topic: "family", text: "Our Lord, grant us from among our spouses and offspring comfort to our eyes and make us a leader for the righteous." },
  { topic: "family", text: "My Lord, make me an establisher of prayer, and from my descendants. Our Lord, and accept my supplication." },
  { topic: "rizq", text: "My Lord, indeed I am, for whatever good You would send down to me, in need." },
  { topic: "anxiety", text: "There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers." },
  { topic: "gratitude", text: "My Lord, enable me to be grateful for Your favor which You have bestowed upon me and upon my parents." },
  { topic: "guidance", text: "My Lord, increase me in knowledge." },
  { topic: "guidance", text: "Guide us to the straight path - The path of those upon whom You have bestowed favor." },
];

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
    const topic = typeof body.topic === "string" ? body.topic : "general";
    const selectedNames = Array.isArray(body.selectedNames) ? body.selectedNames.filter((x: unknown) => typeof x === "string") : [];
    const shortDescription = typeof body.shortDescription === "string" ? body.shortDescription : "";
    const details = typeof body.details === "string" ? body.details : "";
    const makeLonger = Boolean(body.makeLonger);

    if (!shortDescription) {
      return new Response(JSON.stringify({ error: "shortDescription is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("[generate-dua] Generating dua for topic:", topic, "user:", claimsData.user.id);

    const relevantDuas = QURANIC_DUAS.filter(d =>
      d.topic === topic.toLowerCase() || d.topic === "guidance"
    ).slice(0, 3);

    const namesContext = selectedNames.length
      ? `The user chose these Names of Allah: ${selectedNames.join(", ")}. Weave them naturally into the dua.`
      : "";

    const lengthInstruction = makeLonger
      ? "Write a longer dua (6-10 sentences)."
      : "Write a concise dua (3-5 sentences).";

    const system = `You write heartfelt Muslim duas in English.

Rules:
- Gentle, humble, sincere tone
- No fiqh rulings, no shaming, no political content
- Do not promise acceptance
- Inspired by Qur'an style but ORIGINAL wording
- Do not add "Ameen"
- Do not start with "Ya Allah" (it will be added by the UI)
- Keep it personal and comforting

Inspiration (do not copy verbatim, only style):
${relevantDuas.map(d => `- ${d.text}`).join("\n")}

${namesContext}
${lengthInstruction}`;

    const user = `Topic: ${topic}
User request: ${shortDescription}
${details ? `Additional context: ${details}` : ""}

Write the dua now.`;

    const duaText = await openaiChatText({
      system,
      user,
      maxTokens: makeLonger ? 500 : 250,
      temperature: 0.8,
    });

    console.log("[generate-dua] Successfully generated dua");

    return new Response(JSON.stringify({ duaText: duaText.trim() }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    const error = err as { status?: number; message?: string };
    const status = error?.status && Number.isFinite(error.status) ? error.status : 500;
    const message = error?.message || "Unknown error";
    console.error("[generate-dua] Error:", message);
    return new Response(JSON.stringify({ error: message }), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
