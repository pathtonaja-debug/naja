import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const QUIZ_TOPICS = [
  "Aqeedah (Islamic Beliefs)",
  "Fiqh Basics (Islamic Jurisprudence)",
  "Seerah (Life of Prophet Muhammad ﷺ)",
  "Qur'an Knowledge",
  "Hadith",
  "Islamic History",
  "Adab (Islamic Manners and Etiquette)",
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);
    
    const today = new Date().toISOString().split("T")[0];
    
    // Check if quiz already exists for today
    const { data: existingQuiz } = await supabase
      .from("daily_quizzes")
      .select("*")
      .eq("quiz_date", today)
      .single();

    if (existingQuiz) {
      return new Response(JSON.stringify(existingQuiz), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Select a random topic
    const topic = QUIZ_TOPICS[Math.floor(Math.random() * QUIZ_TOPICS.length)];

    const systemPrompt = `You are a knowledgeable Islamic educator creating quiz questions. 
Your content must be:
- Respectful and appropriate for all ages
- Non-controversial and avoid scholarly disagreements
- Educational and encouraging
- Based on widely accepted Islamic knowledge
- Free from fear-based or guilt-based language

Generate exactly 4 multiple-choice questions about ${topic}.

Return ONLY valid JSON in this exact format (no markdown, no code blocks):
{
  "questions": [
    {
      "question": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct_index": 0,
      "explanation": "Brief, encouraging explanation of the correct answer."
    }
  ]
}`;

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
          { role: "user", content: `Generate 4 multiple-choice questions about ${topic} for today's Islamic knowledge quiz.` }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content received from AI");
    }

    // Parse the JSON response
    let quizData;
    try {
      // Remove any markdown code blocks if present
      const cleanContent = content.replace(/```json\n?|\n?```/g, "").trim();
      quizData = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      throw new Error("Failed to parse quiz data");
    }

    // Validate the structure
    if (!quizData.questions || !Array.isArray(quizData.questions) || quizData.questions.length === 0) {
      throw new Error("Invalid quiz structure");
    }

    // Save to database
    const { data: newQuiz, error: insertError } = await supabase
      .from("daily_quizzes")
      .insert({
        quiz_date: today,
        topic: topic,
        questions: quizData.questions,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Insert error:", insertError);
      throw new Error("Failed to save quiz");
    }

    return new Response(JSON.stringify(newQuiz), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("daily-quiz error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
