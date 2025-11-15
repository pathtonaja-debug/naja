import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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
    const body = await req.json();
    
    // Validate input
    const validation = prayerTimesSchema.safeParse(body);
    if (!validation.success) {
      console.error('Validation error:', validation.error.flatten());
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

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const queryDate = date || new Date().toISOString().split('T')[0];

    // Check cache first
    const { data: cached } = await supabase
      .from('prayer_times_cache')
      .select('times')
      .eq('latitude', latitude)
      .eq('longitude', longitude)
      .eq('method', method)
      .eq('date', queryDate)
      .single();

    if (cached) {
      console.log('Returning cached prayer times');
      return new Response(JSON.stringify(cached.times), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch from AlAdhan API
    const [day, month, year] = queryDate.split('-').reverse();
    const url = `https://api.aladhan.com/v1/timings/${day}-${month}-${year}?latitude=${latitude}&longitude=${longitude}&method=${method}`;
    
    console.log('Fetching from AlAdhan:', url);
    const response = await fetch(url);
    const data = await response.json();

    if (data.code !== 200 || !data.data?.timings) {
      throw new Error('Failed to fetch prayer times from AlAdhan');
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

    // Cache the result
    await supabase.from('prayer_times_cache').insert({
      latitude,
      longitude,
      method,
      date: queryDate,
      times,
    });

    console.log('Cached new prayer times');
    return new Response(JSON.stringify(times), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in prayer-times:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});