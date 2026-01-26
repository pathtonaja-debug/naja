import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface StatCardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  color?: 'blue' | 'green' | 'yellow' | 'teal' | 'lavender' | 'muted';
}

const colorMap = {
  blue: 'bg-semantic-blue-soft',
  green: 'bg-semantic-green-soft',
  yellow: 'bg-semantic-yellow-soft',
  teal: 'bg-semantic-teal-soft',
  lavender: 'bg-semantic-lavender-soft',
  muted: 'bg-muted',
};

export const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  ({ icon, value, label, color = 'blue', className, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        whileTap={{ scale: 0.97 }}
        className={cn(
          'ios-card-interactive p-4 flex flex-col items-center gap-2',
          className
        )}
        {...props}
      >
        <div className={cn(
          'w-10 h-10 rounded-xl flex items-center justify-center',
          colorMap[color]
        )}>
          {icon}
        </div>
        <div className="text-center">
          <p className="text-title-3 text-foreground">{value}</p>
          <p className="text-caption-1 text-muted-foreground">{label}</p>
        </div>
      </motion.div>
    );
  }
);

StatCard.displayName = 'StatCard';
