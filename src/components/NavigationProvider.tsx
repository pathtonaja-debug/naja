/**
 * Navigation provider — scroll persistence + swipe back
 */
import { useScrollPersistence } from '@/hooks/useScrollPersistence';
import { useSwipeBack } from '@/hooks/useSwipeBack';
import { PageTransition } from './PageTransition';

interface NavigationProviderProps {
  children: React.ReactNode;
}

export function NavigationProvider({ children }: NavigationProviderProps) {
  useScrollPersistence();
  
  useSwipeBack({
    edgeThreshold: 25,
    swipeThreshold: 70,
    enabled: true,
  });

  return <PageTransition>{children}</PageTransition>;
}
