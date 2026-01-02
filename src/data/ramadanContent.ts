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
];

// Stories
export interface RamadanStory {
  id: string;
  titleKey: string;
  contentKey: string;
  category: 'prophets' | 'companions' | 'history';
}

export const RAMADAN_STORIES: RamadanStory[] = [
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
    id: 'prophet-generosity',
    titleKey: 'ramadan.stories.prophetGenerosity',
    contentKey: 'ramadan.stories.prophetGenerosityContent',
    category: 'prophets',
  },
  {
    id: 'companions-fasting',
    titleKey: 'ramadan.stories.companionsFasting',
    contentKey: 'ramadan.stories.companionsFastingContent',
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
  {
    id: 'eating-etiquette',
    titleKey: 'ramadan.health.eatingEtiquette',
    contentKey: 'ramadan.health.eatingEtiquetteContent',
    category: 'etiquette',
  },
  {
    id: 'sunnah-foods',
    titleKey: 'ramadan.health.sunnahFoods',
    contentKey: 'ramadan.health.sunnahFoodsContent',
    category: 'sunnah',
  },
  {
    id: 'hydration',
    titleKey: 'ramadan.health.hydration',
    contentKey: 'ramadan.health.hydrationContent',
    category: 'hydration',
  },
  {
    id: 'fasting-health',
    titleKey: 'ramadan.health.fastingHealth',
    contentKey: 'ramadan.health.fastingHealthContent',
    category: 'health',
  },
  {
    id: 'mental-benefits',
    titleKey: 'ramadan.health.mentalBenefits',
    contentKey: 'ramadan.health.mentalBenefitsContent',
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
];
