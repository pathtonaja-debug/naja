export interface AdhkarItem {
  id: string;
  arabic: string;
  transliteration: string;
  translation: { en: string; fr: string };
  count: number;
  source: string;
}

export const MORNING_ADHKAR: AdhkarItem[] = [
  {
    id: 'ms1',
    arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ',
    transliteration: "Asbahna wa asbahal-mulku lillah, wal-hamdu lillah, la ilaha illallahu wahdahu la sharika lah",
    translation: {
      en: "We have entered the morning and the dominion belongs to Allah. Praise is to Allah. None has the right to be worshipped but Allah alone, with no partner.",
      fr: "Nous sommes entrés dans le matin et le royaume appartient à Allah. Louange à Allah. Nul ne mérite d'être adoré sauf Allah, Seul, sans associé.",
    },
    count: 1,
    source: "Muslim 2723",
  },
  {
    id: 'ms2',
    arabic: 'اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ',
    transliteration: "Allahumma bika asbahna, wa bika amsayna, wa bika nahya, wa bika namutu, wa ilaykan-nushur",
    translation: {
      en: "O Allah, by You we enter the morning, and by You we enter the evening. By You we live and by You we die, and to You is the resurrection.",
      fr: "Ô Allah, c'est par Toi que nous entrons dans le matin et par Toi que nous entrons dans le soir. Par Toi nous vivons et par Toi nous mourons, et vers Toi est la résurrection.",
    },
    count: 1,
    source: "Tirmidhi 3391",
  },
  {
    id: 'ms3',
    arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',
    transliteration: "SubhanAllahi wa bihamdihi",
    translation: {
      en: "Glory and praise be to Allah.",
      fr: "Gloire et louange à Allah.",
    },
    count: 100,
    source: "Bukhari 6405, Muslim 2692",
  },
  {
    id: 'ms4',
    arabic: 'لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
    transliteration: "La ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamdu wa huwa ala kulli shay'in qadir",
    translation: {
      en: "None has the right to be worshipped but Allah alone, with no partner. His is the dominion and His is the praise, and He is Able to do all things.",
      fr: "Nul ne mérite d'être adoré sauf Allah, Seul, sans associé. À Lui la royauté et à Lui la louange, et Il est capable de toute chose.",
    },
    count: 10,
    source: "Abu Dawud 5077",
  },
  {
    id: 'ms5',
    arabic: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
    transliteration: "A'udhu bikalimatillahit-tammati min sharri ma khalaq",
    translation: {
      en: "I seek refuge in the perfect words of Allah from the evil of what He has created.",
      fr: "Je cherche refuge dans les paroles parfaites d'Allah contre le mal de ce qu'Il a créé.",
    },
    count: 3,
    source: "Muslim 2708",
  },
  {
    id: 'ms6',
    arabic: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
    transliteration: "Bismillahilladhi la yadurru ma'asmihi shay'un fil-ardi wa la fis-sama'i wa huwas-sami'ul-'alim",
    translation: {
      en: "In the Name of Allah, with Whose Name nothing on earth or in the heavens can cause harm, and He is the All-Hearing, All-Knowing.",
      fr: "Au Nom d'Allah, avec le Nom duquel rien sur terre ni dans les cieux ne peut nuire, et Il est l'Audient, l'Omniscient.",
    },
    count: 3,
    source: "Abu Dawud 5088, Tirmidhi 3388",
  },
  {
    id: 'ms7',
    arabic: 'اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي',
    transliteration: "Allahumma 'afini fi badani, Allahumma 'afini fi sam'i, Allahumma 'afini fi basari",
    translation: {
      en: "O Allah, grant me health in my body. O Allah, grant me health in my hearing. O Allah, grant me health in my sight.",
      fr: "Ô Allah, accorde-moi la santé dans mon corps. Ô Allah, accorde-moi la santé dans mon ouïe. Ô Allah, accorde-moi la santé dans ma vue.",
    },
    count: 3,
    source: "Abu Dawud 5090",
  },
  {
    id: 'ms8',
    arabic: 'حَسْبِيَ اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ',
    transliteration: "HasbiyAllahu la ilaha illa Huwa, 'alayhi tawakkaltu wa Huwa Rabbul-'Arshil-'Adhim",
    translation: {
      en: "Allah is sufficient for me. There is no god but Him. I have placed my trust in Him, and He is Lord of the Mighty Throne.",
      fr: "Allah me suffit. Il n'y a de dieu que Lui. Je place ma confiance en Lui, et Il est le Seigneur du Trône immense.",
    },
    count: 7,
    source: "Abu Dawud 5081",
  },
  {
    id: 'ms9',
    arabic: 'أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ',
    transliteration: "Astaghfirullaha wa atubu ilayh",
    translation: {
      en: "I seek the forgiveness of Allah and repent to Him.",
      fr: "Je demande pardon à Allah et je me repens vers Lui.",
    },
    count: 100,
    source: "Bukhari 6307",
  },
  {
    id: 'ms10',
    arabic: 'اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ',
    transliteration: "Allahumma salli wa sallim 'ala nabiyyina Muhammad",
    translation: {
      en: "O Allah, send prayers and peace upon our Prophet Muhammad.",
      fr: "Ô Allah, envoie prières et paix sur notre Prophète Muhammad.",
    },
    count: 10,
    source: "Tirmidhi 484",
  },
];

export const EVENING_ADHKAR: AdhkarItem[] = [
  {
    id: 'ev1',
    arabic: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ',
    transliteration: "Amsayna wa amsal-mulku lillah, wal-hamdu lillah, la ilaha illallahu wahdahu la sharika lah",
    translation: {
      en: "We have entered the evening and the dominion belongs to Allah. Praise is to Allah. None has the right to be worshipped but Allah alone, with no partner.",
      fr: "Nous sommes entrés dans le soir et le royaume appartient à Allah. Louange à Allah. Nul ne mérite d'être adoré sauf Allah, Seul, sans associé.",
    },
    count: 1,
    source: "Muslim 2723",
  },
  {
    id: 'ev2',
    arabic: 'اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ الْمَصِيرُ',
    transliteration: "Allahumma bika amsayna, wa bika asbahna, wa bika nahya, wa bika namutu, wa ilaykal-masir",
    translation: {
      en: "O Allah, by You we enter the evening, and by You we enter the morning. By You we live and by You we die, and to You is the final return.",
      fr: "Ô Allah, c'est par Toi que nous entrons dans le soir et par Toi que nous entrons dans le matin. Par Toi nous vivons et par Toi nous mourons, et vers Toi est le retour final.",
    },
    count: 1,
    source: "Tirmidhi 3391",
  },
  {
    id: 'ev3',
    arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',
    transliteration: "SubhanAllahi wa bihamdihi",
    translation: {
      en: "Glory and praise be to Allah.",
      fr: "Gloire et louange à Allah.",
    },
    count: 100,
    source: "Bukhari 6405, Muslim 2692",
  },
  {
    id: 'ev4',
    arabic: 'لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
    transliteration: "La ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamdu wa huwa ala kulli shay'in qadir",
    translation: {
      en: "None has the right to be worshipped but Allah alone, with no partner. His is the dominion and His is the praise, and He is Able to do all things.",
      fr: "Nul ne mérite d'être adoré sauf Allah, Seul, sans associé. À Lui la royauté et à Lui la louange, et Il est capable de toute chose.",
    },
    count: 10,
    source: "Abu Dawud 5077",
  },
  {
    id: 'ev5',
    arabic: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
    transliteration: "A'udhu bikalimatillahit-tammati min sharri ma khalaq",
    translation: {
      en: "I seek refuge in the perfect words of Allah from the evil of what He has created.",
      fr: "Je cherche refuge dans les paroles parfaites d'Allah contre le mal de ce qu'Il a créé.",
    },
    count: 3,
    source: "Muslim 2708",
  },
  {
    id: 'ev6',
    arabic: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
    transliteration: "Bismillahilladhi la yadurru ma'asmihi shay'un fil-ardi wa la fis-sama'i wa huwas-sami'ul-'alim",
    translation: {
      en: "In the Name of Allah, with Whose Name nothing on earth or in the heavens can cause harm, and He is the All-Hearing, All-Knowing.",
      fr: "Au Nom d'Allah, avec le Nom duquel rien sur terre ni dans les cieux ne peut nuire, et Il est l'Audient, l'Omniscient.",
    },
    count: 3,
    source: "Abu Dawud 5088, Tirmidhi 3388",
  },
  {
    id: 'ev7',
    arabic: 'حَسْبِيَ اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ',
    transliteration: "HasbiyAllahu la ilaha illa Huwa, 'alayhi tawakkaltu wa Huwa Rabbul-'Arshil-'Adhim",
    translation: {
      en: "Allah is sufficient for me. There is no god but Him. I have placed my trust in Him, and He is Lord of the Mighty Throne.",
      fr: "Allah me suffit. Il n'y a de dieu que Lui. Je place ma confiance en Lui, et Il est le Seigneur du Trône immense.",
    },
    count: 7,
    source: "Abu Dawud 5081",
  },
  {
    id: 'ev8',
    arabic: 'أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ',
    transliteration: "Astaghfirullaha wa atubu ilayh",
    translation: {
      en: "I seek the forgiveness of Allah and repent to Him.",
      fr: "Je demande pardon à Allah et je me repens vers Lui.",
    },
    count: 100,
    source: "Bukhari 6307",
  },
  {
    id: 'ev9',
    arabic: 'اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ',
    transliteration: "Allahumma salli wa sallim 'ala nabiyyina Muhammad",
    translation: {
      en: "O Allah, send prayers and peace upon our Prophet Muhammad.",
      fr: "Ô Allah, envoie prières et paix sur notre Prophète Muhammad.",
    },
    count: 10,
    source: "Tirmidhi 484",
  },
];
