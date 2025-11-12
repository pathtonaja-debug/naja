import { supabase } from "@/integrations/supabase/client";

export async function transcribeAudio(audioBlob: Blob): Promise<string> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/transcribe-audio`;

  const form = new FormData();
  form.append("file", audioBlob, "audio.webm");

  const resp = await fetch(url, {
    method: "POST",
    headers: { 
      Authorization: `Bearer ${token ?? import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` 
    },
    body: form,
  });

  if (!resp.ok) {
    const errorText = await resp.text();
    console.error("Transcription error:", errorText);
    throw new Error(`Transcription failed: ${errorText}`);
  }

  const json = await resp.json();
  return json.text as string;
}
