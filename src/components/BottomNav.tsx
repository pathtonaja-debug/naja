import { useNavigate, useLocation } from "react-router-dom";
import { useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { NAV_ITEMS, PLUS_MENU_ITEMS, isPathActive } from "@/lib/navigation";
import { PlusPopover, type PlusMenuItem as UiPlusMenuItem } from "@/components/ui/plus-popover";

const BottomNav = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const [plusOpen, setPlusOpen] = useState(false);
  const plusBtnRef = useRef<HTMLButtonElement>(null);

  const leftTabs = NAV_ITEMS.slice(0, 2);
  const rightTabs = NAV_ITEMS.slice(2, 4);

  const plusItems: UiPlusMenuItem[] = useMemo(
    () =>
      PLUS_MENU_ITEMS.map((item) => ({
        id: item.id,
        label: t(item.labelKey),
        icon: item.icon,
        onSelect: () => navigate(item.path),
      })),
    [navigate, t]
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
        {/* active bubble */}
        {active && (
          <motion.div
            layoutId="nav-active-bubble"
            className="absolute inset-0 rounded-full bg-white/15"
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
          />
        )}

        <span className="relative z-10 flex items-center gap-1.5">
          <Icon className={cn(
            "h-5 w-5 transition-colors",
            active ? "text-white" : "text-white/50"
          )} />
          {/* Label only on active */}
          <AnimatePresence>
            {active && (
              <motion.span
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "auto", opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="overflow-hidden whitespace-nowrap text-xs font-medium text-white"
              >
                {t(item.labelKey)}
              </motion.span>
            )}
          </AnimatePresence>
        </span>
      </button>
    );
  };

  return (
    <>
      <nav className="pointer-events-none fixed inset-x-0 bottom-0 z-50">
        <div className="relative flex items-end justify-center px-4 pb-[max(calc(env(safe-area-inset-bottom,_0px)_+_12px),_20px)]">
          <div className="relative">
            {/* Floating dock container - DARK */}
            <div className="pointer-events-auto relative overflow-visible rounded-[32px] bg-[hsl(0_0%_10%)] shadow-[0_16px_50px_-12px_rgba(0,0,0,0.5)]">
              {/* Subtle top highlight */}
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-[32px]"
                style={{
                  background:
                    "linear-gradient(90deg, transparent 10%, rgba(255,255,255,0.12) 50%, transparent 90%)",
                }}
              />

              <div className="flex items-center gap-1 px-3 py-2.5">
                {/* Left tabs */}
                <div className="flex items-center gap-0.5">
                  {leftTabs.map((tab) => (
                    <NavButton key={tab.id} item={tab} />
                  ))}
                </div>

                {/* Center + button */}
                <div className="relative mx-2 flex items-center justify-center">
                  <motion.button
                    ref={plusBtnRef}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => setPlusOpen((v) => !v)}
                    className={cn(
                      "relative z-10",
                      "h-12 w-12 rounded-full",
                      "flex items-center justify-center",
                      "bg-gradient-to-br from-[hsl(152_35%_30%)] to-[hsl(152_35%_22%)]",
                      "text-white",
                      "shadow-[0_8px_24px_rgba(45,90,71,0.4)]",
                      "transition-transform hover:scale-[1.03]"
                    )}
                    aria-label="Open plus menu"
                    aria-expanded={plusOpen}
                  >
                    <Plus className="h-6 w-6" />
                  </motion.button>
                </div>

                {/* Right tabs */}
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

      {/* Floating + popover */}
      <PlusPopover
        open={plusOpen}
        onOpenChange={setPlusOpen}
        anchorRef={plusBtnRef}
        title={t("plusMenu.title")}
        items={plusItems}
      />
    </>
  );
};

export default BottomNav;
