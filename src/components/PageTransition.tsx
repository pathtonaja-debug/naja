/**
 * Page transition wrapper with slide animations
 * Provides native-like navigation transitions
 */
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { getNavigationDirection, setNavigationDirection } from '@/hooks/useScrollPersistence';

interface PageTransitionProps {
  children: React.ReactNode;
}

const slideVariants = {
  // Forward navigation: new page slides in from right
  enterForward: {
    x: '100%',
    opacity: 0,
  },
  // Back navigation: page slides in from left
  enterBack: {
    x: '-30%',
    opacity: 0,
  },
  center: {
    x: 0,
    opacity: 1,
  },
  // Forward navigation: current page slides to left
  exitForward: {
    x: '-30%',
    opacity: 0,
  },
  // Back navigation: current page slides to right
  exitBack: {
    x: '100%',
    opacity: 0,
  },
};

export function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation();
  const direction = getNavigationDirection();

  // Reset direction to forward after each navigation
  const handleAnimationComplete = () => {
    setNavigationDirection('forward');
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname + location.search}
        initial={direction === 'back' ? 'enterBack' : 'enterForward'}
        animate="center"
        exit={direction === 'back' ? 'exitBack' : 'exitForward'}
        variants={slideVariants}
        transition={{
          type: 'spring',
          stiffness: 380,
          damping: 35,
          mass: 0.8,
        }}
        onAnimationComplete={handleAnimationComplete}
        className="min-h-screen"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
