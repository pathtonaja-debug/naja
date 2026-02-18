export type Language = 'en' | 'fr';

export interface NotificationContent {
  title: string;
  body: string;
}

export function isRamadan(date: Date): boolean {
  const year = date.getFullYear();
  const ramadanDates: Record<number, [number, number, number, number]> = {
    2025: [3, 1, 3, 30],
    2026: [2, 18, 3, 19],
    2027: [2, 8, 3, 9],
  };
  const range = ramadanDates[year];
  if (!range) return false;
  const [sm, sd, em, ed] = range;
  const start = new Date(year, sm - 1, sd);
  const end = new Date(year, em - 1, ed);
  return date >= start && date <= end;
}

export const prayerNotifications = {
  fajr: {
    before: {
      en: (ramadan: boolean): NotificationContent => ({
        title: '🌙 Fajr in 10 minutes',
        body: ramadan
          ? 'Suhoor time is ending — rise and pray Fajr'
          : 'Rise for the best prayer of the day',
      }),
      fr: (ramadan: boolean): NotificationContent => ({
        title: '🌙 Fajr dans 10 min',
        body: ramadan
          ? 'Le Suhoor se termine — lève-toi et prie Fajr'
          : 'Lève-toi pour la meilleure prière du jour',
      }),
    },
    atTime: {
      en: (): NotificationContent => ({
        title: "🌅 It's Fajr time",
        body: 'Allahu Akbar — begin your day with prayer',
      }),
      fr: (): NotificationContent => ({
        title: "🌅 C'est l'heure de Fajr",
        body: 'Allahu Akbar — commence ta journée par la prière',
      }),
    },
  },
  dhuhr: {
    before: {
      en: (): NotificationContent => ({
        title: '☀️ Dhuhr in 10 minutes',
        body: 'Pause and return to Allah in the middle of your day',
      }),
      fr: (): NotificationContent => ({
        title: '☀️ Dhohr dans 10 min',
        body: 'Fais une pause et reviens à Allah au milieu de ta journée',
      }),
    },
    atTime: {
      en: (): NotificationContent => ({
        title: "☀️ It's Dhuhr time",
        body: 'Step away and pray — even 5 minutes changes everything',
      }),
      fr: (): NotificationContent => ({
        title: "☀️ C'est l'heure de Dhohr",
        body: 'Pose tout et prie — même 5 minutes changent tout',
      }),
    },
  },
  asr: {
    before: {
      en: (): NotificationContent => ({
        title: "🌤️ Asr in 10 minutes",
        body: "Don't let this prayer slip away",
      }),
      fr: (): NotificationContent => ({
        title: "🌤️ Asr dans 10 min",
        body: "Ne laisse pas cette prière te passer",
      }),
    },
    atTime: {
      en: (): NotificationContent => ({
        title: "🌤️ It's Asr time",
        body: 'The most feared missed prayer — guard it',
      }),
      fr: (): NotificationContent => ({
        title: "🌤️ C'est l'heure de Asr",
        body: 'La prière la plus souvent manquée — protège-la',
      }),
    },
  },
  maghrib: {
    before: {
      en: (ramadan: boolean): NotificationContent => ({
        title: '🌇 Maghrib in 10 minutes',
        body: ramadan
          ? '🍽️ Iftar is near — prepare to break your fast'
          : 'The day draws to a close — end it with prayer',
      }),
      fr: (ramadan: boolean): NotificationContent => ({
        title: '🌇 Maghrib dans 10 min',
        body: ramadan
          ? "🍽️ L'Iftar approche — prépare-toi à rompre le jeûne"
          : 'La journée touche à sa fin — termine-la par la prière',
      }),
    },
    atTime: {
      en: (ramadan: boolean): NotificationContent => ({
        title: ramadan ? "🍽️ Iftar time" : "🌇 It's Maghrib time",
        body: ramadan
          ? 'Bismillah — break your fast. Allahu Akbar.'
          : 'The sun has set — answer the call',
      }),
      fr: (ramadan: boolean): NotificationContent => ({
        title: ramadan ? "🍽️ C'est l'heure de l'Iftar" : "🌇 C'est l'heure de Maghrib",
        body: ramadan
          ? 'Bismillah — romps ton jeûne. Allahu Akbar.'
          : "Le soleil s'est couché — réponds à l'appel",
      }),
    },
  },
  isha: {
    before: {
      en: (): NotificationContent => ({
        title: '🌙 Isha in 10 minutes',
        body: 'End your day with Allah — close the circle',
      }),
      fr: (): NotificationContent => ({
        title: '🌙 Isha dans 10 min',
        body: 'Termine ta journée avec Allah — ferme le cercle',
      }),
    },
    atTime: {
      en: (): NotificationContent => ({
        title: "🌙 It's Isha time",
        body: 'The final prayer of the day — make it count',
      }),
      fr: (): NotificationContent => ({
        title: "🌙 C'est l'heure de Isha",
        body: "La dernière prière du jour — fais-en sorte qu'elle compte",
      }),
    },
  },
};

export const enrichmentNotifications = {
  hadith: {
    en: (text: string): NotificationContent => ({
      title: '📜 Hadith of the Day',
      body: text.length > 100 ? text.slice(0, 97) + '...' : text,
    }),
    fr: (text: string): NotificationContent => ({
      title: '📜 Hadith du Jour',
      body: text.length > 100 ? text.slice(0, 97) + '...' : text,
    }),
  },
  quranVerse: {
    en: (text: string, ref: string): NotificationContent => ({
      title: '✨ Verse of the Day',
      body: (text.length > 120 ? text.slice(0, 117) + '...' : text) + ` — ${ref}`,
    }),
    fr: (text: string, ref: string): NotificationContent => ({
      title: '✨ Verset du Jour',
      body: (text.length > 120 ? text.slice(0, 117) + '...' : text) + ` — ${ref}`,
    }),
  },
  quranBreak: {
    en: (): NotificationContent => ({
      title: '📖 Your Quran moment',
      body: 'Take 10 minutes to read a few verses — let them speak to your heart',
    }),
    fr: (): NotificationContent => ({
      title: '📖 Ton moment Coran',
      body: 'Prends 10 minutes pour lire quelques versets — laisse-les parler à ton cœur',
    }),
  },
  dhikr: {
    en: (): NotificationContent => ({
      title: '📿 Time for Dhikr',
      body: 'Step away for a moment — SubhanAllah, Alhamdulillah, Allahu Akbar',
    }),
    fr: (): NotificationContent => ({
      title: '📿 Moment de Dhikr',
      body: 'Prends une pause — SubhanAllah, Alhamdulillah, Allahu Akbar',
    }),
  },
  prophetsStory: {
    en: (snippet: string): NotificationContent => ({
      title: '🌿 From the Seerah',
      body: snippet + ' — open the app to read more',
    }),
    fr: (snippet: string): NotificationContent => ({
      title: '🌿 De la Seerah',
      body: snippet + " — ouvre l'appli pour lire la suite",
    }),
  },
  nightDua: {
    en: (text: string): NotificationContent => ({
      title: '🤲 Night Dua',
      body: text.length > 120 ? text.slice(0, 117) + '...' : text,
    }),
    fr: (text: string): NotificationContent => ({
      title: '🤲 Dua du Soir',
      body: text.length > 120 ? text.slice(0, 117) + '...' : text,
    }),
  },
  reflection: {
    en: (): NotificationContent => ({
      title: '🌙 Before you sleep...',
      body: 'How did you serve Allah today? Open the app to reflect',
    }),
    fr: (): NotificationContent => ({
      title: '🌙 Avant de dormir...',
      body: "Comment as-tu servi Allah aujourd'hui ? Ouvre l'appli pour réfléchir",
    }),
  },
  quiz: {
    en: (): NotificationContent => ({
      title: '🎯 Daily Islamic Quiz',
      body: "Test your knowledge — today's quiz is waiting for you",
    }),
    fr: (): NotificationContent => ({
      title: '🎯 Quiz islamique du jour',
      body: "Teste tes connaissances — le quiz du jour t'attend",
    }),
  },
  adhkarMorning: {
    en: (): NotificationContent => ({
      title: '🌅 Morning Adhkar',
      body: 'Start your day with the remembrance of Allah — Adhkar al-Sabah',
    }),
    fr: (): NotificationContent => ({
      title: '🌅 Adhkar du Matin',
      body: 'Commence ta journée par le rappel d\'Allah — Adhkar al-Sabah',
    }),
  },
  adhkarEvening: {
    en: (): NotificationContent => ({
      title: '🌇 Evening Adhkar',
      body: 'End your day with the remembrance of Allah — Adhkar al-Masa',
    }),
    fr: (): NotificationContent => ({
      title: '🌇 Adhkar du Soir',
      body: 'Termine ta journée par le rappel d\'Allah — Adhkar al-Masa',
    }),
  },
};
