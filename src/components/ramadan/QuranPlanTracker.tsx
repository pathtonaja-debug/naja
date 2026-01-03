import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Check, ChevronRight, BookOpen } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import {
  getQuranPlan,
  setQuranPlan,
  getTodayQuranProgress,
  setTodayQuranProgress,
  type QuranPlanState,
} from '@/services/ramadanState';
import { KHATAM_PLANS, PRAYERS, type KhatamPlan } from '@/data/ramadanContent';

export function QuranPlanTracker() {
  const { t } = useTranslation();
  const [plan, setPlanState] = useState<QuranPlanState | null>(null);
  const [todayProgress, setTodayProgressState] = useState<{
    pagesRead: number;
    target: number;
    prayerBreakdown: Record<string, number>;
  } | null>(null);
  const [showPlanSelector, setShowPlanSelector] = useState(false);
  const [showPrayerTracker, setShowPrayerTracker] = useState(false);

  useEffect(() => {
    const storedPlan = getQuranPlan();
    setPlanState(storedPlan);
    if (storedPlan) {
      setTodayProgressState(getTodayQuranProgress());
    }
  }, []);

  const handleSelectPlan = (planId: string) => {
    const newPlan = setQuranPlan(planId);
    setPlanState(newPlan);
    setTodayProgressState(getTodayQuranProgress());
    setShowPlanSelector(false);
  };

  const handlePrayerToggle = (prayer: string) => {
    if (!plan || !todayProgress) return;
    
    const currentPlan = KHATAM_PLANS.find(p => p.id === plan.planId);
    if (!currentPlan) return;

    const currentPages = todayProgress.prayerBreakdown[prayer] || 0;
    const newPages = currentPages > 0 ? 0 : currentPlan.pagesPerPrayer;
    
    setTodayQuranProgress(newPages, prayer);
    setTodayProgressState(getTodayQuranProgress());
  };

  const currentPlanDetails = plan ? KHATAM_PLANS.find(p => p.id === plan.planId) : null;
  const progressPercent = todayProgress 
    ? Math.min(100, Math.round((todayProgress.pagesRead / todayProgress.target) * 100))
    : 0;

  // No plan selected - show selector
  if (!plan) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">{t('ramadan.quranPlans.title')}</h3>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground mb-4">{t('ramadan.quranPlans.choosePlan')}</p>
          <div className="space-y-3">
            {KHATAM_PLANS.map((khatamPlan) => (
              <button
                key={khatamPlan.id}
                onClick={() => handleSelectPlan(khatamPlan.id)}
                className="w-full p-4 rounded-xl border border-border hover:border-primary transition-colors text-left"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{t(`ramadan.quranPlans.${khatamPlan.id}`)}</h4>
                    <p className="text-sm text-muted-foreground">
                      {khatamPlan.pagesPerDay} {t('ramadan.pagesPerDay')} • {khatamPlan.pagesPerPrayer} {t('ramadan.perPrayer')}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </button>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{t('ramadan.quranPlans.title')}</h3>
        <button 
          onClick={() => setShowPlanSelector(true)}
          className="text-sm text-primary"
        >
          {t('common.edit')}
        </button>
      </div>

      <Card className="p-4">
        {/* Plan Summary */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="font-medium">{t(`ramadan.quranPlans.${plan.planId}`)}</h4>
            <p className="text-sm text-muted-foreground">
              {t('ramadan.todayTarget')}: {todayProgress?.target || 20} {t('ramadan.pages')}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">{todayProgress?.pagesRead || 0}</p>
            <p className="text-xs text-muted-foreground">{t('ramadan.pagesRead')}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <Progress value={progressPercent} className="h-2 mb-4" />

        {/* Reading Mode Toggle */}
        <div className="flex gap-2 mb-4">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => setShowPrayerTracker(true)}
          >
            <BookOpen className="w-4 h-4 mr-2" />
            {t('ramadan.trackByPrayer')}
          </Button>
        </div>

        {/* Prayer Breakdown Grid */}
        <div className="grid grid-cols-5 gap-2">
          {PRAYERS.map((prayer) => {
            const pagesCompleted = todayProgress?.prayerBreakdown[prayer] || 0;
            const target = currentPlanDetails?.pagesPerPrayer || 4;
            const isDone = pagesCompleted >= target;

            return (
              <button
                key={prayer}
                onClick={() => handlePrayerToggle(prayer)}
                className="text-center group"
              >
                <div className={cn(
                  "w-10 h-10 mx-auto rounded-full flex items-center justify-center text-xs font-medium mb-1 transition-colors",
                  isDone 
                    ? "bg-success/20 text-success" 
                    : "bg-muted text-muted-foreground group-hover:bg-muted/80"
                )}>
                  {isDone ? <Check className="w-4 h-4" /> : target}
                </div>
                <p className="text-[10px] text-muted-foreground">{prayer}</p>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Plan Selector Sheet */}
      <Sheet open={showPlanSelector} onOpenChange={setShowPlanSelector}>
        <SheetContent side="bottom" className="rounded-t-3xl">
          <SheetHeader className="text-left pb-4">
            <SheetTitle>{t('ramadan.quranPlans.changePlan')}</SheetTitle>
          </SheetHeader>
          <div className="space-y-3">
            {KHATAM_PLANS.map((khatamPlan) => (
              <button
                key={khatamPlan.id}
                onClick={() => handleSelectPlan(khatamPlan.id)}
                className={cn(
                  "w-full p-4 rounded-xl border transition-colors text-left flex items-center justify-between",
                  plan.planId === khatamPlan.id 
                    ? "border-primary bg-primary/10" 
                    : "border-border hover:border-primary/50"
                )}
              >
                <div>
                  <h4 className="font-medium">{t(`ramadan.quranPlans.${khatamPlan.id}`)}</h4>
                  <p className="text-sm text-muted-foreground">
                    {khatamPlan.pagesPerDay} {t('ramadan.pagesPerDay')}
                  </p>
                </div>
                {plan.planId === khatamPlan.id && (
                  <Check className="w-5 h-5 text-primary" />
                )}
              </button>
            ))}
          </div>
          <Button 
            variant="outline" 
            className="w-full mt-4"
            onClick={() => setShowPlanSelector(false)}
          >
            {t('common.cancel')}
          </Button>
        </SheetContent>
      </Sheet>

      {/* Prayer Tracker Sheet */}
      <Sheet open={showPrayerTracker} onOpenChange={setShowPrayerTracker}>
        <SheetContent side="bottom" className="rounded-t-3xl">
          <SheetHeader className="text-left pb-4">
            <SheetTitle>{t('ramadan.trackByPrayer')}</SheetTitle>
          </SheetHeader>
          <p className="text-sm text-muted-foreground mb-4">
            {t('ramadan.tapToMark')}
          </p>
          <div className="space-y-3">
            {PRAYERS.map((prayer) => {
              const pagesCompleted = todayProgress?.prayerBreakdown[prayer] || 0;
              const target = currentPlanDetails?.pagesPerPrayer || 4;
              const isDone = pagesCompleted >= target;

              return (
                <button
                  key={prayer}
                  onClick={() => handlePrayerToggle(prayer)}
                  className={cn(
                    "w-full p-4 rounded-xl border-2 transition-colors flex items-center justify-between",
                    isDone 
                      ? "border-success bg-success/10" 
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{prayer}</span>
                    <span className="text-sm text-muted-foreground">
                      {target} {t('ramadan.pages')}
                    </span>
                  </div>
                  {isDone && <Check className="w-5 h-5 text-success" />}
                </button>
              );
            })}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
