// Location service using OpenStreetMap Nominatim API (free, no key required)

export interface CityResult {
  name: string;
  displayName: string;
  lat: number;
  lng: number;
}

export async function searchCity(query: string): Promise<CityResult[]> {
  if (!query || query.length < 3) return [];

  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5`;
    const res = await fetch(url, {
      headers: { "Accept-Language": "en" },
    });

    if (!res.ok) throw new Error("Nominatim request failed");

    const data = await res.json();

    return data.map((item: any) => ({
      name: item.display_name?.split(",")[0]?.trim() || item.display_name,
      displayName: item.display_name,
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
    }));
  } catch (error) {
    console.error("City search failed:", error);
    return [];
  }
}
