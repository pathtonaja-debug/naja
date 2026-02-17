// Hook for managing prayer times with Aladhan API (free, no key required)
// Uses location from localStorage — local-first, no Supabase dependency
import { useState, useEffect, useCallback } from "react";
import { getUserLocation } from "@/services/locationStore";
import { fetchPrayerData } from "@/services/prayerApiService";

export interface PrayerTime {
  name: string;
  time: string;
  isCompleted: boolean;
  isNext: boolean;
}

export interface PrayerTimesData {
  fajr: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  sunrise?: string;
  next: string;
  nextInMinutes: number;
  prayers: PrayerTime[];
  hijriDate?: string;
  gregorianDate?: string;
}

const PRAYER_NAMES = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;

function stripTimezone(timeStr: string): string {
  return timeStr?.split(" ")[0] || timeStr;
}

export function usePrayerTimes() {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState<string>("--:--");

  const fetchPrayerTimes = useCallback(async () => {
    try {
      setLoading(true);

      const location = getUserLocation();
      const lat = location?.lat ?? 25.2;
      const lng = location?.lng ?? 55.3;
      const timezone = location?.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone;
      const method = location?.method ?? 2;

      const data = await fetchPrayerData(lat, lng, timezone, method);

      if (!data) throw new Error("No prayer data");

      const timings = data.prayers;
      const fajr = stripTimezone(timings.Fajr);
      const dhuhr = stripTimezone(timings.Dhuhr);
      const asr = stripTimezone(timings.Asr);
      const maghrib = stripTimezone(timings.Maghrib);
      const isha = stripTimezone(timings.Isha);
      const sunrise = stripTimezone(timings.Sunrise);

      const now = new Date();
      const currentTime = now.getHours() * 60 + now.getMinutes();

      const prayersList = [
        { name: "Fajr", time: fajr },
        { name: "Dhuhr", time: dhuhr },
        { name: "Asr", time: asr },
        { name: "Maghrib", time: maghrib },
        { name: "Isha", time: isha },
      ];

      // Calculate next prayer
      let nextPrayer = "Fajr";
      let nextInMinutes = 0;

      for (const prayer of prayersList) {
        const [hours, minutes] = prayer.time.split(":").map(Number);
        const prayerTime = hours * 60 + minutes;

        if (prayerTime > currentTime) {
          nextPrayer = prayer.name;
          nextInMinutes = prayerTime - currentTime;
          break;
        }
      }

      // If no prayer found today, next is Fajr tomorrow
      if (nextInMinutes === 0) {
        const [hours, minutes] = prayersList[0].time.split(":").map(Number);
        const fajrTime = hours * 60 + minutes;
        nextInMinutes = 24 * 60 - currentTime + fajrTime;
      }

      // Build prayers array
      const prayers: PrayerTime[] = prayersList.map((p) => {
        const [hours, minutes] = p.time.split(":").map(Number);
        const prayerTime = hours * 60 + minutes;
        const isCompleted = prayerTime < currentTime;
        const isNext = p.name === nextPrayer;
        return { ...p, isCompleted, isNext };
      });

      setPrayerTimes({
        fajr,
        dhuhr,
        asr,
        maghrib,
        isha,
        sunrise,
        next: nextPrayer,
        nextInMinutes,
        prayers,
        hijriDate: data.hijri.formatted,
        gregorianDate: data.gregorian.formatted,
      });
    } catch (error) {
      console.error("Failed to fetch prayer times:", error);
      // Fallback data
      setPrayerTimes({
        fajr: "05:32",
        dhuhr: "12:45",
        asr: "15:58",
        maghrib: "18:15",
        isha: "19:42",
        next: "Asr",
        nextInMinutes: 45,
        prayers: [
          { name: "Fajr", time: "05:32", isCompleted: true, isNext: false },
          { name: "Dhuhr", time: "12:45", isCompleted: true, isNext: false },
          { name: "Asr", time: "15:58", isCompleted: false, isNext: true },
          { name: "Maghrib", time: "18:15", isCompleted: false, isNext: false },
          { name: "Isha", time: "19:42", isCompleted: false, isNext: false },
        ],
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Update countdown every minute
  useEffect(() => {
    if (!prayerTimes) return;

    const updateCountdown = () => {
      const now = new Date();
      const currentTime = now.getHours() * 60 + now.getMinutes();

      const prayersList = [
        { name: "Fajr", time: prayerTimes.fajr },
        { name: "Dhuhr", time: prayerTimes.dhuhr },
        { name: "Asr", time: prayerTimes.asr },
        { name: "Maghrib", time: prayerTimes.maghrib },
        { name: "Isha", time: prayerTimes.isha },
      ];

      let nextInMinutes = 0;

      for (const prayer of prayersList) {
        const [hours, minutes] = prayer.time.split(":").map(Number);
        const prayerTime = hours * 60 + minutes;

        if (prayerTime > currentTime) {
          nextInMinutes = prayerTime - currentTime;
          break;
        }
      }

      if (nextInMinutes === 0) {
        const [hours, minutes] = prayersList[0].time.split(":").map(Number);
        const fajrTime = hours * 60 + minutes;
        nextInMinutes = 24 * 60 - currentTime + fajrTime;
      }

      const hours = Math.floor(nextInMinutes / 60);
      const mins = nextInMinutes % 60;
      setCountdown(`${hours}h ${mins}m`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);

    return () => clearInterval(interval);
  }, [prayerTimes]);

  useEffect(() => {
    fetchPrayerTimes();
  }, [fetchPrayerTimes]);

  return { prayerTimes, loading, countdown, refetch: fetchPrayerTimes };
}
