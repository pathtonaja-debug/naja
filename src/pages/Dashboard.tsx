import { useEffect } from "react";
import BottomNav from "@/components/BottomNav";
import { UserHeader } from "@/components/dashboard/UserHeader";
import { NextPrayerWidget } from "@/components/dashboard/NextPrayerWidget";
import { TodaysOverview } from "@/components/dashboard/TodaysOverview";
import { HabitTrackerPreview } from "@/components/dashboard/HabitTrackerPreview";
import { PrayerTimesList } from "@/components/dashboard/PrayerTimesList";
import { PrayerTracker } from "@/components/dashboard/PrayerTracker";
import { DhikrCounter } from "@/components/dashboard/DhikrCounter";
import { useProfile } from "@/hooks/useProfile";
import { initializeNotifications } from "@/services/notifications";
import { syncAllHabitsToCalendar } from "@/services/calendarSync";
import { Skeleton } from "@/components/ui/skeleton";
import ErrorBoundary from "@/components/ErrorBoundary";

const Dashboard = () => {
  const { profile, loading } = useProfile();

  useEffect(() => {
    // Initialize notifications on dashboard load
    initializeNotifications();
    
    // Sync habits to calendar
    syncAllHabitsToCalendar();
  }, []);

  return (
    <div className="min-h-screen bg-background pb-24">
      {loading ? (
        <div className="px-5 pt-4 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="w-14 h-14 rounded-full" />
            <div>
              <Skeleton className="h-3 w-20 mb-2" />
              <Skeleton className="h-5 w-32" />
            </div>
          </div>
        </div>
      ) : (
        <UserHeader userName={profile?.display_name || "User"} />
      )}

      <main className="space-y-0">
        <div className="px-5 py-3">
          <ErrorBoundary fallback={<div className="p-4 text-center text-muted-foreground">Unable to load prayer widget</div>}>
            <NextPrayerWidget />
          </ErrorBoundary>
        </div>

        <ErrorBoundary fallback={<div className="p-4 text-center text-muted-foreground">Unable to load overview</div>}>
          <TodaysOverview />
        </ErrorBoundary>

        {/* 5-Prayer Individual Tracker */}
        <ErrorBoundary fallback={<div className="p-4 text-center text-muted-foreground">Unable to load prayer tracker</div>}>
          <PrayerTracker />
        </ErrorBoundary>

        <ErrorBoundary fallback={<div className="p-4 text-center text-muted-foreground">Unable to load habits</div>}>
          <HabitTrackerPreview />
        </ErrorBoundary>

        <div className="px-5 py-3">
          <ErrorBoundary fallback={<div className="p-4 text-center text-muted-foreground">Unable to load dhikr counter</div>}>
            <DhikrCounter />
          </ErrorBoundary>
        </div>

        <ErrorBoundary fallback={<div className="p-4 text-center text-muted-foreground">Unable to load prayer times</div>}>
          <PrayerTimesList />
        </ErrorBoundary>
      </main>

      <BottomNav />
    </div>
  );
};

export default Dashboard;