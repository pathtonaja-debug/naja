/**
 * Islamic Calendar API Service
 * Uses AlAdhan API as source of truth for accurate Hijri dates
 * Implements stale-while-revalidate caching pattern with timezone safety
 */

// ========== Types ==========

export interface HijriDate {
  day: number;
  month: number;
  year: number;
  monthName: string;
}

export interface IslamicCalendarConfig {
  city?: string;
  country?: string;
  adjustment?: number; // -2 to +2
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

// Hijri month names
export const HIJRI_MONTHS = [
  'Muharram', 'Safar', "Rabi' al-Awwal", "Rabi' al-Thani",
  "Jumada al-Awwal", "Jumada al-Thani", 'Rajab', "Sha'ban",
  'Ramadan', 'Shawwal', "Dhu al-Qi'dah", 'Dhu al-Hijjah'
];

// Cache TTLs in ms
const CACHE_TTL = {
  TODAY: 6 * 60 * 60 * 1000, // 6 hours
  CONVERSION: 30 * 24 * 60 * 60 * 1000, // 30 days
};

const STORAGE_KEYS = {
  USER_CONFIG: 'naja_islamic_user_config_v1',
};

const API_BASE = 'https://api.aladhan.com/v1';

// ========== Timezone-Safe Date Helpers ==========

/**
 * Get user's IANA timezone
 */
export function getUserTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return 'UTC';
  }
}

/**
 * Get local date as YYYY-MM-DD string (timezone-safe)
 */
export function getLocalISODate(date: Date = new Date(), timeZone?: string): string {
  const tz = timeZone || getUserTimeZone();
  try {
    // Use en-CA locale which formats as YYYY-MM-DD
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: tz,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(date);
  } catch {
    // Fallback
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}

/**
 * Get local date components (timezone-safe)
 */
export function getLocalDMY(date: Date = new Date(), timeZone?: string): { dd: string; mm: string; yyyy: string } {
  const tz = timeZone || getUserTimeZone();
  try {
    const formatter = new Intl.DateTimeFormat('en-GB', {
      timeZone: tz,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    const parts = formatter.formatToParts(date);
    const dd = parts.find(p => p.type === 'day')?.value || '01';
    const mm = parts.find(p => p.type === 'month')?.value || '01';
    const yyyy = parts.find(p => p.type === 'year')?.value || '2024';
    return { dd, mm, yyyy };
  } catch {
    return {
      dd: String(date.getDate()).padStart(2, '0'),
      mm: String(date.getMonth() + 1).padStart(2, '0'),
      yyyy: String(date.getFullYear()),
    };
  }
}

// ========== User Config ==========

export function getUserCalendarConfig(): IslamicCalendarConfig {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.USER_CONFIG);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // ignore
  }
  return {};
}

export function setUserCalendarConfig(config: IslamicCalendarConfig): void {
  try {
    localStorage.setItem(STORAGE_KEYS.USER_CONFIG, JSON.stringify(config));
  } catch {
    // ignore
  }
}

export function clearIslamicCalendarCache(): void {
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (
        key.startsWith('naja_islamic_today_hijri_v1') ||
        key.startsWith('naja_islamic_g2h_v1') ||
        key.startsWith('naja_islamic_h2g_v1') ||
        key.startsWith('naja_ramadan_start_')
      )) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));
  } catch {
    // ignore
  }
}

// ========== Cache Helpers ==========

function getCache<T>(key: string): CacheEntry<T> | null {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return null;
    return JSON.parse(stored);
  } catch {
    return null;
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

function isFresh(timestamp: number, ttl: number): boolean {
  return Date.now() - timestamp < ttl;
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

/**
 * Fetch today's Hijri date from API
 */
export async function fetchTodayHijriDate(options?: { forceRefresh?: boolean }): Promise<HijriDate> {
  const tz = getUserTimeZone();
  const localDate = getLocalISODate();
  const config = getUserCalendarConfig();
  
  // Cache key includes timezone and local date for accuracy
  const cacheKey = `naja_islamic_today_hijri_v1_${tz}_${localDate}`;
  
  // Check cache
  const cached = getCache<HijriDate>(cacheKey);
  if (cached && isFresh(cached.timestamp, CACHE_TTL.TODAY) && !options?.forceRefresh) {
    return cached.data;
  }
  
  // Try API
  try {
    const { dd, mm, yyyy } = getLocalDMY();
    
    // Build URL with correct AlAdhan endpoint: /gToH/{DD-MM-YYYY}
    let url = `${API_BASE}/gToH/${dd}-${mm}-${yyyy}`;
    if (config.adjustment !== undefined && config.adjustment !== 0) {
      url += `?adjustment=${config.adjustment}`;
    }
    
    const response = await fetch(url);
    
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
      return cached.data;
    }
    
    // Last resort: use local calculation
    return fallbackGetHijriDate();
  }
}

/**
 * Fetch Hijri date for a specific Gregorian date
 */
export async function fetchHijriForGregorianISO(
  gregorianISO: string, 
  options?: { forceRefresh?: boolean }
): Promise<HijriDate> {
  const tz = getUserTimeZone();
  const config = getUserCalendarConfig();
  const cacheKey = `naja_islamic_g2h_v1_${tz}_${gregorianISO}`;
  
  // Check cache
  const cached = getCache<HijriDate>(cacheKey);
  if (cached && isFresh(cached.timestamp, CACHE_TTL.CONVERSION) && !options?.forceRefresh) {
    return cached.data;
  }
  
  try {
    // Parse YYYY-MM-DD to DD-MM-YYYY for API
    const [yyyy, mm, dd] = gregorianISO.split('-');
    
    let url = `${API_BASE}/gToH/${dd}-${mm}-${yyyy}`;
    if (config.adjustment !== undefined && config.adjustment !== 0) {
      url += `?adjustment=${config.adjustment}`;
    }
    
    const response = await fetch(url);
    
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
    console.warn('Failed to fetch Hijri for Gregorian:', error);
    
    if (cached) {
      return cached.data;
    }
    
    // Fallback
    const [yyyy, mm, dd] = gregorianISO.split('-').map(Number);
    return fallbackGetHijriDate(new Date(yyyy, mm - 1, dd));
  }
}

/**
 * Fetch Gregorian date for a specific Hijri date
 */
export async function fetchGregorianForHijri(
  hijri: { day: number; month: number; year: number },
  options?: { forceRefresh?: boolean }
): Promise<string> {
  const config = getUserCalendarConfig();
  const cacheKey = `naja_islamic_h2g_v1_${hijri.year}-${hijri.month}-${hijri.day}`;
  
  // Check cache
  const cached = getCache<string>(cacheKey);
  if (cached && isFresh(cached.timestamp, CACHE_TTL.CONVERSION) && !options?.forceRefresh) {
    return cached.data;
  }
  
  try {
    // Format hijri date as DD-MM-YYYY for API
    const dd = String(hijri.day).padStart(2, '0');
    const mm = String(hijri.month).padStart(2, '0');
    const yyyy = String(hijri.year);
    
    let url = `${API_BASE}/hToG/${dd}-${mm}-${yyyy}`;
    if (config.adjustment !== undefined && config.adjustment !== 0) {
      url += `?adjustment=${config.adjustment}`;
    }
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.code === 200 && data.data?.gregorian) {
      const greg = data.data.gregorian;
      const result = `${greg.year}-${String(greg.month.number).padStart(2, '0')}-${String(greg.day).padStart(2, '0')}`;
      
      setCache(cacheKey, result);
      return result;
    }
    
    throw new Error('Invalid API response');
  } catch (error) {
    console.warn('Failed to fetch Gregorian for Hijri:', error);
    
    if (cached) {
      return cached.data;
    }
    
    // Fallback
    return fallbackHijriToGregorian(hijri.year, hijri.month, hijri.day);
  }
}

// ========== Sync Helpers (for immediate use) ==========

/**
 * Get current Hijri date from cache only (sync)
 */
export function getCurrentHijriDateCached(): HijriDate | null {
  const tz = getUserTimeZone();
  const localDate = getLocalISODate();
  const cacheKey = `naja_islamic_today_hijri_v1_${tz}_${localDate}`;
  const cached = getCache<HijriDate>(cacheKey);
  return cached?.data || null;
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
