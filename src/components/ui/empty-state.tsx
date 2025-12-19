import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'flex flex-col items-center justify-center py-12 px-6 text-center',
        className
      )}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
        className="w-16 h-16 rounded-2xl bg-pastel-mint/50 flex items-center justify-center mb-4"
      >
        {icon}
      </motion.div>
      
      <h3 className="text-title-3 text-foreground mb-1">{title}</h3>
      <p className="text-footnote text-muted-foreground max-w-[240px]">
        {description}
      </p>
      
      {action && (
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={action.onClick}
          className="mt-5 ios-button-primary text-subhead"
        >
          {action.label}
        </motion.button>
      )}
    </motion.div>
  );
};
