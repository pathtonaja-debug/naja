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
    const authHeader = req.headers.get('Authorization');
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_PUBLISHABLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader! } },
    });

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Get last 7 days data
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const dateStr = sevenDaysAgo.toISOString().split('T')[0];

    // Fetch reflections
    const { data: reflections } = await supabase
      .from('reflections')
      .select('*')
      .eq('user_id', user.id)
      .gte('date', dateStr)
      .order('date', { ascending: false });

    // Fetch habit logs
    const { data: habitLogs } = await supabase
      .from('habit_logs')
      .select('*, habits(*)')
      .eq('user_id', user.id)
      .gte('date', dateStr);

    // Fetch dhikr sessions
    const { data: dhikrSessions } = await supabase
      .from('dhikr_sessions')
      .select('*')
      .eq('user_id', user.id)
      .gte('date', dateStr);

    // Calculate stats
    const stats = {
      reflections: reflections?.length || 0,
      habits: {
        completed: habitLogs?.filter(l => l.completed).length || 0,
        total: habitLogs?.length || 0,
      },
      dhikr: {
        sessions: dhikrSessions?.length || 0,
        totalCount: dhikrSessions?.reduce((sum, s) => sum + s.count, 0) || 0,
      },
    };

    // Use AI to generate personalized summary
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (LOVABLE_API_KEY) {
      const prompt = `Generate a brief, encouraging weekly spiritual summary for a Muslim user based on these stats:
- ${stats.reflections} reflection entries
- ${stats.habits.completed}/${stats.habits.total} habits completed
- ${stats.dhikr.sessions} dhikr sessions (${stats.dhikr.totalCount} total count)

Keep it under 100 words, warm, and faith-aligned.`;

      const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: "You are NAJA, a faith-based AI companion." },
            { role: "user", content: prompt },
          ],
        }),
      });

      const aiData = await aiResponse.json();
      const summary = aiData.choices?.[0]?.message?.content || '';

      return new Response(JSON.stringify({ stats, summary }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ stats }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('weekly-summary error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});