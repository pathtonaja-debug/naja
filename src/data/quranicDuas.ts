export interface QuranicDua {
  id: number;
  surah: number;
  verse: number;
  verseLabel: string; // e.g. "2:127"
  arabic: string;
  transliteration: string;
  translationKeyEn: string;
  translationKeyFr: string;
}

export const QURANIC_DUAS: QuranicDua[] = [
  {
    id: 1, surah: 2, verse: 127, verseLabel: "2:127",
    arabic: "رَبَّنَا تَقَبَّلْ مِنَّا ۖ إِنَّكَ أَنتَ السَّمِيعُ الْعَلِيمُ",
    transliteration: "Rabbana taqabbal minna innaka anta As-Samee'ul-'Aleem",
    translationKeyEn: "Our Lord, accept from us. Indeed, You are the All-Hearing, the All-Knowing.",
    translationKeyFr: "Notre Seigneur, accepte de nous. Tu es certes l'Audient, l'Omniscient.",
  },
  {
    id: 2, surah: 2, verse: 128, verseLabel: "2:128",
    arabic: "رَبَّنَا وَاجْعَلْنَا مُسْلِمَيْنِ لَكَ وَمِن ذُرِّيَّتِنَا أُمَّةً مُّسْلِمَةً لَّكَ وَأَرِنَا مَنَاسِكَنَا وَتُبْ عَلَيْنَا ۖ إِنَّكَ أَنتَ التَّوَّابُ الرَّحِيمُ",
    transliteration: "Rabbana waj'alna muslimayni laka wa min dhurriyyatina ummatan muslimatan laka wa arina manasikana wa tub 'alayna innaka anta At-Tawwabur-Raheem",
    translationKeyEn: "Our Lord, make us submissive to You and from our descendants a nation submissive to You… and accept our repentance. Indeed, You are the Accepting of repentance, the Merciful.",
    translationKeyFr: "Notre Seigneur, fais de nous des soumis à Toi et de notre descendance une communauté soumise à Toi… et accepte notre repentir. Tu es certes Celui qui accepte le repentir, le Miséricordieux.",
  },
  {
    id: 3, surah: 2, verse: 201, verseLabel: "2:201",
    arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
    transliteration: "Rabbana atina fid-dunya hasanah wa fil-akhirati hasanah wa qina 'adhaban-nar",
    translationKeyEn: "Our Lord, grant us good in this world and good in the Hereafter and protect us from the punishment of the Fire.",
    translationKeyFr: "Notre Seigneur, accorde-nous une bonne part ici-bas et une bonne part dans l'Au-delà et protège-nous du châtiment du Feu.",
  },
  {
    id: 4, surah: 2, verse: 250, verseLabel: "2:250",
    arabic: "رَبَّنَا أَفْرِغْ عَلَيْنَا صَبْرًا وَثَبِّتْ أَقْدَامَنَا وَانصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ",
    transliteration: "Rabbana afrigh 'alayna sabran wa thabbit aqdamana wansurna 'alal-qawmil-kafireen",
    translationKeyEn: "Our Lord, pour upon us patience, make firm our feet, and grant us victory over the disbelieving people.",
    translationKeyFr: "Notre Seigneur, déverse sur nous la patience, affermis nos pas et donne-nous la victoire sur le peuple mécréant.",
  },
  {
    id: 5, surah: 2, verse: 286, verseLabel: "2:286",
    arabic: "رَبَّنَا لَا تُؤَاخِذْنَا إِن نَّسِينَا أَوْ أَخْطَأْنَا",
    transliteration: "Rabbana la tu'akhidhna in naseena aw akhta'na",
    translationKeyEn: "Our Lord, do not take us to task if we forget or make a mistake.",
    translationKeyFr: "Notre Seigneur, ne nous châtie pas s'il nous arrive d'oublier ou de commettre une erreur.",
  },
  {
    id: 6, surah: 2, verse: 286, verseLabel: "2:286",
    arabic: "رَبَّنَا وَلَا تَحْمِلْ عَلَيْنَا إِصْرًا كَمَا حَمَلْتَهُ عَلَى الَّذِينَ مِن قَبْلِنَا",
    transliteration: "Rabbana wa la tahmil 'alayna isran kama hamaltahu 'alal-ladhina min qablina",
    translationKeyEn: "Our Lord, do not lay upon us a burden like that which You laid upon those before us.",
    translationKeyFr: "Notre Seigneur, ne nous impose pas un fardeau comme Tu l'as imposé à ceux qui nous ont précédés.",
  },
  {
    id: 7, surah: 2, verse: 286, verseLabel: "2:286",
    arabic: "رَبَّنَا وَلَا تُحَمِّلْنَا مَا لَا طَاقَةَ لَنَا بِهِ وَاعْفُ عَنَّا وَاغْفِرْ لَنَا وَارْحَمْنَا",
    transliteration: "Rabbana wa la tuhammilna ma la taqata lana bih wa'fu 'anna waghfir lana warhamna",
    translationKeyEn: "Our Lord, burden us not with what we cannot bear. Pardon us, forgive us, and have mercy on us.",
    translationKeyFr: "Notre Seigneur, ne nous charge pas de ce que nous ne pouvons supporter. Pardonne-nous, accorde-nous Ton pardon et fais-nous miséricorde.",
  },
  {
    id: 8, surah: 3, verse: 8, verseLabel: "3:8",
    arabic: "رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِن لَّدُنكَ رَحْمَةً",
    transliteration: "Rabbana la tuzigh qulubana ba'da idh hadaytana wa hab lana min ladunka rahmah",
    translationKeyEn: "Our Lord, do not let our hearts deviate after You have guided us and grant us mercy from Yourself.",
    translationKeyFr: "Notre Seigneur, ne dévie pas nos cœurs après nous avoir guidés et accorde-nous Ta miséricorde.",
  },
  {
    id: 9, surah: 3, verse: 9, verseLabel: "3:9",
    arabic: "رَبَّنَا إِنَّكَ جَامِعُ النَّاسِ لِيَوْمٍ لَّا رَيْبَ فِيهِ",
    transliteration: "Rabbana innaka jami'un-nasi liyawmin la rayba fih",
    translationKeyEn: "Our Lord, surely You will gather mankind for a Day about which there is no doubt.",
    translationKeyFr: "Notre Seigneur, Tu rassembleras les gens en un Jour au sujet duquel il n'y a aucun doute.",
  },
  {
    id: 10, surah: 3, verse: 16, verseLabel: "3:16",
    arabic: "رَبَّنَا إِنَّنَا آمَنَّا فَاغْفِرْ لَنَا ذُنُوبَنَا وَقِنَا عَذَابَ النَّارِ",
    transliteration: "Rabbana innana amanna faghfir lana dhunubana wa qina 'adhaban-nar",
    translationKeyEn: "Our Lord, indeed we have believed, so forgive us our sins and protect us from the punishment of the Fire.",
    translationKeyFr: "Notre Seigneur, nous avons cru. Pardonne-nous donc nos péchés et protège-nous du châtiment du Feu.",
  },
  {
    id: 11, surah: 3, verse: 53, verseLabel: "3:53",
    arabic: "رَبَّنَا آمَنَّا بِمَا أَنزَلْتَ وَاتَّبَعْنَا الرَّسُولَ فَاكْتُبْنَا مَعَ الشَّاهِدِينَ",
    transliteration: "Rabbana amanna bima anzalta wattaba'nar-rasula faktubna ma'ash-shahideen",
    translationKeyEn: "Our Lord, we believe in what You have revealed and we follow the Messenger, so register us among the witnesses.",
    translationKeyFr: "Notre Seigneur, nous croyons en ce que Tu as révélé et nous suivons le Messager. Inscris-nous donc parmi les témoins.",
  },
  {
    id: 12, surah: 3, verse: 147, verseLabel: "3:147",
    arabic: "رَبَّنَا اغْفِرْ لَنَا ذُنُوبَنَا وَإِسْرَافَنَا فِي أَمْرِنَا وَثَبِّتْ أَقْدَامَنَا وَانصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ",
    transliteration: "Rabbana ighfir lana dhunubana wa israfana fi amrina wa thabbit aqdamana wansurna 'alal-qawmil-kafireen",
    translationKeyEn: "Our Lord, forgive us our sins and excesses in our affairs, make firm our feet and grant us victory over the disbelieving people.",
    translationKeyFr: "Notre Seigneur, pardonne-nous nos péchés et nos excès, affermis nos pas et donne-nous la victoire sur le peuple mécréant.",
  },
  {
    id: 13, surah: 3, verse: 191, verseLabel: "3:191",
    arabic: "رَبَّنَا مَا خَلَقْتَ هَٰذَا بَاطِلًا سُبْحَانَكَ فَقِنَا عَذَابَ النَّارِ",
    transliteration: "Rabbana ma khalaqta hadha batilan subhanaka faqina 'adhaban-nar",
    translationKeyEn: "Our Lord, You did not create this in vain. Glory be to You, so protect us from the punishment of the Fire.",
    translationKeyFr: "Notre Seigneur, Tu n'as pas créé cela en vain. Gloire à Toi ! Protège-nous du châtiment du Feu.",
  },
  {
    id: 14, surah: 3, verse: 192, verseLabel: "3:192",
    arabic: "رَبَّنَا إِنَّكَ مَن تُدْخِلِ النَّارَ فَقَدْ أَخْزَيْتَهُ",
    transliteration: "Rabbana innaka man tudkhilin-nara faqad akhzaytah",
    translationKeyEn: "Our Lord, indeed whoever You admit to the Fire, You have disgraced him.",
    translationKeyFr: "Notre Seigneur, celui que Tu fais entrer dans le Feu, Tu l'as certes couvert d'ignominie.",
  },
  {
    id: 15, surah: 3, verse: 193, verseLabel: "3:193",
    arabic: "رَبَّنَا إِنَّنَا سَمِعْنَا مُنَادِيًا يُنَادِي لِلْإِيمَانِ...",
    transliteration: "Rabbana innana sami'na munadiyan yunadi lil-iman…",
    translationKeyEn: "Our Lord, we have heard a caller calling to faith… so forgive us our sins and admit us with the righteous.",
    translationKeyFr: "Notre Seigneur, nous avons entendu un appelant appeler à la foi… pardonne-nous et fais-nous entrer parmi les pieux.",
  },
  {
    id: 16, surah: 3, verse: 194, verseLabel: "3:194",
    arabic: "رَبَّنَا وَآتِنَا مَا وَعَدتَّنَا عَلَىٰ رُسُلِكَ وَلَا تُخْزِنَا يَوْمَ الْقِيَامَةِ",
    transliteration: "Rabbana wa atina ma wa'adtana 'ala rusulika wa la tukhzina yawmal-qiyamah",
    translationKeyEn: "Our Lord, grant us what You promised through Your messengers and do not disgrace us on the Day of Resurrection.",
    translationKeyFr: "Notre Seigneur, accorde-nous ce que Tu nous as promis par Tes messagers et ne nous couvre pas d'ignominie au Jour de la Résurrection.",
  },
  {
    id: 17, surah: 5, verse: 83, verseLabel: "5:83",
    arabic: "رَبَّنَا آمَنَّا فَاكْتُبْنَا مَعَ الشَّاهِدِينَ",
    transliteration: "Rabbana amanna faktubna ma'ash-shahideen",
    translationKeyEn: "Our Lord, we believe, so register us among the witnesses.",
    translationKeyFr: "Notre Seigneur, nous croyons, inscris-nous donc parmi les témoins.",
  },
  {
    id: 18, surah: 7, verse: 23, verseLabel: "7:23",
    arabic: "رَبَّنَا ظَلَمْنَا أَنفُسَنَا وَإِن لَّمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ الْخَاسِرِينَ",
    transliteration: "Rabbana zalamna anfusana wa illam taghfir lana wa tarhamna lanakunanna minal-khasireen",
    translationKeyEn: "Our Lord, we have wronged ourselves, and if You do not forgive us and have mercy upon us, we will surely be among the losers.",
    translationKeyFr: "Notre Seigneur, nous nous sommes fait du tort à nous-mêmes. Si Tu ne nous pardonnes pas et ne nous fais pas miséricorde, nous serons parmi les perdants.",
  },
  {
    id: 19, surah: 7, verse: 47, verseLabel: "7:47",
    arabic: "رَبَّنَا لَا تَجْعَلْنَا مَعَ الْقَوْمِ الظَّالِمِينَ",
    transliteration: "Rabbana la taj'alna ma'al-qawmiz-zalimeen",
    translationKeyEn: "Our Lord, do not place us with the wrongdoing people.",
    translationKeyFr: "Notre Seigneur, ne nous mets pas avec les injustes.",
  },
  {
    id: 20, surah: 7, verse: 89, verseLabel: "7:89",
    arabic: "رَبَّنَا افْتَحْ بَيْنَنَا وَبَيْنَ قَوْمِنَا بِالْحَقِّ",
    transliteration: "Rabbana iftah baynana wa bayna qawmina bil-haqq",
    translationKeyEn: "Our Lord, decide between us and our people in truth.",
    translationKeyFr: "Notre Seigneur, tranche entre nous et notre peuple en toute vérité.",
  },
  {
    id: 21, surah: 10, verse: 85, verseLabel: "10:85",
    arabic: "رَبَّنَا عَلَيْكَ تَوَكَّلْنَا",
    transliteration: "Rabbana 'alayka tawakkalna",
    translationKeyEn: "Our Lord, upon You we rely.",
    translationKeyFr: "Notre Seigneur, c'est en Toi que nous plaçons notre confiance.",
  },
  {
    id: 22, surah: 10, verse: 86, verseLabel: "10:86",
    arabic: "رَبَّنَا نَجِّنَا مِنَ الْقَوْمِ الظَّالِمِينَ",
    transliteration: "Rabbana najjina minal-qawmiz-zalimeen",
    translationKeyEn: "Our Lord, save us from the wrongdoing people.",
    translationKeyFr: "Notre Seigneur, sauve-nous du peuple injuste.",
  },
  {
    id: 23, surah: 12, verse: 101, verseLabel: "12:101",
    arabic: "رَبِّ قَدْ آتَيْتَنِي مِنَ الْمُلْكِ... تَوَفَّنِي مُسْلِمًا",
    transliteration: "Rabbi qad ataytani minal-mulk… tawaffani musliman",
    translationKeyEn: "My Lord, You have given me authority… cause me to die as a Muslim and join me with the righteous.",
    translationKeyFr: "Mon Seigneur, Tu m'as donné une part de royauté… fais-moi mourir en soumis et rejoins-moi aux vertueux.",
  },
  {
    id: 24, surah: 14, verse: 35, verseLabel: "14:35",
    arabic: "رَبِّ اجْعَلْ هَٰذَا الْبَلَدَ آمِنًا",
    transliteration: "Rabbi ij'al hadhal-balad amina",
    translationKeyEn: "My Lord, make this city secure.",
    translationKeyFr: "Mon Seigneur, fais de cette cité un lieu sûr.",
  },
  {
    id: 25, surah: 14, verse: 40, verseLabel: "14:40",
    arabic: "رَبِّ اجْعَلْنِي مُقِيمَ الصَّلَاةِ",
    transliteration: "Rabbi ij'alni muqimas-salah",
    translationKeyEn: "My Lord, make me an establisher of prayer.",
    translationKeyFr: "Mon Seigneur, fais de moi quelqu'un qui accomplit la prière.",
  },
  {
    id: 26, surah: 14, verse: 41, verseLabel: "14:41",
    arabic: "رَبَّنَا اغْفِرْ لِي وَلِوَالِدَيَّ وَلِلْمُؤْمِنِينَ",
    transliteration: "Rabbana ighfir li wa liwalidayya wa lil-mu'mineen",
    translationKeyEn: "Our Lord, forgive me, my parents, and the believers.",
    translationKeyFr: "Notre Seigneur, pardonne-moi, ainsi qu'à mes parents et aux croyants.",
  },
  {
    id: 27, surah: 18, verse: 10, verseLabel: "18:10",
    arabic: "رَبَّنَا آتِنَا مِن لَّدُنكَ رَحْمَةً",
    transliteration: "Rabbana atina min ladunka rahmah",
    translationKeyEn: "Our Lord, grant us mercy from Yourself.",
    translationKeyFr: "Notre Seigneur, accorde-nous une miséricorde venant de Toi.",
  },
  {
    id: 28, surah: 18, verse: 24, verseLabel: "18:24",
    arabic: "وَقُلْ عَسَىٰ أَن يَهْدِيَنِ رَبِّي لِأَقْرَبَ مِنْ هَٰذَا رَشَدًا",
    transliteration: "Wa qul 'asa an yahdiyani rabbi li aqraba min hadha rashada",
    translationKeyEn: "And say: Perhaps my Lord will guide me to what is nearer than this in right conduct.",
    translationKeyFr: "Et dis : Il se peut que mon Seigneur me guide vers ce qui est plus droit que cela.",
  },
  {
    id: 29, surah: 20, verse: 45, verseLabel: "20:45",
    arabic: "رَبَّنَا إِنَّنَا نَخَافُ أَن يَفْرُطَ عَلَيْنَا",
    transliteration: "Rabbana innana nakhafu an yafruta 'alayna",
    translationKeyEn: "Our Lord, indeed we fear he will hasten punishment against us.",
    translationKeyFr: "Notre Seigneur, nous craignons qu'il ne se montre violent envers nous.",
  },
  {
    id: 30, surah: 23, verse: 94, verseLabel: "23:94",
    arabic: "رَبِّ فَلَا تَجْعَلْنِي فِي الْقَوْمِ الظَّالِمِينَ",
    transliteration: "Rabbi fala taj'alni fil-qawmiz-zalimeen",
    translationKeyEn: "My Lord, do not place me among the wrongdoing people.",
    translationKeyFr: "Mon Seigneur, ne me mets pas parmi les injustes.",
  },
  {
    id: 31, surah: 23, verse: 97, verseLabel: "23:97",
    arabic: "رَبِّ أَعُوذُ بِكَ مِنْ هَمَزَاتِ الشَّيَاطِينِ",
    transliteration: "Rabbi a'udhu bika min hamazatish-shayateen",
    translationKeyEn: "My Lord, I seek refuge in You from the incitements of the devils.",
    translationKeyFr: "Mon Seigneur, je cherche protection auprès de Toi contre les suggestions des démons.",
  },
  {
    id: 32, surah: 23, verse: 98, verseLabel: "23:98",
    arabic: "وَأَعُوذُ بِكَ رَبِّ أَن يَحْضُرُونِ",
    transliteration: "Wa a'udhu bika rabbi an yahduroon",
    translationKeyEn: "And I seek refuge in You, my Lord, lest they be present with me.",
    translationKeyFr: "Et je cherche protection auprès de Toi, mon Seigneur, contre leur présence auprès de moi.",
  },
  {
    id: 33, surah: 25, verse: 65, verseLabel: "25:65",
    arabic: "رَبَّنَا اصْرِفْ عَنَّا عَذَابَ جَهَنَّمَ",
    transliteration: "Rabbana isrif 'anna 'adhaba jahannam",
    translationKeyEn: "Our Lord, avert from us the punishment of Hell.",
    translationKeyFr: "Notre Seigneur, détourne de nous le châtiment de l'Enfer.",
  },
  {
    id: 34, surah: 25, verse: 74, verseLabel: "25:74",
    arabic: "رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ",
    transliteration: "Rabbana hab lana min azwajina wa dhurriyyatina qurrata a'yun",
    translationKeyEn: "Our Lord, grant us from our spouses and offspring comfort to our eyes.",
    translationKeyFr: "Notre Seigneur, accorde-nous, en nos épouses et nos descendants, la joie des yeux.",
  },
  {
    id: 35, surah: 26, verse: 83, verseLabel: "26:83",
    arabic: "رَبِّ هَبْ لِي حُكْمًا وَأَلْحِقْنِي بِالصَّالِحِينَ",
    transliteration: "Rabbi hab li hukman wa alhiqni bis-saliheen",
    translationKeyEn: "My Lord, grant me wisdom and join me with the righteous.",
    translationKeyFr: "Mon Seigneur, accorde-moi sagesse et fais-moi rejoindre les vertueux.",
  },
  {
    id: 36, surah: 28, verse: 16, verseLabel: "28:16",
    arabic: "رَبِّ إِنِّي ظَلَمْتُ نَفْسِي فَاغْفِرْ لِي",
    transliteration: "Rabbi inni zalamtu nafsi faghfir li",
    translationKeyEn: "My Lord, indeed I have wronged myself, so forgive me.",
    translationKeyFr: "Mon Seigneur, je me suis fait du tort à moi-même, pardonne-moi.",
  },
  {
    id: 37, surah: 28, verse: 24, verseLabel: "28:24",
    arabic: "رَبِّ إِنِّي لِمَا أَنزَلْتَ إِلَيَّ مِنْ خَيْرٍ فَقِيرٌ",
    transliteration: "Rabbi inni lima anzalta ilayya min khayrin faqeer",
    translationKeyEn: "My Lord, indeed I am in need of whatever good You send down to me.",
    translationKeyFr: "Mon Seigneur, j'ai grand besoin du bien que Tu feras descendre vers moi.",
  },
  {
    id: 38, surah: 40, verse: 7, verseLabel: "40:7",
    arabic: "رَبَّنَا وَسِعْتَ كُلَّ شَيْءٍ رَّحْمَةً وَعِلْمًا",
    transliteration: "Rabbana wasi'ta kulla shay'in rahmatan wa 'ilma",
    translationKeyEn: "Our Lord, You encompass all things in mercy and knowledge.",
    translationKeyFr: "Notre Seigneur, Tu embrasses toute chose de miséricorde et de science.",
  },
  {
    id: 39, surah: 59, verse: 10, verseLabel: "59:10",
    arabic: "رَبَّنَا اغْفِرْ لَنَا وَلِإِخْوَانِنَا الَّذِينَ سَبَقُونَا بِالْإِيمَانِ",
    transliteration: "Rabbana ighfir lana wa li ikhwaninal-ladhina sabaquna bil-iman",
    translationKeyEn: "Our Lord, forgive us and our brothers who preceded us in faith.",
    translationKeyFr: "Notre Seigneur, pardonne-nous ainsi qu'à nos frères qui nous ont précédés dans la foi.",
  },
  {
    id: 40, surah: 66, verse: 8, verseLabel: "66:8",
    arabic: "رَبَّنَا أَتْمِمْ لَنَا نُورَنَا وَاغْفِرْ لَنَا",
    transliteration: "Rabbana atmim lana nurana waghfir lana",
    translationKeyEn: "Our Lord, perfect for us our light and forgive us.",
    translationKeyFr: "Notre Seigneur, parachève pour nous notre lumière et pardonne-nous.",
  },
];

/**
 * Get the dua of the day for Ramadan based on the day number (1-40).
 * Cycles through all 40 duas if Ramadan has 30 days, it uses 1-30.
 */
export function getDailyRamadanDua(dayOfRamadan: number): QuranicDua {
  const index = ((dayOfRamadan - 1) % QURANIC_DUAS.length);
  return QURANIC_DUAS[index];
}
