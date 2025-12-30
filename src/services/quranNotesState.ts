/**
 * Local storage for personal notes on Quran verses
 * Guest mode - device-local persistence
 */

const KEY = 'naja_quran_notes_v1';

export type AyahNote = { text: string; updatedAt: string };
export type NotesMap = Record<string, AyahNote>;

function safeParse<T>(raw: string | null, fallback: T): T {
  try {
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function getAllNotes(): NotesMap {
  return safeParse<NotesMap>(localStorage.getItem(KEY), {});
}

export function getNote(verseKey: string): AyahNote | null {
  const all = getAllNotes();
  return all[verseKey] ?? null;
}

export function setNote(verseKey: string, text: string): void {
  const all = getAllNotes();
  all[verseKey] = { text, updatedAt: new Date().toISOString() };
  localStorage.setItem(KEY, JSON.stringify(all));
}

export function removeNote(verseKey: string): void {
  const all = getAllNotes();
  delete all[verseKey];
  localStorage.setItem(KEY, JSON.stringify(all));
}

export function hasNote(verseKey: string): boolean {
  const note = getNote(verseKey);
  return !!note && note.text.trim().length > 0;
}
