/**
 * Hook for enabling swipe-from-left-edge gesture to go back
 * Similar to iOS native navigation behavior
 */
import { useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { setNavigationDirection } from './useScrollPersistence';

interface SwipeBackOptions {
  edgeThreshold?: number; // How close to left edge to start (px)
  swipeThreshold?: number; // Minimum distance to trigger back (px)
  enabled?: boolean;
}

export function useSwipeBack(options: SwipeBackOptions = {}) {
  const {
    edgeThreshold = 30,
    swipeThreshold = 80,
    enabled = true,
  } = options;

  const navigate = useNavigate();
  const touchStartRef = useRef<{ x: number; y: number; valid: boolean } | null>(null);
  const swipeIndicatorRef = useRef<HTMLDivElement | null>(null);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (!enabled) return;
    
    const touch = e.touches[0];
    // Only trigger if starting from left edge
    if (touch.clientX <= edgeThreshold) {
      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        valid: true,
      };
      
      // Create swipe indicator
      if (!swipeIndicatorRef.current) {
        const indicator = document.createElement('div');
        indicator.className = 'swipe-back-indicator';
        indicator.style.cssText = `
          position: fixed;
          left: 0;
          top: 0;
          bottom: 0;
          width: 0;
          background: linear-gradient(to right, hsl(var(--primary) / 0.15), transparent);
          pointer-events: none;
          z-index: 9999;
          transition: none;
        `;
        document.body.appendChild(indicator);
        swipeIndicatorRef.current = indicator;
      }
    }
  }, [enabled, edgeThreshold]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!touchStartRef.current?.valid) return;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    
    // If vertical movement is greater, cancel swipe
    if (Math.abs(deltaY) > Math.abs(deltaX) * 0.5) {
      touchStartRef.current.valid = false;
      if (swipeIndicatorRef.current) {
        swipeIndicatorRef.current.style.width = '0';
      }
      return;
    }
    
    // Only track rightward swipes
    if (deltaX > 0 && swipeIndicatorRef.current) {
      const progress = Math.min(deltaX / swipeThreshold, 1);
      swipeIndicatorRef.current.style.width = `${Math.min(deltaX * 0.5, 100)}px`;
      swipeIndicatorRef.current.style.opacity = `${progress}`;
    }
  }, [swipeThreshold]);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (!touchStartRef.current?.valid) {
      touchStartRef.current = null;
      return;
    }
    
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    
    // Clean up indicator
    if (swipeIndicatorRef.current) {
      swipeIndicatorRef.current.style.width = '0';
      swipeIndicatorRef.current.style.opacity = '0';
    }
    
    // Trigger back navigation if swipe was long enough
    if (deltaX >= swipeThreshold) {
      setNavigationDirection('back');
      navigate(-1);
    }
    
    touchStartRef.current = null;
  }, [navigate, swipeThreshold]);

  useEffect(() => {
    if (!enabled) return;

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      
      // Clean up indicator
      if (swipeIndicatorRef.current) {
        swipeIndicatorRef.current.remove();
        swipeIndicatorRef.current = null;
      }
    };
  }, [enabled, handleTouchStart, handleTouchMove, handleTouchEnd]);
}
