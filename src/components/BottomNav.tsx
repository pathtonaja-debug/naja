import { useNavigate, useLocation } from "react-router-dom";
import { useMemo, useRef, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { NAV_ITEMS, PLUS_MENU_ITEMS, PLUS_MENU_CATEGORIES, isPathActive, getRecentItems, recordRecentItem } from "@/lib/navigation";
import { PlusPopover, type PlusMenuItem as UiPlusMenuItem, type PlusMenuCategory } from "@/components/ui/plus-popover";

const BottomNav = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const [plusOpen, setPlusOpen] = useState(false);
  const plusBtnRef = useRef<HTMLButtonElement>(null);

  // Listen for tour events to open/close plus menu
  const handleTourPlus = useCallback((e: Event) => {
    const detail = (e as CustomEvent).detail;
    if (detail?.open) {
      setPlusOpen(true);
    } else {
      setPlusOpen(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('naja-tour-plus', handleTourPlus);
    return () => window.removeEventListener('naja-tour-plus', handleTourPlus);
  }, [handleTourPlus]);

  const leftTabs = NAV_ITEMS.slice(0, 2);
  const rightTabs = NAV_ITEMS.slice(2, 4);

  const recentIds = useMemo(() => (plusOpen ? getRecentItems() : []), [plusOpen]);

  const plusItems: UiPlusMenuItem[] = useMemo(
    () =>
      PLUS_MENU_ITEMS.map((item) => ({
        id: item.id,
        label: t(item.labelKey),
        icon: item.icon,
        category: item.category,
        onSelect: () => {
          recordRecentItem(item.id);
          navigate(item.path);
        },
      })),
    [navigate, t]
  );

  const categoryLabels: PlusMenuCategory[] = useMemo(
    () => PLUS_MENU_CATEGORIES.map((c) => ({ key: c.key, label: t(c.labelKey) })),
    [t]
  );

  const NavButton = ({ item }: { item: typeof NAV_ITEMS[0] }) => {
    const Icon = item.icon;
    const active = isPathActive(location.pathname, item.path);

    return (
      <button
        onClick={() => navigate(item.path)}
        className={cn(
          "relative flex items-center justify-center",
          "h-10 px-3 rounded-full",
          "transition-colors"
        )}
        aria-current={active ? "page" : undefined}
      >
        {/* active bubble only */}
        {active && (
          <motion.div
            layoutId="nav-active-bubble"
            className="absolute inset-0 rounded-full bg-primary/15"
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
          />
        )}

        <span className="relative z-10 flex items-center gap-1.5">
          <Icon className={cn("h-5 w-5", active ? "text-primary" : "text-muted-foreground")} />
          {active && (
            <span className="overflow-hidden whitespace-nowrap text-xs font-medium text-primary">
              {t(item.labelKey)}
            </span>
          )}
        </span>
      </button>
    );
  };

  return (
    <>
      <nav className="pointer-events-none fixed inset-x-0 bottom-0 z-50">
        <div className="relative flex items-end justify-center px-4 pb-[max(calc(env(safe-area-inset-bottom,_0px)_+_16px),_24px)]">
          <div className="relative">
            {/* Dock glow */}
            <div
              className="pointer-events-none absolute -inset-4 rounded-[40px] opacity-60"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 100%, hsl(var(--primary) / 0.25) 0%, transparent 70%)",
              }}
            />

            {/* Floating dock container */}
            <div className="pointer-events-auto relative overflow-visible rounded-[28px] border border-white/10 bg-card/85 shadow-[0_12px_40px_-10px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
              {/* Extra soft shine */}
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-px"
                style={{
                  background:
                    "linear-gradient(90deg, transparent 5%, rgba(255,255,255,0.18) 50%, transparent 95%)",
                }}
              />

              <div className="flex items-center gap-1 px-2 py-2">
                {/* Left pill */}
                <div className="flex items-center gap-0.5">
                  {leftTabs.map((tab) => (
                    <NavButton key={tab.id} item={tab} />
                  ))}
                </div>

                {/* Center + button (wrap-around visual) */}
                <div className="relative mx-1 flex items-center justify-center">
                  <button
                    ref={plusBtnRef}
                    onClick={() => setPlusOpen((v) => !v)}
                    className={cn(
                      "relative z-10",
                      "h-12 w-12 rounded-full",
                      "flex items-center justify-center",
                      "bg-gradient-to-br from-primary to-primary/80",
                      "text-primary-foreground",
                      "shadow-[0_14px_30px_rgba(0,0,0,0.18)]",
                      "ring-1 ring-white/30",
                      "transition-transform active:scale-95"
                    )}
                    aria-label="Open plus menu"
                    aria-expanded={plusOpen}
                  >
                    <Plus className="h-6 w-6" />
                  </button>

                  {/* subtle halo around + */}
                  <div className="pointer-events-none absolute inset-0 -m-1 rounded-full bg-primary/10 blur-md" />
                </div>

                {/* Right pill */}
                <div className="flex items-center gap-0.5">
                  {rightTabs.map((tab) => (
                    <NavButton key={tab.id} item={tab} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Floating + popover (glass + liquid) */}
      <PlusPopover
        open={plusOpen}
        onOpenChange={setPlusOpen}
        anchorRef={plusBtnRef}
        title={t("plusMenu.title")}
        items={plusItems}
        categories={categoryLabels}
        recentIds={recentIds}
      />
    </>
  );
};

export default BottomNav;
