import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Home, BookHeart, GraduationCap, User, Plus,
  Heart, BookOpen, PenLine, CalendarDays
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [quickActionOpen, setQuickActionOpen] = useState(false);

  const mainTabs = [
    { icon: Home, path: "/dashboard", label: "Home" },
    { icon: BookHeart, path: "/practices", label: "Practices" },
  ];

  const secondaryTabs = [
    { icon: GraduationCap, path: "/learn", label: "Learn" },
    { icon: User, path: "/profile", label: "Profile" },
  ];

  const quickActions = [
    { icon: Heart, path: "/practices", label: "Dhikr", hash: "#dhikr" },
    { icon: BookOpen, path: "/practices", label: "Dua Builder", hash: "#dua" },
    { icon: PenLine, path: "/journal", label: "Journal" },
    { icon: CalendarDays, path: "/dates", label: "Dates" },
  ];

  const handleQuickAction = (action: typeof quickActions[0]) => {
    setQuickActionOpen(false);
    if (action.hash) {
      navigate(action.path + action.hash);
    } else {
      navigate(action.path);
    }
  };

  const NavButton = ({ icon: Icon, path, label }: { icon: typeof Home; path: string; label: string }) => {
    const isActive = location.pathname === path;
    return (
      <button
        onClick={() => navigate(path)}
        className="relative flex flex-col items-center gap-0.5 py-2 px-4 rounded-xl transition-all"
      >
        {isActive && (
          <motion.div
            layoutId="activeNavTab"
            className="absolute inset-0 bg-primary/10 rounded-xl"
            transition={{ type: "spring", duration: 0.4, bounce: 0.2 }}
          />
        )}
        <Icon 
          className={cn(
            "w-5 h-5 relative z-10 transition-colors",
            isActive ? "text-primary" : "text-muted-foreground"
          )} 
        />
        <span 
          className={cn(
            "text-[10px] font-medium relative z-10 transition-colors",
            isActive ? "text-primary" : "text-muted-foreground"
          )}
        >
          {label}
        </span>
      </button>
    );
  };

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 pb-safe">
        <div className="px-4 pb-4 pt-2">
          <div className="bg-card/95 backdrop-blur-xl border border-border/50 rounded-2xl px-2 py-2 flex items-center justify-around max-w-md mx-auto shadow-lg">
            {/* Left tabs */}
            {mainTabs.map((tab) => (
              <NavButton key={tab.path} {...tab} />
            ))}

            {/* Center quick action button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setQuickActionOpen(true)}
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center",
                "bg-gradient-to-br from-primary to-primary/80",
                "text-primary-foreground shadow-lg shadow-primary/25",
                "transition-transform hover:scale-105"
              )}
              aria-label="Quick Actions"
            >
              <Plus className="w-6 h-6" />
            </motion.button>

            {/* Right tabs */}
            {secondaryTabs.map((tab) => (
              <NavButton key={tab.path} {...tab} />
            ))}
          </div>
        </div>
      </nav>

      {/* Quick Action Sheet */}
      <Sheet open={quickActionOpen} onOpenChange={setQuickActionOpen}>
        <SheetContent side="bottom" className="rounded-t-3xl pb-safe">
          <SheetHeader className="mb-4">
            <SheetTitle className="text-lg">Quick Actions</SheetTitle>
          </SheetHeader>
          
          <div className="grid grid-cols-2 gap-3 pb-4">
            {quickActions.map((action, index) => (
              <motion.button
                key={action.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleQuickAction(action)}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-muted/50 border border-border/50 hover:bg-muted transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <action.icon className="w-6 h-6 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground">{action.label}</span>
              </motion.button>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default BottomNav;
