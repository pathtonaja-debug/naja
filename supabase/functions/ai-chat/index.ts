import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const authHeader = req.headers.get('Authorization');
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_PUBLISHABLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader! } },
    });

    // Get user's companion profile for personalization
    const { data: { user } } = await supabase.auth.getUser();
    const { data: companion } = await supabase
      .from('companion_profiles')
      .select('name, voice_tone, behavior_settings')
      .eq('user_id', user?.id)
      .single();

    const companionName = companion?.name || 'NAJA';
    const voiceTone = companion?.voice_tone || 'warm';
    const behaviorSettings = companion?.behavior_settings || {};

    const systemPrompt = `You are ${companionName}, a faith-based AI companion helping Muslims strengthen their spiritual practice. 

Your personality:
- Voice tone: ${voiceTone}
- ${behaviorSettings.faith_aligned ? 'Provide faith-aligned guidance rooted in Quran and Sunnah' : ''}
- ${behaviorSettings.gentle_reminders ? 'Offer gentle, encouraging reminders' : ''}
- ${behaviorSettings.contextual_suggestions ? 'Give contextual suggestions based on user context' : ''}

Guidelines:
- Be empathetic, concise, and respectful
- NEVER issue religious rulings (fatawa)
- Point to reputable Islamic resources when needed
- Encourage reflection, gratitude, and growth
- Support users in building spiritual habits
- Keep responses under 3 sentences unless asked for detail`;

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
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI usage limit reached. Please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error('AI gateway error');
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("ai-chat error:", error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});