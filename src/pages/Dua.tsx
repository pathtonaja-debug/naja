import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Heart, Search, ChevronLeft, X, 
  Sparkles, Trash2, Folder, FolderPlus, MoreVertical, Pencil, BookOpen
} from 'lucide-react';
import { TopBar } from '@/components/ui/top-bar';
import BottomNav from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { 
  getDuas, addDua as addLocalDua, updateDua as updateLocalDua, deleteDua as deleteLocalDua,
  getDuaFolders, addDuaFolder as addLocalDuaFolder, deleteDuaFolder as deleteLocalDuaFolder,
  LocalDua, LocalDuaFolder,
  addBarakahPoints, BARAKAH_REWARDS
} from '@/services/localStore';
import { GuidedDuaWizard, GuidedDuaState } from '@/components/dua/GuidedDuaWizard';
import { WriteOwnDua } from '@/components/dua/WriteOwnDua';
import { SaveDuaSheet } from '@/components/dua/SaveDuaSheet';
import { DUA_TOPICS } from '@/data/duaTopics';

type ViewMode = 'library' | 'builder-choice' | 'guided' | 'write-own';
type LibraryTab = 'all' | 'folders' | 'favorites';

const Dua = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>('library');
  const [libraryTab, setLibraryTab] = useState<LibraryTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Data
  const [folders, setFolders] = useState<LocalDuaFolder[]>([]);
  const [duas, setDuas] = useState<LocalDua[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // UI state
  const [selectedDua, setSelectedDua] = useState<LocalDua | null>(null);
  const [expandedFolderId, setExpandedFolderId] = useState<string | null>(null);
  const [showSaveSheet, setShowSaveSheet] = useState(false);
  const [pendingDua, setPendingDua] = useState<{ topic: string; finalText: string; state?: GuidedDuaState } | null>(null);

  // Load data from local storage
  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setIsLoading(true);
    try {
      const localFolders = getDuaFolders();
      const localDuas = getDuas();
      setFolders(localFolders);
      setDuas(localDuas);
    } catch (err) {
      console.error('Error loading data:', err);
      toast.error('Failed to load duas');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuidedComplete = (state: GuidedDuaState) => {
    const topicLabel = state.topic === 'other' 
      ? state.customTopic 
      : DUA_TOPICS.find(t => t.id === state.topic)?.label || 'Custom';
    
    setPendingDua({
      topic: topicLabel,
      finalText: state.finalText,
      state,
    });
    setShowSaveSheet(true);
  };

  const handleWriteOwnComplete = (data: { topic: string; finalText: string }) => {
    setPendingDua(data);
    setShowSaveSheet(true);
  };

  const handleSaveDua = (folderId: string | null, isFavorite: boolean) => {
    if (!pendingDua) return;

    try {
      const newDua = addLocalDua({
        title: pendingDua.topic,
        topic: pendingDua.topic,
        folder_id: folderId,
        final_text: pendingDua.finalText,
        is_favorite: isFavorite,
        selected_names: pendingDua.state?.selectedNames.map(n => n.transliteration) || [],
        request_text: pendingDua.state?.requestText || null,
        ummah_prayers: pendingDua.state?.ummahPrayers || [],
        include_salawat: pendingDua.state?.includeSalawat || false,
      });

      setDuas(prev => [newDua, ...prev]);
      setShowSaveSheet(false);
      setPendingDua(null);
      setViewMode('library');
      
      // Award points for creating dua
      addBarakahPoints(BARAKAH_REWARDS.DUA_CREATED);
      
      toast.success('Dua saved! ✨');
    } catch (err) {
      console.error('Error saving dua:', err);
      toast.error('Failed to save dua');
    }
  };

  const handleCreateFolder = (name: string): LocalDuaFolder => {
    const newFolder = addLocalDuaFolder(name);
    setFolders(prev => [newFolder, ...prev]);
    return newFolder;
  };

  const toggleFavorite = (duaId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    
    const dua = duas.find(d => d.id === duaId);
    if (!dua) return;

    try {
      updateLocalDua(duaId, { is_favorite: !dua.is_favorite });
      setDuas(prev => prev.map(d => 
        d.id === duaId ? { ...d, is_favorite: !d.is_favorite } : d
      ));

      if (selectedDua?.id === duaId) {
        setSelectedDua(prev => prev ? { ...prev, is_favorite: !prev.is_favorite } : null);
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
      toast.error('Failed to update favorite');
    }
  };

  const deleteDua = (duaId: string) => {
    try {
      deleteLocalDua(duaId);
      setDuas(prev => prev.filter(d => d.id !== duaId));
      setSelectedDua(null);
      toast.success('Dua deleted');
    } catch (err) {
      console.error('Error deleting dua:', err);
      toast.error('Failed to delete dua');
    }
  };

  const deleteFolder = (folderId: string) => {
    try {
      deleteLocalDuaFolder(folderId);
      setFolders(prev => prev.filter(f => f.id !== folderId));
      setDuas(prev => prev.map(d => d.folder_id === folderId ? { ...d, folder_id: null } : d));
      toast.success('Folder deleted');
    } catch (err) {
      console.error('Error deleting folder:', err);
      toast.error('Failed to delete folder');
    }
  };

  // Filter duas based on tab and search
  const filteredDuas = duas.filter(d => {
    const matchesSearch = !searchQuery || 
      d.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.final_text?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (libraryTab === 'favorites') return d.is_favorite && matchesSearch;
    if (libraryTab === 'folders') return d.folder_id && matchesSearch;
    return matchesSearch;
  });

  const getDuasInFolder = (folderId: string) => duas.filter(d => d.folder_id === folderId);

  // Render based on view mode
  if (viewMode === 'guided') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-background flex flex-col"
      >
        <TopBar 
          title="Guided Dua" 
          leftElement={
            <button onClick={() => setViewMode('builder-choice')} className="p-2 -ml-2">
              <ChevronLeft className="w-5 h-5" />
            </button>
          }
        />
        <div className="flex-1">
          <GuidedDuaWizard
            onComplete={handleGuidedComplete}
            onCancel={() => setViewMode('builder-choice')}
          />
        </div>
      </motion.div>
    );
  }

  if (viewMode === 'write-own') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-background flex flex-col"
      >
        <TopBar 
          title="Write Your Dua" 
          leftElement={
            <button onClick={() => setViewMode('builder-choice')} className="p-2 -ml-2">
              <ChevronLeft className="w-5 h-5" />
            </button>
          }
        />
        <div className="flex-1">
          <WriteOwnDua
            onComplete={handleWriteOwnComplete}
            onCancel={() => setViewMode('builder-choice')}
          />
        </div>
      </motion.div>
    );
  }

  if (viewMode === 'builder-choice') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-background pb-24"
      >
        <TopBar 
          title="Dua Builder" 
          leftElement={
            <button onClick={() => setViewMode('library')} className="p-2 -ml-2">
              <ChevronLeft className="w-5 h-5" />
            </button>
          }
        />

        <div className="px-4 py-6 space-y-4">
          <p className="text-muted-foreground text-center mb-6">
            Choose how you'd like to create your dua
          </p>

          <button
            onClick={() => setViewMode('write-own')}
            className="w-full p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all text-left"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
                <Pencil className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Write Your Own</h3>
                <p className="text-sm text-muted-foreground">Free text dua with optional topic</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setViewMode('guided')}
            className="w-full p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all text-left"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Guided Dua</h3>
                <p className="text-sm text-muted-foreground">Step-by-step with AI assistance</p>
              </div>
            </div>
          </button>
        </div>

        <BottomNav />
      </motion.div>
    );
  }

  // Library view
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background pb-24"
    >
      <TopBar 
        title="Dua Library" 
        leftElement={
          <button onClick={() => navigate(-1)} className="p-2 -ml-2">
            <ChevronLeft className="w-5 h-5" />
          </button>
        }
        rightElement={
          <button 
            onClick={() => setViewMode('builder-choice')}
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

      {/* Tabs */}
      <div className="px-4 pb-4">
        <div className="flex gap-2">
          {(['all', 'folders', 'favorites'] as LibraryTab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setLibraryTab(tab)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5",
                libraryTab === tab
                  ? "bg-secondary text-secondary-foreground"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {tab === 'favorites' && <Heart className="w-3.5 h-3.5" />}
              {tab === 'folders' && <Folder className="w-3.5 h-3.5" />}
              {tab === 'all' && <BookOpen className="w-3.5 h-3.5" />}
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Content based on tab */}
      <div className="px-4 space-y-4">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-muted-foreground">Loading...</p>
          </div>
        ) : libraryTab === 'folders' ? (
          // Folders view
          <div className="space-y-3">
            {folders.length === 0 ? (
              <div className="text-center py-12">
                <FolderPlus className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground">No folders yet</p>
                <p className="text-sm text-muted-foreground">Folders are created when you save a dua</p>
              </div>
            ) : (
              folders.map(folder => (
                <div key={folder.id} className="rounded-2xl bg-card border border-border overflow-hidden">
                  <button
                    onClick={() => setExpandedFolderId(expandedFolderId === folder.id ? null : folder.id)}
                    className="w-full p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <Folder className="w-5 h-5 text-secondary" />
                      <span className="font-medium">{folder.name}</span>
                      <span className="text-xs text-muted-foreground">
                        ({getDuasInFolder(folder.id).length})
                      </span>
                    </div>
                    <ChevronLeft className={cn(
                      "w-4 h-4 transition-transform",
                      expandedFolderId === folder.id ? "-rotate-90" : "rotate-180"
                    )} />
                  </button>
                  
                  <AnimatePresence>
                    {expandedFolderId === folder.id && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        className="overflow-hidden border-t border-border"
                      >
                        <div className="p-3 space-y-2">
                          {getDuasInFolder(folder.id).map(dua => (
                            <DuaCard
                              key={dua.id}
                              dua={dua}
                              onClick={() => setSelectedDua(dua)}
                              onFavorite={(e) => toggleFavorite(dua.id, e)}
                            />
                          ))}
                          {getDuasInFolder(folder.id).length === 0 && (
                            <p className="text-sm text-muted-foreground text-center py-4">
                              No duas in this folder
                            </p>
                          )}
                          <button
                            onClick={() => deleteFolder(folder.id)}
                            className="w-full py-2 text-sm text-destructive hover:underline"
                          >
                            Delete folder
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))
            )}
          </div>
        ) : (
          // All / Favorites view
          <div className="space-y-3">
            {filteredDuas.length === 0 ? (
              <div className="text-center py-12">
                <Sparkles className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground">
                  {libraryTab === 'favorites' ? 'No favorite duas yet' : 'No duas yet'}
                </p>
                <Button 
                  onClick={() => setViewMode('builder-choice')}
                  variant="outline" 
                  className="mt-3"
                >
                  Create your first dua
                </Button>
              </div>
            ) : (
              filteredDuas.map(dua => (
                <DuaCard
                  key={dua.id}
                  dua={dua}
                  onClick={() => setSelectedDua(dua)}
                  onFavorite={(e) => toggleFavorite(dua.id, e)}
                  showFolder={libraryTab === 'all'}
                  folderName={folders.find(f => f.id === dua.folder_id)?.name}
                />
              ))
            )}
          </div>
        )}
      </div>

      {/* Dua Detail Modal */}
      <AnimatePresence>
        {selectedDua && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end"
            onClick={() => setSelectedDua(null)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="bg-background w-full rounded-t-3xl max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-background z-10 px-4 py-4 border-b border-border flex items-center justify-between">
                <h2 className="font-semibold text-lg">{selectedDua.title}</h2>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={(e) => toggleFavorite(selectedDua.id, e)}
                    className="p-2"
                  >
                    <Heart className={cn(
                      "w-5 h-5",
                      selectedDua.is_favorite ? "fill-red-500 text-red-500" : "text-muted-foreground"
                    )} />
                  </button>
                  <button 
                    onClick={() => {
                      deleteDua(selectedDua.id);
                    }}
                    className="p-2 text-destructive"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <button onClick={() => setSelectedDua(null)} className="p-2">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="p-4">
                <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                  {selectedDua.final_text}
                </p>
                
                {selectedDua.selected_names && selectedDua.selected_names.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-2">Names of Allah used:</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedDua.selected_names.map((name, i) => (
                        <span key={i} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                          {name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Save Sheet */}
      <SaveDuaSheet
        isOpen={showSaveSheet}
        onClose={() => {
          setShowSaveSheet(false);
          setPendingDua(null);
        }}
        onSave={handleSaveDua}
        folders={folders}
        onFolderCreated={handleCreateFolder}
      />

      <BottomNav />
    </motion.div>
  );
};

// Dua Card Component
interface DuaCardProps {
  dua: LocalDua;
  onClick: () => void;
  onFavorite: (e: React.MouseEvent) => void;
  showFolder?: boolean;
  folderName?: string;
}

const DuaCard = ({ dua, onClick, onFavorite, showFolder, folderName }: DuaCardProps) => (
  <button
    onClick={onClick}
    className="w-full p-4 rounded-2xl bg-card border border-border text-left hover:border-primary/30 transition-all"
  >
    <div className="flex items-start justify-between gap-3">
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-foreground truncate">{dua.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
          {dua.final_text}
        </p>
        {showFolder && folderName && (
          <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
            <Folder className="w-3 h-3" />
            <span>{folderName}</span>
          </div>
        )}
      </div>
      <button
        onClick={onFavorite}
        className="p-1.5 -mr-1.5 -mt-0.5"
      >
        <Heart className={cn(
          "w-4 h-4",
          dua.is_favorite ? "fill-red-500 text-red-500" : "text-muted-foreground"
        )} />
      </button>
    </div>
  </button>
);

export default Dua;
