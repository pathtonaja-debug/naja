import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Plus, Trash2, Check, TreePine } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import {
  getCharityState,
  updateCharitySettings,
  addDonation,
  removeDonation,
  getTotalDonations,
  getSadaqahProgress,
  getDonationDaysCount,
  type CharityState,
  type DonationEntry,
} from '@/services/ramadanCharityTracker';

const TREE_STAGES = [
  { min: 0, emoji: '🌱', label: 'Seed' },
  { min: 3, emoji: '🌿', label: 'Sprout' },
  { min: 7, emoji: '🪴', label: 'Sapling' },
  { min: 14, emoji: '🌳', label: 'Tree' },
  { min: 21, emoji: '🌲', label: 'Mighty Tree' },
  { min: 28, emoji: '🏡', label: 'Forest' },
];

function getTreeStage(days: number) {
  return [...TREE_STAGES].reverse().find(s => days >= s.min) ?? TREE_STAGES[0];
}

export function CharityTracker() {
  const { t } = useTranslation();
  const [state, setState] = useState<CharityState>(getCharityState());
  const [showAddSheet, setShowAddSheet] = useState(false);
  const [showGoalSheet, setShowGoalSheet] = useState(false);
  const [newAmount, setNewAmount] = useState('');
  const [newType, setNewType] = useState<DonationEntry['type']>('sadaqah');
  const [newNote, setNewNote] = useState('');
  const [goalInput, setGoalInput] = useState('');

  const total = getTotalDonations();
  const sadaqahProgress = getSadaqahProgress();
  const donationDays = getDonationDaysCount();
  const tree = getTreeStage(donationDays);

  const handleAddDonation = () => {
    const amount = parseFloat(newAmount);
    if (!amount || amount <= 0) return;
    const updated = addDonation({ amount, type: newType, note: newNote });
    setState(updated);
    setNewAmount('');
    setNewNote('');
    setShowAddSheet(false);
  };

  const handleRemove = (id: string) => {
    const updated = removeDonation(id);
    setState(updated);
  };

  const handleSetGoal = () => {
    const goal = parseFloat(goalInput);
    if (!goal || goal <= 0) return;
    const updated = updateCharitySettings({ sadaqahGoal: goal });
    setState(updated);
    setGoalInput('');
    setShowGoalSheet(false);
  };

  const handleToggleZakat = () => {
    const updated = updateCharitySettings({ zakatPaid: !state.zakatPaid });
    setState(updated);
  };

  const DONATION_TYPES: { id: DonationEntry['type']; labelKey: string }[] = [
    { id: 'sadaqah', labelKey: 'ramadan.charity.sadaqah' },
    { id: 'zakat', labelKey: 'ramadan.charity.zakat' },
    { id: 'fidya', labelKey: 'ramadan.charity.fidya' },
    { id: 'other', labelKey: 'ramadan.charity.other' },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4 text-primary" />
          <h3 className="text-headline font-semibold">{t('ramadan.charity.title')}</h3>
        </div>
        <Button size="sm" variant="outline" onClick={() => setShowAddSheet(true)}>
          <Plus className="w-3.5 h-3.5 mr-1" />
          {t('ramadan.charity.logDonation')}
        </Button>
      </div>

      {/* Growing tree visual */}
      <Card className="p-4 text-center">
        <motion.div
          key={tree.emoji}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="text-5xl mb-2"
        >
          {tree.emoji}
        </motion.div>
        <p className="text-subhead font-medium">{t('ramadan.charity.treeLabel')}</p>
        <p className="text-caption-1 text-muted-foreground">
          {donationDays} {t('ramadan.charity.daysOfGiving')}
        </p>
      </Card>

      {/* Sadaqah goal progress */}
      {sadaqahProgress.goal > 0 && (
        <Card className="p-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-subhead font-medium">{t('ramadan.charity.sadaqahGoal')}</span>
            <span className="text-caption-1 text-muted-foreground">
              {sadaqahProgress.current}/{sadaqahProgress.goal}
            </span>
          </div>
          <Progress value={sadaqahProgress.percent} className="h-1.5" />
        </Card>
      )}

      {/* Zakat toggle */}
      <motion.button
        onClick={handleToggleZakat}
        animate={state.zakatPaid ? { scale: [1, 1.05, 1] } : {}}
        transition={{ duration: 0.3 }}
        className={cn(
          "w-full p-3 rounded-xl flex items-center gap-3 transition-colors text-left",
          state.zakatPaid ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"
        )}
      >
        <div className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center",
          state.zakatPaid ? "bg-success/20" : "bg-muted-foreground/10"
        )}>
          {state.zakatPaid ? <Check className="w-4 h-4" /> : <span>💰</span>}
        </div>
        <div>
          <p className="text-subhead font-medium">{t('ramadan.charity.zakatPaid')}</p>
          <p className="text-caption-1 opacity-70">{t('ramadan.charity.zakatHint')}</p>
        </div>
      </motion.button>

      {/* Total */}
      <div className="flex items-center justify-between px-1">
        <span className="text-subhead font-medium">{t('ramadan.charity.totalGiven')}</span>
        <span className="text-headline font-bold text-primary">{total.toFixed(0)}</span>
      </div>

      {/* Recent donations */}
      {state.donations.length > 0 && (
        <div className="space-y-1.5">
          {state.donations.slice(-5).reverse().map((d) => (
            <div key={d.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-caption-1 text-muted-foreground">{d.date.slice(5)}</span>
                <span className="text-subhead font-medium truncate">{d.note || t(`ramadan.charity.${d.type}`)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-subhead font-semibold">{d.amount}</span>
                <button onClick={() => handleRemove(d.id)} className="text-muted-foreground hover:text-destructive">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Set goal button */}
      {sadaqahProgress.goal === 0 && (
        <Button variant="outline" size="sm" className="w-full" onClick={() => setShowGoalSheet(true)}>
          {t('ramadan.charity.setGoal')}
        </Button>
      )}

      {/* Add Donation Sheet */}
      <Sheet open={showAddSheet} onOpenChange={setShowAddSheet}>
        <SheetContent side="bottom" className="rounded-t-3xl">
          <SheetHeader className="text-left pb-4">
            <SheetTitle>{t('ramadan.charity.logDonation')}</SheetTitle>
          </SheetHeader>
          <div className="space-y-4 pb-4">
            <div>
              <label className="text-subhead font-medium mb-1 block">{t('ramadan.charity.amount')}</label>
              <Input
                type="number"
                placeholder="0"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
                autoFocus
              />
            </div>
            <div>
              <label className="text-subhead font-medium mb-1 block">{t('ramadan.charity.type')}</label>
              <div className="flex gap-2 flex-wrap">
                {DONATION_TYPES.map((dt) => (
                  <button
                    key={dt.id}
                    onClick={() => setNewType(dt.id)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-caption-1 font-medium transition-colors",
                      newType === dt.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    )}
                  >
                    {t(dt.labelKey)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-subhead font-medium mb-1 block">{t('ramadan.charity.note')}</label>
              <Input
                placeholder={t('ramadan.charity.notePlaceholder')}
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
              />
            </div>
            <Button className="w-full" onClick={handleAddDonation} disabled={!newAmount}>
              {t('ramadan.charity.add')}
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Set Goal Sheet */}
      <Sheet open={showGoalSheet} onOpenChange={setShowGoalSheet}>
        <SheetContent side="bottom" className="rounded-t-3xl">
          <SheetHeader className="text-left pb-4">
            <SheetTitle>{t('ramadan.charity.setGoal')}</SheetTitle>
          </SheetHeader>
          <div className="space-y-4 pb-4">
            <Input
              type="number"
              placeholder={t('ramadan.charity.goalPlaceholder')}
              value={goalInput}
              onChange={(e) => setGoalInput(e.target.value)}
              autoFocus
            />
            <Button className="w-full" onClick={handleSetGoal} disabled={!goalInput}>
              {t('common.save')}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
