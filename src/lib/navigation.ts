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
}

export interface PlusMenuItem {
  id: string;
  path: string;
  labelKey: string; // i18n key
  icon: LucideIcon;
}

// Main navigation tabs for BottomNav
// Home | Practices | + | Ramadan | Profile
export const NAV_ITEMS: NavItem[] = [
  { id: "home", path: "/dashboard", labelKey: "nav.home", icon: Home },
  { id: "practices", path: "/practices", labelKey: "nav.practices", icon: BookHeart },
  { id: "ramadan", path: "/ramadan", labelKey: "nav.ramadan", icon: Moon },
  { id: "profile", path: "/profile", labelKey: "nav.profile", icon: User },
];

// + menu items (all quick access entries, continuous list)
// Learn moved here from bottom nav
export const PLUS_MENU_ITEMS: PlusMenuItem[] = [
  { id: "quran", path: "/quran", labelKey: "nav.quran", icon: BookOpen },
  { id: "dhikr", path: "/dhikr", labelKey: "nav.dhikr", icon: Heart },
  { id: "dua", path: "/dua", labelKey: "nav.dua", icon: BookOpen },
  { id: "journal", path: "/journal", labelKey: "nav.journal", icon: PenLine },
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
