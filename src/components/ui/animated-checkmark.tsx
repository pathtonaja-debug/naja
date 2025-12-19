import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnimatedCheckmarkProps {
  isVisible: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'mint' | 'sky' | 'gold';
}

const sizeMap = {
  sm: { container: 'w-6 h-6', icon: 'w-3 h-3' },
  md: { container: 'w-8 h-8', icon: 'w-4 h-4' },
  lg: { container: 'w-12 h-12', icon: 'w-6 h-6' },
};

const colorMap = {
  mint: 'bg-pastel-mint text-[hsl(160,40%,35%)]',
  sky: 'bg-pastel-sky text-[hsl(200,55%,35%)]',
  gold: 'bg-gold-soft text-[hsl(40,65%,35%)]',
};

export const AnimatedCheckmark: React.FC<AnimatedCheckmarkProps> = ({
  isVisible,
  size = 'md',
  color = 'mint',
}) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 15,
          }}
          className={cn(
            'rounded-full flex items-center justify-center',
            sizeMap[size].container,
            colorMap[color]
          )}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 500 }}
          >
            <Check className={sizeMap[size].icon} strokeWidth={3} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
