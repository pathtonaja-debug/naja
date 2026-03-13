/**
 * Comprehensive Hajj & Umrah guide content
 * All content is curated from authentic Islamic sources (Quran & Sahih Hadith)
 */

export interface PilgrimageStep {
  id: string;
  titleKey: string;
  descriptionKey: string;
  detailsKey: string;
  icon: string;
}

export interface PilgrimageSection {
  id: string;
  titleKey: string;
  contentKey: string;
}

// ─── HAJJ STEPS ───
export const HAJJ_STEPS: PilgrimageStep[] = [
  { id: "ihram", titleKey: "pilgrimage.hajj.step.ihram.title", descriptionKey: "pilgrimage.hajj.step.ihram.desc", detailsKey: "pilgrimage.hajj.step.ihram.details", icon: "🕊️" },
  { id: "tawaf-qudum", titleKey: "pilgrimage.hajj.step.tawafQudum.title", descriptionKey: "pilgrimage.hajj.step.tawafQudum.desc", detailsKey: "pilgrimage.hajj.step.tawafQudum.details", icon: "🕋" },
  { id: "sai", titleKey: "pilgrimage.hajj.step.sai.title", descriptionKey: "pilgrimage.hajj.step.sai.desc", detailsKey: "pilgrimage.hajj.step.sai.details", icon: "🚶" },
  { id: "mina-8", titleKey: "pilgrimage.hajj.step.mina8.title", descriptionKey: "pilgrimage.hajj.step.mina8.desc", detailsKey: "pilgrimage.hajj.step.mina8.details", icon: "⛺" },
  { id: "arafat", titleKey: "pilgrimage.hajj.step.arafat.title", descriptionKey: "pilgrimage.hajj.step.arafat.desc", detailsKey: "pilgrimage.hajj.step.arafat.details", icon: "🤲" },
  { id: "muzdalifah", titleKey: "pilgrimage.hajj.step.muzdalifah.title", descriptionKey: "pilgrimage.hajj.step.muzdalifah.desc", detailsKey: "pilgrimage.hajj.step.muzdalifah.details", icon: "🌙" },
  { id: "rami", titleKey: "pilgrimage.hajj.step.rami.title", descriptionKey: "pilgrimage.hajj.step.rami.desc", detailsKey: "pilgrimage.hajj.step.rami.details", icon: "🪨" },
  { id: "sacrifice", titleKey: "pilgrimage.hajj.step.sacrifice.title", descriptionKey: "pilgrimage.hajj.step.sacrifice.desc", detailsKey: "pilgrimage.hajj.step.sacrifice.details", icon: "🐑" },
  { id: "halq", titleKey: "pilgrimage.hajj.step.halq.title", descriptionKey: "pilgrimage.hajj.step.halq.desc", detailsKey: "pilgrimage.hajj.step.halq.details", icon: "✂️" },
  { id: "tawaf-ifadah", titleKey: "pilgrimage.hajj.step.tawafIfadah.title", descriptionKey: "pilgrimage.hajj.step.tawafIfadah.desc", detailsKey: "pilgrimage.hajj.step.tawafIfadah.details", icon: "🕋" },
  { id: "mina-days", titleKey: "pilgrimage.hajj.step.minaDays.title", descriptionKey: "pilgrimage.hajj.step.minaDays.desc", detailsKey: "pilgrimage.hajj.step.minaDays.details", icon: "📅" },
  { id: "tawaf-wada", titleKey: "pilgrimage.hajj.step.tawafWada.title", descriptionKey: "pilgrimage.hajj.step.tawafWada.desc", detailsKey: "pilgrimage.hajj.step.tawafWada.details", icon: "👋" },
];

// ─── UMRAH STEPS ───
export const UMRAH_STEPS: PilgrimageStep[] = [
  { id: "u-ihram", titleKey: "pilgrimage.umrah.step.ihram.title", descriptionKey: "pilgrimage.umrah.step.ihram.desc", detailsKey: "pilgrimage.umrah.step.ihram.details", icon: "🕊️" },
  { id: "u-tawaf", titleKey: "pilgrimage.umrah.step.tawaf.title", descriptionKey: "pilgrimage.umrah.step.tawaf.desc", detailsKey: "pilgrimage.umrah.step.tawaf.details", icon: "🕋" },
  { id: "u-sai", titleKey: "pilgrimage.umrah.step.sai.title", descriptionKey: "pilgrimage.umrah.step.sai.desc", detailsKey: "pilgrimage.umrah.step.sai.details", icon: "🚶" },
  { id: "u-halq", titleKey: "pilgrimage.umrah.step.halq.title", descriptionKey: "pilgrimage.umrah.step.halq.desc", detailsKey: "pilgrimage.umrah.step.halq.details", icon: "✂️" },
];

// ─── HISTORY SECTIONS ───
export const HISTORY_SECTIONS: PilgrimageSection[] = [
  { id: "ibrahim", titleKey: "pilgrimage.history.ibrahim.title", contentKey: "pilgrimage.history.ibrahim.content" },
  { id: "kaaba", titleKey: "pilgrimage.history.kaaba.title", contentKey: "pilgrimage.history.kaaba.content" },
  { id: "zamzam", titleKey: "pilgrimage.history.zamzam.title", contentKey: "pilgrimage.history.zamzam.content" },
  { id: "pre-islam", titleKey: "pilgrimage.history.preIslam.title", contentKey: "pilgrimage.history.preIslam.content" },
  { id: "farewell", titleKey: "pilgrimage.history.farewell.title", contentKey: "pilgrimage.history.farewell.content" },
];

// ─── BENEFITS SECTIONS ───
export const BENEFITS_SECTIONS: PilgrimageSection[] = [
  { id: "forgiveness", titleKey: "pilgrimage.benefits.forgiveness.title", contentKey: "pilgrimage.benefits.forgiveness.content" },
  { id: "equality", titleKey: "pilgrimage.benefits.equality.title", contentKey: "pilgrimage.benefits.equality.content" },
  { id: "unity", titleKey: "pilgrimage.benefits.unity.title", contentKey: "pilgrimage.benefits.unity.content" },
  { id: "spiritual", titleKey: "pilgrimage.benefits.spiritual.title", contentKey: "pilgrimage.benefits.spiritual.content" },
  { id: "patience", titleKey: "pilgrimage.benefits.patience.title", contentKey: "pilgrimage.benefits.patience.content" },
];

// ─── DUAS FOR PILGRIMAGE ───
export interface PilgrimageDua {
  id: string;
  contextKey: string;
  arabic: string;
  transliteration: string;
  translationKey: string;
}

export const PILGRIMAGE_DUAS: PilgrimageDua[] = [
  {
    id: "talbiyah",
    contextKey: "pilgrimage.dua.talbiyah.context",
    arabic: "لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لَا شَرِيكَ لَكَ لَبَّيْكَ، إِنَّ الْحَمْدَ وَالنِّعْمَةَ لَكَ وَالْمُلْكَ، لَا شَرِيكَ لَكَ",
    transliteration: "Labbayk Allāhumma labbayk, labbayk lā sharīka laka labbayk, inna al-ḥamda wan-ni'mata laka wal-mulk, lā sharīka lak",
    translationKey: "pilgrimage.dua.talbiyah.translation",
  },
  {
    id: "tawaf-start",
    contextKey: "pilgrimage.dua.tawafStart.context",
    arabic: "بِسْمِ اللَّهِ وَاللَّهُ أَكْبَرُ",
    transliteration: "Bismillāhi wallāhu akbar",
    translationKey: "pilgrimage.dua.tawafStart.translation",
  },
  {
    id: "between-corners",
    contextKey: "pilgrimage.dua.betweenCorners.context",
    arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
    transliteration: "Rabbanā ātinā fid-dunyā ḥasanatan wa fil-ākhirati ḥasanatan wa qinā 'adhāb an-nār",
    translationKey: "pilgrimage.dua.betweenCorners.translation",
  },
  {
    id: "sai-safa",
    contextKey: "pilgrimage.dua.saiSafa.context",
    arabic: "إِنَّ الصَّفَا وَالْمَرْوَةَ مِنْ شَعَائِرِ اللَّهِ",
    transliteration: "Innaṣ-ṣafā wal-marwata min sha'ā'irillāh",
    translationKey: "pilgrimage.dua.saiSafa.translation",
  },
  {
    id: "arafat-dua",
    contextKey: "pilgrimage.dua.arafat.context",
    arabic: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
    transliteration: "Lā ilāha illallāhu waḥdahu lā sharīka lah, lahul-mulku wa lahul-ḥamdu wa huwa 'alā kulli shay'in qadīr",
    translationKey: "pilgrimage.dua.arafat.translation",
  },
];
