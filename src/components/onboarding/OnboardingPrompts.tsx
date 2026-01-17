import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Star, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  isNewUser, 
  getOnboardingState, 
  updateOnboardingState,
  dismissPrompt,
  isPromptDismissed 
} from '@/services/dailyProgressService';

interface WelcomePromptProps {
  onDismiss?: () => void;
}

export const WelcomePrompt = ({ onDismiss }: WelcomePromptProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const onboarding = getOnboardingState();
    if (!onboarding.hasSeenWelcome) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    updateOnboardingState({ hasSeenWelcome: true });
    setIsVisible(false);
    onDismiss?.();
  };

  const handleGetStarted = () => {
    updateOnboardingState({ hasSeenWelcome: true });
    setIsVisible(false);
    navigate('/practices');
  };

  const steps = [
    {
      icon: <Star className="w-8 h-8" />,
      title: t('onboarding.welcome.title'),
      description: t('onboarding.welcome.description'),
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: t('onboarding.earnPoints.title'),
      description: t('onboarding.earnPoints.description'),
    },
    {
      icon: <CheckCircle2 className="w-8 h-8" />,
      title: t('onboarding.firstAct.title'),
      description: t('onboarding.firstAct.description'),
    },
  ];

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-sm bg-card rounded-3xl border border-border shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="relative p-6 pb-4 bg-gradient-to-br from-primary/10 to-secondary/10">
            <button
              onClick={handleDismiss}
              className="absolute top-4 right-4 p-2 rounded-full bg-background/50 hover:bg-background/80 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center text-primary">
                {steps[step].icon}
              </div>
            </div>
            
            <h2 className="text-xl font-bold text-center text-foreground">
              {steps[step].title}
            </h2>
          </div>

          {/* Content */}
          <div className="p-6">
            <p className="text-sm text-muted-foreground text-center mb-6">
              {steps[step].description}
            </p>

            {/* Step indicators */}
            <div className="flex justify-center gap-2 mb-6">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all",
                    i === step ? "w-6 bg-primary" : "bg-muted"
                  )}
                />
              ))}
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              {step < steps.length - 1 ? (
                <>
                  <button
                    onClick={handleDismiss}
                    className="flex-1 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
                  >
                    {t('common.skip')}
                  </button>
                  <button
                    onClick={() => setStep(s => s + 1)}
                    className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-medium flex items-center justify-center gap-2"
                  >
                    {t('common.next')} <ArrowRight className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <button
                  onClick={handleGetStarted}
                  className="w-full py-3 rounded-xl bg-primary text-primary-foreground text-sm font-medium"
                >
                  {t('onboarding.getStarted')}
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Inline prompt for dashboard
interface FirstActPromptProps {
  className?: string;
}

export const FirstActPrompt = ({ className }: FirstActPromptProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const onboarding = getOnboardingState();
    // Show if user hasn't completed first act and hasn't dismissed this prompt
    if (!onboarding.hasCompletedFirstAct && !isPromptDismissed('first-act')) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    dismissPrompt('first-act');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={cn(
        "p-4 rounded-2xl bg-gradient-to-br from-success/10 to-success/5 border border-success/20",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-success/20 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-5 h-5 text-success" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm text-foreground">
            {t('onboarding.firstActPrompt.title')}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            {t('onboarding.firstActPrompt.description')}
          </p>
          <button
            onClick={() => navigate('/practices')}
            className="mt-3 px-4 py-2 rounded-xl bg-success text-success-foreground text-xs font-medium"
          >
            {t('onboarding.firstActPrompt.button')}
          </button>
        </div>
        <button
          onClick={handleDismiss}
          className="p-1 rounded-full hover:bg-muted transition-colors"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>
    </motion.div>
  );
};

// Celebration for first act completed
interface FirstActCelebrationProps {
  pointsEarned: number;
  onClose: () => void;
}

export const FirstActCelebration = ({ pointsEarned, onClose }: FirstActCelebrationProps) => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1, rotate: [0, -5, 5, 0] }}
          exit={{ scale: 0.5, opacity: 0 }}
          className="text-center"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0]
            }}
            transition={{ duration: 0.6, repeat: 2 }}
            className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-success to-success/50 flex items-center justify-center shadow-lg shadow-success/30"
          >
            <Star className="w-12 h-12 text-success-foreground" />
          </motion.div>
          
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold text-foreground mb-2"
          >
            {t('onboarding.firstActComplete.title')}
          </motion.h2>
          
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-lg text-success font-semibold mb-2"
          >
            +{pointsEarned} {t('dashboard.barakahPoints')}
          </motion.p>
          
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-sm text-muted-foreground"
          >
            {t('onboarding.firstActComplete.description')}
          </motion.p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
