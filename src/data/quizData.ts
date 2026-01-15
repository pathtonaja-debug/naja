// Local quiz data for Daily Quiz feature
// 60 quizzes in English and French, organized by difficulty

export interface QuizQuestion {
  question: string;
  options: string[];
  correct_index: number;
  explanation?: string;
}

export interface Quiz {
  id: number;
  difficulty: 'easy' | 'intermediate' | 'difficult';
  questions: {
    en: QuizQuestion[];
    fr: QuizQuestion[];
  };
}

export const QUIZZES: Quiz[] = [
  // EASY (1-10)
  {
    id: 1,
    difficulty: 'easy',
    questions: {
      en: [
        { question: "Who revealed the Qur'an?", options: ["Angel Jibril", "Prophet Muhammad ﷺ", "Allah", "The Companions"], correct_index: 2 },
        { question: "In which language was the Qur'an revealed?", options: ["Persian", "Arabic", "Hebrew", "Greek"], correct_index: 1 },
        { question: "How many daily prayers are obligatory?", options: ["3", "4", "5", "6"], correct_index: 2 },
        { question: "What is the first Surah in the Qur'an?", options: ["Al-Baqarah", "Al-Ikhlas", "Al-Fatihah", "An-Nas"], correct_index: 2 }
      ],
      fr: [
        { question: "Qui a révélé le Coran ?", options: ["L'ange Jibrîl", "Le Prophète Muhammad ﷺ", "Allah", "Les Compagnons"], correct_index: 2 },
        { question: "En quelle langue le Coran a-t-il été révélé ?", options: ["Persan", "Arabe", "Hébreu", "Grec"], correct_index: 1 },
        { question: "Combien de prières quotidiennes sont obligatoires ?", options: ["3", "4", "5", "6"], correct_index: 2 },
        { question: "Quelle est la première sourate du Coran ?", options: ["Al-Baqarah", "Al-Ikhlâs", "Al-Fâtihah", "An-Nâs"], correct_index: 2 }
      ]
    }
  },
  {
    id: 2,
    difficulty: 'easy',
    questions: {
      en: [
        { question: "Who was the last Prophet?", options: ["Musa", "Isa", "Ibrahim", "Muhammad ﷺ"], correct_index: 3 },
        { question: "What is the holy book of Islam?", options: ["Bible", "Torah", "Psalms", "Qur'an"], correct_index: 3 },
        { question: "Where was the Prophet ﷺ born?", options: ["Madinah", "Jerusalem", "Ta'if", "Makkah"], correct_index: 3 },
        { question: "In which month is fasting obligatory?", options: ["Muharram", "Ramadan", "Shawwal", "Dhul Hijjah"], correct_index: 1 }
      ],
      fr: [
        { question: "Qui était le dernier Prophète ?", options: ["Mûsâ", "'Îsâ", "Ibrâhîm", "Muhammad ﷺ"], correct_index: 3 },
        { question: "Quel est le Livre sacré de l'islam ?", options: ["La Bible", "La Torah", "Les Psaumes", "Le Coran"], correct_index: 3 },
        { question: "Où le Prophète ﷺ est-il né ?", options: ["Médine", "Jérusalem", "Taïf", "La Mecque"], correct_index: 3 },
        { question: "Dans quel mois le jeûne est-il obligatoire ?", options: ["Muharram", "Ramadan", "Shawwâl", "Dhûl-Hijjah"], correct_index: 1 }
      ]
    }
  },
  {
    id: 3,
    difficulty: 'easy',
    questions: {
      en: [
        { question: "How many Rak'ahs are in Fajr (obligatory)?", options: ["1", "2", "3", "4"], correct_index: 1 },
        { question: "What direction do Muslims pray toward?", options: ["Masjid al-Aqsa", "East", "Ka'bah", "Madinah"], correct_index: 2 },
        { question: "Who was the first Caliph?", options: ["Umar", "Ali", "Uthman", "Abu Bakr"], correct_index: 3 },
        { question: "What ends the prayer?", options: ["Takbir", "Sujud", "Tashahhud", "Taslim"], correct_index: 3 }
      ],
      fr: [
        { question: "Combien de rak'ât dans Fajr (obligatoire) ?", options: ["1", "2", "3", "4"], correct_index: 1 },
        { question: "Vers quelle direction les musulmans prient-ils ?", options: ["Al-Masjid al-Aqsâ", "L'Est", "La Ka'bah", "Médine"], correct_index: 2 },
        { question: "Qui est le premier calife ?", options: ["'Umar", "'Alî", "'Uthmân", "Abû Bakr"], correct_index: 3 },
        { question: "Qu'est-ce qui termine la prière ?", options: ["Takbîr", "Sujûd", "Tashahhud", "Taslîm"], correct_index: 3 }
      ]
    }
  },
  {
    id: 4,
    difficulty: 'easy',
    questions: {
      en: [
        { question: "How many Surahs are in the Qur'an?", options: ["100", "112", "114", "116"], correct_index: 2 },
        { question: "What is Zakah?", options: ["Fasting", "Obligatory charity", "Pilgrimage", "Prayer"], correct_index: 1 },
        { question: "Which city contains the Ka'bah?", options: ["Madinah", "Ta'if", "Makkah", "Jerusalem"], correct_index: 2 },
        { question: "Who was the first human and Prophet?", options: ["Nuh", "Ibrahim", "Adam", "Musa"], correct_index: 2 }
      ],
      fr: [
        { question: "Combien y a-t-il de sourates dans le Coran ?", options: ["100", "112", "114", "116"], correct_index: 2 },
        { question: "Qu'est-ce que la Zakât ?", options: ["Le jeûne", "L'aumône obligatoire", "Le pèlerinage", "La prière"], correct_index: 1 },
        { question: "Quelle ville abrite la Ka'bah ?", options: ["Médine", "Taïf", "La Mecque", "Jérusalem"], correct_index: 2 },
        { question: "Qui était le premier humain et Prophète ?", options: ["Nûh", "Ibrâhîm", "Âdam", "Mûsâ"], correct_index: 2 }
      ]
    }
  },
  {
    id: 5,
    difficulty: 'easy',
    questions: {
      en: [
        { question: "What is Hajj?", options: ["Daily prayer", "Charity", "Pilgrimage to Makkah", "Fasting"], correct_index: 2 },
        { question: "Which Surah is the longest?", options: ["Al-Fatihah", "Al-Baqarah", "Al-'Imran", "An-Nisa"], correct_index: 1 },
        { question: "Who is Maryam's son?", options: ["Musa", "Isa", "Dawud", "Sulayman"], correct_index: 1 },
        { question: "What breaks the fast intentionally?", options: ["Sleeping", "Intention", "Eating", "Walking"], correct_index: 2 }
      ],
      fr: [
        { question: "Qu'est-ce que le Hajj ?", options: ["La prière quotidienne", "L'aumône", "Le pèlerinage à La Mecque", "Le jeûne"], correct_index: 2 },
        { question: "Quelle sourate est la plus longue ?", options: ["Al-Fâtihah", "Al-Baqarah", "Âl 'Imrân", "An-Nisâ'"], correct_index: 1 },
        { question: "Qui est le fils de Maryam ?", options: ["Mûsâ", "'Îsâ", "Dâwûd", "Sulaymân"], correct_index: 1 },
        { question: "Qu'est-ce qui rompt le jeûne volontairement ?", options: ["Dormir", "L'intention", "Manger", "Marcher"], correct_index: 2 }
      ]
    }
  },
  {
    id: 6,
    difficulty: 'easy',
    questions: {
      en: [
        { question: "What is Tawhid?", options: ["Prayer", "Worshipping Allah alone", "Charity", "Migration"], correct_index: 1 },
        { question: "Who led the Muslims in prayer during the Prophet's ﷺ final illness?", options: ["Ali", "Umar", "Abu Bakr", "Uthman"], correct_index: 2 },
        { question: "What is Wudu?", options: ["Fasting", "Charity", "Ablution", "Pilgrimage"], correct_index: 2 },
        { question: "Which angel brought revelation to the Prophets?", options: ["Mikail", "Israfil", "Jibril", "Malik"], correct_index: 2 }
      ],
      fr: [
        { question: "Qu'est-ce que le Tawhîd ?", options: ["La prière", "Adorer Allah seul", "L'aumône", "L'émigration"], correct_index: 1 },
        { question: "Qui a dirigé la prière pendant la dernière maladie du Prophète ﷺ ?", options: ["'Alî", "'Umar", "Abû Bakr", "'Uthmân"], correct_index: 2 },
        { question: "Qu'est-ce que le Wudû' ?", options: ["Le jeûne", "L'aumône", "Les ablutions", "Le pèlerinage"], correct_index: 2 },
        { question: "Quel ange apporte la révélation aux Prophètes ?", options: ["Mîkâ'îl", "Isrâfîl", "Jibrîl", "Mâlik"], correct_index: 2 }
      ]
    }
  },
  {
    id: 7,
    difficulty: 'easy',
    questions: {
      en: [
        { question: "How many Rak'ahs are in Maghrib (obligatory)?", options: ["2", "3", "4", "5"], correct_index: 1 },
        { question: "What is the Muslim declaration of faith called?", options: ["Du'a", "Adhan", "Shahadah", "Tasbih"], correct_index: 2 },
        { question: "Which Surah is about pure sincerity to Allah?", options: ["Al-Kafirun", "Al-Ikhlas", "Al-Falaq", "An-Nas"], correct_index: 1 },
        { question: "Who compiled Riyad as-Salihin?", options: ["Al-Bukhari", "Muslim", "An-Nawawi", "Ibn Kathir"], correct_index: 2 }
      ],
      fr: [
        { question: "Combien de rak'ât dans Maghrib (obligatoire) ?", options: ["2", "3", "4", "5"], correct_index: 1 },
        { question: "Comment s'appelle l'attestation de foi musulmane ?", options: ["Du'â", "Adhân", "Shahâdah", "Tasbîh"], correct_index: 2 },
        { question: "Quelle sourate parle de la sincérité pure envers Allah ?", options: ["Al-Kâfirûn", "Al-Ikhlâs", "Al-Falaq", "An-Nâs"], correct_index: 1 },
        { question: "Qui a compilé Riyâd as-Sâlihîn ?", options: ["Al-Bukhârî", "Muslim", "An-Nawawî", "Ibn Kathîr"], correct_index: 2 }
      ]
    }
  },
  {
    id: 8,
    difficulty: 'easy',
    questions: {
      en: [
        { question: "What is Sujud?", options: ["Standing", "Bowing", "Prostration", "Sitting"], correct_index: 2 },
        { question: "How many Rak'ahs are in Dhuhr (obligatory)?", options: ["2", "3", "4", "5"], correct_index: 2 },
        { question: "Which month comes after Ramadan?", options: ["Rajab", "Sha'ban", "Shawwal", "Dhul Qa'dah"], correct_index: 2 },
        { question: "What is the call to prayer?", options: ["Iqamah", "Du'a", "Adhan", "Takbir"], correct_index: 2 }
      ],
      fr: [
        { question: "Qu'est-ce que le Sujûd ?", options: ["La station debout", "L'inclinaison", "La prosternation", "La position assise"], correct_index: 2 },
        { question: "Combien de rak'ât dans Dhuhr (obligatoire) ?", options: ["2", "3", "4", "5"], correct_index: 2 },
        { question: "Quel mois vient après Ramadan ?", options: ["Rajab", "Sha'bân", "Shawwâl", "Dhûl-Qa'dah"], correct_index: 2 },
        { question: "Quel est l'appel à la prière ?", options: ["Iqâmah", "Du'â", "Adhân", "Takbîr"], correct_index: 2 }
      ]
    }
  },
  {
    id: 9,
    difficulty: 'easy',
    questions: {
      en: [
        { question: "What is Sawm?", options: ["Charity", "Prayer", "Fasting", "Pilgrimage"], correct_index: 2 },
        { question: "Which prayer is after sunset at night?", options: ["Fajr", "Isha", "Dhuhr", "Asr"], correct_index: 1 },
        { question: "What is the Sacred House called?", options: ["Masjid", "Ka'bah", "Mihrab", "Minbar"], correct_index: 1 },
        { question: "Who authored Tafsir Ibn Kathir?", options: ["Al-Ghazali", "Ibn Taymiyyah", "Ibn Kathir", "An-Nawawi"], correct_index: 2 }
      ],
      fr: [
        { question: "Qu'est-ce que le Sawm ?", options: ["L'aumône", "La prière", "Le jeûne", "Le pèlerinage"], correct_index: 2 },
        { question: "Quelle prière est après le coucher du soleil la nuit ?", options: ["Fajr", "'Ishâ'", "Dhuhr", "'Asr"], correct_index: 1 },
        { question: "Comment s'appelle la Maison Sacrée ?", options: ["Masjid", "Ka'bah", "Mihrâb", "Minbar"], correct_index: 1 },
        { question: "Qui a écrit le Tafsîr Ibn Kathîr ?", options: ["Al-Ghazâlî", "Ibn Taymiyyah", "Ibn Kathîr", "An-Nawawî"], correct_index: 2 }
      ]
    }
  },
  {
    id: 10,
    difficulty: 'easy',
    questions: {
      en: [
        { question: "What is the greeting of Muslims?", options: ["Hello", "As-salamu 'alaykum", "Welcome", "Peace (only in English)"], correct_index: 1 },
        { question: "Which prayer is before sunrise?", options: ["Isha", "Fajr", "Dhuhr", "Asr"], correct_index: 1 },
        { question: "What is the Islamic calendar based on?", options: ["Sun", "Stars", "Moon", "Seasons"], correct_index: 2 },
        { question: "What is Du'a?", options: ["Supplication", "Charity", "Fasting", "Travel"], correct_index: 0 }
      ],
      fr: [
        { question: "Quelle est la salutation des musulmans ?", options: ["Hello", "As-salamu 'alaykum", "Bienvenue", "Paix (seulement en anglais)"], correct_index: 1 },
        { question: "Quelle prière est avant le lever du soleil ?", options: ["'Ishâ'", "Fajr", "Dhuhr", "'Asr"], correct_index: 1 },
        { question: "Sur quoi est basé le calendrier islamique ?", options: ["Le soleil", "Les étoiles", "La lune", "Les saisons"], correct_index: 2 },
        { question: "Qu'est-ce que le Du'â ?", options: ["L'invocation", "L'aumône", "Le jeûne", "Le voyage"], correct_index: 0 }
      ]
    }
  },
  // INTERMEDIATE (11-40)
  {
    id: 11,
    difficulty: 'intermediate',
    questions: {
      en: [
        { question: "What event marks the start of the Islamic calendar?", options: ["Revelation", "Hijrah", "Badr", "Farewell Sermon"], correct_index: 1 },
        { question: "Which Surah contains the first revealed verses?", options: ["Al-Fatihah", "Al-'Alaq", "Al-Muddaththir", "Al-Qalam"], correct_index: 1 },
        { question: "How many Rak'ahs are in Asr (obligatory)?", options: ["2", "3", "4", "5"], correct_index: 2 },
        { question: "Which of these breaks Wudu?", options: ["Smiling", "Reading", "Passing wind", "Looking"], correct_index: 2 }
      ],
      fr: [
        { question: "Quel événement marque le début du calendrier islamique ?", options: ["La révélation", "L'Hijrah", "Badr", "Le sermon d'adieu"], correct_index: 1 },
        { question: "Quelle sourate contient les premiers versets révélés ?", options: ["Al-Fâtihah", "Al-'Alaq", "Al-Muddaththir", "Al-Qalam"], correct_index: 1 },
        { question: "Combien de rak'ât dans 'Asr (obligatoire) ?", options: ["2", "3", "4", "5"], correct_index: 2 },
        { question: "Qu'est-ce qui annule le Wudû' ?", options: ["Sourire", "Lire", "Émettre des gaz", "Regarder"], correct_index: 2 }
      ]
    }
  },
  {
    id: 12,
    difficulty: 'intermediate',
    questions: {
      en: [
        { question: "Who was known as 'Al-Amin' (the trustworthy)?", options: ["Abu Bakr", "Umar", "Muhammad ﷺ", "Ali"], correct_index: 2 },
        { question: "Which Surah has two places of prostration (sajdah)?", options: ["Al-Hajj", "Al-'Alaq", "Fussilat", "An-Najm"], correct_index: 0 },
        { question: "Nisab for Zakah is classically based on which metals?", options: ["Iron/copper", "Silver/gold", "Tin/lead", "None"], correct_index: 1 },
        { question: "Which obligatory prayers are shortened during travel (qasr)?", options: ["2-Rak'ah prayers", "3-Rak'ah prayers", "4-Rak'ah prayers", "Only Witr"], correct_index: 2 }
      ],
      fr: [
        { question: "Qui était connu comme 'Al-Amîn' (le digne de confiance) ?", options: ["Abû Bakr", "'Umar", "Muhammad ﷺ", "'Alî"], correct_index: 2 },
        { question: "Quelle sourate a deux emplacements de prosternation (sajdah) ?", options: ["Al-Hajj", "Al-'Alaq", "Fussilat", "An-Najm"], correct_index: 0 },
        { question: "Le nisâb de la Zakât est classiquement basé sur quels métaux ?", options: ["Fer/cuivre", "Argent/or", "Étain/plomb", "Aucun"], correct_index: 1 },
        { question: "Quelles prières obligatoires sont raccourcies en voyage (qasr) ?", options: ["Prières de 2 rak'ât", "Prières de 3 rak'ât", "Prières de 4 rak'ât", "Seulement Witr"], correct_index: 2 }
      ]
    }
  },
  {
    id: 13,
    difficulty: 'intermediate',
    questions: {
      en: [
        { question: "What is the Night of Decree called?", options: ["Laylat al-Mi'raj", "Laylat al-Badr", "Laylat al-Qadr", "Laylat al-Fitr"], correct_index: 2 },
        { question: "Which Surah begins with 'Qul' (Say)?", options: ["Al-Ikhlas", "Al-Kawthar", "Al-Fil", "Quraysh"], correct_index: 0 },
        { question: "What nullifies fasting?", options: ["Intentional eating", "Forgetting and eating", "Sleeping", "Showering"], correct_index: 0 },
        { question: "Who is famously among the most prolific narrators found in Riyad as-Salihin?", options: ["Umar", "Abu Hurayrah", "Ali", "Ibn Mas'ud"], correct_index: 1 }
      ],
      fr: [
        { question: "Comment s'appelle la Nuit du Destin ?", options: ["Laylat al-Mi'râj", "Laylat al-Badr", "Laylat al-Qadr", "Laylat al-Fitr"], correct_index: 2 },
        { question: "Quelle sourate commence par 'Qul' (Dis) ?", options: ["Al-Ikhlâs", "Al-Kawthar", "Al-Fîl", "Quraysh"], correct_index: 0 },
        { question: "Qu'est-ce qui annule le jeûne ?", options: ["Manger volontairement", "Oublier et manger", "Dormir", "Se doucher"], correct_index: 0 },
        { question: "Qui est célèbre parmi les narrateurs les plus prolifiques dans Riyâd as-Sâlihîn ?", options: ["'Umar", "Abû Hurayrah", "'Alî", "Ibn Mas'ûd"], correct_index: 1 }
      ]
    }
  },
  {
    id: 14,
    difficulty: 'intermediate',
    questions: {
      en: [
        { question: "What is Jumu'ah?", options: ["Night prayer", "Friday congregational prayer", "Eid prayer", "Funeral prayer"], correct_index: 1 },
        { question: "How many Takbirs are in the Janazah prayer?", options: ["2", "3", "4", "5"], correct_index: 2 },
        { question: "Which Surah is commonly recited for protection from envy/evil?", options: ["Al-Ikhlas", "Al-Falaq", "Al-Kafirun", "Al-Ma'un"], correct_index: 1 },
        { question: "What is Iqamah?", options: ["Call to prayer (Adhan)", "Announcement to start the prayer", "Supplication", "Sermon"], correct_index: 1 }
      ],
      fr: [
        { question: "Qu'est-ce que Jumu'ah ?", options: ["Prière de nuit", "Prière congregationnelle du vendredi", "Prière de l'Aïd", "Prière funéraire"], correct_index: 1 },
        { question: "Combien de Takbîrs dans la prière de Janâzah ?", options: ["2", "3", "4", "5"], correct_index: 2 },
        { question: "Quelle sourate est couramment récitée pour la protection contre l'envie/le mal ?", options: ["Al-Ikhlâs", "Al-Falaq", "Al-Kâfirûn", "Al-Mâ'ûn"], correct_index: 1 },
        { question: "Qu'est-ce que l'Iqâmah ?", options: ["L'appel à la prière (Adhân)", "L'annonce du début de la prière", "L'invocation", "Le sermon"], correct_index: 1 }
      ]
    }
  },
  {
    id: 15,
    difficulty: 'intermediate',
    questions: {
      en: [
        { question: "The Qiblah changed from where to where?", options: ["Makkah to Aqsa", "Aqsa to Makkah", "Madinah to Ta'if", "None"], correct_index: 1 },
        { question: "Which Prophet rebuilt the Ka'bah with his son?", options: ["Adam", "Ibrahim", "Nuh", "Musa"], correct_index: 1 },
        { question: "Which prayer is known to have no confirmed Sunnah before it?", options: ["Fajr", "Dhuhr", "Asr", "Maghrib"], correct_index: 2 },
        { question: "What is Taharah?", options: ["Prayer", "Purification", "Charity", "Fasting"], correct_index: 1 }
      ],
      fr: [
        { question: "La Qiblah a changé d'où vers où ?", options: ["La Mecque vers Al-Aqsâ", "Al-Aqsâ vers La Mecque", "Médine vers Taïf", "Aucun"], correct_index: 1 },
        { question: "Quel Prophète a reconstruit la Ka'bah avec son fils ?", options: ["Âdam", "Ibrâhîm", "Nûh", "Mûsâ"], correct_index: 1 },
        { question: "Quelle prière n'a pas de Sunnah confirmée avant elle ?", options: ["Fajr", "Dhuhr", "'Asr", "Maghrib"], correct_index: 2 },
        { question: "Qu'est-ce que la Tahârah ?", options: ["La prière", "La purification", "L'aumône", "Le jeûne"], correct_index: 1 }
      ]
    }
  },
  {
    id: 16,
    difficulty: 'intermediate',
    questions: {
      en: [
        { question: "Which Surah mentions Abu Lahab?", options: ["Quraysh", "Al-Fil", "Al-Masad", "Al-Humazah"], correct_index: 2 },
        { question: "What is Ruku'?", options: ["Prostration", "Sitting", "Bowing", "Standing"], correct_index: 2 },
        { question: "Which clearly invalidates the prayer?", options: ["Minor movement", "Intentional speech", "Blinking", "Breathing"], correct_index: 1 },
        { question: "What is the main feature of Jumu'ah compared to Dhuhr?", options: ["It is silent", "It has a khutbah", "It is after Maghrib", "It is at night"], correct_index: 1 }
      ],
      fr: [
        { question: "Quelle sourate mentionne Abû Lahab ?", options: ["Quraysh", "Al-Fîl", "Al-Masad", "Al-Humazah"], correct_index: 2 },
        { question: "Qu'est-ce que le Rukû' ?", options: ["La prosternation", "La position assise", "L'inclinaison", "La station debout"], correct_index: 2 },
        { question: "Qu'est-ce qui invalide clairement la prière ?", options: ["Petit mouvement", "Parole intentionnelle", "Cligner des yeux", "Respirer"], correct_index: 1 },
        { question: "Quelle est la caractéristique principale de Jumu'ah par rapport à Dhuhr ?", options: ["Elle est silencieuse", "Elle a une khutbah", "Elle est après Maghrib", "Elle est la nuit"], correct_index: 1 }
      ]
    }
  },
  {
    id: 17,
    difficulty: 'intermediate',
    questions: {
      en: [
        { question: "The Farewell Sermon emphasized mainly:", options: ["War plans", "Rights and sanctity of life/wealth", "Farming", "Architecture"], correct_index: 1 },
        { question: "Which Surah is a well-known Madinan Surah?", options: ["Al-Baqarah", "Al-Fil", "Al-Ikhlas", "Al-Kawthar"], correct_index: 0 },
        { question: "What is Qunut?", options: ["Bowing", "Prostration", "Supplication in prayer", "Sitting"], correct_index: 2 },
        { question: "Which obligatory prayer is recited aloud?", options: ["Dhuhr", "Asr", "Maghrib", "All"], correct_index: 2 }
      ],
      fr: [
        { question: "Le sermon d'adieu a principalement souligné :", options: ["Les plans de guerre", "Les droits et la sacralité de la vie/des biens", "L'agriculture", "L'architecture"], correct_index: 1 },
        { question: "Quelle sourate est une sourate médinoise bien connue ?", options: ["Al-Baqarah", "Al-Fîl", "Al-Ikhlâs", "Al-Kawthar"], correct_index: 0 },
        { question: "Qu'est-ce que le Qunût ?", options: ["L'inclinaison", "La prosternation", "L'invocation dans la prière", "La position assise"], correct_index: 2 },
        { question: "Quelle prière obligatoire est récitée à voix haute ?", options: ["Dhuhr", "'Asr", "Maghrib", "Toutes"], correct_index: 2 }
      ]
    }
  },
  {
    id: 18,
    difficulty: 'intermediate',
    questions: {
      en: [
        { question: "Who was the second Caliph?", options: ["Abu Bakr", "Umar", "Uthman", "Ali"], correct_index: 1 },
        { question: "Which Surah speaks about time?", options: ["Al-Asr", "Al-Qadr", "Al-Fajr", "Ad-Duha"], correct_index: 0 },
        { question: "What breaks the prayer?", options: ["Forgetfulness alone", "Turning away fully from Qiblah", "Standing", "Intention"], correct_index: 1 },
        { question: "What is I'tikaf?", options: ["Charity", "Seclusion in the mosque for worship", "Travel", "Battle"], correct_index: 1 }
      ],
      fr: [
        { question: "Qui était le deuxième calife ?", options: ["Abû Bakr", "'Umar", "'Uthmân", "'Alî"], correct_index: 1 },
        { question: "Quelle sourate parle du temps ?", options: ["Al-'Asr", "Al-Qadr", "Al-Fajr", "Ad-Duhâ"], correct_index: 0 },
        { question: "Qu'est-ce qui rompt la prière ?", options: ["L'oubli seul", "Se détourner complètement de la Qiblah", "Se tenir debout", "L'intention"], correct_index: 1 },
        { question: "Qu'est-ce que l'I'tikâf ?", options: ["L'aumône", "La retraite à la mosquée pour l'adoration", "Le voyage", "La bataille"], correct_index: 1 }
      ]
    }
  },
  {
    id: 19,
    difficulty: 'intermediate',
    questions: {
      en: [
        { question: "Which angel blows the Trumpet?", options: ["Jibril", "Mikail", "Israfil", "Malik"], correct_index: 2 },
        { question: "What is the Mi'raj?", options: ["Migration", "Ascension", "Battle", "Treaty"], correct_index: 1 },
        { question: "What is the ruling of Zakah?", options: ["Optional", "Recommended", "Obligatory", "Forbidden"], correct_index: 2 },
        { question: "What replaces Dhuhr on Friday for those attending?", options: ["Eid", "Jumu'ah", "Janazah", "Witr"], correct_index: 1 }
      ],
      fr: [
        { question: "Quel ange souffle dans la Trompette ?", options: ["Jibrîl", "Mîkâ'îl", "Isrâfîl", "Mâlik"], correct_index: 2 },
        { question: "Qu'est-ce que le Mi'râj ?", options: ["La migration", "L'ascension", "La bataille", "Le traité"], correct_index: 1 },
        { question: "Quel est le statut de la Zakât ?", options: ["Optionnelle", "Recommandée", "Obligatoire", "Interdite"], correct_index: 2 },
        { question: "Qu'est-ce qui remplace Dhuhr le vendredi pour ceux qui y assistent ?", options: ["L'Aïd", "Jumu'ah", "Janâzah", "Witr"], correct_index: 1 }
      ]
    }
  },
  {
    id: 20,
    difficulty: 'intermediate',
    questions: {
      en: [
        { question: "Which Surah has the most verses?", options: ["Al-Baqarah", "Al-'Imran", "An-Nisa", "Al-A'raf"], correct_index: 0 },
        { question: "What is Witr?", options: ["Obligatory (fard)", "Night prayer (Sunnah) with odd number", "Eid prayer", "Funeral prayer"], correct_index: 1 },
        { question: "When is intention for Ramadan fasting made?", options: ["Before dawn (night)", "Noon", "Sunset only", "After Fajr"], correct_index: 0 },
        { question: "Which phrase is authentic about fasting?", options: ["'Fasting is for Me'", "'Fasting is disliked'", "'Fasting is only culture'", "'Fasting is harmful'"], correct_index: 0 }
      ],
      fr: [
        { question: "Quelle sourate a le plus de versets ?", options: ["Al-Baqarah", "Âl 'Imrân", "An-Nisâ'", "Al-A'râf"], correct_index: 0 },
        { question: "Qu'est-ce que le Witr ?", options: ["Obligatoire (fard)", "Prière de nuit (Sunnah) avec nombre impair", "Prière de l'Aïd", "Prière funéraire"], correct_index: 1 },
        { question: "Quand l'intention pour le jeûne de Ramadan est-elle faite ?", options: ["Avant l'aube (la nuit)", "Midi", "Coucher du soleil seulement", "Après Fajr"], correct_index: 0 },
        { question: "Quelle phrase est authentique concernant le jeûne ?", options: ["'Le jeûne est pour Moi'", "'Le jeûne est déconseillé'", "'Le jeûne est juste culturel'", "'Le jeûne est nuisible'"], correct_index: 0 }
      ]
    }
  },
  {
    id: 21,
    difficulty: 'intermediate',
    questions: {
      en: [
        { question: "Which verse permits shortening prayer during travel?", options: ["Qur'an 2:255", "Qur'an 4:101", "Qur'an 1:1", "Qur'an 112:1"], correct_index: 1 },
        { question: "Which Surah begins with an oath by time?", options: ["Al-Fajr", "Al-Asr", "Ad-Duha", "Al-Layl"], correct_index: 1 },
        { question: "What is the ruling of Sunnah prayers in general?", options: ["Forbidden", "Recommended", "Always obligatory", "Invalid"], correct_index: 1 },
        { question: "Which prayer is commonly prayed after 'Isha?", options: ["Duha", "Witr", "Eid", "Janazah"], correct_index: 1 }
      ],
      fr: [
        { question: "Quel verset permet de raccourcir la prière en voyage ?", options: ["Coran 2:255", "Coran 4:101", "Coran 1:1", "Coran 112:1"], correct_index: 1 },
        { question: "Quelle sourate commence par un serment sur le temps ?", options: ["Al-Fajr", "Al-'Asr", "Ad-Duhâ", "Al-Layl"], correct_index: 1 },
        { question: "Quel est le statut des prières Sunnah en général ?", options: ["Interdites", "Recommandées", "Toujours obligatoires", "Invalides"], correct_index: 1 },
        { question: "Quelle prière est couramment priée après 'Ishâ' ?", options: ["Duhâ", "Witr", "L'Aïd", "Janâzah"], correct_index: 1 }
      ]
    }
  },
  {
    id: 22,
    difficulty: 'intermediate',
    questions: {
      en: [
        { question: "Which verse allows dry ablution (tayammum)?", options: ["Qur'an 2:183", "Qur'an 4:43", "Qur'an 1:7", "Qur'an 106:1"], correct_index: 1 },
        { question: "Which Surah mentions the People of the Cave?", options: ["Maryam", "Al-Kahf", "Ta-Ha", "Ya-Sin"], correct_index: 1 },
        { question: "Which hadith collection is arranged by books/chapters including prayer and purification?", options: ["Tafsir Ibn Kathir", "Sahih al-Bukhari", "Poetry anthology", "History chronicle"], correct_index: 1 },
        { question: "What is the first pillar of Islam?", options: ["Prayer", "Zakah", "Shahadah", "Fasting"], correct_index: 2 }
      ],
      fr: [
        { question: "Quel verset autorise les ablutions sèches (tayammum) ?", options: ["Coran 2:183", "Coran 4:43", "Coran 1:7", "Coran 106:1"], correct_index: 1 },
        { question: "Quelle sourate mentionne les Gens de la Caverne ?", options: ["Maryam", "Al-Kahf", "Tâ-Hâ", "Yâ-Sîn"], correct_index: 1 },
        { question: "Quelle collection de hadiths est organisée par livres/chapitres incluant la prière et la purification ?", options: ["Tafsîr Ibn Kathîr", "Sahîh al-Bukhârî", "Anthologie de poésie", "Chronique historique"], correct_index: 1 },
        { question: "Quel est le premier pilier de l'islam ?", options: ["La prière", "La Zakât", "La Shahâdah", "Le jeûne"], correct_index: 2 }
      ]
    }
  },
  {
    id: 23,
    difficulty: 'intermediate',
    questions: {
      en: [
        { question: "Eid prayer is generally classified as:", options: ["Forbidden", "Recommended act of worship", "Always invalid", "Not a prayer"], correct_index: 1 },
        { question: "Which Surah begins with 'Alhamdulillah'?", options: ["Al-Fatihah", "Al-An'am", "Al-Kahf", "All"], correct_index: 3 },
        { question: "If someone eats forgetfully while fasting, what is the ruling?", options: ["Fast is broken", "Fast continues", "Must pay expiation", "Must stop fasting forever"], correct_index: 1 },
        { question: "What is the khutbah?", options: ["Supplication only", "Call to prayer", "Sermon", "Recitation only"], correct_index: 2 }
      ],
      fr: [
        { question: "La prière de l'Aïd est généralement classée comme :", options: ["Interdite", "Acte d'adoration recommandé", "Toujours invalide", "Pas une prière"], correct_index: 1 },
        { question: "Quelle sourate commence par 'Alhamdulillah' ?", options: ["Al-Fâtihah", "Al-An'âm", "Al-Kahf", "Toutes"], correct_index: 3 },
        { question: "Si quelqu'un mange par oubli pendant le jeûne, quel est le statut ?", options: ["Le jeûne est rompu", "Le jeûne continue", "Doit payer une expiation", "Doit arrêter de jeûner pour toujours"], correct_index: 1 },
        { question: "Qu'est-ce que la khutbah ?", options: ["Invocation seulement", "Appel à la prière", "Sermon", "Récitation seulement"], correct_index: 2 }
      ]
    }
  },
  {
    id: 24,
    difficulty: 'intermediate',
    questions: {
      en: [
        { question: "Which obligatory prayer is silent in recitation?", options: ["Fajr", "Maghrib", "Isha", "Dhuhr"], correct_index: 3 },
        { question: "Duha prayer is generally:", options: ["Obligatory", "Sunnah", "Forbidden", "Impossible"], correct_index: 1 },
        { question: "What is Miqat?", options: ["Boundary where ihram begins", "Place of prayer", "Market", "Graveyard"], correct_index: 0 },
        { question: "What is Ihram?", options: ["State entered for Hajj/'Umrah", "Charity", "Fasting", "A sermon"], correct_index: 0 }
      ],
      fr: [
        { question: "Quelle prière obligatoire est silencieuse dans la récitation ?", options: ["Fajr", "Maghrib", "'Ishâ'", "Dhuhr"], correct_index: 3 },
        { question: "La prière Duhâ est généralement :", options: ["Obligatoire", "Sunnah", "Interdite", "Impossible"], correct_index: 1 },
        { question: "Qu'est-ce que le Mîqât ?", options: ["Limite où commence l'ihrâm", "Lieu de prière", "Marché", "Cimetière"], correct_index: 0 },
        { question: "Qu'est-ce que l'Ihrâm ?", options: ["État entré pour le Hajj/'Umrah", "L'aumône", "Le jeûne", "Un sermon"], correct_index: 0 }
      ]
    }
  },
  {
    id: 25,
    difficulty: 'intermediate',
    questions: {
      en: [
        { question: "Which Surah directly names 'the hypocrites'?", options: ["Al-Munafiqun", "Al-Fil", "Al-Kawthar", "An-Nas"], correct_index: 0 },
        { question: "If someone makes a small mistake in prayer, what often corrects it?", options: ["Leaving Islam", "Sujud as-sahw", "Breaking Wudu", "Travel"], correct_index: 1 },
        { question: "What is Tarawih?", options: ["Night prayer in Ramadan", "Eid prayer", "Funeral prayer", "Travel-only prayer"], correct_index: 0 },
        { question: "What is the ruling of backbiting?", options: ["Permissible", "Disliked only", "Sin", "Mandatory"], correct_index: 2 }
      ],
      fr: [
        { question: "Quelle sourate nomme directement 'les hypocrites' ?", options: ["Al-Munâfiqûn", "Al-Fîl", "Al-Kawthar", "An-Nâs"], correct_index: 0 },
        { question: "Si quelqu'un fait une petite erreur dans la prière, qu'est-ce qui la corrige souvent ?", options: ["Quitter l'islam", "Sujûd as-sahw", "Rompre le Wudû'", "Voyager"], correct_index: 1 },
        { question: "Qu'est-ce que Tarâwîh ?", options: ["Prière de nuit en Ramadan", "Prière de l'Aïd", "Prière funéraire", "Prière uniquement en voyage"], correct_index: 0 },
        { question: "Quel est le statut de la médisance ?", options: ["Permise", "Seulement déconseillée", "Péché", "Obligatoire"], correct_index: 2 }
      ]
    }
  },
  {
    id: 26,
    difficulty: 'intermediate',
    questions: {
      en: [
        { question: "Fasting becomes obligatory when a person reaches:", options: ["Age 7", "Age 10", "Puberty", "Age 18"], correct_index: 2 },
        { question: "Which Surah states believers are brothers?", options: ["Al-Hujurat", "Al-Fil", "Quraysh", "Al-Masad"], correct_index: 0 },
        { question: "What is Qada'?", options: ["Making up missed worship", "Charity", "Travel", "Showing off"], correct_index: 0 },
        { question: "When does the time for Witr end?", options: ["At dawn", "At noon", "At sunset", "After Asr"], correct_index: 0 }
      ],
      fr: [
        { question: "Le jeûne devient obligatoire quand une personne atteint :", options: ["7 ans", "10 ans", "La puberté", "18 ans"], correct_index: 2 },
        { question: "Quelle sourate affirme que les croyants sont des frères ?", options: ["Al-Hujurât", "Al-Fîl", "Quraysh", "Al-Masad"], correct_index: 0 },
        { question: "Qu'est-ce que le Qadâ' ?", options: ["Rattraper une adoration manquée", "L'aumône", "Le voyage", "L'ostentation"], correct_index: 0 },
        { question: "Quand se termine le temps du Witr ?", options: ["À l'aube", "À midi", "Au coucher du soleil", "Après 'Asr"], correct_index: 0 }
      ]
    }
  },
  {
    id: 27,
    difficulty: 'intermediate',
    questions: {
      en: [
        { question: "Which is clearly forbidden in hadith?", options: ["Truthfulness", "Backbiting", "Smiling", "Charity"], correct_index: 1 },
        { question: "Which Surah warns against fraud in measures/weights?", options: ["Al-Mutaffifin", "Al-Fil", "Al-Kawthar", "Quraysh"], correct_index: 0 },
        { question: "Which is a pillar (rukn) of the prayer?", options: ["Standing (for those able)", "Eating", "Trading", "Sleeping"], correct_index: 0 },
        { question: "Patience is promised with:", options: ["Only wealth", "Reward without measure", "No reward", "Punishment"], correct_index: 1 }
      ],
      fr: [
        { question: "Qu'est-ce qui est clairement interdit dans les hadiths ?", options: ["La véracité", "La médisance", "Le sourire", "L'aumône"], correct_index: 1 },
        { question: "Quelle sourate met en garde contre la fraude dans les mesures/poids ?", options: ["Al-Mutaffifîn", "Al-Fîl", "Al-Kawthar", "Quraysh"], correct_index: 0 },
        { question: "Qu'est-ce qui est un pilier (rukn) de la prière ?", options: ["Se tenir debout (pour ceux qui le peuvent)", "Manger", "Commercer", "Dormir"], correct_index: 0 },
        { question: "La patience est promise avec :", options: ["Seulement la richesse", "Une récompense sans mesure", "Aucune récompense", "Un châtiment"], correct_index: 1 }
      ]
    }
  },
  {
    id: 28,
    difficulty: 'intermediate',
    questions: {
      en: [
        { question: "Which Surah is named 'Divorce'?", options: ["An-Nisa", "Al-Baqarah", "At-Talaq", "Al-Mujadilah"], correct_index: 2 },
        { question: "Which clearly breaks prayer?", options: ["Laughing audibly", "Thinking", "Breathing", "Blinking"], correct_index: 0 },
        { question: "Lying as a habit is:", options: ["Permissible", "Neutral", "Sin", "Obligatory"], correct_index: 2 },
        { question: "What is the minimum Rak'ah count for Witr?", options: ["1", "2", "3", "5"], correct_index: 0 }
      ],
      fr: [
        { question: "Quelle sourate s'appelle 'Le Divorce' ?", options: ["An-Nisâ'", "Al-Baqarah", "At-Talâq", "Al-Mujâdilah"], correct_index: 2 },
        { question: "Qu'est-ce qui rompt clairement la prière ?", options: ["Rire audiblement", "Penser", "Respirer", "Cligner des yeux"], correct_index: 0 },
        { question: "Mentir comme habitude est :", options: ["Permis", "Neutre", "Un péché", "Obligatoire"], correct_index: 2 },
        { question: "Quel est le nombre minimum de rak'ât pour le Witr ?", options: ["1", "2", "3", "5"], correct_index: 0 }
      ]
    }
  },
  {
    id: 29,
    difficulty: 'intermediate',
    questions: {
      en: [
        { question: "Which Surah is named 'Sincerity'?", options: ["Al-Bayyinah", "Al-Ikhlas", "Al-Asr", "Al-'Adiyat"], correct_index: 1 },
        { question: "Breaking an oath requires:", options: ["Nothing", "Expiation", "Only travel", "A new name"], correct_index: 1 },
        { question: "Tayammum is primarily used when:", options: ["Water is abundant", "Water is unavailable/harmful", "One is wealthy", "One is hungry"], correct_index: 1 },
        { question: "What does 'Islam' mean?", options: ["Peace only", "Submission", "Culture", "Poetry"], correct_index: 1 }
      ],
      fr: [
        { question: "Quelle sourate s'appelle 'La Sincérité' ?", options: ["Al-Bayyinah", "Al-Ikhlâs", "Al-'Asr", "Al-'Âdiyât"], correct_index: 1 },
        { question: "Rompre un serment nécessite :", options: ["Rien", "Une expiation", "Seulement un voyage", "Un nouveau nom"], correct_index: 1 },
        { question: "Le Tayammum est principalement utilisé quand :", options: ["L'eau est abondante", "L'eau est indisponible/nuisible", "On est riche", "On a faim"], correct_index: 1 },
        { question: "Que signifie 'Islam' ?", options: ["Paix seulement", "Soumission", "Culture", "Poésie"], correct_index: 1 }
      ]
    }
  },
  {
    id: 30,
    difficulty: 'intermediate',
    questions: {
      en: [
        { question: "Envy that wishes the removal of blessings is:", options: ["Permissible", "Disliked only", "Sin", "Recommended"], correct_index: 2 },
        { question: "Which Surah condemns slandering and backbiting (humazah)?", options: ["Al-Hujurat", "Al-Ma'un", "Al-Humazah", "Al-Fil"], correct_index: 2 },
        { question: "What can destroy the reward of charity?", options: ["Giving secretly", "Reminding others of one's favor", "Being poor", "Smiling"], correct_index: 1 },
        { question: "Which is the last of the five daily prayers by time?", options: ["Maghrib", "Isha", "Fajr", "Dhuhr"], correct_index: 1 }
      ],
      fr: [
        { question: "L'envie qui souhaite le retrait des bienfaits est :", options: ["Permise", "Seulement déconseillée", "Un péché", "Recommandée"], correct_index: 2 },
        { question: "Quelle sourate condamne la calomnie et la médisance (humazah) ?", options: ["Al-Hujurât", "Al-Mâ'ûn", "Al-Humazah", "Al-Fîl"], correct_index: 2 },
        { question: "Qu'est-ce qui peut détruire la récompense de l'aumône ?", options: ["Donner secrètement", "Rappeler aux autres sa faveur", "Être pauvre", "Sourire"], correct_index: 1 },
        { question: "Quelle est la dernière des cinq prières quotidiennes par le temps ?", options: ["Maghrib", "'Ishâ'", "Fajr", "Dhuhr"], correct_index: 1 }
      ]
    }
  },
  {
    id: 31,
    difficulty: 'intermediate',
    questions: {
      en: [
        { question: "Which prayers are shortened in travel?", options: ["Fajr only", "Maghrib only", "The 4-Rak'ah obligatory prayers", "Witr only"], correct_index: 2 },
        { question: "Which Surah contains the long verse about debt contracts?", options: ["Al-Baqarah", "An-Nas", "Al-Ikhlas", "Al-Fil"], correct_index: 0 },
        { question: "Paying Zakah is:", options: ["Optional", "Recommended only", "Obligatory", "Forbidden"], correct_index: 2 },
        { question: "'Sunnah' most directly means:", options: ["Innovation", "Prophetic way", "Culture", "Poetry"], correct_index: 1 }
      ],
      fr: [
        { question: "Quelles prières sont raccourcies en voyage ?", options: ["Fajr seulement", "Maghrib seulement", "Les prières obligatoires de 4 rak'ât", "Witr seulement"], correct_index: 2 },
        { question: "Quelle sourate contient le long verset sur les contrats de dette ?", options: ["Al-Baqarah", "An-Nâs", "Al-Ikhlâs", "Al-Fîl"], correct_index: 0 },
        { question: "Payer la Zakât est :", options: ["Optionnel", "Seulement recommandé", "Obligatoire", "Interdit"], correct_index: 2 },
        { question: "'Sunnah' signifie le plus directement :", options: ["Innovation", "Voie prophétique", "Culture", "Poésie"], correct_index: 1 }
      ]
    }
  },
  {
    id: 32,
    difficulty: 'intermediate',
    questions: {
      en: [
        { question: "Which prayer includes a khutbah before it?", options: ["Janazah", "Jumu'ah", "Duha", "Witr"], correct_index: 1 },
        { question: "Which Surah mentions the 'Trust' (Amanah) being offered?", options: ["Al-Ahzab", "Al-Fil", "Quraysh", "Al-Masad"], correct_index: 0 },
        { question: "What can nullify the reward of fasting?", options: ["Hunger", "Showing off", "Thirst", "Time"], correct_index: 1 },
        { question: "Fulfilling promises is:", options: ["Optional", "Neutral", "Obligatory", "Disliked"], correct_index: 2 }
      ],
      fr: [
        { question: "Quelle prière inclut une khutbah avant elle ?", options: ["Janâzah", "Jumu'ah", "Duhâ", "Witr"], correct_index: 1 },
        { question: "Quelle sourate mentionne le 'Dépôt' (Amânah) offert ?", options: ["Al-Ahzâb", "Al-Fîl", "Quraysh", "Al-Masad"], correct_index: 0 },
        { question: "Qu'est-ce qui peut annuler la récompense du jeûne ?", options: ["La faim", "L'ostentation", "La soif", "Le temps"], correct_index: 1 },
        { question: "Tenir ses promesses est :", options: ["Optionnel", "Neutre", "Obligatoire", "Déconseillé"], correct_index: 2 }
      ]
    }
  },
  {
    id: 33,
    difficulty: 'intermediate',
    questions: {
      en: [
        { question: "'O you who believe' appears many times especially in:", options: ["Al-Baqarah", "Al-Ma'idah", "Both", "Neither"], correct_index: 2 },
        { question: "Lying is generally:", options: ["Permissible", "Sin", "Recommended", "Obligatory"], correct_index: 1 },
        { question: "How many Rak'ahs did the Prophet ﷺ commonly pray for night prayer?", options: ["2", "4", "8 (plus Witr)", "20"], correct_index: 2 },
        { question: "What invalidates prayer silently?", options: ["A passing thought", "Intention to end the prayer", "Blinking", "Breathing"], correct_index: 1 }
      ],
      fr: [
        { question: "'Ô vous qui croyez' apparaît souvent notamment dans :", options: ["Al-Baqarah", "Al-Mâ'idah", "Les deux", "Aucune"], correct_index: 2 },
        { question: "Mentir est généralement :", options: ["Permis", "Un péché", "Recommandé", "Obligatoire"], correct_index: 1 },
        { question: "Combien de rak'ât le Prophète ﷺ priait-il couramment pour la prière de nuit ?", options: ["2", "4", "8 (plus Witr)", "20"], correct_index: 2 },
        { question: "Qu'est-ce qui invalide la prière silencieusement ?", options: ["Une pensée passagère", "L'intention de terminer la prière", "Cligner des yeux", "Respirer"], correct_index: 1 }
      ]
    }
  },
  {
    id: 34,
    difficulty: 'intermediate',
    questions: {
      en: [
        { question: "Which Surah teaches manners and etiquette among believers?", options: ["Al-Hujurat", "Quraysh", "Al-Fil", "Al-Kawthar"], correct_index: 0 },
        { question: "Arrogance toward people is:", options: ["Permissible", "Neutral", "Sin", "Obligatory"], correct_index: 2 },
        { question: "The core of fasting is:", options: ["Eating less", "Abstaining for Allah", "Sleeping", "Traveling"], correct_index: 1 },
        { question: "What is Sujud as-Sahw for?", options: ["Decoration", "Correcting mistakes", "Showing off", "Ending Wudu"], correct_index: 1 }
      ],
      fr: [
        { question: "Quelle sourate enseigne les bonnes manières et l'étiquette entre croyants ?", options: ["Al-Hujurât", "Quraysh", "Al-Fîl", "Al-Kawthar"], correct_index: 0 },
        { question: "L'arrogance envers les gens est :", options: ["Permise", "Neutre", "Un péché", "Obligatoire"], correct_index: 2 },
        { question: "L'essence du jeûne est :", options: ["Manger moins", "S'abstenir pour Allah", "Dormir", "Voyager"], correct_index: 1 },
        { question: "À quoi sert le Sujûd as-Sahw ?", options: ["La décoration", "Corriger les erreurs", "L'ostentation", "Terminer le Wudû'"], correct_index: 1 }
      ]
    }
  },
  {
    id: 35,
    difficulty: 'intermediate',
    questions: {
      en: [
        { question: "Which Surah warns against hoarding/obsessing over wealth?", options: ["Al-Humazah", "At-Takathur", "Both", "Neither"], correct_index: 2 },
        { question: "Cheating is:", options: ["Permissible", "Neutral", "Sin", "Obligatory"], correct_index: 2 },
        { question: "Which breaks Wudu?", options: ["Passing wind", "Smiling", "Listening", "Looking"], correct_index: 0 },
        { question: "'Akhirah' means:", options: ["World", "Hereafter", "Culture", "Trade"], correct_index: 1 }
      ],
      fr: [
        { question: "Quelle sourate met en garde contre l'accumulation/obsession des richesses ?", options: ["Al-Humazah", "At-Takâthur", "Les deux", "Aucune"], correct_index: 2 },
        { question: "Tricher est :", options: ["Permis", "Neutre", "Un péché", "Obligatoire"], correct_index: 2 },
        { question: "Qu'est-ce qui rompt le Wudû' ?", options: ["Émettre des gaz", "Sourire", "Écouter", "Regarder"], correct_index: 0 },
        { question: "'Âkhirah' signifie :", options: ["Le monde", "L'au-delà", "La culture", "Le commerce"], correct_index: 1 }
      ]
    }
  },
  {
    id: 36,
    difficulty: 'intermediate',
    questions: {
      en: [
        { question: "Which Surah emphasizes sincerity in worship?", options: ["Al-Ikhlas", "Al-Fil", "Quraysh", "Al-Kawthar"], correct_index: 0 },
        { question: "Uncontrolled anger leading to harm is:", options: ["Always praised", "Neutral", "Blameworthy", "Obligatory"], correct_index: 2 },
        { question: "Which clearly invalidates prayer immediately?", options: ["Audible intentional speech", "Looking down", "Standing still", "Breathing"], correct_index: 0 },
        { question: "Good character is strongly linked to:", options: ["Nearness to the Prophet ﷺ", "Guaranteed wealth", "No reward", "Shorter days"], correct_index: 0 }
      ],
      fr: [
        { question: "Quelle sourate met l'accent sur la sincérité dans l'adoration ?", options: ["Al-Ikhlâs", "Al-Fîl", "Quraysh", "Al-Kawthar"], correct_index: 0 },
        { question: "La colère incontrôlée menant au mal est :", options: ["Toujours louée", "Neutre", "Blâmable", "Obligatoire"], correct_index: 2 },
        { question: "Qu'est-ce qui invalide clairement la prière immédiatement ?", options: ["Parole intentionnelle audible", "Regarder vers le bas", "Rester immobile", "Respirer"], correct_index: 0 },
        { question: "Le bon caractère est fortement lié à :", options: ["La proximité du Prophète ﷺ", "La richesse garantie", "Aucune récompense", "Des jours plus courts"], correct_index: 0 }
      ]
    }
  },
  {
    id: 37,
    difficulty: 'intermediate',
    questions: {
      en: [
        { question: "Which Surah includes the famous debt verse (2:282)?", options: ["Al-Baqarah", "An-Nisa", "At-Talaq", "Al-Hashr"], correct_index: 0 },
        { question: "Mockery of believers is:", options: ["Permissible", "Neutral", "Sin", "Recommended"], correct_index: 2 },
        { question: "Intention for fasting is made:", options: ["After sunrise", "Before dawn", "Only at noon", "Only after Maghrib"], correct_index: 1 },
        { question: "'Halal' means:", options: ["Clean only", "Permissible", "Charity", "Travel"], correct_index: 1 }
      ],
      fr: [
        { question: "Quelle sourate inclut le célèbre verset sur la dette (2:282) ?", options: ["Al-Baqarah", "An-Nisâ'", "At-Talâq", "Al-Hashr"], correct_index: 0 },
        { question: "Se moquer des croyants est :", options: ["Permis", "Neutre", "Un péché", "Recommandé"], correct_index: 2 },
        { question: "L'intention pour le jeûne est faite :", options: ["Après le lever du soleil", "Avant l'aube", "Seulement à midi", "Seulement après Maghrib"], correct_index: 1 },
        { question: "'Halâl' signifie :", options: ["Propre seulement", "Permis", "L'aumône", "Le voyage"], correct_index: 1 }
      ]
    }
  },
  {
    id: 38,
    difficulty: 'intermediate',
    questions: {
      en: [
        { question: "Which Surah commands lowering the gaze?", options: ["An-Nur", "Al-Fil", "Al-Ikhlas", "Quraysh"], correct_index: 0 },
        { question: "Envy wishing harm is:", options: ["Allowed", "Neutral", "Sin", "Obligatory"], correct_index: 2 },
        { question: "Which breaks prayer?", options: ["Audible laughter", "Blinking", "Breathing", "Standing"], correct_index: 0 },
        { question: "Sujud as-Sahw is:", options: ["Decoration", "Correction for mistakes", "A new prayer", "A type of Wudu"], correct_index: 1 }
      ],
      fr: [
        { question: "Quelle sourate ordonne de baisser le regard ?", options: ["An-Nûr", "Al-Fîl", "Al-Ikhlâs", "Quraysh"], correct_index: 0 },
        { question: "L'envie souhaitant du mal est :", options: ["Permise", "Neutre", "Un péché", "Obligatoire"], correct_index: 2 },
        { question: "Qu'est-ce qui rompt la prière ?", options: ["Rire audiblement", "Cligner des yeux", "Respirer", "Se tenir debout"], correct_index: 0 },
        { question: "Le Sujûd as-Sahw est :", options: ["Une décoration", "Une correction pour les erreurs", "Une nouvelle prière", "Un type de Wudû'"], correct_index: 1 }
      ]
    }
  },
  {
    id: 39,
    difficulty: 'intermediate',
    questions: {
      en: [
        { question: "Which Surah includes the du'a for parents (17:24)?", options: ["Al-Isra", "Al-Fil", "Quraysh", "Al-Kawthar"], correct_index: 0 },
        { question: "Serious disobedience to parents is:", options: ["Neutral", "Minor issue", "Major sin", "Recommended"], correct_index: 2 },
        { question: "Which invalidates a fast?", options: ["Forgetful eating", "Intentional intercourse", "Sleeping", "Bathing"], correct_index: 1 },
        { question: "'Iman' means:", options: ["Submission", "Belief/faith", "Trade", "Travel"], correct_index: 1 }
      ],
      fr: [
        { question: "Quelle sourate inclut la du'â pour les parents (17:24) ?", options: ["Al-Isrâ'", "Al-Fîl", "Quraysh", "Al-Kawthar"], correct_index: 0 },
        { question: "La désobéissance grave aux parents est :", options: ["Neutre", "Un problème mineur", "Un péché majeur", "Recommandée"], correct_index: 2 },
        { question: "Qu'est-ce qui invalide un jeûne ?", options: ["Manger par oubli", "Rapport intentionnel", "Dormir", "Se laver"], correct_index: 1 },
        { question: "'Îmân' signifie :", options: ["Soumission", "Croyance/foi", "Commerce", "Voyage"], correct_index: 1 }
      ]
    }
  },
  {
    id: 40,
    difficulty: 'intermediate',
    questions: {
      en: [
        { question: "Which Surah mentions recording of speech (50:18)?", options: ["Qaf", "Al-Fil", "Al-Ikhlas", "Quraysh"], correct_index: 0 },
        { question: "Spreading rumors and false reports is:", options: ["Permissible", "Neutral", "Sin", "Obligatory"], correct_index: 2 },
        { question: "Which can ruin reward while the act remains outwardly valid?", options: ["Showing off", "Breathing", "Blinking", "Standing"], correct_index: 0 },
        { question: "'Bid'ah' means:", options: ["Sunnah", "Innovation (in religion)", "Culture", "Travel"], correct_index: 1 }
      ],
      fr: [
        { question: "Quelle sourate mentionne l'enregistrement de la parole (50:18) ?", options: ["Qâf", "Al-Fîl", "Al-Ikhlâs", "Quraysh"], correct_index: 0 },
        { question: "Propager des rumeurs et de faux rapports est :", options: ["Permis", "Neutre", "Un péché", "Obligatoire"], correct_index: 2 },
        { question: "Qu'est-ce qui peut ruiner la récompense tandis que l'acte reste extérieurement valide ?", options: ["L'ostentation", "Respirer", "Cligner des yeux", "Se tenir debout"], correct_index: 0 },
        { question: "'Bid'ah' signifie :", options: ["Sunnah", "Innovation (dans la religion)", "Culture", "Voyage"], correct_index: 1 }
      ]
    }
  },
  // DIFFICULT (41-60)
  {
    id: 41,
    difficulty: 'difficult',
    questions: {
      en: [
        { question: "What ends tayammum (in principle)?", options: ["Finding usable water", "Time passing only", "Distance", "Wealth"], correct_index: 0 },
        { question: "Which Surah is linked to the victory and treaty themes of Hudaybiyyah?", options: ["Al-Fath", "Al-Fil", "Al-Masad", "An-Nas"], correct_index: 0 },
        { question: "Witr is best described as:", options: ["Forbidden", "A highly emphasized Sunnah", "Only cultural", "Funeral prayer"], correct_index: 1 },
        { question: "Which breaks the fast and requires major expiation (kaffarah)?", options: ["Forgetful eating", "Intentional intercourse", "Vomiting unintentionally", "Sleeping"], correct_index: 1 }
      ],
      fr: [
        { question: "Qu'est-ce qui met fin au tayammum (en principe) ?", options: ["Trouver de l'eau utilisable", "Le temps qui passe seulement", "La distance", "La richesse"], correct_index: 0 },
        { question: "Quelle sourate est liée aux thèmes de victoire et de traité de Hudaybiyyah ?", options: ["Al-Fath", "Al-Fîl", "Al-Masad", "An-Nâs"], correct_index: 0 },
        { question: "Le Witr est mieux décrit comme :", options: ["Interdit", "Une Sunnah fortement recommandée", "Seulement culturel", "Prière funéraire"], correct_index: 1 },
        { question: "Qu'est-ce qui rompt le jeûne et nécessite une expiation majeure (kaffârah) ?", options: ["Manger par oubli", "Rapport intentionnel", "Vomir involontairement", "Dormir"], correct_index: 1 }
      ]
    }
  },
  {
    id: 42,
    difficulty: 'difficult',
    questions: {
      en: [
        { question: "Which Surah contains a du'a for parents near its end?", options: ["Al-Isra", "Luqman", "Al-Ahqaf", "All"], correct_index: 0 },
        { question: "Which is a condition for prayer?", options: ["Taharah (purification)", "Taslim", "Sujud", "Tashahhud"], correct_index: 0 },
        { question: "Which act clearly breaks prayer?", options: ["Minor movement", "Audible laughter", "Blinking", "Standing"], correct_index: 1 },
        { question: "Who compiled Sahih Muslim?", options: ["Al-Bukhari", "An-Nawawi", "Muslim", "Ibn Kathir"], correct_index: 2 }
      ],
      fr: [
        { question: "Quelle sourate contient une du'â pour les parents vers la fin ?", options: ["Al-Isrâ'", "Luqmân", "Al-Ahqâf", "Toutes"], correct_index: 0 },
        { question: "Qu'est-ce qui est une condition pour la prière ?", options: ["Tahârah (purification)", "Taslîm", "Sujûd", "Tashahhud"], correct_index: 0 },
        { question: "Quel acte rompt clairement la prière ?", options: ["Petit mouvement", "Rire audiblement", "Cligner des yeux", "Se tenir debout"], correct_index: 1 },
        { question: "Qui a compilé Sahîh Muslim ?", options: ["Al-Bukhârî", "An-Nawawî", "Muslim", "Ibn Kathîr"], correct_index: 2 }
      ]
    }
  },
  {
    id: 43,
    difficulty: 'difficult',
    questions: {
      en: [
        { question: "Delaying prayer intentionally past its time is:", options: ["Allowed", "Neutral", "Sinful", "Recommended"], correct_index: 2 },
        { question: "Which Surah begins with disjointed letters?", options: ["Ya-Sin", "Al-Ikhlas", "An-Nas", "Al-Fil"], correct_index: 0 },
        { question: "Zakah is not due if wealth is:", options: ["Below nisab", "Increasing", "In trade", "In gold"], correct_index: 0 },
        { question: "Ihsan means:", options: ["Knowledge", "Excellence in worship (as if you see Allah)", "Trade", "Travel"], correct_index: 1 }
      ],
      fr: [
        { question: "Retarder la prière intentionnellement après son temps est :", options: ["Permis", "Neutre", "Un péché", "Recommandé"], correct_index: 2 },
        { question: "Quelle sourate commence par des lettres détachées ?", options: ["Yâ-Sîn", "Al-Ikhlâs", "An-Nâs", "Al-Fîl"], correct_index: 0 },
        { question: "La Zakât n'est pas due si la richesse est :", options: ["En dessous du nisâb", "En augmentation", "Dans le commerce", "En or"], correct_index: 0 },
        { question: "Ihsân signifie :", options: ["La connaissance", "L'excellence dans l'adoration (comme si tu voyais Allah)", "Le commerce", "Le voyage"], correct_index: 1 }
      ]
    }
  },
  {
    id: 44,
    difficulty: 'difficult',
    questions: {
      en: [
        { question: "Which Surah repeatedly refutes blind following of ancestors?", options: ["Al-An'am", "Al-Fil", "An-Nas", "Al-Ikhlas"], correct_index: 0 },
        { question: "Which prayer is generally forbidden at sunrise (voluntary)?", options: ["Fard", "Nafl", "Janazah", "Eid"], correct_index: 1 },
        { question: "Breaking an oath requires:", options: ["Nothing", "Expiation", "A new name", "Travel"], correct_index: 1 },
        { question: "What is essential in fasting?", options: ["Thirst", "Intention", "Walking", "Talking"], correct_index: 1 }
      ],
      fr: [
        { question: "Quelle sourate réfute à plusieurs reprises le suivi aveugle des ancêtres ?", options: ["Al-An'âm", "Al-Fîl", "An-Nâs", "Al-Ikhlâs"], correct_index: 0 },
        { question: "Quelle prière est généralement interdite au lever du soleil (surérogatoire) ?", options: ["Fard", "Nâfilah", "Janâzah", "L'Aïd"], correct_index: 1 },
        { question: "Rompre un serment nécessite :", options: ["Rien", "Une expiation", "Un nouveau nom", "Un voyage"], correct_index: 1 },
        { question: "Qu'est-ce qui est essentiel dans le jeûne ?", options: ["La soif", "L'intention", "Marcher", "Parler"], correct_index: 1 }
      ]
    }
  },
  {
    id: 45,
    difficulty: 'difficult',
    questions: {
      en: [
        { question: "Which Surah is explicitly about the 'Striking Calamity' and scales?", options: ["Al-Qari'ah", "Al-Zalzalah", "Al-Hadid", "Quraysh"], correct_index: 0 },
        { question: "What nullifies intention?", options: ["Sleep", "Changing it away from the act", "Walking", "Time"], correct_index: 1 },
        { question: "Lying (as a general habit) is:", options: ["Permissible", "Neutral", "Sin", "Obligatory"], correct_index: 2 },
        { question: "Which book is arranged by chapters of manners and virtues?", options: ["Sahih Muslim", "Sahih al-Bukhari", "Riyad as-Salihin", "Tafsir Ibn Kathir"], correct_index: 2 }
      ],
      fr: [
        { question: "Quelle sourate parle explicitement du 'Fracas' et des balances ?", options: ["Al-Qâri'ah", "Az-Zalzalah", "Al-Hadîd", "Quraysh"], correct_index: 0 },
        { question: "Qu'est-ce qui annule l'intention ?", options: ["Le sommeil", "La changer loin de l'acte", "Marcher", "Le temps"], correct_index: 1 },
        { question: "Mentir (comme habitude générale) est :", options: ["Permis", "Neutre", "Un péché", "Obligatoire"], correct_index: 2 },
        { question: "Quel livre est organisé par chapitres de bonnes manières et vertus ?", options: ["Sahîh Muslim", "Sahîh al-Bukhârî", "Riyâd as-Sâlihîn", "Tafsîr Ibn Kathîr"], correct_index: 2 }
      ]
    }
  },
  {
    id: 46,
    difficulty: 'difficult',
    questions: {
      en: [
        { question: "What invalidates intention during prayer?", options: ["A passing thought", "Deciding to stop the prayer", "Forgetfulness", "Standing"], correct_index: 1 },
        { question: "Which Surah mentions testimony of body parts against a person?", options: ["Fussilat", "Quraysh", "Al-Fil", "Al-Ikhlas"], correct_index: 0 },
        { question: "What nullifies an expiation fast?", options: ["Forgetfulness", "Intentional break", "Sleeping", "Travel"], correct_index: 1 },
        { question: "Showing off worship primarily:", options: ["Increases reward", "Nullifies reward", "Makes it obligatory", "Makes it halal"], correct_index: 1 }
      ],
      fr: [
        { question: "Qu'est-ce qui invalide l'intention pendant la prière ?", options: ["Une pensée passagère", "Décider d'arrêter la prière", "L'oubli", "Se tenir debout"], correct_index: 1 },
        { question: "Quelle sourate mentionne le témoignage des membres du corps contre une personne ?", options: ["Fussilat", "Quraysh", "Al-Fîl", "Al-Ikhlâs"], correct_index: 0 },
        { question: "Qu'est-ce qui annule un jeûne d'expiation ?", options: ["L'oubli", "Rupture intentionnelle", "Dormir", "Voyager"], correct_index: 1 },
        { question: "L'ostentation dans l'adoration principalement :", options: ["Augmente la récompense", "Annule la récompense", "La rend obligatoire", "La rend halâl"], correct_index: 1 }
      ]
    }
  },
  {
    id: 47,
    difficulty: 'difficult',
    questions: {
      en: [
        { question: "Which Surah contains detailed guidance on testimony and debt documentation?", options: ["Al-Baqarah", "Al-Fil", "An-Nas", "Al-Ikhlas"], correct_index: 0 },
        { question: "What breaks fasting unanimously?", options: ["Intentional eating/drinking", "Smelling food", "Forgetting", "Thinking"], correct_index: 0 },
        { question: "شرط vs ركن means:", options: ["Same", "Condition vs pillar", "Sunnah vs wajib", "Reward vs punishment"], correct_index: 1 },
        { question: "After Taslim, the prayer is:", options: ["Still ongoing", "Ended", "Invalid", "Forbidden"], correct_index: 1 }
      ],
      fr: [
        { question: "Quelle sourate contient des directives détaillées sur le témoignage et la documentation des dettes ?", options: ["Al-Baqarah", "Al-Fîl", "An-Nâs", "Al-Ikhlâs"], correct_index: 0 },
        { question: "Qu'est-ce qui rompt le jeûne unanimement ?", options: ["Manger/boire intentionnellement", "Sentir la nourriture", "Oublier", "Penser"], correct_index: 0 },
        { question: "شرط vs ركن signifie :", options: ["Pareil", "Condition vs pilier", "Sunnah vs wâjib", "Récompense vs punition"], correct_index: 1 },
        { question: "Après le Taslîm, la prière est :", options: ["Toujours en cours", "Terminée", "Invalide", "Interdite"], correct_index: 1 }
      ]
    }
  },
  {
    id: 48,
    difficulty: 'difficult',
    questions: {
      en: [
        { question: "Which Surah warns clearly against arrogance?", options: ["Luqman", "Al-Isra", "Both", "Neither"], correct_index: 2 },
        { question: "What can ruin the reward of Zakah/charity?", options: ["Showing off", "Being tired", "Traveling", "Eating"], correct_index: 0 },
        { question: "Suicide is:", options: ["Permissible", "Neutral", "Major sin", "Recommended"], correct_index: 2 },
        { question: "What is the final act that ends prayer?", options: ["Sujud", "Sitting", "Taslim", "Qiyam"], correct_index: 2 }
      ],
      fr: [
        { question: "Quelle sourate met clairement en garde contre l'arrogance ?", options: ["Luqmân", "Al-Isrâ'", "Les deux", "Aucune"], correct_index: 2 },
        { question: "Qu'est-ce qui peut ruiner la récompense de la Zakât/aumône ?", options: ["L'ostentation", "Être fatigué", "Voyager", "Manger"], correct_index: 0 },
        { question: "Le suicide est :", options: ["Permis", "Neutre", "Un péché majeur", "Recommandé"], correct_index: 2 },
        { question: "Quel est l'acte final qui termine la prière ?", options: ["Sujûd", "La position assise", "Taslîm", "Qiyâm"], correct_index: 2 }
      ]
    }
  },
  {
    id: 49,
    difficulty: 'difficult',
    questions: {
      en: [
        { question: "Which Surah mentions the weighing of deeds (scales) explicitly?", options: ["Al-Qari'ah", "Al-Zalzalah", "Both", "Neither"], correct_index: 0 },
        { question: "What ends tayammum once the excuse is removed?", options: ["Water becomes available", "Standing", "Time only", "Distance"], correct_index: 0 },
        { question: "Arrogance is generally:", options: ["Minor issue", "Sin", "Rewarded", "Neutral"], correct_index: 1 },
        { question: "Taqwa best means:", options: ["Fear only", "God-consciousness and obedience", "Wealth", "Travel"], correct_index: 1 }
      ],
      fr: [
        { question: "Quelle sourate mentionne explicitement la pesée des actes (balances) ?", options: ["Al-Qâri'ah", "Az-Zalzalah", "Les deux", "Aucune"], correct_index: 0 },
        { question: "Qu'est-ce qui met fin au tayammum une fois l'excuse levée ?", options: ["L'eau devient disponible", "Se tenir debout", "Le temps seulement", "La distance"], correct_index: 0 },
        { question: "L'arrogance est généralement :", options: ["Un problème mineur", "Un péché", "Récompensée", "Neutre"], correct_index: 1 },
        { question: "Taqwâ signifie le mieux :", options: ["La peur seulement", "La conscience de Dieu et l'obéissance", "La richesse", "Le voyage"], correct_index: 1 }
      ]
    }
  },
  {
    id: 50,
    difficulty: 'difficult',
    questions: {
      en: [
        { question: "Which Surah includes 'Do not despair of Allah's mercy' (39:53)?", options: ["Az-Zumar", "Ad-Duha", "Ash-Sharh", "Al-Fil"], correct_index: 0 },
        { question: "What breaks prayer agreement-wise?", options: ["Intentional speech", "Looking", "Breathing", "Standing"], correct_index: 0 },
        { question: "What nullifies fasting intention?", options: ["Sleep", "Reversing intention (deciding not to fast)", "Traveling", "Time"], correct_index: 1 },
        { question: "Oppression (zulm) is:", options: ["Disliked only", "Sin", "Rewarded", "Neutral"], correct_index: 1 }
      ],
      fr: [
        { question: "Quelle sourate inclut 'Ne désespérez pas de la miséricorde d'Allah' (39:53) ?", options: ["Az-Zumar", "Ad-Duhâ", "Ash-Sharh", "Al-Fîl"], correct_index: 0 },
        { question: "Qu'est-ce qui rompt la prière selon l'accord ?", options: ["Parole intentionnelle", "Regarder", "Respirer", "Se tenir debout"], correct_index: 0 },
        { question: "Qu'est-ce qui annule l'intention du jeûne ?", options: ["Le sommeil", "Renverser l'intention (décider de ne pas jeûner)", "Voyager", "Le temps"], correct_index: 1 },
        { question: "L'oppression (zulm) est :", options: ["Seulement déconseillée", "Un péché", "Récompensée", "Neutre"], correct_index: 1 }
      ]
    }
  },
  {
    id: 51,
    difficulty: 'difficult',
    questions: {
      en: [
        { question: "Which Surah mentions sealing of hearts (2:7)?", options: ["Al-Baqarah", "Al-Fil", "An-Nas", "Al-Ikhlas"], correct_index: 0 },
        { question: "What can corrupt the reward of seeking knowledge?", options: ["Showing off", "Walking", "Eating", "Sleeping"], correct_index: 0 },
        { question: "Despairing of Allah's mercy is:", options: ["Recommended", "Neutral", "Sin", "Obligatory"], correct_index: 2 },
        { question: "Ikhlas means:", options: ["Patience", "Sincerity", "Travel", "Trade"], correct_index: 1 }
      ],
      fr: [
        { question: "Quelle sourate mentionne le scellement des cœurs (2:7) ?", options: ["Al-Baqarah", "Al-Fîl", "An-Nâs", "Al-Ikhlâs"], correct_index: 0 },
        { question: "Qu'est-ce qui peut corrompre la récompense de la recherche du savoir ?", options: ["L'ostentation", "Marcher", "Manger", "Dormir"], correct_index: 0 },
        { question: "Désespérer de la miséricorde d'Allah est :", options: ["Recommandé", "Neutre", "Un péché", "Obligatoire"], correct_index: 2 },
        { question: "Ikhlâs signifie :", options: ["La patience", "La sincérité", "Le voyage", "Le commerce"], correct_index: 1 }
      ]
    }
  },
  {
    id: 52,
    difficulty: 'difficult',
    questions: {
      en: [
        { question: "Which Surah prominently mentions regret and resurrection?", options: ["Al-Qiyamah", "Al-Fil", "Quraysh", "Al-Ikhlas"], correct_index: 0 },
        { question: "What invalidates true repentance?", options: ["Regret", "Persisting in the sin without stopping", "Seeking forgiveness", "Returning rights"], correct_index: 1 },
        { question: "Hypocrisy (nifaq) is:", options: ["Neutral", "Praised", "Dangerous sin", "Sunnah"], correct_index: 2 },
        { question: "Nifaq means:", options: ["Disbelief", "Hypocrisy", "Patience", "Courage"], correct_index: 1 }
      ],
      fr: [
        { question: "Quelle sourate mentionne de façon importante le regret et la résurrection ?", options: ["Al-Qiyâmah", "Al-Fîl", "Quraysh", "Al-Ikhlâs"], correct_index: 0 },
        { question: "Qu'est-ce qui invalide le vrai repentir ?", options: ["Le regret", "Persister dans le péché sans s'arrêter", "Demander pardon", "Rendre les droits"], correct_index: 1 },
        { question: "L'hypocrisie (nifâq) est :", options: ["Neutre", "Louée", "Un péché dangereux", "Sunnah"], correct_index: 2 },
        { question: "Nifâq signifie :", options: ["Mécréance", "Hypocrisie", "Patience", "Courage"], correct_index: 1 }
      ]
    }
  },
  {
    id: 53,
    difficulty: 'difficult',
    questions: {
      en: [
        { question: "Which Surah mentions records of deeds and 'Illiyyun/Sijjin?", options: ["Al-Mutaffifin", "Al-Fil", "Quraysh", "Al-Ikhlas"], correct_index: 0 },
        { question: "What nullifies sincerity entirely?", options: ["Showing off (riya')", "Hunger", "Sleep", "Travel"], correct_index: 0 },
        { question: "Injustice is:", options: ["Neutral", "Praised", "Sin", "Obligatory"], correct_index: 2 },
        { question: "Zulm means:", options: ["Ignorance", "Oppression/wrongdoing", "Travel", "Charity"], correct_index: 1 }
      ],
      fr: [
        { question: "Quelle sourate mentionne les registres des actes et 'Illiyyûn/Sijjîn ?", options: ["Al-Mutaffifîn", "Al-Fîl", "Quraysh", "Al-Ikhlâs"], correct_index: 0 },
        { question: "Qu'est-ce qui annule entièrement la sincérité ?", options: ["L'ostentation (riyâ')", "La faim", "Le sommeil", "Le voyage"], correct_index: 0 },
        { question: "L'injustice est :", options: ["Neutre", "Louée", "Un péché", "Obligatoire"], correct_index: 2 },
        { question: "Zulm signifie :", options: ["L'ignorance", "L'oppression/l'injustice", "Le voyage", "L'aumône"], correct_index: 1 }
      ]
    }
  },
  {
    id: 54,
    difficulty: 'difficult',
    questions: {
      en: [
        { question: "Which Surah gives strong warnings about Hell and its keepers?", options: ["Al-Mulk", "Al-Fil", "Quraysh", "Al-Ikhlas"], correct_index: 0 },
        { question: "What invalidates intention in worship?", options: ["Sleeping", "Changing the aim away from Allah", "Being tired", "Being poor"], correct_index: 1 },
        { question: "Arrogance before Allah is:", options: ["Praised", "Neutral", "Sin", "Obligatory"], correct_index: 2 },
        { question: "Khushu' means:", options: ["Fear only", "Humility and attentiveness in worship", "Wealth", "Travel"], correct_index: 1 }
      ],
      fr: [
        { question: "Quelle sourate donne de forts avertissements sur l'Enfer et ses gardiens ?", options: ["Al-Mulk", "Al-Fîl", "Quraysh", "Al-Ikhlâs"], correct_index: 0 },
        { question: "Qu'est-ce qui invalide l'intention dans l'adoration ?", options: ["Dormir", "Changer l'objectif loin d'Allah", "Être fatigué", "Être pauvre"], correct_index: 1 },
        { question: "L'arrogance devant Allah est :", options: ["Louée", "Neutre", "Un péché", "Obligatoire"], correct_index: 2 },
        { question: "Khushû' signifie :", options: ["La peur seulement", "L'humilité et l'attention dans l'adoration", "La richesse", "Le voyage"], correct_index: 1 }
      ]
    }
  },
  {
    id: 55,
    difficulty: 'difficult',
    questions: {
      en: [
        { question: "Which Surah repeatedly mentions blessings and Paradise scenes?", options: ["Ar-Rahman", "Al-Fil", "An-Nas", "Al-Ikhlas"], correct_index: 0 },
        { question: "What can nullify charity's reward?", options: ["Reminding others of one's favor", "Smiling", "Traveling", "Sleeping"], correct_index: 0 },
        { question: "Oppression against oneself (sinning) is:", options: ["Neutral", "Sin", "Obligatory", "Praised"], correct_index: 1 },
        { question: "Fisq means:", options: ["Disbelief", "Open sinfulness", "Patience", "Courage"], correct_index: 1 }
      ],
      fr: [
        { question: "Quelle sourate mentionne à plusieurs reprises les bienfaits et les scènes du Paradis ?", options: ["Ar-Rahmân", "Al-Fîl", "An-Nâs", "Al-Ikhlâs"], correct_index: 0 },
        { question: "Qu'est-ce qui peut annuler la récompense de l'aumône ?", options: ["Rappeler aux autres sa faveur", "Sourire", "Voyager", "Dormir"], correct_index: 0 },
        { question: "L'oppression contre soi-même (pécher) est :", options: ["Neutre", "Un péché", "Obligatoire", "Louée"], correct_index: 1 },
        { question: "Fisq signifie :", options: ["Mécréance", "Péché ouvert", "Patience", "Courage"], correct_index: 1 }
      ]
    }
  },
  {
    id: 56,
    difficulty: 'difficult',
    questions: {
      en: [
        { question: "Which Surah mentions the wrongdoer biting his hands in regret?", options: ["Al-Furqan", "Al-Fil", "Quraysh", "Al-Ikhlas"], correct_index: 0 },
        { question: "What invalidates repentance conditions?", options: ["Regret", "Persisting in the sin", "Stopping the sin", "Seeking forgiveness"], correct_index: 1 },
        { question: "Despairing statements are:", options: ["Praised", "Neutral", "Sin", "Obligatory"], correct_index: 2 },
        { question: "Tawbah means:", options: ["Mercy", "Repentance", "Travel", "Trade"], correct_index: 1 }
      ],
      fr: [
        { question: "Quelle sourate mentionne l'injuste se mordant les mains de regret ?", options: ["Al-Furqân", "Al-Fîl", "Quraysh", "Al-Ikhlâs"], correct_index: 0 },
        { question: "Qu'est-ce qui invalide les conditions du repentir ?", options: ["Le regret", "Persister dans le péché", "Arrêter le péché", "Demander pardon"], correct_index: 1 },
        { question: "Les déclarations de désespoir sont :", options: ["Louées", "Neutres", "Un péché", "Obligatoires"], correct_index: 2 },
        { question: "Tawbah signifie :", options: ["Miséricorde", "Repentir", "Voyage", "Commerce"], correct_index: 1 }
      ]
    }
  },
  {
    id: 57,
    difficulty: 'difficult',
    questions: {
      en: [
        { question: "Which Surah mentions people begging to return to worldly life (23:99-100)?", options: ["Al-Mu'minun", "Al-Fil", "Quraysh", "Al-Ikhlas"], correct_index: 0 },
        { question: "What ruins worship based only on fear?", options: ["Hope in Allah being absent (despair)", "Balance", "Knowledge", "Patience"], correct_index: 0 },
        { question: "Shirk is:", options: ["Minor issue", "Neutral", "Greatest sin", "Recommended"], correct_index: 2 },
        { question: "Shirk means:", options: ["Hypocrisy", "Associating partners with Allah", "Patience", "Courage"], correct_index: 1 }
      ],
      fr: [
        { question: "Quelle sourate mentionne des gens suppliant de retourner à la vie terrestre (23:99-100) ?", options: ["Al-Mu'minûn", "Al-Fîl", "Quraysh", "Al-Ikhlâs"], correct_index: 0 },
        { question: "Qu'est-ce qui ruine l'adoration basée uniquement sur la peur ?", options: ["L'espoir en Allah absent (désespoir)", "L'équilibre", "La connaissance", "La patience"], correct_index: 0 },
        { question: "Le shirk est :", options: ["Un problème mineur", "Neutre", "Le plus grand péché", "Recommandé"], correct_index: 2 },
        { question: "Shirk signifie :", options: ["Hypocrisie", "Associer des partenaires à Allah", "Patience", "Courage"], correct_index: 1 }
      ]
    }
  },
  {
    id: 58,
    difficulty: 'difficult',
    questions: {
      en: [
        { question: "Which Surah mentions being questioned about blessings?", options: ["At-Takathur", "Al-Fil", "Quraysh", "Al-Ikhlas"], correct_index: 0 },
        { question: "What invalidates worship completely?", options: ["Forgetfulness", "Shirk", "Hunger", "Sleep"], correct_index: 1 },
        { question: "Ingratitude (kufr an-ni'mah) is:", options: ["Praised", "Neutral", "Sin", "Obligatory"], correct_index: 2 },
        { question: "Kufr means:", options: ["Patience", "Disbelief", "Charity", "Travel"], correct_index: 1 }
      ],
      fr: [
        { question: "Quelle sourate mentionne le fait d'être interrogé sur les bienfaits ?", options: ["At-Takâthur", "Al-Fîl", "Quraysh", "Al-Ikhlâs"], correct_index: 0 },
        { question: "Qu'est-ce qui invalide complètement l'adoration ?", options: ["L'oubli", "Le shirk", "La faim", "Le sommeil"], correct_index: 1 },
        { question: "L'ingratitude (kufr an-ni'mah) est :", options: ["Louée", "Neutre", "Un péché", "Obligatoire"], correct_index: 2 },
        { question: "Kufr signifie :", options: ["Patience", "Mécréance", "Aumône", "Voyage"], correct_index: 1 }
      ]
    }
  },
  {
    id: 59,
    difficulty: 'difficult',
    questions: {
      en: [
        { question: "Which Surah contains the famous 'Light Verse' (24:35)?", options: ["An-Nur", "Al-Fil", "Quraysh", "Al-Ikhlas"], correct_index: 0 },
        { question: "What harms tawakkul (true reliance)?", options: ["Planning", "Depending only on means and forgetting Allah", "Working", "Seeking halal income"], correct_index: 1 },
        { question: "Arrogance in the heart is:", options: ["Neutral", "Sin", "Rewarded", "Obligatory"], correct_index: 1 },
        { question: "Tawakkul means:", options: ["Fear", "Trusting Allah while taking lawful means", "Laziness", "Ignorance"], correct_index: 1 }
      ],
      fr: [
        { question: "Quelle sourate contient le célèbre 'Verset de la Lumière' (24:35) ?", options: ["An-Nûr", "Al-Fîl", "Quraysh", "Al-Ikhlâs"], correct_index: 0 },
        { question: "Qu'est-ce qui nuit au tawakkul (vraie confiance) ?", options: ["Planifier", "Dépendre uniquement des moyens et oublier Allah", "Travailler", "Chercher un revenu halâl"], correct_index: 1 },
        { question: "L'arrogance dans le cœur est :", options: ["Neutre", "Un péché", "Récompensée", "Obligatoire"], correct_index: 1 },
        { question: "Tawakkul signifie :", options: ["La peur", "Faire confiance à Allah tout en prenant les moyens licites", "La paresse", "L'ignorance"], correct_index: 1 }
      ]
    }
  },
  {
    id: 60,
    difficulty: 'difficult',
    questions: {
      en: [
        { question: "Which Surah(s) end with seeking refuge in Allah?", options: ["Al-Falaq", "An-Nas", "Both", "Al-Ikhlas"], correct_index: 2 },
        { question: "What nullifies deeds if one dies upon it?", options: ["Forgetfulness", "Shirk", "Poverty", "Travel"], correct_index: 1 },
        { question: "Dying upon shirk (without repentance) results in:", options: ["Guaranteed forgiveness", "Paradise immediately", "Not being forgiven", "Neutral outcome"], correct_index: 2 },
        { question: "Rahmah means:", options: ["Mercy", "Power", "Wealth", "Travel"], correct_index: 0 }
      ],
      fr: [
        { question: "Quelle(s) sourate(s) se terminent par la recherche de refuge auprès d'Allah ?", options: ["Al-Falaq", "An-Nâs", "Les deux", "Al-Ikhlâs"], correct_index: 2 },
        { question: "Qu'est-ce qui annule les actes si on meurt dessus ?", options: ["L'oubli", "Le shirk", "La pauvreté", "Le voyage"], correct_index: 1 },
        { question: "Mourir sur le shirk (sans repentir) résulte en :", options: ["Pardon garanti", "Paradis immédiatement", "Ne pas être pardonné", "Résultat neutre"], correct_index: 2 },
        { question: "Rahmah signifie :", options: ["Miséricorde", "Pouvoir", "Richesse", "Voyage"], correct_index: 0 }
      ]
    }
  }
];

// Get the total number of quizzes
export const TOTAL_QUIZZES = QUIZZES.length;

// Get a quiz by ID (1-indexed)
export function getQuizById(id: number): Quiz | undefined {
  return QUIZZES.find(q => q.id === id);
}

// Get quiz for a specific day (cycles through all quizzes)
export function getQuizForDay(dayNumber: number): Quiz {
  const index = ((dayNumber - 1) % TOTAL_QUIZZES);
  return QUIZZES[index];
}

// Get the next unplayed quiz ID for a user
export function getNextQuizId(completedQuizIds: number[]): number {
  // Find the first quiz that hasn't been completed
  for (const quiz of QUIZZES) {
    if (!completedQuizIds.includes(quiz.id)) {
      return quiz.id;
    }
  }
  // If all completed, start over from the first one
  return 1;
}
