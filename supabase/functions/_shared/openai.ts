// supabase/functions/_shared/openai.ts
// Uses Lovable AI (backed by OpenAI) to avoid rate limiting issues

export type OpenAIError = {
  status: number;
  message: string;
  details?: unknown;
};

function stripCodeFences(s: string): string {
  return s.replace(/```(?:json)?\s*/gi, "").replace(/```/g, "").trim();
}

function extractFirstJSONObject(s: string): string | null {
  const text = stripCodeFences(s);
  const start = text.indexOf("{");
  if (start < 0) return null;
  let depth = 0;
  for (let i = start; i < text.length; i++) {
    const ch = text[i];
    if (ch === "{") depth++;
    if (ch === "}") depth--;
    if (depth === 0) return text.slice(start, i + 1);
  }
  return null;
}

async function fetchWithTimeout(url: string, init: RequestInit, timeoutMs = 30000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...init, signal: controller.signal });
    return res;
  } finally {
    clearTimeout(id);
  }
}

export async function openaiChatText(args: {
  system: string;
  user: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}): Promise<string> {
  // Try Lovable AI first (uses LOVABLE_API_KEY), fallback to OpenAI
  const lovableKey = Deno.env.get("LOVABLE_API_KEY");
  const openaiKey = Deno.env.get("OPENAI_API_KEY");
  
  // Prefer Lovable AI to avoid rate limits
  if (lovableKey) {
    try {
      const res = await fetchWithTimeout("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${lovableKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          max_completion_tokens: args.maxTokens ?? 800,
          messages: [
            { role: "system", content: args.system },
            { role: "user", content: args.user },
          ],
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const content = data?.choices?.[0]?.message?.content;
        if (content) return String(content).trim();
      }
      console.log("[openai] Lovable AI failed, falling back to OpenAI");
    } catch (e) {
      console.log("[openai] Lovable AI error, falling back to OpenAI:", e);
    }
  }

  // Fallback to OpenAI
  if (!openaiKey) {
    throw { status: 500, message: "No API key configured (LOVABLE_API_KEY or OPENAI_API_KEY)" } as OpenAIError;
  }

  const model = args.model || "gpt-4o-mini";
  const res = await fetchWithTimeout("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${openaiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: args.temperature ?? 0.7,
      max_tokens: args.maxTokens ?? 800,
      messages: [
        { role: "system", content: args.system },
        { role: "user", content: args.user },
      ],
    }),
  });

  if (res.status === 401) throw { status: 401, message: "OpenAI authentication failed" } as OpenAIError;
  if (res.status === 429) throw { status: 429, message: "Rate limit exceeded. Please try again later." } as OpenAIError;

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw { status: 500, message: `OpenAI error: ${res.status}`, details: txt } as OpenAIError;
  }

  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content) throw { status: 500, message: "OpenAI returned no content" } as OpenAIError;
  return String(content).trim();
}

export async function openaiChatJSON<T>(args: {
  system: string;
  user: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}): Promise<T> {
  const raw = await openaiChatText({
    system: args.system,
    user: args.user,
    model: args.model,
    maxTokens: args.maxTokens ?? 1200,
    temperature: args.temperature ?? 0.4,
  });

  const extracted = extractFirstJSONObject(raw);
  if (!extracted) throw { status: 500, message: "Failed to extract JSON from AI output", details: raw } as OpenAIError;

  try {
    return JSON.parse(extracted) as T;
  } catch {
    throw { status: 500, message: "AI returned invalid JSON", details: { extracted, raw } } as OpenAIError;
  }
}
