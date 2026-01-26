export type CalendarItemType = 'event' | 'task';

export type CalendarCategory = 'faith' | 'work' | 'study' | 'health' | 'personal' | 'other';

export type CalendarSource = 'NAJA' | 'Google' | 'iCloud' | 'Outlook';

export type RepeatRule = 'none' | 'daily' | 'weekly' | 'monthly';

export type ReminderType = 'none' | 'at_time' | '5_min' | '10_min' | '30_min' | '1_day';

export interface CalendarItem {
  id: string;
  type: CalendarItemType;
  title: string;
  notes?: string;
  startDateTime: string;
  endDateTime?: string;
  isAllDay?: boolean;
  category: CalendarCategory;
  completion?: number;
  calendarSource?: CalendarSource;
  color?: string;
  repeatRule?: RepeatRule;
  reminder?: ReminderType;
  userId?: string;
  deviceId?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Semantic colors for categories (no pink)
export const CATEGORY_COLORS: Record<CalendarCategory, string> = {
  faith: 'hsl(var(--color-lavender))',
  work: 'hsl(var(--color-blue))',
  study: 'hsl(var(--color-yellow))',
  health: 'hsl(var(--color-green))',
  personal: 'hsl(var(--color-teal))',
  other: 'hsl(var(--muted))',
};

export const CATEGORY_LABELS: Record<CalendarCategory, string> = {
  faith: 'Faith',
  work: 'Work',
  study: 'Study',
  health: 'Health',
  personal: 'Personal',
  other: 'Other',
};
