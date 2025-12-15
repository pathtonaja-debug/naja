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
import { motion } from "framer-motion";
import mosqueWatercolor from "@/assets/illustrations/mosque-watercolor.png";

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
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-background relative overflow-hidden"
    >
      {/* Watercolor decoration */}
      <motion.img 
        src={mosqueWatercolor}
        alt=""
        className="absolute top-0 right-0 w-36 h-36 object-contain opacity-20 pointer-events-none"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 0.2, x: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      />
      
      <TopBar title="Calendar" />

      <motion.div 
        className="px-4 pt-2 pb-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <SegmentedControl
          value={view}
          onValueChange={(value) => setView(value as ViewType)}
          options={[
            { label: "Week", value: "week" },
            { label: "Day", value: "day" },
          ]}
        />
      </motion.div>

      <div className="pb-24">
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

        {view === "day" && (
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

      <motion.div 
        className="fixed bottom-24 right-4 z-40"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 400 }}
      >
        <Button
          size="icon"
          className="w-12 h-12 rounded-full shadow-lg"
          onClick={handleAddPress}
        >
          <Plus className="w-5 h-5" />
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
