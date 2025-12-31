import { Home, BookHeart, GraduationCap, User, Heart, BookOpen, PenLine, CalendarDays } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  id: string;
  path: string;
  labelKey: string; // i18n key
  icon: LucideIcon;
}

export interface QuickAction {
  id: string;
  path: string;
  labelKey: string;
  icon: LucideIcon;
  hash?: string;
}

// Main navigation tabs for BottomNav
export const NAV_ITEMS: NavItem[] = [
  { id: 'home', path: '/dashboard', labelKey: 'nav.home', icon: Home },
  { id: 'practices', path: '/practices', labelKey: 'nav.practices', icon: BookHeart },
  { id: 'learn', path: '/learn', labelKey: 'nav.learn', icon: GraduationCap },
  { id: 'profile', path: '/profile', labelKey: 'nav.profile', icon: User },
];

// Quick actions for the center button
export const QUICK_ACTIONS: QuickAction[] = [
  { id: 'dhikr', path: '/practices', labelKey: 'quickActions.dhikr', icon: Heart, hash: '#dhikr' },
  { id: 'dua', path: '/practices', labelKey: 'quickActions.duaBuilder', icon: BookOpen, hash: '#dua' },
  { id: 'journal', path: '/journal', labelKey: 'quickActions.journal', icon: PenLine },
  { id: 'dates', path: '/dates', labelKey: 'quickActions.dates', icon: CalendarDays },
];

// Helper to check if a path is active
export const isPathActive = (currentPath: string, navPath: string): boolean => {
  if (navPath === '/dashboard') {
    return currentPath === '/' || currentPath === '/dashboard';
  }
  return currentPath.startsWith(navPath);
};
