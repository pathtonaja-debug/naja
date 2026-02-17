import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Target, BookOpen, Moon as MoonIcon, HandHeart, Check, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const GOALS_KEY = 'naja_ramadan_goals_v1';

export interface RamadanGoal {
  id: string;
  icon: string;
  target: number;
  unit: string;
  current: number;
}

interface GoalsState {
  khatmTarget: number; // number of full Quran completions
  taraweehTarget: number; // nights of taraweeh
  charityTarget: number; // total charity amount
  customGoals: RamadanGoal[];
}

const DEFAULT_GOALS: GoalsState = {
  khatmTarget: 1,
  taraweehTarget: 30,
  charityTarget: 100,
  customGoals: [],
};

function getGoals(): GoalsState {
  try {
    const raw = localStorage.getItem(GOALS_KEY);
    return raw ? { ...DEFAULT_GOALS, ...JSON.parse(raw) } : DEFAULT_GOALS;
  } catch {
    return DEFAULT_GOALS;
  }
}

function saveGoals(goals: GoalsState): void {
  try {
    localStorage.setItem(GOALS_KEY, JSON.stringify(goals));
  } catch {
    // ignore
  }
}

/** Get progress from ibadah store */
function getProgressFromStore(): { taraweehNights: number; totalCharity: number; totalQuranPages: number } {
  try {
    const raw = localStorage.getItem('naja_ramadan_ibadah_v1');
    const store: Record<string, any> = raw ? JSON.parse(raw) : {};
    let taraweehNights = 0;
    let totalCharity = 0;
    let totalQuranPages = 0;
    for (const day of Object.values(store)) {
      if (day.taraweeh) taraweehNights++;
      if (day.charityAmount) totalCharity += day.charityAmount;
      if (day.quranPages) totalQuranPages += day.quranPages;
    }
    return { taraweehNights, totalCharity, totalQuranPages };
  } catch {
    return { taraweehNights: 0, totalCharity: 0, totalQuranPages: 0 };
  }
}

const PRESET_OPTIONS = {
  khatm: [1, 2, 3],
  taraweeh: [15, 20, 27, 30],
  charity: [50, 100, 300, 500],
};

interface GoalCardProps {
  icon: React.ReactNode;
  title: string;
  current: number;
  target: number;
  unit: string;
  onEdit: () => void;
}

function GoalCard({ icon, title, current, target, unit, onEdit }: GoalCardProps) {
  const pct = Math.min(100, Math.round((current / target) * 100));
  const isDone = pct >= 100;

  return (
    <button onClick={onEdit} className="w-full text-left">
      <Card className={cn(
        "p-3.5 transition-colors",
        isDone && "border-success/30 bg-success/5"
      )}>
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-9 h-9 rounded-xl flex items-center justify-center",
            isDone ? "bg-success/15 text-success" : "bg-primary/10 text-primary"
          )}>
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <span className="text-subhead font-medium truncate">{title}</span>
              <span className="text-caption-1 text-muted-foreground ml-2">
                {current}/{target} {unit}
              </span>
            </div>
            <Progress value={pct} className="h-1.5" />
          </div>
          {isDone ? (
            <Check className="w-4 h-4 text-success flex-shrink-0" />
          ) : (
            <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          )}
        </div>
      </Card>
    </button>
  );
}

export function RamadanGoals() {
  const { t } = useTranslation();
  const [goals, setGoals] = useState<GoalsState>(getGoals());
  const [progress, setProgress] = useState(getProgressFromStore());
  const [editingGoal, setEditingGoal] = useState<'khatm' | 'taraweeh' | 'charity' | null>(null);

  useEffect(() => {
    setProgress(getProgressFromStore());
  }, []);

  const updateGoal = (field: keyof GoalsState, value: number) => {
    const updated = { ...goals, [field]: value };
    setGoals(updated);
    saveGoals(updated);
    setEditingGoal(null);
  };

  // Calculate khatm progress (604 pages per khatm)
  const khatmPages = goals.khatmTarget * 604;
  const khatmCurrent = Math.min(goals.khatmTarget, Math.floor(progress.totalQuranPages / 604));

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Target className="w-4 h-4 text-primary" />
        <h3 className="text-headline font-semibold">{t('ramadan.goals.title')}</h3>
      </div>

      <div className="space-y-2">
        <GoalCard
          icon={<BookOpen className="w-4 h-4" />}
          title={t('ramadan.goals.khatm')}
          current={khatmCurrent}
          target={goals.khatmTarget}
          unit={t('ramadan.goals.khatmUnit')}
          onEdit={() => setEditingGoal('khatm')}
        />

        <GoalCard
          icon={<MoonIcon className="w-4 h-4" />}
          title={t('ramadan.goals.taraweeh')}
          current={progress.taraweehNights}
          target={goals.taraweehTarget}
          unit={t('ramadan.goals.nights')}
          onEdit={() => setEditingGoal('taraweeh')}
        />

        <GoalCard
          icon={<HandHeart className="w-4 h-4" />}
          title={t('ramadan.goals.charity')}
          current={progress.totalCharity}
          target={goals.charityTarget}
          unit="$"
          onEdit={() => setEditingGoal('charity')}
        />
      </div>

      {/* Edit Sheet */}
      <Sheet open={editingGoal !== null} onOpenChange={(open) => !open && setEditingGoal(null)}>
        <SheetContent side="bottom" className="rounded-t-3xl">
          <SheetHeader className="text-left pb-4">
            <SheetTitle>
              {editingGoal === 'khatm' && t('ramadan.goals.setKhatmTarget')}
              {editingGoal === 'taraweeh' && t('ramadan.goals.setTaraweehTarget')}
              {editingGoal === 'charity' && t('ramadan.goals.setCharityTarget')}
            </SheetTitle>
          </SheetHeader>

          <div className="space-y-3 pb-4">
            {editingGoal === 'khatm' && PRESET_OPTIONS.khatm.map((val) => (
              <button
                key={val}
                onClick={() => updateGoal('khatmTarget', val)}
                className={cn(
                  "w-full p-4 rounded-xl border transition-colors text-left flex items-center justify-between",
                  goals.khatmTarget === val ? "border-primary bg-primary/10" : "border-border"
                )}
              >
                <span className="font-medium">{val} {t('ramadan.goals.khatmUnit')}</span>
                <span className="text-sm text-muted-foreground">{val * 604} {t('ramadan.pages')}</span>
              </button>
            ))}

            {editingGoal === 'taraweeh' && PRESET_OPTIONS.taraweeh.map((val) => (
              <button
                key={val}
                onClick={() => updateGoal('taraweehTarget', val)}
                className={cn(
                  "w-full p-4 rounded-xl border transition-colors text-left",
                  goals.taraweehTarget === val ? "border-primary bg-primary/10" : "border-border"
                )}
              >
                <span className="font-medium">{val} {t('ramadan.goals.nights')}</span>
              </button>
            ))}

            {editingGoal === 'charity' && PRESET_OPTIONS.charity.map((val) => (
              <button
                key={val}
                onClick={() => updateGoal('charityTarget', val)}
                className={cn(
                  "w-full p-4 rounded-xl border transition-colors text-left",
                  goals.charityTarget === val ? "border-primary bg-primary/10" : "border-border"
                )}
              >
                <span className="font-medium">${val}</span>
              </button>
            ))}
          </div>

          <Button variant="outline" className="w-full" onClick={() => setEditingGoal(null)}>
            {t('common.cancel')}
          </Button>
        </SheetContent>
      </Sheet>
    </div>
  );
}
