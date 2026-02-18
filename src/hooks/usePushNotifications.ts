import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { supabase } from '@/integrations/supabase/client';

export function usePushNotifications() {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;
    initPushNotifications();
  }, []);

  async function initPushNotifications() {
    const permission = await PushNotifications.requestPermissions();
    if (permission.receive !== 'granted') return;

    await PushNotifications.register();

    PushNotifications.addListener('registration', async (token) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const platform = Capacitor.getPlatform() as 'ios' | 'android';

      await supabase.from('push_subscriptions' as any).upsert({
        user_id: user.id,
        token: token.value,
        platform,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id, token' });

      await supabase.from('profiles')
        .update({ notifications_enabled: true })
        .eq('id', user.id);
    });

    PushNotifications.addListener('registrationError', (error) => {
      console.error('Push registration error:', error);
    });

    PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
      const url = action.notification.data?.url;
      if (url) window.location.href = url;
    });
  }

  async function disableNotifications() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from('push_subscriptions' as any).delete().eq('user_id', user.id);
    await supabase.from('profiles')
      .update({ notifications_enabled: false })
      .eq('id', user.id);
  }

  return { disableNotifications };
}
