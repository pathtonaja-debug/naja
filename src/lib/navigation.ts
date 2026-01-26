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
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  id: string;
  path: string;
  labelKey: string; // i18n key
  icon: LucideIcon;
  semanticColor: 'blue' | 'green' | 'yellow' | 'teal'; // Semantic navigation color
}

export interface PlusMenuItem {
  id: string;
  path: string;
  labelKey: string; // i18n key
  icon: LucideIcon;
}

// Main navigation tabs for BottomNav
// Home | Practices | + | Ramadan | Profile
// Each tab has a semantic color for visual wayfinding
export const NAV_ITEMS: NavItem[] = [
  { id: "home", path: "/dashboard", labelKey: "nav.home", icon: Home, semanticColor: 'blue' },
  { id: "practices", path: "/practices", labelKey: "nav.practices", icon: BookHeart, semanticColor: 'green' },
  { id: "ramadan", path: "/ramadan", labelKey: "nav.ramadan", icon: Moon, semanticColor: 'yellow' },
  { id: "profile", path: "/profile", labelKey: "nav.profile", icon: User, semanticColor: 'teal' },
];

// + menu items (all quick access entries, continuous list)
// Learn moved here from bottom nav
export const PLUS_MENU_ITEMS: PlusMenuItem[] = [
  { id: "quran", path: "/quran", labelKey: "nav.quran", icon: BookOpen },
  { id: "dhikr", path: "/dhikr", labelKey: "nav.dhikr", icon: Heart },
  { id: "dua", path: "/dua", labelKey: "nav.dua", icon: BookOpen },
  { id: "journal", path: "/journal", labelKey: "nav.journal", icon: PenLine },
  { id: "goals", path: "/goals", labelKey: "goals.title", icon: Star },
  { id: "learn", path: "/learn", labelKey: "nav.learn", icon: GraduationCap },
  { id: "dates", path: "/dates", labelKey: "nav.dates", icon: CalendarDays },
  { id: "fintech", path: "/fintech", labelKey: "fintech.title", icon: Coins },
];

// Helper to check if a path is active
export const isPathActive = (currentPath: string, navPath: string): boolean => {
  if (navPath === "/dashboard") {
    return currentPath === "/" || currentPath === "/dashboard";
  }
  return currentPath.startsWith(navPath);
};

// Semantic color CSS classes mapping
export const SEMANTIC_COLORS = {
  blue: {
    text: 'text-semantic-blue-dark',
    bg: 'bg-semantic-blue',
    bgSoft: 'bg-semantic-blue-soft',
  },
  green: {
    text: 'text-semantic-green-dark',
    bg: 'bg-semantic-green',
    bgSoft: 'bg-semantic-green-soft',
  },
  yellow: {
    text: 'text-semantic-yellow-dark',
    bg: 'bg-semantic-yellow',
    bgSoft: 'bg-semantic-yellow-soft',
  },
  teal: {
    text: 'text-semantic-teal-dark',
    bg: 'bg-semantic-teal',
    bgSoft: 'bg-semantic-teal-soft',
  },
  lavender: {
    text: 'text-semantic-lavender-dark',
    bg: 'bg-semantic-lavender',
    bgSoft: 'bg-semantic-lavender-soft',
  },
} as const;
