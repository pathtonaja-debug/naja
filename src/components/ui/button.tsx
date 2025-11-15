import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-[15px] leading-[22px] font-semibold ring-offset-background transition-all duration-[220ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40 active:scale-[0.96] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-white/50 backdrop-blur-md text-foreground hover:bg-white/70 border border-white/30 rounded-pill shadow-[0_4px_16px_rgba(28,28,30,0.06)] dark:bg-white/10 dark:hover:bg-white/20 dark:border-white/20",
        destructive: "bg-destructive/90 backdrop-blur-md text-destructive-foreground hover:bg-destructive border border-white/30 rounded-pill shadow-[0_4px_16px_rgba(28,28,30,0.06)]",
        outline: "border border-white/30 bg-transparent backdrop-blur-md hover:bg-white/30 rounded-pill dark:border-white/20 dark:hover:bg-white/10",
        secondary: "bg-secondary/80 backdrop-blur-md text-secondary-foreground hover:bg-secondary/90 border border-white/30 rounded-pill shadow-[0_4px_16px_rgba(28,28,30,0.06)]",
        ghost: "hover:bg-white/30 backdrop-blur-md rounded-pill dark:hover:bg-white/10",
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
