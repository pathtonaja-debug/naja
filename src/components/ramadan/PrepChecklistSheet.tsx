import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { X, ChevronRight, Circle, Clock, CheckCircle2 } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { ChecklistItem, ChecklistItemStatus } from '@/services/ramadanState';

interface PrepChecklistSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: ChecklistItem | null;
  onStatusChange: (itemId: string, status: ChecklistItemStatus) => void;
}

const STATUS_CONFIG = {
  not_started: {
    icon: Circle,
    labelKey: 'ramadan.checklist.notStarted',
    color: 'text-muted-foreground',
    bg: 'bg-muted',
  },
  in_progress: {
    icon: Clock,
    labelKey: 'ramadan.checklist.inProgress',
    color: 'text-warn',
    bg: 'bg-warn/10',
  },
  done: {
    icon: CheckCircle2,
    labelKey: 'ramadan.checklist.done',
    color: 'text-success',
    bg: 'bg-success/10',
  },
} as const;

export function PrepChecklistSheet({ 
  open, 
  onOpenChange, 
  item, 
  onStatusChange 
}: PrepChecklistSheetProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  if (!item) return null;

  const currentConfig = STATUS_CONFIG[item.status];
  const StatusIcon = currentConfig.icon;

  const handleStatusChange = (status: ChecklistItemStatus) => {
    onStatusChange(item.id, status);
  };

  const handleCta = () => {
    if (item.ctaPath) {
      onOpenChange(false);
      navigate(item.ctaPath);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl">
        <SheetHeader className="text-left pb-4">
          <SheetTitle>{t(item.titleKey)}</SheetTitle>
        </SheetHeader>

        <div className="space-y-6">
          {/* Description */}
          <p className="text-muted-foreground">{t(item.descriptionKey)}</p>

          {/* Status Selector */}
          <div>
            <p className="text-sm font-medium mb-3">{t('ramadan.checklist.status')}</p>
            <div className="flex gap-2">
              {(Object.keys(STATUS_CONFIG) as ChecklistItemStatus[]).map((status) => {
                const config = STATUS_CONFIG[status];
                const Icon = config.icon;
                const isActive = item.status === status;
                
                return (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-xl border-2 transition-all",
                      isActive 
                        ? `${config.bg} border-current ${config.color}` 
                        : "border-border hover:border-muted-foreground/50"
                    )}
                  >
                    <Icon className={cn("w-4 h-4", isActive && config.color)} />
                    <span className={cn("text-sm font-medium", isActive ? config.color : "text-muted-foreground")}>
                      {t(config.labelKey)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* CTA Button */}
          {item.ctaPath && item.ctaLabelKey && (
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={handleCta}
            >
              {t(item.ctaLabelKey)}
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
