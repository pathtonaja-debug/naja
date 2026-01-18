/**
 * Hook for persisting scroll position across page navigations
 * Saves scroll position when navigating away and restores it when returning
 */
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const STORAGE_KEY = 'naja_scroll_positions';

// Get all stored scroll positions
function getScrollPositions(): Record<string, number> {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

// Save scroll position for a specific path
function saveScrollPosition(path: string, position: number): void {
  const positions = getScrollPositions();
  positions[path] = position;
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(positions));
}

// Get scroll position for a specific path
function getScrollPosition(path: string): number {
  const positions = getScrollPositions();
  return positions[path] || 0;
}

export function useScrollPersistence() {
  const location = useLocation();
  const previousPathRef = useRef<string | null>(null);
  const isRestoringRef = useRef(false);

  // Save scroll position when leaving the page
  useEffect(() => {
    const handleScroll = () => {
      if (!isRestoringRef.current && previousPathRef.current) {
        saveScrollPosition(previousPathRef.current, window.scrollY);
      }
    };

    // Debounced scroll save
    let scrollTimeout: ReturnType<typeof setTimeout>;
    const debouncedScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(handleScroll, 100);
    };

    window.addEventListener('scroll', debouncedScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', debouncedScroll);
      clearTimeout(scrollTimeout);
      // Save final position on cleanup
      if (previousPathRef.current) {
        saveScrollPosition(previousPathRef.current, window.scrollY);
      }
    };
  }, []);

  // Restore scroll position when navigating to a page
  useEffect(() => {
    const currentPath = location.pathname + location.search;
    
    // Save previous path's scroll position before switching
    if (previousPathRef.current && previousPathRef.current !== currentPath) {
      saveScrollPosition(previousPathRef.current, window.scrollY);
    }

    // Restore scroll position for current path
    isRestoringRef.current = true;
    const savedPosition = getScrollPosition(currentPath);
    
    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      window.scrollTo(0, savedPosition);
      // Allow scroll events again after a short delay
      setTimeout(() => {
        isRestoringRef.current = false;
      }, 100);
    });

    previousPathRef.current = currentPath;
  }, [location.pathname, location.search]);

  return null;
}

// Navigation direction tracker for animations
let navigationDirection: 'forward' | 'back' = 'forward';

export function setNavigationDirection(direction: 'forward' | 'back') {
  navigationDirection = direction;
}

export function getNavigationDirection() {
  return navigationDirection;
}
