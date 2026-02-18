/**
 * Ramadan Story Quizzes — 3 questions per story in EN & FR
 * All questions sourced from the story content which references
 * Quran, Sahih al-Bukhari, Sahih Muslim, Ibn Kathir, and other authentic sources.
 */

export interface StoryQuizQuestion {
  en: string;
  fr: string;
  options: { en: string; fr: string }[];
  correctIndex: number;
}

export const STORY_QUIZZES: Record<string, StoryQuizQuestion[]> = {

  // ═══════════════════════════════════════════
  //  HISTORY (10)
  // ═══════════════════════════════════════════

  'revelation-quran': [
    {
      en: 'What was the first word revealed to the Prophet ﷺ?',
      fr: 'Quel fut le premier mot révélé au Prophète ﷺ ?',
      options: [
        { en: 'Pray', fr: 'Prie' },
        { en: 'Read', fr: 'Lis' },
        { en: 'Give', fr: 'Donne' },
        { en: 'Fast', fr: 'Jeûne' },
      ],
      correctIndex: 1,
    },
    {
      en: 'In which cave did the Prophet ﷺ receive the first revelation?',
      fr: 'Dans quelle grotte le Prophète ﷺ a-t-il reçu la première révélation ?',
      options: [
        { en: 'Cave of Thawr', fr: 'Grotte de Thawr' },
        { en: 'Cave of Hira', fr: 'Grotte de Hira' },
        { en: 'Cave of Uhud', fr: 'Grotte de Uhud' },
        { en: 'Cave of Sawr', fr: 'Grotte de Sawr' },
      ],
      correctIndex: 1,
    },
    {
      en: 'Laylatul Qadr is described as better than how many months?',
      fr: 'Laylatul Qadr est décrite comme meilleure que combien de mois ?',
      options: [
        { en: '100 months', fr: '100 mois' },
        { en: '500 months', fr: '500 mois' },
        { en: '1000 months', fr: '1000 mois' },
        { en: '10 months', fr: '10 mois' },
      ],
      correctIndex: 2,
    },
  ],

  'badr': [
    {
      en: 'In which year after Hijrah did the Battle of Badr take place?',
      fr: 'En quelle année après l\'Hégire la bataille de Badr a-t-elle eu lieu ?',
      options: [
        { en: '1st year', fr: '1ère année' },
        { en: '2nd year', fr: '2ème année' },
        { en: '3rd year', fr: '3ème année' },
        { en: '5th year', fr: '5ème année' },
      ],
      correctIndex: 1,
    },
    {
      en: 'How many Muslims fought at Badr?',
      fr: 'Combien de musulmans ont combattu à Badr ?',
      options: [
        { en: 'About 313', fr: 'Environ 313' },
        { en: 'About 1000', fr: 'Environ 1000' },
        { en: 'About 500', fr: 'Environ 500' },
        { en: 'About 100', fr: 'Environ 100' },
      ],
      correctIndex: 0,
    },
    {
      en: 'What did the Prophet ﷺ do before the Battle of Badr?',
      fr: 'Que fit le Prophète ﷺ avant la bataille de Badr ?',
      options: [
        { en: 'Fasted for three days', fr: 'Jeûna trois jours' },
        { en: 'Made intense dua to Allah', fr: 'Fit des invocations intenses à Allah' },
        { en: 'Sent a peace treaty', fr: 'Envoya un traité de paix' },
        { en: 'Retreated to Medina', fr: 'Se retira à Médine' },
      ],
      correctIndex: 1,
    },
  ],

  'fath-makkah': [
    {
      en: 'In which year after Hijrah was the conquest of Makkah?',
      fr: 'En quelle année après l\'Hégire eut lieu la conquête de La Mecque ?',
      options: [
        { en: '6 AH', fr: '6 AH' },
        { en: '8 AH', fr: '8 AH' },
        { en: '10 AH', fr: '10 AH' },
        { en: '4 AH', fr: '4 AH' },
      ],
      correctIndex: 1,
    },
    {
      en: 'How did the Prophet ﷺ enter Makkah?',
      fr: 'Comment le Prophète ﷺ entra-t-il à La Mecque ?',
      options: [
        { en: 'With anger and vengeance', fr: 'Avec colère et vengeance' },
        { en: 'In humility with his head bowed', fr: 'Avec humilité, la tête baissée' },
        { en: 'On a horse leading the charge', fr: 'Sur un cheval menant la charge' },
        { en: 'Secretly at night', fr: 'Secrètement la nuit' },
      ],
      correctIndex: 1,
    },
    {
      en: 'What did the Prophet ﷺ say to the Quraysh after the conquest?',
      fr: 'Que dit le Prophète ﷺ aux Quraysh après la conquête ?',
      options: [
        { en: '"You are all prisoners"', fr: '"Vous êtes tous prisonniers"' },
        { en: '"Go, you are free"', fr: '"Allez, vous êtes libres"' },
        { en: '"Pay tribute"', fr: '"Payez un tribut"' },
        { en: '"Leave Makkah"', fr: '"Quittez La Mecque"' },
      ],
      correctIndex: 1,
    },
  ],

  'laylatul-qadr': [
    {
      en: 'In which nights should we seek Laylatul Qadr?',
      fr: 'Durant quelles nuits doit-on chercher Laylatul Qadr ?',
      options: [
        { en: 'First 10 nights', fr: 'Les 10 premières nuits' },
        { en: 'Middle 10 nights', fr: 'Les 10 nuits du milieu' },
        { en: 'Odd nights of the last 10', fr: 'Les nuits impaires des 10 dernières' },
        { en: 'Every night', fr: 'Chaque nuit' },
      ],
      correctIndex: 2,
    },
    {
      en: 'Which surah specifically describes Laylatul Qadr?',
      fr: 'Quelle sourate décrit spécifiquement Laylatul Qadr ?',
      options: [
        { en: 'Surah Al-Baqarah', fr: 'Sourate Al-Baqarah' },
        { en: 'Surah Al-Qadr', fr: 'Sourate Al-Qadr' },
        { en: 'Surah Al-Fatiha', fr: 'Sourate Al-Fatiha' },
        { en: 'Surah Yaseen', fr: 'Sourate Yaseen' },
      ],
      correctIndex: 1,
    },
    {
      en: 'What dua did Aisha (RA) ask the Prophet ﷺ to teach her for Laylatul Qadr?',
      fr: 'Quelle invocation Aisha (RA) a-t-elle demandé au Prophète ﷺ de lui enseigner ?',
      options: [
        { en: '"O Allah, grant me Paradise"', fr: '"Ô Allah, accorde-moi le Paradis"' },
        { en: '"O Allah, You are the Pardoner, You love to pardon, so pardon me"', fr: '"Ô Allah, Tu es le Pardonneur, Tu aimes pardonner, alors pardonne-moi"' },
        { en: '"O Allah, protect me from the Fire"', fr: '"Ô Allah, protège-moi du Feu"' },
        { en: '"O Allah, increase my knowledge"', fr: '"Ô Allah, augmente ma science"' },
      ],
      correctIndex: 1,
    },
  ],

  'isra-miraj': [
    {
      en: 'From which mosque did the Night Journey begin?',
      fr: 'De quelle mosquée le Voyage Nocturne a-t-il commencé ?',
      options: [
        { en: 'Masjid an-Nabawi', fr: 'Masjid an-Nabawi' },
        { en: 'Masjid al-Haram', fr: 'Masjid al-Haram' },
        { en: 'Masjid al-Aqsa', fr: 'Masjid al-Aqsa' },
        { en: 'Masjid Quba', fr: 'Masjid Quba' },
      ],
      correctIndex: 1,
    },
    {
      en: 'What obligation was given to the Ummah during the Mi\'raj?',
      fr: 'Quelle obligation fut donnée à la Oumma durant le Mi\'raj ?',
      options: [
        { en: 'Fasting in Ramadan', fr: 'Le jeûne du Ramadan' },
        { en: 'The five daily prayers', fr: 'Les cinq prières quotidiennes' },
        { en: 'Hajj pilgrimage', fr: 'Le pèlerinage du Hajj' },
        { en: 'Zakat', fr: 'La Zakat' },
      ],
      correctIndex: 1,
    },
    {
      en: 'The prayers were originally set at how many before being reduced to five?',
      fr: 'Les prières étaient initialement fixées à combien avant d\'être réduites à cinq ?',
      options: [
        { en: '10', fr: '10' },
        { en: '25', fr: '25' },
        { en: '50', fr: '50' },
        { en: '100', fr: '100' },
      ],
      correctIndex: 2,
    },
  ],

  'first-adhan': [
    {
      en: 'Who was the first muezzin in Islam?',
      fr: 'Qui fut le premier muezzin en Islam ?',
      options: [
        { en: 'Umar ibn al-Khattab', fr: 'Umar ibn al-Khattab' },
        { en: 'Bilal ibn Rabah', fr: 'Bilal ibn Rabah' },
        { en: 'Abu Bakr', fr: 'Abu Bakr' },
        { en: 'Ali ibn Abi Talib', fr: 'Ali ibn Abi Talib' },
      ],
      correctIndex: 1,
    },
    {
      en: 'Who had the dream that inspired the wording of the Adhan?',
      fr: 'Qui eut le rêve qui inspira les paroles de l\'Adhan ?',
      options: [
        { en: 'The Prophet ﷺ', fr: 'Le Prophète ﷺ' },
        { en: 'Abdullah ibn Zayd', fr: 'Abdullah ibn Zayd' },
        { en: 'Bilal', fr: 'Bilal' },
        { en: 'Abu Bakr', fr: 'Abu Bakr' },
      ],
      correctIndex: 1,
    },
    {
      en: 'What does "Allahu Akbar" at the start of the Adhan mean?',
      fr: 'Que signifie "Allahu Akbar" au début de l\'Adhan ?',
      options: [
        { en: 'Come to prayer', fr: 'Venez à la prière' },
        { en: 'Allah is the Greatest', fr: 'Allah est le Plus Grand' },
        { en: 'There is no god but Allah', fr: 'Il n\'y a de dieu qu\'Allah' },
        { en: 'Prayer is better than sleep', fr: 'La prière est meilleure que le sommeil' },
      ],
      correctIndex: 1,
    },
  ],

  'hijrah': [
    {
      en: 'Where did the Prophet ﷺ migrate to?',
      fr: 'Où le Prophète ﷺ a-t-il émigré ?',
      options: [
        { en: 'Abyssinia (Ethiopia)', fr: 'Abyssinie (Éthiopie)' },
        { en: 'Yathrib (Medina)', fr: 'Yathrib (Médine)' },
        { en: 'Taif', fr: 'Taïf' },
        { en: 'Damascus', fr: 'Damas' },
      ],
      correctIndex: 1,
    },
    {
      en: 'Who accompanied the Prophet ﷺ during the Hijrah?',
      fr: 'Qui accompagna le Prophète ﷺ durant l\'Hégire ?',
      options: [
        { en: 'Umar', fr: 'Umar' },
        { en: 'Ali', fr: 'Ali' },
        { en: 'Abu Bakr', fr: 'Abu Bakr' },
        { en: 'Uthman', fr: 'Uthman' },
      ],
      correctIndex: 2,
    },
    {
      en: 'In which cave did they hide during the Hijrah?',
      fr: 'Dans quelle grotte se cachèrent-ils durant l\'Hégire ?',
      options: [
        { en: 'Cave of Hira', fr: 'Grotte de Hira' },
        { en: 'Cave of Thawr', fr: 'Grotte de Thawr' },
        { en: 'Cave of Uhud', fr: 'Grotte de Uhud' },
        { en: 'Cave of Badr', fr: 'Grotte de Badr' },
      ],
      correctIndex: 1,
    },
  ],

  'treaty-hudaybiyyah': [
    {
      en: 'In which year AH was the Treaty of Hudaybiyyah?',
      fr: 'En quelle année AH le traité d\'al-Hudaybiyyah fut-il conclu ?',
      options: [
        { en: '4 AH', fr: '4 AH' },
        { en: '6 AH', fr: '6 AH' },
        { en: '8 AH', fr: '8 AH' },
        { en: '10 AH', fr: '10 AH' },
      ],
      correctIndex: 1,
    },
    {
      en: 'What did the Quran call this treaty?',
      fr: 'Comment le Coran qualifia-t-il ce traité ?',
      options: [
        { en: 'A great loss', fr: 'Une grande perte' },
        { en: 'A clear victory (Fath Mubin)', fr: 'Une victoire éclatante (Fath Mubin)' },
        { en: 'A difficult trial', fr: 'Une épreuve difficile' },
        { en: 'A temporary pause', fr: 'Une pause temporaire' },
      ],
      correctIndex: 1,
    },
    {
      en: 'How long was the peace period agreed upon?',
      fr: 'Quelle fut la durée de la période de paix convenue ?',
      options: [
        { en: '5 years', fr: '5 ans' },
        { en: '10 years', fr: '10 ans' },
        { en: '3 years', fr: '3 ans' },
        { en: '1 year', fr: '1 an' },
      ],
      correctIndex: 1,
    },
  ],

  'farewell-sermon': [
    {
      en: 'Where did the Prophet ﷺ deliver the Farewell Sermon?',
      fr: 'Où le Prophète ﷺ prononça-t-il le Sermon d\'Adieu ?',
      options: [
        { en: 'Masjid an-Nabawi', fr: 'Masjid an-Nabawi' },
        { en: 'Mount Arafat', fr: 'Mont Arafat' },
        { en: 'Masjid al-Haram', fr: 'Masjid al-Haram' },
        { en: 'Mina', fr: 'Mina' },
      ],
      correctIndex: 1,
    },
    {
      en: 'What key principle did the Prophet ﷺ emphasize about all people?',
      fr: 'Quel principe clé le Prophète ﷺ a-t-il souligné concernant les gens ?',
      options: [
        { en: 'Arabs are superior', fr: 'Les Arabes sont supérieurs' },
        { en: 'All people are equal regardless of race', fr: 'Tous les gens sont égaux quelle que soit la race' },
        { en: 'Only scholars have value', fr: 'Seuls les savants ont de la valeur' },
        { en: 'The rich must lead', fr: 'Les riches doivent diriger' },
      ],
      correctIndex: 1,
    },
    {
      en: 'What two things did the Prophet ﷺ leave behind for guidance?',
      fr: 'Quelles deux choses le Prophète ﷺ laissa-t-il comme guide ?',
      options: [
        { en: 'The sword and the shield', fr: 'L\'épée et le bouclier' },
        { en: 'The Quran and the Sunnah', fr: 'Le Coran et la Sunna' },
        { en: 'Gold and land', fr: 'De l\'or et des terres' },
        { en: 'His companions and wealth', fr: 'Ses compagnons et sa richesse' },
      ],
      correctIndex: 1,
    },
  ],

  'compilation-quran': [
    {
      en: 'Under which Caliph was the Quran first compiled into a single book?',
      fr: 'Sous quel calife le Coran fut-il compilé en un seul livre ?',
      options: [
        { en: 'Umar', fr: 'Umar' },
        { en: 'Abu Bakr', fr: 'Abu Bakr' },
        { en: 'Uthman', fr: 'Uthman' },
        { en: 'Ali', fr: 'Ali' },
      ],
      correctIndex: 1,
    },
    {
      en: 'Who was tasked with leading the compilation?',
      fr: 'Qui fut chargé de diriger la compilation ?',
      options: [
        { en: 'Ali ibn Abi Talib', fr: 'Ali ibn Abi Talib' },
        { en: 'Zayd ibn Thabit', fr: 'Zayd ibn Thabit' },
        { en: 'Abdullah ibn Masud', fr: 'Abdullah ibn Masud' },
        { en: 'Ubayy ibn Ka\'b', fr: 'Ubayy ibn Ka\'b' },
      ],
      correctIndex: 1,
    },
    {
      en: 'Under which Caliph was a standardized copy distributed?',
      fr: 'Sous quel calife des copies standardisées furent-elles distribuées ?',
      options: [
        { en: 'Abu Bakr', fr: 'Abu Bakr' },
        { en: 'Umar', fr: 'Umar' },
        { en: 'Uthman', fr: 'Uthman' },
        { en: 'Ali', fr: 'Ali' },
      ],
      correctIndex: 2,
    },
  ],

  // ═══════════════════════════════════════════
  //  PROPHETS (10)
  // ═══════════════════════════════════════════

  'prophet-generosity': [
    {
      en: 'How is the Prophet\'s ﷺ generosity in Ramadan described?',
      fr: 'Comment la générosité du Prophète ﷺ pendant le Ramadan est-elle décrite ?',
      options: [
        { en: 'Like a gentle rain', fr: 'Comme une pluie douce' },
        { en: 'Like a blowing wind that brings relief', fr: 'Comme un vent soufflant qui apporte le soulagement' },
        { en: 'Like a flowing river', fr: 'Comme une rivière qui coule' },
        { en: 'Like the morning sun', fr: 'Comme le soleil du matin' },
      ],
      correctIndex: 1,
    },
    {
      en: 'Who would review the Quran with the Prophet ﷺ every Ramadan?',
      fr: 'Qui révisait le Coran avec le Prophète ﷺ chaque Ramadan ?',
      options: [
        { en: 'Abu Bakr', fr: 'Abu Bakr' },
        { en: 'Jibreel (Gabriel)', fr: 'Jibreel (Gabriel)' },
        { en: 'Umar', fr: 'Umar' },
        { en: 'Aisha', fr: 'Aisha' },
      ],
      correctIndex: 1,
    },
    {
      en: 'The Prophet ﷺ never said "no" to anyone who asked for what?',
      fr: 'Le Prophète ﷺ n\'a jamais dit "non" à quiconque demandait quoi ?',
      options: [
        { en: 'Help or charity', fr: 'De l\'aide ou la charité' },
        { en: 'Knowledge', fr: 'La connaissance' },
        { en: 'Food only', fr: 'De la nourriture seulement' },
        { en: 'Weapons', fr: 'Des armes' },
      ],
      correctIndex: 0,
    },
  ],

  'prophet-itikaf': [
    {
      en: 'During which nights would the Prophet ﷺ perform I\'tikaf?',
      fr: 'Durant quelles nuits le Prophète ﷺ faisait-il l\'I\'tikaf ?',
      options: [
        { en: 'First 10 nights', fr: 'Les 10 premières nuits' },
        { en: 'Last 10 nights', fr: 'Les 10 dernières nuits' },
        { en: 'All 30 nights', fr: 'Les 30 nuits' },
        { en: 'Only on odd nights', fr: 'Seulement les nuits impaires' },
      ],
      correctIndex: 1,
    },
    {
      en: 'What is I\'tikaf?',
      fr: 'Qu\'est-ce que l\'I\'tikaf ?',
      options: [
        { en: 'Night prayer', fr: 'La prière de nuit' },
        { en: 'Seclusion in the mosque for worship', fr: 'La retraite spirituelle à la mosquée pour l\'adoration' },
        { en: 'Fasting extra days', fr: 'Jeûner des jours supplémentaires' },
        { en: 'Giving charity', fr: 'Donner la charité' },
      ],
      correctIndex: 1,
    },
    {
      en: 'In the Prophet\'s ﷺ last Ramadan, how many days of I\'tikaf did he perform?',
      fr: 'Lors du dernier Ramadan du Prophète ﷺ, combien de jours d\'I\'tikaf a-t-il accompli ?',
      options: [
        { en: '10 days', fr: '10 jours' },
        { en: '20 days', fr: '20 jours' },
        { en: '15 days', fr: '15 jours' },
        { en: '30 days', fr: '30 jours' },
      ],
      correctIndex: 1,
    },
  ],

  'prophet-tahajjud': [
    {
      en: 'When is Tahajjud prayer performed?',
      fr: 'Quand la prière de Tahajjud est-elle accomplie ?',
      options: [
        { en: 'After Fajr', fr: 'Après le Fajr' },
        { en: 'In the last third of the night', fr: 'Dans le dernier tiers de la nuit' },
        { en: 'At noon', fr: 'À midi' },
        { en: 'After Maghrib', fr: 'Après le Maghrib' },
      ],
      correctIndex: 1,
    },
    {
      en: 'How long would the Prophet ﷺ sometimes stand in prayer?',
      fr: 'Combien de temps le Prophète ﷺ restait-il parfois debout en prière ?',
      options: [
        { en: 'A few minutes', fr: 'Quelques minutes' },
        { en: 'Until his feet would swell', fr: 'Jusqu\'à ce que ses pieds enflent' },
        { en: 'About an hour', fr: 'Environ une heure' },
        { en: 'Until dawn', fr: 'Jusqu\'à l\'aube' },
      ],
      correctIndex: 1,
    },
    {
      en: 'When does Allah descend to the lowest heaven according to hadith?',
      fr: 'Quand Allah descend-Il au ciel le plus bas selon le hadith ?',
      options: [
        { en: 'During Fajr', fr: 'Pendant le Fajr' },
        { en: 'The last third of every night', fr: 'Le dernier tiers de chaque nuit' },
        { en: 'During Ramadan only', fr: 'Pendant le Ramadan seulement' },
        { en: 'On Fridays', fr: 'Les vendredis' },
      ],
      correctIndex: 1,
    },
  ],

  'prophet-kindness': [
    {
      en: 'How did the Prophet ﷺ respond to the woman who threw garbage at him?',
      fr: 'Comment le Prophète ﷺ a-t-il réagi face à la femme qui lui jetait des ordures ?',
      options: [
        { en: 'He confronted her angrily', fr: 'Il l\'a confrontée avec colère' },
        { en: 'He visited her when she fell ill', fr: 'Il lui rendit visite quand elle tomba malade' },
        { en: 'He ignored her completely', fr: 'Il l\'a complètement ignorée' },
        { en: 'He reported her', fr: 'Il l\'a dénoncée' },
      ],
      correctIndex: 1,
    },
    {
      en: 'The Prophet ﷺ said: "I was sent to perfect…"',
      fr: 'Le Prophète ﷺ a dit : "J\'ai été envoyé pour parfaire…"',
      options: [
        { en: 'The law', fr: 'La loi' },
        { en: 'Good character', fr: 'Le bon caractère' },
        { en: 'The Arabic language', fr: 'La langue arabe' },
        { en: 'Worship', fr: 'L\'adoration' },
      ],
      correctIndex: 1,
    },
    {
      en: 'What did the Prophet ﷺ say about the best among people?',
      fr: 'Que dit le Prophète ﷺ au sujet des meilleurs parmi les gens ?',
      options: [
        { en: 'The wealthiest', fr: 'Les plus riches' },
        { en: 'The best in character', fr: 'Les meilleurs en caractère' },
        { en: 'The strongest', fr: 'Les plus forts' },
        { en: 'The most knowledgeable', fr: 'Les plus savants' },
      ],
      correctIndex: 1,
    },
  ],

  'prophet-forgiveness': [
    {
      en: 'What did the Prophet ﷺ do when he conquered Makkah?',
      fr: 'Que fit le Prophète ﷺ quand il conquit La Mecque ?',
      options: [
        { en: 'Punished his enemies', fr: 'Punit ses ennemis' },
        { en: 'Forgave everyone', fr: 'Pardonna à tous' },
        { en: 'Imposed heavy taxes', fr: 'Imposa de lourdes taxes' },
        { en: 'Exiled the leaders', fr: 'Exila les chefs' },
      ],
      correctIndex: 1,
    },
    {
      en: 'How did the Prophet ﷺ treat the people of Taif who had stoned him?',
      fr: 'Comment le Prophète ﷺ traita-t-il les gens de Taïf qui l\'avaient lapidé ?',
      options: [
        { en: 'Asked Allah to destroy them', fr: 'Demanda à Allah de les détruire' },
        { en: 'Prayed for their guidance', fr: 'Pria pour leur guidance' },
        { en: 'Left and never returned', fr: 'Partit et ne revint jamais' },
        { en: 'Sent an army against them', fr: 'Envoya une armée contre eux' },
      ],
      correctIndex: 1,
    },
    {
      en: 'The Prophet ﷺ forgave Hind bint Utba, who had done what?',
      fr: 'Le Prophète ﷺ pardonna à Hind bint Utba, qui avait fait quoi ?',
      options: [
        { en: 'Stolen from the Muslims', fr: 'Volé les musulmans' },
        { en: 'Mutilated the body of Hamza', fr: 'Mutilé le corps de Hamza' },
        { en: 'Cursed the Prophet publicly', fr: 'Maudit le Prophète publiquement' },
        { en: 'Betrayed the treaty', fr: 'Trahi le traité' },
      ],
      correctIndex: 1,
    },
  ],

  'prophet-charity': [
    {
      en: 'What is the reward of feeding a fasting person according to the Prophet ﷺ?',
      fr: 'Quelle est la récompense de nourrir un jeûneur selon le Prophète ﷺ ?',
      options: [
        { en: 'Double reward', fr: 'Double récompense' },
        { en: 'Same reward as the fasting person', fr: 'La même récompense que le jeûneur' },
        { en: 'Forgiveness of sins', fr: 'Le pardon des péchés' },
        { en: 'Entry to Paradise', fr: 'L\'entrée au Paradis' },
      ],
      correctIndex: 1,
    },
    {
      en: 'What did the Prophet ﷺ say about even a small act of charity?',
      fr: 'Que dit le Prophète ﷺ au sujet d\'un petit acte de charité ?',
      options: [
        { en: 'It counts only if given publicly', fr: 'Il ne compte que s\'il est donné publiquement' },
        { en: 'Even half a date can protect from the Fire', fr: 'Même une demi-datte peut protéger du Feu' },
        { en: 'Only money counts as charity', fr: 'Seul l\'argent compte comme charité' },
        { en: 'It must be given in Ramadan only', fr: 'Il doit être donné seulement en Ramadan' },
      ],
      correctIndex: 1,
    },
    {
      en: 'The Prophet ﷺ described charity as a proof of what?',
      fr: 'Le Prophète ﷺ décrivit la charité comme une preuve de quoi ?',
      options: [
        { en: 'Wealth', fr: 'La richesse' },
        { en: 'Faith (Iman)', fr: 'La foi (Iman)' },
        { en: 'Strength', fr: 'La force' },
        { en: 'Intelligence', fr: 'L\'intelligence' },
      ],
      correctIndex: 1,
    },
  ],

  'prophet-patience': [
    {
      en: 'What year is known as the "Year of Sorrow"?',
      fr: 'Quelle année est connue comme "l\'Année de la Tristesse" ?',
      options: [
        { en: 'Year Abu Bakr died', fr: 'L\'année de la mort d\'Abu Bakr' },
        { en: 'Year Khadijah and Abu Talib died', fr: 'L\'année de la mort de Khadijah et Abu Talib' },
        { en: 'Year of Badr', fr: 'L\'année de Badr' },
        { en: 'Year of Hijrah', fr: 'L\'année de l\'Hégire' },
      ],
      correctIndex: 1,
    },
    {
      en: 'How did the Prophet ﷺ respond to hardship?',
      fr: 'Comment le Prophète ﷺ répondait-il aux épreuves ?',
      options: [
        { en: 'With complaint', fr: 'Avec plainte' },
        { en: 'With patience and trust in Allah', fr: 'Avec patience et confiance en Allah' },
        { en: 'By avoiding people', fr: 'En évitant les gens' },
        { en: 'By seeking worldly comfort', fr: 'En cherchant le confort mondain' },
      ],
      correctIndex: 1,
    },
    {
      en: 'The Quran says "Indeed, with hardship comes…"',
      fr: 'Le Coran dit « Certes, avec la difficulté vient… »',
      options: [
        { en: 'More hardship', fr: 'Plus de difficulté' },
        { en: 'Ease', fr: 'La facilité' },
        { en: 'Reward only in the Hereafter', fr: 'La récompense seulement dans l\'au-delà' },
        { en: 'Strength', fr: 'La force' },
      ],
      correctIndex: 1,
    },
  ],

  'prophet-family': [
    {
      en: 'Who was the Prophet\'s ﷺ first wife?',
      fr: 'Qui fut la première épouse du Prophète ﷺ ?',
      options: [
        { en: 'Aisha', fr: 'Aisha' },
        { en: 'Khadijah', fr: 'Khadijah' },
        { en: 'Hafsa', fr: 'Hafsa' },
        { en: 'Umm Salamah', fr: 'Umm Salamah' },
      ],
      correctIndex: 1,
    },
    {
      en: 'What did the Prophet ﷺ say about the best of men?',
      fr: 'Que dit le Prophète ﷺ au sujet des meilleurs hommes ?',
      options: [
        { en: 'The richest', fr: 'Les plus riches' },
        { en: 'The best to their families', fr: 'Les meilleurs envers leurs familles' },
        { en: 'The most knowledgeable', fr: 'Les plus savants' },
        { en: 'The most powerful', fr: 'Les plus puissants' },
      ],
      correctIndex: 1,
    },
    {
      en: 'How did the Prophet ﷺ help at home?',
      fr: 'Comment le Prophète ﷺ aidait-il à la maison ?',
      options: [
        { en: 'He never did housework', fr: 'Il ne faisait jamais de tâches ménagères' },
        { en: 'He would mend his shoes and help with chores', fr: 'Il réparait ses chaussures et aidait aux tâches' },
        { en: 'He only prayed', fr: 'Il ne faisait que prier' },
        { en: 'He had servants do everything', fr: 'Il avait des serviteurs pour tout faire' },
      ],
      correctIndex: 1,
    },
  ],

  'prophet-dua': [
    {
      en: 'When is dua most likely to be accepted according to the Prophet ﷺ?',
      fr: 'Quand l\'invocation est-elle le plus susceptible d\'être acceptée selon le Prophète ﷺ ?',
      options: [
        { en: 'At noon', fr: 'À midi' },
        { en: 'In the last third of the night', fr: 'Dans le dernier tiers de la nuit' },
        { en: 'Only during Ramadan', fr: 'Seulement pendant le Ramadan' },
        { en: 'On Mondays only', fr: 'Les lundis seulement' },
      ],
      correctIndex: 1,
    },
    {
      en: 'What did the Prophet ﷺ say about dua being a form of?',
      fr: 'Que dit le Prophète ﷺ sur le fait que l\'invocation est une forme de ?',
      options: [
        { en: 'Exercise', fr: 'Exercice' },
        { en: 'Worship (Ibadah)', fr: 'Adoration (Ibadah)' },
        { en: 'Obligation', fr: 'Obligation' },
        { en: 'Tradition', fr: 'Tradition' },
      ],
      correctIndex: 1,
    },
    {
      en: 'The Prophet ﷺ said Allah responds to dua in one of how many ways?',
      fr: 'Le Prophète ﷺ dit qu\'Allah répond à l\'invocation de combien de façons ?',
      options: [
        { en: '1', fr: '1' },
        { en: '2', fr: '2' },
        { en: '3', fr: '3' },
        { en: '5', fr: '5' },
      ],
      correctIndex: 2,
    },
  ],

  'prophet-last-ramadan': [
    {
      en: 'How many times did Jibreel review the Quran with the Prophet ﷺ in his last Ramadan?',
      fr: 'Combien de fois Jibreel a-t-il révisé le Coran avec le Prophète ﷺ lors de son dernier Ramadan ?',
      options: [
        { en: 'Once', fr: 'Une fois' },
        { en: 'Twice', fr: 'Deux fois' },
        { en: 'Three times', fr: 'Trois fois' },
        { en: 'Five times', fr: 'Cinq fois' },
      ],
      correctIndex: 1,
    },
    {
      en: 'How many days of I\'tikaf did the Prophet ﷺ perform in his last Ramadan?',
      fr: 'Combien de jours d\'I\'tikaf le Prophète ﷺ a-t-il accompli lors de son dernier Ramadan ?',
      options: [
        { en: '10 days', fr: '10 jours' },
        { en: '20 days', fr: '20 jours' },
        { en: '15 days', fr: '15 jours' },
        { en: '30 days', fr: '30 jours' },
      ],
      correctIndex: 1,
    },
    {
      en: 'What sign indicated to Fatimah that the Prophet ﷺ was nearing his end?',
      fr: 'Quel signe indiqua à Fatimah que le Prophète ﷺ approchait de sa fin ?',
      options: [
        { en: 'He stopped eating', fr: 'Il arrêta de manger' },
        { en: 'He whispered that Jibreel reviewed the Quran twice', fr: 'Il murmura que Jibreel avait révisé le Coran deux fois' },
        { en: 'He gave away all his belongings', fr: 'Il donna tous ses biens' },
        { en: 'He stopped leading prayers', fr: 'Il arrêta de diriger les prières' },
      ],
      correctIndex: 1,
    },
  ],

  // ═══════════════════════════════════════════
  //  COMPANIONS (10)
  // ═══════════════════════════════════════════

  'companions-fasting': [
    {
      en: 'What did the Companions prioritize during Ramadan?',
      fr: 'Que priorisaient les Compagnons pendant le Ramadan ?',
      options: [
        { en: 'Rest and sleep', fr: 'Le repos et le sommeil' },
        { en: 'Worship, Quran, and charity', fr: 'L\'adoration, le Coran et la charité' },
        { en: 'Business and trade', fr: 'Le commerce et les affaires' },
        { en: 'Travel and exploration', fr: 'Le voyage et l\'exploration' },
      ],
      correctIndex: 1,
    },
    {
      en: 'How did Ibn Umar break his fast?',
      fr: 'Comment Ibn Umar rompait-il son jeûne ?',
      options: [
        { en: 'With a large meal', fr: 'Avec un grand repas' },
        { en: 'With dates and water, following the Sunnah', fr: 'Avec des dattes et de l\'eau, suivant la Sunna' },
        { en: 'With bread and milk', fr: 'Avec du pain et du lait' },
        { en: 'He would skip iftar', fr: 'Il sautait l\'iftar' },
      ],
      correctIndex: 1,
    },
    {
      en: 'What did the Companions do after Taraweeh prayers?',
      fr: 'Que faisaient les Compagnons après les prières de Taraweeh ?',
      options: [
        { en: 'Went to sleep immediately', fr: 'Allaient dormir immédiatement' },
        { en: 'Continued with extra night prayers', fr: 'Continuaient avec des prières nocturnes supplémentaires' },
        { en: 'Had social gatherings', fr: 'Avaient des réunions sociales' },
        { en: 'Went to the market', fr: 'Allaient au marché' },
      ],
      correctIndex: 1,
    },
  ],

  'companions-quran': [
    {
      en: 'How many times did Uthman (RA) complete the Quran during Ramadan?',
      fr: 'Combien de fois Uthman (RA) complétait-il le Coran pendant le Ramadan ?',
      options: [
        { en: 'Once', fr: 'Une fois' },
        { en: 'At least once, sometimes more', fr: 'Au moins une fois, parfois plus' },
        { en: 'Never completely', fr: 'Jamais complètement' },
        { en: 'Five times', fr: 'Cinq fois' },
      ],
      correctIndex: 1,
    },
    {
      en: 'What did the Companions do with the Quran during Ramadan specifically?',
      fr: 'Que faisaient les Compagnons avec le Coran spécifiquement pendant le Ramadan ?',
      options: [
        { en: 'Memorized only', fr: 'Mémorisaient seulement' },
        { en: 'Recited, reflected, and acted upon it', fr: 'Le récitaient, le méditaient et le mettaient en pratique' },
        { en: 'Read only in Arabic', fr: 'Lisaient seulement en arabe' },
        { en: 'Kept it closed out of respect', fr: 'Le gardaient fermé par respect' },
      ],
      correctIndex: 1,
    },
    {
      en: 'Which Companion was known as "Sahib al-Quran" (Companion of the Quran)?',
      fr: 'Quel Compagnon était connu comme "Sahib al-Quran" (Compagnon du Coran) ?',
      options: [
        { en: 'Abu Bakr', fr: 'Abu Bakr' },
        { en: 'Abdullah ibn Masud', fr: 'Abdullah ibn Masud' },
        { en: 'Umar', fr: 'Umar' },
        { en: 'Khalid ibn Walid', fr: 'Khalid ibn Walid' },
      ],
      correctIndex: 1,
    },
  ],

  'bilal-story': [
    {
      en: 'Where was Bilal (RA) from originally?',
      fr: 'D\'où Bilal (RA) était-il originaire ?',
      options: [
        { en: 'Makkah', fr: 'La Mecque' },
        { en: 'Abyssinia (Ethiopia)', fr: 'Abyssinie (Éthiopie)' },
        { en: 'Medina', fr: 'Médine' },
        { en: 'Yemen', fr: 'Yémen' },
      ],
      correctIndex: 1,
    },
    {
      en: 'What word did Bilal (RA) repeat under torture?',
      fr: 'Quel mot Bilal (RA) répétait-il sous la torture ?',
      options: [
        { en: 'Help me', fr: 'Aidez-moi' },
        { en: 'Ahad, Ahad (One, One)', fr: 'Ahad, Ahad (Un, Un)' },
        { en: 'I surrender', fr: 'Je me rends' },
        { en: 'Muhammad', fr: 'Muhammad' },
      ],
      correctIndex: 1,
    },
    {
      en: 'Who freed Bilal (RA) from slavery?',
      fr: 'Qui libéra Bilal (RA) de l\'esclavage ?',
      options: [
        { en: 'The Prophet ﷺ', fr: 'Le Prophète ﷺ' },
        { en: 'Abu Bakr', fr: 'Abu Bakr' },
        { en: 'Umar', fr: 'Umar' },
        { en: 'Khadijah', fr: 'Khadijah' },
      ],
      correctIndex: 1,
    },
  ],

  'khadijah-sacrifice': [
    {
      en: 'How old was Khadijah (RA) when she married the Prophet ﷺ?',
      fr: 'Quel âge avait Khadijah (RA) quand elle épousa le Prophète ﷺ ?',
      options: [
        { en: '25 years old', fr: '25 ans' },
        { en: '40 years old', fr: '40 ans' },
        { en: '30 years old', fr: '30 ans' },
        { en: '35 years old', fr: '35 ans' },
      ],
      correctIndex: 1,
    },
    {
      en: 'Khadijah (RA) was the first person to do what?',
      fr: 'Khadijah (RA) fut la première personne à faire quoi ?',
      options: [
        { en: 'Pray in the mosque', fr: 'Prier à la mosquée' },
        { en: 'Accept Islam', fr: 'Accepter l\'Islam' },
        { en: 'Make Hijrah', fr: 'Faire l\'Hégire' },
        { en: 'Fight in battle', fr: 'Combattre au combat' },
      ],
      correctIndex: 1,
    },
    {
      en: 'What did Allah send Khadijah (RA) greetings of through Jibreel?',
      fr: 'De quoi Allah envoya-t-il des salutations à Khadijah (RA) par Jibreel ?',
      options: [
        { en: 'Forgiveness', fr: 'Le pardon' },
        { en: 'Salam (peace)', fr: 'Salam (paix)' },
        { en: 'Strength', fr: 'La force' },
        { en: 'Knowledge', fr: 'La connaissance' },
      ],
      correctIndex: 1,
    },
  ],

  'abu-bakr-generosity': [
    {
      en: 'How much of his wealth did Abu Bakr (RA) donate for the Tabuk expedition?',
      fr: 'Quelle part de sa richesse Abu Bakr (RA) donna-t-il pour l\'expédition de Tabuk ?',
      options: [
        { en: 'A quarter', fr: 'Un quart' },
        { en: 'Half', fr: 'La moitié' },
        { en: 'All of it', fr: 'La totalité' },
        { en: 'One tenth', fr: 'Un dixième' },
      ],
      correctIndex: 2,
    },
    {
      en: 'Abu Bakr (RA) was known as "As-Siddiq" which means?',
      fr: 'Abu Bakr (RA) était connu comme "As-Siddiq" ce qui signifie ?',
      options: [
        { en: 'The Brave', fr: 'Le Brave' },
        { en: 'The Truthful', fr: 'Le Véridique' },
        { en: 'The Generous', fr: 'Le Généreux' },
        { en: 'The Wise', fr: 'Le Sage' },
      ],
      correctIndex: 1,
    },
    {
      en: 'What did the Prophet ﷺ say when asked what Abu Bakr left for his family?',
      fr: 'Que répondit le Prophète ﷺ quand on lui demanda ce qu\'Abu Bakr laissa à sa famille ?',
      options: [
        { en: '"Half his wealth"', fr: '"La moitié de sa richesse"' },
        { en: '"Allah and His Messenger"', fr: '"Allah et Son Messager"' },
        { en: '"His house"', fr: '"Sa maison"' },
        { en: '"Nothing"', fr: '"Rien"' },
      ],
      correctIndex: 1,
    },
  ],

  'umar-justice': [
    {
      en: 'What was Umar (RA) known for?',
      fr: 'Pour quoi Umar (RA) était-il connu ?',
      options: [
        { en: 'Poetry', fr: 'La poésie' },
        { en: 'Justice and firmness', fr: 'La justice et la fermeté' },
        { en: 'Trading', fr: 'Le commerce' },
        { en: 'Medicine', fr: 'La médecine' },
      ],
      correctIndex: 1,
    },
    {
      en: 'Umar (RA) was given which title by the Prophet ﷺ?',
      fr: 'Quel titre le Prophète ﷺ donna-t-il à Umar (RA) ?',
      options: [
        { en: 'As-Siddiq', fr: 'As-Siddiq' },
        { en: 'Al-Faruq', fr: 'Al-Faruq' },
        { en: 'Dhun-Nurayn', fr: 'Dhun-Nurayn' },
        { en: 'Asadullah', fr: 'Asadullah' },
      ],
      correctIndex: 1,
    },
    {
      en: 'What did Umar (RA) do at night during his Caliphate?',
      fr: 'Que faisait Umar (RA) la nuit pendant son Califat ?',
      options: [
        { en: 'Slept peacefully', fr: 'Dormait paisiblement' },
        { en: 'Patrolled the streets to check on his people', fr: 'Patrouillait les rues pour veiller sur son peuple' },
        { en: 'Counted the treasury', fr: 'Comptait le trésor' },
        { en: 'Held court', fr: 'Tenait audience' },
      ],
      correctIndex: 1,
    },
  ],

  'uthman-quran': [
    {
      en: 'Uthman (RA) was known as "Dhun-Nurayn" which means?',
      fr: 'Uthman (RA) était connu comme "Dhun-Nurayn" ce qui signifie ?',
      options: [
        { en: 'The Just', fr: 'Le Juste' },
        { en: 'The Possessor of Two Lights', fr: 'Le Possesseur des Deux Lumières' },
        { en: 'The Strong', fr: 'Le Fort' },
        { en: 'The Wise', fr: 'Le Sage' },
      ],
      correctIndex: 1,
    },
    {
      en: 'What major contribution did Uthman (RA) make for the Quran?',
      fr: 'Quelle contribution majeure Uthman (RA) fit-il pour le Coran ?',
      options: [
        { en: 'First to memorize it', fr: 'Premier à le mémoriser' },
        { en: 'Standardized its written copies', fr: 'Standardisa ses copies écrites' },
        { en: 'Translated it to Persian', fr: 'Le traduisit en persan' },
        { en: 'Wrote the tafsir', fr: 'Écrivit le tafsir' },
      ],
      correctIndex: 1,
    },
    {
      en: 'Uthman (RA) equipped the Muslim army for which expedition?',
      fr: 'Uthman (RA) équipa l\'armée musulmane pour quelle expédition ?',
      options: [
        { en: 'Battle of Badr', fr: 'Bataille de Badr' },
        { en: 'Expedition of Tabuk', fr: 'L\'expédition de Tabuk' },
        { en: 'Battle of Uhud', fr: 'Bataille de Uhud' },
        { en: 'Conquest of Makkah', fr: 'La conquête de La Mecque' },
      ],
      correctIndex: 1,
    },
  ],

  'ali-devotion': [
    {
      en: 'Ali (RA) was the first what to accept Islam?',
      fr: 'Ali (RA) fut le premier quoi à accepter l\'Islam ?',
      options: [
        { en: 'Adult man', fr: 'Homme adulte' },
        { en: 'Youth/child', fr: 'Jeune/enfant' },
        { en: 'Freed slave', fr: 'Esclave affranchi' },
        { en: 'Merchant', fr: 'Marchand' },
      ],
      correctIndex: 1,
    },
    {
      en: 'What title did the Prophet ﷺ give Ali (RA)?',
      fr: 'Quel titre le Prophète ﷺ donna-t-il à Ali (RA) ?',
      options: [
        { en: 'Al-Faruq', fr: 'Al-Faruq' },
        { en: 'The Gate of Knowledge', fr: 'La Porte de la Connaissance' },
        { en: 'As-Siddiq', fr: 'As-Siddiq' },
        { en: 'The Sword of Allah', fr: 'L\'Épée d\'Allah' },
      ],
      correctIndex: 1,
    },
    {
      en: 'Ali (RA) slept in the Prophet\'s ﷺ bed on the night of?',
      fr: 'Ali (RA) dormit dans le lit du Prophète ﷺ la nuit de ?',
      options: [
        { en: 'Laylatul Qadr', fr: 'Laylatul Qadr' },
        { en: 'The Hijrah', fr: 'L\'Hégire' },
        { en: 'The Battle of Badr', fr: 'La Bataille de Badr' },
        { en: 'Eid al-Fitr', fr: 'Eid al-Fitr' },
      ],
      correctIndex: 1,
    },
  ],

  'salman-farsi': [
    {
      en: 'Where did Salman al-Farsi (RA) come from?',
      fr: 'D\'où venait Salman al-Farsi (RA) ?',
      options: [
        { en: 'Arabia', fr: 'L\'Arabie' },
        { en: 'Persia (Iran)', fr: 'La Perse (Iran)' },
        { en: 'Rome', fr: 'Rome' },
        { en: 'Abyssinia', fr: 'L\'Abyssinie' },
      ],
      correctIndex: 1,
    },
    {
      en: 'What strategic idea did Salman (RA) suggest at the Battle of the Trench?',
      fr: 'Quelle idée stratégique Salman (RA) suggéra-t-il à la Bataille du Fossé ?',
      options: [
        { en: 'Building a wall', fr: 'Construire un mur' },
        { en: 'Digging a trench', fr: 'Creuser un fossé' },
        { en: 'Retreating to Makkah', fr: 'Se retirer à La Mecque' },
        { en: 'Sending cavalry', fr: 'Envoyer la cavalerie' },
      ],
      correctIndex: 1,
    },
    {
      en: 'The Prophet ﷺ said about Salman: "Salman is one of…"',
      fr: 'Le Prophète ﷺ dit au sujet de Salman : "Salman est des nôtres…"',
      options: [
        { en: 'The Quraysh', fr: 'Les Quraysh' },
        { en: 'The People of the House (Ahl al-Bayt)', fr: 'Les Gens de la Maison (Ahl al-Bayt)' },
        { en: 'The Ansar', fr: 'Les Ansar' },
        { en: 'The Muhajirun', fr: 'Les Muhajirun' },
      ],
      correctIndex: 1,
    },
  ],

  'aisha-knowledge': [
    {
      en: 'How many hadiths are narrated by Aisha (RA)?',
      fr: 'Combien de hadiths sont rapportés par Aisha (RA) ?',
      options: [
        { en: 'About 200', fr: 'Environ 200' },
        { en: 'Over 2,200', fr: 'Plus de 2200' },
        { en: 'About 500', fr: 'Environ 500' },
        { en: 'About 50', fr: 'Environ 50' },
      ],
      correctIndex: 1,
    },
    {
      en: 'Aisha (RA) was known as an expert in which fields?',
      fr: 'Aisha (RA) était connue comme experte dans quels domaines ?',
      options: [
        { en: 'Only cooking', fr: 'Seulement la cuisine' },
        { en: 'Islamic law, medicine, and poetry', fr: 'Le droit islamique, la médecine et la poésie' },
        { en: 'Only hadith', fr: 'Seulement le hadith' },
        { en: 'Mathematics', fr: 'Les mathématiques' },
      ],
      correctIndex: 1,
    },
    {
      en: 'The Prophet ﷺ said: "Take half your religion from…"',
      fr: 'Le Prophète ﷺ dit : "Prenez la moitié de votre religion de…"',
      options: [
        { en: 'Abu Bakr', fr: 'Abu Bakr' },
        { en: 'This Humayra (Aisha)', fr: 'Cette Humayra (Aisha)' },
        { en: 'Umar', fr: 'Umar' },
        { en: 'Ali', fr: 'Ali' },
      ],
      correctIndex: 1,
    },
  ],
};
