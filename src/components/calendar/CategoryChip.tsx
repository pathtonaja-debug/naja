import { CalendarCategory, CATEGORY_LABELS } from "@/types/calendar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CategoryChipProps {
  category: CalendarCategory;
  size?: "sm" | "md";
  className?: string;
}

const CATEGORY_STYLES: Record<CalendarCategory, string> = {
  faith: "bg-lilac/30 text-foreground border-lilac/25",
  work: "bg-sky/30 text-foreground border-sky/25",
  study: "bg-butter/30 text-foreground border-butter/25",
  health: "bg-pink/30 text-foreground border-pink/25",
  personal: "bg-olive/30 text-foreground border-olive/25",
  other: "bg-foreground/15 text-foreground border-foreground/20",
};

export const CategoryChip = ({ category, size = "sm", className }: CategoryChipProps) => {
  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-pill backdrop-blur-2xl border font-semibold",
        size === "sm" ? "text-[11px] px-2 py-0.5" : "text-[13px] px-3 py-1",
        CATEGORY_STYLES[category],
        className
      )}
    >
      {CATEGORY_LABELS[category]}
    </Badge>
  );
};
