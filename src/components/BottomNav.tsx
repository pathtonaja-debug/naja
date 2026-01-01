import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { NAV_ITEMS, QUICK_ACTIONS, isPathActive } from "@/lib/navigation";

const BottomNav = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [quickActionOpen, setQuickActionOpen] = useState(false);

  // left/right wings around the center +
  const leftTabs = NAV_ITEMS.slice(0, 2);
  const rightTabs = NAV_ITEMS.slice(2, 4);

  const handleQuickAction = (action: typeof QUICK_ACTIONS[0]) => {
    setQuickActionOpen(false);
    navigate(action.hash ? action.path + action.hash : action.path);
  };

  const NavButton = ({ item }: { item: typeof NAV_ITEMS[0] }) => {
    const Icon = item.icon;
    const isActive = isPathActive(location.pathname, item.path);

    return (
      <button
        onClick={() => navigate(item.path)}
        className={cn(
          "relative flex items-center justify-center rounded-xl transition-all",
          "h-10 px-3",
          isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
        )}
      >
        {/* Active pill highlight */}
        {isActive && (
          <motion.div
            layoutId="activePill"
            className="absolute inset-0 bg-primary/10 rounded-xl"
            transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
          />
        )}

        <span className="relative z-10 flex items-center gap-1.5">
          <Icon className="w-5 h-5" />
          {/* Minimal: label ONLY on active */}
          {isActive && (
            <motion.span
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "auto", opacity: 1 }}
              className="text-xs font-medium overflow-hidden whitespace-nowrap"
            >
              {t(item.labelKey)}
            </motion.span>
          )}
        </span>
      </button>
    );
  };

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 pb-safe pointer-events-none">
        <div className="relative flex items-end justify-center px-4 pb-4">

          {/* subtle dock glow */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-48 h-12 rounded-full bg-primary/20 blur-2xl pointer-events-none" />

          <div className="relative flex items-center gap-2 pointer-events-auto">

            {/* LEFT wing */}
            <div className="flex items-center gap-1 bg-card/90 backdrop-blur-xl border border-border/50 rounded-2xl px-2 py-2 shadow-lg shadow-black/10">
              {leftTabs.map((tab) => (
                <NavButton key={tab.id} item={tab} />
              ))}
            </div>

            {/* CENTER + button (floating higher) */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setQuickActionOpen(true)}
              className={cn(
                "relative -mt-4",
                "w-12 h-12 rounded-full flex items-center justify-center",
                "bg-gradient-to-br from-primary to-primary/80",
                "text-primary-foreground",
                "shadow-[0_16px_40px_-14px_rgba(0,0,0,0.6)]",
                "ring-1 ring-white/15"
              )}
              aria-label="Quick Actions"
            >
              {/* inner glow */}
              <span className="absolute inset-1 rounded-full bg-white/10 pointer-events-none" />
              <Plus className="w-6 h-6 relative z-10" />
            </motion.button>

            {/* RIGHT wing */}
            <div className="flex items-center gap-1 bg-card/90 backdrop-blur-xl border border-border/50 rounded-2xl px-2 py-2 shadow-lg shadow-black/10">
              {rightTabs.map((tab) => (
                <NavButton key={tab.id} item={tab} />
              ))}
            </div>

          </div>
        </div>
      </nav>

      {/* Quick Action Sheet */}
      <Sheet open={quickActionOpen} onOpenChange={setQuickActionOpen}>
        <SheetContent side="bottom" className="rounded-t-3xl pb-safe">
          <SheetHeader className="mb-4">
            <SheetTitle className="text-lg">{t("quickActions.title")}</SheetTitle>
          </SheetHeader>

          <div className="grid grid-cols-2 gap-3 pb-4">
            {QUICK_ACTIONS.map((action, index) => (
              <motion.button
                key={action.id}
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
                <span className="text-sm font-medium text-foreground">{t(action.labelKey)}</span>
              </motion.button>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default BottomNav;
