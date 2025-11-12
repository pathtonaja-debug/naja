import { supabase } from "@/integrations/supabase/client";

export interface PrayerTimes {
  fajr: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  sunrise?: string;
  midnight?: string;
  next: string;
  nextInMinutes: number;
}

function calculateNextPrayer(times: any): { next: string; nextInMinutes: number } {
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();
  
  const prayers = [
    { name: 'Fajr', time: times.fajr },
    { name: 'Dhuhr', time: times.dhuhr },
    { name: 'Asr', time: times.asr },
    { name: 'Maghrib', time: times.maghrib },
    { name: 'Isha', time: times.isha },
  ];
  
  for (const prayer of prayers) {
    const [hours, minutes] = prayer.time.split(':').map(Number);
    const prayerTime = hours * 60 + minutes;
    
    if (prayerTime > currentTime) {
      return {
        next: prayer.name,
        nextInMinutes: prayerTime - currentTime,
      };
    }
  }
  
  // If no prayer found today, next is Fajr tomorrow
  const [hours, minutes] = prayers[0].time.split(':').map(Number);
  const fajrTime = hours * 60 + minutes;
  return {
    next: 'Fajr',
    nextInMinutes: (24 * 60 - currentTime) + fajrTime,
  };
}

export async function getTodayPrayerTimes(
  lat: number = 25.2, 
  lon: number = 55.3, 
  method: string = 'MWL'
): Promise<PrayerTimes> {
  try {
    const { data, error } = await supabase.functions.invoke('prayer-times', {
      body: { latitude: lat, longitude: lon, method },
    });
    
    if (error) throw error;
    
    const { next, nextInMinutes } = calculateNextPrayer(data);
    
    return {
      ...data,
      next,
      nextInMinutes,
    };
  } catch (error) {
    console.error('Error fetching prayer times:', error);
    // Fallback to mock data
    return {
      fajr: "05:32",
      dhuhr: "12:45",
      asr: "03:58",
      maghrib: "06:15",
      isha: "07:42",
      next: "Asr",
      nextInMinutes: 45
    };
  }
}
