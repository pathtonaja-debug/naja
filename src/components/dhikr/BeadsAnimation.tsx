import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { useEffect, useState } from "react";

interface BeadsAnimationProps {
  count: number;
  onIncrement: () => void;
  target: number;
}

const BEAD_COUNT = 11;

export function BeadsAnimation({ count, onIncrement, target }: BeadsAnimationProps) {
  const x = useMotionValue(0);
  const [beadPositions, setBeadPositions] = useState<number[]>([]);
  
  // Generate bead positions along an arc
  useEffect(() => {
    const positions: number[] = [];
    for (let i = 0; i < BEAD_COUNT; i++) {
      positions.push(i);
    }
    setBeadPositions(positions);
  }, []);

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.x > 30) {
      onIncrement();
      // Haptic feedback
      if (navigator.vibrate) {
        navigator.vibrate(15);
      }
    }
    x.set(0);
  };

  const progress = Math.min((count / target) * 100, 100);

  return (
    <div className="relative w-full py-4 overflow-hidden">
      {/* Arc path visualization */}
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none" 
        viewBox="0 0 300 100"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* String/cord */}
        <path
          d="M -20 50 Q 150 100 320 50"
          fill="none"
          stroke="hsl(25 15% 30%)"
          strokeWidth="1.5"
          strokeDasharray="4 2"
          opacity="0.4"
        />
      </svg>

      {/* Draggable beads container */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        style={{ x }}
        className="relative flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
      >
        <div className="relative h-20 w-full flex items-end justify-center">
          {beadPositions.map((_, index) => {
            // Calculate position along arc
            const normalizedPos = (index / (BEAD_COUNT - 1)) - 0.5;
            const xPos = normalizedPos * 260;
            const yPos = Math.pow(normalizedPos * 2, 2) * 25;
            
            // Size varies - larger in center
            const distFromCenter = Math.abs(normalizedPos);
            const size = 28 - distFromCenter * 12;
            
            // Color intensity based on count
            const beadsFilled = Math.floor((count % BEAD_COUNT));
            const isFilled = index <= beadsFilled;
            
            return (
              <motion.div
                key={index}
                className="absolute"
                style={{
                  left: `calc(50% + ${xPos}px)`,
                  bottom: `${yPos + 10}px`,
                  width: size,
                  height: size,
                }}
                initial={{ scale: 0.8 }}
                animate={{ 
                  scale: isFilled ? 1.05 : 1,
                  y: isFilled ? -2 : 0 
                }}
                transition={{ 
                  type: "spring", 
                  stiffness: 400, 
                  damping: 25 
                }}
              >
                {/* Bead */}
                <div 
                  className="w-full h-full rounded-full transition-colors duration-300"
                  style={{
                    background: isFilled 
                      ? 'linear-gradient(135deg, hsl(25 85% 55%) 0%, hsl(30 75% 45%) 100%)'
                      : 'linear-gradient(135deg, hsl(35 80% 60%) 0%, hsl(25 70% 50%) 100%)',
                    boxShadow: isFilled 
                      ? '0 4px 12px rgba(200, 100, 50, 0.4), inset 0 -3px 6px rgba(0,0,0,0.2)'
                      : '0 2px 8px rgba(200, 120, 60, 0.3), inset 0 -2px 4px rgba(0,0,0,0.15)',
                  }}
                >
                  {/* Highlight */}
                  <div 
                    className="absolute top-1 left-1 w-2 h-2 rounded-full opacity-60"
                    style={{
                      background: 'radial-gradient(circle, white 0%, transparent 70%)',
                    }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Swipe indicator */}
      <motion.div 
        className="flex items-center justify-center mt-2 text-foreground-muted"
        initial={{ opacity: 0.5 }}
        animate={{ opacity: [0.5, 1, 0.5], x: [0, 5, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="text-[10px] mr-1">Swipe right to count</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </motion.div>
    </div>
  );
}
