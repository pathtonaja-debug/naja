// Full lesson content for the Learn page modules

export interface LessonContent {
  id: string;
  title: string;
  sections: {
    heading: string;
    content: string;
    keyPoints?: string[];
  }[];
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export const LESSON_CONTENT: Record<string, LessonContent> = {
  // Islamic Basics Module
  'b1': {
    id: 'b1',
    title: 'The Five Pillars of Islam',
    sections: [
      {
        heading: 'Foundation of Faith',
        content: 'The Five Pillars of Islam are the core practices that every Muslim must fulfill. They serve as the framework for a Muslim\'s life and worship, establishing the relationship between the believer and Allah.',
        keyPoints: [
          'They were established by Prophet Muhammad ﷺ',
          'They unite all Muslims worldwide',
          'Each pillar builds upon the others'
        ]
      },
      {
        heading: 'The Five Pillars',
        content: '1. **Shahada** (Declaration of Faith) - Declaring that there is no god but Allah and Muhammad is His messenger.\n\n2. **Salah** (Prayer) - Performing the five daily prayers.\n\n3. **Zakah** (Almsgiving) - Giving 2.5% of savings to those in need.\n\n4. **Sawm** (Fasting) - Fasting during the month of Ramadan.\n\n5. **Hajj** (Pilgrimage) - Making the pilgrimage to Makkah at least once if able.',
        keyPoints: [
          'All pillars are obligatory for Muslims',
          'They balance spiritual and social responsibilities',
          'Consistent practice strengthens faith'
        ]
      }
    ],
    quiz: {
      question: 'Which of the following is NOT one of the Five Pillars of Islam?',
      options: ['Salah (Prayer)', 'Jihad (Struggle)', 'Sawm (Fasting)', 'Zakah (Charity)'],
      correctIndex: 1,
      explanation: 'Jihad, while an important concept in Islam referring to the struggle for faith, is not one of the Five Pillars. The Five Pillars are Shahada, Salah, Zakah, Sawm, and Hajj.'
    }
  },
  'b2': {
    id: 'b2',
    title: 'Shahada: Declaration of Faith',
    sections: [
      {
        heading: 'The First Pillar',
        content: 'The Shahada is the Islamic declaration of faith: "Ash-hadu an la ilaha illa Allah, wa ash-hadu anna Muhammadan rasul Allah" (I bear witness that there is no god but Allah, and I bear witness that Muhammad is the messenger of Allah).',
        keyPoints: [
          'It is the first step to becoming Muslim',
          'Said sincerely, it enters a person into Islam',
          'It consists of two testimonies'
        ]
      },
      {
        heading: 'Deep Meaning',
        content: 'The Shahada affirms **Tawhid** (the Oneness of Allah) and the prophethood of Muhammad ﷺ. By declaring it, a Muslim acknowledges:\n\n- Allah alone deserves worship\n- Muhammad ﷺ is the final messenger\n- Complete submission to Allah\'s will\n- Following the Sunnah of the Prophet ﷺ',
        keyPoints: [
          'Tawhid is the foundation of Islamic belief',
          'The Prophet ﷺ is the example for all Muslims',
          'Shahada must be declared with sincere belief'
        ]
      }
    ],
    quiz: {
      question: 'What two testimonies does the Shahada consist of?',
      options: [
        'Belief in Allah and the Quran',
        'Belief in Allah\'s oneness and Muhammad\'s prophethood',
        'Belief in prayer and fasting',
        'Belief in angels and the Day of Judgment'
      ],
      correctIndex: 1,
      explanation: 'The Shahada consists of two testimonies: the belief in the Oneness of Allah (Tawhid) and the belief that Muhammad ﷺ is His final messenger.'
    }
  },
  'b3': {
    id: 'b3',
    title: 'Importance of Niyyah (Intention)',
    sections: [
      {
        heading: 'What is Niyyah?',
        content: 'Niyyah (نية) means intention in Arabic. In Islam, the intention behind every action determines its value and acceptance by Allah. The Prophet ﷺ said: "Actions are but by intentions, and every person will have only what they intended."',
        keyPoints: [
          'Intention must be for the sake of Allah',
          'It distinguishes worship from habit',
          'Niyyah is made in the heart, not spoken aloud'
        ]
      },
      {
        heading: 'Niyyah in Practice',
        content: 'Before every act of worship, a Muslim should have a clear intention:\n\n- **Prayer**: Intending to pray the specific prayer for Allah\n- **Fasting**: Intending to fast for the sake of Allah\n- **Charity**: Giving with the intention to please Allah\n- **Good deeds**: Every action can become worship with proper intention',
        keyPoints: [
          'Even eating and sleeping can be worship with right intention',
          'Insincere intentions invalidate worship',
          'Renew intentions regularly throughout the day'
        ]
      }
    ],
    quiz: {
      question: 'According to the hadith, what determines the value of actions?',
      options: [
        'The amount of effort put in',
        'How others perceive the action',
        'The intention behind the action',
        'The result of the action'
      ],
      correctIndex: 2,
      explanation: 'The Prophet ﷺ taught that "Actions are but by intentions." The sincerity and purpose behind an action is what gives it value in the sight of Allah.'
    }
  },
  'b4': {
    id: 'b4',
    title: 'The Six Articles of Faith',
    sections: [
      {
        heading: 'Iman (Faith)',
        content: 'Iman refers to the belief system of a Muslim. While the Five Pillars are about actions, the Six Articles of Faith are about beliefs. They form the foundation of what every Muslim must believe.',
        keyPoints: [
          'Iman means faith and belief',
          'These beliefs are mentioned in the Quran',
          'Denying any article takes one outside Islam'
        ]
      },
      {
        heading: 'The Six Articles',
        content: '1. **Belief in Allah** - The One true God, Creator of all\n\n2. **Belief in Angels** - Created from light, they carry out Allah\'s commands\n\n3. **Belief in the Books** - Including the Quran, Torah, Psalms, and Gospel\n\n4. **Belief in the Prophets** - From Adam to Muhammad ﷺ\n\n5. **Belief in the Day of Judgment** - Accountability for all deeds\n\n6. **Belief in Qadr** - Divine decree and predestination',
        keyPoints: [
          'All articles are interconnected',
          'The Quran is the final unchanged book',
          'Muhammad ﷺ is the seal of the prophets'
        ]
      }
    ],
    quiz: {
      question: 'Which of the following is one of the Six Articles of Faith?',
      options: [
        'Belief in the Five Daily Prayers',
        'Belief in Fasting',
        'Belief in Divine Decree (Qadr)',
        'Belief in Hajj'
      ],
      correctIndex: 2,
      explanation: 'Belief in Qadr (Divine Decree) is one of the Six Articles of Faith. The Five Pillars (Prayer, Fasting, Hajj) are about actions, while the Articles of Faith are about beliefs.'
    }
  },
  'b5': {
    id: 'b5',
    title: 'Halal & Haram Basics',
    sections: [
      {
        heading: 'Understanding Halal and Haram',
        content: 'Halal (حلال) means permissible, while Haram (حرام) means forbidden. These terms apply to all aspects of Muslim life including food, business, relationships, and daily conduct.',
        keyPoints: [
          'Halal brings blessings, Haram brings harm',
          'When in doubt, it\'s best to avoid',
          'Allah forbids only what harms us'
        ]
      },
      {
        heading: 'Categories in Islamic Law',
        content: 'Islamic jurisprudence classifies actions into five categories:\n\n1. **Fard/Wajib** - Obligatory (rewarded for doing, sinful for leaving)\n2. **Mustahab/Sunnah** - Recommended (rewarded but not sinful to leave)\n3. **Mubah** - Permissible (neutral)\n4. **Makruh** - Disliked (not sinful but better to avoid)\n5. **Haram** - Forbidden (sinful to do)',
        keyPoints: [
          'Most things in life are Mubah (neutral)',
          'Avoid doubtful matters to be safe',
          'Intention can change the ruling of an action'
        ]
      }
    ],
    quiz: {
      question: 'What does "Makruh" mean in Islamic jurisprudence?',
      options: [
        'Obligatory',
        'Forbidden',
        'Disliked but not sinful',
        'Highly recommended'
      ],
      correctIndex: 2,
      explanation: 'Makruh refers to actions that are disliked and better to avoid, but not sinful. It\'s a level between Mubah (neutral) and Haram (forbidden).'
    }
  },

  // Pillars of Islam Module
  'p1': {
    id: 'p1',
    title: 'Salah: The Daily Prayers',
    sections: [
      {
        heading: 'The Second Pillar',
        content: 'Salah is the second pillar of Islam and the most important act of worship after the Shahada. Muslims pray five times a day: Fajr (dawn), Dhuhr (noon), Asr (afternoon), Maghrib (sunset), and Isha (night).',
        keyPoints: [
          'Prayer was made obligatory during Mi\'raj',
          'It maintains connection with Allah',
          'Missing prayer intentionally is a major sin'
        ]
      },
      {
        heading: 'Benefits of Prayer',
        content: 'Regular prayer provides numerous spiritual and practical benefits:\n\n- **Spiritual purification**: "Prayer is to faith what the head is to the body"\n- **Discipline**: Five scheduled times create structure\n- **Community**: Congregational prayer builds bonds\n- **Mindfulness**: Regular pause for reflection\n- **Physical health**: Movement and prostration',
        keyPoints: [
          'Prayer prevents from immorality',
          'It\'s the first thing judged on Day of Judgment',
          'Praying on time multiplies the reward'
        ]
      }
    ],
    quiz: {
      question: 'How many daily prayers are obligatory for Muslims?',
      options: ['Three', 'Four', 'Five', 'Seven'],
      correctIndex: 2,
      explanation: 'Muslims are required to pray five times daily: Fajr, Dhuhr, Asr, Maghrib, and Isha. These were prescribed during the Prophet\'s miraculous night journey (Isra and Mi\'raj).'
    }
  },
  'p2': {
    id: 'p2',
    title: 'Zakah: Purifying Wealth',
    sections: [
      {
        heading: 'The Third Pillar',
        content: 'Zakah is the obligatory charity that every eligible Muslim must pay annually. It equals 2.5% of savings and wealth above the nisab (minimum threshold) that has been held for one lunar year.',
        keyPoints: [
          'Zakah purifies wealth and soul',
          'It\'s a right of the poor, not just charity',
          'Nisab is approximately 85g of gold value'
        ]
      },
      {
        heading: 'Recipients of Zakah',
        content: 'The Quran specifies eight categories of Zakah recipients (Surah At-Tawbah 9:60):\n\n1. The Poor (Fuqara)\n2. The Needy (Masakin)\n3. Zakah Collectors\n4. New Muslims (Mu\'allafat al-Qulub)\n5. Freeing Slaves\n6. Those in Debt\n7. In the Cause of Allah\n8. Travelers in Need',
        keyPoints: [
          'Cannot give Zakah to direct family',
          'Should be given locally first',
          'Calculated on lunar year'
        ]
      }
    ],
    quiz: {
      question: 'What percentage of savings is given as Zakah?',
      options: ['1%', '2.5%', '5%', '10%'],
      correctIndex: 1,
      explanation: 'Zakah is 2.5% of savings and wealth above the nisab threshold that has been held for one lunar year. This applies to money, gold, silver, and business inventory.'
    }
  },
  'p3': {
    id: 'p3',
    title: 'Sawm: Fasting in Ramadan',
    sections: [
      {
        heading: 'The Fourth Pillar',
        content: 'Sawm (fasting) during the month of Ramadan is obligatory for all adult Muslims who are able. Fasting involves abstaining from food, drink, and marital relations from dawn (Fajr) until sunset (Maghrib).',
        keyPoints: [
          'Ramadan is the 9th month of Islamic calendar',
          'Quran was first revealed in Ramadan',
          'Fasting develops self-control and taqwa'
        ]
      },
      {
        heading: 'Spiritual Dimensions',
        content: 'Fasting is much more than abstaining from food:\n\n- **Taqwa**: Developing God-consciousness\n- **Empathy**: Understanding the hunger of the poor\n- **Self-discipline**: Controlling desires\n- **Gratitude**: Appreciating blessings\n- **Community**: Breaking fast together\n\nThe Prophet ﷺ said: "Whoever fasts Ramadan with faith and seeking reward, all his previous sins will be forgiven."',
        keyPoints: [
          'Laylatul Qadr (Night of Power) is in Ramadan',
          'Tarawih prayers are special to Ramadan',
          'Fitrah is given before Eid prayer'
        ]
      }
    ],
    quiz: {
      question: 'What is one of the main spiritual goals of fasting?',
      options: [
        'Losing weight',
        'Saving money on food',
        'Developing Taqwa (God-consciousness)',
        'Testing physical endurance'
      ],
      correctIndex: 2,
      explanation: 'The Quran states that fasting is prescribed "so that you may develop Taqwa" (God-consciousness). While there may be physical benefits, the primary purpose is spiritual development.'
    }
  },
  'p4': {
    id: 'p4',
    title: 'Hajj: The Sacred Pilgrimage',
    sections: [
      {
        heading: 'The Fifth Pillar',
        content: 'Hajj is the pilgrimage to Makkah that every Muslim must undertake at least once in their lifetime if they are physically and financially able. It takes place during the Islamic month of Dhul Hijjah.',
        keyPoints: [
          'Hajj commemorates Prophet Ibrahim\'s trials',
          'Around 2-3 million Muslims perform Hajj annually',
          'It symbolizes unity of the Muslim Ummah'
        ]
      },
      {
        heading: 'Rituals of Hajj',
        content: 'The main rituals of Hajj include:\n\n1. **Ihram**: Entering sacred state with special clothing\n2. **Tawaf**: Circling the Kaaba seven times\n3. **Sa\'i**: Walking between Safa and Marwa\n4. **Wuquf**: Standing at Arafat (the most important ritual)\n5. **Muzdalifah**: Spending the night collecting pebbles\n6. **Rami**: Stoning the pillars\n7. **Qurbani**: Animal sacrifice\n8. **Halq/Taqsir**: Shaving or trimming hair',
        keyPoints: [
          'Accepted Hajj equals a spiritual rebirth',
          'The Day of Arafat is the best day of the year',
          'Umrah is the lesser pilgrimage'
        ]
      }
    ],
    quiz: {
      question: 'Which ritual is considered the most important part of Hajj?',
      options: [
        'Circling the Kaaba',
        'Standing at Arafat',
        'Stoning the pillars',
        'Wearing Ihram'
      ],
      correctIndex: 1,
      explanation: 'Wuquf (standing) at Arafat on the 9th of Dhul Hijjah is the most important ritual. The Prophet ﷺ said: "Hajj is Arafat." Missing this invalidates the entire Hajj.'
    }
  },
  'p5': {
    id: 'p5',
    title: 'Living the Pillars Daily',
    sections: [
      {
        heading: 'Integration into Life',
        content: 'The Five Pillars are not isolated rituals but a framework for life. They should integrate seamlessly into daily routine, providing structure, purpose, and spiritual growth.',
        keyPoints: [
          'Balance between ritual and living',
          'Each pillar reinforces the others',
          'Consistency is more valuable than intensity'
        ]
      },
      {
        heading: 'Practical Application',
        content: 'Ways to live the pillars daily:\n\n**Shahada**: Remember it in your heart, let it guide decisions\n**Salah**: Pray on time, maintain khushu (focus)\n**Zakah**: Budget for it, give Sadaqah regularly\n**Sawm**: Fast voluntary days (Mondays, Thursdays)\n**Hajj**: Save for it, visit the mosque regularly',
        keyPoints: [
          'Small consistent deeds are beloved to Allah',
          'The pillars create a balanced Muslim',
          'Community support helps maintain practice'
        ]
      }
    ],
    quiz: {
      question: 'What is the Prophet\'s teaching about consistency in worship?',
      options: [
        'Intense worship once a week is best',
        'Small consistent deeds are most beloved to Allah',
        'Only obligatory worship counts',
        'Worship should only be during Ramadan'
      ],
      correctIndex: 1,
      explanation: 'The Prophet ﷺ said that the most beloved deeds to Allah are those done consistently, even if they are small. Regular, sustainable practice is better than sporadic intense worship.'
    }
  },

  // Seerah Module
  's1': {
    id: 's1',
    title: 'Before the Revelation',
    sections: [
      {
        heading: 'Pre-Islamic Arabia',
        content: 'Before Islam, Arabia was in a state called Jahiliyyah (ignorance). Tribes worshipped idols, women had few rights, and society was marked by tribal warfare, infanticide, and injustice.',
        keyPoints: [
          '360 idols were kept around the Kaaba',
          'Tribal loyalty trumped justice',
          'Some still followed remnants of Ibrahim\'s way'
        ]
      },
      {
        heading: 'The Prophet\'s Early Life',
        content: 'Muhammad ﷺ was born in 570 CE (Year of the Elephant) in Makkah:\n\n- **Orphaned early**: Father died before birth, mother at age 6\n- **Raised by grandfather** Abdul Muttalib, then uncle Abu Talib\n- **Known as Al-Amin**: The Trustworthy One\n- **Married Khadijah** at age 25 (she was 40)\n- **Contemplative nature**: Often retreated to Cave Hira',
        keyPoints: [
          'His character was exemplary even before prophethood',
          'He never worshipped idols',
          'Khadijah was a successful businesswoman'
        ]
      }
    ],
    quiz: {
      question: 'What title was the Prophet ﷺ known by before prophethood?',
      options: [
        'Al-Mukhtar (The Chosen)',
        'Al-Amin (The Trustworthy)',
        'As-Sadiq (The Truthful)',
        'Al-Hadi (The Guide)'
      ],
      correctIndex: 1,
      explanation: 'Even before receiving revelation, Prophet Muhammad ﷺ was known as "Al-Amin" (The Trustworthy) due to his exceptional honesty and integrity. People would entrust him with their valuables.'
    }
  },
  's2': {
    id: 's2',
    title: 'The First Revelation',
    sections: [
      {
        heading: 'Cave of Hira',
        content: 'At age 40, while meditating in Cave Hira during Ramadan, the Angel Jibreel appeared to Muhammad ﷺ. He commanded "Iqra!" (Read!). The Prophet ﷺ replied he could not read. After three times, Jibreel revealed the first verses of Surah Al-Alaq.',
        keyPoints: [
          'The first word revealed was "Read"',
          'Knowledge is foundational in Islam',
          'The experience was overwhelming'
        ]
      },
      {
        heading: 'The First Revelation',
        content: '"Read in the name of your Lord who created. Created man from a clinging substance. Read, and your Lord is the Most Generous. Who taught by the pen. Taught man that which he knew not." (Quran 96:1-5)\n\nAfter this experience, the Prophet ﷺ returned home trembling. Khadijah comforted him and took him to her cousin Waraqah ibn Nawfal, a Christian scholar, who confirmed this was divine revelation.',
        keyPoints: [
          'Khadijah was the first to believe',
          'Waraqah confirmed it was the same angel who came to Moses',
          'There was a pause (Fatra) before more revelation'
        ]
      }
    ],
    quiz: {
      question: 'What was the first word revealed to Prophet Muhammad ﷺ?',
      options: ['Pray', 'Believe', 'Read', 'Submit'],
      correctIndex: 2,
      explanation: '"Iqra" (Read/Recite) was the first word revealed, emphasizing the importance of knowledge and learning in Islam. This became the opening of Surah Al-Alaq.'
    }
  },
  's3': {
    id: 's3',
    title: 'The Early Muslims',
    sections: [
      {
        heading: 'First Believers',
        content: 'The first people to accept Islam were:\n\n1. **Khadijah bint Khuwaylid** - First woman and spouse\n2. **Ali ibn Abi Talib** - First child (around 10 years old)\n3. **Zayd ibn Harithah** - First freed slave\n4. **Abu Bakr as-Siddiq** - First free adult man',
        keyPoints: [
          'Early Islam was diverse from the start',
          'Abu Bakr brought many to Islam',
          'The message spread secretly for 3 years'
        ]
      },
      {
        heading: 'Early Persecution',
        content: 'As the message spread, persecution intensified:\n\n- **Bilal ibn Rabah**: Tortured by being placed under hot rocks\n- **Sumayyah**: First martyr in Islam\n- **Yasir**: Martyred alongside his wife\n- **Social boycott**: Three years of isolation in Shi\'b Abi Talib\n\nThe early Muslims endured with patience, and many migrated to Abyssinia for safety.',
        keyPoints: [
          'Abyssinia\'s Christian king protected Muslims',
          'The weak and poor were most persecuted',
          'Steadfastness was rewarded'
        ]
      }
    ],
    quiz: {
      question: 'Who was the first adult man to embrace Islam?',
      options: ['Umar ibn al-Khattab', 'Uthman ibn Affan', 'Abu Bakr as-Siddiq', 'Ali ibn Abi Talib'],
      correctIndex: 2,
      explanation: 'Abu Bakr as-Siddiq was the first free adult man to accept Islam. His close friendship with the Prophet ﷺ and his noble character made him among the earliest believers.'
    }
  },
  's4': {
    id: 's4',
    title: 'The Hijrah',
    sections: [
      {
        heading: 'Migration to Madinah',
        content: 'In 622 CE, after 13 years of persecution in Makkah, Muslims migrated to Yathrib (later named Madinah). This event, the Hijrah, marks the beginning of the Islamic calendar. The Prophet ﷺ was among the last to leave.',
        keyPoints: [
          'The Hijrah was a turning point for Islam',
          'Abu Bakr accompanied the Prophet ﷺ',
          'They hid in Cave Thawr for three days'
        ]
      },
      {
        heading: 'The Journey',
        content: 'The migration was full of lessons:\n\n- **Planning**: They took a southern route to avoid capture\n- **Tawakkul**: Trust in Allah while taking precautions\n- **Sacrifice**: Leaving home and family for faith\n- **Brotherhood**: Ansar welcomed Muhajireen as brothers\n\nThe Prophet ﷺ said about Abu Bakr in the cave: "Do not grieve; indeed Allah is with us." (Quran 9:40)',
        keyPoints: [
          'Ansar means Helpers (people of Madinah)',
          'Muhajireen means Emigrants (from Makkah)',
          'This brotherhood was unprecedented'
        ]
      }
    ],
    quiz: {
      question: 'What does "Hijrah" mark the beginning of?',
      options: [
        'The Prophet\'s birth',
        'The Islamic calendar',
        'Ramadan',
        'The revelation'
      ],
      correctIndex: 1,
      explanation: 'The Hijrah (migration from Makkah to Madinah in 622 CE) marks the beginning of the Islamic calendar. Year 1 AH (After Hijrah) began with this momentous event.'
    }
  },
  's5': {
    id: 's5',
    title: 'Building the Ummah',
    sections: [
      {
        heading: 'Establishing Madinah',
        content: 'Upon arrival in Madinah, the Prophet ﷺ immediately began building the Muslim community:\n\n1. **Masjid an-Nabawi**: The Prophet\'s Mosque was built first\n2. **Constitution of Madinah**: A social contract for all residents\n3. **Brotherhood bonds**: Pairing Muhajireen with Ansar\n4. **Market regulations**: Fair trade practices',
        keyPoints: [
          'The mosque was the community center',
          'Jews and others were included in the constitution',
          'Economic fairness was established'
        ]
      },
      {
        heading: 'The Constitution',
        content: 'The Constitution of Madinah was a groundbreaking document:\n\n- **Religious freedom**: All could practice their faith\n- **Mutual defense**: All would defend Madinah\n- **Justice**: Equal rights for disputes\n- **Community identity**: One Ummah with diversity\n\nThis was one of the first written constitutions in history, establishing rights and responsibilities for all citizens.',
        keyPoints: [
          'It predated Magna Carta by 600 years',
          'It protected minority rights',
          'It established rule of law'
        ]
      }
    ],
    quiz: {
      question: 'What was the first structure built upon arrival in Madinah?',
      options: [
        'A fortress',
        'A marketplace',
        'A mosque',
        'A hospital'
      ],
      correctIndex: 2,
      explanation: 'Masjid an-Nabawi (The Prophet\'s Mosque) was the first structure built, emphasizing that the mosque is the center of Muslim community life, serving as a place of worship, education, and gathering.'
    }
  },
  's6': {
    id: 's6',
    title: 'The Conquest of Makkah',
    sections: [
      {
        heading: 'Fathu Makkah',
        content: 'In 630 CE (8 AH), after the Quraysh broke the Treaty of Hudaybiyyah, the Prophet ﷺ marched to Makkah with 10,000 Muslims. The city was taken peacefully with minimal resistance.',
        keyPoints: [
          'Only 8 years after Hijrah',
          'Most Makkans accepted Islam',
          'It was largely bloodless'
        ]
      },
      {
        heading: 'The Prophet\'s Mercy',
        content: 'Upon conquering Makkah, the Prophet ﷺ showed unprecedented mercy:\n\n- **General amnesty**: "Go, you are free"\n- **No revenge**: For years of persecution\n- **360 idols destroyed**: The Kaaba was purified\n- **Bilal\'s Adhan**: The former slave called prayer from the Kaaba\n\nThis forgiveness is a model for all humanity. Even his worst enemies were forgiven.',
        keyPoints: [
          'The same people who persecuted Muslims were forgiven',
          'Islam spread rapidly after this',
          'Mercy over vengeance was demonstrated'
        ]
      }
    ],
    quiz: {
      question: 'What did the Prophet ﷺ say to the Makkans after the conquest?',
      options: [
        '"You will be punished for your crimes"',
        '"Pay compensation for our suffering"',
        '"Go, you are free"',
        '"Leave this city forever"'
      ],
      correctIndex: 2,
      explanation: 'The Prophet ﷺ showed remarkable mercy, declaring general amnesty with the words "Go, you are free," forgiving those who had persecuted him and the Muslims for over 20 years.'
    }
  },
  's7': {
    id: 's7',
    title: 'The Farewell Sermon',
    sections: [
      {
        heading: 'The Final Pilgrimage',
        content: 'In 632 CE, the Prophet ﷺ performed his first and only Hajj, known as Hajjatul Wada (The Farewell Pilgrimage). Over 100,000 Muslims accompanied him.',
        keyPoints: [
          'It was the only Hajj of the Prophet ﷺ',
          'He taught all the rituals of Hajj',
          'He delivered his final major sermon'
        ]
      },
      {
        heading: 'Key Messages',
        content: 'The Farewell Sermon contained timeless principles:\n\n- **Equality**: "No Arab has superiority over a non-Arab except by piety"\n- **Human rights**: "Your blood and property are sacred"\n- **Women\'s rights**: "Treat women kindly"\n- **Economic justice**: "All usury is abolished"\n- **Unity**: "You are all from Adam, and Adam was from dust"\n\nThe Prophet ﷺ asked: "Have I conveyed the message?" The crowd replied: "Yes!" He said: "O Allah, be my witness."',
        keyPoints: [
          'These principles were revolutionary for the time',
          'The message was complete',
          'The Prophet ﷺ passed away 3 months later'
        ]
      }
    ],
    quiz: {
      question: 'What did the Prophet ﷺ say about superiority between people?',
      options: [
        'Arabs are superior',
        'The wealthy are superior',
        'Scholars are superior',
        'No one is superior except by piety'
      ],
      correctIndex: 3,
      explanation: 'The Prophet ﷺ declared: "No Arab has superiority over a non-Arab, nor does a non-Arab have superiority over an Arab—except by piety and good deeds."'
    }
  },
  's8': {
    id: 's8',
    title: 'Legacy & Character',
    sections: [
      {
        heading: 'His Character',
        content: 'The Prophet ﷺ was described by Allah as having "a tremendous character" (Quran 68:4). His wife Aisha said: "His character was the Quran."\n\nKey traits:\n- **Truthfulness**: Never lied, even to enemies\n- **Humility**: Mended his own clothes, served others\n- **Compassion**: Kind to children, animals, all people\n- **Patience**: Endured hardship without complaint\n- **Generosity**: Gave freely, never refused anyone',
        keyPoints: [
          'He was the living example of the Quran',
          'His character drew people to Islam',
          'He treated everyone with respect'
        ]
      },
      {
        heading: 'His Legacy',
        content: 'The Prophet ﷺ transformed the world:\n\n- **1.8 billion Muslims** follow his example today\n- **Rights established**: For women, children, workers, animals\n- **Education**: Made seeking knowledge obligatory\n- **Social reform**: Ended racism, class discrimination\n- **Spiritual guidance**: A complete way of life\n\nThe Prophet ﷺ said: "I was sent to perfect good character." Following his Sunnah is following the best example for humanity.',
        keyPoints: [
          'His influence continues 1400 years later',
          'Non-Muslim scholars acknowledge his impact',
          'His example is meant for all times'
        ]
      }
    ],
    quiz: {
      question: 'What did Aisha say about the Prophet\'s character?',
      options: [
        '"He was perfect in appearance"',
        '"His character was the Quran"',
        '"He was the most wealthy"',
        '"He was the most powerful"'
      ],
      correctIndex: 1,
      explanation: 'When asked about the Prophet\'s character, Aisha said: "His character was the Quran." This means he perfectly embodied all the teachings, morals, and guidance of the Quran in his daily life.'
    }
  },

  // Halal Finance Module
  'f1': {
    id: 'f1',
    title: 'Riba: Understanding Interest',
    sections: [
      {
        heading: 'What is Riba?',
        content: 'Riba literally means "increase" or "excess." In Islamic finance, it refers to the prohibited practice of charging interest on loans. Allah has declared war against those who deal in Riba (Quran 2:279).',
        keyPoints: [
          'Riba is mentioned as a major sin',
          'It creates money from money without value',
          'It exploits those in financial need'
        ]
      },
      {
        heading: 'Why is Riba Prohibited?',
        content: 'Islam prohibits interest because:\n\n1. **Exploitation**: It takes advantage of the needy\n2. **Risk imbalance**: Lender bears no risk\n3. **Economic harm**: Leads to wealth concentration\n4. **Social harm**: Increases inequality\n5. **Moral harm**: Encourages greed over empathy\n\nAlternatives like Musharakah (partnership) and Murabaha (cost-plus financing) share risk and create real value.',
        keyPoints: [
          'Islamic banking offers alternatives',
          'Risk-sharing is the key principle',
          'Profit from trade is halal'
        ]
      }
    ],
    quiz: {
      question: 'What is the main problem with Riba according to Islam?',
      options: [
        'It\'s too complicated',
        'It creates money without value and exploits the needy',
        'It\'s too modern',
        'Only banks can use it'
      ],
      correctIndex: 1,
      explanation: 'Riba creates "money from money" without creating any real value, and it exploits those who are already in financial difficulty. The lender profits regardless of the borrower\'s success or failure.'
    }
  },
  'f2': {
    id: 'f2',
    title: 'Halal Investments',
    sections: [
      {
        heading: 'Principles of Halal Investing',
        content: 'Islamic investments must follow key principles:\n\n1. **No Riba**: Avoid interest-based investments\n2. **No Gharar**: Avoid excessive uncertainty/gambling\n3. **Ethical sectors**: No alcohol, gambling, pork, weapons\n4. **Real assets**: Investments should be asset-backed\n5. **Shared risk**: Profit and loss sharing',
        keyPoints: [
          'Screening criteria exist for stocks',
          'Sukuk are Islamic bonds',
          'Real estate is generally halal'
        ]
      },
      {
        heading: 'Halal Investment Options',
        content: 'Options for halal investing include:\n\n- **Halal stocks**: Companies passing Shariah screening\n- **Sukuk**: Islamic bonds backed by assets\n- **Real estate**: Property investment and REITs\n- **Islamic mutual funds**: Professionally managed portfolios\n- **Gold and precious metals**: Tangible assets\n- **Business partnerships**: Musharakah investments',
        keyPoints: [
          'Many apps now offer halal investing',
          'Scholars review investments for compliance',
          'Purification of returns may be needed'
        ]
      }
    ],
    quiz: {
      question: 'Which investment is generally considered halal?',
      options: [
        'Savings account with interest',
        'Casino stocks',
        'Real estate',
        'Conventional bonds'
      ],
      correctIndex: 2,
      explanation: 'Real estate is generally considered halal as it involves tangible assets and does not inherently involve interest or prohibited sectors. However, financing should also be Shariah-compliant.'
    }
  },
  'f3': {
    id: 'f3',
    title: 'Islamic Banking',
    sections: [
      {
        heading: 'How Islamic Banks Work',
        content: 'Islamic banks operate on the principle of profit-and-loss sharing rather than interest. They use various contracts that comply with Shariah law while providing similar services to conventional banks.',
        keyPoints: [
          'No interest is charged or paid',
          'Risk is shared between parties',
          'A Shariah board oversees compliance'
        ]
      },
      {
        heading: 'Common Islamic Contracts',
        content: 'Key Islamic banking contracts:\n\n- **Murabaha**: Cost-plus financing (bank buys and sells at profit)\n- **Ijara**: Leasing (similar to rent-to-own)\n- **Musharakah**: Partnership with shared profits/losses\n- **Mudarabah**: Investment partnership\n- **Sukuk**: Asset-backed certificates\n- **Takaful**: Islamic insurance (mutual protection)',
        keyPoints: [
          'Each contract has specific rules',
          'Transparency in pricing is required',
          'Real transactions must occur'
        ]
      }
    ],
    quiz: {
      question: 'What is Murabaha?',
      options: [
        'Islamic insurance',
        'Cost-plus financing where bank buys and sells at profit',
        'A type of interest',
        'A charity fund'
      ],
      correctIndex: 1,
      explanation: 'Murabaha is a sale-based contract where the bank purchases an asset and sells it to the customer at a disclosed profit margin. The profit is halal because it comes from a real trade transaction.'
    }
  },
  'f4': {
    id: 'f4',
    title: 'Zakah Calculations',
    sections: [
      {
        heading: 'Understanding Zakatable Wealth',
        content: 'Zakah is calculated on wealth that:\n\n1. **Meets Nisab**: Minimum threshold (85g gold or 595g silver)\n2. **Held for one lunar year**: The hawl period\n3. **Is in excess of basic needs**: Above living expenses\n4. **Is productive**: Cash, gold, business inventory, etc.',
        keyPoints: [
          'Nisab is approximately $5,000-7,000 depending on gold/silver prices',
          'Agricultural produce has different rules',
          'Livestock has specific calculations'
        ]
      },
      {
        heading: 'How to Calculate',
        content: 'Steps to calculate Zakah:\n\n1. **List assets**: Cash, gold, silver, investments, business inventory\n2. **Subtract debts**: Loans and liabilities\n3. **Check Nisab**: Is the total above threshold?\n4. **Calculate 2.5%**: This is your Zakah due\n\nExample: $20,000 in savings - $5,000 debt = $15,000 × 2.5% = $375 Zakah',
        keyPoints: [
          'Calculate on your Zakah anniversary date',
          'Give to eligible recipients',
          'Keep records of what you paid'
        ]
      }
    ],
    quiz: {
      question: 'What percentage of wealth above nisab is given as Zakah?',
      options: ['1%', '2.5%', '5%', '10%'],
      correctIndex: 1,
      explanation: 'Zakah is 2.5% of wealth above the nisab threshold that has been held for one lunar year. This applies to cash, gold, silver, investments, and business inventory.'
    }
  },
  'f5': {
    id: 'f5',
    title: 'Business Ethics',
    sections: [
      {
        heading: 'Islamic Business Principles',
        content: 'Islam encourages trade and business with ethical principles:\n\n1. **Honesty**: Full disclosure of product conditions\n2. **Fair pricing**: No exploitation or price gouging\n3. **Clear contracts**: All terms explicitly stated\n4. **No deception**: "Whoever cheats is not of us" (Hadith)\n5. **Quality**: Deliver what is promised',
        keyPoints: [
          'The Prophet ﷺ was a successful merchant',
          'Trade is honorable in Islam',
          'Trustworthiness is essential'
        ]
      },
      {
        heading: 'Prohibited Practices',
        content: 'Practices forbidden in Islamic business:\n\n- **Gharar**: Excessive uncertainty in contracts\n- **Riba**: Interest in any form\n- **Hoarding**: Artificially creating scarcity\n- **Monopoly**: Controlling markets unfairly\n- **Bribery**: Corruption in dealings\n- **Fraud**: Misrepresentation of goods',
        keyPoints: [
          'Ethics lead to barakah (blessing)',
          'Short-term gains from haram are cursed',
          'Fair dealing builds lasting success'
        ]
      }
    ],
    quiz: {
      question: 'What did the Prophet ﷺ say about cheating in business?',
      options: [
        '"Cheating is sometimes necessary"',
        '"Whoever cheats is not of us"',
        '"Cheating is minor sin"',
        '"Business has no ethics"'
      ],
      correctIndex: 1,
      explanation: 'The Prophet ﷺ said: "Whoever cheats is not of us." This strong statement shows that dishonesty in business is completely contrary to Islamic values and takes one outside the Muslim community ethically.'
    }
  },
  'f6': {
    id: 'f6',
    title: 'Wealth & Contentment',
    sections: [
      {
        heading: 'Islamic View of Wealth',
        content: 'Islam views wealth as a trust (amanah) from Allah. Being wealthy is not inherently good or bad—what matters is how wealth is earned and used.\n\n"Wealth and children are the adornment of this worldly life, but the everlasting good deeds are better in your Lord\'s sight." (Quran 18:46)',
        keyPoints: [
          'Wealth is a test from Allah',
          'Gratitude is required for blessings',
          'Spending on others brings barakah'
        ]
      },
      {
        heading: 'True Richness',
        content: 'The Prophet ﷺ said: "True richness is not having many possessions. Rather, true richness is the richness of the soul (contentment)."\n\nPrinciples for contentment:\n\n- **Look at those with less**: Appreciate your blessings\n- **Avoid excess**: Moderation in all things\n- **Give regularly**: Charity purifies and increases wealth\n- **Trust in Allah**: Rizq (provision) is guaranteed\n- **Balance dunya and akhirah**: This world is temporary',
        keyPoints: [
          'Contentment is a treasure',
          'Greed leads to misery',
          'The simple life can be rich'
        ]
      }
    ],
    quiz: {
      question: 'According to the Prophet ﷺ, what is true richness?',
      options: [
        'Having many possessions',
        'Being famous',
        'Richness of the soul (contentment)',
        'Having a large house'
      ],
      correctIndex: 2,
      explanation: 'The Prophet ﷺ taught that true richness is "richness of the soul" (ghinan-nafs), meaning contentment and satisfaction with what Allah has provided, rather than the accumulation of material possessions.'
    }
  }
};
