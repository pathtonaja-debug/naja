// TEMP in-memory store - swap with Supabase later

interface Reflection {
  id: string;
  date: string;
  text: string;
  prompt?: string;
}

interface Habit {
  id: string;
  name: string;
  completed: boolean;
  streak: number;
}

interface Dua {
  id: string;
  title: string;
  category: string;
  content: string;
}

let reflections: Reflection[] = [
  { id: '1', date: '2025-01-11', text: 'Alhamdulillah for another beautiful day...', prompt: 'Morning Gratitude' }
];

let habits: Habit[] = [
  { id: '1', name: 'Salah on Time', completed: true, streak: 7 },
  { id: '2', name: 'Dhikr 33×', completed: true, streak: 5 },
  { id: '3', name: "Qur'an 2 Pages", completed: false, streak: 3 },
  { id: '4', name: 'Gratitude Note', completed: false, streak: 12 }
];

let duas: Dua[] = [
  { id: '1', title: 'Morning Protection', category: 'Protection', content: '' },
  { id: '2', title: 'Gratitude Dua', category: 'Gratitude', content: '' },
  { id: '3', title: 'Patience & Strength', category: 'Patience', content: '' },
  { id: '4', title: 'Healing Dua', category: 'Healing', content: '' }
];

// Reflections
export async function addReflection(entry: { date: string; text: string; prompt?: string }) {
  const newReflection = { id: Date.now().toString(), ...entry };
  reflections.unshift(newReflection);
  return newReflection;
}

export async function listReflections() {
  await new Promise(resolve => setTimeout(resolve, 100));
  return reflections;
}

// Habits
export async function listHabits() {
  await new Promise(resolve => setTimeout(resolve, 100));
  return habits;
}

export async function toggleHabit(id: string) {
  const habit = habits.find(h => h.id === id);
  if (habit) {
    habit.completed = !habit.completed;
    if (habit.completed) {
      habit.streak += 1;
    }
  }
  return habits;
}

// Duas
export async function listDuas() {
  await new Promise(resolve => setTimeout(resolve, 100));
  return duas;
}

export async function saveDua(dua: Omit<Dua, 'id'>) {
  const newDua = { id: Date.now().toString(), ...dua };
  duas.unshift(newDua);
  return newDua;
}
