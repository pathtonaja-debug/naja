import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import * as Icons from "lucide-react";
import { toast } from "sonner";
import { createHabit } from "@/services/habitTracking";

interface CreateHabitSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const categories = [
  "Salah", "Quran", "Dhikr", "Dua", "Fasting", 
  "Charity", "One good deed of the day", "Custom"
];

const iconOptions = [
  { value: "sunrise", label: "Sunrise", Icon: Icons.Sunrise },
  { value: "sun", label: "Sun", Icon: Icons.Sun },
  { value: "sunset", label: "Sunset", Icon: Icons.Sunset },
  { value: "moon", label: "Moon", Icon: Icons.Moon },
  { value: "book-open", label: "Book", Icon: Icons.BookOpen },
  { value: "sparkles", label: "Sparkles", Icon: Icons.Sparkles },
  { value: "hand", label: "Hand", Icon: Icons.Hand },
  { value: "heart", label: "Heart", Icon: Icons.Heart },
  { value: "smile", label: "Smile", Icon: Icons.Smile },
  { value: "star", label: "Star", Icon: Icons.Star },
  { value: "target", label: "Target", Icon: Icons.Target }
];

const colorOptions = [
  "#FFE5D9", "#FFD6A5", "#FDFFB6", "#CAFFBF", "#9BF6FF",
  "#A0C4FF", "#BDB2FF", "#FFC6FF", "#FFADAD", "#E8EAED"
];

export default function CreateHabitSheet({ open, onOpenChange, onSuccess }: CreateHabitSheetProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Custom");
  const [notes, setNotes] = useState("");
  const [icon, setIcon] = useState("target");
  const [color, setColor] = useState("#E8EAED");
  const [isAllDay, setIsAllDay] = useState(true);
  const [time, setTime] = useState("09:00");
  const [syncToCalendar, setSyncToCalendar] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error("Please enter a habit name");
      return;
    }

    setLoading(true);
    try {
      await createHabit({
        name: name.trim(),
        category,
        notes: notes.trim() || undefined,
        icon,
        color,
        is_all_day: isAllDay,
        habit_time: isAllDay ? undefined : `${time}:00`,
        repeat_pattern: { type: 'daily' },
        sync_to_calendar: syncToCalendar
      });

      toast.success("Habit created successfully!");
      
      // Reset form
      setName("");
      setCategory("Custom");
      setNotes("");
      setIcon("target");
      setColor("#E8EAED");
      setIsAllDay(true);
      setTime("09:00");
      setSyncToCalendar(false);
      
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error("Error creating habit:", error);
      toast.error("Failed to create habit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[90vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Create New Habit</SheetTitle>
        </SheetHeader>

        <div className="space-y-6 py-6">
          <div className="space-y-2">
            <Label>Habit Name</Label>
            <Input
              placeholder="e.g., Morning Meditation"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Icon</Label>
            <div className="grid grid-cols-6 gap-2">
              {iconOptions.map(({ value, Icon }) => (
                <button
                  key={value}
                  onClick={() => setIcon(value)}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    icon === value
                      ? "border-primary bg-primary/10"
                      : "border-border/50 hover:border-primary/30"
                  }`}
                >
                  <Icon className="w-5 h-5 mx-auto" />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Color</Label>
            <div className="grid grid-cols-5 gap-2">
              {colorOptions.map((clr) => (
                <button
                  key={clr}
                  onClick={() => setColor(clr)}
                  className={`h-12 rounded-xl border-2 transition-all ${
                    color === clr
                      ? "border-primary scale-105"
                      : "border-border/30"
                  }`}
                  style={{ backgroundColor: clr }}
                />
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>All Day</Label>
              <Switch checked={isAllDay} onCheckedChange={setIsAllDay} />
            </div>

            {!isAllDay && (
              <div className="space-y-2">
                <Label>Time</Label>
                <Input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Notes (optional)</Label>
            <Textarea
              placeholder="Add any additional notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label>Add to Calendar</Label>
            <Switch checked={syncToCalendar} onCheckedChange={setSyncToCalendar} />
          </div>
        </div>

        <div className="flex gap-3 pb-safe">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            className="flex-1"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Habit"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
