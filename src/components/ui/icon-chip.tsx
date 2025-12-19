import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

type IconChipColor = 'mint' | 'sky' | 'lavender' | 'rose' | 'peach' | 'butter' | 'sage' | 'gold';

interface IconChipProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  icon: React.ReactNode;
  label?: string;
  color?: IconChipColor;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
}

const colorStyles: Record<IconChipColor, { bg: string; text: string }> = {
  mint: { bg: 'bg-pastel-mint', text: 'text-[hsl(160,40%,35%)]' },
  sky: { bg: 'bg-pastel-sky', text: 'text-[hsl(200,55%,35%)]' },
  lavender: { bg: 'bg-pastel-lavender', text: 'text-[hsl(260,45%,40%)]' },
  rose: { bg: 'bg-pastel-rose', text: 'text-[hsl(350,50%,40%)]' },
  peach: { bg: 'bg-pastel-peach', text: 'text-[hsl(25,60%,35%)]' },
  butter: { bg: 'bg-pastel-butter', text: 'text-[hsl(45,65%,35%)]' },
  sage: { bg: 'bg-pastel-sage', text: 'text-[hsl(145,35%,30%)]' },
  gold: { bg: 'bg-gold-soft', text: 'text-[hsl(40,65%,35%)]' },
};

const sizeStyles = {
  sm: 'w-8 h-8 rounded-lg',
  md: 'w-10 h-10 rounded-xl',
  lg: 'w-12 h-12 rounded-2xl',
};

const iconSizeStyles = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

export const IconChip = React.forwardRef<HTMLDivElement, IconChipProps>(
  ({ icon, label, color = 'mint', size = 'md', interactive = false, className, ...props }, ref) => {
    const { bg, text } = colorStyles[color];

    return (
      <motion.div
        ref={ref}
        whileTap={interactive ? { scale: 0.95 } : undefined}
        className={cn(
          'flex items-center gap-2',
          interactive && 'cursor-pointer',
          className
        )}
        {...props}
      >
        <div className={cn(
          'flex items-center justify-center',
          sizeStyles[size],
          bg,
          text
        )}>
          {React.isValidElement(icon) 
            ? React.cloneElement(icon as React.ReactElement<{ className?: string }>, {
                className: cn(iconSizeStyles[size], (icon as React.ReactElement<{ className?: string }>).props.className)
              })
            : icon
          }
        </div>
        {label && (
          <span className={cn('text-footnote font-medium', text)}>{label}</span>
        )}
      </motion.div>
    );
  }
);

IconChip.displayName = 'IconChip';
