/**
 * Page transition wrapper with fast slide animations
 * Provides native-like navigation transitions
 */
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { getNavigationDirection, setNavigationDirection } from '@/hooks/useScrollPersistence';

interface PageTransitionProps {
  children: React.ReactNode;
}

const slideVariants = {
  enterForward: { x: '60%', opacity: 0 },
  enterBack: { x: '-15%', opacity: 0 },
  center: { x: 0, opacity: 1 },
  exitForward: { x: '-15%', opacity: 0 },
  exitBack: { x: '60%', opacity: 0 },
};

export function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation();
  const direction = getNavigationDirection();

  const handleAnimationComplete = () => {
    setNavigationDirection('forward');
  };

  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.div
        key={location.pathname + location.search}
        initial={direction === 'back' ? 'enterBack' : 'enterForward'}
        animate="center"
        exit={direction === 'back' ? 'exitBack' : 'exitForward'}
        variants={slideVariants}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        onAnimationComplete={handleAnimationComplete}
        className="min-h-screen"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
