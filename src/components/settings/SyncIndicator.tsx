import { useState, useEffect } from 'react';
import { Cloud, CloudOff, Loader2, Check } from 'lucide-react';
import { getSyncStatus, onSyncStatusChange, pushToCloud } from '@/services/syncService';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

export function SyncIndicator() {
  const { t } = useTranslation();
  const [status, setStatus] = useState(getSyncStatus);

  useEffect(() => {
    return onSyncStatusChange(setStatus);
  }, []);

  const handleManualSync = () => {
    pushToCloud().catch(() => {});
  };

  const icon = status === 'syncing' 
    ? <Loader2 className="w-4 h-4 animate-spin text-primary" />
    : status === 'done'
    ? <Check className="w-4 h-4 text-success" />
    : status === 'error'
    ? <CloudOff className="w-4 h-4 text-destructive" />
    : <Cloud className="w-4 h-4 text-muted-foreground" />;

  const label = status === 'syncing' 
    ? t('profile.syncing')
    : status === 'done'
    ? t('profile.synced')
    : status === 'error'
    ? t('profile.syncError')
    : t('profile.syncIdle');

  return (
    <button
      onClick={handleManualSync}
      disabled={status === 'syncing'}
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-colors",
        "hover:bg-muted/50 disabled:opacity-50"
      )}
    >
      {icon}
      <span className="text-foreground/70">{label}</span>
    </button>
  );
}
