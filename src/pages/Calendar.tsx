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
  startOfMonth,
  endOfMonth,
} from "date-fns";
import { toast } from "sonner";
import { motion } from "framer-motion";

type ViewType = "week" | "month";

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

      if (view === "week") {
        startDate = startOfWeek(currentDate);
        endDate = endOfWeek(currentDate);
      } else {
        startDate = startOfMonth(currentDate);
        endDate = endOfMonth(currentDate);
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
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-background"
    >
      <TopBar title="Islamic Calendar" />

      <motion.div 
        className="px-4 pt-2 pb-3"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <SegmentedControl
          value={view}
          onValueChange={(value) => setView(value as ViewType)}
          options={[
            { label: "Weekly", value: "week" },
            { label: "Monthly", value: "month" },
          ]}
        />
      </motion.div>

      <div className="pb-32 overflow-y-auto">
        {view === "week" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
          >
            <WeekView
              week={currentDate}
              items={items}
              onWeekChange={setCurrentDate}
              onItemPress={handleItemPress}
            />
          </motion.div>
        )}

        {view === "month" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
          >
            <DayView
              day={currentDate}
              items={items}
              onDayChange={setCurrentDate}
              onItemPress={handleItemPress}
              onToggleComplete={handleToggleComplete}
            />
          </motion.div>
        )}
      </div>

      {/* Full-width Add Event Button */}
      <motion.div 
        className="fixed bottom-20 left-4 right-4 z-40"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 400 }}
      >
        <Button
          className="w-full h-11 rounded-xl font-medium text-sm"
          onClick={handleAddPress}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Event
        </Button>
      </motion.div>

      <AddItemSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onSave={handleSaveItem}
        editItem={editingItem}
        prefilledDate={prefilledDate}
      />

      <BottomNav />
    </motion.div>
  );
};

export default Calendar;
