import * as React from "react";
import { ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface CollapsibleSectionProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  defaultOpen?: boolean;
  collapsible?: boolean;
  viewAllRoute?: string;
  viewAllLabel?: string;
  children: React.ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  summary?: React.ReactNode;
}

export function CollapsibleSection({
  title,
  subtitle,
  icon,
  defaultOpen = false,
  collapsible = true,
  viewAllRoute,
  viewAllLabel = "See all",
  children,
  className,
  headerClassName,
  contentClassName,
  summary,
}: CollapsibleSectionProps) {
  const [open, setOpen] = React.useState(defaultOpen);
  const navigate = useNavigate();

  const handleViewAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewAllRoute) {
      navigate(viewAllRoute);
    }
  };

  const header = (
    <div
      className={cn(
        "flex items-center justify-between gap-3 py-2",
        headerClassName
      )}
    >
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {icon && <div className="shrink-0">{icon}</div>}
        <div className="flex-1 min-w-0">
          <h3 className="text-[17px] font-semibold text-foreground leading-tight">
            {title}
          </h3>
          {subtitle && (
            <p className="text-[13px] text-foreground-muted leading-tight mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {summary && !open && (
          <div className="text-[13px] text-foreground-muted">{summary}</div>
        )}
        {viewAllRoute && (
          <button
            onClick={handleViewAll}
            className="text-[13px] font-medium text-primary hover:text-primary/80 transition-colors px-2 py-1"
            aria-label={viewAllLabel}
          >
            {viewAllLabel}
          </button>
        )}
        {collapsible && (
          <motion.div
            animate={{ rotate: open ? 90 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-foreground-muted"
          >
            <ChevronRight className="w-4 h-4" />
          </motion.div>
        )}
      </div>
    </div>
  );

  if (!collapsible) {
    return (
      <section className={cn("space-y-3", className)}>
        {header}
        <div className={contentClassName}>{children}</div>
      </section>
    );
  }

  return (
    <Collapsible open={open} onOpenChange={setOpen} className={className}>
      <CollapsibleTrigger
        className="w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg"
        aria-expanded={open}
      >
        {header}
      </CollapsibleTrigger>
      
      <CollapsibleContent>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className={cn("overflow-hidden pt-2", contentClassName)}
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </CollapsibleContent>
    </Collapsible>
  );
}
