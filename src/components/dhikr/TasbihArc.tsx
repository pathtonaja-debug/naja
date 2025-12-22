import { motion, useAnimation, PanInfo } from "framer-motion";
import { useEffect, useRef, useState, useCallback } from "react";

interface TasbihArcProps {
  count: number;
  onIncrement: () => void;
  target: number;
}

/**
 * TasbihArc - Realistic misbaha (prayer beads) animation
 * 
 * Arc Math:
 * - Beads are positioned along a semi-circular arc from startAngle to endAngle
 * - Index i maps to angle: startAngle + (i / (totalBeads - 1)) * (endAngle - startAngle)
 * - Angle to position: x = centerX + radius * cos(angle), y = centerY + radius * sin(angle)
 * 
 * Progress Stroke:
 * - SVG arc uses stroke-dasharray and stroke-dashoffset
 * - Completed stroke: dashoffset = arcLength * (1 - progress)
 * - Remaining stroke: dashoffset = arcLength * progress (from other end)
 * 
 * Gesture Handling:
 * - Swipe threshold: 40px horizontal movement
 * - Input locked during animation to prevent double-counts
 * - Animation queued if swipe occurs during active animation
 */

const VISIBLE_BEADS = 11; // Number of beads visible on the arc
const ARC_START_ANGLE = Math.PI * 0.85; // Start from left side
const ARC_END_ANGLE = Math.PI * 0.15; // End at right side
const ARC_RADIUS = 120;
const ARC_CENTER_X = 150;
const ARC_CENTER_Y = 90;
const SWIPE_THRESHOLD = 40;
const ANIMATION_DURATION = 0.28; // 280ms for realistic feel

export function TasbihArc({ count, onIncrement, target }: TasbihArcProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [localCount, setLocalCount] = useState(count);
  const [animatingBeadIndex, setAnimatingBeadIndex] = useState<number | null>(null);
  const pendingSwipeRef = useRef(false);
  const beadControls = useAnimation();

  // Sync local count with prop
  useEffect(() => {
    if (!isAnimating) {
      setLocalCount(count);
    }
  }, [count, isAnimating]);

  /**
   * Maps a bead index to its position on the arc
   * @param index - Bead index (0 to VISIBLE_BEADS - 1)
   * @param offset - Optional offset for animation (0-1 range)
   * @returns {x, y} coordinates
   */
  const getBeadPosition = useCallback((index: number, offset: number = 0): { x: number; y: number } => {
    const totalAngleSpan = ARC_START_ANGLE - ARC_END_ANGLE;
    const angleStep = totalAngleSpan / (VISIBLE_BEADS - 1);
    const angle = ARC_START_ANGLE - (index + offset) * angleStep;
    
    return {
      x: ARC_CENTER_X + ARC_RADIUS * Math.cos(angle),
      y: ARC_CENTER_Y - ARC_RADIUS * Math.sin(angle) + 40, // Offset to center in view
    };
  }, []);

  /**
   * Calculates bead size based on position (larger in center)
   */
  const getBeadSize = useCallback((index: number): number => {
    const center = (VISIBLE_BEADS - 1) / 2;
    const distFromCenter = Math.abs(index - center) / center;
    return 28 - distFromCenter * 10; // 28px at center, 18px at edges
  }, []);

  /**
   * Get the current "active" bead index based on count
   * This is the bead that will animate on next swipe
   */
  const getActiveBeadIndex = useCallback((): number => {
    return localCount % VISIBLE_BEADS;
  }, [localCount]);

  /**
   * Handle swipe gesture completion
   */
  const handleDragEnd = useCallback(async (_: any, info: PanInfo) => {
    if (info.offset.x > SWIPE_THRESHOLD && !isAnimating) {
      setIsAnimating(true);
      const activeIndex = getActiveBeadIndex();
      setAnimatingBeadIndex(activeIndex);

      // Haptic feedback at start
      if (navigator.vibrate) {
        navigator.vibrate(12);
      }

      // Wait for animation to complete
      await new Promise(resolve => setTimeout(resolve, ANIMATION_DURATION * 1000));

      setAnimatingBeadIndex(null);
      setIsAnimating(false);
      onIncrement();

      // Handle queued swipe
      if (pendingSwipeRef.current) {
        pendingSwipeRef.current = false;
        // Small delay before processing queued swipe
        setTimeout(() => {
          handleDragEnd(null, { offset: { x: SWIPE_THRESHOLD + 1, y: 0 } } as PanInfo);
        }, 50);
      }
    } else if (info.offset.x > SWIPE_THRESHOLD && isAnimating) {
      // Queue the swipe for after current animation
      pendingSwipeRef.current = true;
    }
  }, [isAnimating, getActiveBeadIndex, onIncrement]);

  /**
   * Calculate arc path for the string
   */
  const getArcPath = useCallback((): string => {
    const startPos = getBeadPosition(0);
    const endPos = getBeadPosition(VISIBLE_BEADS - 1);
    
    // Create a smooth arc path
    return `M ${startPos.x - 15} ${startPos.y} 
            Q ${ARC_CENTER_X} ${ARC_CENTER_Y + 80} ${endPos.x + 15} ${endPos.y}`;
  }, [getBeadPosition]);

  /**
   * Calculate arc length for stroke animations
   */
  const arcLength = Math.PI * ARC_RADIUS; // Approximate arc length

  /**
   * Progress as a value from 0 to 1
   */
  const progress = Math.min(localCount / target, 1);

  /**
   * Visual progress within current set of beads
   */
  const beadProgress = (localCount % VISIBLE_BEADS) / VISIBLE_BEADS;

  return (
    <div className="relative w-full py-4 overflow-visible select-none touch-pan-y">
      {/* SVG Arc with progress strokes */}
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none" 
        viewBox="0 0 300 160"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Gradient for completed stroke */}
          <linearGradient id="completedGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.8" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.4" />
          </linearGradient>
          
          {/* Gradient for remaining stroke */}
          <linearGradient id="remainingGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--foreground))" stopOpacity="0.15" />
            <stop offset="100%" stopColor="hsl(var(--foreground))" stopOpacity="0.25" />
          </linearGradient>
        </defs>

        {/* Background string (remaining) */}
        <motion.path
          d={getArcPath()}
          fill="none"
          stroke="url(#remainingGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ pathLength: 1 }}
          animate={{ 
            pathLength: 1 - beadProgress,
            pathOffset: beadProgress 
          }}
          transition={{ duration: ANIMATION_DURATION, ease: "easeOut" }}
        />

        {/* Completed string */}
        <motion.path
          d={getArcPath()}
          fill="none"
          stroke="url(#completedGradient)"
          strokeWidth="3.5"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: beadProgress }}
          transition={{ duration: ANIMATION_DURATION, ease: "easeOut" }}
        />
      </svg>

      {/* Draggable bead area */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.15}
        onDragEnd={handleDragEnd}
        className="relative h-32 w-full cursor-grab active:cursor-grabbing"
        whileTap={{ scale: 0.99 }}
      >
        {/* Render beads */}
        {Array.from({ length: VISIBLE_BEADS }).map((_, index) => {
          const isActive = index === animatingBeadIndex;
          const isFilled = index < (localCount % VISIBLE_BEADS) || (localCount > 0 && localCount % VISIBLE_BEADS === 0 && localCount >= VISIBLE_BEADS);
          const pos = getBeadPosition(index);
          const size = getBeadSize(index);
          
          // Calculate if this bead should show as "completed" based on current cycle
          const cycleComplete = Math.floor(localCount / VISIBLE_BEADS);
          const beadsInCurrentCycle = localCount % VISIBLE_BEADS;
          const isCompleted = index < beadsInCurrentCycle;

          return (
            <motion.div
              key={index}
              className="absolute pointer-events-none"
              initial={false}
              animate={{
                left: isActive ? getBeadPosition(index + 1).x - size / 2 : pos.x - size / 2,
                top: isActive ? getBeadPosition(index + 1).y - size / 2 : pos.y - size / 2,
                scale: isActive ? [1, 1.08, 1.02, 1] : isCompleted ? 1.05 : 1,
                rotate: isActive ? [0, 3, -2, 0] : 0,
              }}
              transition={isActive ? {
                duration: ANIMATION_DURATION,
                ease: [0.34, 1.56, 0.64, 1], // Custom spring-like easing with overshoot
                scale: {
                  times: [0, 0.3, 0.7, 1],
                  duration: ANIMATION_DURATION,
                },
                rotate: {
                  times: [0, 0.25, 0.75, 1],
                  duration: ANIMATION_DURATION,
                }
              } : {
                duration: 0.2,
                ease: "easeOut"
              }}
              style={{
                width: size,
                height: size,
                zIndex: isActive ? 10 : VISIBLE_BEADS - Math.abs(index - (VISIBLE_BEADS - 1) / 2),
              }}
            >
              {/* Bead body */}
              <motion.div 
                className="w-full h-full rounded-full"
                animate={{
                  boxShadow: isActive 
                    ? "0 8px 20px rgba(180, 80, 40, 0.5), inset 0 -4px 8px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.25)"
                    : isCompleted
                    ? "0 5px 14px rgba(180, 80, 40, 0.45), inset 0 -4px 8px rgba(0,0,0,0.25), inset 0 2px 4px rgba(255,255,255,0.2)"
                    : "0 3px 10px rgba(150, 100, 60, 0.3), inset 0 -3px 6px rgba(0,0,0,0.2), inset 0 2px 3px rgba(255,255,255,0.15)",
                }}
                style={{
                  background: isCompleted || isActive
                    ? 'linear-gradient(145deg, hsl(25 85% 55%) 0%, hsl(30 75% 38%) 100%)'
                    : 'linear-gradient(145deg, hsl(35 55% 55%) 0%, hsl(28 45% 42%) 100%)',
                }}
                transition={{ duration: 0.15 }}
              >
                {/* Highlight reflection */}
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
                {/* Secondary highlight */}
                <div 
                  className="absolute rounded-full"
                  style={{
                    top: size * 0.55,
                    right: size * 0.15,
                    width: size * 0.15,
                    height: size * 0.12,
                    background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.3) 0%, transparent 70%)',
                  }}
                />
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Swipe indicator */}
      <motion.div 
        className="flex items-center justify-center mt-2 text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: isAnimating ? 0.3 : [0.5, 0.8, 0.5], 
          x: isAnimating ? 0 : [0, 6, 0] 
        }}
        transition={{ 
          duration: 2, 
          repeat: isAnimating ? 0 : Infinity, 
          ease: "easeInOut" 
        }}
      >
        <span className="text-xs mr-1.5">Swipe right to count</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </motion.div>
    </div>
  );
}
