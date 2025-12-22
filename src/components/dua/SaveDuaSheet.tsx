import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Heart, Folder, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { LocalDuaFolder } from '@/services/localStore';

interface SaveDuaSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (folderId: string | null, isFavorite: boolean) => void;
  folders: LocalDuaFolder[];
  onFolderCreated: (name: string) => LocalDuaFolder;
  initialFavorite?: boolean;
}

export function SaveDuaSheet({
  isOpen,
  onClose,
  onSave,
  folders,
  onFolderCreated,
  initialFavorite = false,
}: SaveDuaSheetProps) {
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(initialFavorite);
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) {
      toast.error('Please enter a folder name');
      return;
    }

    try {
      const newFolder = onFolderCreated(newFolderName.trim());
      setSelectedFolderId(newFolder.id);
      setNewFolderName('');
      setShowNewFolder(false);
      toast.success('Folder created!');
    } catch (err) {
      console.error('Error creating folder:', err);
      toast.error('Failed to create folder');
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25 }}
        className="w-full max-w-lg bg-background rounded-t-3xl p-6 max-h-[70vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Save Dua</h2>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Favorite toggle */}
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className={cn(
            "w-full p-4 rounded-xl border mb-4 flex items-center justify-between transition-all",
            isFavorite ? "bg-primary/10 border-primary" : "bg-card border-border"
          )}
        >
          <span className="font-medium">Add to Favorites</span>
          <Heart className={cn("w-5 h-5", isFavorite && "fill-primary text-primary")} />
        </button>

        {/* Folder selection */}
        <div className="mb-4">
          <h3 className="text-sm font-medium mb-2">Choose a folder (optional)</h3>
          <div className="space-y-2">
            <button
              onClick={() => setSelectedFolderId(null)}
              className={cn(
                "w-full p-3 rounded-xl border flex items-center gap-2 transition-all",
                selectedFolderId === null ? "bg-secondary/20 border-secondary" : "bg-card border-border"
              )}
            >
              <Folder className="w-4 h-4" />
              No folder
            </button>

            {folders.map(folder => (
              <button
                key={folder.id}
                onClick={() => setSelectedFolderId(folder.id)}
                className={cn(
                  "w-full p-3 rounded-xl border flex items-center gap-2 transition-all",
                  selectedFolderId === folder.id ? "bg-secondary/20 border-secondary" : "bg-card border-border"
                )}
              >
                <Folder className="w-4 h-4" />
                {folder.name}
              </button>
            ))}

            {showNewFolder ? (
              <div className="flex gap-2">
                <Input
                  placeholder="Folder name..."
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  autoFocus
                />
                <Button onClick={handleCreateFolder}>
                  Add
                </Button>
                <Button variant="outline" onClick={() => setShowNewFolder(false)}>
                  Cancel
                </Button>
              </div>
            ) : (
              <button
                onClick={() => setShowNewFolder(true)}
                className="w-full p-3 rounded-xl border border-dashed border-muted-foreground/30 flex items-center justify-center gap-2 text-muted-foreground hover:border-primary hover:text-primary transition-all"
              >
                <Plus className="w-4 h-4" />
                Create new folder
              </button>
            )}
          </div>
        </div>

        <Button
          onClick={() => onSave(selectedFolderId, isFavorite)}
          className="w-full"
        >
          Save Dua
        </Button>
      </motion.div>
    </motion.div>
  );
}
