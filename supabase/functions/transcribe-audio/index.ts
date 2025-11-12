import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS });
  }

  try {
    const apiKey = Deno.env.get("OPENAI_API_KEY");
    if (!apiKey) {
      console.error("OPENAI_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "OPENAI_API_KEY not set" }),
        { status: 500, headers: { ...CORS, "Content-Type": "application/json" } }
      );
    }

    const contentType = req.headers.get("content-type") ?? "";
    let file: File | null = null;

    if (contentType.includes("multipart/form-data")) {
      const form = await req.formData();
      const f = form.get("file");
      if (f && f instanceof File) file = f;
    } else if (contentType.startsWith("audio/")) {
      const buf = await req.arrayBuffer();
      file = new File([buf], "audio.webm", { type: contentType });
    }

    if (!file) {
      return new Response(
        JSON.stringify({ error: "No audio file provided" }),
        { status: 400, headers: { ...CORS, "Content-Type": "application/json" } }
      );
    }

    const model = Deno.env.get("OPENAI_TRANSCRIBE_MODEL") ?? "whisper-1";

    const body = new FormData();
    body.append("file", file);
    body.append("model", model);

    console.log("Sending transcription request to OpenAI");
    const resp = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}` },
      body,
    });

    if (!resp.ok) {
      const err = await resp.text();
      console.error("OpenAI API error:", err);
      return new Response(
        JSON.stringify({ error: "OpenAI error", detail: err }),
        { status: 502, headers: { ...CORS, "Content-Type": "application/json" } }
      );
    }

    const json = await resp.json();
    console.log("Transcription successful");
    return new Response(JSON.stringify({ text: json.text ?? json }), {
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Server error:", e);
    return new Response(JSON.stringify({ error: "Server crash", detail: String(e) }), {
      status: 500,
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  }
});
