import { motion, PanInfo } from "framer-motion";
import { useEffect, useState } from "react";

interface BeadsAnimationProps {
  count: number;
  onIncrement: () => void;
  target: number;
}

const BEAD_COUNT = 11;

export function BeadsAnimation({ count, onIncrement, target }: BeadsAnimationProps) {
  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.x > 30) {
      onIncrement();
      if (navigator.vibrate) {
        navigator.vibrate(15);
      }
    }
  };

  return (
    <div className="relative w-full py-6 overflow-visible">
      {/* Arc path visualization */}
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none" 
        viewBox="0 0 300 120"
        preserveAspectRatio="xMidYMid meet"
      >
        <path
          d="M -20 60 Q 150 120 320 60"
          fill="none"
          stroke="hsl(var(--foreground) / 0.2)"
          strokeWidth="2"
          strokeDasharray="6 3"
        />
      </svg>

      {/* Draggable beads container */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        className="relative flex items-center justify-center cursor-grab active:cursor-grabbing select-none touch-pan-y"
      >
        <div className="relative h-24 w-full flex items-end justify-center">
          {Array.from({ length: BEAD_COUNT }).map((_, index) => {
            const normalizedPos = (index / (BEAD_COUNT - 1)) - 0.5;
            const xPos = normalizedPos * 240;
            const yPos = Math.pow(normalizedPos * 2, 2) * 30;
            const distFromCenter = Math.abs(normalizedPos);
            const size = 32 - distFromCenter * 14;
            const beadsFilled = Math.floor((count % BEAD_COUNT));
            const isFilled = index <= beadsFilled;
            
            return (
              <div
                key={index}
                className="absolute transition-transform duration-200"
                style={{
                  left: `calc(50% + ${xPos}px)`,
                  bottom: `${yPos + 12}px`,
                  width: size,
                  height: size,
                  marginLeft: -size / 2,
                  transform: isFilled ? 'translateY(-3px) scale(1.05)' : 'translateY(0) scale(1)',
                }}
              >
                <div 
                  className="w-full h-full rounded-full transition-all duration-200 shadow-md"
                  style={{
                    background: isFilled 
                      ? 'linear-gradient(135deg, hsl(25 85% 55%) 0%, hsl(30 75% 40%) 100%)'
                      : 'linear-gradient(135deg, hsl(35 60% 55%) 0%, hsl(25 50% 45%) 100%)',
                    boxShadow: isFilled 
                      ? '0 4px 16px rgba(180, 80, 40, 0.5), inset 0 -4px 8px rgba(0,0,0,0.25), inset 0 2px 4px rgba(255,255,255,0.2)'
                      : '0 3px 10px rgba(150, 100, 60, 0.35), inset 0 -3px 6px rgba(0,0,0,0.2), inset 0 2px 3px rgba(255,255,255,0.15)',
                  }}
                >
                  <div 
                    className="absolute top-1 left-1.5 w-2.5 h-2.5 rounded-full"
                    style={{
                      background: 'radial-gradient(circle, rgba(255,255,255,0.7) 0%, transparent 70%)',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Static swipe indicator */}
      <div className="flex items-center justify-center mt-4 text-muted-foreground opacity-60">
        <span className="text-xs mr-1.5">Swipe right to count</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </div>
    </div>
  );
}
