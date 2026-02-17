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
  try {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const adj = getHijriAdj();

    let url = `https://api.aladhan.com/v1/calendar/${year}/${month}?latitude=${lat}&longitude=${lng}&method=${method}&timezonestring=${timezone}`;
    if (adj !== 0) {
      url += `&adjustment=${adj}`;
    }
    const res = await fetch(url);

    if (!res.ok) throw new Error("Aladhan API request failed");

    const json = await res.json();
    const todayData = json.data[day - 1];

    if (!todayData) throw new Error("No data for today");

    const hijri = todayData.date.hijri;
    const gregorian = todayData.date.gregorian;

    return {
      prayers: todayData.timings,
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
  } catch (error) {
    console.error("Failed to fetch prayer data from Aladhan:", error);
    return null;
  }
}
