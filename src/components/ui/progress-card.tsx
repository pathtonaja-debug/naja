import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ProgressCardProps {
  title: string;
  subtitle?: string;
  progress: number;
  color?: 'mint' | 'sky' | 'lavender' | 'rose' | 'peach' | 'butter' | 'gold';
  icon?: React.ReactNode;
  showPercentage?: boolean;
  className?: string;
}

const gradientMap = {
  mint: 'from-[hsl(160,40%,50%)] to-[hsl(145,35%,60%)]',
  sky: 'from-[hsl(200,55%,55%)] to-[hsl(220,45%,60%)]',
  lavender: 'from-[hsl(260,45%,60%)] to-[hsl(280,40%,65%)]',
  rose: 'from-[hsl(350,50%,60%)] to-[hsl(330,45%,65%)]',
  peach: 'from-[hsl(25,60%,60%)] to-[hsl(35,55%,65%)]',
  butter: 'from-[hsl(45,65%,55%)] to-[hsl(40,60%,60%)]',
  gold: 'from-[hsl(40,65%,55%)] to-[hsl(35,60%,60%)]',
};

const bgMap = {
  mint: 'bg-pastel-mint/30',
  sky: 'bg-pastel-sky/30',
  lavender: 'bg-pastel-lavender/30',
  rose: 'bg-pastel-rose/30',
  peach: 'bg-pastel-peach/30',
  butter: 'bg-pastel-butter/30',
  gold: 'bg-gold-soft/30',
};

export const ProgressCard: React.FC<ProgressCardProps> = ({
  title,
  subtitle,
  progress,
  color = 'mint',
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
