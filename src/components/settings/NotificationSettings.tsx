import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { supabase } from '@/integrations/supabase/client';
import { Bell, BellOff } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useTranslation } from 'react-i18next';

export function NotificationSettings() {
  const { t } = useTranslation();
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkStatus();
  }, []);

  async function checkStatus() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase
      .from('profiles')
      .select('notifications_enabled')
      .eq('id', user.id)
      .single();
    setEnabled(data?.notifications_enabled ?? false);
    setLoading(false);
  }

  async function toggle(value: boolean) {
    setLoading(true);
    if (value) {
      if (Capacitor.isNativePlatform()) {
        const perm = await PushNotifications.requestPermissions();
        if (perm.receive !== 'granted') { setLoading(false); return; }
        await PushNotifications.register();
      }
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('profiles')
          .update({ notifications_enabled: true })
          .eq('id', user.id);
      }
    } else {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('push_subscriptions' as any).delete().eq('user_id', user.id);
        await supabase.from('profiles')
          .update({ notifications_enabled: false })
          .eq('id', user.id);
      }
    }
    setEnabled(value);
    setLoading(false);
  }

  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        {enabled ? <Bell className="w-5 h-5 text-primary" /> : <BellOff className="w-5 h-5 text-muted-foreground" />}
        <div>
          <p className="text-sm font-medium text-foreground">
            {t('notifications.title', 'Prayer Notifications')}
          </p>
          <p className="text-xs text-muted-foreground">
            {t('notifications.subtitle', 'Reminders for prayers, Quran & more')}
          </p>
        </div>
      </div>
      <Switch
        checked={enabled}
        onCheckedChange={toggle}
        disabled={loading}
      />
    </div>
  );
}
