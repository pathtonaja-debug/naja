import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Heart, Search, ChevronLeft, X, 
  Sparkles, Trash2
} from 'lucide-react';
import { TopBar } from '@/components/ui/top-bar';
import BottomNav from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface Dua {
  id: string;
  title: string;
  arabic?: string;
  transliteration?: string;
  translation: string;
  category: string;
  isFavorite: boolean;
  createdAt: string;
}

const CATEGORIES = [
  { id: 'morning', label: 'Morning', emoji: '🌅' },
  { id: 'evening', label: 'Evening', emoji: '🌙' },
  { id: 'protection', label: 'Protection', emoji: '🛡️' },
  { id: 'gratitude', label: 'Gratitude', emoji: '🙏' },
  { id: 'guidance', label: 'Guidance', emoji: '✨' },
  { id: 'health', label: 'Health', emoji: '💚' },
  { id: 'family', label: 'Family', emoji: '👨‍👩‍👧' },
  { id: 'custom', label: 'Custom', emoji: '📝' },
];

const SAMPLE_DUAS: Dua[] = [
  {
    id: '1',
    title: 'Before Sleeping',
    arabic: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
    transliteration: 'Bismika Allahumma amutu wa ahya',
    translation: 'In Your name, O Allah, I die and I live.',
    category: 'evening',
    isFavorite: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Upon Waking',
    arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
    transliteration: "Alhamdu lillahil-lathee ahyana ba'da ma amatana wa ilayhin-nushoor",
    translation: 'All praise is for Allah who gave us life after having taken it from us and unto Him is the resurrection.',
    category: 'morning',
    isFavorite: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'For Protection',
    arabic: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ',
    transliteration: "Bismillahil-ladhi la yadurru ma'asmihi shay'un fil-ardi wa la fis-sama'",
    translation: 'In the name of Allah, with whose name nothing can harm on earth or in heaven.',
    category: 'protection',
    isFavorite: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Before Eating',
    arabic: 'بِسْمِ اللَّهِ وَعَلَى بَرَكَةِ اللَّهِ',
    transliteration: 'Bismillahi wa ala barakatillah',
    translation: 'In the name of Allah and with the blessings of Allah.',
    category: 'gratitude',
    isFavorite: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '5',
    title: 'For Guidance',
    arabic: 'اللَّهُمَّ اهْدِنِي وَسَدِّدْنِي',
    transliteration: 'Allahumma-hdini wa saddidni',
    translation: 'O Allah, guide me and keep me on the straight path.',
    category: 'guidance',
    isFavorite: false,
    createdAt: new Date().toISOString(),
  },
];

const Dua = () => {
  const navigate = useNavigate();
  const [duas, setDuas] = useState<Dua[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDua, setSelectedDua] = useState<Dua | null>(null);
  const [newDua, setNewDua] = useState({
    title: '',
    arabic: '',
    transliteration: '',
    translation: '',
    category: 'custom',
  });

  useEffect(() => {
    const stored = localStorage.getItem('naja_duas');
    if (stored) {
      setDuas(JSON.parse(stored));
    } else {
      setDuas(SAMPLE_DUAS);
      localStorage.setItem('naja_duas', JSON.stringify(SAMPLE_DUAS));
    }
  }, []);

  const saveDuas = (newDuas: Dua[]) => {
    setDuas(newDuas);
    localStorage.setItem('naja_duas', JSON.stringify(newDuas));
  };

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = duas.map(d => 
      d.id === id ? { ...d, isFavorite: !d.isFavorite } : d
    );
    saveDuas(updated);
  };

  const addDua = () => {
    if (!newDua.title || !newDua.translation) {
      toast.error('Please add a title and translation');
      return;
    }

    const dua: Dua = {
      id: Date.now().toString(),
      ...newDua,
      isFavorite: false,
      createdAt: new Date().toISOString(),
    };

    saveDuas([dua, ...duas]);
    setNewDua({ title: '', arabic: '', transliteration: '', translation: '', category: 'custom' });
    setShowAddModal(false);
    toast.success('Dua added! ✨');
  };

  const deleteDua = (id: string) => {
    saveDuas(duas.filter(d => d.id !== id));
    setSelectedDua(null);
    toast.success('Dua removed');
  };

  const filteredDuas = duas.filter(d => {
    const matchesCategory = !selectedCategory || d.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.translation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const favorites = duas.filter(d => d.isFavorite);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background pb-24"
    >
      <TopBar 
        title="Dua Builder" 
        leftElement={
          <button onClick={() => navigate(-1)} className="p-2 -ml-2">
            <ChevronLeft className="w-5 h-5" />
          </button>
        }
        rightElement={
          <button 
            onClick={() => setShowAddModal(true)}
            className="p-2 rounded-full bg-secondary/20"
          >
            <Plus className="w-5 h-5" />
          </button>
        }
      />

      {/* Search */}
      <div className="px-4 pb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search duas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="px-4 pb-4">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setSelectedCategory(null)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all",
              !selectedCategory 
                ? "bg-secondary text-secondary-foreground" 
                : "bg-muted text-muted-foreground"
            )}
          >
            All
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id === selectedCategory ? null : cat.id)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1",
                selectedCategory === cat.id
                  ? "bg-secondary text-secondary-foreground"
                  : "bg-muted text-muted-foreground"
              )}
            >
              <span>{cat.emoji}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Favorites Section */}
      {favorites.length > 0 && !selectedCategory && !searchQuery && (
        <div className="px-4 pb-4">
          <h2 className="text-sm font-semibold mb-2 flex items-center gap-1">
            <Heart className="w-4 h-4 text-primary fill-primary" />
            Favorites
          </h2>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {favorites.map(dua => (
              <motion.button
                key={dua.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => setSelectedDua(dua)}
                className="min-w-[200px] p-3 rounded-xl bg-primary/10 border border-primary/20 text-left"
              >
                <p className="text-sm font-medium truncate">{dua.title}</p>
                <p className="text-xs text-muted-foreground truncate mt-1">{dua.translation}</p>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Duas List */}
      <div className="px-4 space-y-3">
        <h2 className="text-sm font-semibold">
          {selectedCategory 
            ? CATEGORIES.find(c => c.id === selectedCategory)?.label 
            : 'All Duas'} ({filteredDuas.length})
        </h2>
        
        {filteredDuas.length === 0 ? (
          <div className="text-center py-12">
            <Sparkles className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">No duas found</p>
            <Button 
              onClick={() => setShowAddModal(true)}
              variant="outline" 
              className="mt-3"
            >
              Add your first dua
            </Button>
          </div>
        ) : (
          filteredDuas.map((dua, i) => (
            <motion.div
              key={dua.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-4 rounded-2xl bg-card border border-border shadow-sm cursor-pointer"
              onClick={() => setSelectedDua(dua)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span>{CATEGORIES.find(c => c.id === dua.category)?.emoji || '📝'}</span>
                  <h3 className="font-semibold">{dua.title}</h3>
                </div>
                <button onClick={(e) => toggleFavorite(dua.id, e)}>
                  <Heart className={cn(
                    "w-5 h-5 transition-colors",
                    dua.isFavorite ? "text-primary fill-primary" : "text-muted-foreground"
                  )} />
                </button>
              </div>
              
              {dua.arabic && (
                <p className="text-lg font-arabic text-right mb-2 leading-loose">
                  {dua.arabic}
                </p>
              )}
              
              <p className="text-sm text-muted-foreground line-clamp-2">{dua.translation}</p>
            </motion.div>
          ))
        )}
      </div>

      {/* Dua Detail Modal */}
      <AnimatePresence>
        {selectedDua && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center"
            onClick={() => setSelectedDua(null)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="w-full max-w-lg bg-background rounded-t-3xl p-6 max-h-[85vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{CATEGORIES.find(c => c.id === selectedDua.category)?.emoji}</span>
                  <h2 className="text-lg font-bold">{selectedDua.title}</h2>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => deleteDua(selectedDua.id)}
                    className="p-2 rounded-full hover:bg-destructive/10"
                  >
                    <Trash2 className="w-5 h-5 text-destructive" />
                  </button>
                  <button onClick={() => setSelectedDua(null)}>
                    <X className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>
              </div>

              {selectedDua.arabic && (
                <div className="p-4 rounded-xl bg-muted/50 mb-4">
                  <p className="text-2xl font-arabic text-center leading-loose">
                    {selectedDua.arabic}
                  </p>
                </div>
              )}
              
              {selectedDua.transliteration && (
                <p className="text-sm text-muted-foreground italic text-center mb-4">
                  {selectedDua.transliteration}
                </p>
              )}
              
              <p className="text-base text-center font-medium">"{selectedDua.translation}"</p>

              <div className="flex gap-3 mt-6">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => toggleFavorite(selectedDua.id, {} as any)}
                >
                  <Heart className={cn(
                    "w-4 h-4 mr-2",
                    selectedDua.isFavorite && "fill-primary text-primary"
                  )} />
                  {selectedDua.isFavorite ? 'Favorited' : 'Add to Favorites'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Dua Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="w-full max-w-lg bg-background rounded-t-3xl p-6 max-h-[85vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">Add New Dua</h2>
                <button onClick={() => setShowAddModal(false)}>
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Title *</label>
                  <Input
                    placeholder="e.g., Before eating"
                    value={newDua.title}
                    onChange={(e) => setNewDua({ ...newDua, title: e.target.value })}
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Arabic (optional)</label>
                  <Textarea
                    placeholder="بِسْمِ اللَّهِ"
                    value={newDua.arabic}
                    onChange={(e) => setNewDua({ ...newDua, arabic: e.target.value })}
                    className="mt-1 font-arabic text-right text-lg"
                    dir="rtl"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Transliteration (optional)</label>
                  <Input
                    placeholder="Bismillah"
                    value={newDua.transliteration}
                    onChange={(e) => setNewDua({ ...newDua, transliteration: e.target.value })}
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Translation/Meaning *</label>
                  <Textarea
                    placeholder="In the name of Allah"
                    value={newDua.translation}
                    onChange={(e) => setNewDua({ ...newDua, translation: e.target.value })}
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Category</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => setNewDua({ ...newDua, category: cat.id })}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                          newDua.category === cat.id
                            ? "bg-secondary text-secondary-foreground"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {cat.emoji} {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                <Button onClick={addDua} className="w-full">
                  Save Dua
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav />
    </motion.div>
  );
};

export default Dua;
