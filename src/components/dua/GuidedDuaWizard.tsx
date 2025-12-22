import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles, Loader2, Check, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { namesOfAllah, AllahName } from '@/data/namesOfAllah';
import { DUA_TOPICS, TOPIC_NAME_SUGGESTIONS, UMMAH_PRAYERS, SALAWAT_OPTIONS, DuaTopic } from '@/data/duaTopics';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface GuidedDuaState {
  topic: DuaTopic | null;
  customTopic: string;
  selectedNames: AllahName[];
  shortDescription: string;
  details: string;
  requestText: string;
  ummahPrayers: string[];
  includeSalawat: boolean;
  selectedSalawat: string;
  finalText: string;
}

interface GuidedDuaWizardProps {
  onComplete: (state: GuidedDuaState) => void;
  onCancel: () => void;
}

const STEPS = [
  { id: 1, title: 'Choose a topic' },
  { id: 2, title: 'Call upon Allah by His Names' },
  { id: 3, title: 'What are you asking Allah for?' },
  { id: 4, title: 'Add prayers for others (optional)' },
  { id: 5, title: 'Send blessings upon the Prophet ﷺ' },
  { id: 6, title: 'Your dua' },
];

export function GuidedDuaWizard({ onComplete, onCancel }: GuidedDuaWizardProps) {
  const [step, setStep] = useState(1);
  const [state, setState] = useState<GuidedDuaState>({
    topic: null,
    customTopic: '',
    selectedNames: [],
    shortDescription: '',
    details: '',
    requestText: '',
    ummahPrayers: [],
    includeSalawat: true,
    selectedSalawat: 'ibrahimi',
    finalText: '',
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const canProceed = useCallback(() => {
    switch (step) {
      case 1:
        return state.topic !== null && (state.topic !== 'other' || state.customTopic.trim());
      case 2:
        return true; // Optional step
      case 3:
        return state.shortDescription.trim() && state.requestText.trim();
      case 4:
        return true; // Optional step
      case 5:
        return true; // Optional step
      case 6:
        return state.finalText.trim();
      default:
        return true;
    }
  }, [step, state]);

  const handleNext = () => {
    if (step === 6) {
      onComplete(state);
    } else {
      if (step === 5) {
        // Assemble final dua before showing step 6
        const finalDua = assembleFinalDua(state);
        setState(prev => ({ ...prev, finalText: finalDua }));
      }
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step === 1) {
      onCancel();
    } else {
      setStep(step - 1);
    }
  };

  const generateDuaDraft = async () => {
    if (!state.shortDescription.trim()) {
      toast.error('Please describe what you need first');
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-dua', {
        body: {
          topic: state.topic === 'other' ? state.customTopic : state.topic,
          selectedNames: state.selectedNames.map(n => n.transliteration),
          shortDescription: state.shortDescription,
          details: state.details,
          makeLonger: false,
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setState(prev => ({ ...prev, requestText: data.duaText }));
      toast.success('Draft generated! ✨');
    } catch (err) {
      console.error('Error generating dua:', err);
      toast.error('Failed to generate draft. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleName = (name: AllahName) => {
    setState(prev => {
      const isSelected = prev.selectedNames.some(n => n.number === name.number);
      if (isSelected) {
        return { ...prev, selectedNames: prev.selectedNames.filter(n => n.number !== name.number) };
      }
      if (prev.selectedNames.length >= 3) {
        toast.info('Up to 3 names can be selected');
        return prev;
      }
      return { ...prev, selectedNames: [...prev.selectedNames, name] };
    });
  };

  const toggleUmmahPrayer = (id: string) => {
    setState(prev => {
      const isSelected = prev.ummahPrayers.includes(id);
      if (isSelected) {
        return { ...prev, ummahPrayers: prev.ummahPrayers.filter(p => p !== id) };
      }
      return { ...prev, ummahPrayers: [...prev.ummahPrayers, id] };
    });
  };

  // Get suggested names for current topic
  const suggestedNameNumbers = state.topic ? TOPIC_NAME_SUGGESTIONS[state.topic] || [] : [];
  const suggestedNames = namesOfAllah.filter(n => suggestedNameNumbers.includes(n.number));
  const otherNames = namesOfAllah.filter(n => !suggestedNameNumbers.includes(n.number));

  return (
    <div className="flex flex-col h-full">
      {/* Progress bar */}
      <div className="px-4 py-3 border-b border-border">
        <div className="flex items-center gap-1 mb-2">
          {STEPS.map((s, i) => (
            <div
              key={s.id}
              className={cn(
                "h-1 flex-1 rounded-full transition-colors",
                i < step ? "bg-primary" : i === step - 1 ? "bg-primary" : "bg-muted"
              )}
            />
          ))}
        </div>
        <p className="text-xs text-muted-foreground">Step {step} of {STEPS.length}</p>
      </div>

      {/* Step content */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <h2 className="text-lg font-semibold mb-4">{STEPS[step - 1].title}</h2>

            {step === 1 && (
              <div className="space-y-2">
                {DUA_TOPICS.map(topic => (
                  <button
                    key={topic.id}
                    onClick={() => setState(prev => ({ ...prev, topic: topic.id }))}
                    className={cn(
                      "w-full p-4 rounded-xl border text-left transition-all",
                      state.topic === topic.id
                        ? "bg-primary/10 border-primary"
                        : "bg-card border-border hover:border-primary/50"
                    )}
                  >
                    <span className="mr-2">{topic.emoji}</span>
                    {topic.label}
                  </button>
                ))}
                {state.topic === 'other' && (
                  <Input
                    placeholder="Enter your topic..."
                    value={state.customTopic}
                    onChange={(e) => setState(prev => ({ ...prev, customTopic: e.target.value }))}
                    className="mt-2"
                    autoFocus
                  />
                )}
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                {/* Selected names chips */}
                {state.selectedNames.length > 0 && (
                  <div className="flex flex-wrap gap-2 p-3 rounded-xl bg-primary/10">
                    {state.selectedNames.map(name => (
                      <button
                        key={name.number}
                        onClick={() => toggleName(name)}
                        className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-sm flex items-center gap-1"
                      >
                        {name.transliteration}
                        <span className="text-xs">✕</span>
                      </button>
                    ))}
                  </div>
                )}

                {state.selectedNames.length >= 3 && (
                  <p className="text-sm text-muted-foreground italic">Up to 3 names can be selected</p>
                )}

                {/* Suggested for this topic */}
                {suggestedNames.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Suggested for this topic</h3>
                    <div className="space-y-2">
                      {suggestedNames.map(name => (
                        <NameCard
                          key={name.number}
                          name={name}
                          selected={state.selectedNames.some(n => n.number === name.number)}
                          disabled={state.selectedNames.length >= 3 && !state.selectedNames.some(n => n.number === name.number)}
                          onToggle={() => toggleName(name)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* All names */}
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">All 99 Names</h3>
                  <div className="space-y-2 max-h-[40vh] overflow-y-auto">
                    {otherNames.map(name => (
                      <NameCard
                        key={name.number}
                        name={name}
                        selected={state.selectedNames.some(n => n.number === name.number)}
                        disabled={state.selectedNames.length >= 3 && !state.selectedNames.some(n => n.number === name.number)}
                        onToggle={() => toggleName(name)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">In one sentence, what do you need? *</label>
                  <Input
                    placeholder="e.g., I need strength to overcome my challenges"
                    value={state.shortDescription}
                    onChange={(e) => setState(prev => ({ ...prev, shortDescription: e.target.value }))}
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Add a little context (optional)</label>
                  <Textarea
                    placeholder="e.g., I've been struggling with work pressure and need Allah's help..."
                    value={state.details}
                    onChange={(e) => setState(prev => ({ ...prev, details: e.target.value }))}
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={generateDuaDraft}
                    disabled={isGenerating || !state.shortDescription.trim()}
                    className="flex-1"
                    variant="outline"
                  >
                    {isGenerating ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4 mr-2" />
                    )}
                    Generate a draft
                  </Button>
                  <Button
                    onClick={() => setState(prev => ({ ...prev, requestText: state.shortDescription }))}
                    disabled={!state.shortDescription.trim()}
                    variant="secondary"
                    className="flex-1"
                  >
                    Write my own
                  </Button>
                </div>

                {state.requestText && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Your dua request</label>
                      <Button variant="ghost" size="sm" onClick={generateDuaDraft} disabled={isGenerating}>
                        <RefreshCw className={cn("w-4 h-4 mr-1", isGenerating && "animate-spin")} />
                        Regenerate
                      </Button>
                    </div>
                    <Textarea
                      value={state.requestText}
                      onChange={(e) => setState(prev => ({ ...prev, requestText: e.target.value }))}
                      className="min-h-[120px]"
                      placeholder="Your dua text..."
                    />
                  </div>
                )}
              </div>
            )}

            {step === 4 && (
              <div className="space-y-3">
                {UMMAH_PRAYERS.map(prayer => (
                  <button
                    key={prayer.id}
                    onClick={() => toggleUmmahPrayer(prayer.id)}
                    className={cn(
                      "w-full p-4 rounded-xl border text-left transition-all",
                      state.ummahPrayers.includes(prayer.id)
                        ? "bg-primary/10 border-primary"
                        : "bg-card border-border hover:border-primary/50"
                    )}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{prayer.label}</span>
                      {state.ummahPrayers.includes(prayer.id) && (
                        <Check className="w-4 h-4 text-primary" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{prayer.text}</p>
                  </button>
                ))}
              </div>
            )}

            {step === 5 && (
              <div className="space-y-3">
                <button
                  onClick={() => setState(prev => ({ ...prev, includeSalawat: !prev.includeSalawat }))}
                  className={cn(
                    "w-full p-4 rounded-xl border text-left transition-all",
                    state.includeSalawat
                      ? "bg-primary/10 border-primary"
                      : "bg-card border-border hover:border-primary/50"
                  )}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">Include Salawat</span>
                    {state.includeSalawat && <Check className="w-4 h-4 text-primary" />}
                  </div>
                  <p className="text-sm text-muted-foreground">Send blessings upon the Prophet ﷺ</p>
                </button>

                {state.includeSalawat && (
                  <div className="space-y-2 mt-4">
                    {SALAWAT_OPTIONS.map(salawat => (
                      <button
                        key={salawat.id}
                        onClick={() => setState(prev => ({ ...prev, selectedSalawat: salawat.id }))}
                        className={cn(
                          "w-full p-4 rounded-xl border text-left transition-all",
                          state.selectedSalawat === salawat.id
                            ? "bg-secondary/20 border-secondary"
                            : "bg-card border-border hover:border-secondary/50"
                        )}
                      >
                        <div className="font-medium mb-2">{salawat.label}</div>
                        <p className="text-lg font-arabic text-right mb-2" dir="rtl">{salawat.arabic}</p>
                        <p className="text-xs text-muted-foreground italic mb-1">{salawat.transliteration}</p>
                        <p className="text-sm text-muted-foreground">{salawat.translation}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {step === 6 && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-card border border-border">
                  {isEditing ? (
                    <Textarea
                      value={state.finalText}
                      onChange={(e) => setState(prev => ({ ...prev, finalText: e.target.value }))}
                      className="min-h-[300px] text-base"
                      autoFocus
                    />
                  ) : (
                    <div className="whitespace-pre-wrap text-base leading-relaxed">
                      {state.finalText}
                    </div>
                  )}
                </div>

                <Button
                  variant="outline"
                  onClick={() => setIsEditing(!isEditing)}
                  className="w-full"
                >
                  {isEditing ? 'Done Editing' : '✏️ Edit final text'}
                </Button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="px-4 py-4 border-t border-border flex gap-3">
        <Button variant="outline" onClick={handleBack} className="flex-1">
          <ChevronLeft className="w-4 h-4 mr-1" />
          {step === 1 ? 'Cancel' : 'Back'}
        </Button>
        <Button
          onClick={handleNext}
          disabled={!canProceed()}
          className="flex-1"
        >
          {step === 6 ? 'Save Dua' : 'Next'}
          {step < 6 && <ChevronRight className="w-4 h-4 ml-1" />}
        </Button>
      </div>
    </div>
  );
}

function NameCard({ name, selected, disabled, onToggle }: { 
  name: AllahName; 
  selected: boolean; 
  disabled: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      disabled={disabled}
      className={cn(
        "w-full p-3 rounded-xl border text-left transition-all",
        selected
          ? "bg-primary/10 border-primary"
          : disabled
          ? "bg-muted/50 border-border opacity-50 cursor-not-allowed"
          : "bg-card border-border hover:border-primary/50"
      )}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-lg font-arabic">{name.arabic}</span>
        {selected && <Check className="w-4 h-4 text-primary" />}
      </div>
      <div className="font-medium">{name.transliteration}</div>
      <div className="text-sm text-muted-foreground">{name.english}</div>
      <div className="text-xs text-muted-foreground mt-1 line-clamp-2">{name.meaning}</div>
    </button>
  );
}

/**
 * Assembles the final dua text from components in order:
 * 1) Opening with selected Names of Allah
 * 2) User's request text
 * 3) Ummah prayers
 * 4) Salawat
 * 5) Closing "Ameen."
 */
function assembleFinalDua(state: GuidedDuaState): string {
  const parts: string[] = [];

  // 1) Opening with Names
  if (state.selectedNames.length > 0) {
    const names = state.selectedNames.map(n => `Ya ${n.transliteration}`).join(', ');
    parts.push(`Ya Allah, ${names},\n`);
  } else {
    parts.push('Ya Allah,\n');
  }

  // 2) Request text
  if (state.requestText.trim()) {
    parts.push(state.requestText.trim() + '\n');
  }

  // 3) Ummah prayers
  if (state.ummahPrayers.length > 0) {
    parts.push('\n');
    state.ummahPrayers.forEach(prayerId => {
      const prayer = UMMAH_PRAYERS.find(p => p.id === prayerId);
      if (prayer) {
        parts.push(prayer.text + '\n');
      }
    });
  }

  // 4) Salawat
  if (state.includeSalawat) {
    const salawat = SALAWAT_OPTIONS.find(s => s.id === state.selectedSalawat);
    if (salawat) {
      parts.push('\n' + salawat.translation + '\n');
    }
  }

  // 5) Closing
  parts.push('\nAmeen.');

  return parts.join('');
}