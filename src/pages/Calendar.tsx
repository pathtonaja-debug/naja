import { useState, useEffect } from "react";
import { TopBar } from "@/components/ui/top-bar";
import { Button } from "@/components/ui/button";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Plus } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { WeekView } from "@/components/calendar/WeekView";
import { DayView } from "@/components/calendar/DayView";
import { AddItemSheet } from "@/components/calendar/AddItemSheet";
import { CalendarItem } from "@/types/calendar";
import {
  getCalendarItems,
  createCalendarItem,
  updateCalendarItem,
  deleteCalendarItem,
  toggleTaskCompletion,
} from "@/services/calendar";
import {
  startOfWeek,
  endOfWeek,
  startOfDay,
  endOfDay,
} from "date-fns";
import { toast } from "sonner";

type ViewType = "week" | "day";

const Calendar = () => {
  const [view, setView] = useState<ViewType>(() => {
    return (localStorage.getItem("calendar-view") as ViewType) || "week";
  });
  const [currentDate, setCurrentDate] = useState(new Date());
  const [items, setItems] = useState<CalendarItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CalendarItem | undefined>();
  const [prefilledDate, setPrefilledDate] = useState<Date | undefined>();

  useEffect(() => {
    localStorage.setItem("calendar-view", view);
  }, [view]);

  useEffect(() => {
    loadItems();
  }, [currentDate, view]);

  const loadItems = async () => {
    setIsLoading(true);
    try {
      let startDate: Date, endDate: Date;

      switch (view) {
        case "week":
          startDate = startOfWeek(currentDate);
          endDate = endOfWeek(currentDate);
          break;
        case "day":
          startDate = startOfDay(currentDate);
          endDate = endOfDay(currentDate);
          break;
      }

      const data = await getCalendarItems(startDate, endDate);
      setItems(data);
    } catch (error) {
      console.error("Failed to load calendar items:", error);
      toast.error("Failed to load calendar items");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveItem = async (item: Partial<CalendarItem>) => {
    try {
      if (item.id) {
        await updateCalendarItem(item.id, item);
        toast.success("Item updated successfully");
      } else {
        await createCalendarItem(item as Omit<CalendarItem, "id" | "createdAt" | "updatedAt">);
        toast.success("Item created successfully");
      }
      loadItems();
      setEditingItem(undefined);
    } catch (error) {
      console.error("Failed to save item:", error);
      toast.error("Failed to save item");
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      await deleteCalendarItem(id);
      toast.success("Item deleted successfully");
      loadItems();
    } catch (error) {
      console.error("Failed to delete item:", error);
      toast.error("Failed to delete item");
    }
  };

  const handleToggleComplete = async (item: CalendarItem) => {
    if (item.type !== "task") return;
    try {
      await toggleTaskCompletion(item.id, item.completion !== 100);
      loadItems();
    } catch (error) {
      console.error("Failed to toggle task completion:", error);
      toast.error("Failed to update task");
    }
  };

  const handleItemPress = (item: CalendarItem) => {
    setEditingItem(item);
    setSheetOpen(true);
  };

  const handleAddPress = () => {
    setEditingItem(undefined);
    setPrefilledDate(currentDate);
    setSheetOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <TopBar title="Calendar" />

      <div className="px-6 pt-4 pb-6">
        <SegmentedControl
          value={view}
          onValueChange={(value) => setView(value as ViewType)}
          options={[
            { label: "Week", value: "week" },
            { label: "Day", value: "day" },
          ]}
        />
      </div>

      <div className="pb-24">
        {view === "week" && (
          <WeekView
            week={currentDate}
            items={items}
            onWeekChange={setCurrentDate}
            onItemPress={handleItemPress}
          />
        )}

        {view === "day" && (
          <DayView
            day={currentDate}
            items={items}
            onDayChange={setCurrentDate}
            onItemPress={handleItemPress}
            onToggleComplete={handleToggleComplete}
          />
        )}
      </div>

      <div className="fixed bottom-24 right-6 z-40">
        <Button
          size="icon"
          className="w-14 h-14 rounded-full shadow-lg"
          onClick={handleAddPress}
        >
          <Plus className="w-6 h-6" />
        </Button>
      </div>

      <AddItemSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onSave={handleSaveItem}
        editItem={editingItem}
        prefilledDate={prefilledDate}
      />

      <BottomNav />
    </div>
  );
};

export default Calendar;