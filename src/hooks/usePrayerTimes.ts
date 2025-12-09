// Hook for managing prayer times with user location
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "./useProfile";

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
}

export function usePrayerTimes() {
  const { profile } = useProfile();
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState<string>("--:--");

  const fetchPrayerTimes = useCallback(async () => {
    try {
      setLoading(true);
      
      // Use profile location or default
      const lat = profile?.latitude ?? 25.2;
      const lon = profile?.longitude ?? 55.3;
      const method = profile?.prayer_method ?? "MWL";

      const { data, error } = await supabase.functions.invoke("prayer-times", {
        body: { latitude: lat, longitude: lon, method },
      });

      if (error) throw error;

      const now = new Date();
      const currentTime = now.getHours() * 60 + now.getMinutes();

      const prayersList = [
        { name: "Fajr", time: data.fajr },
        { name: "Dhuhr", time: data.dhuhr },
        { name: "Asr", time: data.asr },
        { name: "Maghrib", time: data.maghrib },
        { name: "Isha", time: data.isha },
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

      // Build prayers array with completion status
      const prayers: PrayerTime[] = prayersList.map((p) => {
        const [hours, minutes] = p.time.split(":").map(Number);
        const prayerTime = hours * 60 + minutes;
        const isCompleted = prayerTime < currentTime;
        const isNext = p.name === nextPrayer;
        return { ...p, isCompleted, isNext };
      });

      setPrayerTimes({
        fajr: data.fajr,
        dhuhr: data.dhuhr,
        asr: data.asr,
        maghrib: data.maghrib,
        isha: data.isha,
        sunrise: data.sunrise,
        next: nextPrayer,
        nextInMinutes,
        prayers,
      });
    } catch (error) {
      console.error("Failed to fetch prayer times:", error);
      // Fallback data
      setPrayerTimes({
        fajr: "05:32",
        dhuhr: "12:45",
        asr: "03:58",
        maghrib: "06:15",
        isha: "07:42",
        next: "Asr",
        nextInMinutes: 45,
        prayers: [
          { name: "Fajr", time: "05:32", isCompleted: true, isNext: false },
          { name: "Dhuhr", time: "12:45", isCompleted: true, isNext: false },
          { name: "Asr", time: "03:58", isCompleted: false, isNext: true },
          { name: "Maghrib", time: "06:15", isCompleted: false, isNext: false },
          { name: "Isha", time: "07:42", isCompleted: false, isNext: false },
        ],
      });
    } finally {
      setLoading(false);
    }
  }, [profile?.latitude, profile?.longitude, profile?.prayer_method]);

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

      // If no prayer found today, next is Fajr tomorrow
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
