import BottomNav from "@/components/BottomNav";
import { UserHeader } from "@/components/dashboard/UserHeader";
import { NextPrayerWidget } from "@/components/dashboard/NextPrayerWidget";
import { TodaysOverview } from "@/components/dashboard/TodaysOverview";
import { HabitTrackerPreview } from "@/components/dashboard/HabitTrackerPreview";
import { PrayerTimesList } from "@/components/dashboard/PrayerTimesList";
import { DhikrCounter } from "@/components/dashboard/DhikrCounter";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background pb-24">
      <UserHeader userName="User" />

      <main className="space-y-0">
        <div className="px-5 py-3">
          <NextPrayerWidget />
        </div>

        <TodaysOverview />

        <HabitTrackerPreview />

        <div className="px-5 py-3">
          <DhikrCounter />
        </div>

        <PrayerTimesList />
      </main>

      <BottomNav />
    </div>
  );
};

export default Dashboard;