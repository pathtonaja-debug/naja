import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Moon, ChevronRight, Sparkles, Star } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { getRamadanPhase, getNextRamadanDate, type PhaseInfo } from '@/services/ramadanState';

export function RamadanCountdown() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [phaseInfo, setPhaseInfo] = useState<PhaseInfo | null>(null);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const updatePhase = () => {
      setPhaseInfo(getRamadanPhase());
    };
    
    updatePhase();
    // Update phase daily
    const phaseInterval = setInterval(updatePhase, 60 * 60 * 1000);
    
    return () => clearInterval(phaseInterval);
  }, []);

  useEffect(() => {
    if (!phaseInfo || phaseInfo.phase !== 'preparing') return;

    const updateCountdown = () => {
      const now = new Date();
      const ramadanStart = getNextRamadanDate();
      const diff = ramadanStart.getTime() - now.getTime();

      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setCountdown({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [phaseInfo]);

  if (!phaseInfo) return null;

  const renderContent = () => {
    switch (phaseInfo.phase) {
      case 'preparing':
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <Moon className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{t('ramadan.widget.preparing')}</h3>
                <p className="text-sm text-muted-foreground">
                  {t('ramadan.countdownTo')}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
            
            {/* Countdown Timer */}
            <div className="grid grid-cols-4 gap-2">
              {[
                { value: countdown.days, labelKey: 'ramadan.days' },
                { value: countdown.hours, labelKey: 'ramadan.hours' },
                { value: countdown.minutes, labelKey: 'ramadan.minutes' },
                { value: countdown.seconds, labelKey: 'ramadan.seconds' },
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="bg-muted rounded-lg py-2 px-1">
                    <span className="text-xl font-bold tabular-nums">
                      {String(item.value).padStart(2, '0')}
                    </span>
                  </div>
                  <span className="text-[10px] text-muted-foreground mt-1 block">
                    {t(item.labelKey)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'active':
        return (
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center",
              phaseInfo.isLastTenNights ? "bg-warn/20" : "bg-success/20"
            )}>
              {phaseInfo.isLastTenNights ? (
                <Sparkles className="w-6 h-6 text-warn" />
              ) : (
                <Moon className="w-6 h-6 text-success" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">
                {phaseInfo.isLastTenNights 
                  ? t('ramadan.widget.lastTenNights') 
                  : t('ramadan.widget.active')}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t('ramadan.dayOf', { day: phaseInfo.currentDayOfRamadan })}
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </div>
        );
      
      case 'eid':
        return (
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-warn/20 flex items-center justify-center">
              <Star className="w-6 h-6 text-warn" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">{t('ramadan.eidMubarak')}</h3>
              <p className="text-sm text-muted-foreground">{t('ramadan.widget.eid')}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </div>
        );
      
      case 'shawwal':
        return (
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center">
              <Moon className="w-6 h-6 text-secondary-foreground" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">{t('ramadan.widget.shawwal')}</h3>
              <p className="text-sm text-muted-foreground">{t('ramadan.widget.sixFasts')}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
    >
      <Card 
        className={cn(
          "p-4 cursor-pointer hover:bg-muted/30 transition-colors",
          phaseInfo.phase === 'active' && phaseInfo.isLastTenNights && "bg-gradient-to-br from-warn/10 to-warn/5 border-warn/20",
          phaseInfo.phase === 'eid' && "bg-gradient-to-br from-warn/10 to-warn/5 border-warn/20"
        )}
        onClick={() => navigate('/ramadan')}
      >
        {renderContent()}
      </Card>
    </motion.div>
  );
}
