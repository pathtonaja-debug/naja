// Location service using OpenStreetMap Nominatim API (free, no key required)

export interface CityResult {
  name: string;
  displayName: string;
  lat: number;
  lng: number;
  countryCode?: string;
}

export async function searchCity(query: string): Promise<CityResult[]> {
  if (!query || query.length < 3) return [];

  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&addressdetails=1`;
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
      countryCode: item.address?.country_code || undefined,
    }));
  } catch (error) {
    console.error("City search failed:", error);
    return [];
  }
}

export function getDefaultMethod(countryCode?: string): number {
  if (!countryCode) return 3;
  const map: Record<string, number> = {
    ae: 16, sa: 4, kw: 4, bh: 4, qa: 4, om: 4,
    eg: 5, pk: 1, bd: 1, in: 1, af: 1,
    fr: 12, sg: 11, my: 11,
    gb: 3, de: 3, us: 2, ca: 2,
  };
  return map[countryCode.toLowerCase()] ?? 3;
}
