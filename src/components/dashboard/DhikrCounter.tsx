import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Minus, Plus, RotateCcw } from "lucide-react";
import { useState } from "react";

export function DhikrCounter() {
  const [count, setCount] = useState(0);
  const target = 33;

  return (
    <Card className="liquid-glass p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-headline text-foreground">Dhikr Counter</h3>
        <Button size="icon" variant="ghost" onClick={() => setCount(0)}>
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      <div className="text-center space-y-4">
        <div className="space-y-1">
          <p className="text-6xl font-bold text-foreground">{count}</p>
          <p className="text-caption-1 text-foreground-muted">of {target}</p>
        </div>

        <div className="h-2 bg-muted rounded-pill overflow-hidden">
          <div
            className="h-full bg-gradient-primary transition-all"
            style={{ width: `${Math.min((count / target) * 100, 100)}%` }}
          />
        </div>

        <div className="flex items-center justify-center gap-4">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setCount(Math.max(0, count - 1))}
            disabled={count === 0}
          >
            <Minus className="w-5 h-5" />
          </Button>
          <Button
            size="lg"
            variant="primary"
            onClick={() => setCount(count + 1)}
            className="w-24 h-24 rounded-full text-2xl"
          >
            +1
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setCount(count + 1)}
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
