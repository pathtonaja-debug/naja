import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Droplets, UtensilsCrossed, Sun, CloudMoon, Plus, Minus, Check } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import {
  getTodayMeals, updateMeals,
  getTodayWater, addWaterGlass, removeWaterGlass,
  type DailyMeals, type DailyWater,
} from '@/services/ramadanMealTracker';

const WATER_TARGET = 8; // 8 glasses = 2L

export function FastingHealthTracker() {
  const { t } = useTranslation();
  const [meals, setMeals] = useState<DailyMeals>(getTodayMeals());
  const [water, setWater] = useState<DailyWater>(getTodayWater());
  const [editingMeal, setEditingMeal] = useState<'suhoor' | 'iftar' | null>(null);

  const saveMeal = (field: 'suhoor' | 'iftar', value: string) => {
    const updated = updateMeals({ [field]: value });
    setMeals(updated);
  };

  const toggleNiyyah = () => {
    const updated = updateMeals({ niyyahDone: !meals.niyyahDone });
    setMeals(updated);
  };

  const waterPercent = Math.min(100, Math.round((water.glasses / WATER_TARGET) * 100));

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <UtensilsCrossed className="w-4 h-4 text-primary" />
        <h3 className="text-headline font-semibold">{t('ramadan.fasting.title')}</h3>
      </div>

      {/* Niyyah reminder */}
      <motion.button
        onClick={toggleNiyyah}
        animate={meals.niyyahDone ? { scale: [1, 1.05, 1] } : {}}
        transition={{ duration: 0.3 }}
        className={cn(
          "w-full p-3 rounded-xl flex items-center gap-3 transition-colors text-left",
          meals.niyyahDone ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"
        )}
      >
        <div className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center",
          meals.niyyahDone ? "bg-success/20" : "bg-muted-foreground/10"
        )}>
          <AnimatePresence mode="wait">
            {meals.niyyahDone ? (
              <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                <Check className="w-4 h-4" />
              </motion.div>
            ) : (
              <motion.span key="icon" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                🤲
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <div>
          <p className="text-subhead font-medium">{t('ramadan.fasting.niyyah')}</p>
          <p className="text-caption-1 opacity-70">{t('ramadan.fasting.niyyahHint')}</p>
        </div>
      </motion.button>

      {/* Meal logging cards */}
      <div className="grid grid-cols-2 gap-3">
        {/* Suhoor */}
        <Card
          className="p-3 cursor-pointer hover:bg-muted/30 transition-colors"
          onClick={() => setEditingMeal(editingMeal === 'suhoor' ? null : 'suhoor')}
        >
          <div className="flex items-center gap-2 mb-2">
            <CloudMoon className="w-4 h-4 text-muted-foreground" />
            <span className="text-subhead font-medium">{t('ramadan.fasting.suhoor')}</span>
          </div>
          {meals.suhoor ? (
            <p className="text-caption-1 text-muted-foreground line-clamp-2">{meals.suhoor}</p>
          ) : (
            <p className="text-caption-1 text-muted-foreground/50 italic">{t('ramadan.fasting.tapToLog')}</p>
          )}
        </Card>

        {/* Iftar */}
        <Card
          className="p-3 cursor-pointer hover:bg-muted/30 transition-colors"
          onClick={() => setEditingMeal(editingMeal === 'iftar' ? null : 'iftar')}
        >
          <div className="flex items-center gap-2 mb-2">
            <Sun className="w-4 h-4 text-muted-foreground" />
            <span className="text-subhead font-medium">{t('ramadan.fasting.iftar')}</span>
          </div>
          {meals.iftar ? (
            <p className="text-caption-1 text-muted-foreground line-clamp-2">{meals.iftar}</p>
          ) : (
            <p className="text-caption-1 text-muted-foreground/50 italic">{t('ramadan.fasting.tapToLog')}</p>
          )}
        </Card>
      </div>

      {/* Expandable meal editor */}
      <AnimatePresence>
        {editingMeal && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <Textarea
              placeholder={t(`ramadan.fasting.${editingMeal}Placeholder`)}
              value={editingMeal === 'suhoor' ? meals.suhoor : meals.iftar}
              onChange={(e) => saveMeal(editingMeal, e.target.value)}
              className="min-h-[60px] text-sm"
              autoFocus
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sunnah tip */}
      <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[hsl(var(--ramadan-gold)/0.08)]">
        <span>🌴</span>
        <p className="text-caption-1 text-muted-foreground">{t('ramadan.fasting.sunnahTip')}</p>
      </div>

      {/* Water intake */}
      <Card className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-accent-foreground" />
            <span className="text-subhead font-medium">{t('ramadan.fasting.water')}</span>
          </div>
          <span className="text-caption-1 text-muted-foreground">
            {water.glasses}/{WATER_TARGET} ({waterPercent}%)
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setWater(removeWaterGlass())}
            className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-muted/80"
            disabled={water.glasses <= 0}
          >
            <Minus className="w-3.5 h-3.5" />
          </button>

          <div className="flex-1 flex gap-1">
            {Array.from({ length: WATER_TARGET }).map((_, i) => (
              <motion.div
                key={i}
                animate={i < water.glasses ? { scale: [1, 1.2, 1] } : {}}
                transition={{ delay: i * 0.05 }}
                className={cn(
                  "flex-1 h-3 rounded-full transition-colors",
                  i < water.glasses ? "bg-primary/70" : "bg-muted"
                )}
              />
            ))}
          </div>

          <button
            onClick={() => setWater(addWaterGlass())}
            className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-muted/80"
            disabled={water.glasses >= 12}
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </Card>
    </div>
  );
}
