import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Sparkles, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { DUA_TOPICS, DuaTopic } from '@/data/duaTopics';

interface WriteOwnDuaProps {
  onComplete: (data: { topic: string; finalText: string }) => void;
  onCancel: () => void;
}

export function WriteOwnDua({ onComplete, onCancel }: WriteOwnDuaProps) {
  const [topic, setTopic] = useState<DuaTopic | null>(null);
  const [duaText, setDuaText] = useState('');

  const handleSave = () => {
    if (!duaText.trim()) return;
    
    const topicLabel = topic 
      ? DUA_TOPICS.find(t => t.id === topic)?.label || 'Custom'
      : 'Custom';
    
    onComplete({
      topic: topicLabel,
      finalText: duaText.trim(),
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <h2 className="text-lg font-semibold">Write your dua</h2>
        <button onClick={onCancel}>
          <X className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* Optional topic picker */}
        <div>
          <label className="text-sm font-medium mb-2 block">Topic (optional)</label>
          <div className="flex flex-wrap gap-2">
            {DUA_TOPICS.map(t => (
              <button
                key={t.id}
                onClick={() => setTopic(topic === t.id ? null : t.id)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1",
                  topic === t.id
                    ? "bg-secondary text-secondary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                <span>{t.emoji}</span>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dua text area */}
        <div>
          <label className="text-sm font-medium mb-2 block">Your dua</label>
          <Textarea
            placeholder="Ya Allah, I ask You..."
            value={duaText}
            onChange={(e) => setDuaText(e.target.value)}
            className="min-h-[300px] text-base"
            autoFocus
          />
        </div>
      </div>

      <div className="px-4 py-4 border-t border-border">
        <Button
          onClick={handleSave}
          disabled={!duaText.trim()}
          className="w-full"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Continue to Save
        </Button>
      </div>
    </div>
  );
}