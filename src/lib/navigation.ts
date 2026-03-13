import {
  Home,
  BookHeart,
  Moon,
  User,
  Heart,
  BookOpen,
  PenLine,
  CalendarDays,
  Coins,
  Star,
  GraduationCap,
  Landmark,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  id: string;
  path: string;
  labelKey: string; // i18n key
  icon: LucideIcon;
}

export interface PlusMenuItem {
  id: string;
  path: string;
  labelKey: string; // i18n key
  icon: LucideIcon;
  category: "worship" | "growth" | "tools";
}

// Main navigation tabs for BottomNav
// Home | Practices | + | Ramadan | Profile
export const NAV_ITEMS: NavItem[] = [
  { id: "home", path: "/dashboard", labelKey: "nav.home", icon: Home },
  { id: "practices", path: "/practices", labelKey: "nav.practices", icon: BookHeart },
  { id: "ramadan", path: "/ramadan", labelKey: "nav.ramadan", icon: Moon },
  { id: "profile", path: "/profile", labelKey: "nav.profile", icon: User },
];

// + menu items grouped by category
export const PLUS_MENU_ITEMS: PlusMenuItem[] = [
  // Worship
  { id: "quran", path: "/quran", labelKey: "nav.quran", icon: BookOpen, category: "worship" },
  { id: "dhikr", path: "/dhikr", labelKey: "nav.dhikr", icon: Heart, category: "worship" },
  { id: "dua", path: "/dua", labelKey: "nav.dua", icon: BookOpen, category: "worship" },
  // Growth
  { id: "journal", path: "/journal", labelKey: "nav.journal", icon: PenLine, category: "growth" },
  { id: "goals", path: "/goals", labelKey: "goals.title", icon: Star, category: "growth" },
  { id: "learn", path: "/learn", labelKey: "nav.learn", icon: GraduationCap, category: "growth" },
  // Tools
  { id: "dates", path: "/dates", labelKey: "nav.dates", icon: CalendarDays, category: "tools" },
  { id: "fintech", path: "/fintech", labelKey: "fintech.title", icon: Coins, category: "tools" },
  { id: "pilgrimage", path: "/pilgrimage", labelKey: "pilgrimage.title", icon: Landmark, category: "tools" },
];

export const PLUS_MENU_CATEGORIES = [
  { key: "worship" as const, labelKey: "plusMenu.worship" },
  { key: "growth" as const, labelKey: "plusMenu.growth" },
  { key: "tools" as const, labelKey: "plusMenu.tools" },
];

// Recent items tracking
const RECENTS_KEY = "naja_recent_nav";
const MAX_RECENTS = 3;

export function getRecentItems(): string[] {
  try {
    const stored = localStorage.getItem(RECENTS_KEY);
    if (stored) return JSON.parse(stored) as string[];
  } catch { /* ignore */ }
  return [];
}

export function recordRecentItem(itemId: string): void {
  try {
    const recents = getRecentItems().filter((id) => id !== itemId);
    recents.unshift(itemId);
    localStorage.setItem(RECENTS_KEY, JSON.stringify(recents.slice(0, MAX_RECENTS)));
  } catch { /* ignore */ }
}


// Helper to check if a path is active
export const isPathActive = (currentPath: string, navPath: string): boolean => {
  if (navPath === "/dashboard") {
    return currentPath === "/" || currentPath === "/dashboard";
  }
  return currentPath.startsWith(navPath);
};
