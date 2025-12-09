// Notification service for prayer reminders, habit alerts, and reflections

export interface NotificationPreferences {
  prayerReminders: boolean;
  habitReminders: boolean;
  reflectionReminders: boolean;
  quietHoursStart: string; // "22:00"
  quietHoursEnd: string; // "06:00"
}

// Check if browser supports notifications
export function isNotificationSupported(): boolean {
  return "Notification" in window;
}

// Request notification permission
export async function requestNotificationPermission(): Promise<boolean> {
  if (!isNotificationSupported()) {
    console.warn("Notifications not supported");
    return false;
  }

  if (Notification.permission === "granted") {
    return true;
  }

  if (Notification.permission === "denied") {
    return false;
  }

  const permission = await Notification.requestPermission();
  return permission === "granted";
}

// Check if currently in quiet hours
export function isQuietHours(
  quietStart: string,
  quietEnd: string
): boolean {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const [startHour, startMin] = quietStart.split(":").map(Number);
  const [endHour, endMin] = quietEnd.split(":").map(Number);

  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;

  // Handle overnight quiet hours (e.g., 22:00 - 06:00)
  if (startMinutes > endMinutes) {
    return currentMinutes >= startMinutes || currentMinutes <= endMinutes;
  }

  return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
}

// Schedule a notification
export function scheduleNotification(
  title: string,
  options: NotificationOptions & { delay?: number }
): NodeJS.Timeout | null {
  if (!isNotificationSupported() || Notification.permission !== "granted") {
    return null;
  }

  const { delay = 0, ...notificationOptions } = options;

  const timeoutId = setTimeout(() => {
    new Notification(title, {
      icon: "/favicon.ico",
      badge: "/favicon.ico",
      ...notificationOptions,
    });
  }, delay);

  return timeoutId;
}

// Send immediate notification
export function sendNotification(
  title: string,
  body: string,
  tag?: string
): Notification | null {
  if (!isNotificationSupported() || Notification.permission !== "granted") {
    return null;
  }

  return new Notification(title, {
    body,
    icon: "/favicon.ico",
    tag,
    requireInteraction: false,
  });
}

// Prayer reminder notification
export function schedulePrayerReminder(
  prayerName: string,
  minutesBefore: number = 15
): NodeJS.Timeout | null {
  return scheduleNotification(`${prayerName} Prayer Soon`, {
    body: `${prayerName} is in ${minutesBefore} minutes. Prepare for prayer.`,
    tag: `prayer-${prayerName.toLowerCase()}`,
  });
}

// Habit reminder notification
export function sendHabitReminder(habitName: string): Notification | null {
  return sendNotification(
    "Habit Reminder",
    `Don't forget to complete: ${habitName}`,
    `habit-${habitName.toLowerCase().replace(/\s+/g, "-")}`
  );
}

// Daily reflection reminder
export function sendReflectionReminder(): Notification | null {
  return sendNotification(
    "Daily Reflection",
    "Take a moment to reflect on your day and write in your journal.",
    "daily-reflection"
  );
}

// Get notification preferences from localStorage
export function getNotificationPreferences(): NotificationPreferences {
  const stored = localStorage.getItem("notification-preferences");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // Fall through to defaults
    }
  }

  return {
    prayerReminders: true,
    habitReminders: true,
    reflectionReminders: true,
    quietHoursStart: "22:00",
    quietHoursEnd: "06:00",
  };
}

// Save notification preferences to localStorage
export function saveNotificationPreferences(
  preferences: NotificationPreferences
): void {
  localStorage.setItem("notification-preferences", JSON.stringify(preferences));
}

// Initialize notifications system
export async function initializeNotifications(): Promise<boolean> {
  const hasPermission = await requestNotificationPermission();
  
  if (hasPermission) {
    // Schedule daily reflection reminder at 8 PM
    const now = new Date();
    const reminderTime = new Date();
    reminderTime.setHours(20, 0, 0, 0);

    if (now > reminderTime) {
      reminderTime.setDate(reminderTime.getDate() + 1);
    }

    const delay = reminderTime.getTime() - now.getTime();
    
    scheduleNotification("Daily Reflection Reminder", {
      body: "Take a moment to reflect on your day.",
      delay,
      tag: "daily-reflection",
    });
  }

  return hasPermission;
}
