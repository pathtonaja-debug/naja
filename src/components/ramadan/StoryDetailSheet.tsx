import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BookOpen } from 'lucide-react';
import { getCurrentLanguage } from '@/lib/i18n';
import { STORY_CONTENT } from '@/data/ramadanStories';
import type { RamadanStory } from '@/data/ramadanContent';

interface StoryDetailSheetProps {
  story: RamadanStory | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StoryDetailSheet({ story, open, onOpenChange }: StoryDetailSheetProps) {
  const { t } = useTranslation();

  const content = useMemo(() => {
    if (!story) return '';
    const lang = getCurrentLanguage();
    const data = STORY_CONTENT[story.id];
    if (!data) return '';
    return lang === 'fr' ? data.fr : data.en;
  }, [story]);

  const renderInline = (text: string) => {
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

  const renderMarkdown = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, i) => {
      if (line.startsWith('### ')) return <h3 key={i} className="text-base font-semibold mt-4 mb-2">{line.slice(4)}</h3>;
      if (line.startsWith('## ')) return <h2 key={i} className="text-lg font-bold mt-5 mb-2">{line.slice(3)}</h2>;
      if (line.startsWith('# ')) return <h1 key={i} className="text-xl font-bold mt-5 mb-3">{line.slice(2)}</h1>;
      if (line.trim() === '') return <br key={i} />;
      if (line.startsWith('- ') || line.startsWith('* ')) {
        return <li key={i} className="ml-4 text-sm text-foreground/90 mb-1">{renderInline(line.slice(2))}</li>;
      }
      if (line.startsWith('> ')) {
        return <blockquote key={i} className="border-l-2 border-primary/30 pl-3 italic text-sm text-muted-foreground my-2">{renderInline(line.slice(2))}</blockquote>;
      }
      return <p key={i} className="text-sm text-foreground/90 mb-2 leading-relaxed">{renderInline(line)}</p>;
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
          {content && (
            <div className="prose-sm">
              {renderMarkdown(content)}
            </div>
          )}

          <p className="text-[10px] text-muted-foreground mt-6 mb-4 text-center italic">
            Content sourced from Quran, Sahih al-Bukhari, Sahih Muslim, and other authentic references.
          </p>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
