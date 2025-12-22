// Sadaqah (charity) types and tracking data

export interface SadaqahType {
  id: string;
  name: string;
  arabicName: string;
  description: string;
  examples: string[];
  reward: string;
  icon: string;
  color: string;
}

export const SADAQAH_TYPES: SadaqahType[] = [
  {
    id: 'money',
    name: 'Monetary Sadaqah',
    arabicName: 'صدقة المال',
    description: 'Giving money to those in need, charities, or causes for the sake of Allah.',
    examples: [
      'Donating to orphanages',
      'Supporting masjid projects',
      'Giving to the poor directly',
      'Contributing to emergency relief',
      'Sponsoring a student\'s education'
    ],
    reward: 'The Prophet ﷺ said: "Charity does not decrease wealth."',
    icon: '💰',
    color: 'bg-success/10 border-success/20 text-success'
  },
  {
    id: 'food',
    name: 'Feeding Others',
    arabicName: 'إطعام الطعام',
    description: 'Providing food to the hungry, whether through cooking, buying meals, or food donations.',
    examples: [
      'Feeding a fasting person at iftar',
      'Donating to food banks',
      'Cooking for neighbors',
      'Providing meals to the homeless',
      'Hosting guests for dinner'
    ],
    reward: 'The Prophet ﷺ said: "Whoever feeds a fasting person will have a reward like his."',
    icon: '🍽️',
    color: 'bg-warn/10 border-warn/20 text-warn'
  },
  {
    id: 'smile',
    name: 'Smiling & Kind Words',
    arabicName: 'التبسم والكلمة الطيبة',
    description: 'A smile, kind word, or good advice given sincerely is also an act of charity.',
    examples: [
      'Smiling at your brother/sister',
      'Saying a kind word',
      'Giving sincere advice',
      'Encouraging someone',
      'Speaking gently to parents'
    ],
    reward: 'The Prophet ﷺ said: "Your smile to your brother is charity."',
    icon: '😊',
    color: 'bg-primary/10 border-primary/20 text-primary'
  },
  {
    id: 'help',
    name: 'Helping Others',
    arabicName: 'مساعدة الآخرين',
    description: 'Physical assistance to those who need help, whether lifting something, fixing something, or running errands.',
    examples: [
      'Helping an elderly person cross the street',
      'Carrying groceries for someone',
      'Helping a colleague with their work',
      'Volunteering at community events',
      'Teaching someone a skill'
    ],
    reward: 'The Prophet ﷺ said: "Helping a person with his riding animal is charity."',
    icon: '🤝',
    color: 'bg-accent/10 border-accent/20 text-accent'
  },
  {
    id: 'remove_harm',
    name: 'Removing Harm',
    arabicName: 'إماطة الأذى',
    description: 'Removing obstacles, trash, or anything harmful from paths that people use.',
    examples: [
      'Picking up trash from the street',
      'Moving obstacles from walkways',
      'Fixing a pothole or broken step',
      'Clearing fallen branches',
      'Removing glass from roads'
    ],
    reward: 'The Prophet ﷺ said: "Removing something harmful from the road is charity."',
    icon: '🧹',
    color: 'bg-secondary/10 border-secondary/20 text-secondary'
  },
  {
    id: 'knowledge',
    name: 'Sharing Knowledge',
    arabicName: 'نشر العلم',
    description: 'Teaching others beneficial knowledge, whether religious or worldly, is a continuing charity.',
    examples: [
      'Teaching Quran',
      'Helping with homework',
      'Sharing useful articles',
      'Teaching a skill',
      'Giving a beneficial lecture'
    ],
    reward: 'The Prophet ﷺ said: "When a person dies, their deeds end except for three: ongoing charity, knowledge that benefits others, or a righteous child who prays for them."',
    icon: '📚',
    color: 'bg-info/10 border-info/20 text-info'
  },
  {
    id: 'dua',
    name: 'Making Dua for Others',
    arabicName: 'الدعاء للآخرين',
    description: 'Praying for your brothers and sisters in Islam, whether in their presence or absence.',
    examples: [
      'Praying for a sick person',
      'Asking Allah to bless someone',
      'Praying for the ummah',
      'Making dua for parents',
      'Remembering the deceased in prayers'
    ],
    reward: 'The Prophet ﷺ said: "The supplication of a Muslim for his brother in his absence is answered."',
    icon: '🤲',
    color: 'bg-primary/10 border-primary/20 text-primary'
  },
  {
    id: 'visit_sick',
    name: 'Visiting the Sick',
    arabicName: 'عيادة المريض',
    description: 'Visiting someone who is ill to comfort them and pray for their recovery.',
    examples: [
      'Visiting a sick neighbor',
      'Calling to check on someone unwell',
      'Bringing food or gifts to the sick',
      'Sitting with them and making dua',
      'Offering practical help'
    ],
    reward: 'The Prophet ﷺ said: "When a Muslim visits a sick Muslim at dawn, 70,000 angels keep praying for them till evening."',
    icon: '🏥',
    color: 'bg-secondary/10 border-secondary/20 text-secondary'
  },
  {
    id: 'reconciliation',
    name: 'Reconciling People',
    arabicName: 'الإصلاح بين الناس',
    description: 'Bringing people together who have disputes or conflicts, and helping them reconcile.',
    examples: [
      'Mediating between arguing friends',
      'Helping family members reconcile',
      'Resolving workplace conflicts',
      'Encouraging forgiveness',
      'Being a peacemaker'
    ],
    reward: 'The Prophet ﷺ said: "Shall I not inform you of something more excellent than fasting, prayer, and charity? It is reconciling people."',
    icon: '🕊️',
    color: 'bg-accent/10 border-accent/20 text-accent'
  },
  {
    id: 'dhikr',
    name: 'Remembrance of Allah',
    arabicName: 'ذكر الله',
    description: 'Every SubhanAllah, Alhamdulillah, La ilaha illallah, and Allahu Akbar is charity.',
    examples: [
      'Saying SubhanAllah',
      'Saying Alhamdulillah',
      'Saying Allahu Akbar',
      'Reciting istighfar',
      'Sending salawat on the Prophet ﷺ'
    ],
    reward: 'The Prophet ﷺ said: "Every tasbeeh (SubhanAllah) is a charity, every takbeer (Allahu Akbar) is a charity, every tahmeed (Alhamdulillah) is a charity, every tahleel (La ilaha illallah) is a charity."',
    icon: '📿',
    color: 'bg-success/10 border-success/20 text-success'
  },
];

export interface SadaqahLog {
  id: string;
  typeId: string;
  date: string;
  note?: string;
  amount?: number; // For monetary sadaqah
}
