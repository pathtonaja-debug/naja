import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 backdrop-blur-xl",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary/60 text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary/50 text-secondary-foreground hover:bg-secondary/70",
        destructive: "border-transparent bg-destructive/60 text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground border-white/20 bg-white/15 backdrop-blur-xl",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
