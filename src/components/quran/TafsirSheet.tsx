import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { getVerseTafsir } from '@/services/quranApi';
import { getCachedVerseTafsir, setCachedVerseTafsir, getCachedFrenchTafsir, setCachedFrenchTafsir } from '@/services/quranCache';
import { translateTafsirToFrench } from '@/services/tafsirTranslation';
// import { getFrenchTafsir } from '@/services/tafsirFr'; // Deactivated

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
  const { i18n, t } = useTranslation();
  const baseLang = (i18n.language || 'en').toLowerCase().split('-')[0];
  
  const [tafsirText, setTafsirText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<'api' | 'local' | 'translated'>('api');

  useEffect(() => {
    if (!open || !verseKey) {
      return;
    }

    const loadTafsir = async () => {
      setLoading(true);
      setError(null);
      setTafsirText(null);
      setLoadingMessage(null);

      // If French, try to load translated tafsir
      if (baseLang === 'fr') {
        // Check French translation cache first
        const cachedFrench = getCachedFrenchTafsir(verseKey);
        if (cachedFrench) {
          setTafsirText(cachedFrench);
          setSource('translated');
          setLoading(false);
          return;
        }

        // Need to fetch English and translate
        setLoadingMessage('Traduction en cours...');
        
        try {
          // Get English tafsir (check cache first)
          let englishText = getCachedVerseTafsir(verseKey, tafsirId);
          
          if (!englishText) {
            englishText = await getVerseTafsir(verseKey, tafsirId);
            setCachedVerseTafsir(verseKey, tafsirId, englishText);
          }

          // Translate to French
          const frenchText = await translateTafsirToFrench(englishText, verseKey);
          
          // Cache the French translation
          setCachedFrenchTafsir(verseKey, frenchText);
          
          setTafsirText(frenchText);
          setSource('translated');
        } catch (err) {
          console.error('[TafsirSheet] French translation failed:', err);
          
          // Fallback: try to show English with a note
          try {
            const englishFallback = getCachedVerseTafsir(verseKey, tafsirId) 
              || await getVerseTafsir(verseKey, tafsirId);
            setTafsirText(englishFallback);
            setSource('api');
            setError('La traduction en français a échoué. Affichage en anglais.');
          } catch {
            setError(t('quran.unableToLoadTafsir'));
          }
        } finally {
          setLoading(false);
          setLoadingMessage(null);
        }
        return;
      }

      /* DEACTIVATED: French local tafsir - keeping code for future use
      if (baseLang === 'fr') {
        try {
          const frenchTafsir = await getFrenchTafsir(verseKey);
          if (frenchTafsir && frenchTafsir.length > 50) {
            setTafsirText(frenchTafsir);
            setSource('local');
            setLoading(false);
            return;
          }
        } catch (err) {
          console.warn('[TafsirSheet] French tafsir failed, falling back to API:', err);
        }
      }
      */

      // Check cache for API tafsir
      const cached = getCachedVerseTafsir(verseKey, tafsirId);
      if (cached) {
        setTafsirText(cached);
        setSource('api');
        setLoading(false);
        return;
      }

      // Fetch from API
      try {
        const text = await getVerseTafsir(verseKey, tafsirId);
        setTafsirText(text);
        setSource('api');
        setCachedVerseTafsir(verseKey, tafsirId, text);
      } catch (err) {
        setError(t('quran.unableToLoadTafsir'));
        console.error('Tafsir load error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadTafsir();
  }, [open, verseKey, tafsirId, baseLang, t]);

  // Reset state when closing
  useEffect(() => {
    if (!open) {
      setTafsirText(null);
      setError(null);
    }
  }, [open]);

  const tafsirTitle = baseLang === 'fr' && source === 'translated' 
    ? 'Tafsir Ibn Kathir (traduit)' 
    : baseLang === 'fr' && source === 'local'
    ? 'Tafsir Ibn Kathir (Fr)'
    : 'Tafsir Ibn Kathir';

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[70vh] rounded-t-2xl">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-left">
            {tafsirTitle}
            {verseKey && <span className="text-muted-foreground ml-2">({verseKey})</span>}
          </SheetTitle>
        </SheetHeader>

        <div className="overflow-y-auto h-full pb-8">
          {loading && (
            <div className="space-y-3">
              {loadingMessage && (
                <p className="text-sm text-muted-foreground text-center mb-4">
                  {loadingMessage}
                </p>
              )}
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
              className="border-l-2 border-muted-foreground/30 pl-4 italic text-muted-foreground text-sm leading-relaxed
                [&_p]:mb-3 [&_p]:last:mb-0"
              dangerouslySetInnerHTML={{ __html: sanitizeTafsirHtml(tafsirText) }}
            />
          )}

          {!loading && !error && !tafsirText && (
            <p className="text-muted-foreground text-center py-8">
              {t('quran.noTafsirAvailable')}
            </p>
          )}
          
          {/* Source attribution */}
          {!loading && !error && tafsirText && (
            <p className="text-xs text-muted-foreground mt-6 pt-4 border-t border-border/50">
              {source === 'translated'
                ? 'Source: Ibn Kathir (Quran.com API), traduit en français par IA'
                : source === 'local' 
                ? 'Source: Ibn Kathir, traduit par Ahmad Harakat' 
                : 'Source: Ibn Kathir (Quran.com API)'}
            </p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
