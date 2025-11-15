import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const prompts = [
  "What brought you closer to Allah today?",
  "Reflect on a moment of gratitude",
  "How did you show patience today?",
  "What blessing are you thankful for?",
];

export function ReflectionPrompt() {
  const navigate = useNavigate();
  const prompt = prompts[Math.floor(Math.random() * prompts.length)];

  return (
    <Card className="liquid-glass p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-headline text-foreground">Daily Reflection</h3>
        </div>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => navigate("/journal")}
        >
          <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
      <p className="text-body text-foreground-muted italic">"{prompt}"</p>
      <Button
        variant="primary"
        onClick={() => navigate("/journal")}
        className="w-full"
      >
        Write Reflection
      </Button>
    </Card>
  );
}
