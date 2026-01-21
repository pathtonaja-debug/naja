// Hook for getting authenticated user info (email, display name)
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

export interface AuthUser {
  id: string;
  email: string | null;
  displayName: string | null;
  provider: string | null;
}

export function useAuthUser() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        
        if (authUser) {
          setUser({
            id: authUser.id,
            email: authUser.email ?? null,
            displayName: authUser.user_metadata?.display_name ?? authUser.user_metadata?.full_name ?? null,
            provider: authUser.app_metadata?.provider ?? 'email',
          });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error fetching auth user:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email ?? null,
          displayName: session.user.user_metadata?.display_name ?? session.user.user_metadata?.full_name ?? null,
          provider: session.user.app_metadata?.provider ?? 'email',
        });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return { user, loading, isAuthenticated: !!user };
}
