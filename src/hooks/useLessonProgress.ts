import { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

const STORAGE_KEY = 'naja_learn_progress_v2';

export interface LessonQuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Lesson {
  id: string;
  title: string;
  titleFr?: string;
  description: string;
  descriptionFr?: string;
  completed: boolean;
  quizPassed?: boolean;
}

export interface Module {
  id: string;
  title: string;
  titleFr?: string;
  description: string;
  descriptionFr?: string;
  icon: string;
  lessons: Lesson[];
  unlocked: boolean;
  color: string;
  quizPassed: boolean;
}

export interface LessonProgress {
  modules: Module[];
  lastUpdated: string;
}

// Helper to get localized text
export function getLocalizedText(item: { title: string; titleFr?: string; description: string; descriptionFr?: string }, lang: string): { title: string; description: string } {
  if (lang === 'fr') {
    return {
      title: item.titleFr || item.title,
      description: item.descriptionFr || item.description
    };
  }
  return { title: item.title, description: item.description };
}

const DEFAULT_MODULES: Module[] = [
  { 
    id: 'basics', 
    title: 'Islamic Basics', 
    titleFr: 'Bases de l\'Islam',
    description: 'Foundation of faith',
    descriptionFr: 'Fondement de la foi',
    icon: '🕌',
    color: 'bg-primary/10 border-primary/20',
    unlocked: true,
    quizPassed: false,
    lessons: [
      { id: 'b1', title: 'The Five Pillars', titleFr: 'Les Cinq Piliers', description: 'Core principles of Islam', descriptionFr: 'Principes fondamentaux de l\'Islam', completed: false, quizPassed: false },
      { id: 'b2', title: 'Shahada: Declaration of Faith', titleFr: 'Shahada : Déclaration de Foi', description: 'The first pillar', descriptionFr: 'Le premier pilier', completed: false, quizPassed: false },
      { id: 'b3', title: 'Importance of Niyyah', titleFr: 'Importance de la Niyyah', description: 'Intention in worship', descriptionFr: 'L\'intention dans l\'adoration', completed: false, quizPassed: false },
      { id: 'b4', title: 'The Six Articles of Faith', titleFr: 'Les Six Articles de la Foi', description: 'Iman fundamentals', descriptionFr: 'Les fondamentaux de l\'Iman', completed: false, quizPassed: false },
      { id: 'b5', title: 'Halal & Haram Basics', titleFr: 'Bases du Halal et Haram', description: 'Permissible and forbidden', descriptionFr: 'Le permis et l\'interdit', completed: false, quizPassed: false },
    ]
  },
  { 
    id: 'pillars', 
    title: 'Pillars of Islam', 
    titleFr: 'Piliers de l\'Islam',
    description: 'The five pillars in depth',
    descriptionFr: 'Les cinq piliers en profondeur',
    icon: '🏛️',
    color: 'bg-accent/10 border-accent/20',
    unlocked: false,
    quizPassed: false,
    lessons: [
      { id: 'p1', title: 'Salah: The Daily Prayers', titleFr: 'Salah : Les Prières Quotidiennes', description: 'How and why we pray', descriptionFr: 'Comment et pourquoi nous prions', completed: false, quizPassed: false },
      { id: 'p2', title: 'Zakah: Purifying Wealth', titleFr: 'Zakah : Purifier la Richesse', description: 'Charity obligations', descriptionFr: 'Obligations de charité', completed: false, quizPassed: false },
      { id: 'p3', title: 'Sawm: Fasting in Ramadan', titleFr: 'Sawm : Le Jeûne du Ramadan', description: 'The blessed month', descriptionFr: 'Le mois béni', completed: false, quizPassed: false },
      { id: 'p4', title: 'Hajj: The Sacred Pilgrimage', titleFr: 'Hajj : Le Pèlerinage Sacré', description: 'Journey to Makkah', descriptionFr: 'Voyage à La Mecque', completed: false, quizPassed: false },
      { id: 'p5', title: 'Living the Pillars Daily', titleFr: 'Vivre les Piliers au Quotidien', description: 'Practical application', descriptionFr: 'Application pratique', completed: false, quizPassed: false },
    ]
  },
  { 
    id: 'seerah', 
    title: 'Life of the Prophet ﷺ', 
    titleFr: 'Vie du Prophète ﷺ',
    description: 'The prophetic biography',
    descriptionFr: 'La biographie prophétique',
    icon: '📖',
    color: 'bg-success/10 border-success/20',
    unlocked: false,
    quizPassed: false,
    lessons: [
      { id: 's1', title: 'Before the Revelation', titleFr: 'Avant la Révélation', description: 'Early life in Makkah', descriptionFr: 'Première vie à La Mecque', completed: false, quizPassed: false },
      { id: 's2', title: 'The First Revelation', titleFr: 'La Première Révélation', description: 'Cave of Hira', descriptionFr: 'La grotte de Hira', completed: false, quizPassed: false },
      { id: 's3', title: 'The Early Muslims', titleFr: 'Les Premiers Musulmans', description: 'First companions', descriptionFr: 'Les premiers compagnons', completed: false, quizPassed: false },
      { id: 's4', title: 'The Hijrah', titleFr: 'L\'Hégire', description: 'Migration to Madinah', descriptionFr: 'Migration à Médine', completed: false, quizPassed: false },
      { id: 's5', title: 'Building the Ummah', titleFr: 'Construire la Oumma', description: 'Community in Madinah', descriptionFr: 'Communauté à Médine', completed: false, quizPassed: false },
      { id: 's6', title: 'The Conquest of Makkah', titleFr: 'La Conquête de La Mecque', description: 'Triumphant return', descriptionFr: 'Retour triomphal', completed: false, quizPassed: false },
      { id: 's7', title: 'The Farewell Sermon', titleFr: 'Le Sermon d\'Adieu', description: 'Final guidance', descriptionFr: 'Dernières orientations', completed: false, quizPassed: false },
      { id: 's8', title: 'Legacy & Character', titleFr: 'Héritage et Caractère', description: 'His beautiful example', descriptionFr: 'Son bel exemple', completed: false, quizPassed: false },
    ]
  },
  { 
    id: 'finance', 
    title: 'Halal Finance', 
    titleFr: 'Finance Halal',
    description: 'Islamic economics',
    descriptionFr: 'Économie islamique',
    icon: '💰',
    color: 'bg-warn/10 border-warn/20',
    unlocked: false,
    quizPassed: false,
    lessons: [
      { id: 'f1', title: 'Riba: Understanding Interest', titleFr: 'Riba : Comprendre l\'Intérêt', description: 'Why interest is prohibited', descriptionFr: 'Pourquoi l\'intérêt est interdit', completed: false, quizPassed: false },
      { id: 'f2', title: 'Halal Investments', titleFr: 'Investissements Halal', description: 'Ethical investing', descriptionFr: 'Investissement éthique', completed: false, quizPassed: false },
      { id: 'f3', title: 'Islamic Banking', titleFr: 'Banque Islamique', description: 'How it works', descriptionFr: 'Comment ça fonctionne', completed: false, quizPassed: false },
      { id: 'f4', title: 'Zakah Calculations', titleFr: 'Calculs de Zakah', description: 'Calculating your dues', descriptionFr: 'Calculer vos obligations', completed: false, quizPassed: false },
      { id: 'f5', title: 'Business Ethics', titleFr: 'Éthique des Affaires', description: 'Trading guidelines', descriptionFr: 'Lignes directrices commerciales', completed: false, quizPassed: false },
      { id: 'f6', title: 'Wealth & Contentment', titleFr: 'Richesse et Contentement', description: 'Balancing dunya', descriptionFr: 'Équilibrer la dunya', completed: false, quizPassed: false },
    ]
  },
];

// Module quiz questions (5 questions per module)
export const MODULE_QUIZZES: Record<string, LessonQuizQuestion[]> = {
  basics: [
    {
      question: 'How many pillars does Islam have?',
      options: ['Three', 'Four', 'Five', 'Six'],
      correctIndex: 2,
      explanation: 'Islam has Five Pillars: Shahada, Salah, Zakah, Sawm, and Hajj.'
    },
    {
      question: 'What does "Shahada" mean?',
      options: ['Prayer', 'Fasting', 'Declaration of Faith', 'Charity'],
      correctIndex: 2,
      explanation: 'Shahada is the Declaration of Faith, the first pillar of Islam.'
    },
    {
      question: 'What is "Niyyah"?',
      options: ['A type of prayer', 'Intention', 'A pilgrimage', 'Charity'],
      correctIndex: 1,
      explanation: 'Niyyah means intention. It is required before every act of worship.'
    },
    {
      question: 'How many articles of faith (Iman) are there?',
      options: ['Four', 'Five', 'Six', 'Seven'],
      correctIndex: 2,
      explanation: 'There are Six Articles of Faith in Islam.'
    },
    {
      question: 'What does "Halal" mean?',
      options: ['Forbidden', 'Permissible', 'Recommended', 'Obligatory'],
      correctIndex: 1,
      explanation: 'Halal means permissible according to Islamic law.'
    },
  ],
  pillars: [
    {
      question: 'How many daily prayers are obligatory?',
      options: ['Three', 'Four', 'Five', 'Seven'],
      correctIndex: 2,
      explanation: 'Muslims pray five times daily: Fajr, Dhuhr, Asr, Maghrib, and Isha.'
    },
    {
      question: 'What percentage of wealth is given as Zakah?',
      options: ['1%', '2.5%', '5%', '10%'],
      correctIndex: 1,
      explanation: 'Zakah is 2.5% of savings above the nisab threshold.'
    },
    {
      question: 'In which month do Muslims fast?',
      options: ['Shawwal', 'Ramadan', 'Muharram', 'Rajab'],
      correctIndex: 1,
      explanation: 'Muslims fast during the month of Ramadan, the 9th month.'
    },
    {
      question: 'Where is Hajj performed?',
      options: ['Madinah', 'Jerusalem', 'Makkah', 'Cairo'],
      correctIndex: 2,
      explanation: 'Hajj is performed in Makkah, Saudi Arabia.'
    },
    {
      question: 'What is the main goal of fasting?',
      options: ['Weight loss', 'Saving money', 'Developing Taqwa', 'Social bonding'],
      correctIndex: 2,
      explanation: 'The Quran states fasting is prescribed to develop Taqwa (God-consciousness).'
    },
  ],
  seerah: [
    {
      question: 'In which city was Prophet Muhammad ﷺ born?',
      options: ['Madinah', 'Makkah', 'Taif', 'Jerusalem'],
      correctIndex: 1,
      explanation: 'Prophet Muhammad ﷺ was born in Makkah in 570 CE.'
    },
    {
      question: 'What was the Prophet ﷺ known as before prophethood?',
      options: ['Al-Mukhtar', 'Al-Amin', 'Al-Rashid', 'Al-Hadi'],
      correctIndex: 1,
      explanation: 'He was known as Al-Amin (The Trustworthy) due to his honest character.'
    },
    {
      question: 'Where did the Prophet ﷺ receive the first revelation?',
      options: ['Masjid al-Haram', 'Cave of Hira', 'Madinah', 'Mount Uhud'],
      correctIndex: 1,
      explanation: 'The first revelation came in the Cave of Hira on Mount Noor.'
    },
    {
      question: 'What is the Hijrah?',
      options: ['A battle', 'Migration to Madinah', 'A treaty', 'A pilgrimage'],
      correctIndex: 1,
      explanation: 'The Hijrah was the migration from Makkah to Madinah in 622 CE.'
    },
    {
      question: 'When did the Conquest of Makkah occur?',
      options: ['1 AH', '5 AH', '8 AH', '10 AH'],
      correctIndex: 2,
      explanation: 'The peaceful Conquest of Makkah occurred in 8 AH (630 CE).'
    },
  ],
  finance: [
    {
      question: 'What is "Riba"?',
      options: ['Charity', 'Interest/Usury', 'Investment', 'Trade'],
      correctIndex: 1,
      explanation: 'Riba refers to interest or usury, which is prohibited in Islam.'
    },
    {
      question: 'Is stock trading halal?',
      options: ['Always halal', 'Always haram', 'Depends on the company', 'Only in Ramadan'],
      correctIndex: 2,
      explanation: 'Stock trading is permissible if the company operates according to Islamic principles.'
    },
    {
      question: 'What makes a bank "Islamic"?',
      options: ['Muslim owners', 'No interest-based transactions', 'Located in Muslim country', 'Open on Fridays'],
      correctIndex: 1,
      explanation: 'Islamic banks avoid interest and use profit-sharing arrangements instead.'
    },
    {
      question: 'What is the nisab threshold based on?',
      options: ['Income', 'Gold/Silver value', 'Property', 'Number of dependents'],
      correctIndex: 1,
      explanation: 'Nisab is based on the value of gold (85g) or silver (595g).'
    },
    {
      question: 'Is excessive profit (price gouging) allowed?',
      options: ['Yes, business is business', 'No, it is discouraged', 'Only for luxury goods', 'Only in emergencies'],
      correctIndex: 1,
      explanation: 'Islam discourages excessive profits and emphasizes fair dealing.'
    },
  ],
};

export function useLessonProgress() {
  const { i18n } = useTranslation();
  const [progress, setProgress] = useState<LessonProgress>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Migrate old data if needed - add quizPassed to modules and lessons
        let needsMigration = false;
        const migratedModules = parsed.modules?.map((m: any) => {
          const migratedLessons = m.lessons?.map((l: any) => {
            if (!l.hasOwnProperty('quizPassed')) {
              needsMigration = true;
              return { ...l, quizPassed: l.completed || false };
            }
            return l;
          }) || [];
          if (!m.hasOwnProperty('quizPassed')) {
            needsMigration = true;
            return { ...m, quizPassed: false, lessons: migratedLessons };
          }
          return { ...m, lessons: migratedLessons };
        }) || DEFAULT_MODULES;
        
        if (needsMigration) {
          return {
            modules: migratedModules,
            lastUpdated: new Date().toISOString()
          };
        }
        return parsed;
      }
    } catch {
      // ignore
    }
    return { modules: DEFAULT_MODULES, lastUpdated: new Date().toISOString() };
  });

  const saveProgress = useCallback((newProgress: LessonProgress) => {
    setProgress(newProgress);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress));
  }, []);

  // Pass a lesson quiz - this marks the lesson as completed
  const passLessonQuiz = useCallback((moduleId: string, lessonId: string) => {
    const updatedModules = progress.modules.map(mod => {
      if (mod.id === moduleId) {
        const updatedLessons = mod.lessons.map(lesson => 
          lesson.id === lessonId ? { ...lesson, completed: true, quizPassed: true } : lesson
        );
        return { ...mod, lessons: updatedLessons };
      }
      return mod;
    });

    saveProgress({ modules: updatedModules, lastUpdated: new Date().toISOString() });
  }, [progress.modules, saveProgress]);

  // Get a lesson quiz from the lesson content - returns array for compatibility with LessonQuizModal
  const getLessonQuiz = useCallback((lessonId: string, lang: string): LessonQuizQuestion[] => {
    // Import from lesson content - we'll use the quiz from there
    const { LESSON_CONTENT } = require('@/data/lessonContent');
    const { LESSON_CONTENT_FR } = require('@/data/lessonContentFr');
    
    const content = lang === 'fr' ? LESSON_CONTENT_FR[lessonId] : LESSON_CONTENT[lessonId];
    const quiz = content?.quiz;
    return quiz ? [quiz] : [];
  }, []);

  const passModuleQuiz = useCallback((moduleId: string): boolean => {
    const moduleIndex = progress.modules.findIndex(m => m.id === moduleId);
    if (moduleIndex === -1) return false;

    const updatedModules = [...progress.modules];
    updatedModules[moduleIndex] = { ...updatedModules[moduleIndex], quizPassed: true };

    // Unlock next module
    if (moduleIndex < updatedModules.length - 1) {
      updatedModules[moduleIndex + 1] = { ...updatedModules[moduleIndex + 1], unlocked: true };
    }

    saveProgress({ modules: updatedModules, lastUpdated: new Date().toISOString() });
    return moduleIndex < updatedModules.length - 1;
  }, [progress.modules, saveProgress]);

  const getModuleProgress = useCallback((module: Module): number => {
    const completed = module.lessons.filter(l => l.completed).length;
    return Math.round((completed / module.lessons.length) * 100);
  }, []);

  const isModuleComplete = useCallback((module: Module): boolean => {
    return module.lessons.every(l => l.completed);
  }, []);

  const canTakeQuiz = useCallback((module: Module): boolean => {
    return isModuleComplete(module) && !module.quizPassed;
  }, [isModuleComplete]);

  const getModuleQuiz = useCallback((moduleId: string): LessonQuizQuestion[] | null => {
    return MODULE_QUIZZES[moduleId] || null;
  }, []);

  // Get localized modules with titles/descriptions
  const localizedModules = useMemo(() => {
    const lang = i18n.language;
    return progress.modules.map(mod => {
      const localizedMod = getLocalizedText(mod as any, lang);
      const localizedLessons = mod.lessons.map(lesson => ({
        ...lesson,
        ...getLocalizedText(lesson as any, lang)
      }));
      return {
        ...mod,
        title: localizedMod.title,
        description: localizedMod.description,
        lessons: localizedLessons
      };
    });
  }, [progress.modules, i18n.language]);

  return {
    modules: localizedModules,
    passLessonQuiz,
    getLessonQuiz,
    passModuleQuiz,
    getModuleProgress,
    isModuleComplete,
    canTakeQuiz,
    getModuleQuiz,
  };
}
