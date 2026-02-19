"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export type PlusMenuItem = {
  id: string;
  label: string;
  icon: LucideIcon;
  onSelect: () => void;
};

type PlusPopoverProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  anchorRef: React.RefObject<HTMLButtonElement>;
  title?: string;
  items: PlusMenuItem[];
  className?: string;
};

export function PlusPopover({
  open,
  onOpenChange,
  anchorRef,
  title,
  items,
  className,
}: PlusPopoverProps) {
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
      const panel = panelRef.current;
      const anchor = anchorRef.current;

      if (!target) return;
      if (panel?.contains(target)) return;
      if (anchor?.contains(target)) return;

      onOpenChange(false);
    };

    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown);

    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
    };
  }, [open, onOpenChange, anchorRef]);

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
              <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-card/80 shadow-2xl backdrop-blur-2xl">
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

                <div className="relative p-2">
                  <div className="relative z-10 flex flex-col">
                    {items.map((item) => {
                      const Icon = item.icon;

                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            item.onSelect();
                            onOpenChange(false);
                          }}
                          className={cn(
                            "relative z-10 w-full",
                            "flex items-center gap-3",
                            "px-3 py-3",
                            "rounded-2xl",
                            "text-left",
                            "transition-colors hover:bg-primary/10"
                          )}
                        >
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                            <Icon className="h-5 w-5" />
                          </div>

                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-foreground">{item.label}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
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

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}
