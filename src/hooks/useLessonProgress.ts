import { useState, useEffect, useCallback } from 'react';

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
  description: string;
  completed: boolean;
}

export interface Module {
  id: string;
  title: string;
  description: string;
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

const DEFAULT_MODULES: Module[] = [
  { 
    id: 'basics', 
    title: 'Islamic Basics', 
    description: 'Foundation of faith',
    icon: '🕌',
    color: 'bg-primary/10 border-primary/20',
    unlocked: true,
    quizPassed: false,
    lessons: [
      { id: 'b1', title: 'The Five Pillars', description: 'Core principles of Islam', completed: false },
      { id: 'b2', title: 'Shahada: Declaration of Faith', description: 'The first pillar', completed: false },
      { id: 'b3', title: 'Importance of Niyyah', description: 'Intention in worship', completed: false },
      { id: 'b4', title: 'The Six Articles of Faith', description: 'Iman fundamentals', completed: false },
      { id: 'b5', title: 'Halal & Haram Basics', description: 'Permissible and forbidden', completed: false },
    ]
  },
  { 
    id: 'pillars', 
    title: 'Pillars of Islam', 
    description: 'The five pillars in depth',
    icon: '🏛️',
    color: 'bg-accent/10 border-accent/20',
    unlocked: false,
    quizPassed: false,
    lessons: [
      { id: 'p1', title: 'Salah: The Daily Prayers', description: 'How and why we pray', completed: false },
      { id: 'p2', title: 'Zakah: Purifying Wealth', description: 'Charity obligations', completed: false },
      { id: 'p3', title: 'Sawm: Fasting in Ramadan', description: 'The blessed month', completed: false },
      { id: 'p4', title: 'Hajj: The Sacred Pilgrimage', description: 'Journey to Makkah', completed: false },
      { id: 'p5', title: 'Living the Pillars Daily', description: 'Practical application', completed: false },
    ]
  },
  { 
    id: 'seerah', 
    title: 'Life of the Prophet ﷺ', 
    description: 'The prophetic biography',
    icon: '📖',
    color: 'bg-success/10 border-success/20',
    unlocked: false,
    quizPassed: false,
    lessons: [
      { id: 's1', title: 'Before the Revelation', description: 'Early life in Makkah', completed: false },
      { id: 's2', title: 'The First Revelation', description: 'Cave of Hira', completed: false },
      { id: 's3', title: 'The Early Muslims', description: 'First companions', completed: false },
      { id: 's4', title: 'The Hijrah', description: 'Migration to Madinah', completed: false },
      { id: 's5', title: 'Building the Ummah', description: 'Community in Madinah', completed: false },
      { id: 's6', title: 'The Conquest of Makkah', description: 'Triumphant return', completed: false },
      { id: 's7', title: 'The Farewell Sermon', description: 'Final guidance', completed: false },
      { id: 's8', title: 'Legacy & Character', description: 'His beautiful example', completed: false },
    ]
  },
  { 
    id: 'finance', 
    title: 'Halal Finance', 
    description: 'Islamic economics',
    icon: '💰',
    color: 'bg-warn/10 border-warn/20',
    unlocked: false,
    quizPassed: false,
    lessons: [
      { id: 'f1', title: 'Riba: Understanding Interest', description: 'Why interest is prohibited', completed: false },
      { id: 'f2', title: 'Halal Investments', description: 'Ethical investing', completed: false },
      { id: 'f3', title: 'Islamic Banking', description: 'How it works', completed: false },
      { id: 'f4', title: 'Zakah Calculations', description: 'Calculating your dues', completed: false },
      { id: 'f5', title: 'Business Ethics', description: 'Trading guidelines', completed: false },
      { id: 'f6', title: 'Wealth & Contentment', description: 'Balancing dunya', completed: false },
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
  const [progress, setProgress] = useState<LessonProgress>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Migrate old data if needed
        if (parsed.modules && !parsed.modules[0]?.hasOwnProperty('quizPassed')) {
          return {
            modules: parsed.modules.map((m: any) => ({ ...m, quizPassed: false })),
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

  const completeLesson = useCallback((moduleId: string, lessonId: string) => {
    const updatedModules = progress.modules.map(mod => {
      if (mod.id === moduleId) {
        const updatedLessons = mod.lessons.map(lesson => 
          lesson.id === lessonId ? { ...lesson, completed: true } : lesson
        );
        return { ...mod, lessons: updatedLessons };
      }
      return mod;
    });

    saveProgress({ modules: updatedModules, lastUpdated: new Date().toISOString() });
  }, [progress.modules, saveProgress]);

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

  return {
    modules: progress.modules,
    completeLesson,
    passModuleQuiz,
    getModuleProgress,
    isModuleComplete,
    canTakeQuiz,
    getModuleQuiz,
  };
}
