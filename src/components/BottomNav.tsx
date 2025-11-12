import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, BookOpen, ListChecks, Heart, UserCircle, TrendingUp } from "lucide-react";

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
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 px-6 w-full max-w-2xl z-50">
      <div className="bg-foreground rounded-full px-6 py-4 shadow-2xl">
        <div className="flex justify-around items-center">
          {tabs.map((tab) => {
            const isActive = location.pathname === tab.path;
            return (
              <Button
                key={tab.path}
                size="icon"
                variant="ghost"
                onClick={() => navigate(tab.path)}
                className={`rounded-full w-11 h-11 relative ${
                  isActive
                    ? "bg-card hover:bg-card/90"
                    : "hover:bg-accent-foreground/10"
                }`}
              >
                <tab.icon 
                  className={`w-5 h-5 ${
                    isActive ? "text-foreground" : "text-accent-foreground/60"
                  }`} 
                />
                {isActive && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
                )}
              </Button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
