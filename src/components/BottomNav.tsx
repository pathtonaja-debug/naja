import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Home, Target, TrendingUp, UserCircle, Calendar, BookOpen, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { motion } from "framer-motion";
import desertDunes from "@/assets/illustrations/desert-dunes.png";

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const mainTabs = [
    { icon: Home, path: "/dashboard", label: "Home" },
    { icon: Calendar, path: "/calendar", label: "Calendar" },
  ];

  const secondaryTabs = [
    { icon: TrendingUp, path: "/progress", label: "Progress" },
    { icon: UserCircle, path: "/profile", label: "Profile" },
  ];

  const menuItems = [
    { icon: BookOpen, path: "/journal", label: "Journal" },
    { icon: Target, path: "/habits", label: "Habits" },
  ];

  const handleMenuItemClick = (path: string) => {
    navigate(path);
    setMenuOpen(false);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      {/* Desert dunes background */}
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none overflow-hidden">
        <motion.img 
          src={desertDunes} 
          alt="" 
          className="w-full h-full object-cover object-top opacity-90"
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
        />
        {/* Gradient fade at top */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/60 to-transparent" />
      </div>

      {/* Navigation bar */}
      <div className="relative px-4 pb-6 pt-2">
        <div className="glass-card px-4 py-2.5 flex items-center justify-around max-w-md mx-auto shadow-elevation-2">
          {/* Left tabs */}
          {mainTabs.map((tab) => {
            const isActive = location.pathname === tab.path;
            return (
              <button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                className="relative flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-all"
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-primary/15 rounded-xl"
                    transition={{ type: "spring", duration: 0.5 }}
                  />
                )}
                <tab.icon 
                  className={cn(
                    "w-5 h-5 relative z-10 transition-colors",
                    isActive ? "text-primary" : "text-foreground-muted"
                  )} 
                />
                <span 
                  className={cn(
                    "text-[9px] font-medium relative z-10 transition-colors",
                    isActive ? "text-primary" : "text-foreground-muted"
                  )}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}

          {/* Center menu button */}
          <Popover open={menuOpen} onOpenChange={setMenuOpen}>
            <PopoverTrigger asChild>
              <Button
                size="icon"
                className={cn(
                  "w-12 h-12 rounded-full transition-all",
                  "bg-gradient-to-br from-primary to-secondary text-primary-foreground",
                  "shadow-lg hover:shadow-xl hover:scale-105"
                )}
                aria-label="More"
              >
                <Menu className="w-5 h-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-48 p-2 mb-2 glass-card"
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
                        "w-full justify-start gap-3 h-10 rounded-lg transition-all",
                        isActive
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-foreground-muted hover:text-foreground hover:bg-muted/50"
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
          {secondaryTabs.map((tab) => {
            const isActive = location.pathname === tab.path;
            return (
              <button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                className="relative flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-all"
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-primary/15 rounded-xl"
                    transition={{ type: "spring", duration: 0.5 }}
                  />
                )}
                <tab.icon 
                  className={cn(
                    "w-5 h-5 relative z-10 transition-colors",
                    isActive ? "text-primary" : "text-foreground-muted"
                  )} 
                />
                <span 
                  className={cn(
                    "text-[9px] font-medium relative z-10 transition-colors",
                    isActive ? "text-primary" : "text-foreground-muted"
                  )}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
