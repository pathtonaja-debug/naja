/**
 * Navigation provider that sets up global navigation features:
 * - Swipe-from-left-edge to go back
 * - Scroll position persistence
 * - Page transition animations
 */
import { useScrollPersistence } from '@/hooks/useScrollPersistence';
import { useSwipeBack } from '@/hooks/useSwipeBack';
import { PageTransition } from './PageTransition';

interface NavigationProviderProps {
  children: React.ReactNode;
}

export function NavigationProvider({ children }: NavigationProviderProps) {
  // Initialize scroll persistence
  useScrollPersistence();
  
  // Initialize swipe-back gesture
  useSwipeBack({
    edgeThreshold: 25,
    swipeThreshold: 70,
    enabled: true,
  });

  return <PageTransition>{children}</PageTransition>;
}
