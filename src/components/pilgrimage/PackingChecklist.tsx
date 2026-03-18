import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, Package } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const STORAGE_KEY = 'naja_pilgrimage_packing_v1';

interface ChecklistCategory {
  id: string;
  labelKey: string;
  items: { id: string; labelKey: string }[];
}

const CHECKLIST: ChecklistCategory[] = [
  {
    id: 'documents',
    labelKey: 'pilgrimage.packing.documents',
    items: [
      { id: 'passport', labelKey: 'pilgrimage.packing.passport' },
      { id: 'visa', labelKey: 'pilgrimage.packing.visa' },
      { id: 'tickets', labelKey: 'pilgrimage.packing.tickets' },
      { id: 'hotel', labelKey: 'pilgrimage.packing.hotelBooking' },
      { id: 'insurance', labelKey: 'pilgrimage.packing.insurance' },
      { id: 'copies', labelKey: 'pilgrimage.packing.copies' },
    ],
  },
  {
    id: 'clothing',
    labelKey: 'pilgrimage.packing.clothing',
    items: [
      { id: 'ihram', labelKey: 'pilgrimage.packing.ihram' },
      { id: 'belt', labelKey: 'pilgrimage.packing.ihramBelt' },
      { id: 'sandals', labelKey: 'pilgrimage.packing.sandals' },
      { id: 'regular', labelKey: 'pilgrimage.packing.regularClothes' },
      { id: 'umbrella', labelKey: 'pilgrimage.packing.umbrella' },
    ],
  },
  {
    id: 'health',
    labelKey: 'pilgrimage.packing.health',
    items: [
      { id: 'meds', labelKey: 'pilgrimage.packing.medications' },
      { id: 'firstaid', labelKey: 'pilgrimage.packing.firstAid' },
      { id: 'sunscreen', labelKey: 'pilgrimage.packing.sunscreen' },
      { id: 'sanitizer', labelKey: 'pilgrimage.packing.sanitizer' },
      { id: 'masks', labelKey: 'pilgrimage.packing.masks' },
    ],
  },
  {
    id: 'essentials',
    labelKey: 'pilgrimage.packing.essentials',
    items: [
      { id: 'quran', labelKey: 'pilgrimage.packing.quran' },
      { id: 'prayermat', labelKey: 'pilgrimage.packing.prayerMat' },
      { id: 'duabook', labelKey: 'pilgrimage.packing.duaBook' },
      { id: 'tasbih', labelKey: 'pilgrimage.packing.tasbih' },
      { id: 'waterbottle', labelKey: 'pilgrimage.packing.waterBottle' },
      { id: 'snacks', labelKey: 'pilgrimage.packing.snacks' },
      { id: 'charger', labelKey: 'pilgrimage.packing.charger' },
    ],
  },
];

export function PackingChecklist() {
  const { t } = useTranslation();
  const [checked, setChecked] = useState<Record<string, boolean>>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(checked));
  }, [checked]);

  const toggle = (itemId: string) => {
    setChecked(prev => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  const totalItems = CHECKLIST.reduce((acc, c) => acc + c.items.length, 0);
  const checkedCount = Object.values(checked).filter(Boolean).length;
  const progress = totalItems > 0 ? Math.round((checkedCount / totalItems) * 100) : 0;

  return (
    <div className="space-y-3">
      {/* Progress bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Package className="w-5 h-5 text-primary" />
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">{t('pilgrimage.packing.title')}</span>
                <span className="text-muted-foreground">{checkedCount}/{totalItems}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {CHECKLIST.map(category => {
        const catChecked = category.items.filter(i => checked[i.id]).length;
        return (
          <Card key={category.id}>
            <CardContent className="p-4 space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-semibold text-foreground">{t(category.labelKey)}</h4>
                <span className="text-[11px] text-muted-foreground">{catChecked}/{category.items.length}</span>
              </div>
              <div className="space-y-1">
                {category.items.map(item => (
                  <button
                    key={item.id}
                    onClick={() => toggle(item.id)}
                    className="flex items-center gap-2.5 w-full py-1.5 text-left"
                  >
                    <div className={cn(
                      "w-5 h-5 rounded flex items-center justify-center shrink-0 transition-colors",
                      checked[item.id] ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    )}>
                      {checked[item.id] && <Check className="w-3 h-3" />}
                    </div>
                    <span className={cn(
                      "text-sm transition-colors",
                      checked[item.id] ? "text-muted-foreground line-through" : "text-foreground"
                    )}>
                      {t(item.labelKey)}
                    </span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
