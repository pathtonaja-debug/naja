// French lesson content - Complete translation of all modules

import type { LessonContent } from './lessonContent';

export const LESSON_CONTENT_FR: Record<string, LessonContent> = {
  // Module Bases de l'Islam
  'b1': {
    id: 'b1',
    title: 'Les Cinq Piliers de l\'Islam',
    sections: [
      {
        heading: 'Fondement de la Foi',
        content: 'Les Cinq Piliers de l\'Islam sont les pratiques essentielles que chaque musulman doit accomplir. Ils constituent le cadre de la vie et du culte d\'un musulman, établissant la relation entre le croyant et Allah.',
        keyPoints: [
          'Ils ont été établis par le Prophète Muhammad ﷺ',
          'Ils unissent tous les musulmans du monde',
          'Chaque pilier s\'appuie sur les autres'
        ]
      },
      {
        heading: 'Les Cinq Piliers',
        content: '1. **Shahada** (Déclaration de foi) - Attester qu\'il n\'y a de divinité qu\'Allah et que Muhammad est Son messager.\n\n2. **Salah** (Prière) - Accomplir les cinq prières quotidiennes.\n\n3. **Zakah** (Aumône) - Donner 2,5% de ses économies aux nécessiteux.\n\n4. **Sawm** (Jeûne) - Jeûner pendant le mois de Ramadan.\n\n5. **Hajj** (Pèlerinage) - Effectuer le pèlerinage à La Mecque au moins une fois si possible.',
        keyPoints: [
          'Tous les piliers sont obligatoires pour les musulmans',
          'Ils équilibrent responsabilités spirituelles et sociales',
          'La pratique régulière renforce la foi'
        ]
      }
    ],
    quiz: {
      question: 'Lequel des éléments suivants n\'est PAS l\'un des Cinq Piliers de l\'Islam ?',
      options: ['Salah (Prière)', 'Jihad (Effort)', 'Sawm (Jeûne)', 'Zakah (Charité)'],
      correctIndex: 1,
      explanation: 'Le Jihad, bien qu\'étant un concept important en Islam désignant l\'effort pour la foi, n\'est pas l\'un des Cinq Piliers. Les Cinq Piliers sont la Shahada, la Salah, la Zakah, le Sawm et le Hajj.'
    }
  },
  'b2': {
    id: 'b2',
    title: 'Shahada : La Déclaration de Foi',
    sections: [
      {
        heading: 'Le Premier Pilier',
        content: 'La Shahada est la déclaration de foi islamique : "Ash-hadu an la ilaha illa Allah, wa ash-hadu anna Muhammadan rasul Allah" (J\'atteste qu\'il n\'y a de divinité qu\'Allah, et j\'atteste que Muhammad est le messager d\'Allah).',
        keyPoints: [
          'C\'est la première étape pour devenir musulman',
          'Prononcée sincèrement, elle fait entrer une personne dans l\'Islam',
          'Elle se compose de deux témoignages'
        ]
      },
      {
        heading: 'Signification Profonde',
        content: 'La Shahada affirme le **Tawhid** (l\'Unicité d\'Allah) et la prophétie de Muhammad ﷺ. En la déclarant, un musulman reconnaît :\n\n- Allah seul mérite l\'adoration\n- Muhammad ﷺ est le dernier messager\n- La soumission complète à la volonté d\'Allah\n- Suivre la Sunnah du Prophète ﷺ',
        keyPoints: [
          'Le Tawhid est le fondement de la croyance islamique',
          'Le Prophète ﷺ est l\'exemple pour tous les musulmans',
          'La Shahada doit être déclarée avec une croyance sincère'
        ]
      }
    ],
    quiz: {
      question: 'De quels deux témoignages se compose la Shahada ?',
      options: [
        'La croyance en Allah et le Coran',
        'La croyance en l\'unicité d\'Allah et la prophétie de Muhammad',
        'La croyance en la prière et le jeûne',
        'La croyance aux anges et au Jour du Jugement'
      ],
      correctIndex: 1,
      explanation: 'La Shahada se compose de deux témoignages : la croyance en l\'Unicité d\'Allah (Tawhid) et la croyance que Muhammad ﷺ est Son dernier messager.'
    }
  },
  'b3': {
    id: 'b3',
    title: 'L\'Importance de la Niyyah (Intention)',
    sections: [
      {
        heading: 'Qu\'est-ce que la Niyyah ?',
        content: 'Niyyah (نية) signifie intention en arabe. En Islam, l\'intention derrière chaque action détermine sa valeur et son acceptation par Allah. Le Prophète ﷺ a dit : "Les actions ne valent que par leurs intentions, et chaque personne n\'aura que ce qu\'elle a intentionné."',
        keyPoints: [
          'L\'intention doit être pour la satisfaction d\'Allah',
          'Elle distingue l\'adoration de l\'habitude',
          'La Niyyah se fait dans le cœur, pas à voix haute'
        ]
      },
      {
        heading: 'La Niyyah en Pratique',
        content: 'Avant chaque acte d\'adoration, un musulman doit avoir une intention claire :\n\n- **Prière** : Avoir l\'intention de prier la prière spécifique pour Allah\n- **Jeûne** : Avoir l\'intention de jeûner pour la satisfaction d\'Allah\n- **Charité** : Donner avec l\'intention de plaire à Allah\n- **Bonnes actions** : Chaque action peut devenir adoration avec la bonne intention',
        keyPoints: [
          'Même manger et dormir peuvent être des actes d\'adoration avec la bonne intention',
          'Les intentions insincères invalident l\'adoration',
          'Renouvelez régulièrement vos intentions tout au long de la journée'
        ]
      }
    ],
    quiz: {
      question: 'Selon le hadith, qu\'est-ce qui détermine la valeur des actions ?',
      options: [
        'La quantité d\'effort fourni',
        'La perception des autres',
        'L\'intention derrière l\'action',
        'Le résultat de l\'action'
      ],
      correctIndex: 2,
      explanation: 'Le Prophète ﷺ a enseigné que "Les actions ne valent que par leurs intentions." La sincérité et le but derrière une action sont ce qui lui donne de la valeur aux yeux d\'Allah.'
    }
  },
  'b4': {
    id: 'b4',
    title: 'Les Six Articles de la Foi',
    sections: [
      {
        heading: 'Iman (Foi)',
        content: 'L\'Iman fait référence au système de croyance d\'un musulman. Alors que les Cinq Piliers concernent les actions, les Six Articles de la Foi concernent les croyances. Ils forment le fondement de ce que chaque musulman doit croire.',
        keyPoints: [
          'Iman signifie foi et croyance',
          'Ces croyances sont mentionnées dans le Coran',
          'Nier un article fait sortir de l\'Islam'
        ]
      },
      {
        heading: 'Les Six Articles',
        content: '1. **Croyance en Allah** - Le seul vrai Dieu, Créateur de tout\n\n2. **Croyance aux Anges** - Créés de lumière, ils exécutent les ordres d\'Allah\n\n3. **Croyance aux Livres** - Y compris le Coran, la Torah, les Psaumes et l\'Évangile\n\n4. **Croyance aux Prophètes** - D\'Adam à Muhammad ﷺ\n\n5. **Croyance au Jour du Jugement** - La responsabilité de tous les actes\n\n6. **Croyance au Qadr** - Le décret divin et la prédestination',
        keyPoints: [
          'Tous les articles sont interconnectés',
          'Le Coran est le dernier livre inaltéré',
          'Muhammad ﷺ est le sceau des prophètes'
        ]
      }
    ],
    quiz: {
      question: 'Lequel des éléments suivants est l\'un des Six Articles de la Foi ?',
      options: [
        'La croyance aux Cinq Prières quotidiennes',
        'La croyance au Jeûne',
        'La croyance au Décret Divin (Qadr)',
        'La croyance au Hajj'
      ],
      correctIndex: 2,
      explanation: 'La croyance au Qadr (Décret Divin) est l\'un des Six Articles de la Foi. Les Cinq Piliers (Prière, Jeûne, Hajj) concernent les actions, tandis que les Articles de la Foi concernent les croyances.'
    }
  },
  'b5': {
    id: 'b5',
    title: 'Bases du Halal et Haram',
    sections: [
      {
        heading: 'Comprendre le Halal et le Haram',
        content: 'Halal (حلال) signifie permis, tandis que Haram (حرام) signifie interdit. Ces termes s\'appliquent à tous les aspects de la vie musulmane, y compris la nourriture, les affaires, les relations et la conduite quotidienne.',
        keyPoints: [
          'Le Halal apporte des bénédictions, le Haram apporte du tort',
          'En cas de doute, il vaut mieux éviter',
          'Allah n\'interdit que ce qui nous nuit'
        ]
      },
      {
        heading: 'Catégories en Droit Islamique',
        content: 'La jurisprudence islamique classe les actions en cinq catégories :\n\n1. **Fard/Wajib** - Obligatoire (récompensé si fait, péché si omis)\n2. **Mustahab/Sunnah** - Recommandé (récompensé mais pas péché si omis)\n3. **Mubah** - Permis (neutre)\n4. **Makruh** - Déconseillé (pas péché mais mieux vaut éviter)\n5. **Haram** - Interdit (péché si fait)',
        keyPoints: [
          'La plupart des choses dans la vie sont Mubah (neutres)',
          'Évitez les choses douteuses pour être en sécurité',
          'L\'intention peut changer le jugement d\'une action'
        ]
      }
    ],
    quiz: {
      question: 'Que signifie "Makruh" en jurisprudence islamique ?',
      options: [
        'Obligatoire',
        'Interdit',
        'Déconseillé mais pas péché',
        'Fortement recommandé'
      ],
      correctIndex: 2,
      explanation: 'Makruh désigne les actions qui sont déconseillées et qu\'il vaut mieux éviter, mais qui ne sont pas un péché. C\'est un niveau entre Mubah (neutre) et Haram (interdit).'
    }
  },

  // Module Piliers de l'Islam
  'p1': {
    id: 'p1',
    title: 'Salah : Les Prières Quotidiennes',
    sections: [
      {
        heading: 'Le Deuxième Pilier',
        content: 'La Salah est le deuxième pilier de l\'Islam et l\'acte d\'adoration le plus important après la Shahada. Les musulmans prient cinq fois par jour : Fajr (aube), Dhuhr (midi), Asr (après-midi), Maghrib (coucher du soleil) et Isha (nuit).',
        keyPoints: [
          'La prière a été rendue obligatoire lors du Mi\'raj',
          'Elle maintient la connexion avec Allah',
          'Manquer la prière intentionnellement est un péché majeur'
        ]
      },
      {
        heading: 'Bienfaits de la Prière',
        content: 'La prière régulière offre de nombreux bienfaits spirituels et pratiques :\n\n- **Purification spirituelle** : "La prière est à la foi ce que la tête est au corps"\n- **Discipline** : Cinq horaires créent une structure\n- **Communauté** : La prière en congrégation renforce les liens\n- **Pleine conscience** : Pause régulière pour la réflexion\n- **Santé physique** : Mouvement et prosternation',
        keyPoints: [
          'La prière empêche l\'immoralité',
          'C\'est la première chose jugée le Jour du Jugement',
          'Prier à l\'heure multiplie la récompense'
        ]
      }
    ],
    quiz: {
      question: 'Combien de prières quotidiennes sont obligatoires pour les musulmans ?',
      options: ['Trois', 'Quatre', 'Cinq', 'Sept'],
      correctIndex: 2,
      explanation: 'Les musulmans doivent prier cinq fois par jour : Fajr, Dhuhr, Asr, Maghrib et Isha. Elles ont été prescrites lors du voyage nocturne miraculeux du Prophète (Isra et Mi\'raj).'
    }
  },
  'p2': {
    id: 'p2',
    title: 'Zakah : Purifier la Richesse',
    sections: [
      {
        heading: 'Le Troisième Pilier',
        content: 'La Zakah est la charité obligatoire que chaque musulman éligible doit payer annuellement. Elle équivaut à 2,5% des économies et richesses au-dessus du nisab (seuil minimum) détenues pendant une année lunaire.',
        keyPoints: [
          'La Zakah purifie la richesse et l\'âme',
          'C\'est un droit des pauvres, pas juste une charité',
          'Le Nisab est environ 85g d\'or en valeur'
        ]
      },
      {
        heading: 'Bénéficiaires de la Zakah',
        content: 'Le Coran spécifie huit catégories de bénéficiaires de la Zakah (Sourate At-Tawbah 9:60) :\n\n1. Les Pauvres (Fuqara)\n2. Les Nécessiteux (Masakin)\n3. Les Collecteurs de Zakah\n4. Les Nouveaux Musulmans (Mu\'allafat al-Qulub)\n5. L\'Affranchissement des Esclaves\n6. Les Endettés\n7. Dans le Chemin d\'Allah\n8. Les Voyageurs dans le Besoin',
        keyPoints: [
          'On ne peut donner la Zakah à sa famille directe',
          'Elle doit d\'abord être donnée localement',
          'Calculée sur l\'année lunaire'
        ]
      }
    ],
    quiz: {
      question: 'Quel pourcentage des économies est donné en Zakah ?',
      options: ['1%', '2,5%', '5%', '10%'],
      correctIndex: 1,
      explanation: 'La Zakah est de 2,5% des économies et richesses au-dessus du seuil du nisab détenues pendant une année lunaire. Cela s\'applique à l\'argent, l\'or, l\'argent et l\'inventaire commercial.'
    }
  },
  'p3': {
    id: 'p3',
    title: 'Sawm : Le Jeûne du Ramadan',
    sections: [
      {
        heading: 'Le Quatrième Pilier',
        content: 'Le Sawm (jeûne) pendant le mois de Ramadan est obligatoire pour tous les musulmans adultes capables. Le jeûne consiste à s\'abstenir de nourriture, de boisson et de relations conjugales de l\'aube (Fajr) jusqu\'au coucher du soleil (Maghrib).',
        keyPoints: [
          'Le Ramadan est le 9ème mois du calendrier islamique',
          'Le Coran a été révélé pour la première fois pendant le Ramadan',
          'Le jeûne développe la maîtrise de soi et la taqwa'
        ]
      },
      {
        heading: 'Dimensions Spirituelles',
        content: 'Le jeûne est bien plus que s\'abstenir de nourriture :\n\n- **Taqwa** : Développer la conscience de Dieu\n- **Empathie** : Comprendre la faim des pauvres\n- **Autodiscipline** : Contrôler les désirs\n- **Gratitude** : Apprécier les bienfaits\n- **Communauté** : Rompre le jeûne ensemble\n\nLe Prophète ﷺ a dit : "Quiconque jeûne le Ramadan avec foi et en espérant la récompense, tous ses péchés passés seront pardonnés."',
        keyPoints: [
          'Laylatul Qadr (la Nuit du Destin) est pendant le Ramadan',
          'Les prières de Tarawih sont spéciales au Ramadan',
          'La Fitrah est donnée avant la prière de l\'Aïd'
        ]
      }
    ],
    quiz: {
      question: 'Quel est l\'un des principaux objectifs spirituels du jeûne ?',
      options: [
        'Perdre du poids',
        'Économiser de l\'argent sur la nourriture',
        'Développer la Taqwa (conscience de Dieu)',
        'Tester l\'endurance physique'
      ],
      correctIndex: 2,
      explanation: 'Le Coran déclare que le jeûne est prescrit "afin que vous développiez la Taqwa" (conscience de Dieu). Bien qu\'il puisse y avoir des bienfaits physiques, l\'objectif principal est le développement spirituel.'
    }
  },
  'p4': {
    id: 'p4',
    title: 'Hajj : Le Pèlerinage Sacré',
    sections: [
      {
        heading: 'Le Cinquième Pilier',
        content: 'Le Hajj est le pèlerinage à La Mecque que chaque musulman doit entreprendre au moins une fois dans sa vie s\'il en est physiquement et financièrement capable. Il a lieu pendant le mois islamique de Dhul Hijjah.',
        keyPoints: [
          'Le Hajj commémore les épreuves du Prophète Ibrahim',
          'Environ 2-3 millions de musulmans accomplissent le Hajj chaque année',
          'Il symbolise l\'unité de la Oumma musulmane'
        ]
      },
      {
        heading: 'Rituels du Hajj',
        content: 'Les principaux rituels du Hajj comprennent :\n\n1. **Ihram** : Entrer dans l\'état sacré avec des vêtements spéciaux\n2. **Tawaf** : Circumambuler la Kaaba sept fois\n3. **Sa\'i** : Marcher entre Safa et Marwa\n4. **Wuquf** : Se tenir à Arafat (le rituel le plus important)\n5. **Muzdalifah** : Passer la nuit à collecter des cailloux\n6. **Rami** : Lapider les piliers\n7. **Qurbani** : Sacrifice animal\n8. **Halq/Taqsir** : Se raser ou couper les cheveux',
        keyPoints: [
          'Un Hajj accepté équivaut à une renaissance spirituelle',
          'Le Jour d\'Arafat est le meilleur jour de l\'année',
          'La Omra est le petit pèlerinage'
        ]
      }
    ],
    quiz: {
      question: 'Quel rituel est considéré comme la partie la plus importante du Hajj ?',
      options: [
        'Circumambuler la Kaaba',
        'Se tenir à Arafat',
        'Lapider les piliers',
        'Porter l\'Ihram'
      ],
      correctIndex: 1,
      explanation: 'Le Wuquf (station) à Arafat le 9 de Dhul Hijjah est le rituel le plus important. Le Prophète ﷺ a dit : "Le Hajj, c\'est Arafat." Manquer cela invalide tout le Hajj.'
    }
  },
  'p5': {
    id: 'p5',
    title: 'Vivre les Piliers au Quotidien',
    sections: [
      {
        heading: 'Intégration dans la Vie',
        content: 'Les Cinq Piliers ne sont pas des rituels isolés mais un cadre de vie. Ils doivent s\'intégrer harmonieusement dans la routine quotidienne, apportant structure, but et croissance spirituelle.',
        keyPoints: [
          'Équilibre entre rituel et vie',
          'Chaque pilier renforce les autres',
          'La constance vaut plus que l\'intensité'
        ]
      },
      {
        heading: 'Application Pratique',
        content: 'Façons de vivre les piliers au quotidien :\n\n**Shahada** : Gardez-la dans votre cœur, laissez-la guider vos décisions\n**Salah** : Priez à l\'heure, maintenez le khushu (concentration)\n**Zakah** : Budgétisez pour cela, donnez la Sadaqah régulièrement\n**Sawm** : Jeûnez les jours volontaires (lundis, jeudis)\n**Hajj** : Économisez pour cela, visitez régulièrement la mosquée',
        keyPoints: [
          'Les petites actions constantes sont aimées d\'Allah',
          'Les piliers créent un musulman équilibré',
          'Le soutien communautaire aide à maintenir la pratique'
        ]
      }
    ],
    quiz: {
      question: 'Quel est l\'enseignement du Prophète sur la constance dans l\'adoration ?',
      options: [
        'L\'adoration intense une fois par semaine est meilleure',
        'Les petites actions constantes sont les plus aimées d\'Allah',
        'Seule l\'adoration obligatoire compte',
        'L\'adoration ne devrait être que pendant le Ramadan'
      ],
      correctIndex: 1,
      explanation: 'Le Prophète ﷺ a dit que les actes les plus aimés d\'Allah sont ceux accomplis régulièrement, même s\'ils sont petits. Une pratique régulière et durable est meilleure qu\'une adoration intense sporadique.'
    }
  },

  // Module Seerah
  's1': {
    id: 's1',
    title: 'Avant la Révélation',
    sections: [
      {
        heading: 'L\'Arabie Préislamique',
        content: 'Avant l\'Islam, l\'Arabie était dans un état appelé Jahiliyyah (ignorance). Les tribus adoraient des idoles, les femmes avaient peu de droits, et la société était marquée par les guerres tribales, l\'infanticide et l\'injustice.',
        keyPoints: [
          '360 idoles étaient gardées autour de la Kaaba',
          'La loyauté tribale primait sur la justice',
          'Certains suivaient encore les vestiges de la voie d\'Ibrahim'
        ]
      },
      {
        heading: 'Jeunesse du Prophète',
        content: 'Muhammad ﷺ est né en 570 EC (Année de l\'Éléphant) à La Mecque :\n\n- **Orphelin tôt** : Son père est mort avant sa naissance, sa mère à l\'âge de 6 ans\n- **Élevé par son grand-père** Abdul Muttalib, puis son oncle Abu Talib\n- **Connu comme Al-Amin** : Le Digne de Confiance\n- **Marié à Khadijah** à 25 ans (elle avait 40 ans)\n- **Nature contemplative** : Se retirait souvent dans la grotte de Hira',
        keyPoints: [
          'Son caractère était exemplaire même avant la prophétie',
          'Il n\'a jamais adoré d\'idoles',
          'Khadijah était une femme d\'affaires prospère'
        ]
      }
    ],
    quiz: {
      question: 'Par quel titre le Prophète ﷺ était-il connu avant la prophétie ?',
      options: [
        'Al-Mukhtar (L\'Élu)',
        'Al-Amin (Le Digne de Confiance)',
        'As-Sadiq (Le Véridique)',
        'Al-Hadi (Le Guide)'
      ],
      correctIndex: 1,
      explanation: 'Même avant de recevoir la révélation, le Prophète Muhammad ﷺ était connu comme "Al-Amin" (Le Digne de Confiance) en raison de son exceptionnelle honnêteté et intégrité.'
    }
  },
  's2': {
    id: 's2',
    title: 'La Première Révélation',
    sections: [
      {
        heading: 'Grotte de Hira',
        content: 'À 40 ans, pendant qu\'il méditait dans la grotte de Hira durant le Ramadan, l\'Ange Jibreel apparut à Muhammad ﷺ. Il commanda "Iqra!" (Lis!). Le Prophète ﷺ répondit qu\'il ne savait pas lire. Après trois fois, Jibreel révéla les premiers versets de la Sourate Al-Alaq.',
        keyPoints: [
          'Le premier mot révélé était "Lis"',
          'La connaissance est fondamentale en Islam',
          'L\'expérience était bouleversante'
        ]
      },
      {
        heading: 'La Première Révélation',
        content: '"Lis, au nom de ton Seigneur qui a créé. Il a créé l\'homme d\'une adhérence. Lis, et ton Seigneur est le Très Noble. Qui a enseigné par la plume. A enseigné à l\'homme ce qu\'il ne savait pas." (Coran 96:1-5)\n\nAprès cette expérience, le Prophète ﷺ rentra chez lui en tremblant. Khadijah le réconforta et l\'emmena chez son cousin Waraqah ibn Nawfal, un érudit chrétien, qui confirma qu\'il s\'agissait d\'une révélation divine.',
        keyPoints: [
          'Khadijah fut la première à croire',
          'Waraqah confirma que c\'était le même ange venu à Moïse',
          'Il y eut une pause (Fatra) avant plus de révélations'
        ]
      }
    ],
    quiz: {
      question: 'Quel fut le premier mot révélé au Prophète Muhammad ﷺ ?',
      options: ['Prie', 'Crois', 'Lis', 'Soumets-toi'],
      correctIndex: 2,
      explanation: '"Iqra" (Lis/Récite) fut le premier mot révélé, soulignant l\'importance de la connaissance et de l\'apprentissage en Islam. Cela devint l\'ouverture de la Sourate Al-Alaq.'
    }
  },
  's3': {
    id: 's3',
    title: 'Les Premiers Musulmans',
    sections: [
      {
        heading: 'Premiers Croyants',
        content: 'Les premières personnes à accepter l\'Islam furent :\n\n1. **Khadijah bint Khuwaylid** - Première femme et épouse\n2. **Ali ibn Abi Talib** - Premier enfant (environ 10 ans)\n3. **Zayd ibn Harithah** - Premier esclave affranchi\n4. **Abu Bakr as-Siddiq** - Premier homme adulte libre',
        keyPoints: [
          'L\'Islam primitif était divers dès le début',
          'Abu Bakr amena beaucoup de gens à l\'Islam',
          'Le message se répandit secrètement pendant 3 ans'
        ]
      },
      {
        heading: 'Persécution Précoce',
        content: 'À mesure que le message se répandait, la persécution s\'intensifia :\n\n- **Bilal ibn Rabah** : Torturé en étant placé sous des roches chaudes\n- **Sumayyah** : Première martyre de l\'Islam\n- **Yasir** : Martyrisé aux côtés de son épouse\n- **Boycott social** : Trois ans d\'isolement dans le Shi\'b Abi Talib\n\nLes premiers musulmans endurèrent avec patience, et beaucoup émigrèrent en Abyssinie pour leur sécurité.',
        keyPoints: [
          'Le roi chrétien d\'Abyssinie protégea les musulmans',
          'Les faibles et les pauvres étaient les plus persécutés',
          'La persévérance fut récompensée'
        ]
      }
    ],
    quiz: {
      question: 'Qui fut le premier homme adulte à embrasser l\'Islam ?',
      options: ['Umar ibn al-Khattab', 'Uthman ibn Affan', 'Abu Bakr as-Siddiq', 'Ali ibn Abi Talib'],
      correctIndex: 2,
      explanation: 'Abu Bakr as-Siddiq fut le premier homme adulte libre à accepter l\'Islam. Son amitié proche avec le Prophète ﷺ et son noble caractère firent de lui l\'un des premiers croyants.'
    }
  },
  's4': {
    id: 's4',
    title: 'L\'Hégire',
    sections: [
      {
        heading: 'Migration vers Médine',
        content: 'En 622 EC, après 13 ans de persécution à La Mecque, les musulmans émigrèrent à Yathrib (plus tard appelée Médine). Cet événement, l\'Hégire, marque le début du calendrier islamique. Le Prophète ﷺ fut parmi les derniers à partir.',
        keyPoints: [
          'L\'Hégire fut un tournant pour l\'Islam',
          'Abu Bakr accompagna le Prophète ﷺ',
          'Ils se cachèrent dans la grotte de Thawr pendant trois jours'
        ]
      },
      {
        heading: 'Le Voyage',
        content: 'La migration fut pleine de leçons :\n\n- **Planification** : Ils prirent une route sud pour éviter la capture\n- **Tawakkul** : Confiance en Allah tout en prenant des précautions\n- **Sacrifice** : Quitter maison et famille pour la foi\n- **Fraternité** : Les Ansar accueillirent les Muhajireen comme des frères\n\nLe Prophète ﷺ dit à Abu Bakr dans la grotte : "Ne sois pas triste ; Allah est avec nous." (Coran 9:40)',
        keyPoints: [
          'Ansar signifie Auxiliaires (habitants de Médine)',
          'Muhajireen signifie Émigrés (de La Mecque)',
          'Cette fraternité était sans précédent'
        ]
      }
    ],
    quiz: {
      question: 'Que marque le début de l\'Hégire ?',
      options: [
        'La naissance du Prophète',
        'Le calendrier islamique',
        'Le Ramadan',
        'La révélation'
      ],
      correctIndex: 1,
      explanation: 'L\'Hégire (migration de La Mecque à Médine en 622 EC) marque le début du calendrier islamique. L\'an 1 AH (Après l\'Hégire) commença avec cet événement capital.'
    }
  },
  's5': {
    id: 's5',
    title: 'Construire la Oumma',
    sections: [
      {
        heading: 'Établir Médine',
        content: 'À son arrivée à Médine, le Prophète ﷺ commença immédiatement à construire la communauté musulmane :\n\n1. **Masjid an-Nabawi** : La mosquée du Prophète fut construite en premier\n2. **Constitution de Médine** : Un contrat social pour tous les résidents\n3. **Liens de fraternité** : Jumeler Muhajireen et Ansar\n4. **Réglementations commerciales** : Pratiques de commerce équitable',
        keyPoints: [
          'La mosquée était le centre communautaire',
          'Les juifs et autres étaient inclus dans la constitution',
          'L\'équité économique fut établie'
        ]
      },
      {
        heading: 'La Constitution',
        content: 'La Constitution de Médine fut un document révolutionnaire :\n\n- **Liberté religieuse** : Tous pouvaient pratiquer leur foi\n- **Défense mutuelle** : Tous défendraient Médine\n- **Justice** : Droits égaux pour les litiges\n- **Identité communautaire** : Une Oumma avec diversité\n\nCe fut l\'une des premières constitutions écrites de l\'histoire, établissant droits et responsabilités pour tous les citoyens.',
        keyPoints: [
          'Elle précéda la Magna Carta de 600 ans',
          'Elle protégeait les droits des minorités',
          'Elle établissait l\'état de droit'
        ]
      }
    ],
    quiz: {
      question: 'Quelle fut la première structure construite à l\'arrivée à Médine ?',
      options: [
        'Une forteresse',
        'Un marché',
        'Une mosquée',
        'Un hôpital'
      ],
      correctIndex: 2,
      explanation: 'Le Masjid an-Nabawi (La Mosquée du Prophète) fut la première structure construite, soulignant que la mosquée est le centre de la vie communautaire musulmane, servant de lieu de culte, d\'éducation et de rassemblement.'
    }
  },
  's6': {
    id: 's6',
    title: 'La Conquête de La Mecque',
    sections: [
      {
        heading: 'Fathu Makkah',
        content: 'En 630 EC (8 AH), après que les Quraysh eurent rompu le Traité de Hudaybiyyah, le Prophète ﷺ marcha vers La Mecque avec 10 000 musulmans. La ville fut prise pacifiquement avec une résistance minimale.',
        keyPoints: [
          'Seulement 8 ans après l\'Hégire',
          'La plupart des Mecquois acceptèrent l\'Islam',
          'Elle fut largement sans effusion de sang'
        ]
      },
      {
        heading: 'La Miséricorde du Prophète',
        content: 'En conquérant La Mecque, le Prophète ﷺ montra une miséricorde sans précédent :\n\n- **Amnistie générale** : "Allez, vous êtes libres"\n- **Pas de vengeance** : Pour des années de persécution\n- **360 idoles détruites** : La Kaaba fut purifiée\n- **L\'Adhan de Bilal** : L\'ancien esclave appela à la prière depuis la Kaaba\n\nCe pardon est un modèle pour toute l\'humanité. Même ses pires ennemis furent pardonnés.',
        keyPoints: [
          'Les mêmes personnes qui persécutèrent les musulmans furent pardonnées',
          'L\'Islam se répandit rapidement après cela',
          'La miséricorde plutôt que la vengeance fut démontrée'
        ]
      }
    ],
    quiz: {
      question: 'Qu\'a dit le Prophète ﷺ aux Mecquois après la conquête ?',
      options: [
        '"Vous serez punis pour vos crimes"',
        '"Payez une compensation pour nos souffrances"',
        '"Allez, vous êtes libres"',
        '"Quittez cette ville pour toujours"'
      ],
      correctIndex: 2,
      explanation: 'Le Prophète ﷺ montra une miséricorde remarquable, déclarant une amnistie générale avec les mots "Allez, vous êtes libres", pardonnant ceux qui l\'avaient persécuté lui et les musulmans pendant plus de 20 ans.'
    }
  },
  's7': {
    id: 's7',
    title: 'Le Sermon d\'Adieu',
    sections: [
      {
        heading: 'Le Dernier Pèlerinage',
        content: 'En 632 EC, le Prophète ﷺ accomplit son premier et unique Hajj, connu sous le nom de Hajjatul Wada (Le Pèlerinage d\'Adieu). Plus de 100 000 musulmans l\'accompagnèrent.',
        keyPoints: [
          'Ce fut le seul Hajj du Prophète ﷺ',
          'Il enseigna tous les rituels du Hajj',
          'Il prononça son dernier sermon majeur'
        ]
      },
      {
        heading: 'Messages Clés',
        content: 'Le Sermon d\'Adieu contenait des principes intemporels :\n\n- **Égalité** : "Aucun Arabe n\'a de supériorité sur un non-Arabe sauf par la piété"\n- **Droits de l\'homme** : "Votre sang et vos biens sont sacrés"\n- **Droits des femmes** : "Traitez les femmes avec bonté"\n- **Justice économique** : "Toute usure est abolie"\n- **Unité** : "Vous venez tous d\'Adam, et Adam venait de la poussière"\n\nLe Prophète ﷺ demanda : "Ai-je transmis le message?" La foule répondit : "Oui!" Il dit : "Ô Allah, sois mon témoin."',
        keyPoints: [
          'Ces principes étaient révolutionnaires pour l\'époque',
          'Le message était complet',
          'Le Prophète ﷺ mourut 3 mois plus tard'
        ]
      }
    ],
    quiz: {
      question: 'Qu\'a dit le Prophète ﷺ sur la supériorité entre les gens ?',
      options: [
        'Les Arabes sont supérieurs',
        'Les riches sont supérieurs',
        'Les savants sont supérieurs',
        'Personne n\'est supérieur sauf par la piété'
      ],
      correctIndex: 3,
      explanation: 'Le Prophète ﷺ déclara : "Aucun Arabe n\'a de supériorité sur un non-Arabe, ni un non-Arabe sur un Arabe — sauf par la piété et les bonnes actions."'
    }
  },
  's8': {
    id: 's8',
    title: 'Héritage et Caractère',
    sections: [
      {
        heading: 'Son Caractère',
        content: 'Le Prophète ﷺ fut décrit par Allah comme ayant "un caractère éminent" (Coran 68:4). Son épouse Aisha dit : "Son caractère était le Coran."\n\nTraits clés :\n- **Véracité** : N\'a jamais menti, même à ses ennemis\n- **Humilité** : Raccommodait ses propres vêtements, servait les autres\n- **Compassion** : Bon avec les enfants, les animaux, tous\n- **Patience** : Endurait les épreuves sans se plaindre\n- **Générosité** : Donnait librement, ne refusait jamais personne',
        keyPoints: [
          'Il était l\'exemple vivant du Coran',
          'Son caractère attirait les gens vers l\'Islam',
          'Il traitait tout le monde avec respect'
        ]
      },
      {
        heading: 'Son Héritage',
        content: 'Le Prophète ﷺ transforma le monde :\n\n- **1,8 milliard de musulmans** suivent son exemple aujourd\'hui\n- **Droits établis** : Pour les femmes, les enfants, les travailleurs, les animaux\n- **Éducation** : Rendit la quête du savoir obligatoire\n- **Réforme sociale** : Mis fin au racisme, à la discrimination de classe\n- **Guidance spirituelle** : Un mode de vie complet\n\nLe Prophète ﷺ a dit : "J\'ai été envoyé pour parfaire le bon caractère." Suivre sa Sunnah, c\'est suivre le meilleur exemple pour l\'humanité.',
        keyPoints: [
          'Son influence continue 1400 ans plus tard',
          'Les érudits non-musulmans reconnaissent son impact',
          'Son exemple est destiné à tous les temps'
        ]
      }
    ],
    quiz: {
      question: 'Qu\'a dit Aisha sur le caractère du Prophète ?',
      options: [
        '"Il était parfait en apparence"',
        '"Son caractère était le Coran"',
        '"Il était le plus riche"',
        '"Il était le plus puissant"'
      ],
      correctIndex: 1,
      explanation: 'Quand on lui demanda le caractère du Prophète, Aisha dit : "Son caractère était le Coran." Cela signifie qu\'il incarnait parfaitement tous les enseignements, la morale et les conseils du Coran dans sa vie quotidienne.'
    }
  },

  // Module Finance Halal
  'f1': {
    id: 'f1',
    title: 'Riba : Comprendre l\'Intérêt',
    sections: [
      {
        heading: 'Qu\'est-ce que le Riba ?',
        content: 'Riba signifie littéralement "augmentation" ou "excès". En finance islamique, cela désigne la pratique interdite de charger des intérêts sur les prêts. Allah a déclaré la guerre contre ceux qui pratiquent le Riba (Coran 2:279).',
        keyPoints: [
          'Le Riba est mentionné comme un péché majeur',
          'Il crée de l\'argent à partir de l\'argent sans valeur',
          'Il exploite ceux dans le besoin financier'
        ]
      },
      {
        heading: 'Pourquoi le Riba est-il Interdit ?',
        content: 'L\'Islam interdit l\'intérêt parce que :\n\n1. **Exploitation** : Il profite des nécessiteux\n2. **Déséquilibre des risques** : Le prêteur ne prend aucun risque\n3. **Tort économique** : Mène à la concentration des richesses\n4. **Tort social** : Augmente les inégalités\n5. **Tort moral** : Encourage la cupidité plutôt que l\'empathie\n\nDes alternatives comme la Musharakah (partenariat) et la Murabaha (financement coût-plus) partagent le risque et créent une valeur réelle.',
        keyPoints: [
          'La banque islamique offre des alternatives',
          'Le partage des risques est le principe clé',
          'Le profit du commerce est halal'
        ]
      }
    ],
    quiz: {
      question: 'Quel est le principal problème avec le Riba selon l\'Islam ?',
      options: [
        'C\'est trop compliqué',
        'Il crée de l\'argent sans valeur et exploite les nécessiteux',
        'C\'est trop moderne',
        'Seules les banques peuvent l\'utiliser'
      ],
      correctIndex: 1,
      explanation: 'Le Riba crée "de l\'argent à partir de l\'argent" sans créer de valeur réelle, et il exploite ceux qui sont déjà en difficulté financière. Le prêteur profite indépendamment du succès ou de l\'échec de l\'emprunteur.'
    }
  },
  'f2': {
    id: 'f2',
    title: 'Investissements Halal',
    sections: [
      {
        heading: 'Principes de l\'Investissement Halal',
        content: 'Les investissements islamiques doivent suivre des principes clés :\n\n1. **Pas de Riba** : Éviter les investissements basés sur l\'intérêt\n2. **Pas de Gharar** : Éviter l\'incertitude excessive/le jeu\n3. **Secteurs éthiques** : Pas d\'alcool, jeux de hasard, porc, armes\n4. **Actifs réels** : Les investissements doivent être adossés à des actifs\n5. **Risque partagé** : Partage des profits et pertes',
        keyPoints: [
          'Des critères de sélection existent pour les actions',
          'Les Sukuk sont des obligations islamiques',
          'L\'immobilier est généralement halal'
        ]
      },
      {
        heading: 'Options d\'Investissement Halal',
        content: 'Options pour l\'investissement halal incluent :\n\n- **Actions halal** : Entreprises passant le filtrage Shariah\n- **Sukuk** : Obligations islamiques adossées à des actifs\n- **Immobilier** : Investissement immobilier et SCPI\n- **Fonds communs islamiques** : Portefeuilles gérés professionnellement\n- **Or et métaux précieux** : Actifs tangibles\n- **Partenariats commerciaux** : Investissements Musharakah',
        keyPoints: [
          'Beaucoup d\'applications offrent maintenant l\'investissement halal',
          'Des savants examinent les investissements pour la conformité',
          'La purification des rendements peut être nécessaire'
        ]
      }
    ],
    quiz: {
      question: 'Quel investissement est généralement considéré comme halal ?',
      options: [
        'Compte d\'épargne avec intérêts',
        'Actions de casino',
        'Immobilier',
        'Obligations conventionnelles'
      ],
      correctIndex: 2,
      explanation: 'L\'immobilier est généralement considéré comme halal car il implique des actifs tangibles et n\'implique pas intrinsèquement d\'intérêt ou de secteurs interdits. Cependant, le financement doit aussi être conforme à la Shariah.'
    }
  },
  'f3': {
    id: 'f3',
    title: 'Banque Islamique',
    sections: [
      {
        heading: 'Comment Fonctionnent les Banques Islamiques',
        content: 'Les banques islamiques opèrent sur le principe du partage des profits et pertes plutôt que sur l\'intérêt. Elles utilisent divers contrats conformes à la loi Shariah tout en fournissant des services similaires aux banques conventionnelles.',
        keyPoints: [
          'Aucun intérêt n\'est chargé ou payé',
          'Le risque est partagé entre les parties',
          'Un comité Shariah supervise la conformité'
        ]
      },
      {
        heading: 'Contrats Islamiques Courants',
        content: 'Principaux contrats bancaires islamiques :\n\n- **Murabaha** : Financement coût-plus (la banque achète et revend avec profit)\n- **Ijara** : Location (similaire à la location-vente)\n- **Musharakah** : Partenariat avec profits/pertes partagés\n- **Mudarabah** : Partenariat d\'investissement\n- **Sukuk** : Certificats adossés à des actifs\n- **Takaful** : Assurance islamique (protection mutuelle)',
        keyPoints: [
          'Chaque contrat a des règles spécifiques',
          'La transparence des prix est requise',
          'De vraies transactions doivent avoir lieu'
        ]
      }
    ],
    quiz: {
      question: 'Qu\'est-ce que la Murabaha ?',
      options: [
        'Assurance islamique',
        'Financement coût-plus où la banque achète et vend avec profit',
        'Un type d\'intérêt',
        'Un fonds de charité'
      ],
      correctIndex: 1,
      explanation: 'La Murabaha est un contrat basé sur la vente où la banque achète un actif et le vend au client avec une marge de profit déclarée. Le profit est halal car il provient d\'une vraie transaction commerciale.'
    }
  },
  'f4': {
    id: 'f4',
    title: 'Calculs de la Zakah',
    sections: [
      {
        heading: 'Comprendre la Richesse Zakatable',
        content: 'La Zakah est calculée sur la richesse qui :\n\n1. **Atteint le Nisab** : Seuil minimum (85g d\'or ou 595g d\'argent)\n2. **Détenue pendant une année lunaire** : La période du hawl\n3. **En excès des besoins de base** : Au-dessus des dépenses courantes\n4. **Est productive** : Espèces, or, inventaire commercial, etc.',
        keyPoints: [
          'Le Nisab est environ 5 000-7 000€ selon les prix de l\'or/argent',
          'Les produits agricoles ont des règles différentes',
          'Le bétail a des calculs spécifiques'
        ]
      },
      {
        heading: 'Comment Calculer',
        content: 'Étapes pour calculer la Zakah :\n\n1. **Lister les actifs** : Espèces, or, argent, investissements, inventaire commercial\n2. **Soustraire les dettes** : Prêts et passifs\n3. **Vérifier le Nisab** : Le total est-il au-dessus du seuil ?\n4. **Calculer 2,5%** : C\'est votre Zakah due\n\nExemple : 20 000€ d\'économies - 5 000€ de dette = 15 000€ × 2,5% = 375€ de Zakah',
        keyPoints: [
          'Calculez à la date anniversaire de votre Zakah',
          'Donnez aux bénéficiaires éligibles',
          'Gardez une trace de ce que vous avez payé'
        ]
      }
    ],
    quiz: {
      question: 'Quel pourcentage de la richesse au-dessus du nisab est donné en Zakah ?',
      options: ['1%', '2,5%', '5%', '10%'],
      correctIndex: 1,
      explanation: 'La Zakah est de 2,5% de la richesse au-dessus du seuil du nisab détenue pendant une année lunaire. Cela s\'applique aux espèces, à l\'or, à l\'argent, aux investissements et à l\'inventaire commercial.'
    }
  },
  'f5': {
    id: 'f5',
    title: 'Éthique des Affaires',
    sections: [
      {
        heading: 'Principes Islamiques des Affaires',
        content: 'L\'Islam encourage le commerce et les affaires avec des principes éthiques :\n\n1. **Honnêteté** : Divulgation complète de l\'état des produits\n2. **Prix équitables** : Pas d\'exploitation ou de prix abusifs\n3. **Contrats clairs** : Tous les termes explicitement énoncés\n4. **Pas de tromperie** : "Quiconque triche n\'est pas des nôtres" (Hadith)\n5. **Qualité** : Livrer ce qui est promis',
        keyPoints: [
          'Le Prophète ﷺ était un commerçant prospère',
          'Le commerce est honorable en Islam',
          'La fiabilité est essentielle'
        ]
      },
      {
        heading: 'Pratiques Interdites',
        content: 'Pratiques interdites dans les affaires islamiques :\n\n- **Gharar** : Incertitude excessive dans les contrats\n- **Riba** : Intérêt sous toute forme\n- **Stockage** : Créer artificiellement la rareté\n- **Monopole** : Contrôler les marchés injustement\n- **Corruption** : Pots-de-vin dans les transactions\n- **Fraude** : Fausse représentation des biens',
        keyPoints: [
          'L\'éthique mène à la barakah (bénédiction)',
          'Les gains à court terme du haram sont maudits',
          'Le commerce équitable construit un succès durable'
        ]
      }
    ],
    quiz: {
      question: 'Qu\'a dit le Prophète ﷺ sur la triche en affaires ?',
      options: [
        '"La triche est parfois nécessaire"',
        '"Quiconque triche n\'est pas des nôtres"',
        '"La triche est un péché mineur"',
        '"Les affaires n\'ont pas d\'éthique"'
      ],
      correctIndex: 1,
      explanation: 'Le Prophète ﷺ a dit : "Quiconque triche n\'est pas des nôtres." Cette déclaration forte montre que la malhonnêteté en affaires est complètement contraire aux valeurs islamiques et place une personne en dehors de la communauté musulmane éthiquement.'
    }
  },
  'f6': {
    id: 'f6',
    title: 'Richesse et Contentement',
    sections: [
      {
        heading: 'Vision Islamique de la Richesse',
        content: 'L\'Islam voit la richesse comme un dépôt (amanah) d\'Allah. Être riche n\'est pas intrinsèquement bon ou mauvais — ce qui compte c\'est comment la richesse est gagnée et utilisée.\n\n"Les biens et les enfants sont l\'ornement de la vie d\'ici-bas, mais les bonnes œuvres qui perdurent sont meilleures auprès de ton Seigneur." (Coran 18:46)',
        keyPoints: [
          'La richesse est une épreuve d\'Allah',
          'La gratitude est requise pour les bienfaits',
          'Dépenser pour les autres apporte la barakah'
        ]
      },
      {
        heading: 'La Vraie Richesse',
        content: 'Le Prophète ﷺ a dit : "La vraie richesse n\'est pas d\'avoir beaucoup de possessions. Plutôt, la vraie richesse est la richesse de l\'âme (le contentement)."\n\nPrincipes pour le contentement :\n\n- **Regardez ceux qui ont moins** : Appréciez vos bénédictions\n- **Évitez l\'excès** : Modération en toutes choses\n- **Donnez régulièrement** : La charité purifie et augmente la richesse\n- **Faites confiance à Allah** : Le Rizq (provision) est garanti\n- **Équilibrez dunya et akhirah** : Ce monde est temporaire',
        keyPoints: [
          'Le contentement est un trésor',
          'La cupidité mène à la misère',
          'La vie simple peut être riche'
        ]
      }
    ],
    quiz: {
      question: 'Selon le Prophète ﷺ, qu\'est-ce que la vraie richesse ?',
      options: [
        'Avoir beaucoup de possessions',
        'Être célèbre',
        'La richesse de l\'âme (le contentement)',
        'Avoir une grande maison'
      ],
      correctIndex: 2,
      explanation: 'Le Prophète ﷺ a enseigné que la vraie richesse est "la richesse de l\'âme" (ghinan-nafs), signifiant le contentement et la satisfaction avec ce qu\'Allah a fourni, plutôt que l\'accumulation de possessions matérielles.'
    }
  }
};
