/**
 * Quran Reading State Service
 * Handles bookmarks and continue reading (last read position)
 */

const STORAGE_KEYS = {
  BOOKMARKS: 'naja_quran_bookmarks_v1',
  LAST_READ: 'naja_quran_lastRead_v1',
} as const;

export interface Bookmark {
  verseKey: string;
  chapterId: number;
  verseNumber: number;
  createdAt: string;
  chapterName?: string;
}

export interface LastReadPosition {
  chapterId: number;
  verseNumber: number;
  verseKey: string;
  chapterName?: string;
  updatedAt: string;
}

// Bookmarks

export function getBookmarks(): Bookmark[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function addBookmark(bookmark: Omit<Bookmark, 'createdAt'>): Bookmark {
  const bookmarks = getBookmarks();
  
  // Check if already bookmarked
  const exists = bookmarks.some(b => b.verseKey === bookmark.verseKey);
  if (exists) {
    return bookmarks.find(b => b.verseKey === bookmark.verseKey)!;
  }
  
  const newBookmark: Bookmark = {
    ...bookmark,
    createdAt: new Date().toISOString(),
  };
  
  bookmarks.unshift(newBookmark); // Add to beginning
  localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));
  
  return newBookmark;
}

export function removeBookmark(verseKey: string): void {
  const bookmarks = getBookmarks();
  const filtered = bookmarks.filter(b => b.verseKey !== verseKey);
  localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(filtered));
}

export function isBookmarked(verseKey: string): boolean {
  const bookmarks = getBookmarks();
  return bookmarks.some(b => b.verseKey === verseKey);
}

export function toggleBookmark(
  verseKey: string,
  chapterId: number,
  verseNumber: number,
  chapterName?: string
): boolean {
  if (isBookmarked(verseKey)) {
    removeBookmark(verseKey);
    return false;
  } else {
    addBookmark({ verseKey, chapterId, verseNumber, chapterName });
    return true;
  }
}

// Last Read Position

export function getLastReadPosition(): LastReadPosition | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.LAST_READ);
    if (!stored) return null;
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function setLastReadPosition(
  chapterId: number,
  verseNumber: number,
  verseKey: string,
  chapterName?: string
): void {
  const position: LastReadPosition = {
    chapterId,
    verseNumber,
    verseKey,
    chapterName,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEYS.LAST_READ, JSON.stringify(position));
}

export function clearLastReadPosition(): void {
  localStorage.removeItem(STORAGE_KEYS.LAST_READ);
}
