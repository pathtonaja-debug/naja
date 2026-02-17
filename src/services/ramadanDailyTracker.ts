/**
 * Ramadan Daily Ibadah Tracker Service
 * Local storage backed daily worship tracking
 */

const STORAGE_KEY = 'naja_ramadan_ibadah_v1';

export interface DailyIbadah {
  fasting: 'fasting' | 'excused' | null;
  prayers: Record<string, boolean>; // Fajr, Dhuhr, Asr, Maghrib, Isha
  taraweeh: boolean;
  quranPages: number;
  dhikrDone: boolean;
  charityDone: boolean;
  tahajjud: boolean;
}

interface IbadahStore {
  [date: string]: DailyIbadah;
}

function getDateKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

function getStore(): IbadahStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveStore(store: IbadahStore): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // ignore
  }
}

const DEFAULT_IBADAH: DailyIbadah = {
  fasting: null,
  prayers: { Fajr: false, Dhuhr: false, Asr: false, Maghrib: false, Isha: false },
  taraweeh: false,
  quranPages: 0,
  dhikrDone: false,
  charityDone: false,
  tahajjud: false,
};

export function getTodayIbadah(): DailyIbadah {
  const store = getStore();
  const today = getDateKey();
  return store[today] ? { ...DEFAULT_IBADAH, ...store[today] } : { ...DEFAULT_IBADAH };
}

export function updateIbadah(updates: Partial<DailyIbadah>): DailyIbadah {
  const store = getStore();
  const today = getDateKey();
  const current = store[today] ? { ...DEFAULT_IBADAH, ...store[today] } : { ...DEFAULT_IBADAH };
  const updated = { ...current, ...updates };
  store[today] = updated;
  saveStore(store);
  return updated;
}

export function getCompletionPercent(ibadah: DailyIbadah): number {
  let total = 7; // 7 trackable categories
  let done = 0;

  // Fasting
  if (ibadah.fasting === 'fasting' || ibadah.fasting === 'excused') done++;
  // Prayers (count as 1 item if all 5 done)
  const prayersDone = Object.values(ibadah.prayers).filter(Boolean).length;
  done += prayersDone / 5;
  // Taraweeh
  if (ibadah.taraweeh) done++;
  // Quran
  if (ibadah.quranPages > 0) done++;
  // Dhikr
  if (ibadah.dhikrDone) done++;
  // Charity
  if (ibadah.charityDone) done++;
  // Tahajjud
  if (ibadah.tahajjud) done++;

  return Math.min(100, Math.round((done / total) * 100));
}

export function getIbadahStreak(): number {
  const store = getStore();
  const dates = Object.keys(store).sort().reverse();
  let streak = 0;
  const today = new Date();

  for (let i = 0; i < dates.length; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() - i);
    const key = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`;

    const dayData = store[key];
    if (!dayData) break;

    const pct = getCompletionPercent({ ...DEFAULT_IBADAH, ...dayData });
    if (pct >= 50) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}
