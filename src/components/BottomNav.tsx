import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Home, BookOpen, Target, TrendingUp, UserCircle, Calendar, Heart, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const mainTabs = [
    { icon: Home, path: "/dashboard", label: "Dashboard" },
    { icon: Calendar, path: "/calendar", label: "Calendar" },
  ];

  const secondaryTabs = [
    { icon: TrendingUp, path: "/progress", label: "Progress" },
    { icon: UserCircle, path: "/profile", label: "Profile" },
  ];

  const menuItems = [
    { icon: BookOpen, path: "/journal", label: "Journal" },
    { icon: Target, path: "/habits", label: "Habits" },
    { icon: Heart, path: "/duas", label: "Duas" },
  ];

  const handleMenuItemClick = (path: string) => {
    navigate(path);
    setMenuOpen(false);
  };

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 px-6 w-full max-w-2xl z-50 pointer-events-none">
      <div className="liquid-glass rounded-pill px-4 py-2.5 pointer-events-auto">
        <div className="flex justify-between items-center gap-2">
          {/* Left tabs */}
          <div className="flex items-center gap-1">
            {mainTabs.map((tab) => {
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

          {/* Center menu button */}
          <Popover open={menuOpen} onOpenChange={setMenuOpen}>
            <PopoverTrigger asChild>
              <Button
                size="icon"
                className={cn(
                  "w-12 h-12 rounded-full transition-all relative",
                  "duration-[var(--duration-medium)] ease-[var(--easing-smooth)]",
                  "bg-gradient-to-br from-primary to-primary/80",
                  "text-primary-foreground shadow-lg hover:shadow-xl",
                  "hover:scale-110 glow-ring"
                )}
                aria-label="More"
              >
                <Menu className="w-5 h-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-48 p-2 mb-2 animate-scale-in"
              align="center"
              side="top"
              sideOffset={8}
            >
              <div className="flex flex-col gap-1">
                {menuItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Button
                      key={item.path}
                      variant="ghost"
                      onClick={() => handleMenuItemClick(item.path)}
                      className={cn(
                        "w-full justify-start gap-3 h-10 transition-all",
                        isActive
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-foreground/70 hover:text-foreground hover:bg-muted/50"
                      )}
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Button>
                  );
                })}
              </div>
            </PopoverContent>
          </Popover>

          {/* Right tabs */}
          <div className="flex items-center gap-1">
            {secondaryTabs.map((tab) => {
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
      </div>
    </nav>
  );
};

export default BottomNav;
