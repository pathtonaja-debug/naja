// Calendar sync service for habits
import { supabase } from "@/integrations/supabase/client";
import { getAuthenticatedUserId } from "@/lib/auth";
import { format, addDays, startOfDay } from "date-fns";

export interface SyncedCalendarItem {
  id: string;
  title: string;
  type: "habit" | "event" | "task";
  category: string;
  start_date_time: string;
  end_date_time: string | null;
  is_all_day: boolean;
  color: string | null;
}

// Sync a habit to the calendar
export async function syncHabitToCalendar(habit: {
  id: string;
  name: string;
  category: string | null;
  habit_time: string | null;
  is_all_day: boolean | null;
  color: string | null;
  repeat_pattern: any;
}): Promise<void> {
  const userId = await getAuthenticatedUserId();
  const today = startOfDay(new Date());

  // Check if habit is already synced for today
  const { data: existing } = await supabase
    .from("calendar_items")
    .select("id")
    .eq("user_id", userId)
    .eq("title", habit.name)
    .eq("type", "habit")
    .gte("start_date_time", format(today, "yyyy-MM-dd"));

  if (existing && existing.length > 0) {
    // Already synced
    return;
  }

  // Create calendar item for habit
  const startTime = habit.habit_time || "09:00:00";
  const startDateTime = `${format(today, "yyyy-MM-dd")}T${startTime}`;

  await supabase.from("calendar_items").insert({
    user_id: userId,
    title: habit.name,
    type: "habit",
    category: habit.category || "General",
    start_date_time: startDateTime,
    is_all_day: habit.is_all_day ?? true,
    color: habit.color,
    calendar_source: "NAJA",
  });
}

// Fetch habits with calendar sync enabled and sync them
export async function syncAllHabitsToCalendar(): Promise<number> {
  try {
    const userId = await getAuthenticatedUserId();

    // Fetch habits that should sync to calendar
    const { data: habits, error } = await supabase
      .from("habits")
      .select("*")
      .eq("user_id", userId)
      .eq("is_active", true)
      .eq("sync_to_calendar", true);

    if (error) throw error;
    if (!habits || habits.length === 0) return 0;

    let syncedCount = 0;

    for (const habit of habits) {
      try {
        await syncHabitToCalendar(habit);
        syncedCount++;
      } catch (e) {
        console.error(`Failed to sync habit ${habit.name}:`, e);
      }
    }

    return syncedCount;
  } catch (error) {
    console.error("Failed to sync habits to calendar:", error);
    return 0;
  }
}

// Get calendar items including synced habits
export async function getCalendarItemsWithHabits(
  startDate: Date,
  endDate: Date
): Promise<SyncedCalendarItem[]> {
  try {
    const userId = await getAuthenticatedUserId();

    const { data, error } = await supabase
      .from("calendar_items")
      .select("*")
      .eq("user_id", userId)
      .gte("start_date_time", format(startDate, "yyyy-MM-dd"))
      .lte("start_date_time", format(endDate, "yyyy-MM-dd"))
      .order("start_date_time", { ascending: true });

    if (error) throw error;

    return (data || []).map((item) => ({
      id: item.id,
      title: item.title,
      type: item.type as "habit" | "event" | "task",
      category: item.category,
      start_date_time: item.start_date_time,
      end_date_time: item.end_date_time,
      is_all_day: item.is_all_day ?? false,
      color: item.color,
    }));
  } catch (error) {
    console.error("Failed to fetch calendar items:", error);
    return [];
  }
}

// Remove habit from calendar
export async function removeHabitFromCalendar(habitName: string): Promise<void> {
  try {
    const userId = await getAuthenticatedUserId();

    await supabase
      .from("calendar_items")
      .delete()
      .eq("user_id", userId)
      .eq("title", habitName)
      .eq("type", "habit");
  } catch (error) {
    console.error("Failed to remove habit from calendar:", error);
  }
}
