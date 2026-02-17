/**
 * Ramadan Charity & Impact Tracker
 * Local storage backed donation logging + zakat + sadaqah goals
 */

const CHARITY_KEY = 'naja_ramadan_charity_v1';

export interface DonationEntry {
  id: string;
  date: string;
  amount: number;
  type: 'sadaqah' | 'zakat' | 'fidya' | 'other';
  note: string;
}

export interface CharityState {
  sadaqahGoal: number;
  zakatAmount: number;
  zakatPaid: boolean;
  donations: DonationEntry[];
}

const DEFAULT_STATE: CharityState = {
  sadaqahGoal: 0,
  zakatAmount: 0,
  zakatPaid: false,
  donations: [],
};

function getStore(): CharityState {
  try {
    const raw = localStorage.getItem(CHARITY_KEY);
    return raw ? { ...DEFAULT_STATE, ...JSON.parse(raw) } : { ...DEFAULT_STATE };
  } catch { return { ...DEFAULT_STATE }; }
}

function saveStore(state: CharityState): void {
  try { localStorage.setItem(CHARITY_KEY, JSON.stringify(state)); } catch { /* */ }
}

export function getCharityState(): CharityState {
  return getStore();
}

export function updateCharitySettings(updates: Partial<Pick<CharityState, 'sadaqahGoal' | 'zakatAmount' | 'zakatPaid'>>): CharityState {
  const state = getStore();
  const updated = { ...state, ...updates };
  saveStore(updated);
  return updated;
}

export function addDonation(entry: Omit<DonationEntry, 'id' | 'date'>): CharityState {
  const state = getStore();
  const now = new Date();
  const donation: DonationEntry = {
    ...entry,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`,
  };
  state.donations.push(donation);
  saveStore(state);
  return state;
}

export function removeDonation(id: string): CharityState {
  const state = getStore();
  state.donations = state.donations.filter(d => d.id !== id);
  saveStore(state);
  return state;
}

export function getTotalDonations(): number {
  const state = getStore();
  return state.donations.reduce((sum, d) => sum + d.amount, 0);
}

export function getSadaqahProgress(): { current: number; goal: number; percent: number } {
  const state = getStore();
  const sadaqahTotal = state.donations
    .filter(d => d.type === 'sadaqah')
    .reduce((sum, d) => sum + d.amount, 0);
  const goal = state.sadaqahGoal || 1;
  return {
    current: sadaqahTotal,
    goal: state.sadaqahGoal,
    percent: state.sadaqahGoal > 0 ? Math.min(100, Math.round((sadaqahTotal / goal) * 100)) : 0,
  };
}

/** Number of unique days with donations — used for tree growth */
export function getDonationDaysCount(): number {
  const state = getStore();
  const uniqueDays = new Set(state.donations.map(d => d.date));
  return uniqueDays.size;
}
