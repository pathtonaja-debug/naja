import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Target, BookOpen, Moon as MoonIcon, Check, ChevronRight, Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const GOALS_KEY = 'naja_ramadan_goals_v1';

interface HabitEntry {
  id: string;
  name: string;
  done: boolean;
}

interface GoalsState {
  khatmTarget: number;
  taraweehTarget: number;
  habitsToBuild: HabitEntry[];
  habitsToLeave: HabitEntry[];
}

const DEFAULT_GOALS: GoalsState = {
  khatmTarget: 1,
  taraweehTarget: 30,
  habitsToBuild: [],
  habitsToLeave: [],
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
  } catch { /* ignore */ }
}

function getProgressFromStore(): { taraweehNights: number; totalQuranPages: number } {
  try {
    const raw = localStorage.getItem('naja_ramadan_ibadah_v1');
    const store: Record<string, any> = raw ? JSON.parse(raw) : {};
    let taraweehNights = 0;
    let totalQuranPages = 0;
    for (const day of Object.values(store)) {
      if (day.taraweeh) taraweehNights++;
      if (day.quranPages) totalQuranPages += day.quranPages;
    }
    return { taraweehNights, totalQuranPages };
  } catch {
    return { taraweehNights: 0, totalQuranPages: 0 };
  }
}

const PRESET_OPTIONS = {
  khatm: [1, 2, 3],
  taraweeh: [15, 20, 27, 30],
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
      <Card className={cn("p-3.5 transition-colors", isDone && "border-success/30 bg-success/5")}>
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

interface HabitListProps {
  title: string;
  icon: React.ReactNode;
  iconColor: string;
  habits: HabitEntry[];
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  onAdd: () => void;
  addLabel: string;
}

function HabitList({ title, icon, iconColor, habits, onToggle, onRemove, onAdd, addLabel }: HabitListProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={cn("w-6 h-6 rounded-md flex items-center justify-center", iconColor)}>
            {icon}
          </div>
          <span className="text-subhead font-medium">{title}</span>
        </div>
        <button onClick={onAdd} className="text-primary">
          <Plus className="w-4 h-4" />
        </button>
      </div>
      {habits.length === 0 && (
        <p className="text-caption-1 text-muted-foreground italic pl-8">{addLabel}</p>
      )}
      {habits.map(h => (
        <div key={h.id} className="flex items-center gap-2 pl-8">
          <button
            onClick={() => onToggle(h.id)}
            className={cn(
              "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0",
              h.done ? "bg-success border-success" : "border-muted-foreground/30"
            )}
          >
            {h.done && <Check className="w-3 h-3 text-success-foreground" />}
          </button>
          <span className={cn("flex-1 text-subhead", h.done && "line-through text-muted-foreground")}>{h.name}</span>
          <button onClick={() => onRemove(h.id)} className="text-muted-foreground hover:text-destructive">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}

export function RamadanGoals() {
  const { t } = useTranslation();
  const [goals, setGoals] = useState<GoalsState>(getGoals());
  const [progress, setProgress] = useState(getProgressFromStore());
  const [editingGoal, setEditingGoal] = useState<'khatm' | 'taraweeh' | null>(null);
  const [showAddHabitSheet, setShowAddHabitSheet] = useState<'build' | 'leave' | null>(null);
  const [newHabitName, setNewHabitName] = useState('');

  useEffect(() => {
    setProgress(getProgressFromStore());
  }, []);

  const updateGoal = (field: 'khatmTarget' | 'taraweehTarget', value: number) => {
    const updated = { ...goals, [field]: value };
    setGoals(updated);
    saveGoals(updated);
    setEditingGoal(null);
  };

  const addHabit = (type: 'build' | 'leave') => {
    if (!newHabitName.trim()) return;
    const entry: HabitEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: newHabitName.trim(),
      done: false,
    };
    const key = type === 'build' ? 'habitsToBuild' : 'habitsToLeave';
    const updated = { ...goals, [key]: [...goals[key], entry] };
    setGoals(updated);
    saveGoals(updated);
    setNewHabitName('');
    setShowAddHabitSheet(null);
  };

  const toggleHabit = (type: 'build' | 'leave', id: string) => {
    const key = type === 'build' ? 'habitsToBuild' : 'habitsToLeave';
    const updated = {
      ...goals,
      [key]: goals[key].map(h => h.id === id ? { ...h, done: !h.done } : h),
    };
    setGoals(updated);
    saveGoals(updated);
  };

  const removeHabit = (type: 'build' | 'leave', id: string) => {
    const key = type === 'build' ? 'habitsToBuild' : 'habitsToLeave';
    const updated = {
      ...goals,
      [key]: goals[key].filter(h => h.id !== id),
    };
    setGoals(updated);
    saveGoals(updated);
  };

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
      </div>

      {/* Habits to build / leave */}
      <Card className="p-4 space-y-4">
        <HabitList
          title={t('ramadan.goals.habitsToBuild')}
          icon={<ArrowUp className="w-3.5 h-3.5" />}
          iconColor="bg-success/15 text-success"
          habits={goals.habitsToBuild}
          onToggle={(id) => toggleHabit('build', id)}
          onRemove={(id) => removeHabit('build', id)}
          onAdd={() => setShowAddHabitSheet('build')}
          addLabel={t('ramadan.goals.tapToAddHabit')}
        />
        <HabitList
          title={t('ramadan.goals.habitsToLeave')}
          icon={<ArrowDown className="w-3.5 h-3.5" />}
          iconColor="bg-destructive/15 text-destructive"
          habits={goals.habitsToLeave}
          onToggle={(id) => toggleHabit('leave', id)}
          onRemove={(id) => removeHabit('leave', id)}
          onAdd={() => setShowAddHabitSheet('leave')}
          addLabel={t('ramadan.goals.tapToAddHabit')}
        />
      </Card>

      {/* Edit goal sheet */}
      <Sheet open={editingGoal !== null} onOpenChange={(open) => !open && setEditingGoal(null)}>
        <SheetContent side="bottom" className="rounded-t-3xl">
          <SheetHeader className="text-left pb-4">
            <SheetTitle>
              {editingGoal === 'khatm' && t('ramadan.goals.setKhatmTarget')}
              {editingGoal === 'taraweeh' && t('ramadan.goals.setTaraweehTarget')}
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
          </div>
          <Button variant="outline" className="w-full" onClick={() => setEditingGoal(null)}>
            {t('common.cancel')}
          </Button>
        </SheetContent>
      </Sheet>

      {/* Add habit sheet */}
      <Sheet open={showAddHabitSheet !== null} onOpenChange={(open) => !open && setShowAddHabitSheet(null)}>
        <SheetContent side="bottom" className="rounded-t-3xl">
          <SheetHeader className="text-left pb-4">
            <SheetTitle>
              {showAddHabitSheet === 'build'
                ? t('ramadan.goals.addHabitBuild')
                : t('ramadan.goals.addHabitLeave')}
            </SheetTitle>
          </SheetHeader>
          <div className="space-y-4 pb-4">
            <Input
              placeholder={t('ramadan.goals.habitPlaceholder')}
              value={newHabitName}
              onChange={(e) => setNewHabitName(e.target.value)}
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && showAddHabitSheet && addHabit(showAddHabitSheet)}
            />
            <Button
              className="w-full"
              onClick={() => showAddHabitSheet && addHabit(showAddHabitSheet)}
              disabled={!newHabitName.trim()}
            >
              {t('common.add')}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
