import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const iconBadgeVariants = cva(
  "inline-flex items-center justify-center rounded-full shrink-0",
  {
    variants: {
      variant: {
        pink: "bg-pink",
        lilac: "bg-lilac",
        olive: "bg-olive",
        butter: "bg-butter",
        sky: "bg-sky",
      },
      size: {
        sm: "w-8 h-8",
        md: "w-10 h-10",
        lg: "w-12 h-12",
      },
    },
    defaultVariants: {
      variant: "pink",
      size: "md",
    },
  },
);

export interface IconBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof iconBadgeVariants> {}

const IconBadge = React.forwardRef<HTMLDivElement, IconBadgeProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(iconBadgeVariants({ variant, size, className }))}
        {...props}
      />
    );
  },
);
IconBadge.displayName = "IconBadge";

export { IconBadge, iconBadgeVariants };
