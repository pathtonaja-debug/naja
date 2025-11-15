import { useState, useEffect } from "react";
import BottomNav from "@/components/BottomNav";
import AICompanion from "@/components/AICompanion";
import { UserHeader } from "@/components/dashboard/UserHeader";
import { NextPrayerWidget } from "@/components/dashboard/NextPrayerWidget";
import { AICompanionCard } from "@/components/dashboard/AICompanionCard";
import { QuickTools } from "@/components/dashboard/QuickTools";
import { TodaysOverview } from "@/components/dashboard/TodaysOverview";
import { YourInsights } from "@/components/dashboard/YourInsights";
import { HabitTrackerPreview } from "@/components/dashboard/HabitTrackerPreview";
import { PrayerTimesList } from "@/components/dashboard/PrayerTimesList";
import { JournalEntryPreview } from "@/components/dashboard/JournalEntryPreview";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [companionOpen, setCompanionOpen] = useState(false);
  const [hasCompanion, setHasCompanion] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onboarded = localStorage.getItem("companion-onboarded");
    setHasCompanion(!!onboarded);
    
    if (!onboarded) {
      const firstVisit = localStorage.getItem("first-dashboard-visit");
      if (!firstVisit) {
        localStorage.setItem("first-dashboard-visit", "true");
        setTimeout(() => navigate("/companion-setup"), 500);
      }
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background pb-24">
      <UserHeader
        userName="Aisha Rahman"
        hasCompanion={hasCompanion}
        onCompanionClick={() => setCompanionOpen(true)}
      />

      <main className="space-y-0">
        <div className="px-5 py-3">
          <NextPrayerWidget />
        </div>

        {hasCompanion && (
          <AICompanionCard
            name="Noor"
            onChatClick={() => setCompanionOpen(true)}
            onSettingsClick={() => navigate("/companion-setup")}
          />
        )}

        <QuickTools />

        <TodaysOverview />

        <YourInsights />

        <HabitTrackerPreview />

        <PrayerTimesList />

        <JournalEntryPreview />
      </main>

      <AICompanion onClose={() => setCompanionOpen(false)} isOpen={companionOpen} />
      <BottomNav />
    </div>
  );
};

export default Dashboard;
