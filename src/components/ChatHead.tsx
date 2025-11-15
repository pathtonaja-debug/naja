import { useState, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet";
import AICompanion from "./AICompanion";
import { supabase } from "@/integrations/supabase/client";
import { getDeviceId } from "@/lib/deviceId";

const ChatHead = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [portraitUrl, setPortraitUrl] = useState<string | null>(null);
  const [companionName, setCompanionName] = useState("NAJA");
  const [unreadCount] = useState(0); // TODO: Implement unread logic

  useEffect(() => {
    loadCompanionProfile();

    // Keyboard shortcut: Cmd+/ or Ctrl+/
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "/") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  const loadCompanionProfile = async () => {
    try {
      const deviceId = await getDeviceId();
      const { data, error } = await supabase
        .from("companion_profiles")
        .select("portrait_url, name")
        .eq("device_id", deviceId)
        .single();

      if (error) throw error;

      if (data) {
        setPortraitUrl(data.portrait_url);
        setCompanionName(data.name || "NAJA");
      }
    } catch (error) {
      console.error("Error loading companion profile:", error);
    }
  };

  return (
    <>
      {/* ChatHead Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 z-50 w-11 h-11 rounded-full shadow-soft transition-all duration-nja ease-nja hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-sage-deep"
        aria-label={`Chat with ${companionName}`}
        title={`Chat with ${companionName} (⌘/)`}
      >
        <Avatar className="w-full h-full border-2 border-white dark:border-gray-800">
          <AvatarImage src={portraitUrl || undefined} alt={companionName} />
          <AvatarFallback className="bg-sage text-chip text-sm font-medium">
            {companionName[0]}
          </AvatarFallback>
        </Avatar>
        {unreadCount > 0 && (
          <Badge 
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-info text-white text-xs"
            variant="default"
          >
            {unreadCount}
          </Badge>
        )}
      </button>

      {/* Chat Panel */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent 
          side="right" 
          className="w-full sm:w-[420px] md:w-[480px] p-0 bg-surface/95 backdrop-blur-xl border-l border-border"
        >
          <SheetHeader className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-lg font-semibold text-ink">
                Chat with {companionName}
              </SheetTitle>
              <SheetClose asChild>
                <button
                  className="rounded-full p-2 hover:bg-surfaceAlt transition-colors"
                  aria-label="Close chat"
                >
                  <X className="w-5 h-5 text-inkMuted" />
                </button>
              </SheetClose>
            </div>
          </SheetHeader>
          
          <div className="h-[calc(100vh-5rem)]">
            <AICompanion onClose={() => setIsOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default ChatHead;
