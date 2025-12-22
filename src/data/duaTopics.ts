// Dua topics with suggested Names of Allah
export const DUA_TOPICS = [
  { id: 'guidance', label: 'Guidance / Iman', emoji: '✨' },
  { id: 'forgiveness', label: 'Forgiveness', emoji: '🤲' },
  { id: 'protection', label: 'Protection', emoji: '🛡️' },
  { id: 'health', label: 'Health', emoji: '💚' },
  { id: 'family', label: 'Family', emoji: '👨‍👩‍👧' },
  { id: 'marriage', label: 'Marriage', emoji: '💍' },
  { id: 'rizq', label: 'Rizq / Work', emoji: '💼' },
  { id: 'anxiety', label: 'Anxiety / Calm', emoji: '🌿' },
  { id: 'gratitude', label: 'Gratitude', emoji: '🙏' },
  { id: 'other', label: 'Other', emoji: '📝' },
] as const;

export type DuaTopic = typeof DUA_TOPICS[number]['id'];

// Mapping of topics to suggested Names of Allah (by number from the 99 names)
// These are deterministic suggestions based on the meaning of each name
export const TOPIC_NAME_SUGGESTIONS: Record<string, number[]> = {
  guidance: [94, 19, 46], // Al-Hadi (Guide), Al-Alim (All-Knowing), Al-Hakim (Wise)
  forgiveness: [14, 34, 82], // Al-Ghaffar (Ever-Forgiving), Al-Ghafur (Great Forgiver), Al-Afuww (Pardoner)
  protection: [7, 38, 55], // Al-Muhaymin (Guardian), Al-Hafiz (Preserver), Al-Waliyy (Protecting Friend)
  health: [60, 92, 30], // Al-Muhyi (Giver of Life), An-Nafi (Propitious), Al-Latif (Subtle)
  family: [47, 16, 42], // Al-Wadud (Loving), Al-Wahhab (Bestower), Al-Karim (Generous)
  marriage: [47, 16, 30], // Al-Wadud (Loving), Al-Wahhab (Bestower), Al-Latif (Subtle)
  rizq: [17, 89, 18], // Ar-Razzaq (Provider), Al-Mughni (Enricher), Al-Fattah (Opener)
  anxiety: [5, 32, 93], // As-Salam (Peace), Al-Halim (Forbearing), An-Nur (Light)
  gratitude: [35, 56, 42], // Ash-Shakur (Grateful), Al-Hamid (Praiseworthy), Al-Karim (Generous)
  other: [1, 2, 44], // Ar-Rahman (Most Merciful), Ar-Rahim (Bestower of Mercy), Al-Mujib (Responsive)
};

// Ummah prayers - standard prayers for others
export const UMMAH_PRAYERS = [
  { id: 'ummah', label: 'The Muslim Ummah', text: 'O Allah, unite the hearts of the Muslim Ummah, guide them to the straight path, and grant them victory and success.' },
  { id: 'poor', label: 'The Poor & Needy', text: 'O Allah, provide for those in poverty, ease their hardships, and bless them with sustenance and contentment.' },
  { id: 'oppressed', label: 'The Oppressed', text: 'O Allah, support the oppressed everywhere, lift their burdens, grant them relief, and establish justice.' },
  { id: 'mumineen', label: "Al-Mu'minin & Al-Muslimin", text: 'O Allah, forgive the believing men and believing women, the Muslim men and Muslim women, those who are living and those who have passed away.' },
  { id: 'sick', label: 'The Sick', text: 'O Allah, cure the sick among us, grant them complete healing, and replace their illness with health and strength.' },
  { id: 'parents', label: 'Our Parents', text: 'O Allah, have mercy on my parents as they raised me when I was young, forgive them, and grant them the highest ranks in Jannah.' },
];

// Salawat options
export const SALAWAT_OPTIONS = [
  {
    id: 'ibrahimi',
    label: 'Salawat Ibrahimiyyah',
    arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ',
    transliteration: "Allahumma salli 'ala Muhammad wa 'ala aali Muhammad, kama sallayta 'ala Ibrahim wa 'ala aali Ibrahim, innaka Hamidun Majid",
    translation: 'O Allah, send prayers upon Muhammad and the family of Muhammad, as You sent prayers upon Ibrahim and the family of Ibrahim. Indeed, You are Praiseworthy and Glorious.',
  },
  {
    id: 'short',
    label: 'Short Salawat',
    arabic: 'صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ',
    transliteration: "Sallallahu 'alayhi wa sallam",
    translation: 'May Allah send blessings and peace upon him.',
  },
];