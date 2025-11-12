import * as React from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ListCellProps {
  title: string;
  subtitle?: string;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
  showChevron?: boolean;
  onPress?: () => void;
  className?: string;
}

const ListCell = React.forwardRef<HTMLDivElement, ListCellProps>(
  (
    {
      className,
      title,
      subtitle,
      leftElement,
      rightElement,
      showChevron = true,
      onPress,
    },
    ref
  ) => {
    const baseClasses = cn(
      "flex items-center gap-3 px-4 py-3 min-h-[44px] w-full text-left",
      "border-b border-border last:border-b-0",
      className
    );

    const content = (
      <>
        {/* Left */}
        {leftElement && <div className="flex-shrink-0">{leftElement}</div>}

        {/* Content */}
        <div className="flex-1 min-w-0 text-left">
          <div className="text-[15px] leading-[22px] font-medium text-foreground">
            {title}
          </div>
          {subtitle && (
            <div className="text-[12px] leading-[18px] text-foreground-muted mt-0.5">
              {subtitle}
            </div>
          )}
        </div>

        {/* Right */}
        {rightElement && <div className="flex-shrink-0">{rightElement}</div>}
        {showChevron && onPress && (
          <ChevronRight className="w-5 h-5 text-foreground-muted flex-shrink-0" />
        )}
      </>
    );

    if (onPress) {
      return (
        <button
          type="button"
          onClick={onPress}
          className={cn(
            baseClasses,
            "cursor-pointer transition-all duration-fast ease-ios active:scale-[0.98] hover:bg-muted/30"
          )}
        >
          {content}
        </button>
      );
    }

    return (
      <div ref={ref} className={baseClasses}>
        {content}
      </div>
    );
  }
);
ListCell.displayName = "ListCell";

export { ListCell };
