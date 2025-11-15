import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.96]",
  {
    variants: {
      variant: {
        // Black pill - primary action button
        pill: "bg-blackPill text-white rounded-[22px] shadow-soft hover:bg-blackPill/90 text-[18px] leading-[24px]",
        
        // Pastel chips
        pink: "bg-pink text-ink900 rounded-chip hover:bg-pink/80",
        lilac: "bg-lilac text-ink900 rounded-chip hover:bg-lilac/80",
        olive: "bg-olive text-ink900 rounded-chip hover:bg-olive/80",
        butter: "bg-butter text-ink900 rounded-chip hover:bg-butter/80",
        sky: "bg-sky text-ink900 rounded-chip hover:bg-sky/80",
        
        // Ghost/minimal
        ghost: "hover:bg-stroke/30 rounded-chip text-ink700",
        
        // Outline
        outline: "border border-stroke bg-transparent hover:bg-stroke/20 rounded-chip text-ink700",
      },
      size: {
        default: "h-11 px-6 py-2.5 min-w-[44px]",
        sm: "h-9 px-4 py-2 min-w-[44px] text-[15px]",
        lg: "h-12 px-8 py-3 min-w-[44px] text-[18px]",
        icon: "h-11 w-11 rounded-full",
      },
    },
    defaultVariants: {
      variant: "pill",
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
