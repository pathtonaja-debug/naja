import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function isRamadan(date: Date): boolean {
  const year = date.getFullYear();
  const ranges: Record<number, [number, number, number, number]> = {
    2025: [3, 1, 3, 30],
    2026: [2, 18, 3, 19],
    2027: [2, 8, 3, 9],
  };
  const r = ranges[year];
  if (!r) return false;
  const start = new Date(year, r[0] - 1, r[1]);
  const end = new Date(year, r[2] - 1, r[3]);
  return date >= start && date <= end;
}

function parsePrayerTime(timeStr: string, timezone: string): Date {
  const [h, m] = timeStr.split(':').map(Number);
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone || 'UTC',
    year: 'numeric', month: '2-digit', day: '2-digit',
  });
  const dateStr = formatter.format(now);
  return new Date(`${dateStr}T${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`);
}

async function sendFCM(token: string, title: string, body: string, data: Record<string, string> = {}) {
  const serverKey = Deno.env.get('FIREBASE_SERVER_KEY')!;
  const res = await fetch(`https://fcm.googleapis.com/fcm/send`, {
    method: 'POST',
    headers: {
      'Authorization': `key=${serverKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      to: token,
      notification: { title, body, sound: 'default', badge: '1' },
      data,
      priority: 'high',
      apns: { payload: { aps: { sound: 'default', badge: 1 } } },
    }),
  });
  return res.json();
}

async function fetchHadith(lang: 'en' | 'fr'): Promise<{ text: string; source: string }> {
  const id = Math.floor(Math.random() * 500) + 1;
  const res = await fetch(`https://hadeethenc.com/api/v1/hadeeths/one/?id=${id}&language=${lang}`);
  const data = await res.json();
  return { text: data.hadeeth || data.title || '', source: data.attribution || '' };
}

async function fetchQuranVerse(lang: 'en' | 'fr'): Promise<{ text: string; ref: string }> {
  const edition = lang === 'fr' ? 'fr.hamidullah' : 'en.asad';
  const ayah = Math.floor(Math.random() * 200) + 1;
  const res = await fetch(`https://api.alquran.cloud/v1/ayah/${ayah}/${edition}`);
  const data = await res.json();
  return {
    text: data.data?.text || '',
    ref: `${data.data?.surah?.englishName} ${data.data?.numberInSurah}`,
  };
}

function isWithinWindow(targetDate: Date, nowUtc: Date, windowMinutes = 3): boolean {
  const diff = Math.abs(targetDate.getTime() - nowUtc.getTime()) / 60000;
  return diff <= windowMinutes;
}

function isClockTime(clockTime: string, timezone: string, nowUtc: Date, windowMinutes = 3): boolean {
  const [h, m] = clockTime.split(':').map(Number);
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone || 'UTC',
    hour: '2-digit', minute: '2-digit', hour12: false,
  });
  const parts = formatter.formatToParts(nowUtc);
  const currentH = parseInt(parts.find(p => p.type === 'hour')?.value || '0');
  const currentM = parseInt(parts.find(p => p.type === 'minute')?.value || '0');
  const currentTotalMin = currentH * 60 + currentM;
  const targetTotalMin = h * 60 + m;
  return Math.abs(currentTotalMin - targetTotalMin) <= windowMinutes;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, serviceKey);

  const nowUtc = new Date();

  const { data: subscriptions, error } = await supabase
    .from('push_subscriptions')
    .select(`
      token, platform, user_id,
      profiles!inner (
        latitude, longitude, prayer_method,
        timezone, language, notifications_enabled
      )
    `)
    .eq('profiles.notifications_enabled', true)
    .not('profiles.latitude', 'is', null);

  if (error || !subscriptions?.length) {
    return new Response(JSON.stringify({ sent: 0, error: error?.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const prayers = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'] as const;
  type Prayer = typeof prayers[number];

  const prayerCopy: Record<Prayer, {
    before: Record<string, (r: boolean) => { title: string; body: string }>;
    atTime: Record<string, (r: boolean) => { title: string; body: string }>;
  }> = {
    fajr: {
      before: {
        en: (r) => ({ title: '🌙 Fajr in 10 minutes', body: r ? 'Suhoor time is ending — rise and pray Fajr' : 'Rise for the best prayer of the day' }),
        fr: (r) => ({ title: '🌙 Fajr dans 10 min', body: r ? 'Le Suhoor se termine — lève-toi et prie Fajr' : 'Lève-toi pour la meilleure prière du jour' }),
      },
      atTime: {
        en: () => ({ title: "🌅 It's Fajr time", body: 'Allahu Akbar — begin your day with prayer' }),
        fr: () => ({ title: "🌅 C'est l'heure de Fajr", body: 'Allahu Akbar — commence ta journée par la prière' }),
      },
    },
    dhuhr: {
      before: {
        en: () => ({ title: '☀️ Dhuhr in 10 minutes', body: 'Pause and return to Allah in the middle of your day' }),
        fr: () => ({ title: '☀️ Dhohr dans 10 min', body: 'Fais une pause et reviens à Allah au milieu de ta journée' }),
      },
      atTime: {
        en: () => ({ title: "☀️ It's Dhuhr time", body: 'Step away and pray — even 5 minutes changes everything' }),
        fr: () => ({ title: "☀️ C'est l'heure de Dhohr", body: 'Pose tout et prie — même 5 minutes changent tout' }),
      },
    },
    asr: {
      before: {
        en: () => ({ title: '🌤️ Asr in 10 minutes', body: "Don't let this prayer slip away" }),
        fr: () => ({ title: '🌤️ Asr dans 10 min', body: "Ne laisse pas cette prière te passer" }),
      },
      atTime: {
        en: () => ({ title: "🌤️ It's Asr time", body: 'The most feared missed prayer — guard it' }),
        fr: () => ({ title: "🌤️ C'est l'heure de Asr", body: 'La prière la plus souvent manquée — protège-la' }),
      },
    },
    maghrib: {
      before: {
        en: (r) => ({ title: '🌇 Maghrib in 10 minutes', body: r ? '🍽️ Iftar is near — prepare to break your fast' : 'The day draws to a close — end it with prayer' }),
        fr: (r) => ({ title: '🌇 Maghrib dans 10 min', body: r ? "🍽️ L'Iftar approche — prépare-toi à rompre le jeûne" : 'La journée touche à sa fin — termine-la par la prière' }),
      },
      atTime: {
        en: (r) => ({ title: r ? "🍽️ Iftar time" : "🌇 It's Maghrib time", body: r ? 'Bismillah — break your fast. Allahu Akbar.' : 'The sun has set — answer the call' }),
        fr: (r) => ({ title: r ? "🍽️ C'est l'heure de l'Iftar" : "🌇 C'est l'heure de Maghrib", body: r ? 'Bismillah — romps ton jeûne. Allahu Akbar.' : "Le soleil s'est couché — réponds à l'appel" }),
      },
    },
    isha: {
      before: {
        en: () => ({ title: '🌙 Isha in 10 minutes', body: 'End your day with Allah — close the circle' }),
        fr: () => ({ title: '🌙 Isha dans 10 min', body: 'Termine ta journée avec Allah — ferme le cercle' }),
      },
      atTime: {
        en: () => ({ title: "🌙 It's Isha time", body: 'The final prayer of the day — make it count' }),
        fr: () => ({ title: "🌙 C'est l'heure de Isha", body: "La dernière prière du jour — fais-en sorte qu'elle compte" }),
      },
    },
  };

  let totalSent = 0;
  let hadithEN: { text: string; source: string } | null = null;
  let hadithFR: { text: string; source: string } | null = null;
  let verseEN: { text: string; ref: string } | null = null;
  let verseFR: { text: string; ref: string } | null = null;

  for (const sub of subscriptions) {
    const profile = (sub as any).profiles;
    const lang: 'en' | 'fr' = profile.language === 'fr' ? 'fr' : 'en';
    const tz = profile.timezone || 'UTC';
    const ramadan = isRamadan(nowUtc);

    const today = new Intl.DateTimeFormat('en-CA', { timeZone: tz }).format(nowUtc);
    const roundedLat = Math.round(profile.latitude * 10) / 10;
    const roundedLng = Math.round(profile.longitude * 10) / 10;

    const { data: cached } = await supabase
      .from('prayer_times_cache')
      .select('times')
      .eq('latitude', roundedLat)
      .eq('longitude', roundedLng)
      .eq('method', profile.prayer_method || 'MWL')
      .eq('date', today)
      .maybeSingle();

    if (!cached?.times) continue;
    const times = cached.times as Record<string, string>;

    async function shouldSend(type: string): Promise<boolean> {
      const { data } = await supabase
        .from('notification_log')
        .select('id')
        .eq('user_id', sub.user_id)
        .eq('notification_type', type)
        .gte('scheduled_for', `${today}T00:00:00`)
        .maybeSingle();
      return !data;
    }

    async function logAndSend(type: string, targetTime: Date, title: string, body: string) {
      const canSend = await shouldSend(type);
      if (!canSend) return;
      if (!isWithinWindow(targetTime, nowUtc)) return;
      await sendFCM(sub.token, title, body, { url: '/', type });
      await supabase.from('notification_log').insert({
        user_id: sub.user_id,
        notification_type: type,
        scheduled_for: targetTime.toISOString(),
      });
      totalSent++;
    }

    // === PRAYER NOTIFICATIONS ===
    for (const prayer of prayers) {
      const timeStr = times[prayer];
      if (!timeStr) continue;

      const prayerDate = parsePrayerTime(timeStr, tz);
      const beforeDate = new Date(prayerDate.getTime() - 10 * 60000);

      const copy = prayerCopy[prayer];
      const langCopy = copy.before[lang](ramadan);
      await logAndSend(`${prayer}_before`, beforeDate, langCopy.title, langCopy.body);

      const atCopy = copy.atTime[lang](ramadan);
      await logAndSend(`${prayer}_at`, prayerDate, atCopy.title, atCopy.body);
    }

    // === ENRICHMENT NOTIFICATIONS ===
    const fajrDate = parsePrayerTime(times.fajr, tz);

    // Hadith — Fajr +30min
    const hadithTime = new Date(fajrDate.getTime() + 30 * 60000);
    if (isWithinWindow(hadithTime, nowUtc) && await shouldSend('hadith')) {
      try {
        if (lang === 'fr') {
          if (!hadithFR) hadithFR = await fetchHadith('fr');
          await logAndSend('hadith', hadithTime, '📜 Hadith du Jour', hadithFR.text.slice(0, 100));
        } else {
          if (!hadithEN) hadithEN = await fetchHadith('en');
          await logAndSend('hadith', hadithTime, '📜 Hadith of the Day', hadithEN.text.slice(0, 100));
        }
      } catch { /* skip enrichment on API failure */ }
    }

    // Quran verse — Fajr +45min
    const verseTime = new Date(fajrDate.getTime() + 45 * 60000);
    if (isWithinWindow(verseTime, nowUtc) && await shouldSend('quran_verse')) {
      try {
        if (lang === 'fr') {
          if (!verseFR) verseFR = await fetchQuranVerse('fr');
          await logAndSend('quran_verse', verseTime, '✨ Verset du Jour', `${verseFR.text.slice(0, 100)} — ${verseFR.ref}`);
        } else {
          if (!verseEN) verseEN = await fetchQuranVerse('en');
          await logAndSend('quran_verse', verseTime, '✨ Verse of the Day', `${verseEN.text.slice(0, 100)} — ${verseEN.ref}`);
        }
      } catch { /* skip */ }
    }

    // Quran reading break — 11:00 AM
    if (isClockTime('11:00', tz, nowUtc) && await shouldSend('quran_break')) {
      const t = lang === 'fr'
        ? { title: '📖 Ton moment Coran', body: 'Prends 10 minutes pour lire quelques versets' }
        : { title: '📖 Your Quran moment', body: 'Take 10 minutes to read a few verses' };
      await logAndSend('quran_break', nowUtc, t.title, t.body);
    }

    // Dhikr break — 2:30 PM
    if (isClockTime('14:30', tz, nowUtc) && await shouldSend('dhikr')) {
      const t = lang === 'fr'
        ? { title: '📿 Moment de Dhikr', body: 'Prends une pause — SubhanAllah, Alhamdulillah, Allahu Akbar' }
        : { title: '📿 Time for Dhikr', body: 'Step away — SubhanAllah, Alhamdulillah, Allahu Akbar' };
      await logAndSend('dhikr', nowUtc, t.title, t.body);
    }

    // Prophet story — 4:30 PM
    if (isClockTime('16:30', tz, nowUtc) && await shouldSend('prophet_story')) {
      try {
        const storyRes = await fetch(`${supabaseUrl}/functions/v1/generate-learn-content`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${serviceKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'prophet_story_snippet', language: lang }),
        });
        const storyData = await storyRes.json();
        const snippet = storyData?.snippet || (lang === 'fr' ? 'Une leçon de la vie du Prophète ﷺ' : 'A lesson from the life of the Prophet ﷺ');
        const t = lang === 'fr'
          ? { title: '🌿 De la Seerah', body: `${snippet} — ouvre l'appli pour lire la suite` }
          : { title: '🌿 From the Seerah', body: `${snippet} — open the app to read more` };
        await logAndSend('prophet_story', nowUtc, t.title, t.body);
      } catch { /* skip */ }
    }

    // Quiz prompt — 8:00 PM
    if (isClockTime('20:00', tz, nowUtc) && await shouldSend('quiz')) {
      const t = lang === 'fr'
        ? { title: '🎯 Quiz islamique du jour', body: "Teste tes connaissances — le quiz du jour t'attend" }
        : { title: '🎯 Daily Islamic Quiz', body: "Test your knowledge — today's quiz is waiting" };
      await logAndSend('quiz', nowUtc, t.title, t.body);
    }

    // Night Dua — Isha +20min
    const ishaDate = parsePrayerTime(times.isha, tz);
    const nightDuaTime = new Date(ishaDate.getTime() + 20 * 60000);
    if (isWithinWindow(nightDuaTime, nowUtc) && await shouldSend('night_dua')) {
      try {
        const duaRes = await fetch(`${supabaseUrl}/functions/v1/generate-dua`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${serviceKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ context: 'bedtime', language: lang }),
        });
        const duaData = await duaRes.json();
        const duaText = duaData?.dua || duaData?.text || '';
        const t = lang === 'fr'
          ? { title: '🤲 Dua du Soir', body: duaText.slice(0, 120) }
          : { title: '🤲 Night Dua', body: duaText.slice(0, 120) };
        await logAndSend('night_dua', nightDuaTime, t.title, t.body);
      } catch { /* skip */ }
    }

    // Reflection — Isha +35min
    const reflectionTime = new Date(ishaDate.getTime() + 35 * 60000);
    if (isWithinWindow(reflectionTime, nowUtc) && await shouldSend('reflection')) {
      const t = lang === 'fr'
        ? { title: '🌙 Avant de dormir...', body: "Comment as-tu servi Allah aujourd'hui ?" }
        : { title: '🌙 Before you sleep...', body: 'How did you serve Allah today? Open the app to reflect' };
      await logAndSend('reflection', reflectionTime, t.title, t.body);
    }
  }

  return new Response(JSON.stringify({ sent: totalSent }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});
