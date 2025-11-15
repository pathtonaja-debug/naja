import { supabase } from "@/integrations/supabase/client";
import { CalendarItem } from "@/types/calendar";
import { getDeviceId } from "@/lib/deviceId";

// Convert database format to app format
const dbToCalendarItem = (item: any): CalendarItem => ({
  id: item.id,
  type: item.type,
  title: item.title,
  notes: item.notes,
  startDateTime: item.start_date_time,
  endDateTime: item.end_date_time,
  isAllDay: item.is_all_day,
  category: item.category,
  completion: item.completion,
  calendarSource: item.calendar_source,
  color: item.color,
  repeatRule: item.repeat_rule,
  reminder: item.reminder,
  userId: item.user_id,
  deviceId: item.device_id,
  createdAt: item.created_at,
  updatedAt: item.updated_at,
});

// Convert app format to database format
const calendarItemToDb = (item: Partial<CalendarItem>) => ({
  type: item.type,
  title: item.title,
  notes: item.notes,
  start_date_time: item.startDateTime,
  end_date_time: item.endDateTime,
  is_all_day: item.isAllDay,
  category: item.category,
  completion: item.completion,
  calendar_source: item.calendarSource,
  color: item.color,
  repeat_rule: item.repeatRule,
  reminder: item.reminder,
  device_id: getDeviceId(),
});

export const getCalendarItems = async (
  startDate: Date,
  endDate: Date
): Promise<CalendarItem[]> => {
  const { data, error } = await supabase
    .from("calendar_items")
    .select("*")
    .gte("start_date_time", startDate.toISOString())
    .lte("start_date_time", endDate.toISOString())
    .order("start_date_time", { ascending: true });

  if (error) throw error;
  return (data || []).map(dbToCalendarItem);
};

export const getCalendarItemsByDate = async (date: Date): Promise<CalendarItem[]> => {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  return getCalendarItems(startOfDay, endOfDay);
};

export const createCalendarItem = async (
  item: Omit<CalendarItem, "id" | "createdAt" | "updatedAt">
): Promise<CalendarItem> => {
  const { data, error } = await supabase
    .from("calendar_items")
    .insert(calendarItemToDb(item))
    .select()
    .single();

  if (error) throw error;
  return dbToCalendarItem(data);
};

export const updateCalendarItem = async (
  id: string,
  updates: Partial<CalendarItem>
): Promise<CalendarItem> => {
  const { data, error } = await supabase
    .from("calendar_items")
    .update(calendarItemToDb(updates))
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return dbToCalendarItem(data);
};

export const deleteCalendarItem = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from("calendar_items")
    .delete()
    .eq("id", id);

  if (error) throw error;
};

export const toggleTaskCompletion = async (
  id: string,
  completed: boolean
): Promise<CalendarItem> => {
  return updateCalendarItem(id, { completion: completed ? 100 : 0 });
};
