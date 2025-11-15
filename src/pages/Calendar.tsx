import { useState, useEffect } from "react";
import { TopBar } from "@/components/ui/top-bar";
import { Button } from "@/components/ui/button";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Plus } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { YearView } from "@/components/calendar/YearView";
import { MonthView } from "@/components/calendar/MonthView";
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
  startOfYear,
  endOfYear,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  startOfDay,
  endOfDay,
} from "date-fns";
import { toast } from "sonner";

type ViewType = "year" | "month" | "week" | "day";

const Calendar = () => {
  const [view, setView] = useState<ViewType>(() => {
    return (localStorage.getItem("calendar-view") as ViewType) || "month";
  });
  const [currentDate, setCurrentDate] = useState(new Date());
  const [items, setItems] = useState<CalendarItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CalendarItem | undefined>();
  const [prefilledDate, setPrefilledDate] = useState<Date | undefined>();

  // Persist view selection
  useEffect(() => {
    localStorage.setItem("calendar-view", view);
  }, [view]);

  // Load items based on current view and date
  useEffect(() => {
    loadItems();
  }, [currentDate, view]);

  const loadItems = async () => {
    setIsLoading(true);
    try {
      let startDate: Date, endDate: Date;

      switch (view) {
        case "year":
          startDate = startOfYear(currentDate);
          endDate = endOfYear(currentDate);
          break;
        case "month":
          startDate = startOfMonth(currentDate);
          endDate = endOfMonth(currentDate);
          break;
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

  const handleMonthPress = (month: Date) => {
    setCurrentDate(month);
    setView("month");
  };

  const handleDayPress = (day: Date) => {
    setCurrentDate(day);
    setView("day");
  };

  const handleAddPress = () => {
    setEditingItem(undefined);
    setPrefilledDate(currentDate);
    setSheetOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink/40 via-lilac/30 to-sky/40">
      <TopBar title="Calendar" />

      {/* View Selector */}
      <div className="px-6 pt-4 pb-6">
        <SegmentedControl
          value={view}
          onValueChange={(value) => setView(value as ViewType)}
          options={[
            { label: "Year", value: "year" },
            { label: "Month", value: "month" },
            { label: "Week", value: "week" },
            { label: "Day", value: "day" },
          ]}
        />
      </div>

      {/* View Content */}
      <div className="pb-24">
        {view === "year" && (
          <YearView
            year={currentDate.getFullYear()}
            items={items}
            onMonthPress={handleMonthPress}
          />
        )}

        {view === "month" && (
          <MonthView
            month={currentDate}
            items={items}
            onMonthChange={setCurrentDate}
            onDayPress={handleDayPress}
            onItemPress={handleItemPress}
            onToggleComplete={handleToggleComplete}
          />
        )}

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

      {/* FAB */}
      <div className="fixed bottom-24 right-6 z-40">
        <Button
          size="icon"
          className="w-14 h-14 rounded-full shadow-elevation-3 bg-pink hover:bg-pink/90"
          onClick={handleAddPress}
        >
          <Plus className="w-6 h-6" />
        </Button>
      </div>

      {/* Add/Edit Sheet */}
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
