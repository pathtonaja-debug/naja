// Location storage service — localStorage only, namespaced per project rules

const STORAGE_KEY = "naja_muslim_app_location";

export interface UserLocation {
  city: string;
  lat: number;
  lng: number;
  timezone: string;
  method: number;
}

export function saveUserLocation(location: UserLocation): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(location));
  } catch (error) {
    console.error("Failed to save location:", error);
  }
}

export function getUserLocation(): UserLocation | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as UserLocation;
  } catch {
    return null;
  }
}

export function clearUserLocation(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
