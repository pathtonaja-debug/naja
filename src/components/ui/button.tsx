import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-[15px] leading-[22px] font-semibold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40 active:scale-[0.96] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "liquid-glass rounded-pill shadow-elevation-2",
        primary: "bg-gradient-primary text-primary-foreground rounded-pill shadow-elevation-3 hover:shadow-elevation-2 border-0",
        destructive: "bg-destructive/60 backdrop-blur-2xl text-destructive-foreground hover:bg-destructive/80 border border-white/20 rounded-pill shadow-elevation-2",
        outline: "border border-border liquid-glass rounded-pill hover:bg-white/30 dark:hover:bg-white/20",
        secondary: "bg-secondary/50 backdrop-blur-2xl text-secondary-foreground hover:bg-secondary/70 border border-white/20 rounded-pill shadow-elevation-2",
        ghost: "hover:bg-white/20 backdrop-blur-2xl rounded-pill dark:hover:bg-white/15",
        link: "text-foreground underline-offset-4 hover:underline",
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
