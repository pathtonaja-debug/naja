import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, Heart, Hand, Sparkles, Star, Sun, Moon, Sunrise, Sunset, Target, Trophy } from "lucide-react";
import { createHabit } from "@/services/db";
import { useToast } from "@/hooks/use-toast";

const iconOptions = [
  { value: 'book-open', label: 'Book', Icon: BookOpen },
  { value: 'heart', label: 'Heart', Icon: Heart },
  { value: 'hand', label: 'Hand', Icon: Hand },
  { value: 'sparkles', label: 'Sparkles', Icon: Sparkles },
  { value: 'star', label: 'Star', Icon: Star },
  { value: 'sun', label: 'Sun', Icon: Sun },
  { value: 'moon', label: 'Moon', Icon: Moon },
  { value: 'sunrise', label: 'Sunrise', Icon: Sunrise },
  { value: 'sunset', label: 'Sunset', Icon: Sunset },
  { value: 'target', label: 'Target', Icon: Target },
  { value: 'trophy', label: 'Trophy', Icon: Trophy }
];

interface AddHabitSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function AddHabitSheet({ open, onOpenChange, onSuccess }: AddHabitSheetProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("spiritual");
  const [frequency, setFrequency] = useState("daily");
  const [icon, setIcon] = useState("star");
  const [targetCount, setTargetCount] = useState("1");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast({ title: "Please enter a habit name", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      await createHabit({
        name: name.trim(),
        category,
        frequency,
        icon,
        target_count: parseInt(targetCount) || 1
      });
      
      toast({ title: "Habit created successfully" });
      setName("");
      setCategory("spiritual");
      setFrequency("daily");
      setIcon("star");
      setTargetCount("1");
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error("Error creating habit:", error);
      toast({ title: "Failed to create habit", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[85vh] backdrop-blur-3xl bg-white/40 border-white/20 rounded-t-[2rem]">
        <SheetHeader>
          <SheetTitle className="text-2xl font-medium text-foreground">Add New Habit</SheetTitle>
        </SheetHeader>
        
        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground/70">Habit Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Morning Quran Reading"
              className="backdrop-blur-2xl bg-white/30 border-white/20 rounded-2xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-foreground/70">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="backdrop-blur-2xl bg-white/30 border-white/20 rounded-2xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="spiritual">Spiritual</SelectItem>
                <SelectItem value="prayer">Prayer</SelectItem>
                <SelectItem value="personal">Personal</SelectItem>
                <SelectItem value="health">Health</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="frequency" className="text-foreground/70">Frequency</Label>
            <Select value={frequency} onValueChange={setFrequency}>
              <SelectTrigger className="backdrop-blur-2xl bg-white/30 border-white/20 rounded-2xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="icon" className="text-foreground/70">Icon</Label>
            <Select value={icon} onValueChange={setIcon}>
              <SelectTrigger className="backdrop-blur-2xl bg-white/30 border-white/20 rounded-2xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {iconOptions.map(({ value, label, Icon }) => (
                  <SelectItem key={value} value={value}>
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      {label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="target" className="text-foreground/70">Daily Target</Label>
            <Input
              id="target"
              type="number"
              min="1"
              value={targetCount}
              onChange={(e) => setTargetCount(e.target.value)}
              className="backdrop-blur-2xl bg-white/30 border-white/20 rounded-2xl"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="flex-1 rounded-full"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 rounded-full bg-foreground text-background hover:bg-foreground/90"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Habit"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
