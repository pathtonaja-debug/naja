"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { Clock, Search } from "lucide-react";
import { useTranslation } from "react-i18next";

export type PlusMenuItem = {
  id: string;
  label: string;
  icon: LucideIcon;
  onSelect: () => void;
  category?: string;
};

export type PlusMenuCategory = {
  key: string;
  label: string;
};

type PlusPopoverProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  anchorRef: React.RefObject<HTMLButtonElement>;
  title?: string;
  items: PlusMenuItem[];
  categories?: PlusMenuCategory[];
  recentIds?: string[];
  className?: string;
};

export function PlusPopover({
  open,
  onOpenChange,
  anchorRef,
  title,
  items,
  categories,
  recentIds,
  className,
}: PlusPopoverProps) {
  const { t } = useTranslation();
  const [search, setSearch] = React.useState("");
  const panelWidth = 320;
  const [pos, setPos] = React.useState<{ left: number; bottom: number; caretLeft: number }>({
    left: 16,
    bottom: 96,
    caretLeft: 160,
  });

  const panelRef = React.useRef<HTMLDivElement>(null);

  const updatePosition = React.useCallback(() => {
    const el = anchorRef.current;
    if (!el) return;

    const r = el.getBoundingClientRect();
    const vw = window.innerWidth;

    const anchorCenter = r.left + r.width / 2;

    const left = clamp(anchorCenter - panelWidth / 2, 16, vw - 16 - panelWidth);
    const caretLeft = anchorCenter - left;
    const bottom = clamp(window.innerHeight - r.top + 14, 96, 220);

    setPos({ left, bottom, caretLeft });
  }, [anchorRef]);

  React.useEffect(() => {
    if (!open) return;
    updatePosition();
    const onResize = () => updatePosition();
    const onScroll = () => updatePosition();
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, true);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, [open, updatePosition]);

  // click outside
  React.useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node | null;
      if (!target) return;
      if (panelRef.current?.contains(target)) return;
      if (anchorRef.current?.contains(target)) return;
      onOpenChange(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
    };
  }, [open, onOpenChange, anchorRef]);

  // Filter items by search
  const filteredItems = React.useMemo(() => {
    if (!search.trim()) return items;
    const q = search.toLowerCase();
    return items.filter(item => item.label.toLowerCase().includes(q));
  }, [items, search]);

  // Build recent items + categorized sections
  const recentItems = React.useMemo(() => {
    if (search.trim() || !recentIds || recentIds.length === 0) return [];
    return recentIds
      .map((id) => filteredItems.find((item) => item.id === id))
      .filter(Boolean) as PlusMenuItem[];
  }, [recentIds, filteredItems, search]);

  const groupedItems = React.useMemo(() => {
    if (!categories || categories.length === 0) {
      return [{ label: undefined, items: filteredItems }];
    }
    return categories.map((cat) => ({
      label: cat.label,
      items: filteredItems.filter((item) => item.category === cat.key),
    })).filter(g => g.items.length > 0);
  }, [categories, filteredItems]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[100]"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

          {/* Panel */}
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, y: 10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className={cn("fixed", className)}
            style={{
              width: panelWidth,
              left: pos.left,
              bottom: pos.bottom,
            }}
          >
            <div className="relative">
              {/* Subtle glow */}
              <div
                className="pointer-events-none absolute -inset-3 rounded-[32px] opacity-50"
                style={{
                  background:
                    "radial-gradient(ellipse at 50% 100%, hsl(var(--primary) / 0.25) 0%, transparent 70%)",
                }}
              />

              {/* Glass panel */}
              <div data-tour="plus-panel" className="relative overflow-hidden rounded-3xl border border-white/15 bg-card/80 shadow-2xl backdrop-blur-2xl">
                {/* Soft top shine */}
                <div
                  className="pointer-events-none absolute inset-x-0 top-0 h-px"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent 10%, rgba(255,255,255,0.18) 50%, transparent 90%)",
                  }}
                />

                {/* Title */}
                {title ? (
                  <div className="border-b border-border/40 px-4 pb-2 pt-4">
                    <h3 className="text-sm font-semibold text-foreground">{title}</h3>
                  </div>
                ) : (
                  <div className="pt-2" />
                )}

                {/* Search */}
                <div className="px-3 pt-2">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/50">
                    <Search className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder={t('common.search') + '...'}
                      className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
                      autoFocus={false}
                    />
                  </div>
                </div>

                <div className="relative max-h-[60vh] overflow-y-auto p-2">
                  {/* Recent items */}
                  {recentItems.length > 0 && (
                    <div className="mb-1">
                      <div className="flex items-center gap-1.5 px-3 pb-1 pt-2">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                          Recent
                        </span>
                      </div>
                      <div className="flex flex-col">
                        {recentItems.map((item) => (
                          <MenuItemButton key={`recent-${item.id}`} item={item} onOpenChange={onOpenChange} compact />
                        ))}
                      </div>
                      <div className="mx-3 my-1 border-t border-border/30" />
                    </div>
                  )}

                  {/* Categorized items */}
                  {groupedItems.map((group, gi) => (
                    <div key={gi}>
                      {group.label && (
                        <div className="px-3 pb-1 pt-2">
                          <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                            {group.label}
                          </span>
                        </div>
                      )}
                      <div className="flex flex-col">
                        {group.items.map((item) => (
                          <MenuItemButton key={item.id} item={item} onOpenChange={onOpenChange} />
                        ))}
                      </div>
                      {gi < groupedItems.length - 1 && (
                        <div className="mx-3 my-1 border-t border-border/30" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Caret */}
              <div
                className="pointer-events-none absolute -bottom-2"
                style={{ left: pos.caretLeft - 8 }}
              >
                <div
                  className="h-4 w-4 rotate-45 rounded-sm border-b border-r border-white/15 bg-card/80"
                  style={{ boxShadow: "2px 2px 6px rgba(0,0,0,0.12)" }}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function MenuItemButton({
  item,
  onOpenChange,
  compact,
}: {
  item: PlusMenuItem;
  onOpenChange: (open: boolean) => void;
  compact?: boolean;
}) {
  const Icon = item.icon;
  return (
    <button
      onClick={() => {
        item.onSelect();
        onOpenChange(false);
      }}
      className={cn(
        "relative z-10 w-full",
        "flex items-center gap-3",
        compact ? "px-3 py-2" : "px-3 py-2.5",
        "rounded-2xl",
        "text-left",
        "transition-colors hover:bg-primary/10"
      )}
    >
      <div className={cn(
        "flex shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary",
        compact ? "h-8 w-8" : "h-9 w-9"
      )}>
        <Icon className={compact ? "h-4 w-4" : "h-[18px] w-[18px]"} />
      </div>
      <span className={cn("font-medium text-foreground", compact ? "text-[13px]" : "text-sm")}>
        {item.label}
      </span>
    </button>
  );
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}
