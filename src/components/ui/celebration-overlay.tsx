import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ConfettiPiece {
  id: number;
  x: number;
  delay: number;
  duration: number;
  color: string;
  rotation: number;
}

interface CelebrationOverlayProps {
  isVisible: boolean;
  onComplete?: () => void;
  message?: string;
  subMessage?: string;
}

const pastelColors = [
  'hsl(160, 45%, 75%)', // mint
  'hsl(200, 55%, 80%)', // sky
  'hsl(260, 45%, 80%)', // lavender
  'hsl(350, 50%, 85%)', // rose
  'hsl(45, 65%, 80%)',  // butter
  'hsl(25, 60%, 82%)',  // peach
];

export const CelebrationOverlay: React.FC<CelebrationOverlayProps> = ({
  isVisible,
  onComplete,
  message = 'Amazing!',
  subMessage,
}) => {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (isVisible) {
      // Generate confetti pieces
      const pieces: ConfettiPiece[] = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.5,
        duration: 2 + Math.random() * 2,
        color: pastelColors[Math.floor(Math.random() * pastelColors.length)],
        rotation: Math.random() * 360,
      }));
      setConfetti(pieces);

      // Haptic feedback
      if ('vibrate' in navigator) {
        navigator.vibrate([50, 30, 50]);
      }

      // Complete callback
      const timer = setTimeout(() => {
        onComplete?.();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
        >
          {/* Background overlay */}
          <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" />

          {/* Confetti */}
          <div className="absolute inset-0 overflow-hidden">
            {confetti.map((piece) => (
              <motion.div
                key={piece.id}
                initial={{ 
                  y: -20, 
                  x: `${piece.x}vw`,
                  rotate: 0,
                  opacity: 1 
                }}
                animate={{ 
                  y: '110vh', 
                  rotate: piece.rotation + 720,
                  opacity: 0 
                }}
                transition={{
                  duration: piece.duration,
                  delay: piece.delay,
                  ease: 'linear',
                }}
                style={{ backgroundColor: piece.color }}
                className="absolute w-3 h-3 rounded-sm"
              />
            ))}
          </div>

          {/* Center message */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ 
              type: 'spring',
              stiffness: 300,
              damping: 20,
              delay: 0.2 
            }}
            className="relative z-10 text-center"
          >
            <motion.h1
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-display text-foreground mb-2"
            >
              {message}
            </motion.h1>
            {subMessage && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-headline text-muted-foreground"
              >
                {subMessage}
              </motion.p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
