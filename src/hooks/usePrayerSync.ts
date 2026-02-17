// Hook for syncing prayer times + Hijri/Gregorian dates from Aladhan API
import { useState, useEffect, useCallback } from "react";
import { getUserLocation } from "@/services/locationStore";
import { fetchPrayerData, AladhanPrayerData } from "@/services/prayerApiService";

export interface PrayerSyncState {
  data: AladhanPrayerData | null;
  loading: boolean;
  hasLocation: boolean;
  cityName: string;
}

export function usePrayerSync() {
  const [state, setState] = useState<PrayerSyncState>({
    data: null,
    loading: true,
    hasLocation: false,
    cityName: "",
  });

  const load = useCallback(async () => {
    const location = getUserLocation();

    if (!location) {
      setState({ data: null, loading: false, hasLocation: false, cityName: "" });
      return;
    }

    setState((prev) => ({ ...prev, loading: true, hasLocation: true, cityName: location.city }));

    const data = await fetchPrayerData(
      location.lat,
      location.lng,
      location.timezone,
      location.method
    );

    setState({ data, loading: false, hasLocation: true, cityName: location.city });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { ...state, refetch: load };
}
