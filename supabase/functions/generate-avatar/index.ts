import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { validateAvatarRequest } from "./validation.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    
    // Validate input
    const validation = validateAvatarRequest(body);
    if (!validation.isValid) {
      return new Response(
        JSON.stringify({ error: validation.error }), 
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { gender, skinTone, hijab, beard, outfit } = validation.validated!;
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Build prompt based on parameters
    const modestGuidelines = "modest Islamic clothing, respectful, professional illustration";
    const styleGuide = "Disney Pixar style, 3D rendered, warm lighting, soft shadows, clean background";
    
    let appearanceDetails = `${skinTone.replace("-", " ")} skin tone`;
    
    if (gender === "female") {
      if (hijab === "classic") {
        appearanceDetails += ", wearing classic hijab";
      } else if (hijab === "draped") {
        appearanceDetails += ", wearing draped hijab";
      }
    } else if (gender === "male") {
      if (beard === "short") {
        appearanceDetails += ", short neat beard";
      } else if (beard === "trimmed") {
        appearanceDetails += ", trimmed beard";
      } else if (beard === "full") {
        appearanceDetails += ", full beard";
      }
    }
    
    appearanceDetails += `, ${outfit.replace("-", " ")}`;

    const basePrompt = `Full body portrait of a ${gender} Islamic companion character, ${appearanceDetails}, ${modestGuidelines}, ${styleGuide}, standing pose, friendly expression, 3:5 aspect ratio`;

    // Generate 4 variations
    const variations = [];
    const variantPrompts = [
      `${basePrompt}, slight smile, hands by sides`,
      `${basePrompt}, warm gentle smile, one hand raised in welcoming gesture`,
      `${basePrompt}, serene peaceful expression, hands clasped in front`,
      `${basePrompt}, friendly approachable smile, relaxed natural pose`,
    ];

    for (let i = 0; i < 4; i++) {
      console.log(`Generating variant ${i + 1}`);
      
      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash-image",
          messages: [
            {
              role: "user",
              content: variantPrompts[i]
            }
          ],
          modalities: ["image", "text"]
        }),
      });

      if (!response.ok) {
        console.error(`Failed to generate variant ${i + 1}:`, response.status);
        if (response.status === 429) {
          return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        if (response.status === 402) {
          return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits." }), {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        throw new Error('Image generation failed');
      }

      const data = await response.json();
      const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
      
      if (imageUrl) {
        variations.push({
          id: i + 1,
          imageData: imageUrl, // base64 data URL
        });
      }
    }

    if (variations.length === 0) {
      throw new Error('No variants generated');
    }

    return new Response(JSON.stringify({ variations }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[generate-avatar] Error:", error);
    return new Response(
      JSON.stringify({ error: "Avatar generation failed. Please try again." }), 
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
