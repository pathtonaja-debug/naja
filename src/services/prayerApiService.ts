// Prayer times service using Aladhan API (free, no key required)
// https://aladhan.com/prayer-times-api

export interface AladhanPrayerData {
  prayers: Record<string, string>;
  hijri: {
    date: string;
    day: string;
    month: { number: number; en: string; ar: string };
    year: string;
    designation: { abbreviated: string; expanded: string };
    formatted: string; // e.g. "15 Sha'ban 1446 AH"
  };
  gregorian: {
    date: string;
    day: string;
    month: { number: number; en: string };
    year: string;
    formatted: string; // e.g. "17 February 2026"
  };
}

function getHijriAdj(): number {
  try {
    const v = localStorage.getItem('naja_hijri_adjustment');
    if (v !== null) return parseInt(v, 10) || 0;
  } catch { /* ignore */ }
  return 0;
}

export async function fetchPrayerData(
  lat: number,
  lng: number,
  timezone: string,
  method: number = 2
): Promise<AladhanPrayerData | null> {
  // Check sessionStorage cache first
  const today = new Date();
  const cacheKey = `naja_prayer_cache_${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}_${lat.toFixed(2)}_${lng.toFixed(2)}_${method}`;
  try {
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) return JSON.parse(cached) as AladhanPrayerData;
  } catch { /* ignore */ }

  try {
    const adj = getHijriAdj();

    // When user has an adjustment, we fetch the adjusted Gregorian day instead
    // because the Aladhan `adjustment` param is unreliable for shifting dates.
    const now = new Date();
    const targetDate = new Date(now);
    if (adj !== 0) {
      targetDate.setDate(targetDate.getDate() + adj);
    }

    const year = targetDate.getFullYear();
    const month = targetDate.getMonth() + 1;
    const day = targetDate.getDate();

    const url = `https://api.aladhan.com/v1/calendar/${year}/${month}?latitude=${lat}&longitude=${lng}&method=${method}&timezonestring=${timezone}`;
    const res = await fetch(url);

    if (!res.ok) throw new Error("Aladhan API request failed");

    const json = await res.json();
    const dayData = json.data[day - 1];

    if (!dayData) throw new Error("No data for target day");

    const hijri = dayData.date.hijri;
    const gregorian = dayData.date.gregorian;

    // Use prayer timings from today (not the shifted day) for salah times
    let prayerTimings = dayData.timings;
    if (adj !== 0) {
      const todayYear = now.getFullYear();
      const todayMonth = now.getMonth() + 1;
      const todayDay = now.getDate();
      // If we shifted to a different month, fetch today's month too
      if (todayMonth !== month || todayYear !== year) {
        const todayUrl = `https://api.aladhan.com/v1/calendar/${todayYear}/${todayMonth}?latitude=${lat}&longitude=${lng}&method=${method}&timezonestring=${timezone}`;
        const todayRes = await fetch(todayUrl);
        if (todayRes.ok) {
          const todayJson = await todayRes.json();
          const todayData = todayJson.data[todayDay - 1];
          if (todayData) prayerTimings = todayData.timings;
        }
      } else {
        // Same month, just grab today's entry
        const todayData = json.data[todayDay - 1];
        if (todayData) prayerTimings = todayData.timings;
      }
    }

    const result: AladhanPrayerData = {
      prayers: prayerTimings,
      hijri: {
        date: hijri.date,
        day: hijri.day,
        month: hijri.month,
        year: hijri.year,
        designation: hijri.designation,
        formatted: `${hijri.day} ${hijri.month.en} ${hijri.year} AH`,
      },
      gregorian: {
        date: gregorian.date,
        day: gregorian.day,
        month: gregorian.month,
        year: gregorian.year,
        formatted: `${gregorian.day} ${gregorian.month.en} ${gregorian.year}`,
      },
    };

    // Cache in sessionStorage
    try { sessionStorage.setItem(cacheKey, JSON.stringify(result)); } catch { /* ignore */ }

    return result;
  } catch (error) {
    console.error("Failed to fetch prayer data from Aladhan:", error);
    return null;
  }
}
