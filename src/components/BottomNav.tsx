import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, BookOpen, Target, TrendingUp, UserCircle, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { icon: Home, path: "/dashboard", label: "Dashboard" },
    { icon: Calendar, path: "/calendar", label: "Calendar" },
    { icon: BookOpen, path: "/journal", label: "Journal" },
    { icon: Target, path: "/habits", label: "Habits" },
    { icon: TrendingUp, path: "/progress", label: "Progress" },
    { icon: UserCircle, path: "/profile", label: "Profile" },
  ];

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 px-6 w-full max-w-2xl z-50 pointer-events-none">
      <div className="liquid-glass rounded-pill px-4 py-2.5 pointer-events-auto">
        <div className="flex justify-around items-center gap-1">
          {tabs.map((tab) => {
            const isActive = location.pathname === tab.path;
            return (
              <Button
                key={tab.path}
                size="icon"
                variant="ghost"
                onClick={() => navigate(tab.path)}
                className={cn(
                  "w-11 h-11 rounded-full transition-all",
                  "duration-[var(--duration-medium)] ease-[var(--easing-smooth)]",
                  isActive
                    ? "bg-primary text-primary-foreground glow-ring"
                    : "bg-transparent text-foreground/60 hover:bg-muted/50 hover:text-foreground"
                )}
                aria-label={tab.label}
              >
                <tab.icon className="w-5 h-5" />
              </Button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
