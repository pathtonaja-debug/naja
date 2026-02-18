import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, BookOpen, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getCurrentLanguage } from '@/lib/i18n';
import type { RamadanStory } from '@/data/ramadanContent';

interface StoryDetailSheetProps {
  story: RamadanStory | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CACHE_PREFIX = 'naja_story_';

export function StoryDetailSheet({ story, open, onOpenChange }: StoryDetailSheetProps) {
  const { t } = useTranslation();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStory = useCallback(async () => {
    if (!story) return;

    const lang = getCurrentLanguage();
    const cacheKey = `${CACHE_PREFIX}${story.id}_${lang}`;

    // Check cache first
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        setContent(cached);
        setLoading(false);
        return;
      }
    } catch { /* ignore */ }

    setLoading(true);
    setError(null);
    setContent('');

    const title = t(story.titleKey);
    const summary = t(story.contentKey);

    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-story`;
      const resp = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          storyId: story.id,
          title,
          summary,
          category: story.category,
          language: lang,
        }),
      });

      if (!resp.ok) {
        const errData = await resp.json().catch(() => ({ error: 'Failed to generate story' }));
        throw new Error(errData.error || `Error ${resp.status}`);
      }

      if (!resp.body) throw new Error('No response body');

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let fullText = '';
      let textBuffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') break;

          try {
            const parsed = JSON.parse(jsonStr);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              fullText += delta;
              setContent(fullText);
            }
          } catch {
            textBuffer = line + '\n' + textBuffer;
            break;
          }
        }
      }

      // Cache the completed story
      if (fullText) {
        try { localStorage.setItem(cacheKey, fullText); } catch { /* ignore */ }
      }

      setLoading(false);
    } catch (err) {
      console.error('Story generation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate story');
      setLoading(false);
    }
  }, [story, t]);

  useEffect(() => {
    if (open && story) {
      setContent('');
      setError(null);
      fetchStory();
    }
  }, [open, story, fetchStory]);

  // Simple markdown renderer for basic formatting
  const renderMarkdown = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, i) => {
      // Headers
      if (line.startsWith('### ')) return <h3 key={i} className="text-base font-semibold mt-4 mb-2">{line.slice(4)}</h3>;
      if (line.startsWith('## ')) return <h2 key={i} className="text-lg font-bold mt-5 mb-2">{line.slice(3)}</h2>;
      if (line.startsWith('# ')) return <h1 key={i} className="text-xl font-bold mt-5 mb-3">{line.slice(2)}</h1>;
      
      // Bold/italic inline
      if (line.trim() === '') return <br key={i} />;
      
      // Bullet points
      if (line.startsWith('- ') || line.startsWith('* ')) {
        return <li key={i} className="ml-4 text-sm text-foreground/90 mb-1">{renderInline(line.slice(2))}</li>;
      }

      // Blockquote
      if (line.startsWith('> ')) {
        return <blockquote key={i} className="border-l-2 border-primary/30 pl-3 italic text-sm text-muted-foreground my-2">{renderInline(line.slice(2))}</blockquote>;
      }

      return <p key={i} className="text-sm text-foreground/90 mb-2 leading-relaxed">{renderInline(line)}</p>;
    });
  };

  const renderInline = (text: string) => {
    // Very simple bold/italic parsing
    const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={i}>{part.slice(1, -1)}</em>;
      }
      return part;
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-2xl p-0">
        <SheetHeader className="px-5 pt-5 pb-3 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <SheetTitle className="text-left text-base">
              {story ? t(story.titleKey) : ''}
            </SheetTitle>
          </div>
        </SheetHeader>

        <ScrollArea className="h-[calc(85vh-80px)] px-5 py-4">
          {loading && !content && (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">{t('common.loading')}</p>
            </div>
          )}

          {error && !content && (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <AlertCircle className="w-6 h-6 text-destructive" />
              <p className="text-sm text-destructive">{error}</p>
              <Button variant="outline" size="sm" onClick={fetchStory}>
                {t('common.retry')}
              </Button>
            </div>
          )}

          {content && (
            <div className="prose-sm">
              {renderMarkdown(content)}
              {loading && (
                <span className="inline-block w-2 h-4 bg-primary/50 animate-pulse rounded-sm ml-0.5" />
              )}
            </div>
          )}

          <p className="text-[10px] text-muted-foreground mt-6 mb-4 text-center italic">
            Content generated from authentic Islamic sources. Always verify with scholars.
          </p>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
