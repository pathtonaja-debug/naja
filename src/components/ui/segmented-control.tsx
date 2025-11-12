import * as React from "react";
import { cn } from "@/lib/utils";

interface SegmentedControlProps {
  value: string;
  onValueChange: (value: string) => void;
  options: { label: string; value: string }[];
  className?: string;
}

const SegmentedControl = React.forwardRef<HTMLDivElement, SegmentedControlProps>(
  ({ value, onValueChange, options, className }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex p-1 rounded-pill bg-muted/40 gap-1",
          className
        )}
      >
        {options.map((option) => (
    <button
      key={option.value}
      onClick={() => onValueChange(option.value)}
      className={cn(
        "px-4 py-2 rounded-pill text-[15px] leading-[22px] font-medium",
        "transition-all duration-nja ease-nja",
        "min-w-[44px] min-h-[44px] flex items-center justify-center",
        value === option.value
          ? "bg-surface shadow-soft text-ink"
          : "text-inkMuted hover:text-ink"
      )}
    >
      {option.label}
    </button>
        ))}
      </div>
    );
  }
);
SegmentedControl.displayName = "SegmentedControl";

export { SegmentedControl };
