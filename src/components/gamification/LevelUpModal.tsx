import { motion, AnimatePresence } from 'framer-motion';
import { Star, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LevelUpModalProps {
  isOpen: boolean;
  newLevel: number;
  onClose: () => void;
}

export const LevelUpModal = ({ isOpen, newLevel, onClose }: LevelUpModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="bg-card border border-border rounded-3xl p-6 max-w-sm w-full relative"
            onClick={e => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Content */}
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Star className="w-10 h-10 text-primary fill-primary" />
              </div>

              <h2 className="text-2xl font-bold text-foreground mb-2">
                Level Up!
              </h2>

              <div className="text-6xl font-bold text-primary mb-2">
                {newLevel}
              </div>

              <p className="text-muted-foreground text-sm mb-6">
                MashAllah! You've reached a new level. Keep up the great work!
              </p>

              <Button onClick={onClose} className="w-full">
                Continue
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
