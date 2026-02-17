/**
 * Ramadan Daily Content — 30 days of rotating spiritual content
 * Cycle: Day 1 Hadith → Day 2 Dua → Day 3 Tafsir → Day 4 Reflection → repeat
 */

export type ContentType = 'hadith' | 'dua' | 'tafsir' | 'reflection';

export interface DailyContent {
  type: ContentType;
  arabic?: string;
  transliteration?: string;
  translationKey: string;
  sourceKey?: string;
}

/** Get the content type for a given day (1-based) */
export function getContentTypeForDay(day: number): ContentType {
  const cycle: ContentType[] = ['hadith', 'dua', 'tafsir', 'reflection'];
  return cycle[(day - 1) % 4];
}

/** Get daily content for a specific Ramadan day (1-30) */
export function getDailyContent(day: number): DailyContent {
  const type = getContentTypeForDay(day);
  const idx = day - 1;

  switch (type) {
    case 'hadith':
      return HADITHS[Math.floor(idx / 4) % HADITHS.length];
    case 'dua':
      return DUAS[Math.floor(idx / 4) % DUAS.length];
    case 'tafsir':
      return TAFSIR_SNIPPETS[Math.floor(idx / 4) % TAFSIR_SNIPPETS.length];
    case 'reflection':
      return { type: 'reflection', translationKey: `ramadan.daily.reflection.${((idx % 30) + 1)}` };
  }
}

const HADITHS: DailyContent[] = [
  {
    type: 'hadith',
    arabic: 'مَنْ صَامَ رَمَضَانَ إِيمَانًا وَاحْتِسَابًا غُفِرَ لَهُ مَا تَقَدَّمَ مِنْ ذَنْبِهِ',
    transliteration: 'Man saama Ramadaana imaanan wa ihtisaaban ghufira lahu ma taqaddama min dhanbihi',
    translationKey: 'ramadan.daily.hadith.1',
    sourceKey: 'ramadan.daily.source.bukhari',
  },
  {
    type: 'hadith',
    arabic: 'إِذَا جَاءَ رَمَضَانُ فُتِحَتْ أَبْوَابُ الْجَنَّةِ وَغُلِّقَتْ أَبْوَابُ النَّارِ وَصُفِّدَتِ الشَّيَاطِينُ',
    transliteration: 'Idha jaa Ramadaanu futihat abwaabul-jannati wa ghulliqat abwaabun-naari wa suffidat ash-shayaateen',
    translationKey: 'ramadan.daily.hadith.2',
    sourceKey: 'ramadan.daily.source.bukhari',
  },
  {
    type: 'hadith',
    arabic: 'كُلُّ عَمَلِ ابْنِ آدَمَ يُضَاعَفُ الْحَسَنَةُ بِعَشْرِ أَمْثَالِهَا إِلَى سَبْعِمِائَةِ ضِعْفٍ قَالَ اللَّهُ عَزَّ وَجَلَّ إِلَّا الصَّوْمَ فَإِنَّهُ لِي وَأَنَا أَجْزِي بِهِ',
    transliteration: "Kullu 'amali ibni Aadama yudaa'afu, al-hasanatu bi'ashri amthaaliha ila sab'imi'ati di'f, qaalAllahu 'azza wa jall illa as-sawma fa innahu li wa ana ajzi bih",
    translationKey: 'ramadan.daily.hadith.3',
    sourceKey: 'ramadan.daily.source.muslim',
  },
  {
    type: 'hadith',
    arabic: 'الصِّيَامُ وَالْقُرْآنُ يَشْفَعَانِ لِلْعَبْدِ يَوْمَ الْقِيَامَةِ',
    transliteration: "As-siyaamu wal-Qur'aanu yashfa'aani lil-'abdi yawmal-qiyaamah",
    translationKey: 'ramadan.daily.hadith.4',
    sourceKey: 'ramadan.daily.source.ahmad',
  },
  {
    type: 'hadith',
    arabic: 'مَنْ فَطَّرَ صَائِمًا كَانَ لَهُ مِثْلُ أَجْرِهِ غَيْرَ أَنَّهُ لَا يَنْقُصُ مِنْ أَجْرِ الصَّائِمِ شَيْءٌ',
    transliteration: "Man fattara saa'iman kaana lahu mithlu ajrihi ghayra annahu la yanqusu min ajris-saa'imi shay'",
    translationKey: 'ramadan.daily.hadith.5',
    sourceKey: 'ramadan.daily.source.tirmidhi',
  },
  {
    type: 'hadith',
    arabic: 'تَسَحَّرُوا فَإِنَّ فِي السَّحُورِ بَرَكَةً',
    transliteration: 'Tasahharu fa inna fis-suhoori barakah',
    translationKey: 'ramadan.daily.hadith.6',
    sourceKey: 'ramadan.daily.source.bukhari',
  },
  {
    type: 'hadith',
    arabic: 'لِلصَّائِمِ فَرْحَتَانِ فَرْحَةٌ عِنْدَ فِطْرِهِ وَفَرْحَةٌ عِنْدَ لِقَاءِ رَبِّهِ',
    transliteration: "Lis-saa'imi farhataani, farhatun 'inda fitrihi wa farhatun 'inda liqaa'i Rabbihi",
    translationKey: 'ramadan.daily.hadith.7',
    sourceKey: 'ramadan.daily.source.bukhari',
  },
  {
    type: 'hadith',
    arabic: 'إِنَّ اللَّهَ وَمَلَائِكَتَهُ يُصَلُّونَ عَلَى الْمُتَسَحِّرِينَ',
    transliteration: "InnAllaha wa malaa'ikatahu yusalluna 'alal-mutasahhirin",
    translationKey: 'ramadan.daily.hadith.8',
    sourceKey: 'ramadan.daily.source.ahmad',
  },
];

const DUAS: DailyContent[] = [
  {
    type: 'dua',
    arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
    transliteration: 'Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan wa qina adhaban-nar',
    translationKey: 'ramadan.daily.dua.1',
    sourceKey: 'ramadan.daily.source.quran2_201',
  },
  {
    type: 'dua',
    arabic: 'رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِن لَّدُنكَ رَحْمَةً إِنَّكَ أَنتَ الْوَهَّابُ',
    transliteration: "Rabbana la tuzigh qulubana ba'da idh hadaytana wa hab lana min ladunka rahma, innaka antal-Wahhab",
    translationKey: 'ramadan.daily.dua.2',
    sourceKey: 'ramadan.daily.source.quran3_8',
  },
  {
    type: 'dua',
    arabic: 'رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي',
    transliteration: 'Rabbi-shrah li sadri wa yassir li amri',
    translationKey: 'ramadan.daily.dua.3',
    sourceKey: 'ramadan.daily.source.quran20_25',
  },
  {
    type: 'dua',
    arabic: 'رَبَّنَا اغْفِرْ لَنَا وَلِإِخْوَانِنَا الَّذِينَ سَبَقُونَا بِالْإِيمَانِ وَلَا تَجْعَلْ فِي قُلُوبِنَا غِلًّا لِّلَّذِينَ آمَنُوا',
    transliteration: "Rabbana-ghfir lana wa li ikhwanina-lladhina sabaquna bil-iman, wa la taj'al fi qulubina ghillan lil-ladhina amanu",
    translationKey: 'ramadan.daily.dua.4',
    sourceKey: 'ramadan.daily.source.quran59_10',
  },
  {
    type: 'dua',
    arabic: 'رَبَّنَا ظَلَمْنَا أَنفُسَنَا وَإِن لَّمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ الْخَاسِرِينَ',
    transliteration: 'Rabbana dhalamna anfusana wa in lam taghfir lana wa tarhamna lanakuunanna minal-khasireen',
    translationKey: 'ramadan.daily.dua.5',
    sourceKey: 'ramadan.daily.source.quran7_23',
  },
  {
    type: 'dua',
    arabic: 'رَبِّ أَوْزِعْنِي أَنْ أَشْكُرَ نِعْمَتَكَ الَّتِي أَنْعَمْتَ عَلَيَّ وَعَلَى وَالِدَيَّ وَأَنْ أَعْمَلَ صَالِحًا تَرْضَاهُ',
    transliteration: "Rabbi awzi'ni an ashkura ni'matakallati an'amta 'alayya wa 'ala walidayya wa an a'mala salihan tardahu",
    translationKey: 'ramadan.daily.dua.6',
    sourceKey: 'ramadan.daily.source.quran27_19',
  },
  {
    type: 'dua',
    arabic: 'رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا',
    transliteration: "Rabbana hab lana min azwajina wa dhurriyyatina qurrata a'yun waj'alna lil-muttaqeena imaama",
    translationKey: 'ramadan.daily.dua.7',
    sourceKey: 'ramadan.daily.source.quran25_74',
  },
  {
    type: 'dua',
    arabic: 'رَبَّنَا أَتْمِمْ لَنَا نُورَنَا وَاغْفِرْ لَنَا إِنَّكَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
    transliteration: "Rabbana atmim lana nurana waghfir lana innaka 'ala kulli shay'in qadeer",
    translationKey: 'ramadan.daily.dua.8',
    sourceKey: 'ramadan.daily.source.quran66_8',
  },
];

const TAFSIR_SNIPPETS: DailyContent[] = [
  {
    type: 'tafsir',
    translationKey: 'ramadan.daily.tafsir.1',
    sourceKey: 'ramadan.daily.source.quran2_185',
  },
  {
    type: 'tafsir',
    translationKey: 'ramadan.daily.tafsir.2',
    sourceKey: 'ramadan.daily.source.quran97_1',
  },
  {
    type: 'tafsir',
    translationKey: 'ramadan.daily.tafsir.3',
    sourceKey: 'ramadan.daily.source.quran2_186',
  },
  {
    type: 'tafsir',
    translationKey: 'ramadan.daily.tafsir.4',
    sourceKey: 'ramadan.daily.source.quran2_183',
  },
  {
    type: 'tafsir',
    translationKey: 'ramadan.daily.tafsir.5',
    sourceKey: 'ramadan.daily.source.quran44_3',
  },
  {
    type: 'tafsir',
    translationKey: 'ramadan.daily.tafsir.6',
    sourceKey: 'ramadan.daily.source.quran96_1',
  },
  {
    type: 'tafsir',
    translationKey: 'ramadan.daily.tafsir.7',
    sourceKey: 'ramadan.daily.source.quran2_152',
  },
  {
    type: 'tafsir',
    translationKey: 'ramadan.daily.tafsir.8',
    sourceKey: 'ramadan.daily.source.quran29_69',
  },
];
