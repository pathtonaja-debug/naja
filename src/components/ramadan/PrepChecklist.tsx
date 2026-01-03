import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Circle, Clock, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { PrepChecklistSheet } from './PrepChecklistSheet';
import {
  getChecklistItems,
  getChecklistProgress,
  updateChecklistItemStatus,
  type ChecklistItem,
  type ChecklistItemStatus,
} from '@/services/ramadanState';

const STATUS_ICONS = {
  not_started: Circle,
  in_progress: Clock,
  done: CheckCircle2,
} as const;

const STATUS_COLORS = {
  not_started: 'text-muted-foreground bg-muted',
  in_progress: 'text-warn bg-warn/10',
  done: 'text-success bg-success/10',
} as const;

export function PrepChecklist() {
  const { t } = useTranslation();
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [progress, setProgress] = useState({ completed: 0, total: 0, percentage: 0 });
  const [selectedItem, setSelectedItem] = useState<ChecklistItem | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    setItems(getChecklistItems());
    setProgress(getChecklistProgress());
  }, []);

  const cycleStatus = (item: ChecklistItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const statusOrder: ChecklistItemStatus[] = ['not_started', 'in_progress', 'done'];
    const currentIndex = statusOrder.indexOf(item.status);
    const nextStatus = statusOrder[(currentIndex + 1) % 3];
    handleStatusChange(item.id, nextStatus);
  };

  const handleStatusChange = (itemId: string, status: ChecklistItemStatus) => {
    updateChecklistItemStatus(itemId, status);
    setItems(getChecklistItems());
    setProgress(getChecklistProgress());
  };

  const openSheet = (item: ChecklistItem) => {
    setSelectedItem(item);
    setSheetOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* Progress Header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold">{t('ramadan.checklist.title')}</h3>
        <span className="text-sm text-muted-foreground">
          {progress.completed}/{progress.total}
        </span>
      </div>
      
      <Progress value={progress.percentage} className="h-2" />

      {/* Checklist Items */}
      <div className="space-y-2">
        {items.map((item, index) => {
          const StatusIcon = STATUS_ICONS[item.status];
          
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card
                className="p-4 cursor-pointer hover:bg-muted/30 transition-colors"
                onClick={() => openSheet(item)}
              >
                <div className="flex items-center gap-3">
                  {/* Status Chip (tap to cycle) */}
                  <button
                    onClick={(e) => cycleStatus(item, e)}
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors",
                      STATUS_COLORS[item.status]
                    )}
                  >
                    <StatusIcon className="w-4 h-4" />
                  </button>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h4 className={cn(
                      "font-medium truncate",
                      item.status === 'done' && "line-through text-muted-foreground"
                    )}>
                      {t(item.titleKey)}
                    </h4>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom Sheet */}
      <PrepChecklistSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        item={selectedItem}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
