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
    meaning: "\"A day to remember and celebrate the birth of the Messenger of Allah ﷺ, to increase salawat upon him, and learn about his blessed life.\"",
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
    meaning: "\"The miraculous night when the Prophet ﷺ traveled from Makkah to Jerusalem and then ascended through the heavens. The five daily prayers were prescribed on this night.\"",
    recommendedActions: [
      'Pray extra night prayers',
      'Reflect on the gift of salah',
      'Read about the journey',
      'Increase worship during the night',
    ],
  },
  {
    id: 'ramadan-start',
    name: 'Ramadan Begins',
    hijriMonth: 9, // Ramadan
    hijriDay: 1,
    description: 'The blessed month of fasting begins.',
    meaning: "\"The month in which the Qur'an was revealed. A time of fasting, prayer, reflection, and community.\"",
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
    meaning: "\"The day when pilgrims gather at Mount Arafah. Fasting on this day expiates sins of the previous and coming year for those not performing Hajj.\"",
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
];

// Approximate Hijri to Gregorian conversion
// This is a simplified calculation - for production, use a proper library
export const hijriToGregorian = (hijriYear: number, hijriMonth: number, hijriDay: number): Date => {
  // Base calculation using the approximate start of Hijri calendar
  // Hijri year 1 started approximately July 16, 622 CE
  
  // Average length of Hijri month: ~29.53 days
  // Average length of Hijri year: ~354.36 days
  
  const HIJRI_EPOCH = new Date('622-07-16').getTime();
  const LUNAR_MONTH = 29.530588853;
  const LUNAR_YEAR = 354.36667;
  
  // Calculate days since Hijri epoch
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
  
  // Approximate calculation
  // Hijri year is roughly (Gregorian year - 622) * (365.25 / 354.36) + 1
  const hijriYear = Math.floor((gregorianYear - 622) * (365.25 / 354.36667)) + 1;
  
  return hijriYear;
};

// Get upcoming Islamic events for a given year
export const getUpcomingEvents = (fromDate: Date = new Date()): Array<IslamicEvent & { gregorianDate: Date; daysUntil: number; hijriDateString: string }> => {
  const currentHijriYear = getCurrentHijriYear();
  const events: Array<IslamicEvent & { gregorianDate: Date; daysUntil: number; hijriDateString: string }> = [];
  
  // Check events for current and next Hijri year
  for (let yearOffset = 0; yearOffset <= 1; yearOffset++) {
    const year = currentHijriYear + yearOffset;
    
    for (const event of ISLAMIC_EVENTS) {
      const gregorianDate = hijriToGregorian(year, event.hijriMonth, event.hijriDay);
      const daysUntil = Math.ceil((gregorianDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24));
      
      // Only include future events (or events in the next 365 days)
      if (daysUntil >= 0 && daysUntil <= 365) {
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
  
  // Remove duplicates (keep the closest one)
  const uniqueEvents = events.filter((event, index, self) => 
    index === self.findIndex(e => e.id === event.id)
  );
  
  return uniqueEvents;
};

// Check if a date is Jumu'ah (Friday)
export const isJumuah = (date: Date): boolean => {
  return date.getDay() === 5;
};

// Get days in a month for the calendar grid
export const getDaysInMonth = (year: number, month: number): Date[] => {
  const days: Date[] = [];
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  // Add padding for days before the first of month (to align with weekday)
  const startPadding = firstDay.getDay();
  for (let i = startPadding - 1; i >= 0; i--) {
    const date = new Date(year, month, -i);
    days.push(date);
  }
  
  // Add all days of the month
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push(new Date(year, month, i));
  }
  
  // Add padding at the end to complete the grid (6 rows x 7 days = 42)
  while (days.length < 42) {
    days.push(new Date(year, month + 1, days.length - lastDay.getDate() - startPadding + 1));
  }
  
  return days;
};
