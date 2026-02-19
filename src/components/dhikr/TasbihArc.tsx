import { motion, PanInfo } from "framer-motion";
import { useEffect, useRef, useState, useCallback } from "react";

interface TasbihArcProps {
  count: number;
  onIncrement: () => void;
  target: number;
}

const VISIBLE_BEADS = 11;
const ARC_START_ANGLE = Math.PI * 0.85;
const ARC_END_ANGLE = Math.PI * 0.15;
const ARC_RADIUS = 120;
const ARC_CENTER_X = 150;
const ARC_CENTER_Y = 90;
const SWIPE_THRESHOLD = 40;

export function TasbihArc({ count, onIncrement, target }: TasbihArcProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [localCount, setLocalCount] = useState(count);
  const pendingSwipeRef = useRef(false);

  useEffect(() => {
    if (!isAnimating) {
      setLocalCount(count);
    }
  }, [count, isAnimating]);

  const getBeadPosition = useCallback((index: number): { x: number; y: number } => {
    const totalAngleSpan = ARC_START_ANGLE - ARC_END_ANGLE;
    const angleStep = totalAngleSpan / (VISIBLE_BEADS - 1);
    const angle = ARC_START_ANGLE - index * angleStep;
    
    return {
      x: ARC_CENTER_X + ARC_RADIUS * Math.cos(angle),
      y: ARC_CENTER_Y - ARC_RADIUS * Math.sin(angle) + 40,
    };
  }, []);

  const getBeadSize = useCallback((index: number): number => {
    const center = (VISIBLE_BEADS - 1) / 2;
    const distFromCenter = Math.abs(index - center) / center;
    return 28 - distFromCenter * 10;
  }, []);

  const handleDragEnd = useCallback(async (_: any, info: PanInfo) => {
    if (info.offset.x > SWIPE_THRESHOLD && !isAnimating) {
      setIsAnimating(true);

      if (navigator.vibrate) {
        navigator.vibrate(12);
      }

      await new Promise(resolve => setTimeout(resolve, 200));

      setIsAnimating(false);
      onIncrement();

      if (pendingSwipeRef.current) {
        pendingSwipeRef.current = false;
        setTimeout(() => {
          handleDragEnd(null, { offset: { x: SWIPE_THRESHOLD + 1, y: 0 } } as PanInfo);
        }, 50);
      }
    } else if (info.offset.x > SWIPE_THRESHOLD && isAnimating) {
      pendingSwipeRef.current = true;
    }
  }, [isAnimating, onIncrement]);

  const getArcPath = useCallback((): string => {
    const startPos = getBeadPosition(0);
    const endPos = getBeadPosition(VISIBLE_BEADS - 1);
    
    return `M ${startPos.x - 15} ${startPos.y} 
            Q ${ARC_CENTER_X} ${ARC_CENTER_Y + 80} ${endPos.x + 15} ${endPos.y}`;
  }, [getBeadPosition]);

  const beadProgress = (localCount % VISIBLE_BEADS) / VISIBLE_BEADS;

  return (
    <div className="relative w-full py-4 overflow-visible select-none touch-pan-y">
      {/* SVG Arc */}
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none" 
        viewBox="0 0 300 160"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="completedGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.8" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id="remainingGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--foreground))" stopOpacity="0.15" />
            <stop offset="100%" stopColor="hsl(var(--foreground))" stopOpacity="0.25" />
          </linearGradient>
        </defs>

        {/* Background string */}
        <path
          d={getArcPath()}
          fill="none"
          stroke="url(#remainingGradient)"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Completed string */}
        <path
          d={getArcPath()}
          fill="none"
          stroke="url(#completedGradient)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray={`${Math.PI * ARC_RADIUS}`}
          strokeDashoffset={`${Math.PI * ARC_RADIUS * (1 - beadProgress)}`}
          className="transition-all duration-200 ease-out"
        />
      </svg>

      {/* Draggable bead area */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.15}
        onDragEnd={handleDragEnd}
        className="relative h-32 w-full cursor-grab active:cursor-grabbing"
      >
        {Array.from({ length: VISIBLE_BEADS }).map((_, index) => {
          const pos = getBeadPosition(index);
          const size = getBeadSize(index);
          const beadsInCurrentCycle = localCount % VISIBLE_BEADS;
          const isCompleted = index < beadsInCurrentCycle;

          return (
            <div
              key={index}
              className="absolute pointer-events-none transition-transform duration-200 ease-out"
              style={{
                left: pos.x - size / 2,
                top: pos.y - size / 2,
                width: size,
                height: size,
                transform: isCompleted ? 'scale(1.05)' : 'scale(1)',
                zIndex: VISIBLE_BEADS - Math.abs(index - (VISIBLE_BEADS - 1) / 2),
              }}
            >
              <div 
                className="w-full h-full rounded-full transition-all duration-200"
                style={{
                  background: isCompleted
                    ? 'linear-gradient(145deg, hsl(25 85% 55%) 0%, hsl(30 75% 38%) 100%)'
                    : 'linear-gradient(145deg, hsl(35 55% 55%) 0%, hsl(28 45% 42%) 100%)',
                  boxShadow: isCompleted
                    ? '0 5px 14px rgba(180, 80, 40, 0.45), inset 0 -4px 8px rgba(0,0,0,0.25), inset 0 2px 4px rgba(255,255,255,0.2)'
                    : '0 3px 10px rgba(150, 100, 60, 0.3), inset 0 -3px 6px rgba(0,0,0,0.2), inset 0 2px 3px rgba(255,255,255,0.15)',
                }}
              >
                <div 
                  className="absolute rounded-full"
                  style={{
                    top: size * 0.12,
                    left: size * 0.18,
                    width: size * 0.3,
                    height: size * 0.25,
                    background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.6) 0%, transparent 70%)',
                  }}
                />
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* Static swipe indicator */}
      <div className="flex items-center justify-center mt-2 text-muted-foreground opacity-50">
        <span className="text-xs mr-1.5">Swipe right to count</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </div>
    </div>
  );
}
