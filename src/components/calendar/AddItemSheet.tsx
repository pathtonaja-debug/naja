import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarItem, CalendarItemType, CalendarCategory, RepeatRule, ReminderType, CATEGORY_LABELS } from "@/types/calendar";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddItemSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (item: Partial<CalendarItem>) => void;
  editItem?: CalendarItem;
  prefilledDate?: Date;
  prefilledTime?: string;
}

const CATEGORY_OPTIONS: { value: CalendarCategory; label: string; color: string }[] = [
  { value: 'faith', label: 'Faith', color: 'bg-semantic-lavender-soft' },
  { value: 'work', label: 'Work', color: 'bg-semantic-blue-soft' },
  { value: 'study', label: 'Study', color: 'bg-semantic-yellow-soft' },
  { value: 'health', label: 'Health', color: 'bg-semantic-green-soft' },
  { value: 'personal', label: 'Personal', color: 'bg-semantic-teal-soft' },
  { value: 'other', label: 'Other', color: 'bg-muted' },
];

export const AddItemSheet = ({
  open,
  onOpenChange,
  onSave,
  editItem,
  prefilledDate,
  prefilledTime,
}: AddItemSheetProps) => {
  const [type, setType] = useState<CalendarItemType>(editItem?.type || 'event');
  const [title, setTitle] = useState(editItem?.title || '');
  const [notes, setNotes] = useState(editItem?.notes || '');
  const [date, setDate] = useState(
    editItem?.startDateTime 
      ? format(new Date(editItem.startDateTime), 'yyyy-MM-dd')
      : prefilledDate 
        ? format(prefilledDate, 'yyyy-MM-dd')
        : format(new Date(), 'yyyy-MM-dd')
  );
  const [startTime, setStartTime] = useState(
    editItem?.startDateTime
      ? format(new Date(editItem.startDateTime), 'HH:mm')
      : prefilledTime || '09:00'
  );
  const [endTime, setEndTime] = useState(
    editItem?.endDateTime
      ? format(new Date(editItem.endDateTime), 'HH:mm')
      : '10:00'
  );
  const [isAllDay, setIsAllDay] = useState(editItem?.isAllDay || false);
  const [category, setCategory] = useState<CalendarCategory>(editItem?.category || 'personal');
  const [repeatRule, setRepeatRule] = useState<RepeatRule>(editItem?.repeatRule || 'none');
  const [reminder, setReminder] = useState<ReminderType>(editItem?.reminder || 'none');

  useEffect(() => {
    if (editItem) {
      setType(editItem.type);
      setTitle(editItem.title);
      setNotes(editItem.notes || '');
      setDate(format(new Date(editItem.startDateTime), 'yyyy-MM-dd'));
      setStartTime(format(new Date(editItem.startDateTime), 'HH:mm'));
      if (editItem.endDateTime) {
        setEndTime(format(new Date(editItem.endDateTime), 'HH:mm'));
      }
      setIsAllDay(editItem.isAllDay || false);
      setCategory(editItem.category);
      setRepeatRule(editItem.repeatRule || 'none');
      setReminder(editItem.reminder || 'none');
    }
  }, [editItem]);

  const handleSave = () => {
    const startDateTime = isAllDay
      ? new Date(date).toISOString()
      : new Date(`${date}T${startTime}`).toISOString();
    
    const endDateTime = type === 'event' && !isAllDay
      ? new Date(`${date}T${endTime}`).toISOString()
      : undefined;

    onSave({
      id: editItem?.id,
      type,
      title,
      notes: notes || undefined,
      startDateTime,
      endDateTime,
      isAllDay,
      category,
      repeatRule,
      reminder,
      completion: type === 'task' ? 0 : undefined,
    });

    onOpenChange(false);
  };

  const resetForm = () => {
    setType('event');
    setTitle('');
    setNotes('');
    setDate(format(new Date(), 'yyyy-MM-dd'));
    setStartTime('09:00');
    setEndTime('10:00');
    setIsAllDay(false);
    setCategory('personal');
    setRepeatRule('none');
    setReminder('none');
  };

  return (
    <Sheet open={open} onOpenChange={(isOpen) => {
      onOpenChange(isOpen);
      if (!isOpen && !editItem) resetForm();
    }}>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-[2rem] bg-background backdrop-blur-2xl border-t border-white/15">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-[24px] font-bold">
            {editItem ? 'Edit Item' : 'Add New Item'}
          </SheetTitle>
        </SheetHeader>

        <div className="overflow-y-auto h-[calc(85vh-140px)] px-1 space-y-6">
          {/* Type Selector */}
          <div className="space-y-2">
            <Label>Type</Label>
            <SegmentedControl
              value={type}
              onValueChange={(value) => setType(value as CalendarItemType)}
              options={[
                { label: 'Event', value: 'event' },
                { label: 'Task', value: 'task' },
              ]}
            />
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter title"
              className="backdrop-blur-xl"
            />
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <div className="relative">
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="backdrop-blur-xl"
                />
                <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50 pointer-events-none" />
              </div>
            </div>

            {type === 'event' && !isAllDay && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="start-time">Start Time</Label>
                  <div className="relative">
                    <Input
                      id="start-time"
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="backdrop-blur-xl"
                    />
                    <Clock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50 pointer-events-none" />
                  </div>
                </div>
              </>
            )}
          </div>

          {type === 'event' && !isAllDay && (
            <div className="space-y-2">
              <Label htmlFor="end-time">End Time</Label>
              <div className="relative">
                <Input
                  id="end-time"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="backdrop-blur-xl"
                />
                <Clock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50 pointer-events-none" />
              </div>
            </div>
          )}

          {/* All Day Toggle */}
          {type === 'event' && (
            <div className="flex items-center justify-between p-4 rounded-[18px] bg-white/20 backdrop-blur-xl border border-white/15">
              <Label htmlFor="all-day" className="cursor-pointer">All-day event</Label>
              <Switch
                id="all-day"
                checked={isAllDay}
                onCheckedChange={setIsAllDay}
              />
            </div>
          )}

          {/* Category */}
          <div className="space-y-3">
            <Label>Category</Label>
            <div className="grid grid-cols-3 gap-2">
              {CATEGORY_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setCategory(option.value)}
                  className={cn(
                    "px-4 py-3 rounded-[16px] text-[13px] font-semibold transition-all",
                    "backdrop-blur-xl border",
                    category === option.value
                      ? `${option.color} border-white/20 shadow-elevation-2`
                      : "bg-white/10 border-white/10 hover:bg-white/20"
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Repeat */}
          <div className="space-y-2">
            <Label htmlFor="repeat">Repeat</Label>
            <Select value={repeatRule} onValueChange={(value) => setRepeatRule(value as RepeatRule)}>
              <SelectTrigger id="repeat" className="backdrop-blur-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Reminder */}
          <div className="space-y-2">
            <Label htmlFor="reminder">Reminder</Label>
            <Select value={reminder} onValueChange={(value) => setReminder(value as ReminderType)}>
              <SelectTrigger id="reminder" className="backdrop-blur-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="at_time">At time of event</SelectItem>
                <SelectItem value="5_min">5 minutes before</SelectItem>
                <SelectItem value="10_min">10 minutes before</SelectItem>
                <SelectItem value="30_min">30 minutes before</SelectItem>
                <SelectItem value="1_day">1 day before</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes..."
              className="backdrop-blur-xl min-h-[100px]"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background via-background to-transparent">
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={handleSave}
              disabled={!title.trim()}
            >
              {editItem ? 'Save Changes' : 'Create'}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
