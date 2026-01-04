/**
 * Islamic Calendar API Service
 * Uses Aladhan API as source of truth for accurate Hijri dates
 * Implements stale-while-revalidate caching pattern
 */

// Types
export interface HijriDate {
  day: number;
  month: number;
  year: number;
  monthName: string;
}

export interface CalendarDay {
  gregorianISO: string;
  hijri: HijriDate;
}

export interface CalendarMonth {
  year: number;
  month: number;
  days: CalendarDay[];
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

// Cache TTLs in ms
const CACHE_TTL = {
  TODAY: 6 * 60 * 60 * 1000, // 6 hours
  MONTH: 7 * 24 * 60 * 60 * 1000, // 7 days
};

const STORAGE_KEYS = {
  TODAY_HIJRI: 'naja_hijri_today_v1',
  MONTH_CACHE: 'naja_hijri_month_v1',
  USER_LOCATION: 'naja_user_location_v1',
};

// Hijri month names
export const HIJRI_MONTHS = [
  'Muharram', 'Safar', "Rabi' al-Awwal", "Rabi' al-Thani",
  "Jumada al-Awwal", "Jumada al-Thani", 'Rajab', "Sha'ban",
  'Ramadan', 'Shawwal', "Dhu al-Qi'dah", 'Dhu al-Hijjah'
];

// ========== User Location Context ==========

export interface UserCalendarContext {
  city: string;
  country: string;
  tz: string;
}

export function getUserCalendarContext(): UserCalendarContext {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.USER_LOCATION);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.city && parsed.country) {
        return { city: parsed.city, country: parsed.country, tz };
      }
    }
  } catch {
    // ignore
  }
  
  // Default fallback
  return { city: 'London', country: 'United Kingdom', tz };
}

export function setUserLocation(city: string, country: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.USER_LOCATION, JSON.stringify({ city, country }));
  } catch {
    // ignore
  }
}

// ========== Cache Helpers ==========

function getCached<T>(key: string, ttl: number): T | null {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return null;
    
    const entry: CacheEntry<T> = JSON.parse(stored);
    const age = Date.now() - entry.timestamp;
    
    if (age < ttl) {
      return entry.data;
    }
    
    // Data is stale but still usable for stale-while-revalidate
    return entry.data;
  } catch {
    return null;
  }
}

function isCacheFresh(key: string, ttl: number): boolean {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return false;
    
    const entry = JSON.parse(stored);
    const age = Date.now() - entry.timestamp;
    return age < ttl;
  } catch {
    return false;
  }
}

function setCache<T>(key: string, data: T): void {
  try {
    const entry: CacheEntry<T> = { data, timestamp: Date.now() };
    localStorage.setItem(key, JSON.stringify(entry));
  } catch {
    // ignore storage errors
  }
}

// ========== Fallback Hijri Calculation (last resort) ==========

function gregorianToJulianDay(year: number, month: number, day: number): number {
  if (month <= 2) {
    year -= 1;
    month += 12;
  }
  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5;
}

function julianDayToHijri(jd: number): { day: number; month: number; year: number } {
  const HIJRI_EPOCH = 1948439.5;
  const jd2 = jd + 0.5;
  const days = Math.floor(jd2 - HIJRI_EPOCH);
  
  const cycles = Math.floor((30 * days + 10646) / 10631);
  let remaining = days - Math.floor((10631 * cycles - 10646) / 30);
  
  const year = 30 * Math.floor((remaining + 10631) / 10631) + cycles;
  remaining = remaining - Math.floor((10631 * Math.floor((remaining + 10631) / 10631) - 10646) / 30);
  
  let month = Math.min(12, Math.ceil((remaining + 0.5) / 29.5));
  if (month <= 0) month = 12;
  
  const day = remaining - Math.floor(29.5001 * (month - 1) + 0.99) + 1;
  
  return {
    day: Math.max(1, Math.min(30, Math.round(day))),
    month: Math.max(1, Math.min(12, month)),
    year: Math.max(1, year)
  };
}

function fallbackGetHijriDate(date: Date = new Date()): HijriDate {
  const jd = gregorianToJulianDay(date.getFullYear(), date.getMonth() + 1, date.getDate());
  const hijri = julianDayToHijri(jd);
  return {
    day: hijri.day,
    month: hijri.month,
    year: hijri.year,
    monthName: HIJRI_MONTHS[hijri.month - 1] || 'Unknown',
  };
}

function fallbackHijriToGregorian(hijriYear: number, hijriMonth: number, hijriDay: number): string {
  const HIJRI_EPOCH = 1948439.5;
  const jd = hijriDay + Math.ceil(29.5001 * (hijriMonth - 1) + 0.99) + 
         (hijriYear - 1) * 354 + Math.floor((3 + 11 * hijriYear) / 30) + HIJRI_EPOCH - 385;
  
  const Z = Math.floor(jd + 0.5);
  const F = (jd + 0.5) - Z;
  
  let A = Z;
  if (Z >= 2299161) {
    const alpha = Math.floor((Z - 1867216.25) / 36524.25);
    A = Z + 1 + alpha - Math.floor(alpha / 4);
  }
  
  const B = A + 1524;
  const C = Math.floor((B - 122.1) / 365.25);
  const D = Math.floor(365.25 * C);
  const E = Math.floor((B - D) / 30.6001);
  
  const day = Math.round(B - D - Math.floor(30.6001 * E) + F);
  const month = E < 14 ? E - 1 : E - 13;
  const year = month > 2 ? C - 4716 : C - 4715;
  
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

// ========== API Functions ==========

const API_BASE = 'https://api.aladhan.com/v1';

/**
 * Fetch today's Hijri date from API
 * Uses stale-while-revalidate pattern
 */
export async function fetchTodayHijriDate(): Promise<HijriDate> {
  const cacheKey = STORAGE_KEYS.TODAY_HIJRI;
  
  // Return cached if fresh
  const cached = getCached<HijriDate>(cacheKey, CACHE_TTL.TODAY);
  const isFresh = isCacheFresh(cacheKey, CACHE_TTL.TODAY);
  
  if (cached && isFresh) {
    return cached;
  }
  
  // Try to fetch from API
  try {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    
    const response = await fetch(`${API_BASE}/gpiToHijri/${dd}-${mm}-${yyyy}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.code === 200 && data.data?.hijri) {
      const hijri = data.data.hijri;
      const result: HijriDate = {
        day: parseInt(hijri.day, 10),
        month: parseInt(hijri.month.number, 10),
        year: parseInt(hijri.year, 10),
        monthName: hijri.month.en || HIJRI_MONTHS[parseInt(hijri.month.number, 10) - 1],
      };
      
      setCache(cacheKey, result);
      return result;
    }
    
    throw new Error('Invalid API response');
  } catch (error) {
    console.warn('Failed to fetch Hijri date from API, using fallback:', error);
    
    // Return cached stale data if available
    if (cached) {
      return cached;
    }
    
    // Last resort: use local calculation
    return fallbackGetHijriDate();
  }
}

/**
 * Fetch a full Hijri month calendar
 */
export async function fetchHijriCalendarMonth(params: {
  hijriYear: number;
  hijriMonth: number;
}): Promise<CalendarMonth> {
  const { hijriYear, hijriMonth } = params;
  const cacheKey = `${STORAGE_KEYS.MONTH_CACHE}_${hijriYear}_${hijriMonth}`;
  
  // Return cached if fresh
  const cached = getCached<CalendarMonth>(cacheKey, CACHE_TTL.MONTH);
  const isFresh = isCacheFresh(cacheKey, CACHE_TTL.MONTH);
  
  if (cached && isFresh) {
    return cached;
  }
  
  try {
    const response = await fetch(`${API_BASE}/hpiCalendar/${hijriMonth}/${hijriYear}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.code === 200 && Array.isArray(data.data)) {
      const days: CalendarDay[] = data.data.map((item: any) => ({
        gregorianISO: `${item.gregorian.year}-${String(item.gregorian.month.number).padStart(2, '0')}-${String(item.gregorian.day).padStart(2, '0')}`,
        hijri: {
          day: parseInt(item.hijri.day, 10),
          month: parseInt(item.hijri.month.number, 10),
          year: parseInt(item.hijri.year, 10),
          monthName: item.hijri.month.en || HIJRI_MONTHS[parseInt(item.hijri.month.number, 10) - 1],
        },
      }));
      
      const result: CalendarMonth = {
        year: hijriYear,
        month: hijriMonth,
        days,
      };
      
      setCache(cacheKey, result);
      return result;
    }
    
    throw new Error('Invalid API response');
  } catch (error) {
    console.warn('Failed to fetch Hijri month from API:', error);
    
    // Return cached stale data if available
    if (cached) {
      return cached;
    }
    
    // Fallback: generate approximate month data
    const days: CalendarDay[] = [];
    for (let d = 1; d <= 30; d++) {
      const isoDate = fallbackHijriToGregorian(hijriYear, hijriMonth, d);
      days.push({
        gregorianISO: isoDate,
        hijri: {
          day: d,
          month: hijriMonth,
          year: hijriYear,
          monthName: HIJRI_MONTHS[hijriMonth - 1],
        },
      });
    }
    
    return { year: hijriYear, month: hijriMonth, days };
  }
}

/**
 * Get the Gregorian date for the start of Ramadan (1st of month 9)
 */
export async function getRamadanStartGregorian(hijriYear: number): Promise<string> {
  const cacheKey = `naja_ramadan_start_${hijriYear}`;
  
  const cached = getCached<string>(cacheKey, CACHE_TTL.MONTH);
  if (cached) {
    return cached;
  }
  
  try {
    const ramadanMonth = await fetchHijriCalendarMonth({ hijriYear, hijriMonth: 9 });
    
    // Find the first day (1 Ramadan)
    const firstDay = ramadanMonth.days.find(d => d.hijri.day === 1);
    if (firstDay) {
      setCache(cacheKey, firstDay.gregorianISO);
      return firstDay.gregorianISO;
    }
    
    // If not found in response, take the first entry
    if (ramadanMonth.days.length > 0) {
      setCache(cacheKey, ramadanMonth.days[0].gregorianISO);
      return ramadanMonth.days[0].gregorianISO;
    }
    
    throw new Error('No days in Ramadan month');
  } catch (error) {
    console.warn('Failed to get Ramadan start, using fallback:', error);
    return fallbackHijriToGregorian(hijriYear, 9, 1);
  }
}

/**
 * Synchronous getter for current Hijri date (from cache only)
 * Use fetchTodayHijriDate() to refresh
 */
export function getCurrentHijriDateCached(): HijriDate | null {
  const cacheKey = STORAGE_KEYS.TODAY_HIJRI;
  return getCached<HijriDate>(cacheKey, Infinity); // Don't check TTL, just return if exists
}

/**
 * Get current Hijri year (sync, from cache or fallback)
 */
export function getCurrentHijriYearSync(): number {
  const cached = getCurrentHijriDateCached();
  if (cached) return cached.year;
  return fallbackGetHijriDate().year;
}

/**
 * Sync fallback for immediate use
 */
export function getHijriDateFallback(date: Date = new Date()): HijriDate {
  return fallbackGetHijriDate(date);
}

/**
 * Convert Hijri to Gregorian (fallback, sync)
 */
export function hijriToGregorianFallback(hijriYear: number, hijriMonth: number, hijriDay: number): string {
  return fallbackHijriToGregorian(hijriYear, hijriMonth, hijriDay);
}
