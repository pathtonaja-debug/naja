import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, X, CheckCircle2, Compass } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

const TOUR_FLAG = 'naja_hasSeenOnboarding';

export function hasSeenOnboarding(): boolean {
  try {
    return localStorage.getItem(TOUR_FLAG) === 'true';
  } catch {
    return false;
  }
}

export function markOnboardingSeen(): void {
  try {
    localStorage.setItem(TOUR_FLAG, 'true');
  } catch { /* */ }
}

export function resetOnboardingFlag(): void {
  try {
    localStorage.removeItem(TOUR_FLAG);
  } catch { /* */ }
}

interface TourStep {
  target: string; // data-tour attribute value
  title: string;
  description: string;
  openPlusMenu?: boolean;
  closePlusMenu?: boolean;
}

interface SpotlightRect {
  top: number;
  left: number;
  width: number;
  height: number;
  borderRadius: number;
}

interface OnboardingTourProps {
  onComplete: () => void;
}

export const OnboardingTour = ({ onComplete }: OnboardingTourProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [phase, setPhase] = useState<'welcome' | 'tour' | 'complete'>('welcome');
  const [stepIndex, setStepIndex] = useState(0);
  const [spotlight, setSpotlight] = useState<SpotlightRect | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ top: number; left: number; arrowSide: 'top' | 'bottom' }>({ top: 0, left: 0, arrowSide: 'top' });
  const overlayRef = useRef<HTMLDivElement>(null);

  const steps: TourStep[] = [
    {
      target: 'nav-home',
      title: t('tour.step1.title', 'Your Home Dashboard'),
      description: t('tour.step1.desc', 'This is your main hub. See your daily progress, upcoming reminders, and a summary of your activity at a glance.'),
    },
    {
      target: 'nav-practices',
      title: t('tour.step2.title', 'Your Daily Practices'),
      description: t('tour.step2.desc', 'Track prayers, daily acts, and spiritual habits. Everything you practice daily lives here for quick access.'),
    },
    {
      target: 'nav-plus',
      title: t('tour.step3.title', 'Quick Actions'),
      description: t('tour.step3.desc', 'Tap the + button at any time to instantly jump to any feature in the app — from anywhere you are.'),
    },
    {
      target: 'plus-panel',
      title: t('tour.step4.title', 'Your Feature Menu'),
      description: t('tour.step4.desc', 'All features are organised here into three categories: Worship, Growth, and Tools. Tap any item to go straight to it.'),
      openPlusMenu: true,
    },
    {
      target: 'plus-category-worship',
      title: t('tour.step5.title', 'Worship Features'),
      description: t('tour.step5.desc', 'Access the Quran, track your Dhikr, and manage your personal Dua list — all in one place.'),
    },
    {
      target: 'plus-category-growth',
      title: t('tour.step6.title', 'Personal Growth'),
      description: t('tour.step6.desc', 'Journal your reflections, set meaningful goals, and explore curated learning content to grow every day.'),
    },
    {
      target: 'plus-category-tools',
      title: t('tour.step7.title', 'Practical Tools'),
      description: t('tour.step7.desc', 'Use the Islamic dates converter, explore ethical finance guidance, and plan your Pilgrimage journey.'),
    },
    {
      target: 'nav-ramadan',
      title: t('tour.step8.title', 'Ramadan Hub'),
      description: t('tour.step8.desc', 'Access Ramadan-specific features, fasting trackers, and night prayer tools from here.'),
      closePlusMenu: true,
    },
    {
      target: 'nav-profile',
      title: t('tour.step9.title', 'Your Profile & Settings'),
      description: t('tour.step9.desc', 'Manage your account, customise your experience, and adjust app settings. You can also restart this tour here at any time.'),
    },
  ];

  const currentStep = steps[stepIndex];

  const measureElement = useCallback((targetAttr: string): SpotlightRect | null => {
    const el = document.querySelector(`[data-tour="${targetAttr}"]`);
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    const padding = 6;
    const style = window.getComputedStyle(el);
    const br = parseFloat(style.borderRadius) || 12;
    return {
      top: rect.top - padding,
      left: rect.left - padding,
      width: rect.width + padding * 2,
      height: rect.height + padding * 2,
      borderRadius: br + padding,
    };
  }, []);

  const positionTooltip = useCallback((spot: SpotlightRect) => {
    const tooltipW = Math.min(320, window.innerWidth - 32);
    const tooltipH = 180;
    const margin = 12;
    let top: number;
    let arrowSide: 'top' | 'bottom';

    // Prefer placing above the spotlight
    if (spot.top - tooltipH - margin > 16) {
      top = spot.top - tooltipH - margin;
      arrowSide = 'bottom';
    } else {
      top = spot.top + spot.height + margin;
      arrowSide = 'top';
    }

    // Clamp
    top = Math.max(16, Math.min(top, window.innerHeight - tooltipH - 16));

    const left = Math.max(16, Math.min(
      spot.left + spot.width / 2 - tooltipW / 2,
      window.innerWidth - tooltipW - 16
    ));

    setTooltipPos({ top, left, arrowSide });
  }, []);

  // Navigate to step
  const goToStep = useCallback((idx: number) => {
    const step = steps[idx];
    if (!step) return;

    // Close plus menu if needed
    if (step.closePlusMenu) {
      window.dispatchEvent(new CustomEvent('naja-tour-plus', { detail: { open: false } }));
      // Wait for close animation
      setTimeout(() => {
        setStepIndex(idx);
      }, 200);
      return;
    }

    // Open plus menu if needed
    if (step.openPlusMenu) {
      window.dispatchEvent(new CustomEvent('naja-tour-plus', { detail: { open: true } }));
      // Wait for open animation
      setTimeout(() => {
        setStepIndex(idx);
      }, 250);
      return;
    }

    setStepIndex(idx);
  }, [steps]);

  // Measure and position on step change
  useEffect(() => {
    if (phase !== 'tour') return;

    const measure = () => {
      const rect = measureElement(currentStep.target);
      if (rect) {
        setSpotlight(rect);
        positionTooltip(rect);
      }
    };

    // Small delay for DOM updates
    const timer = setTimeout(measure, 100);
    return () => clearTimeout(timer);
  }, [phase, stepIndex, currentStep, measureElement, positionTooltip]);

  const handleNext = () => {
    if (stepIndex < steps.length - 1) {
      goToStep(stepIndex + 1);
    } else {
      // Close plus menu if open
      window.dispatchEvent(new CustomEvent('naja-tour-plus', { detail: { open: false } }));
      setPhase('complete');
    }
  };

  const handleBack = () => {
    if (stepIndex > 0) {
      goToStep(stepIndex - 1);
    }
  };

  const handleSkip = () => {
    window.dispatchEvent(new CustomEvent('naja-tour-plus', { detail: { open: false } }));
    markOnboardingSeen();
    onComplete();
  };

  const handleFinish = () => {
    markOnboardingSeen();
    navigate('/dashboard', { replace: true });
    onComplete();
  };

  // Welcome screen
  if (phase === 'welcome') {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-background/85 backdrop-blur-md p-4"
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="w-full max-w-sm bg-card rounded-3xl border border-border shadow-2xl overflow-hidden"
          >
            <div className="p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary/15 flex items-center justify-center">
                <Compass className="w-10 h-10 text-primary" />
              </div>

              <h1 className="text-2xl font-bold text-foreground mb-2">
                {t('tour.welcome.title', 'Welcome to the app')}
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed mb-8">
                {t('tour.welcome.desc', "Let's take a quick tour so you know exactly where everything is and how to get the most out of it.")}
              </p>

              <button
                onClick={() => setPhase('tour')}
                className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground text-sm font-semibold transition-colors hover:bg-primary/90"
              >
                {t('tour.welcome.start', 'Start Tour')}
              </button>

              <button
                onClick={handleSkip}
                className="mt-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {t('tour.welcome.skip', 'Skip for now')}
              </button>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // Completion screen
  if (phase === 'complete') {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-background/85 backdrop-blur-md p-4"
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="w-full max-w-sm bg-card rounded-3xl border border-border shadow-2xl overflow-hidden"
          >
            <div className="p-8 text-center">
              <motion.div
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="w-20 h-20 mx-auto mb-6 rounded-full bg-success/15 flex items-center justify-center"
              >
                <CheckCircle2 className="w-10 h-10 text-success" />
              </motion.div>

              <h1 className="text-2xl font-bold text-foreground mb-2">
                {t('tour.complete.title', "You're all set!")}
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed mb-8">
                {t('tour.complete.desc', 'You now know your way around. Tap below to start your journey.')}
              </p>

              <button
                onClick={handleFinish}
                className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground text-sm font-semibold transition-colors hover:bg-primary/90"
              >
                {t('tour.complete.button', 'Get Started')}
              </button>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // Tour overlay with spotlight
  return (
    <div ref={overlayRef} className="fixed inset-0 z-[200]" style={{ pointerEvents: 'auto' }}>
      {/* SVG overlay with cutout */}
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ pointerEvents: 'none' }}
      >
        <defs>
          <mask id="tour-spotlight-mask">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {spotlight && (
              <rect
                x={spotlight.left}
                y={spotlight.top}
                width={spotlight.width}
                height={spotlight.height}
                rx={spotlight.borderRadius}
                ry={spotlight.borderRadius}
                fill="black"
              />
            )}
          </mask>
        </defs>
        <rect
          x="0" y="0"
          width="100%" height="100%"
          fill="rgba(0,0,0,0.7)"
          mask="url(#tour-spotlight-mask)"
        />
      </svg>

      {/* Spotlight glow ring */}
      {spotlight && (
        <div
          className="absolute pointer-events-none rounded-[inherit] ring-2 ring-primary/40 shadow-[0_0_20px_4px_hsl(var(--primary)/0.2)]"
          style={{
            top: spotlight.top,
            left: spotlight.left,
            width: spotlight.width,
            height: spotlight.height,
            borderRadius: spotlight.borderRadius,
            transition: 'all 0.25s ease-out',
          }}
        />
      )}

      {/* Click blocker (allows clicking highlighted element's area to pass through) */}
      <div
        className="absolute inset-0"
        onClick={(e) => {
          // Block clicks on overlay, don't propagate
          e.stopPropagation();
        }}
        style={{ pointerEvents: 'auto' }}
      />

      {/* Tooltip card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={stepIndex}
          initial={{ opacity: 0, y: tooltipPos.arrowSide === 'top' ? -8 : 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="fixed z-[201]"
          style={{
            top: tooltipPos.top,
            left: tooltipPos.left,
            width: Math.min(320, window.innerWidth - 32),
            pointerEvents: 'auto',
          }}
        >
          <div className="bg-card rounded-2xl border border-border shadow-xl p-5">
            {/* Step counter + skip */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-muted-foreground">
                {t('tour.stepOf', { current: stepIndex + 1, total: steps.length })}
              </span>
              <button
                onClick={handleSkip}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {t('tour.skipTour', 'Skip tour')}
              </button>
            </div>

            {/* Content */}
            <h3 className="text-base font-bold text-foreground mb-1.5">
              {currentStep.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              {currentStep.description}
            </p>

            {/* Navigation buttons */}
            <div className="flex items-center gap-2">
              {stepIndex > 0 && (
                <button
                  onClick={handleBack}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  {t('common.back', 'Back')}
                </button>
              )}
              <div className="flex-1" />
              <button
                onClick={handleNext}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium transition-colors hover:bg-primary/90"
              >
                {stepIndex < steps.length - 1
                  ? t('common.next', 'Next')
                  : t('tour.finish', 'Finish')}
                {stepIndex < steps.length - 1 && <ArrowRight className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
