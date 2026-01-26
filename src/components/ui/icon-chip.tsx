import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

type IconChipColor = 'blue' | 'green' | 'yellow' | 'teal' | 'lavender' | 'muted';

interface IconChipProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  icon: React.ReactNode;
  label?: string;
  color?: IconChipColor;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
}

const colorStyles: Record<IconChipColor, { bg: string; text: string }> = {
  blue: { bg: 'bg-semantic-blue-soft', text: 'text-semantic-blue-dark' },
  green: { bg: 'bg-semantic-green-soft', text: 'text-semantic-green-dark' },
  yellow: { bg: 'bg-semantic-yellow-soft', text: 'text-semantic-yellow-dark' },
  teal: { bg: 'bg-semantic-teal-soft', text: 'text-semantic-teal-dark' },
  lavender: { bg: 'bg-semantic-lavender-soft', text: 'text-semantic-lavender-dark' },
  muted: { bg: 'bg-muted', text: 'text-muted-foreground' },
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
  ({ icon, label, color = 'blue', size = 'md', interactive = false, className, ...props }, ref) => {
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
