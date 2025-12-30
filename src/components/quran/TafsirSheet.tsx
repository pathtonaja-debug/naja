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
const ALLOWED_TAGS = new Set(['P', 'BR', 'STRONG', 'EM', 'B', 'I', 'UL', 'OL', 'LI', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6']);

function sanitizeTafsirHtml(html: string): string {
  if (!html) return '';
  const doc = new DOMParser().parseFromString(html, 'text/html');

  const walk = (node: Element) => {
    [...node.children].forEach((child) => {
      if (!ALLOWED_TAGS.has(child.tagName)) {
        const fragment = document.createDocumentFragment();
        while (child.firstChild) fragment.appendChild(child.firstChild);
        child.replaceWith(fragment);
      } else {
        walk(child);
      }
    });
  };

  walk(doc.body);
  return doc.body.innerHTML;
}

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
              className="prose prose-sm max-w-none text-foreground/90 leading-relaxed
                [&_p]:mb-4 [&_p]:last:mb-0
                [&_h1]:text-lg [&_h1]:font-semibold [&_h1]:mb-3 [&_h1]:mt-6 [&_h1]:first:mt-0
                [&_h2]:text-base [&_h2]:font-semibold [&_h2]:mb-2 [&_h2]:mt-5
                [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:mb-2 [&_h3]:mt-4
                [&_h4]:text-sm [&_h4]:font-medium [&_h4]:mb-2 [&_h4]:mt-3
                [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-3
                [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-3
                [&_li]:mb-1.5 [&_li]:leading-relaxed
                [&_strong]:font-semibold [&_strong]:text-foreground
                [&_em]:italic"
              dangerouslySetInnerHTML={{ __html: sanitizeTafsirHtml(tafsirText) }}
            />
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
