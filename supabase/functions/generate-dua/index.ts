import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// 40 Quranic Duas as reference templates for AI
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
  { topic: "anxiety", text: "Our Lord, do not place us with the wrongdoing people." },
  { topic: "gratitude", text: "My Lord, enable me to be grateful for Your favor which You have bestowed upon me and upon my parents." },
  { topic: "gratitude", text: "Praise be to Allah, who has removed from us all sorrow. Indeed, our Lord is Forgiving and Appreciative." },
  { topic: "guidance", text: "My Lord, increase me in knowledge." },
  { topic: "guidance", text: "Guide us to the straight path - The path of those upon whom You have bestowed favor." },
  { topic: "marriage", text: "Our Lord, grant us from among our spouses and offspring comfort to our eyes and make us an example for the righteous." },
  { topic: "forgiveness", text: "My Lord, forgive me and my parents and whoever enters my house a believer and the believing men and believing women." },
  { topic: "protection", text: "My Lord, I seek refuge in You from the incitements of the devils, And I seek refuge in You, my Lord, lest they be present with me." },
  { topic: "rizq", text: "And provide for us, and You are the best of providers." },
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { topic, selectedNames, shortDescription, details, makeLonger } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Find relevant Quranic duas for inspiration
    const relevantDuas = QURANIC_DUAS.filter(d => 
      d.topic === topic?.toLowerCase() || d.topic === "guidance"
    ).slice(0, 3);

    const namesContext = selectedNames?.length > 0 
      ? `The user has chosen to invoke Allah by these names: ${selectedNames.join(", ")}. Weave these names naturally into the dua.`
      : "";

    const lengthInstruction = makeLonger 
      ? "Write a longer, more detailed dua (6-10 sentences)."
      : "Write a concise dua (3-5 sentences).";

    const systemPrompt = `You are a helpful assistant that creates beautiful, heartfelt duas (supplications) in English. 

Guidelines:
- Write in a gentle, humble, sincere tone
- Do not include any Islamic rulings or fiqh
- Do not make promises about acceptance
- Do not use shaming language
- Draw inspiration from Quranic duas but write original content
- The dua should be personal and heartfelt
- Do not include "Ameen" at the end (it will be added separately)
- Do not include opening like "Ya Allah" (it will be added separately with chosen names)

Here are some Quranic duas for inspiration:
${relevantDuas.map(d => `- "${d.text}"`).join("\n")}

${namesContext}
${lengthInstruction}`;

    const userPrompt = `Topic: ${topic || "General"}
User's request: ${shortDescription}
${details ? `Additional context: ${details}` : ""}

Please write a beautiful, sincere dua for this request.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("Failed to generate dua");
    }

    const data = await response.json();
    const generatedText = data.choices?.[0]?.message?.content || "";

    return new Response(JSON.stringify({ duaText: generatedText.trim() }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in generate-dua function:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});