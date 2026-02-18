import { useMemo, useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { BookOpen, CheckCircle2, Circle, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getCurrentLanguage } from '@/lib/i18n';
import { STORY_CONTENT } from '@/data/ramadanStories';
import { STORY_QUIZZES, type StoryQuizQuestion } from '@/data/ramadanStoryQuizzes';
import {
  markStoryRead,
  isStoryRead,
  saveQuizResult,
  getQuizResult,
  type StoryQuizResult,
} from '@/services/ramadanStoryProgress';
import type { RamadanStory } from '@/data/ramadanContent';

interface StoryDetailSheetProps {
  story: RamadanStory | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProgressChange?: () => void;
}

export function StoryDetailSheet({ story, open, onOpenChange, onProgressChange }: StoryDetailSheetProps) {
  const { t } = useTranslation();
  const lang = getCurrentLanguage();

  const [read, setRead] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);
  const [previousResult, setPreviousResult] = useState<StoryQuizResult | null>(null);

  const content = useMemo(() => {
    if (!story) return '';
    const data = STORY_CONTENT[story.id];
    if (!data) return '';
    return lang === 'fr' ? data.fr : data.en;
  }, [story, lang]);

  const questions: StoryQuizQuestion[] = useMemo(() => {
    if (!story) return [];
    return STORY_QUIZZES[story.id] ?? [];
  }, [story]);

  // Reset state when story changes
  useEffect(() => {
    if (story) {
      setRead(isStoryRead(story.id));
      setPreviousResult(getQuizResult(story.id));
      setQuizStarted(false);
      setCurrentQ(0);
      setSelected(null);
      setChecked(false);
      setScore(0);
      setQuizDone(false);
    }
  }, [story]);

  const handleMarkRead = useCallback(() => {
    if (!story) return;
    markStoryRead(story.id);
    setRead(true);
    onProgressChange?.();
  }, [story, onProgressChange]);

  const handleSelectOption = (idx: number) => {
    if (checked) return;
    setSelected(idx);
  };

  const handleCheck = () => {
    if (selected === null || !questions[currentQ]) return;
    setChecked(true);
    if (selected === questions[currentQ].correctIndex) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(q => q + 1);
      setSelected(null);
      setChecked(false);
    } else {
      // Quiz complete — score already reflects all checked answers
      setQuizDone(true);
      if (story) {
        saveQuizResult(story.id, score);
        if (!read) {
          markStoryRead(story.id);
          setRead(true);
        }
        onProgressChange?.();
      }
    }
  };

  const handleRetryQuiz = () => {
    setQuizStarted(true);
    setCurrentQ(0);
    setSelected(null);
    setChecked(false);
    setScore(0);
    setQuizDone(false);
  };

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

  const q = questions[currentQ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-2xl p-0">
        <SheetHeader className="px-5 pt-5 pb-3 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <SheetTitle className="text-left text-base flex-1">
              {story ? t(story.titleKey) : ''}
            </SheetTitle>
            {read && (
              <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
            )}
          </div>
        </SheetHeader>

        <ScrollArea className="h-[calc(85vh-80px)] px-5 py-4">
          {/* Story content */}
          {content && !quizStarted && (
            <div className="prose-sm">
              {renderMarkdown(content)}
            </div>
          )}

          {/* Mark as read + start quiz CTA (after reading) */}
          {!quizStarted && !quizDone && content && (
            <div className="mt-6 space-y-3">
              {!read && (
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={handleMarkRead}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {lang === 'fr' ? 'Marquer comme lu' : 'Mark as read'}
                </Button>
              )}

              {questions.length > 0 && (
                <Button
                  className="w-full gap-2"
                  onClick={() => { setQuizStarted(true); handleMarkRead(); }}
                >
                  <Trophy className="w-4 h-4" />
                  {previousResult
                    ? (lang === 'fr' ? `Refaire le quiz (${previousResult.score}/3)` : `Retake quiz (${previousResult.score}/3)`)
                    : (lang === 'fr' ? 'Tester vos connaissances' : 'Test your knowledge')
                  }
                </Button>
              )}
            </div>
          )}

          {/* Quiz in progress */}
          {quizStarted && !quizDone && q && (
            <div className="space-y-4">
              {/* Progress dots */}
              <div className="flex items-center justify-center gap-2 mb-2">
                {questions.map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "w-2.5 h-2.5 rounded-full transition-colors",
                      i === currentQ ? "bg-primary" : i < currentQ ? "bg-primary/40" : "bg-muted-foreground/20"
                    )}
                  />
                ))}
              </div>

              <p className="text-xs text-muted-foreground text-center">
                {lang === 'fr' ? `Question ${currentQ + 1} sur ${questions.length}` : `Question ${currentQ + 1} of ${questions.length}`}
              </p>

              <h3 className="text-base font-semibold text-center">
                {lang === 'fr' ? q.fr : q.en}
              </h3>

              <div className="space-y-2">
                {q.options.map((opt, i) => {
                  const isCorrect = i === q.correctIndex;
                  const isSelected = i === selected;
                  return (
                    <button
                      key={i}
                      onClick={() => handleSelectOption(i)}
                      className={cn(
                        "w-full text-left px-4 py-3 rounded-xl border transition-all text-sm",
                        !checked && isSelected && "border-primary bg-primary/10",
                        !checked && !isSelected && "border-border hover:border-primary/40",
                        checked && isCorrect && "border-success bg-success/10 text-success",
                        checked && isSelected && !isCorrect && "border-destructive bg-destructive/10 text-destructive",
                        checked && !isCorrect && !isSelected && "opacity-50"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                          !checked && isSelected && "border-primary",
                          checked && isCorrect && "border-success",
                          checked && isSelected && !isCorrect && "border-destructive"
                        )}>
                          {((!checked && isSelected) || (checked && isCorrect)) && (
                            <div className={cn(
                              "w-2.5 h-2.5 rounded-full",
                              checked && isCorrect ? "bg-success" : "bg-primary"
                            )} />
                          )}
                        </div>
                        {lang === 'fr' ? opt.fr : opt.en}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="pt-2">
                {!checked ? (
                  <Button
                    className="w-full"
                    disabled={selected === null}
                    onClick={handleCheck}
                  >
                    {lang === 'fr' ? 'Vérifier' : 'Check'}
                  </Button>
                ) : (
                  <Button
                    className="w-full"
                    onClick={handleNext}
                  >
                    {currentQ < questions.length - 1
                      ? (lang === 'fr' ? 'Suivant' : 'Next')
                      : (lang === 'fr' ? 'Voir le résultat' : 'See result')
                    }
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Quiz result */}
          {quizDone && (
            <div className="text-center space-y-4 py-6">
              <div className={cn(
                "w-16 h-16 rounded-full mx-auto flex items-center justify-center",
                score === 3 ? "bg-success/20" : score >= 2 ? "bg-primary/20" : "bg-warn/20"
              )}>
                <Trophy className={cn(
                  "w-8 h-8",
                  score === 3 ? "text-success" : score >= 2 ? "text-primary" : "text-warn"
                )} />
              </div>
              <h3 className="text-xl font-bold">{score}/3</h3>
              <p className="text-sm text-muted-foreground">
                {score === 3
                  ? (lang === 'fr' ? 'Parfait ! MashaAllah ✨' : 'Perfect! MashaAllah ✨')
                  : score >= 2
                    ? (lang === 'fr' ? 'Très bien ! Continuez comme ça' : 'Great job! Keep it up')
                    : (lang === 'fr' ? 'Relisez l\'histoire et réessayez !' : 'Read the story again and retry!')
                }
              </p>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={handleRetryQuiz}>
                  {lang === 'fr' ? 'Réessayer' : 'Retry'}
                </Button>
                <Button className="flex-1" onClick={() => onOpenChange(false)}>
                  {lang === 'fr' ? 'Terminé' : 'Done'}
                </Button>
              </div>
            </div>
          )}

          {!quizStarted && !quizDone && (
            <p className="text-[10px] text-muted-foreground mt-6 mb-4 text-center italic">
              Content sourced from Quran, Sahih al-Bukhari, Sahih Muslim, and other authentic references.
            </p>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
