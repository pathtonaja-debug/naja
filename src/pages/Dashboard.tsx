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
import { motion } from "framer-motion";

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
      <div className="min-h-screen bg-background pb-20">
        <div className="mx-3 mt-3">
          <Skeleton className="h-[200px] rounded-2xl" />
        </div>
        <div className="p-3 space-y-3">
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-background pb-24"
    >
      {/* Hero Section with Illustration */}
      <ErrorBoundary fallback={<div className="h-[180px] bg-muted rounded-2xl mx-4 mt-3" />}>
        <HeroSection 
          userName={profile?.display_name || "User"}
          city={profile?.city || undefined}
          country={profile?.country || undefined}
        />
      </ErrorBoundary>
      
      {/* Content Sections - Compact */}
      <div className="space-y-0.5">
        {/* Today's Overview */}
        <ErrorBoundary fallback={<div className="h-20 bg-muted rounded-xl mx-4" />}>
          <TodaysOverview />
        </ErrorBoundary>

        {/* 5-Prayer Individual Tracker */}
        <ErrorBoundary fallback={<div className="h-24 bg-muted rounded-xl mx-4" />}>
          <PrayerTracker />
        </ErrorBoundary>

        {/* Dhikr Counter */}
        <ErrorBoundary fallback={<div className="h-40 bg-muted rounded-xl mx-4" />}>
          <DhikrCounter />
        </ErrorBoundary>

        {/* Habit Tracker Preview */}
        <ErrorBoundary fallback={<div className="h-32 bg-muted rounded-xl mx-4" />}>
          <HabitTrackerPreview />
        </ErrorBoundary>

        {/* Prayer Times List */}
        <ErrorBoundary fallback={<div className="h-40 bg-muted rounded-xl mx-4" />}>
          <PrayerTimesList />
        </ErrorBoundary>
      </div>

      <BottomNav />
    </motion.div>
  );
};

export default Dashboard;
