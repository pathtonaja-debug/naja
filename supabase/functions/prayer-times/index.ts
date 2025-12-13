import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 30; // requests per minute
const RATE_WINDOW_MS = 60000; // 1 minute

function isRateLimited(identifier: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(identifier);
  
  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + RATE_WINDOW_MS });
    return false;
  }
  
  if (entry.count >= RATE_LIMIT) {
    return true;
  }
  
  entry.count++;
  return false;
}

const prayerTimesSchema = z.object({
  latitude: z.number().min(-90, "Latitude must be between -90 and 90").max(90, "Latitude must be between -90 and 90"),
  longitude: z.number().min(-180, "Longitude must be between -180 and 180").max(180, "Longitude must be between -180 and 180"),
  method: z.enum(['MWL', 'ISNA', 'Egypt', 'Makkah', 'Karachi', 'Tehran', 'Jafari']).default('MWL'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format").optional()
});

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify JWT and get user
    const authHeader = req.headers.get('authorization');
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    // Create client with user's auth for verification
    const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader || '' } },
    });
    
    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser();
    
    if (authError || !user) {
      console.error('[prayer-times] Authentication failed:', authError?.message);
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Apply rate limiting using user ID
    if (isRateLimited(user.id)) {
      console.warn(`[prayer-times] Rate limit exceeded for user: ${user.id}`);
      return new Response(
        JSON.stringify({ error: 'Too many requests. Please try again later.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body = await req.json();
    
    // Validate input
    const validation = prayerTimesSchema.safeParse(body);
    if (!validation.success) {
      console.error('[prayer-times] Validation error:', validation.error.flatten());
      return new Response(
        JSON.stringify({ 
          error: 'Invalid request parameters', 
          details: validation.error.flatten().fieldErrors 
        }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    const { latitude, longitude, method, date } = validation.data;
    const queryDate = date || new Date().toISOString().split('T')[0];

    // Use service role for database operations (server-side only)
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Round coordinates to 1 decimal place for cache key (privacy + efficiency)
    const roundedLat = Math.round(latitude * 10) / 10;
    const roundedLng = Math.round(longitude * 10) / 10;

    // Check cache first
    const { data: cached } = await supabaseAdmin
      .from('prayer_times_cache')
      .select('times')
      .eq('latitude', roundedLat)
      .eq('longitude', roundedLng)
      .eq('method', method)
      .eq('date', queryDate)
      .maybeSingle();

    if (cached?.times) {
      console.log(`[prayer-times] Cache hit for ${roundedLat},${roundedLng}`);
      return new Response(JSON.stringify(cached.times), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch from AlAdhan API
    const [day, month, year] = queryDate.split('-').reverse();
    const url = `https://api.aladhan.com/v1/timings/${day}-${month}-${year}?latitude=${latitude}&longitude=${longitude}&method=${method}`;
    
    console.log('[prayer-times] Fetching from AlAdhan:', url);
    const response = await fetch(url);
    const data = await response.json();

    if (data.code !== 200 || !data.data?.timings) {
      console.error('[prayer-times] AlAdhan API error:', data);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch prayer times from external service' }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const times = {
      fajr: data.data.timings.Fajr,
      dhuhr: data.data.timings.Dhuhr,
      asr: data.data.timings.Asr,
      maghrib: data.data.timings.Maghrib,
      isha: data.data.timings.Isha,
      sunrise: data.data.timings.Sunrise,
      midnight: data.data.timings.Midnight,
    };

    // Cache the result using rounded coordinates for privacy
    const { error: insertError } = await supabaseAdmin.from('prayer_times_cache').insert({
      latitude: roundedLat,
      longitude: roundedLng,
      method,
      date: queryDate,
      times,
    });

    if (insertError) {
      console.warn('[prayer-times] Cache insert failed:', insertError.message);
      // Don't fail the request if caching fails
    } else {
      console.log('[prayer-times] Cached new prayer times');
    }

    return new Response(JSON.stringify(times), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[prayer-times] Error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
