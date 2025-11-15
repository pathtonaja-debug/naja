import { CalendarCategory, CATEGORY_LABELS } from "@/types/calendar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CategoryChipProps {
  category: CalendarCategory;
  size?: "sm" | "md";
  className?: string;
}

const CATEGORY_STYLES: Record<CalendarCategory, string> = {
  faith: "bg-primary/30 text-primary-foreground border-primary/20",
  work: "bg-sky/30 text-foreground border-sky/20",
  study: "bg-secondary/30 text-secondary-foreground border-secondary/20",
  health: "bg-pink/30 text-foreground border-pink/20",
  personal: "bg-muted/50 text-muted-foreground border-muted/30",
  other: "bg-foreground/10 text-foreground border-border",
};

export const CategoryChip = ({ category, size = "sm", className }: CategoryChipProps) => {
  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-pill backdrop-blur-xl border font-semibold",
        size === "sm" ? "text-[11px] px-2 py-0.5" : "text-[13px] px-3 py-1",
        CATEGORY_STYLES[category],
        className
      )}
    >
      {CATEGORY_LABELS[category]}
    </Badge>
  );
};
