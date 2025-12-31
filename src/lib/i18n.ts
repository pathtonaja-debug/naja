import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const STORAGE_KEY = 'naja_language';

const resources = {
  en: {
    translation: {
      // Common
      "common.loading": "Loading...",
      "common.save": "Save",
      "common.cancel": "Cancel",
      "common.delete": "Delete",
      "common.edit": "Edit",
      "common.close": "Close",
      "common.back": "Back",
      "common.next": "Next",
      "common.done": "Done",
      "common.start": "Start",
      "common.retry": "Retry",
      "common.continue": "Continue",
      "common.search": "Search",
      "common.create": "Create",
      "common.confirm": "Confirm",
      "common.yes": "Yes",
      "common.no": "No",

      // Navigation
      "nav.home": "Home",
      "nav.practices": "Practices",
      "nav.learn": "Learn",
      "nav.profile": "Profile",
      "nav.quran": "Quran",
      "nav.dua": "Dua",
      "nav.dhikr": "Dhikr",
      "nav.journal": "Journal",
      "nav.dates": "Dates",
      "nav.quiz": "Quiz",

      // Quick Actions
      "quickActions.title": "Quick Actions",
      "quickActions.dhikr": "Dhikr",
      "quickActions.duaBuilder": "Dua Builder",
      "quickActions.journal": "Journal",
      "quickActions.dates": "Dates",

      // Dashboard
      "dashboard.greeting.morning": "Assalamu Alaikum",
      "dashboard.greeting.afternoon": "Good afternoon",
      "dashboard.greeting.evening": "Good evening",
      "dashboard.today": "Today",
      "dashboard.barakahPoints": "Barakah Points",
      "dashboard.streak": "Streak",
      "dashboard.hasanatStreak": "Hasanat Streak",
      "dashboard.actsToday": "Acts today",
      "dashboard.level": "Level",
      "dashboard.totalPoints": "Total Points",
      "dashboard.ayahOfDay": "Ayah of the Day",
      "dashboard.todaysActs": "Today's Acts for Allah",
      "dashboard.open": "Open",
      "dashboard.quizOfDay": "Quiz of the Day",
      "dashboard.testKnowledge": "Test Your Knowledge",
      "dashboard.quizDescription": "Quick daily quiz • Optional • +5 Points",
      "dashboard.quickAccess": "Quick Access",
      "dashboard.niyyahDisclaimer": "Your niyyah is what matters — points are just a tool to help you stay consistent.",

      // Acts
      "acts.salah": "Salah",
      "acts.quran": "Qur'an",
      "acts.goodDeed": "Good Deed",
      "acts.sadaqah": "Sadaqah",

      // Profile
      "profile.title": "Profile",
      "profile.settings": "Profile Settings",
      "profile.displayName": "Display Name",
      "profile.preferences": "Preferences",
      "profile.darkMode": "Dark Mode",
      "profile.dataManagement": "Data Management",
      "profile.resetData": "Reset All Data",
      "profile.resetConfirm": "Are you sure? This will delete all your data and cannot be undone.",
      "profile.anonymous": "You are using NAJA in guest mode. All data is stored locally on your device.",
      "profile.deviceId": "Device ID",
      "profile.achievements": "Achievements",
      "profile.progress": "Progress",
      "profile.leaderboard": "Leaderboard",
      "profile.totalPoints": "Total Points",
      "profile.bestStreak": "Best Streak",
      "profile.days": "days",
      "profile.language": "Language",
      "profile.english": "English",
      "profile.french": "Français",

      // Quran
      "quran.title": "Quran",
      "quran.read": "Read",
      "quran.surahs": "Surahs",
      "quran.hifdh": "Hifdh",
      "quran.khatam": "Khatam",
      "quran.continueReading": "Continue Reading",
      "quran.verse": "Verse",
      "quran.todayReading": "Today's Reading",
      "quran.pages": "pages",
      "quran.dailyGoal": "of daily goal",
      "quran.changeGoal": "Change goal",
      "quran.setDailyGoal": "Set Daily Goal",
      "quran.bookmarks": "Bookmarks",
      "quran.totalPages": "Total Pages",
      "quran.khatamsCompleted": "Khatams Completed",
      "quran.currentProgress": "Current Progress",
      "quran.aboutSurah": "About this Surah",
      "quran.wordByWord": "Word-by-word",
      "quran.verses": "verses",
      "quran.revealed": "Revealed in",
      "quran.meccan": "Meccan",
      "quran.medinan": "Medinan",
      "quran.tafsir": "Tafsir",
      "quran.setAsCurrent": "Set as current",
      "quran.readingPositionSaved": "Reading position saved",
      "quran.notStarted": "Not started",
      "quran.memorizing": "Memorizing",
      "quran.solid": "Solid",
      "quran.page": "Page",
      "quran.juz": "Juz",
      "quran.searchSurahs": "Search surahs...",
      "quran.allSurahs": "All Surahs",
      "quran.markAllMemorizing": "Mark All Memorizing",
      "quran.markAllSolid": "Mark All Solid",
      "quran.surahProgress": "Surah Progress",
      "quran.summary": "Summary",

      // Learn
      "learn.title": "Learn",
      "learn.dailyQuiz": "Daily Quiz",
      "learn.testKnowledge": "Test your knowledge today",
      "learn.learningPath": "Learning Path",
      "learn.badges": "badges",
      "learn.achievements": "Achievements",
      "learn.badgesEarned": "badges earned",
      "learn.viewAll": "View All",
      "learn.locked": "Locked",
      "learn.completeQuiz": "Complete module quiz to unlock next module",
      "learn.moduleQuiz": "Module Quiz",
      "learn.passToUnlock": "Pass with 70% or higher to unlock the next module",
      "learn.question": "Question",
      "learn.of": "of",
      "learn.checkAnswer": "Check Answer",
      "learn.correct": "Correct!",
      "learn.incorrect": "Incorrect",
      "learn.quizComplete": "Quiz Complete!",
      "learn.yourScore": "Your Score",
      "learn.passed": "Passed! Next module unlocked.",
      "learn.failed": "Need 70% to pass. Try again!",
      "learn.retryQuiz": "Retry Quiz",
      "learn.continueLesson": "Continue to Lesson",
      "learn.lessonComplete": "Lesson Complete",
      "learn.newModuleUnlocked": "New module unlocked",

      // Dua
      "dua.library": "Dua Library",
      "dua.builder": "Dua Builder",
      "dua.guided": "Guided Dua",
      "dua.writeOwn": "Write Your Dua",
      "dua.writeOwnDesc": "Free text dua with optional topic",
      "dua.guidedDesc": "Step-by-step with AI assistance",
      "dua.chooseMethod": "Choose how you'd like to create your dua",
      "dua.search": "Search duas...",
      "dua.all": "All",
      "dua.folders": "Folders",
      "dua.favorites": "Favorites",
      "dua.noFolders": "No folders yet",
      "dua.noDuas": "No duas yet",
      "dua.noFavorites": "No favorite duas yet",
      "dua.createFirst": "Create your first dua",
      "dua.createFolder": "Create folder",
      "dua.folderName": "Folder name?",
      "dua.folderCreated": "Folder created",
      "dua.duaSaved": "Dua saved",
      "dua.duaDeleted": "Dua deleted",
      "dua.folderDeleted": "Folder deleted",
      "dua.deleteFolder": "Delete folder",
      "dua.noDuasInFolder": "No duas in this folder",
      "dua.saveDua": "Save Dua",
      "dua.addToFavorites": "Add to favorites",
      "dua.selectFolder": "Select folder (optional)",
      "dua.noFolder": "No folder",
      "dua.orCreateNew": "Or create new folder",
      "dua.topic": "Topic",
      "dua.topicOptional": "Topic (optional)",
      "dua.yourDua": "Your dua",
      "dua.placeholder": "Ya Allah, I ask You...",
      "dua.continueToSave": "Continue to Save",

      // Dhikr
      "dhikr.title": "Dhikr",
      "dhikr.counter": "Counter",
      "dhikr.target": "Target",
      "dhikr.completed": "Completed",
      "dhikr.reset": "Reset",

      // Journal
      "journal.title": "Journal",
      "journal.newEntry": "New Entry",
      "journal.prompt": "Today's Prompt",
      "journal.write": "Write your reflection...",
      "journal.saved": "Entry saved",
      "journal.deleted": "Entry deleted",

      // Fintech
      "fintech.title": "Halal Finance",

      // Quiz
      "quiz.title": "Daily Quiz",
      "quiz.complete": "Quiz Complete!",
      "quiz.score": "Score",
      "quiz.pointsEarned": "Points earned",

      // Achievements
      "achievements.title": "Achievements",
      "achievements.earned": "Earned",
      "achievements.locked": "Locked",

      // Progress
      "progress.title": "Progress",

      // Dates
      "dates.title": "Islamic Dates",

      // Toasts
      "toast.saved": "Saved",
      "toast.deleted": "Deleted",
      "toast.error": "Error",
      "toast.success": "Success",
      "toast.pointsEarned": "+{{points}} Barakah Points",
      "toast.dailyGoalAchieved": "Daily goal achieved. MashAllah!",
      "toast.khatamCompleted": "Khatam completed. MashAllah!",
      "toast.juzCompleted": "Juz {{juz}} completed",
      "toast.goalSet": "Daily goal set to {{goal}} pages",

      // Empty States
      "empty.noDuas": "No duas yet",
      "empty.noEntries": "No entries yet",
      "empty.noBookmarks": "No bookmarks yet",
    }
  },
  fr: {
    translation: {
      // Common
      "common.loading": "Chargement...",
      "common.save": "Enregistrer",
      "common.cancel": "Annuler",
      "common.delete": "Supprimer",
      "common.edit": "Modifier",
      "common.close": "Fermer",
      "common.back": "Retour",
      "common.next": "Suivant",
      "common.done": "Terminé",
      "common.start": "Commencer",
      "common.retry": "Réessayer",
      "common.continue": "Continuer",
      "common.search": "Rechercher",
      "common.create": "Créer",
      "common.confirm": "Confirmer",
      "common.yes": "Oui",
      "common.no": "Non",

      // Navigation
      "nav.home": "Accueil",
      "nav.practices": "Pratiques",
      "nav.learn": "Apprendre",
      "nav.profile": "Profil",
      "nav.quran": "Coran",
      "nav.dua": "Doua",
      "nav.dhikr": "Dhikr",
      "nav.journal": "Journal",
      "nav.dates": "Dates",
      "nav.quiz": "Quiz",

      // Quick Actions
      "quickActions.title": "Actions Rapides",
      "quickActions.dhikr": "Dhikr",
      "quickActions.duaBuilder": "Créateur de Doua",
      "quickActions.journal": "Journal",
      "quickActions.dates": "Dates",

      // Dashboard
      "dashboard.greeting.morning": "Assalamou Alaykoum",
      "dashboard.greeting.afternoon": "Bon après-midi",
      "dashboard.greeting.evening": "Bonsoir",
      "dashboard.today": "Aujourd'hui",
      "dashboard.barakahPoints": "Points de Baraka",
      "dashboard.streak": "Série",
      "dashboard.hasanatStreak": "Série de Hasanat",
      "dashboard.actsToday": "Actes du jour",
      "dashboard.level": "Niveau",
      "dashboard.totalPoints": "Points Totaux",
      "dashboard.ayahOfDay": "Verset du Jour",
      "dashboard.todaysActs": "Actes du Jour pour Allah",
      "dashboard.open": "Ouvrir",
      "dashboard.quizOfDay": "Quiz du Jour",
      "dashboard.testKnowledge": "Testez vos connaissances",
      "dashboard.quizDescription": "Quiz quotidien • Optionnel • +5 Points",
      "dashboard.quickAccess": "Accès Rapide",
      "dashboard.niyyahDisclaimer": "Votre niyyah est ce qui compte — les points ne sont qu'un outil pour vous aider à rester constant.",

      // Acts
      "acts.salah": "Salat",
      "acts.quran": "Coran",
      "acts.goodDeed": "Bonne Action",
      "acts.sadaqah": "Sadaqa",

      // Profile
      "profile.title": "Profil",
      "profile.settings": "Paramètres du Profil",
      "profile.displayName": "Nom d'affichage",
      "profile.preferences": "Préférences",
      "profile.darkMode": "Mode Sombre",
      "profile.dataManagement": "Gestion des Données",
      "profile.resetData": "Réinitialiser les Données",
      "profile.resetConfirm": "Êtes-vous sûr ? Cela supprimera toutes vos données et ne peut pas être annulé.",
      "profile.anonymous": "Vous utilisez NAJA en mode invité. Toutes les données sont stockées localement sur votre appareil.",
      "profile.deviceId": "ID de l'Appareil",
      "profile.achievements": "Réalisations",
      "profile.progress": "Progrès",
      "profile.leaderboard": "Classement",
      "profile.totalPoints": "Points Totaux",
      "profile.bestStreak": "Meilleure Série",
      "profile.days": "jours",
      "profile.language": "Langue",
      "profile.english": "English",
      "profile.french": "Français",

      // Quran
      "quran.title": "Coran",
      "quran.read": "Lire",
      "quran.surahs": "Sourates",
      "quran.hifdh": "Hifdh",
      "quran.khatam": "Khatam",
      "quran.continueReading": "Continuer la Lecture",
      "quran.verse": "Verset",
      "quran.todayReading": "Lecture du Jour",
      "quran.pages": "pages",
      "quran.dailyGoal": "de l'objectif quotidien",
      "quran.changeGoal": "Changer l'objectif",
      "quran.setDailyGoal": "Définir l'Objectif Quotidien",
      "quran.bookmarks": "Favoris",
      "quran.totalPages": "Pages Totales",
      "quran.khatamsCompleted": "Khatams Terminés",
      "quran.currentProgress": "Progrès Actuel",
      "quran.aboutSurah": "À propos de cette Sourate",
      "quran.wordByWord": "Mot à mot",
      "quran.verses": "versets",
      "quran.revealed": "Révélée à",
      "quran.meccan": "La Mecque",
      "quran.medinan": "Médine",
      "quran.tafsir": "Tafsir",
      "quran.setAsCurrent": "Définir comme actuel",
      "quran.readingPositionSaved": "Position de lecture enregistrée",
      "quran.notStarted": "Non commencé",
      "quran.memorizing": "En mémorisation",
      "quran.solid": "Mémorisé",
      "quran.page": "Page",
      "quran.juz": "Juz",
      "quran.searchSurahs": "Rechercher des sourates...",
      "quran.allSurahs": "Toutes les Sourates",
      "quran.markAllMemorizing": "Tout marquer En cours",
      "quran.markAllSolid": "Tout marquer Mémorisé",
      "quran.surahProgress": "Progrès de la Sourate",
      "quran.summary": "Résumé",

      // Learn
      "learn.title": "Apprendre",
      "learn.dailyQuiz": "Quiz Quotidien",
      "learn.testKnowledge": "Testez vos connaissances aujourd'hui",
      "learn.learningPath": "Parcours d'Apprentissage",
      "learn.badges": "badges",
      "learn.achievements": "Réalisations",
      "learn.badgesEarned": "badges gagnés",
      "learn.viewAll": "Voir Tout",
      "learn.locked": "Verrouillé",
      "learn.completeQuiz": "Complétez le quiz du module pour débloquer le suivant",
      "learn.moduleQuiz": "Quiz du Module",
      "learn.passToUnlock": "Obtenez 70% ou plus pour débloquer le module suivant",
      "learn.question": "Question",
      "learn.of": "sur",
      "learn.checkAnswer": "Vérifier la Réponse",
      "learn.correct": "Correct !",
      "learn.incorrect": "Incorrect",
      "learn.quizComplete": "Quiz Terminé !",
      "learn.yourScore": "Votre Score",
      "learn.passed": "Réussi ! Module suivant débloqué.",
      "learn.failed": "Il faut 70% pour réussir. Réessayez !",
      "learn.retryQuiz": "Réessayer le Quiz",
      "learn.continueLesson": "Continuer la Leçon",
      "learn.lessonComplete": "Leçon Terminée",
      "learn.newModuleUnlocked": "Nouveau module débloqué",

      // Dua
      "dua.library": "Bibliothèque de Douas",
      "dua.builder": "Créateur de Doua",
      "dua.guided": "Doua Guidée",
      "dua.writeOwn": "Écrivez votre Doua",
      "dua.writeOwnDesc": "Doua libre avec sujet optionnel",
      "dua.guidedDesc": "Étape par étape avec assistance IA",
      "dua.chooseMethod": "Choisissez comment créer votre doua",
      "dua.search": "Rechercher des douas...",
      "dua.all": "Tout",
      "dua.folders": "Dossiers",
      "dua.favorites": "Favoris",
      "dua.noFolders": "Pas encore de dossiers",
      "dua.noDuas": "Pas encore de douas",
      "dua.noFavorites": "Pas encore de douas favorites",
      "dua.createFirst": "Créez votre première doua",
      "dua.createFolder": "Créer un dossier",
      "dua.folderName": "Nom du dossier ?",
      "dua.folderCreated": "Dossier créé",
      "dua.duaSaved": "Doua enregistrée",
      "dua.duaDeleted": "Doua supprimée",
      "dua.folderDeleted": "Dossier supprimé",
      "dua.deleteFolder": "Supprimer le dossier",
      "dua.noDuasInFolder": "Pas de douas dans ce dossier",
      "dua.saveDua": "Enregistrer la Doua",
      "dua.addToFavorites": "Ajouter aux favoris",
      "dua.selectFolder": "Sélectionner un dossier (optionnel)",
      "dua.noFolder": "Pas de dossier",
      "dua.orCreateNew": "Ou créer un nouveau dossier",
      "dua.topic": "Sujet",
      "dua.topicOptional": "Sujet (optionnel)",
      "dua.yourDua": "Votre doua",
      "dua.placeholder": "Ya Allah, je Te demande...",
      "dua.continueToSave": "Continuer pour Enregistrer",

      // Dhikr
      "dhikr.title": "Dhikr",
      "dhikr.counter": "Compteur",
      "dhikr.target": "Objectif",
      "dhikr.completed": "Terminé",
      "dhikr.reset": "Réinitialiser",

      // Journal
      "journal.title": "Journal",
      "journal.newEntry": "Nouvelle Entrée",
      "journal.prompt": "Question du Jour",
      "journal.write": "Écrivez votre réflexion...",
      "journal.saved": "Entrée enregistrée",
      "journal.deleted": "Entrée supprimée",

      // Fintech
      "fintech.title": "Finance Halal",

      // Quiz
      "quiz.title": "Quiz Quotidien",
      "quiz.complete": "Quiz Terminé !",
      "quiz.score": "Score",
      "quiz.pointsEarned": "Points gagnés",

      // Achievements
      "achievements.title": "Réalisations",
      "achievements.earned": "Gagnées",
      "achievements.locked": "Verrouillées",

      // Progress
      "progress.title": "Progrès",

      // Dates
      "dates.title": "Dates Islamiques",

      // Toasts
      "toast.saved": "Enregistré",
      "toast.deleted": "Supprimé",
      "toast.error": "Erreur",
      "toast.success": "Succès",
      "toast.pointsEarned": "+{{points}} Points de Baraka",
      "toast.dailyGoalAchieved": "Objectif quotidien atteint. MashAllah !",
      "toast.khatamCompleted": "Khatam terminé. MashAllah !",
      "toast.juzCompleted": "Juz {{juz}} terminé",
      "toast.goalSet": "Objectif quotidien défini à {{goal}} pages",

      // Empty States
      "empty.noDuas": "Pas encore de douas",
      "empty.noEntries": "Pas encore d'entrées",
      "empty.noBookmarks": "Pas encore de favoris",
    }
  }
};

// Get stored language or default to English
const getStoredLanguage = (): string => {
  try {
    return localStorage.getItem(STORAGE_KEY) || 'en';
  } catch {
    return 'en';
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getStoredLanguage(),
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

// Function to change language and persist
export const changeLanguage = (lang: string) => {
  localStorage.setItem(STORAGE_KEY, lang);
  i18n.changeLanguage(lang);
};

export const getCurrentLanguage = (): string => {
  return i18n.language || 'en';
};

export default i18n;
