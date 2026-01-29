import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "text-foreground border-border bg-transparent",
        gradient: "border-transparent bg-gradient-chromatic text-white",
        coral: "border-transparent bg-semantic-coral-soft text-semantic-coral-dark",
        violet: "border-transparent bg-semantic-violet-soft text-semantic-violet-dark",
        blue: "border-transparent bg-semantic-blue-soft text-semantic-blue-dark",
        gold: "border-transparent bg-semantic-gold-soft text-semantic-gold-dark",
        green: "border-transparent bg-semantic-green-soft text-semantic-green-dark",
        teal: "border-transparent bg-semantic-teal-soft text-semantic-teal-dark",
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
