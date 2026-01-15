// Islamic/Hijri date utilities and event definitions

export interface IslamicEvent {
  id: string;
  name: string;
  hijriMonth: number; // 1-12
  hijriDay: number;
  description: string;
  meaning: string;
  recommendedActions: string[];
  isMultiDay?: boolean;
  endHijriDay?: number;
}

export interface IslamicEventWithDate extends IslamicEvent {
  gregorianDate: Date;
  daysUntil: number;
  hijriDateString: string;
}

// Hijri month names
export const HIJRI_MONTHS = [
  'Muharram',
  "Safar",
  "Rabi' al-Awwal",
  "Rabi' al-Thani",
  "Jumada al-Awwal",
  "Jumada al-Thani",
  'Rajab',
  "Sha'ban",
  'Ramadan',
  'Shawwal',
  "Dhul Qi'dah",
  'Dhul Hijjah',
];

// Islamic events with Hijri dates
export const ISLAMIC_EVENTS: IslamicEvent[] = [
  {
    id: 'islamic-new-year',
    name: 'Islamic New Year',
    hijriMonth: 1, // Muharram
    hijriDay: 1,
    description: 'The first day of the Islamic calendar year.',
    meaning: 'Marks the beginning of the new Hijri year. A time for reflection on the past year and setting intentions for the coming year.',
    recommendedActions: [
      'Reflect on the past year',
      'Make dua for the new year',
      'Set spiritual goals',
      'Increase dhikr',
    ],
  },
  {
    id: 'ashura',
    name: 'Ashura',
    hijriMonth: 1, // Muharram
    hijriDay: 10,
    description: 'The 10th of Muharram, a day of great significance.',
    meaning: 'A day of gratitude and remembrance. It marks the day Allah saved Musa (AS) and the Children of Israel from Pharaoh.',
    recommendedActions: [
      'Fast on this day (and the 9th or 11th)',
      'Increase dhikr and dua',
      'Reflect on the story of Musa (AS)',
      'Give charity',
    ],
  },
  {
    id: 'mawlid',
    name: 'Mawlid an-Nabi',
    hijriMonth: 3, // Rabi al-Awwal
    hijriDay: 12,
    description: 'The birthday of Prophet Muhammad ﷺ.',
    meaning: "A day to remember and celebrate the birth of the Messenger of Allah ﷺ, to increase salawat upon him, and learn about his blessed life.",
    recommendedActions: [
      'Increase salawat upon the Prophet ﷺ',
      'Read his seerah (biography)',
      'Share stories of his character',
      'Gather for remembrance',
    ],
  },
  {
    id: 'isra-miraj',
    name: "Al-Isra' wal Mi'raj",
    hijriMonth: 7, // Rajab
    hijriDay: 27,
    description: 'The Night Journey and Ascension of Prophet Muhammad ﷺ.',
    meaning: "The miraculous night when the Prophet ﷺ traveled from Makkah to Jerusalem and then ascended through the heavens. The five daily prayers were prescribed on this night.",
    recommendedActions: [
      'Pray extra night prayers',
      'Reflect on the gift of salah',
      'Read about the journey',
      'Increase worship during the night',
    ],
  },
  {
    id: 'shaban-15',
    name: "Laylat al-Bara'ah (Mid-Sha'ban)",
    hijriMonth: 8, // Sha'ban
    hijriDay: 15,
    description: "The 15th night of Sha'ban, a blessed night.",
    meaning: "A night when Allah descends to the lowest heaven and forgives many of His servants. Some scholars recommend extra worship on this night.",
    recommendedActions: [
      'Pray extra night prayers',
      'Seek forgiveness',
      'Make abundant dua',
      'Fast the next day (optional)',
    ],
  },
  {
    id: 'ramadan-start',
    name: 'Ramadan Begins',
    hijriMonth: 9, // Ramadan
    hijriDay: 1,
    description: 'The blessed month of fasting begins.',
    meaning: "The month in which the Qur'an was revealed. A time of fasting, prayer, reflection, and community.",
    recommendedActions: [
      'Begin fasting from dawn to sunset',
      'Increase Quran recitation',
      'Pray Tarawih',
      'Give generously in charity',
      'Seek forgiveness',
    ],
  },
  {
    id: 'laylatul-qadr',
    name: 'Laylatul Qadr (Night of Power)',
    hijriMonth: 9, // Ramadan
    hijriDay: 27, // Most commonly observed, though could be any odd night in last 10
    description: 'The Night of Power - better than a thousand months.',
    meaning: 'The blessed night when the Quran was first revealed. Worship on this night is better than worship for a thousand months.',
    recommendedActions: [
      'Stay up in worship',
      "Recite: 'Allahumma innaka 'afuwwun tuhibbul 'afwa fa'fu 'anni'",
      'Pray tahajjud',
      'Read Quran',
      'Make abundant dua',
    ],
    isMultiDay: true,
    endHijriDay: 29, // Last 10 nights window
  },
  {
    id: 'eid-al-fitr',
    name: 'Eid al-Fitr',
    hijriMonth: 10, // Shawwal
    hijriDay: 1,
    description: 'The Festival of Breaking the Fast.',
    meaning: 'A day of celebration and gratitude after completing the month of Ramadan. A time to thank Allah for the strength to complete the fast.',
    recommendedActions: [
      'Perform Ghusl and wear best clothes',
      'Pray Eid Salah',
      'Pay Zakat al-Fitr before the prayer',
      'Visit family and friends',
      'Exchange gifts and celebrate',
    ],
  },
  {
    id: 'shawwal-fasting',
    name: 'Six Days of Shawwal',
    hijriMonth: 10, // Shawwal
    hijriDay: 2,
    description: 'Voluntary fasting of six days in Shawwal.',
    meaning: 'Fasting six days in Shawwal after Ramadan is like fasting the entire year. A great opportunity to continue the momentum from Ramadan.',
    recommendedActions: [
      'Fast six days (consecutive or spread out)',
      'Maintain Ramadan habits',
      'Continue extra prayers',
      'Keep reciting Quran',
    ],
    isMultiDay: true,
    endHijriDay: 30,
  },
  {
    id: 'dhul-hijjah-start',
    name: 'First 10 Days of Dhul Hijjah',
    hijriMonth: 12, // Dhul Hijjah
    hijriDay: 1,
    description: 'The most blessed days of the year begin.',
    meaning: 'The first ten days of Dhul Hijjah are the best days of the entire year. Good deeds are most beloved to Allah during these days.',
    recommendedActions: [
      'Fast the first 9 days (especially Day of Arafah)',
      'Increase dhikr (SubhanAllah, Alhamdulillah, Allahu Akbar)',
      'Read Quran',
      'Give charity',
      'Prepare for Eid al-Adha',
    ],
    isMultiDay: true,
    endHijriDay: 9,
  },
  {
    id: 'day-of-arafah',
    name: 'Day of Arafah',
    hijriMonth: 12, // Dhul Hijjah
    hijriDay: 9,
    description: 'The greatest day of the year.',
    meaning: "The day when pilgrims gather at Mount Arafah. Fasting on this day expiates sins of the previous and coming year for those not performing Hajj.",
    recommendedActions: [
      'Fast (for non-pilgrims)',
      'Make abundant dua',
      'Seek forgiveness',
      'Increase dhikr',
      'Reflect and repent',
    ],
  },
  {
    id: 'eid-al-adha',
    name: 'Eid al-Adha',
    hijriMonth: 12, // Dhul Hijjah
    hijriDay: 10,
    description: 'The Festival of Sacrifice.',
    meaning: 'Commemorates the willingness of Ibrahim (AS) to sacrifice his son in obedience to Allah. A time of sacrifice, sharing, and celebration.',
    recommendedActions: [
      'Pray Eid Salah',
      'Perform Qurbani (sacrifice)',
      'Distribute meat to family, neighbors, and the poor',
      'Celebrate with family',
      'Reflect on submission to Allah',
    ],
  },
  {
    id: 'ayyam-al-tashreeq',
    name: 'Ayyam al-Tashreeq',
    hijriMonth: 12, // Dhul Hijjah
    hijriDay: 11,
    description: 'The Days of Tashreeq (11th-13th Dhul Hijjah).',
    meaning: 'Days of eating, drinking, and remembrance of Allah. Fasting is prohibited on these days.',
    recommendedActions: [
      'Increase takbeer (Allahu Akbar)',
      'Do not fast',
      'Celebrate with family',
      'Continue Eid festivities',
    ],
    isMultiDay: true,
    endHijriDay: 13,
  },
];

// Fixed Gregorian dates for Islamic events 1447 H (2025-2026)
// Based on astronomical calculations - dates may vary by 1-2 days depending on moon sighting
export const ISLAMIC_DATES_1447: Record<string, string> = {
  'islamic-new-year': '2025-06-26', // 1 Muharram 1447
  'ashura': '2025-07-05', // 10 Muharram 1447
  'mawlid': '2025-09-04', // 12 Rabi' al-Awwal 1447
  'isra-miraj': '2026-01-27', // 27 Rajab 1447
  'shaban-15': '2026-02-11', // 15 Sha'ban 1447
  'ramadan-start': '2026-02-27', // 1 Ramadan 1447
  'laylatul-qadr': '2026-03-24', // 27 Ramadan 1447
  'eid-al-fitr': '2026-03-28', // 1 Shawwal 1447
  'shawwal-fasting': '2026-03-29', // 2 Shawwal 1447
  'dhul-hijjah-start': '2026-05-27', // 1 Dhul Hijjah 1447
  'day-of-arafah': '2026-06-04', // 9 Dhul Hijjah 1447
  'eid-al-adha': '2026-06-05', // 10 Dhul Hijjah 1447
  'ayyam-al-tashreeq': '2026-06-06', // 11 Dhul Hijjah 1447
};

// Fixed Gregorian dates for Islamic events 1448 H (2026-2027)
export const ISLAMIC_DATES_1448: Record<string, string> = {
  'islamic-new-year': '2026-06-16', // 1 Muharram 1448
  'ashura': '2026-06-25', // 10 Muharram 1448
  'mawlid': '2026-08-25', // 12 Rabi' al-Awwal 1448
  'isra-miraj': '2027-01-16', // 27 Rajab 1448
  'shaban-15': '2027-01-31', // 15 Sha'ban 1448
  'ramadan-start': '2027-02-16', // 1 Ramadan 1448
  'laylatul-qadr': '2027-03-13', // 27 Ramadan 1448
  'eid-al-fitr': '2027-03-17', // 1 Shawwal 1448
  'shawwal-fasting': '2027-03-18', // 2 Shawwal 1448
  'dhul-hijjah-start': '2027-05-16', // 1 Dhul Hijjah 1448
  'day-of-arafah': '2027-05-24', // 9 Dhul Hijjah 1448
  'eid-al-adha': '2027-05-25', // 10 Dhul Hijjah 1448
  'ayyam-al-tashreeq': '2027-05-26', // 11 Dhul Hijjah 1448
};

// Approximate Hijri to Gregorian conversion (fallback)
export const hijriToGregorian = (hijriYear: number, hijriMonth: number, hijriDay: number): Date => {
  const HIJRI_EPOCH = new Date('622-07-16').getTime();
  const LUNAR_MONTH = 29.530588853;
  const LUNAR_YEAR = 354.36667;
  
  const daysSinceEpoch = 
    (hijriYear - 1) * LUNAR_YEAR + 
    (hijriMonth - 1) * LUNAR_MONTH + 
    hijriDay;
  
  const gregorianDate = new Date(HIJRI_EPOCH + daysSinceEpoch * 24 * 60 * 60 * 1000);
  
  return gregorianDate;
};

// Get the current Hijri year (approximate)
export const getCurrentHijriYear = (): number => {
  const now = new Date();
  const gregorianYear = now.getFullYear();
  const hijriYear = Math.floor((gregorianYear - 622) * (365.25 / 354.36667)) + 1;
  return hijriYear;
};

// Get upcoming Islamic events using fixed dates when available
export const getUpcomingEvents = (fromDate: Date = new Date()): IslamicEventWithDate[] => {
  const events: IslamicEventWithDate[] = [];
  const allDates = { ...ISLAMIC_DATES_1447, ...ISLAMIC_DATES_1448 };
  
  // Create events from fixed dates
  for (const event of ISLAMIC_EVENTS) {
    // Try to get fixed date first
    const fixedDateStr = allDates[event.id];
    
    if (fixedDateStr) {
      const gregorianDate = new Date(fixedDateStr);
      const daysUntil = Math.ceil((gregorianDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24));
      
      // Only include future events within next 365 days
      if (daysUntil >= -1 && daysUntil <= 400) {
        events.push({
          ...event,
          gregorianDate,
          daysUntil,
          hijriDateString: `${event.hijriDay} ${HIJRI_MONTHS[event.hijriMonth - 1]}`,
        });
      }
    }
  }
  
  // Sort by date
  events.sort((a, b) => a.gregorianDate.getTime() - b.gregorianDate.getTime());
  
  // Remove past events (keep only future or today)
  const futureEvents = events.filter(e => e.daysUntil >= 0);
  
  // Remove duplicates (keep the closest one)
  const uniqueEvents = futureEvents.filter((event, index, self) => 
    index === self.findIndex(e => e.id === event.id)
  );
  
  return uniqueEvents;
};

// Get events for a specific date
export const getEventsForDate = (date: Date): IslamicEventWithDate[] => {
  const allDates = { ...ISLAMIC_DATES_1447, ...ISLAMIC_DATES_1448 };
  const dateStr = date.toISOString().split('T')[0];
  const events: IslamicEventWithDate[] = [];
  
  for (const event of ISLAMIC_EVENTS) {
    const fixedDateStr = allDates[event.id];
    if (fixedDateStr === dateStr) {
      events.push({
        ...event,
        gregorianDate: new Date(fixedDateStr),
        daysUntil: 0,
        hijriDateString: `${event.hijriDay} ${HIJRI_MONTHS[event.hijriMonth - 1]}`,
      });
    }
  }
  
  return events;
};

// Check if a date is Jumu'ah (Friday)
export const isJumuah = (date: Date): boolean => {
  return date.getDay() === 5;
};

// Check if a date has an Islamic event
export const hasIslamicEvent = (date: Date): boolean => {
  const allDates = { ...ISLAMIC_DATES_1447, ...ISLAMIC_DATES_1448 };
  const dateStr = date.toISOString().split('T')[0];
  return Object.values(allDates).includes(dateStr);
};

// Get color for event (for calendar dots)
export const getEventColor = (eventId: string): string => {
  const colors: Record<string, string> = {
    'islamic-new-year': 'hsl(var(--primary))',
    'ashura': 'hsl(280 70% 50%)', // purple
    'mawlid': 'hsl(120 60% 45%)', // green
    'isra-miraj': 'hsl(210 80% 55%)', // blue
    'shaban-15': 'hsl(280 60% 60%)', // light purple
    'ramadan-start': 'hsl(45 90% 50%)', // gold
    'laylatul-qadr': 'hsl(45 100% 45%)', // bright gold
    'eid-al-fitr': 'hsl(350 80% 55%)', // pink/red
    'shawwal-fasting': 'hsl(160 60% 45%)', // teal
    'dhul-hijjah-start': 'hsl(30 80% 55%)', // orange
    'day-of-arafah': 'hsl(200 80% 50%)', // sky blue
    'eid-al-adha': 'hsl(350 80% 55%)', // pink/red
    'ayyam-al-tashreeq': 'hsl(30 70% 60%)', // light orange
  };
  return colors[eventId] || 'hsl(var(--primary))';
};

// Get days in a month for the calendar grid (Monday first)
export const getDaysInMonth = (year: number, month: number): Date[] => {
  const days: Date[] = [];
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  // Convert Sunday=0 to Monday-first: Mon=0, Tue=1, ..., Sun=6
  const dayOfWeek = firstDay.getDay();
  const startPadding = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  
  for (let i = startPadding - 1; i >= 0; i--) {
    const date = new Date(year, month, -i);
    days.push(date);
  }
  
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push(new Date(year, month, i));
  }
  
  while (days.length < 42) {
    days.push(new Date(year, month + 1, days.length - lastDay.getDate() - startPadding + 1));
  }
  
  return days;
};
