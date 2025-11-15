import { useState, useEffect } from "react";
import { TopBar } from "@/components/ui/top-bar";
import { Bell, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import BottomNav from "@/components/BottomNav";
import AICompanionButton from "@/components/AICompanionButton";
import AICompanion from "@/components/AICompanion";
import { NextPrayerWidget } from "@/components/dashboard/NextPrayerWidget";
import { TodaySchedule } from "@/components/dashboard/TodaySchedule";
import { QuickStats } from "@/components/dashboard/QuickStats";
import { DhikrCounter } from "@/components/dashboard/DhikrCounter";
import { ReflectionPrompt } from "@/components/dashboard/ReflectionPrompt";
import { CollapsibleSection } from "@/components/ui/collapsible-section";
import { format } from "date-fns";
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
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-secondary/10 to-background pb-24">
      <TopBar
        avatarFallback="N"
        rightElement={
          <div className="flex items-center gap-2">
            <Button size="icon" variant="ghost">
              <Bell className="w-5 h-5" />
            </Button>
            {hasCompanion && (
              <AICompanionButton onClick={() => setCompanionOpen(true)} />
            )}
          </div>
        }
      />

      <div className="px-5 pt-2 pb-4">
        <h1 className="text-large-title text-foreground mb-1">
          As-salamu alaykum
        </h1>
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-foreground-muted" />
          <p className="text-body text-foreground-muted">
            {format(new Date(), "EEEE, MMMM d, yyyy")}
          </p>
        </div>
      </div>

      <main className="px-5 space-y-3">
        <NextPrayerWidget />

        <CollapsibleSection title="Today's Schedule" defaultOpen>
          <TodaySchedule />
        </CollapsibleSection>

        <CollapsibleSection title="Quick Stats">
          <QuickStats />
        </CollapsibleSection>

        <CollapsibleSection title="Dhikr Counter">
          <DhikrCounter />
        </CollapsibleSection>

        <CollapsibleSection title="Daily Reflection">
          <ReflectionPrompt />
        </CollapsibleSection>

        <CollapsibleSection title="Community">
          <div className="liquid-glass p-6 rounded-card text-center text-foreground-muted">
            <p className="text-body">Coming soon...</p>
          </div>
        </CollapsibleSection>
      </main>

      <AICompanion onClose={() => setCompanionOpen(false)} isOpen={companionOpen} />
      <BottomNav />
    </div>
  );
};

export default Dashboard;
