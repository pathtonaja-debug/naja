import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { getAuthenticatedUserId } from '@/lib/auth';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Users, Copy, UserPlus, Flame, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Partner {
  id: string;
  friendId: string;
  friendName: string;
  friendStreak: number;
  status: string;
}

export function AccountabilityPartners() {
  const { t } = useTranslation();
  const [myCode, setMyCode] = useState('');
  const [partnerCode, setPartnerCode] = useState('');
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const userId = await getAuthenticatedUserId();

      // Get my invite code
      const { data: profile } = await supabase
        .from('profiles')
        .select('invite_code')
        .eq('id', userId)
        .maybeSingle();

      if (profile?.invite_code) {
        setMyCode(profile.invite_code);
      }

      // Get friendships
      const { data: friendships } = await supabase
        .from('friendships')
        .select('*')
        .or(`user_id.eq.${userId},friend_id.eq.${userId}`)
        .eq('status', 'accepted');

      if (friendships && friendships.length > 0) {
        const friendIds = friendships.map(f => 
          f.user_id === userId ? f.friend_id : f.user_id
        );

        const { data: friendProfiles } = await supabase
          .from('profiles')
          .select('id, display_name')
          .in('id', friendIds);

        const { data: friendGamification } = await supabase
          .from('user_gamification')
          .select('user_id, streak_days')
          .in('user_id', friendIds);

        const mapped: Partner[] = friendships.map(f => {
          const fId = f.user_id === userId ? f.friend_id : f.user_id;
          const profile = friendProfiles?.find(p => p.id === fId);
          const gamification = friendGamification?.find(g => g.user_id === fId);
          return {
            id: f.id,
            friendId: fId,
            friendName: profile?.display_name || 'Partner',
            friendStreak: gamification?.streak_days || 0,
            status: f.status,
          };
        });

        setPartners(mapped);
      }
    } catch (e) {
      console.warn('[partners] load failed:', e);
    } finally {
      setLoading(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(myCode).catch(() => {});
    toast.success(t('social.codeCopied'));
  };

  const addPartner = async () => {
    if (!partnerCode.trim()) return;
    try {
      const userId = await getAuthenticatedUserId();

      // Find the user with this invite code
      const { data: friendProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('invite_code', partnerCode.trim())
        .maybeSingle();

      if (!friendProfile) {
        toast.error(t('social.codeNotFound'));
        return;
      }

      if (friendProfile.id === userId) {
        toast.error(t('social.cantAddSelf'));
        return;
      }

      // Create friendship (auto-accepted for now)
      await supabase.from('friendships').insert({
        user_id: userId,
        friend_id: friendProfile.id,
        invite_code: partnerCode.trim(),
        status: 'accepted',
        accepted_at: new Date().toISOString(),
      });

      toast.success(t('social.partnerAdded'));
      setPartnerCode('');
      loadData();
    } catch (e: any) {
      if (e?.message?.includes('duplicate')) {
        toast.error(t('social.alreadyPartners'));
      } else {
        toast.error(t('social.addFailed'));
      }
    }
  };

  const removePartner = async (friendshipId: string) => {
    try {
      await supabase.from('friendships').delete().eq('id', friendshipId);
      setPartners(prev => prev.filter(p => p.id !== friendshipId));
      toast.success(t('social.partnerRemoved'));
    } catch {
      toast.error(t('social.removeFailed'));
    }
  };

  return (
    <div className="space-y-4">
      {/* My invite code */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-sm">{t('social.myCode')}</h3>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 px-3 py-2 bg-muted rounded-lg font-mono text-sm text-center tracking-wider">
              {myCode || '...'}
            </div>
            <Button variant="outline" size="sm" onClick={copyCode}>
              <Copy className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {t('social.shareCode')}
          </p>
        </CardContent>
      </Card>

      {/* Add partner */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <UserPlus className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-sm">{t('social.addPartner')}</h3>
          </div>
          <div className="flex gap-2">
            <Input
              value={partnerCode}
              onChange={e => setPartnerCode(e.target.value)}
              placeholder={t('social.enterCode')}
              className="font-mono text-sm"
            />
            <Button onClick={addPartner} size="sm">
              {t('common.confirm')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Partners list */}
      {partners.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold px-1">{t('social.partners')}</h3>
          {partners.map(partner => (
            <Card key={partner.id}>
              <CardContent className="p-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-lg font-bold text-primary">
                    {partner.friendName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{partner.friendName}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Flame className="w-3 h-3 text-orange-500" />
                    <span>{partner.friendStreak} {t('profile.days')} streak</span>
                  </div>
                </div>
                <button onClick={() => removePartner(partner.id)} className="p-1">
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && partners.length === 0 && (
        <p className="text-xs text-muted-foreground text-center italic py-4">
          {t('social.noPartners')}
        </p>
      )}
    </div>
  );
}
