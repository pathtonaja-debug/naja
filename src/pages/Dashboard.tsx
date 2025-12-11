import { useEffect } from "react";
import BottomNav from "@/components/BottomNav";
import { HeroSection } from "@/components/dashboard/HeroSection";
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-24">
        <div className="mx-4 mt-4">
          <Skeleton className="h-[280px] sm:h-[320px] rounded-card" />
        </div>
        <div className="p-4 space-y-4">
          <Skeleton className="h-32 rounded-card" />
          <Skeleton className="h-48 rounded-card" />
          <Skeleton className="h-64 rounded-card" />
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-28">
      {/* Hero Section with Mosque Image */}
      <ErrorBoundary fallback={<div className="h-[280px] bg-muted rounded-card mx-4 mt-4" />}>
        <HeroSection 
          userName={profile?.display_name || "User"}
          city={profile?.city || undefined}
          country={profile?.country || undefined}
        />
      </ErrorBoundary>
      
      {/* Content Sections */}
      <div className="p-4 space-y-5">
        {/* Today's Overview */}
        <ErrorBoundary fallback={<div className="h-32 bg-muted rounded-card" />}>
          <TodaysOverview />
        </ErrorBoundary>

        {/* 5-Prayer Individual Tracker */}
        <ErrorBoundary fallback={<div className="h-32 bg-muted rounded-card" />}>
          <PrayerTracker />
        </ErrorBoundary>

        {/* Habit Tracker Preview */}
        <ErrorBoundary fallback={<div className="h-48 bg-muted rounded-card" />}>
          <HabitTrackerPreview />
        </ErrorBoundary>

        {/* Dhikr Counter */}
        <ErrorBoundary fallback={<div className="h-64 bg-muted rounded-card" />}>
          <DhikrCounter />
        </ErrorBoundary>

        {/* Prayer Times List */}
        <ErrorBoundary fallback={<div className="h-64 bg-muted rounded-card" />}>
          <PrayerTimesList />
        </ErrorBoundary>
      </div>

      <BottomNav />
    </div>
  );
};

export default Dashboard;