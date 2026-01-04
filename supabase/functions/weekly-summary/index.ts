import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { openaiChatText } from "../_shared/openai.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function isoDateUTC(d: Date): string {
  return d.toISOString().slice(0, 10);
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing Authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnon = Deno.env.get("SUPABASE_ANON_KEY") || Deno.env.get("SUPABASE_PUBLISHABLE_KEY");
    if (!supabaseUrl || !supabaseAnon) {
      return new Response(JSON.stringify({ error: "Supabase anon key not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(supabaseUrl, supabaseAnon, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: userData, error: userErr } = await supabase.auth.getUser();
    if (userErr || !userData?.user) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const user = userData.user;

    console.log("[weekly-summary] Fetching data for user:", user.id);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setUTCDate(sevenDaysAgo.getUTCDate() - 7);
    const dateStr = isoDateUTC(sevenDaysAgo);

    const { data: reflections } = await supabase
      .from("reflections")
      .select("*")
      .eq("user_id", user.id)
      .gte("date", dateStr)
      .order("date", { ascending: false });

    const { data: habitLogs } = await supabase
      .from("habit_logs")
      .select("*, habits(*)")
      .eq("user_id", user.id)
      .gte("date", dateStr);

    const { data: dhikrSessions } = await supabase
      .from("dhikr_sessions")
      .select("*")
      .eq("user_id", user.id)
      .gte("date", dateStr);

    interface HabitLog {
      completed?: boolean;
    }

    interface DhikrSession {
      count?: number;
    }

    const stats = {
      reflections: reflections?.length || 0,
      habits: {
        completed: habitLogs?.filter((l: HabitLog) => l.completed).length || 0,
        total: habitLogs?.length || 0,
      },
      dhikr: {
        sessions: dhikrSessions?.length || 0,
        totalCount: dhikrSessions?.reduce((sum: number, s: DhikrSession) => sum + (Number(s.count) || 0), 0) || 0,
      },
    };

    console.log("[weekly-summary] Stats:", stats);

    const system = `You are NAJA, a warm faith-aligned companion.
Rules:
- Under 100 words
- Encouraging, gentle, hopeful
- No fiqh rulings, no judgment
- No politics
- Avoid certainty claims like "Allah will definitely..."
- Mention 1 practical next step`;

    const prompt = `Write a brief weekly spiritual summary for a Muslim user based on:
- ${stats.reflections} reflection entries
- ${stats.habits.completed}/${stats.habits.total} habits completed
- ${stats.dhikr.sessions} dhikr sessions (${stats.dhikr.totalCount} total count)
Return plain text only.`;

    const summary = await openaiChatText({
      system,
      user: prompt,
      maxTokens: 200,
      temperature: 0.8,
    });

    console.log("[weekly-summary] Successfully generated summary");

    return new Response(JSON.stringify({ stats, summary: summary.trim() }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    const error = err as { status?: number; message?: string };
    const status = error?.status && Number.isFinite(error.status) ? error.status : 500;
    const message = error?.message || "Summary generation failed. Please try again.";
    console.error("[weekly-summary] Error:", message);
    return new Response(JSON.stringify({ error: message }), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
