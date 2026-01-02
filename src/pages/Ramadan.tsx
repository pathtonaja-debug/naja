import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  Moon, BookOpen, Utensils, ScrollText, Heart, 
  ChevronRight, Check, Sparkles, Star
} from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { TopBar } from '@/components/ui/top-bar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  getRamadanPhase, 
  getQuranPlan, 
  setQuranPlan, 
  getTodayQuranProgress,
  type PhaseInfo 
} from '@/services/ramadanState';
import { 
  KHATAM_PLANS, 
  RAMADAN_DUAS, 
  RAMADAN_STORIES,
  HEALTH_TIPS,
  PREPARATION_TIPS,
  EID_GUIDANCE,
  SHAWWAL_TIPS,
  type KhatamPlan 
} from '@/data/ramadanContent';

type TabType = 'overview' | 'duas' | 'food' | 'stories';

const Ramadan = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [phaseInfo, setPhaseInfo] = useState<PhaseInfo | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showPlanSelector, setShowPlanSelector] = useState(false);
  const [todayProgress, setTodayProgress] = useState<{ pagesRead: number; target: number } | null>(null);

  useEffect(() => {
    setPhaseInfo(getRamadanPhase());
    const plan = getQuranPlan();
    if (plan) {
      setSelectedPlan(plan.planId);
      setTodayProgress(getTodayQuranProgress());
    }
  }, []);

  const handleSelectPlan = (planId: string) => {
    setQuranPlan(planId);
    setSelectedPlan(planId);
    setShowPlanSelector(false);
    setTodayProgress(getTodayQuranProgress());
  };

  const tabs = [
    { id: 'overview', labelKey: 'ramadan.tabs.overview', icon: Moon },
    { id: 'duas', labelKey: 'ramadan.tabs.duas', icon: Heart },
    { id: 'food', labelKey: 'ramadan.tabs.food', icon: Utensils },
    { id: 'stories', labelKey: 'ramadan.tabs.stories', icon: ScrollText },
  ];

  const renderPhaseHeader = () => {
    if (!phaseInfo) return null;

    switch (phaseInfo.phase) {
      case 'preparing':
        return (
          <div className="text-center py-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
              <Moon className="w-4 h-4" />
              <span className="text-sm font-medium">{t('ramadan.phase.preparing')}</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">
              {phaseInfo.daysUntilRamadan} {t('ramadan.daysUntil')}
            </h1>
            <p className="text-muted-foreground">{t('ramadan.prepareHeart')}</p>
          </div>
        );
      case 'active':
        return (
          <div className="text-center py-6">
            <div className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4",
              phaseInfo.isLastTenNights 
                ? "bg-warn/20 text-warn" 
                : "bg-success/20 text-success"
            )}>
              {phaseInfo.isLastTenNights ? (
                <Sparkles className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
              <span className="text-sm font-medium">
                {phaseInfo.isLastTenNights 
                  ? t('ramadan.phase.lastTenNights') 
                  : t('ramadan.phase.active')}
              </span>
            </div>
            <h1 className="text-3xl font-bold mb-2">
              {t('ramadan.dayOf', { day: phaseInfo.currentDayOfRamadan })}
            </h1>
            <p className="text-muted-foreground">
              {phaseInfo.hijriDate.day} {phaseInfo.hijriDate.monthName}
            </p>
          </div>
        );
      case 'eid':
        return (
          <div className="text-center py-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-warn/20 text-warn mb-4">
              <Star className="w-4 h-4" />
              <span className="text-sm font-medium">{t('ramadan.phase.eid')}</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">{t('ramadan.eidMubarak')}</h1>
            <p className="text-muted-foreground">{t('ramadan.eidMessage')}</p>
          </div>
        );
      case 'shawwal':
        return (
          <div className="text-center py-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/20 text-secondary-foreground mb-4">
              <Moon className="w-4 h-4" />
              <span className="text-sm font-medium">{t('ramadan.phase.shawwal')}</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">{t('ramadan.shawwalTitle')}</h1>
            <p className="text-muted-foreground">{t('ramadan.maintainMomentum')}</p>
          </div>
        );
    }
  };

  const renderOverview = () => {
    if (!phaseInfo) return null;

    // Phase-specific content
    switch (phaseInfo.phase) {
      case 'preparing':
        return (
          <div className="space-y-6">
            {/* Preparation Tips */}
            <div>
              <h3 className="text-lg font-semibold mb-3">{t('ramadan.preparation.title')}</h3>
              <div className="space-y-3">
                {PREPARATION_TIPS.map((tip) => (
                  <Card key={tip.id} className="p-4">
                    <h4 className="font-medium mb-1">{t(tip.titleKey)}</h4>
                    <p className="text-sm text-muted-foreground">{t(tip.contentKey)}</p>
                  </Card>
                ))}
              </div>
            </div>

            {/* Preview Quran Plans (Locked) */}
            <div>
              <h3 className="text-lg font-semibold mb-3">{t('ramadan.quranPlans.preview')}</h3>
              <div className="space-y-3 opacity-60">
                {KHATAM_PLANS.map((plan) => (
                  <Card key={plan.id} className="p-4 relative overflow-hidden">
                    <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px] flex items-center justify-center">
                      <span className="text-sm text-muted-foreground">{t('ramadan.unlocksInRamadan')}</span>
                    </div>
                    <h4 className="font-medium">{t(`ramadan.quranPlans.${plan.id}`)}</h4>
                    <p className="text-sm text-muted-foreground">
                      {plan.pagesPerDay} {t('ramadan.pagesPerDay')}
                    </p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        );

      case 'active':
        return (
          <div className="space-y-6">
            {/* Quran Reading Plan */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">{t('ramadan.quranPlans.title')}</h3>
                {selectedPlan && (
                  <button 
                    onClick={() => setShowPlanSelector(true)}
                    className="text-sm text-primary"
                  >
                    {t('common.edit')}
                  </button>
                )}
              </div>
              
              {!selectedPlan ? (
                <Card className="p-4">
                  <p className="text-sm text-muted-foreground mb-4">{t('ramadan.quranPlans.choosePlan')}</p>
                  <div className="space-y-3">
                    {KHATAM_PLANS.map((plan) => (
                      <button
                        key={plan.id}
                        onClick={() => handleSelectPlan(plan.id)}
                        className="w-full p-4 rounded-xl border border-border hover:border-primary transition-colors text-left"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{t(`ramadan.quranPlans.${plan.id}`)}</h4>
                            <p className="text-sm text-muted-foreground">
                              {plan.pagesPerDay} {t('ramadan.pagesPerDay')} • {plan.pagesPerPrayer} {t('ramadan.perPrayer')}
                            </p>
                          </div>
                          <ChevronRight className="w-5 h-5 text-muted-foreground" />
                        </div>
                      </button>
                    ))}
                  </div>
                </Card>
              ) : (
                <Card className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-medium">{t(`ramadan.quranPlans.${selectedPlan}`)}</h4>
                      <p className="text-sm text-muted-foreground">
                        {t('ramadan.todayTarget')}: {todayProgress?.target || 20} {t('ramadan.pages')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{todayProgress?.pagesRead || 0}</p>
                      <p className="text-xs text-muted-foreground">{t('ramadan.pagesRead')}</p>
                    </div>
                  </div>
                  
                  {/* Prayer breakdown */}
                  <div className="grid grid-cols-5 gap-2">
                    {['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map((prayer) => {
                      const pagesPerPrayer = KHATAM_PLANS.find(p => p.id === selectedPlan)?.pagesPerPrayer || 4;
                      return (
                        <div key={prayer} className="text-center">
                          <div className={cn(
                            "w-10 h-10 mx-auto rounded-full flex items-center justify-center text-xs font-medium mb-1",
                            "bg-muted text-muted-foreground"
                          )}>
                            {pagesPerPrayer}
                          </div>
                          <p className="text-[10px] text-muted-foreground">{prayer}</p>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              )}
            </div>

            {/* Quick Duas Access */}
            <div>
              <h3 className="text-lg font-semibold mb-3">{t('ramadan.quickDuas')}</h3>
              <div className="grid grid-cols-2 gap-3">
                {RAMADAN_DUAS.filter(d => d.category === 'suhoor' || d.category === 'iftar').slice(0, 2).map((dua) => (
                  <Card 
                    key={dua.id} 
                    className="p-4 cursor-pointer hover:bg-muted/30 transition-colors"
                    onClick={() => setActiveTab('duas')}
                  >
                    <h4 className="font-medium text-sm mb-1">{t(dua.titleKey)}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-2">{dua.arabic}</p>
                  </Card>
                ))}
              </div>
            </div>

            {/* Laylatul Qadr (Last 10 nights) */}
            {phaseInfo.isLastTenNights && (
              <Card className="p-4 bg-gradient-to-br from-warn/10 to-warn/5 border-warn/20">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-warn/20 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-warn" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{t('ramadan.laylatulQadr.title')}</h3>
                    <p className="text-sm text-muted-foreground">{t('ramadan.laylatulQadr.description')}</p>
                  </div>
                </div>
              </Card>
            )}

            {/* I'tikaf */}
            {phaseInfo.isLastTenNights && (
              <Card className="p-4">
                <h3 className="font-semibold mb-2">{t('ramadan.itikaf.title')}</h3>
                <p className="text-sm text-muted-foreground">{t('ramadan.itikaf.description')}</p>
              </Card>
            )}
          </div>
        );

      case 'eid':
        return (
          <div className="space-y-6">
            {/* Eid Guidance */}
            <div>
              <h3 className="text-lg font-semibold mb-3">{t('ramadan.eid.title')}</h3>
              <div className="space-y-3">
                {EID_GUIDANCE.map((item) => (
                  <Card key={item.id} className="p-4">
                    <h4 className="font-medium mb-1">{t(item.titleKey)}</h4>
                    <p className="text-sm text-muted-foreground">{t(item.contentKey)}</p>
                  </Card>
                ))}
              </div>
            </div>

            {/* Reflection Prompts */}
            <Card className="p-4 bg-gradient-to-br from-primary/10 to-primary/5">
              <h3 className="font-semibold mb-3">{t('ramadan.reflection.title')}</h3>
              <p className="text-sm text-muted-foreground italic">"{t('ramadan.reflection.prompt')}"</p>
            </Card>
          </div>
        );

      case 'shawwal':
        return (
          <div className="space-y-6">
            {/* Shawwal Tips */}
            <div>
              <h3 className="text-lg font-semibold mb-3">{t('ramadan.shawwal.title')}</h3>
              <div className="space-y-3">
                {SHAWWAL_TIPS.map((tip) => (
                  <Card key={tip.id} className="p-4">
                    <h4 className="font-medium mb-1">{t(tip.titleKey)}</h4>
                    <p className="text-sm text-muted-foreground">{t(tip.contentKey)}</p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        );
    }
  };

  const renderDuas = () => {
    const categories = [
      { id: 'suhoor', labelKey: 'ramadan.duaCategories.suhoor' },
      { id: 'iftar', labelKey: 'ramadan.duaCategories.iftar' },
      { id: 'laylatul-qadr', labelKey: 'ramadan.duaCategories.laylatulQadr' },
      { id: 'quran', labelKey: 'ramadan.duaCategories.quran' },
      { id: 'hadith', labelKey: 'ramadan.duaCategories.hadith' },
    ];

    return (
      <div className="space-y-6">
        {categories.map((category) => {
          const categoryDuas = RAMADAN_DUAS.filter(d => d.category === category.id);
          if (categoryDuas.length === 0) return null;

          return (
            <div key={category.id}>
              <h3 className="text-lg font-semibold mb-3">{t(category.labelKey)}</h3>
              <div className="space-y-3">
                {categoryDuas.map((dua) => (
                  <Card key={dua.id} className="p-4">
                    <h4 className="font-medium mb-2">{t(dua.titleKey)}</h4>
                    <p className="text-xl font-arabic text-center my-4 leading-loose">{dua.arabic}</p>
                    <p className="text-sm text-muted-foreground italic text-center mb-2">
                      {dua.transliteration}
                    </p>
                    <p className="text-sm text-center mb-2">{t(dua.translationKey)}</p>
                    <p className="text-xs text-muted-foreground text-center">{dua.source}</p>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderFood = () => {
    const categories = [
      { id: 'etiquette', labelKey: 'ramadan.healthCategories.etiquette' },
      { id: 'sunnah', labelKey: 'ramadan.healthCategories.sunnah' },
      { id: 'hydration', labelKey: 'ramadan.healthCategories.hydration' },
      { id: 'health', labelKey: 'ramadan.healthCategories.health' },
      { id: 'mental', labelKey: 'ramadan.healthCategories.mental' },
    ];

    return (
      <div className="space-y-6">
        {categories.map((category) => {
          const categoryTips = HEALTH_TIPS.filter(t => t.category === category.id);
          if (categoryTips.length === 0) return null;

          return (
            <div key={category.id}>
              <h3 className="text-lg font-semibold mb-3">{t(category.labelKey)}</h3>
              <div className="space-y-3">
                {categoryTips.map((tip) => (
                  <Card key={tip.id} className="p-4">
                    <h4 className="font-medium mb-1">{t(tip.titleKey)}</h4>
                    <p className="text-sm text-muted-foreground">{t(tip.contentKey)}</p>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderStories = () => {
    const categories = [
      { id: 'history', labelKey: 'ramadan.storyCategories.history' },
      { id: 'prophets', labelKey: 'ramadan.storyCategories.prophets' },
      { id: 'companions', labelKey: 'ramadan.storyCategories.companions' },
    ];

    return (
      <div className="space-y-6">
        {categories.map((category) => {
          const categoryStories = RAMADAN_STORIES.filter(s => s.category === category.id);
          if (categoryStories.length === 0) return null;

          return (
            <div key={category.id}>
              <h3 className="text-lg font-semibold mb-3">{t(category.labelKey)}</h3>
              <div className="space-y-3">
                {categoryStories.map((story) => (
                  <Card key={story.id} className="p-4">
                    <h4 className="font-medium mb-2">{t(story.titleKey)}</h4>
                    <p className="text-sm text-muted-foreground">{t(story.contentKey)}</p>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background pb-24"
    >
      <TopBar title={t('ramadan.title')} />

      {/* Phase Header */}
      <div className="px-4">
        {renderPhaseHeader()}
      </div>

      {/* Tabs */}
      <div className="px-4 mb-4">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors",
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{t(tab.labelKey)}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'duas' && renderDuas()}
            {activeTab === 'food' && renderFood()}
            {activeTab === 'stories' && renderStories()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Plan Selector Modal */}
      <AnimatePresence>
        {showPlanSelector && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center"
            onClick={() => setShowPlanSelector(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="w-full max-w-lg bg-background rounded-t-3xl p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold mb-4">{t('ramadan.quranPlans.changePlan')}</h3>
              <div className="space-y-3">
                {KHATAM_PLANS.map((plan) => (
                  <button
                    key={plan.id}
                    onClick={() => handleSelectPlan(plan.id)}
                    className={cn(
                      "w-full p-4 rounded-xl border transition-colors text-left flex items-center justify-between",
                      selectedPlan === plan.id 
                        ? "border-primary bg-primary/10" 
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <div>
                      <h4 className="font-medium">{t(`ramadan.quranPlans.${plan.id}`)}</h4>
                      <p className="text-sm text-muted-foreground">
                        {plan.pagesPerDay} {t('ramadan.pagesPerDay')}
                      </p>
                    </div>
                    {selectedPlan === plan.id && (
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav />
    </motion.div>
  );
};

export default Ramadan;
