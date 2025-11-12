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
    const { latitude, longitude, method = 'MWL', date } = await req.json();
    
    if (!latitude || !longitude) {
      throw new Error('Latitude and longitude are required');
    }

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