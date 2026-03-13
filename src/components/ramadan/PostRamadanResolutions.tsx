import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Target, ArrowUp, ArrowDown, Check, Plus, Trash2,
  BookOpen, ChevronDown, ChevronUp, Flame
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import {
  getResolutions,
  importFromRamadanGoals,
  addResolution,
  removeResolution,
  toggleMonthlyCheckin,
  updateShawwalFasts,
  getCurrentMonthKey,
  getMonthKeysSinceCreation,
  getResolutionConsistency,
  type ResolutionsState,
  type Resolution,
} from '@/services/ramadanResolutionsStore';
import { getCurrentHijriYear } from '@/services/ramadanState';

const MONTH_LABELS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function getMonthLabel(key: string): string {
  const month = parseInt(key.split('-')[1], 10);
  return MONTH_LABELS_SHORT[month - 1] || key;
}

export function PostRamadanResolutions() {
  const { t } = useTranslation();
  const [state, setState] = useState<ResolutionsState | null>(null);
  const [showAddSheet, setShowAddSheet] = useState<'build' | 'leave' | null>(null);
  const [newName, setNewName] = useState('');
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    let data = getResolutions();
    if (!data) {
      data = importFromRamadanGoals(getCurrentHijriYear());
    }
    setState(data);
  }, []);

  if (!state) return null;

  const currentMonth = getCurrentMonthKey();
  const monthKeys = getMonthKeysSinceCreation(state.createdAt);
  const buildResolutions = state.resolutions.filter(r => r.type === 'build');
  const leaveResolutions = state.resolutions.filter(r => r.type === 'leave');

  const totalResolutions = state.resolutions.length;
  const checkedThisMonth = state.resolutions.filter(
    r => r.monthlyCheckins[currentMonth]
  ).length;
  const monthlyPct = totalResolutions > 0
    ? Math.round((checkedThisMonth / totalResolutions) * 100)
    : 0;

  const handleToggle = (id: string) => {
    const updated = toggleMonthlyCheckin(id, currentMonth);
    if (updated) setState({ ...updated });
  };

  const handleAdd = () => {
    if (!newName.trim() || !showAddSheet) return;
    const updated = addResolution(newName.trim(), showAddSheet);
    if (updated) setState({ ...updated });
    setNewName('');
    setShowAddSheet(null);
  };

  const handleRemove = (id: string) => {
    const updated = removeResolution(id);
    if (updated) setState({ ...updated });
  };

  const handleShawwal = (delta: number) => {
    const updated = updateShawwalFasts(state.shawwalFasts + delta);
    if (updated) setState({ ...updated });
  };

  return (
    <div className="space-y-3">
      {/* Section Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full"
      >
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-primary" />
          <h3 className="text-headline font-semibold">
            {t('ramadan.resolutions.title')}
          </h3>
        </div>
        {expanded
          ? <ChevronUp className="w-4 h-4 text-muted-foreground" />
          : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>

      {!expanded && totalResolutions > 0 && (
        <Card className="p-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-subhead text-muted-foreground">
              {t('ramadan.resolutions.thisMonth')}
            </span>
            <span className="text-caption-1 font-medium">
              {checkedThisMonth}/{totalResolutions}
            </span>
          </div>
          <Progress value={monthlyPct} className="h-1.5" />
        </Card>
      )}

      {expanded && (
        <div className="space-y-3">
          {/* Monthly progress banner */}
          <Card className="p-4 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
                <Flame className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-subhead font-medium">
                  {t('ramadan.resolutions.monthlyProgress')}
                </p>
                <p className="text-caption-1 text-muted-foreground">
                  {checkedThisMonth}/{totalResolutions} {t('ramadan.resolutions.maintained')}
                </p>
              </div>
              <span className="text-xl font-bold text-primary">{monthlyPct}%</span>
            </div>
            <Progress value={monthlyPct} className="h-2" />
          </Card>

          {/* Shawwal fasts */}
          <Card className="p-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-success" />
                </div>
                <div>
                  <p className="text-subhead font-medium">
                    {t('ramadan.resolutions.shawwalFasts')}
                  </p>
                  <p className="text-caption-1 text-muted-foreground">
                    {state.shawwalFasts}/6 {t('ramadan.resolutions.completed')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleShawwal(-1)}
                  disabled={state.shawwalFasts <= 0}
                  className="w-7 h-7 rounded-full bg-muted flex items-center justify-center disabled:opacity-30"
                >
                  <span className="text-sm font-bold">−</span>
                </button>
                <span className="w-6 text-center font-semibold">{state.shawwalFasts}</span>
                <button
                  onClick={() => handleShawwal(1)}
                  disabled={state.shawwalFasts >= 6}
                  className="w-7 h-7 rounded-full bg-muted flex items-center justify-center disabled:opacity-30"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </Card>

          {/* Habits to Build */}
          <ResolutionList
            title={t('ramadan.resolutions.habitsToBuild')}
            icon={<ArrowUp className="w-3.5 h-3.5" />}
            iconColor="bg-success/15 text-success"
            items={buildResolutions}
            currentMonth={currentMonth}
            monthKeys={monthKeys}
            createdAt={state.createdAt}
            onToggle={handleToggle}
            onRemove={handleRemove}
            onAdd={() => setShowAddSheet('build')}
          />

          {/* Habits to Leave */}
          <ResolutionList
            title={t('ramadan.resolutions.habitsToLeave')}
            icon={<ArrowDown className="w-3.5 h-3.5" />}
            iconColor="bg-destructive/15 text-destructive"
            items={leaveResolutions}
            currentMonth={currentMonth}
            monthKeys={monthKeys}
            createdAt={state.createdAt}
            onToggle={handleToggle}
            onRemove={handleRemove}
            onAdd={() => setShowAddSheet('leave')}
          />

          {totalResolutions === 0 && (
            <Card className="p-6 text-center">
              <p className="text-muted-foreground text-sm mb-3">
                {t('ramadan.resolutions.emptyMessage')}
              </p>
              <div className="flex gap-2 justify-center">
                <Button size="sm" variant="outline" onClick={() => setShowAddSheet('build')}>
                  <ArrowUp className="w-3.5 h-3.5 mr-1.5" />
                  {t('ramadan.resolutions.addBuild')}
                </Button>
                <Button size="sm" variant="outline" onClick={() => setShowAddSheet('leave')}>
                  <ArrowDown className="w-3.5 h-3.5 mr-1.5" />
                  {t('ramadan.resolutions.addLeave')}
                </Button>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Add resolution sheet */}
      <Sheet open={showAddSheet !== null} onOpenChange={(open) => !open && setShowAddSheet(null)}>
        <SheetContent side="bottom" className="rounded-t-3xl">
          <SheetHeader className="text-left pb-4">
            <SheetTitle>
              {showAddSheet === 'build'
                ? t('ramadan.resolutions.addBuildTitle')
                : t('ramadan.resolutions.addLeaveTitle')}
            </SheetTitle>
          </SheetHeader>
          <div className="space-y-4 pb-4">
            <Input
              placeholder={t('ramadan.resolutions.placeholder')}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            />
            <Button className="w-full" onClick={handleAdd} disabled={!newName.trim()}>
              {t('common.add')}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

/* ─── Resolution List Sub-component ─── */

interface ResolutionListProps {
  title: string;
  icon: React.ReactNode;
  iconColor: string;
  items: Resolution[];
  currentMonth: string;
  monthKeys: string[];
  createdAt: string;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  onAdd: () => void;
}

function ResolutionList({
  title, icon, iconColor, items, currentMonth, monthKeys, createdAt,
  onToggle, onRemove, onAdd,
}: ResolutionListProps) {
  const { t } = useTranslation();

  return (
    <Card className="p-4 space-y-3">
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

      {items.length === 0 && (
        <p className="text-caption-1 text-muted-foreground italic pl-8">
          {t('ramadan.resolutions.tapToAdd')}
        </p>
      )}

      {items.map(item => {
        const isCheckedThisMonth = item.monthlyCheckins[currentMonth] === true;
        const consistency = getResolutionConsistency(item, createdAt);
        const recentMonths = monthKeys.slice(-4);

        return (
          <div key={item.id} className="space-y-1.5 pl-8">
            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggle(item.id)}
                className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0",
                  isCheckedThisMonth ? "bg-success border-success" : "border-muted-foreground/30"
                )}
              >
                {isCheckedThisMonth && <Check className="w-3 h-3 text-success-foreground" />}
              </button>
              <span className={cn(
                "flex-1 text-subhead",
                isCheckedThisMonth && "text-muted-foreground"
              )}>
                {item.name}
              </span>
              <span className="text-caption-1 text-muted-foreground">{consistency}%</span>
              <button onClick={() => onRemove(item.id)} className="text-muted-foreground hover:text-destructive">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Mini month dots */}
            <div className="flex gap-1 items-center">
              {recentMonths.map(mk => (
                <div
                  key={mk}
                  title={getMonthLabel(mk)}
                  className={cn(
                    "w-3 h-3 rounded-full",
                    item.monthlyCheckins[mk]
                      ? "bg-success"
                      : mk === currentMonth
                        ? "bg-muted-foreground/20 ring-1 ring-primary"
                        : "bg-muted-foreground/10"
                  )}
                />
              ))}
              <span className="text-[10px] text-muted-foreground ml-1">
                {recentMonths.length > 0 && getMonthLabel(recentMonths[recentMonths.length - 1])}
              </span>
            </div>
          </div>
        );
      })}
    </Card>
  );
}
