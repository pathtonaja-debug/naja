import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const chipVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-chip px-4 py-2 text-[15px] font-medium transition-all duration-300 active:scale-95",
  {
    variants: {
      variant: {
        pink: "bg-pink text-ink900 hover:bg-pink/80",
        lilac: "bg-lilac text-ink900 hover:bg-lilac/80",
        olive: "bg-olive text-ink900 hover:bg-olive/80",
        butter: "bg-butter text-ink900 hover:bg-butter/80",
        sky: "bg-sky text-ink900 hover:bg-sky/80",
      },
    },
    defaultVariants: {
      variant: "pink",
    },
  },
);

export interface ChipProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof chipVariants> {
  icon?: React.ReactNode;
}

const Chip = React.forwardRef<HTMLDivElement, ChipProps>(
  ({ className, variant, icon, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(chipVariants({ variant, className }))}
        {...props}
      >
        {icon && <span className="text-[18px]">{icon}</span>}
        {children}
      </div>
    );
  },
);
Chip.displayName = "Chip";

export { Chip, chipVariants };
