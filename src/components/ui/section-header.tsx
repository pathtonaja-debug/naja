import React from 'react';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  action,
  className,
}) => {
  return (
    <div className={cn('flex items-center justify-between', className)}>
      <div>
        <h2 className="text-title-3 text-foreground">{title}</h2>
        {subtitle && (
          <p className="text-footnote text-muted-foreground mt-0.5">{subtitle}</p>
        )}
      </div>
      {action && action}
    </div>
  );
};
