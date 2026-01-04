import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { openaiChatJSON } from "../_shared/openai.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const QUIZ_TOPICS = [
  "Aqeedah (Islamic Beliefs)",
  "Fiqh Basics (Everyday Worship)",
  "Seerah (Life of Prophet Muhammad ﷺ)",
  "Qur'an Knowledge",
  "Hadith Basics",
  "Islamic History",
  "Adab (Manners and Etiquette)",
];

type QuizQuestion = {
  question: string;
  options: string[];
  correct_index: number;
  explanation: string;
};

type QuizPayload = { questions: QuizQuestion[] };

function todayUTC(): string {
  return new Date().toISOString().slice(0, 10);
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return new Response(JSON.stringify({ error: "Supabase service role not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const today = todayUTC();
    console.log("[daily-quiz] Checking for existing quiz on:", today);

    const { data: existingQuiz, error: existingErr } = await supabase
      .from("daily_quizzes")
      .select("*")
      .eq("quiz_date", today)
      .maybeSingle();

    if (existingErr) {
      console.error("[daily-quiz] Existing lookup error:", existingErr);
    }

    if (existingQuiz) {
      console.log("[daily-quiz] Returning existing quiz");
      return new Response(JSON.stringify(existingQuiz), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const topic = QUIZ_TOPICS[Math.floor(Math.random() * QUIZ_TOPICS.length)];
    console.log("[daily-quiz] Generating new quiz for topic:", topic);

    const system = `You are a mainstream Islamic educator creating a simple daily quiz.

Rules:
- All ages, respectful
- Avoid controversial disputes and sectarian framing
- Educational, encouraging
- No politics
- No fear/guilt manipulation
- Return ONLY valid JSON in EXACT shape:

{
  "questions": [
    {
      "question": "Question text?",
      "options": ["A","B","C","D"],
      "correct_index": 0,
      "explanation": "Brief encouraging explanation."
    }
  ]
}

Generate EXACTLY 4 questions.`;

    const user = `Generate today's quiz: 4 multiple-choice questions about: ${topic}`;

    const quizData = await openaiChatJSON<QuizPayload>({
      system,
      user,
      maxTokens: 900,
      temperature: 0.6,
    });

    if (!quizData?.questions || !Array.isArray(quizData.questions) || quizData.questions.length !== 4) {
      console.error("[daily-quiz] Invalid quiz format from AI");
      return new Response(JSON.stringify({ error: "AI returned invalid quiz format" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Normalize/validate
    const normalized: QuizQuestion[] = quizData.questions.map((q) => ({
      question: String(q.question || "").trim(),
      options: Array.isArray(q.options) ? q.options.map((o) => String(o)).slice(0, 4) : ["A","B","C","D"],
      correct_index: Math.min(3, Math.max(0, Number(q.correct_index ?? 0))),
      explanation: String(q.explanation || "").trim(),
    })).filter(q => q.question && q.options.length === 4);

    if (normalized.length !== 4) {
      console.error("[daily-quiz] Quiz validation failed");
      return new Response(JSON.stringify({ error: "Quiz validation failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: newQuiz, error: insertError } = await supabase
      .from("daily_quizzes")
      .insert({
        quiz_date: today,
        topic,
        questions: normalized,
      })
      .select()
      .single();

    if (insertError) {
      console.error("[daily-quiz] Insert error:", insertError);
      return new Response(JSON.stringify({ error: "Failed to save quiz" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("[daily-quiz] Successfully created and saved new quiz");
    return new Response(JSON.stringify(newQuiz), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    const error = err as { status?: number; message?: string };
    const status = error?.status && Number.isFinite(error.status) ? error.status : 500;
    const message = error?.message || "Unknown error";
    console.error("[daily-quiz] Error:", message);
    return new Response(JSON.stringify({ error: message }), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
