import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-[15px] leading-[22px] font-semibold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40 active:scale-[0.97] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-card text-foreground rounded-xl border border-border shadow-sm hover:bg-muted/50",
        primary: "bg-primary text-primary-foreground rounded-xl shadow-[0_4px_14px_hsl(var(--primary)/0.3)] hover:shadow-[0_6px_20px_hsl(var(--primary)/0.4)]",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl shadow-sm",
        outline: "border border-border bg-transparent rounded-xl hover:bg-muted/50",
        secondary: "bg-secondary text-secondary-foreground rounded-xl shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-muted/50 rounded-xl",
        link: "text-primary underline-offset-4 hover:underline",
        accent: "bg-accent text-accent-foreground rounded-xl shadow-[0_4px_14px_hsl(var(--accent)/0.3)] hover:shadow-[0_6px_20px_hsl(var(--accent)/0.4)]",
        dark: "bg-[hsl(0_0%_10%)] text-white rounded-xl shadow-[0_4px_14px_rgba(0,0,0,0.25)] hover:bg-[hsl(0_0%_15%)]",
      },
      size: {
        default: "h-11 px-6 py-2 min-w-[44px]",
        sm: "h-9 px-4 min-w-[44px]",
        lg: "h-14 px-8 min-w-[44px] text-[17px]",
        icon: "h-11 w-11 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
