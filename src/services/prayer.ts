// Mock prayer times service - replace with AlAdhan API later
export interface PrayerTimes {
  fajr: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  next: string;
  nextInMinutes: number;
}

export async function getTodayPrayerTimes(lat: number = 25.2, lon: number = 55.3): Promise<PrayerTimes> {
  // TEMP: mock data (replace with AlAdhan API later)
  await new Promise(resolve => setTimeout(resolve, 300));
  
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
