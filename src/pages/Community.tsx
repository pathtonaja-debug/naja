import BottomNav from "@/components/BottomNav";
import { TopBar } from "@/components/ui/top-bar";
import { Users } from "lucide-react";
import { useState } from "react";
import AICompanion from "@/components/AICompanion";

const Community = () => {
  const [companionOpen, setCompanionOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background pb-24">
      <TopBar title="Community" />

      <main className="px-5 py-6 space-y-6">
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <Users className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-2xl font-semibold text-center">Community</h2>
          <p className="text-muted-foreground text-center max-w-md">
            Coming soon: Connect with fellow Muslims, share your journey, and grow together in faith.
          </p>
        </div>
      </main>

      <AICompanion onClose={() => setCompanionOpen(false)} isOpen={companionOpen} />
      <BottomNav onChatbotOpen={() => setCompanionOpen(true)} />
    </div>
  );
};

export default Community;
