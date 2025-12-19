// Practice/Habit items for the Practices tab
import { ReactNode } from 'react';

export interface PracticeCategory {
  id: string;
  name: string;
  icon: string; // lucide icon name
  color: string;
}

export interface PracticeItem {
  id: string;
  category: string;
  name: string;
  description?: string;
  icon: string;
  barakahReward: number;
  hasToggles?: boolean;
  toggles?: Array<{
    id: string;
    label: string;
    emoji?: string;
  }>;
  isNumeric?: boolean;
  numericLabel?: string;
  numericGoal?: number;
}

// Point rewards
export const BARAKAH_REWARDS = {
  PRAYER_COMPLETED: 15,
  PRAYER_ON_TIME: 5,
  PRAYER_IN_JAMAAH: 10,
  SUNNAH_PRAYER: 8,
  QURAN_PAGE: 10,
  QURAN_JUZ: 100,
  QURAN_KHATAM: 1000,
  DHIKR_33: 10,
  DHIKR_99: 25,
  DHIKR_CUSTOM: 5,
  DUA_DAILY: 10,
  FAST_OBLIGATORY: 50,
  FAST_SUNNAH: 30,
  CHARITY_GIVEN: 20,
  MOSQUE_JUMUAH: 25,
  MOSQUE_EID: 30,
  JOURNAL_ENTRY: 15,
  LESSON_COMPLETED: 20,
  QUIZ_PERFECT: 30,
  QUIZ_COMPLETED: 15,
};

// Mandatory prayers
export const MANDATORY_PRAYERS: PracticeItem[] = [
  {
    id: 'fajr',
    category: 'salah',
    name: 'Fajr',
    description: 'Dawn prayer',
    icon: 'Sunrise',
    barakahReward: BARAKAH_REWARDS.PRAYER_COMPLETED,
    hasToggles: true,
    toggles: [
      { id: 'done', label: 'Done', emoji: '✅' },
      { id: 'on_time', label: 'On Time', emoji: '⏰' },
      { id: 'in_jamaah', label: 'In Jamaah', emoji: '🕌' },
      { id: 'qada', label: 'Made up', emoji: '🔄' },
    ],
  },
  {
    id: 'dhuhr',
    category: 'salah',
    name: 'Dhuhr',
    description: 'Noon prayer',
    icon: 'Sun',
    barakahReward: BARAKAH_REWARDS.PRAYER_COMPLETED,
    hasToggles: true,
    toggles: [
      { id: 'done', label: 'Done', emoji: '✅' },
      { id: 'on_time', label: 'On Time', emoji: '⏰' },
      { id: 'in_jamaah', label: 'In Jamaah', emoji: '🕌' },
      { id: 'qada', label: 'Made up', emoji: '🔄' },
    ],
  },
  {
    id: 'asr',
    category: 'salah',
    name: 'Asr',
    description: 'Afternoon prayer',
    icon: 'CloudSun',
    barakahReward: BARAKAH_REWARDS.PRAYER_COMPLETED,
    hasToggles: true,
    toggles: [
      { id: 'done', label: 'Done', emoji: '✅' },
      { id: 'on_time', label: 'On Time', emoji: '⏰' },
      { id: 'in_jamaah', label: 'In Jamaah', emoji: '🕌' },
      { id: 'qada', label: 'Made up', emoji: '🔄' },
    ],
  },
  {
    id: 'maghrib',
    category: 'salah',
    name: 'Maghrib',
    description: 'Sunset prayer',
    icon: 'Sunset',
    barakahReward: BARAKAH_REWARDS.PRAYER_COMPLETED,
    hasToggles: true,
    toggles: [
      { id: 'done', label: 'Done', emoji: '✅' },
      { id: 'on_time', label: 'On Time', emoji: '⏰' },
      { id: 'in_jamaah', label: 'In Jamaah', emoji: '🕌' },
      { id: 'qada', label: 'Made up', emoji: '🔄' },
    ],
  },
  {
    id: 'isha',
    category: 'salah',
    name: 'Isha',
    description: 'Night prayer',
    icon: 'Moon',
    barakahReward: BARAKAH_REWARDS.PRAYER_COMPLETED,
    hasToggles: true,
    toggles: [
      { id: 'done', label: 'Done', emoji: '✅' },
      { id: 'on_time', label: 'On Time', emoji: '⏰' },
      { id: 'in_jamaah', label: 'In Jamaah', emoji: '🕌' },
      { id: 'qada', label: 'Made up', emoji: '🔄' },
    ],
  },
];

// Sunnah prayers
export const SUNNAH_PRAYERS: PracticeItem[] = [
  {
    id: 'fajr-sunnah',
    category: 'sunnah-salah',
    name: 'Fajr Sunnah (2 rak\'ah)',
    description: 'Before Fajr fard',
    icon: 'Sunrise',
    barakahReward: BARAKAH_REWARDS.SUNNAH_PRAYER,
  },
  {
    id: 'dhuhr-before',
    category: 'sunnah-salah',
    name: 'Dhuhr Before (4 rak\'ah)',
    description: 'Before Dhuhr fard',
    icon: 'Sun',
    barakahReward: BARAKAH_REWARDS.SUNNAH_PRAYER,
  },
  {
    id: 'dhuhr-after',
    category: 'sunnah-salah',
    name: 'Dhuhr After (2 rak\'ah)',
    description: 'After Dhuhr fard',
    icon: 'Sun',
    barakahReward: BARAKAH_REWARDS.SUNNAH_PRAYER,
  },
  {
    id: 'maghrib-after',
    category: 'sunnah-salah',
    name: 'Maghrib After (2 rak\'ah)',
    description: 'After Maghrib fard',
    icon: 'Sunset',
    barakahReward: BARAKAH_REWARDS.SUNNAH_PRAYER,
  },
  {
    id: 'isha-after',
    category: 'sunnah-salah',
    name: 'Isha After (2 rak\'ah)',
    description: 'After Isha fard',
    icon: 'Moon',
    barakahReward: BARAKAH_REWARDS.SUNNAH_PRAYER,
  },
  {
    id: 'witr',
    category: 'sunnah-salah',
    name: 'Witr',
    description: 'Odd number of rak\'ah after Isha',
    icon: 'Star',
    barakahReward: BARAKAH_REWARDS.SUNNAH_PRAYER,
  },
  {
    id: 'tahajjud',
    category: 'sunnah-salah',
    name: 'Tahajjud / Qiyam',
    description: 'Night prayer',
    icon: 'Moon',
    barakahReward: BARAKAH_REWARDS.SUNNAH_PRAYER * 2,
  },
];

// Quran practice
export const QURAN_PRACTICE: PracticeItem = {
  id: 'quran-reading',
  category: 'quran',
  name: "Qur'an Reading",
  description: 'Track pages read today',
  icon: 'BookOpen',
  barakahReward: BARAKAH_REWARDS.QURAN_PAGE,
  isNumeric: true,
  numericLabel: 'pages',
  numericGoal: 5,
};

// Dhikr presets
export const DHIKR_PRESETS = [
  { id: 'subhanallah', phrase: 'سبحان الله', transliteration: 'SubhanAllah', meaning: 'Glory be to Allah' },
  { id: 'alhamdulillah', phrase: 'الحمد لله', transliteration: 'Alhamdulillah', meaning: 'All praise is due to Allah' },
  { id: 'allahu-akbar', phrase: 'الله أكبر', transliteration: 'Allahu Akbar', meaning: 'Allah is the Greatest' },
  { id: 'astaghfirullah', phrase: 'أستغفر الله', transliteration: 'Astaghfirullah', meaning: 'I seek forgiveness from Allah' },
  { id: 'salawat', phrase: 'اللهم صل على محمد', transliteration: 'Salawat', meaning: 'O Allah, send blessings upon Muhammad' },
];

// Fasting options
export const FASTING_OPTIONS: PracticeItem[] = [
  {
    id: 'ramadan-fast',
    category: 'fasting',
    name: 'Ramadan Fast',
    description: 'Obligatory fasting',
    icon: 'Apple',
    barakahReward: BARAKAH_REWARDS.FAST_OBLIGATORY,
  },
  {
    id: 'monday-fast',
    category: 'fasting',
    name: 'Monday Sunnah Fast',
    description: 'Sunnah fasting',
    icon: 'Apple',
    barakahReward: BARAKAH_REWARDS.FAST_SUNNAH,
  },
  {
    id: 'thursday-fast',
    category: 'fasting',
    name: 'Thursday Sunnah Fast',
    description: 'Sunnah fasting',
    icon: 'Apple',
    barakahReward: BARAKAH_REWARDS.FAST_SUNNAH,
  },
  {
    id: 'arafah-fast',
    category: 'fasting',
    name: 'Day of Arafah Fast',
    description: 'Expiates sins of 2 years',
    icon: 'Apple',
    barakahReward: BARAKAH_REWARDS.FAST_SUNNAH * 2,
  },
  {
    id: 'ashura-fast',
    category: 'fasting',
    name: 'Ashura Fast',
    description: '10th of Muharram',
    icon: 'Apple',
    barakahReward: BARAKAH_REWARDS.FAST_SUNNAH,
  },
];

// Charity tracking
export const CHARITY_OPTIONS = [
  { id: 'sadaqah', label: 'Sadaqah', emoji: '💝' },
  { id: 'zakat', label: 'Zakat', emoji: '💰' },
  { id: 'helping', label: 'Helped Someone', emoji: '🤝' },
];

// Disclaimer text
export const NIYYAH_DISCLAIMER = "Your niyyah is what matters — points are just a tool to help you stay consistent.";
