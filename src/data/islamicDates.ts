// Islamic/Hijri date utilities and event definitions

export interface IslamicEvent {
  id: string;
  name: string;
  nameKey: string; // i18n key for the name
  hijriMonth: number; // 1-12
  hijriDay: number;
  descriptionKey: string; // i18n key
  meaningKey: string; // i18n key
  recommendedActionsKeys: string[]; // i18n keys
  tipsKey?: string; // i18n key for tips
  contextKey?: string; // i18n key for historical/spiritual context
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

// Islamic events with Hijri dates and i18n keys
export const ISLAMIC_EVENTS: IslamicEvent[] = [
  {
    id: 'isra-miraj',
    name: "Al-Isra' wal Mi'raj",
    nameKey: 'islamicDates.israMiraj.name',
    hijriMonth: 7, // Rajab
    hijriDay: 27,
    descriptionKey: 'islamicDates.israMiraj.description',
    meaningKey: 'islamicDates.israMiraj.meaning',
    contextKey: 'islamicDates.israMiraj.context',
    tipsKey: 'islamicDates.israMiraj.tips',
    recommendedActionsKeys: [
      'islamicDates.israMiraj.action1',
      'islamicDates.israMiraj.action2',
      'islamicDates.israMiraj.action3',
      'islamicDates.israMiraj.action4',
    ],
  },
  {
    id: 'shaban-start',
    name: "Start of Sha'ban",
    nameKey: 'islamicDates.shabanStart.name',
    hijriMonth: 8, // Sha'ban
    hijriDay: 1,
    descriptionKey: 'islamicDates.shabanStart.description',
    meaningKey: 'islamicDates.shabanStart.meaning',
    contextKey: 'islamicDates.shabanStart.context',
    tipsKey: 'islamicDates.shabanStart.tips',
    recommendedActionsKeys: [
      'islamicDates.shabanStart.action1',
      'islamicDates.shabanStart.action2',
      'islamicDates.shabanStart.action3',
      'islamicDates.shabanStart.action4',
    ],
  },
  {
    id: 'shaban-15',
    name: "Laylat al-Bara'ah (Mid-Sha'ban)",
    nameKey: 'islamicDates.shaban15.name',
    hijriMonth: 8, // Sha'ban
    hijriDay: 15,
    descriptionKey: 'islamicDates.shaban15.description',
    meaningKey: 'islamicDates.shaban15.meaning',
    contextKey: 'islamicDates.shaban15.context',
    tipsKey: 'islamicDates.shaban15.tips',
    recommendedActionsKeys: [
      'islamicDates.shaban15.action1',
      'islamicDates.shaban15.action2',
      'islamicDates.shaban15.action3',
      'islamicDates.shaban15.action4',
    ],
  },
  {
    id: 'ramadan-start',
    name: 'Ramadan Begins',
    nameKey: 'islamicDates.ramadanStart.name',
    hijriMonth: 9, // Ramadan
    hijriDay: 1,
    descriptionKey: 'islamicDates.ramadanStart.description',
    meaningKey: 'islamicDates.ramadanStart.meaning',
    contextKey: 'islamicDates.ramadanStart.context',
    tipsKey: 'islamicDates.ramadanStart.tips',
    recommendedActionsKeys: [
      'islamicDates.ramadanStart.action1',
      'islamicDates.ramadanStart.action2',
      'islamicDates.ramadanStart.action3',
      'islamicDates.ramadanStart.action4',
      'islamicDates.ramadanStart.action5',
    ],
  },
  {
    id: 'nuzul-quran',
    name: 'Nuzul al-Quran',
    nameKey: 'islamicDates.nuzulQuran.name',
    hijriMonth: 9, // Ramadan
    hijriDay: 17,
    descriptionKey: 'islamicDates.nuzulQuran.description',
    meaningKey: 'islamicDates.nuzulQuran.meaning',
    contextKey: 'islamicDates.nuzulQuran.context',
    tipsKey: 'islamicDates.nuzulQuran.tips',
    recommendedActionsKeys: [
      'islamicDates.nuzulQuran.action1',
      'islamicDates.nuzulQuran.action2',
      'islamicDates.nuzulQuran.action3',
      'islamicDates.nuzulQuran.action4',
    ],
  },
  {
    id: 'last-ten-nights',
    name: 'Last 10 Nights of Ramadan',
    nameKey: 'islamicDates.lastTenNights.name',
    hijriMonth: 9, // Ramadan
    hijriDay: 21,
    descriptionKey: 'islamicDates.lastTenNights.description',
    meaningKey: 'islamicDates.lastTenNights.meaning',
    contextKey: 'islamicDates.lastTenNights.context',
    tipsKey: 'islamicDates.lastTenNights.tips',
    recommendedActionsKeys: [
      'islamicDates.lastTenNights.action1',
      'islamicDates.lastTenNights.action2',
      'islamicDates.lastTenNights.action3',
      'islamicDates.lastTenNights.action4',
    ],
    isMultiDay: true,
    endHijriDay: 29,
  },
  {
    id: 'laylatul-qadr',
    name: 'Laylatul Qadr (Night of Power)',
    nameKey: 'islamicDates.laylatulQadr.name',
    hijriMonth: 9, // Ramadan
    hijriDay: 27, // Most commonly observed
    descriptionKey: 'islamicDates.laylatulQadr.description',
    meaningKey: 'islamicDates.laylatulQadr.meaning',
    contextKey: 'islamicDates.laylatulQadr.context',
    tipsKey: 'islamicDates.laylatulQadr.tips',
    recommendedActionsKeys: [
      'islamicDates.laylatulQadr.action1',
      'islamicDates.laylatulQadr.action2',
      'islamicDates.laylatulQadr.action3',
      'islamicDates.laylatulQadr.action4',
      'islamicDates.laylatulQadr.action5',
    ],
  },
  {
    id: 'eid-al-fitr',
    name: 'Eid al-Fitr',
    nameKey: 'islamicDates.eidAlFitr.name',
    hijriMonth: 10, // Shawwal
    hijriDay: 1,
    descriptionKey: 'islamicDates.eidAlFitr.description',
    meaningKey: 'islamicDates.eidAlFitr.meaning',
    contextKey: 'islamicDates.eidAlFitr.context',
    tipsKey: 'islamicDates.eidAlFitr.tips',
    recommendedActionsKeys: [
      'islamicDates.eidAlFitr.action1',
      'islamicDates.eidAlFitr.action2',
      'islamicDates.eidAlFitr.action3',
      'islamicDates.eidAlFitr.action4',
      'islamicDates.eidAlFitr.action5',
    ],
  },
  {
    id: 'dhul-hijjah-start',
    name: 'First 10 Days of Dhul Hijjah',
    nameKey: 'islamicDates.dhulHijjahStart.name',
    hijriMonth: 12, // Dhul Hijjah
    hijriDay: 1,
    descriptionKey: 'islamicDates.dhulHijjahStart.description',
    meaningKey: 'islamicDates.dhulHijjahStart.meaning',
    contextKey: 'islamicDates.dhulHijjahStart.context',
    tipsKey: 'islamicDates.dhulHijjahStart.tips',
    recommendedActionsKeys: [
      'islamicDates.dhulHijjahStart.action1',
      'islamicDates.dhulHijjahStart.action2',
      'islamicDates.dhulHijjahStart.action3',
      'islamicDates.dhulHijjahStart.action4',
      'islamicDates.dhulHijjahStart.action5',
    ],
    isMultiDay: true,
    endHijriDay: 9,
  },
  {
    id: 'day-of-arafah',
    name: 'Day of Arafah',
    nameKey: 'islamicDates.dayOfArafah.name',
    hijriMonth: 12, // Dhul Hijjah
    hijriDay: 9,
    descriptionKey: 'islamicDates.dayOfArafah.description',
    meaningKey: 'islamicDates.dayOfArafah.meaning',
    contextKey: 'islamicDates.dayOfArafah.context',
    tipsKey: 'islamicDates.dayOfArafah.tips',
    recommendedActionsKeys: [
      'islamicDates.dayOfArafah.action1',
      'islamicDates.dayOfArafah.action2',
      'islamicDates.dayOfArafah.action3',
      'islamicDates.dayOfArafah.action4',
      'islamicDates.dayOfArafah.action5',
    ],
  },
  {
    id: 'eid-al-adha',
    name: 'Eid al-Adha',
    nameKey: 'islamicDates.eidAlAdha.name',
    hijriMonth: 12, // Dhul Hijjah
    hijriDay: 10,
    descriptionKey: 'islamicDates.eidAlAdha.description',
    meaningKey: 'islamicDates.eidAlAdha.meaning',
    contextKey: 'islamicDates.eidAlAdha.context',
    tipsKey: 'islamicDates.eidAlAdha.tips',
    recommendedActionsKeys: [
      'islamicDates.eidAlAdha.action1',
      'islamicDates.eidAlAdha.action2',
      'islamicDates.eidAlAdha.action3',
      'islamicDates.eidAlAdha.action4',
      'islamicDates.eidAlAdha.action5',
    ],
  },
  {
    id: 'ayyam-al-tashreeq',
    name: 'Ayyam al-Tashreeq',
    nameKey: 'islamicDates.ayyamAlTashreeq.name',
    hijriMonth: 12, // Dhul Hijjah
    hijriDay: 11,
    descriptionKey: 'islamicDates.ayyamAlTashreeq.description',
    meaningKey: 'islamicDates.ayyamAlTashreeq.meaning',
    contextKey: 'islamicDates.ayyamAlTashreeq.context',
    tipsKey: 'islamicDates.ayyamAlTashreeq.tips',
    recommendedActionsKeys: [
      'islamicDates.ayyamAlTashreeq.action1',
      'islamicDates.ayyamAlTashreeq.action2',
      'islamicDates.ayyamAlTashreeq.action3',
      'islamicDates.ayyamAlTashreeq.action4',
    ],
    isMultiDay: true,
    endHijriDay: 13,
  },
  {
    id: 'islamic-new-year',
    name: 'Islamic New Year',
    nameKey: 'islamicDates.islamicNewYear.name',
    hijriMonth: 1, // Muharram
    hijriDay: 1,
    descriptionKey: 'islamicDates.islamicNewYear.description',
    meaningKey: 'islamicDates.islamicNewYear.meaning',
    contextKey: 'islamicDates.islamicNewYear.context',
    tipsKey: 'islamicDates.islamicNewYear.tips',
    recommendedActionsKeys: [
      'islamicDates.islamicNewYear.action1',
      'islamicDates.islamicNewYear.action2',
      'islamicDates.islamicNewYear.action3',
      'islamicDates.islamicNewYear.action4',
    ],
  },
  {
    id: 'tasua',
    name: "Tasu'a",
    nameKey: 'islamicDates.tasua.name',
    hijriMonth: 1, // Muharram
    hijriDay: 9,
    descriptionKey: 'islamicDates.tasua.description',
    meaningKey: 'islamicDates.tasua.meaning',
    contextKey: 'islamicDates.tasua.context',
    tipsKey: 'islamicDates.tasua.tips',
    recommendedActionsKeys: [
      'islamicDates.tasua.action1',
      'islamicDates.tasua.action2',
      'islamicDates.tasua.action3',
    ],
  },
  {
    id: 'ashura',
    name: 'Ashura',
    nameKey: 'islamicDates.ashura.name',
    hijriMonth: 1, // Muharram
    hijriDay: 10,
    descriptionKey: 'islamicDates.ashura.description',
    meaningKey: 'islamicDates.ashura.meaning',
    contextKey: 'islamicDates.ashura.context',
    tipsKey: 'islamicDates.ashura.tips',
    recommendedActionsKeys: [
      'islamicDates.ashura.action1',
      'islamicDates.ashura.action2',
      'islamicDates.ashura.action3',
      'islamicDates.ashura.action4',
    ],
  },
  {
    id: 'safar-start',
    name: 'Safar Begins',
    nameKey: 'islamicDates.safarStart.name',
    hijriMonth: 2, // Safar
    hijriDay: 1,
    descriptionKey: 'islamicDates.safarStart.description',
    meaningKey: 'islamicDates.safarStart.meaning',
    contextKey: 'islamicDates.safarStart.context',
    tipsKey: 'islamicDates.safarStart.tips',
    recommendedActionsKeys: [
      'islamicDates.safarStart.action1',
      'islamicDates.safarStart.action2',
      'islamicDates.safarStart.action3',
    ],
  },
  {
    id: 'rabi-al-awwal-start',
    name: "Rabi' al-Awwal Begins",
    nameKey: 'islamicDates.rabiAlAwwalStart.name',
    hijriMonth: 3, // Rabi' al-Awwal
    hijriDay: 1,
    descriptionKey: 'islamicDates.rabiAlAwwalStart.description',
    meaningKey: 'islamicDates.rabiAlAwwalStart.meaning',
    contextKey: 'islamicDates.rabiAlAwwalStart.context',
    tipsKey: 'islamicDates.rabiAlAwwalStart.tips',
    recommendedActionsKeys: [
      'islamicDates.rabiAlAwwalStart.action1',
      'islamicDates.rabiAlAwwalStart.action2',
      'islamicDates.rabiAlAwwalStart.action3',
    ],
  },
  {
    id: 'mawlid',
    name: 'Mawlid an-Nabi',
    nameKey: 'islamicDates.mawlid.name',
    hijriMonth: 3, // Rabi al-Awwal
    hijriDay: 12,
    descriptionKey: 'islamicDates.mawlid.description',
    meaningKey: 'islamicDates.mawlid.meaning',
    contextKey: 'islamicDates.mawlid.context',
    tipsKey: 'islamicDates.mawlid.tips',
    recommendedActionsKeys: [
      'islamicDates.mawlid.action1',
      'islamicDates.mawlid.action2',
      'islamicDates.mawlid.action3',
      'islamicDates.mawlid.action4',
    ],
  },
];

// Fixed Gregorian dates for Islamic events in 2026 (1447 H)
// Based on astronomical calculations - dates may vary by 1-2 days depending on moon sighting
// Source: User-provided dates (January 2026)
export const ISLAMIC_DATES_2026: Record<string, string> = {
  // January 2026
  'isra-miraj': '2026-01-16', // 27 Rajab 1447
  'shaban-start': '2026-01-20', // 1 Sha'ban 1447
  
  // February 2026
  'shaban-15': '2026-02-03', // 15 Sha'ban 1447 (Nisf Sha'ban / Laylat al-Bara'ah)
  'ramadan-start': '2026-02-19', // 1 Ramadan 1447
  
  // March 2026
  'nuzul-quran': '2026-03-07', // 17 Ramadan 1447
  'last-ten-nights': '2026-03-11', // 21 Ramadan 1447
  'laylatul-qadr': '2026-03-17', // 27 Ramadan 1447
  'eid-al-fitr': '2026-03-20', // 1 Shawwal 1447
  
  // May 2026
  'dhul-hijjah-start': '2026-05-18', // 1 Dhul Hijjah 1447
  'day-of-arafah': '2026-05-26', // 9 Dhul Hijjah 1447
  'eid-al-adha': '2026-05-27', // 10 Dhul Hijjah 1447
  'ayyam-al-tashreeq': '2026-05-28', // 11-13 Dhul Hijjah 1447
  
  // June 2026 (1448 H begins)
  'islamic-new-year': '2026-06-16', // 1 Muharram 1448
  'tasua': '2026-06-24', // 9 Muharram 1448
  'ashura': '2026-06-25', // 10 Muharram 1448
  
  // July 2026
  'safar-start': '2026-07-16', // 1 Safar 1448
  
  // August 2026
  'rabi-al-awwal-start': '2026-08-14', // 1 Rabi' al-Awwal 1448
  'mawlid': '2026-08-25', // 12 Rabi' al-Awwal 1448
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
  
  // Create events from fixed dates
  for (const event of ISLAMIC_EVENTS) {
    const fixedDateStr = ISLAMIC_DATES_2026[event.id];
    
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
  const dateStr = date.toISOString().split('T')[0];
  const events: IslamicEventWithDate[] = [];
  
  for (const event of ISLAMIC_EVENTS) {
    const fixedDateStr = ISLAMIC_DATES_2026[event.id];
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
  const dateStr = date.toISOString().split('T')[0];
  return Object.values(ISLAMIC_DATES_2026).includes(dateStr);
};

// Get color for event (for calendar dots)
export const getEventColor = (eventId: string): string => {
  const colors: Record<string, string> = {
    'islamic-new-year': 'hsl(var(--semantic-lavender-dark))',
    'tasua': 'hsl(var(--semantic-lavender-dark))', 
    'ashura': 'hsl(var(--semantic-lavender-dark))', 
    'safar-start': 'hsl(var(--semantic-blue-dark))', 
    'rabi-al-awwal-start': 'hsl(var(--semantic-green-dark))', 
    'mawlid': 'hsl(var(--semantic-green-dark))', 
    'isra-miraj': 'hsl(var(--semantic-blue-dark))', 
    'shaban-start': 'hsl(var(--semantic-lavender-dark))', 
    'shaban-15': 'hsl(var(--semantic-lavender-dark))', 
    'ramadan-start': 'hsl(var(--semantic-yellow-dark))', 
    'nuzul-quran': 'hsl(var(--semantic-yellow-dark))', 
    'last-ten-nights': 'hsl(var(--semantic-yellow-dark))', 
    'laylatul-qadr': 'hsl(var(--semantic-yellow-dark))', 
    'eid-al-fitr': 'hsl(var(--semantic-green-dark))', 
    'dhul-hijjah-start': 'hsl(var(--semantic-yellow-dark))', 
    'day-of-arafah': 'hsl(var(--semantic-blue-dark))', 
    'eid-al-adha': 'hsl(var(--semantic-green-dark))', 
    'ayyam-al-tashreeq': 'hsl(var(--semantic-yellow-dark))', 
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
