import { CalendarCategory, CATEGORY_LABELS } from "@/types/calendar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CategoryChipProps {
  category: CalendarCategory;
  size?: "sm" | "md";
  className?: string;
}

// Semantic styles for categories (no pink)
const CATEGORY_STYLES: Record<CalendarCategory, string> = {
  faith: "bg-semantic-lavender-soft text-foreground border-[hsl(var(--color-lavender-dark)/0.25)]",
  work: "bg-semantic-blue-soft text-foreground border-[hsl(var(--color-blue-dark)/0.25)]",
  study: "bg-semantic-yellow-soft text-foreground border-[hsl(var(--color-yellow-dark)/0.25)]",
  health: "bg-semantic-green-soft text-foreground border-[hsl(var(--color-green-dark)/0.25)]",
  personal: "bg-semantic-teal-soft text-foreground border-[hsl(var(--color-teal-dark)/0.25)]",
  other: "bg-muted text-foreground border-border",
};

export const CategoryChip = ({ category, size = "sm", className }: CategoryChipProps) => {
  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-full backdrop-blur-2xl border font-semibold",
        size === "sm" ? "text-[11px] px-2 py-0.5" : "text-[13px] px-3 py-1",
        CATEGORY_STYLES[category],
        className
      )}
    >
      {CATEGORY_LABELS[category]}
    </Badge>
  );
};
