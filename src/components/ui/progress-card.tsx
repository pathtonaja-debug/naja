import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ProgressCardProps {
  title: string;
  subtitle?: string;
  progress: number;
  color?: 'blue' | 'green' | 'yellow' | 'teal' | 'lavender';
  icon?: React.ReactNode;
  showPercentage?: boolean;
  className?: string;
}

const gradientMap = {
  blue: 'from-[hsl(215,50%,50%)] to-[hsl(215,45%,60%)]',
  green: 'from-[hsl(142,40%,45%)] to-[hsl(142,35%,55%)]',
  yellow: 'from-[hsl(46,70%,50%)] to-[hsl(46,65%,60%)]',
  teal: 'from-[hsl(174,42%,45%)] to-[hsl(174,38%,55%)]',
  lavender: 'from-[hsl(250,45%,55%)] to-[hsl(250,40%,65%)]',
};

const bgMap = {
  blue: 'bg-semantic-blue-soft',
  green: 'bg-semantic-green-soft',
  yellow: 'bg-semantic-yellow-soft',
  teal: 'bg-semantic-teal-soft',
  lavender: 'bg-semantic-lavender-soft',
};

export const ProgressCard: React.FC<ProgressCardProps> = ({
  title,
  subtitle,
  progress,
  color = 'blue',
  icon,
  showPercentage = true,
  className,
}) => {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      className={cn(
        'ios-card-elevated p-4 space-y-3',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {icon && (
            <div className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center',
              bgMap[color]
            )}>
              {icon}
            </div>
          )}
          <div>
            <h3 className="text-headline text-foreground">{title}</h3>
            {subtitle && (
              <p className="text-footnote text-muted-foreground">{subtitle}</p>
            )}
          </div>
        </div>
        {showPercentage && (
          <AnimatePresence mode="wait">
            <motion.span
              key={clampedProgress}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="text-headline text-foreground"
            >
              {Math.round(clampedProgress)}%
            </motion.span>
          </AnimatePresence>
        )}
      </div>

      {/* Progress Bar */}
      <div className={cn('h-2 rounded-full overflow-hidden', bgMap[color])}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${clampedProgress}%` }}
          transition={{ 
            duration: 0.6, 
            ease: [0.34, 1.56, 0.64, 1],
            delay: 0.1 
          }}
          className={cn(
            'h-full rounded-full bg-gradient-to-r',
            gradientMap[color]
          )}
        />
      </div>
    </motion.div>
  );
};
