import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, BookOpen, ListChecks, Heart, UserCircle, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { icon: Home, path: "/dashboard", label: "Dashboard" },
    { icon: BookOpen, path: "/journal", label: "Journal" },
    { icon: ListChecks, path: "/habits", label: "Habits" },
    { icon: Heart, path: "/duas", label: "Duas" },
    { icon: TrendingUp, path: "/progress", label: "Progress" },
    { icon: UserCircle, path: "/profile", label: "Profile" },
  ];

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 px-6 w-full max-w-2xl z-50 pointer-events-none">
      <div className="backdrop-blur-xl bg-glass border border-glass-border rounded-pill shadow-elevation-2 px-3 py-2 pointer-events-auto">
        <div className="flex justify-around items-center gap-2">
          {tabs.map((tab) => {
            const isActive = location.pathname === tab.path;
            return (
              <Button
                key={tab.path}
                size="icon"
                variant="ghost"
                onClick={() => navigate(tab.path)}
                className={cn(
                  "w-12 h-12 rounded-full transition-all duration-fast ease-ios",
                  isActive
                    ? "bg-surface shadow-elevation-1 hover:bg-surface/90"
                    : "bg-transparent hover:bg-surface/50"
                )}
              >
                <tab.icon 
                  className={cn(
                    "w-5 h-5 transition-colors",
                    isActive ? "text-primary" : "text-foreground-muted"
                  )} 
                />
              </Button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
