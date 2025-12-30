import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { getVerseTafsir } from '@/services/quranApi';
import { getCachedVerseTafsir, setCachedVerseTafsir } from '@/services/quranCache';

interface TafsirSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  verseKey: string | null;
  tafsirId?: number;
}

const DEFAULT_TAFSIR_ID = 169; // Ibn Kathir (English)

export function TafsirSheet({ open, onOpenChange, verseKey, tafsirId = DEFAULT_TAFSIR_ID }: TafsirSheetProps) {
  const [tafsirText, setTafsirText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !verseKey) {
      return;
    }

    const loadTafsir = async () => {
      setLoading(true);
      setError(null);

      // Check cache first
      const cached = getCachedVerseTafsir(verseKey, tafsirId);
      if (cached) {
        setTafsirText(cached);
        setLoading(false);
        return;
      }

      try {
        const text = await getVerseTafsir(verseKey, tafsirId);
        setTafsirText(text);
        setCachedVerseTafsir(verseKey, tafsirId, text);
      } catch (err) {
        setError('Unable to load tafsir. Please try again later.');
        console.error('Tafsir load error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadTafsir();
  }, [open, verseKey, tafsirId]);

  // Reset state when closing
  useEffect(() => {
    if (!open) {
      setTafsirText(null);
      setError(null);
    }
  }, [open]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[70vh] rounded-t-2xl">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-left">
            Tafsir Ibn Kathir
            {verseKey && <span className="text-muted-foreground ml-2">({verseKey})</span>}
          </SheetTitle>
        </SheetHeader>

        <div className="overflow-y-auto h-full pb-8">
          {loading && (
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm text-center"
            >
              {error}
            </motion.div>
          )}

          {!loading && !error && tafsirText && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="prose prose-sm max-w-none text-foreground/90"
            >
              {tafsirText.split('\n').map((paragraph, index) => (
                paragraph.trim() && (
                  <p key={index} className="mb-3 leading-relaxed">
                    {paragraph}
                  </p>
                )
              ))}
            </motion.div>
          )}

          {!loading && !error && !tafsirText && (
            <p className="text-muted-foreground text-center py-8">
              No tafsir available for this verse.
            </p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
