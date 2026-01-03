/**
 * Ramadan Content Data
 * All content for the Ramadan tab - duas, stories, plans, tips
 */

// Quran Khatam Plans
export interface KhatamPlan {
  id: string;
  khatams: number;
  daysToComplete: number;
  pagesPerDay: number;
  pagesPerPrayer: number;
}

export const KHATAM_PLANS: KhatamPlan[] = [
  { id: 'one-khatam', khatams: 1, daysToComplete: 30, pagesPerDay: 20, pagesPerPrayer: 4 },
  { id: 'two-khatams', khatams: 2, daysToComplete: 15, pagesPerDay: 40, pagesPerPrayer: 8 },
  { id: 'three-khatams', khatams: 3, daysToComplete: 10, pagesPerDay: 60, pagesPerPrayer: 12 },
];

export const PRAYERS = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const;
export type Prayer = typeof PRAYERS[number];

// Ramadan Duas
export interface RamadanDua {
  id: string;
  titleKey: string;
  arabic: string;
  transliteration: string;
  translationKey: string;
  source: string;
  category: 'suhoor' | 'iftar' | 'quran' | 'hadith' | 'laylatul-qadr';
}

export const RAMADAN_DUAS: RamadanDua[] = [
  // Suhoor
  {
    id: 'suhoor-intention',
    titleKey: 'ramadan.duas.suhoorIntention',
    arabic: 'وَبِصَوْمِ غَدٍ نَّوَيْتُ مِنْ شَهْرِ رَمَضَانَ',
    transliteration: 'Wa bisawmi ghadin nawaytu min shahri Ramadan',
    translationKey: 'ramadan.duas.suhoorIntentionTranslation',
    source: 'Intention for Fasting',
    category: 'suhoor',
  },
  {
    id: 'suhoor-barakah',
    titleKey: 'ramadan.duas.suhoorBarakah',
    arabic: 'اللَّهُمَّ بَارِكْ لَنَا فِي سُحُورِنَا',
    transliteration: 'Allahumma barik lana fi suhoorina',
    translationKey: 'ramadan.duas.suhoorBarakahTranslation',
    source: 'General Dua',
    category: 'suhoor',
  },
  // Iftar
  {
    id: 'iftar-dua',
    titleKey: 'ramadan.duas.iftarDua',
    arabic: 'ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الأَجْرُ إِنْ شَاءَ اللَّهُ',
    transliteration: "Dhahaba al-zama' wa abtallatil-'urooq wa thabatal-ajru in sha Allah",
    translationKey: 'ramadan.duas.iftarDuaTranslation',
    source: 'Abu Dawud',
    category: 'iftar',
  },
  {
    id: 'iftar-dua-2',
    titleKey: 'ramadan.duas.iftarDua2',
    arabic: 'اللَّهُمَّ إِنِّي لَكَ صُمْتُ وَبِكَ آمَنْتُ وَعَلَى رِزْقِكَ أَفْطَرْتُ',
    transliteration: "Allahumma inni laka sumtu wa bika aamantu wa 'ala rizqika aftartu",
    translationKey: 'ramadan.duas.iftarDua2Translation',
    source: 'Abu Dawud',
    category: 'iftar',
  },
  {
    id: 'iftar-dua-3',
    titleKey: 'ramadan.duas.iftarDua3',
    arabic: 'اللَّهُمَّ لَكَ صُمْتُ وَعَلَى رِزْقِكَ أَفْطَرْتُ فَتَقَبَّلْ مِنِّي إِنَّكَ أَنْتَ السَّمِيعُ الْعَلِيمُ',
    transliteration: "Allahumma laka sumtu wa 'ala rizqika aftartu, fataqabbal minni, innaka antas-sami'ul-'alim",
    translationKey: 'ramadan.duas.iftarDua3Translation',
    source: 'Hadith',
    category: 'iftar',
  },
  // Laylatul Qadr
  {
    id: 'laylatul-qadr-dua',
    titleKey: 'ramadan.duas.laylatulQadrDua',
    arabic: 'اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي',
    transliteration: "Allahumma innaka 'afuwwun tuhibbul 'afwa fa'fu 'anni",
    translationKey: 'ramadan.duas.laylatulQadrDuaTranslation',
    source: 'Tirmidhi',
    category: 'laylatul-qadr',
  },
  {
    id: 'laylatul-qadr-dua-2',
    titleKey: 'ramadan.duas.laylatulQadrDua2',
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالآخِرَةِ',
    transliteration: "Allahumma inni as'alukal-'afwa wal-'afiyata fid-dunya wal-akhira",
    translationKey: 'ramadan.duas.laylatulQadrDua2Translation',
    source: 'Ibn Majah',
    category: 'laylatul-qadr',
  },
  // From Quran
  {
    id: 'quran-dua-1',
    titleKey: 'ramadan.duas.quranDua1',
    arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
    transliteration: 'Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan wa qina adhaban-nar',
    translationKey: 'ramadan.duas.quranDua1Translation',
    source: 'Quran 2:201',
    category: 'quran',
  },
  {
    id: 'quran-dua-2',
    titleKey: 'ramadan.duas.quranDua2',
    arabic: 'رَبِّ اجْعَلْنِي مُقِيمَ الصَّلَاةِ وَمِن ذُرِّيَّتِي رَبَّنَا وَتَقَبَّلْ دُعَاءِ',
    transliteration: "Rabbi j'alni muqimas-salati wa min dhurriyyati Rabbana wa taqabbal du'a",
    translationKey: 'ramadan.duas.quranDua2Translation',
    source: 'Quran 14:40',
    category: 'quran',
  },
  {
    id: 'quran-dua-3',
    titleKey: 'ramadan.duas.quranDua3',
    arabic: 'رَبَّنَا اغْفِرْ لَنَا ذُنُوبَنَا وَإِسْرَافَنَا فِي أَمْرِنَا وَثَبِّتْ أَقْدَامَنَا وَانْصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ',
    transliteration: "Rabbana-ghfir lana dhunubana wa israfana fi amrina wa thabbit aqdamana wansurna 'alal-qawmil-kafirin",
    translationKey: 'ramadan.duas.quranDua3Translation',
    source: 'Quran 3:147',
    category: 'quran',
  },
  // From Hadith
  {
    id: 'hadith-dua-1',
    titleKey: 'ramadan.duas.hadithDua1',
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْهُدَى وَالتُّقَى وَالْعَفَافَ وَالْغِنَى',
    transliteration: 'Allahumma inni as-alukal-huda wat-tuqa wal-afafa wal-ghina',
    translationKey: 'ramadan.duas.hadithDua1Translation',
    source: 'Muslim',
    category: 'hadith',
  },
  {
    id: 'hadith-dua-2',
    titleKey: 'ramadan.duas.hadithDua2',
    arabic: 'اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ',
    transliteration: "Allahumma a'inni 'ala dhikrika wa shukrika wa husni 'ibadatik",
    translationKey: 'ramadan.duas.hadithDua2Translation',
    source: 'Abu Dawud',
    category: 'hadith',
  },
];

// Stories
export interface RamadanStory {
  id: string;
  titleKey: string;
  contentKey: string;
  category: 'prophets' | 'companions' | 'history';
}

export const RAMADAN_STORIES: RamadanStory[] = [
  // History
  {
    id: 'revelation-quran',
    titleKey: 'ramadan.stories.revelationQuran',
    contentKey: 'ramadan.stories.revelationQuranContent',
    category: 'history',
  },
  {
    id: 'badr',
    titleKey: 'ramadan.stories.badr',
    contentKey: 'ramadan.stories.badrContent',
    category: 'history',
  },
  {
    id: 'fath-makkah',
    titleKey: 'ramadan.stories.fathMakkah',
    contentKey: 'ramadan.stories.fathMakkahContent',
    category: 'history',
  },
  // Prophets
  {
    id: 'prophet-generosity',
    titleKey: 'ramadan.stories.prophetGenerosity',
    contentKey: 'ramadan.stories.prophetGenerosityContent',
    category: 'prophets',
  },
  {
    id: 'prophet-itikaf',
    titleKey: 'ramadan.stories.prophetItikaf',
    contentKey: 'ramadan.stories.prophetItikafContent',
    category: 'prophets',
  },
  // Companions
  {
    id: 'companions-fasting',
    titleKey: 'ramadan.stories.companionsFasting',
    contentKey: 'ramadan.stories.companionsFastingContent',
    category: 'companions',
  },
  {
    id: 'companions-quran',
    titleKey: 'ramadan.stories.companionsQuran',
    contentKey: 'ramadan.stories.companionsQuranContent',
    category: 'companions',
  },
];

// Food & Health Tips
export interface HealthTip {
  id: string;
  titleKey: string;
  contentKey: string;
  category: 'etiquette' | 'sunnah' | 'hydration' | 'health' | 'mental';
}

export const HEALTH_TIPS: HealthTip[] = [
  // Etiquette
  {
    id: 'eating-etiquette',
    titleKey: 'ramadan.health.eatingEtiquette',
    contentKey: 'ramadan.health.eatingEtiquetteContent',
    category: 'etiquette',
  },
  {
    id: 'eating-slowly',
    titleKey: 'ramadan.health.eatingSlowly',
    contentKey: 'ramadan.health.eatingSlowlyContent',
    category: 'etiquette',
  },
  // Sunnah Foods
  {
    id: 'sunnah-foods',
    titleKey: 'ramadan.health.sunnahFoods',
    contentKey: 'ramadan.health.sunnahFoodsContent',
    category: 'sunnah',
  },
  {
    id: 'dates-iftar',
    titleKey: 'ramadan.health.datesIftar',
    contentKey: 'ramadan.health.datesIftarContent',
    category: 'sunnah',
  },
  // Hydration
  {
    id: 'hydration',
    titleKey: 'ramadan.health.hydration',
    contentKey: 'ramadan.health.hydrationContent',
    category: 'hydration',
  },
  {
    id: 'avoid-caffeine',
    titleKey: 'ramadan.health.avoidCaffeine',
    contentKey: 'ramadan.health.avoidCaffeineContent',
    category: 'hydration',
  },
  // Health
  {
    id: 'fasting-health',
    titleKey: 'ramadan.health.fastingHealth',
    contentKey: 'ramadan.health.fastingHealthContent',
    category: 'health',
  },
  {
    id: 'sleep-health',
    titleKey: 'ramadan.health.sleepHealth',
    contentKey: 'ramadan.health.sleepHealthContent',
    category: 'health',
  },
  // Mental
  {
    id: 'mental-benefits',
    titleKey: 'ramadan.health.mentalBenefits',
    contentKey: 'ramadan.health.mentalBenefitsContent',
    category: 'mental',
  },
  {
    id: 'discipline-benefits',
    titleKey: 'ramadan.health.disciplineBenefits',
    contentKey: 'ramadan.health.disciplineBenefitsContent',
    category: 'mental',
  },
];

// Preparation tips for Phase 1
export interface PreparationTip {
  id: string;
  titleKey: string;
  contentKey: string;
}

export const PREPARATION_TIPS: PreparationTip[] = [
  {
    id: 'build-habits',
    titleKey: 'ramadan.preparation.buildHabits',
    contentKey: 'ramadan.preparation.buildHabitsContent',
  },
  {
    id: 'duas-reach-ramadan',
    titleKey: 'ramadan.preparation.duasReachRamadan',
    contentKey: 'ramadan.preparation.duasReachRamadanContent',
  },
  {
    id: 'rajab-shaban',
    titleKey: 'ramadan.preparation.rajabShaban',
    contentKey: 'ramadan.preparation.rajabShabanContent',
  },
  {
    id: 'food-sleep',
    titleKey: 'ramadan.preparation.foodSleep',
    contentKey: 'ramadan.preparation.foodSleepContent',
  },
];

// Eid Guidance for Phase 3
export interface EidGuidance {
  id: string;
  titleKey: string;
  contentKey: string;
}

export const EID_GUIDANCE: EidGuidance[] = [
  {
    id: 'eid-sunnah',
    titleKey: 'ramadan.eid.sunnah',
    contentKey: 'ramadan.eid.sunnahContent',
  },
  {
    id: 'eid-etiquette',
    titleKey: 'ramadan.eid.etiquette',
    contentKey: 'ramadan.eid.etiquetteContent',
  },
  {
    id: 'zakat-fitr',
    titleKey: 'ramadan.eid.zakatFitr',
    contentKey: 'ramadan.eid.zakatFitrContent',
  },
  {
    id: 'eid-prayer',
    titleKey: 'ramadan.eid.prayer',
    contentKey: 'ramadan.eid.prayerContent',
  },
];

// Shawwal tips for Phase 4
export interface ShawwalTip {
  id: string;
  titleKey: string;
  contentKey: string;
}

export const SHAWWAL_TIPS: ShawwalTip[] = [
  {
    id: 'six-fasts',
    titleKey: 'ramadan.shawwal.sixFasts',
    contentKey: 'ramadan.shawwal.sixFastsContent',
  },
  {
    id: 'maintain-habits',
    titleKey: 'ramadan.shawwal.maintainHabits',
    contentKey: 'ramadan.shawwal.maintainHabitsContent',
  },
  {
    id: 'spiritual-consistency',
    titleKey: 'ramadan.shawwal.spiritualConsistency',
    contentKey: 'ramadan.shawwal.spiritualConsistencyContent',
  },
  {
    id: 'quran-continuation',
    titleKey: 'ramadan.shawwal.quranContinuation',
    contentKey: 'ramadan.shawwal.quranContinuationContent',
  },
];
