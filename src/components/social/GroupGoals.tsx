import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { getAuthenticatedUserId } from '@/lib/auth';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Target, Users, Copy, Plus, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GroupGoal {
  id: string;
  title: string;
  description: string | null;
  goal_type: string;
  target: number;
  progress: number;
  invite_code: string;
  is_active: boolean;
  members: { user_id: string; display_name: string; contribution: number }[];
}

export function GroupGoals() {
  const { t } = useTranslation();
  const [goals, setGoals] = useState<GroupGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newTarget, setNewTarget] = useState(100);

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      const userId = await getAuthenticatedUserId();

      // Get group goals I'm a member of
      const { data: memberships } = await supabase
        .from('group_goal_members')
        .select('group_goal_id')
        .eq('user_id', userId);

      const goalIds = memberships?.map(m => m.group_goal_id) || [];

      // Also get goals I created
      const { data: createdGoals } = await supabase
        .from('group_goals')
        .select('*')
        .eq('creator_id', userId);

      const allIds = [...new Set([
        ...goalIds,
        ...(createdGoals || []).map(g => g.id)
      ])];

      if (allIds.length === 0) {
        setLoading(false);
        return;
      }

      const { data: goalsData } = await supabase
        .from('group_goals')
        .select('*')
        .in('id', allIds)
        .eq('is_active', true);

      if (!goalsData) {
        setLoading(false);
        return;
      }

      // Get members for each goal
      const { data: allMembers } = await supabase
        .from('group_goal_members')
        .select('group_goal_id, user_id, contribution')
        .in('group_goal_id', allIds);

      const memberUserIds = [...new Set((allMembers || []).map(m => m.user_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, display_name')
        .in('id', memberUserIds);

      const mapped: GroupGoal[] = goalsData.map(g => ({
        ...g,
        members: (allMembers || [])
          .filter(m => m.group_goal_id === g.id)
          .map(m => ({
            user_id: m.user_id,
            display_name: profiles?.find(p => p.id === m.user_id)?.display_name || 'Member',
            contribution: m.contribution,
          })),
      }));

      setGoals(mapped);
    } catch (e) {
      console.warn('[group-goals] load failed:', e);
    } finally {
      setLoading(false);
    }
  };

  const createGoal = async () => {
    if (!newTitle.trim()) return;
    try {
      const userId = await getAuthenticatedUserId();
      
      const { data, error } = await supabase
        .from('group_goals')
        .insert({
          creator_id: userId,
          title: newTitle.trim(),
          target: newTarget,
          goal_type: 'general',
        })
        .select()
        .single();

      if (error) throw error;

      // Add creator as member
      await supabase.from('group_goal_members').insert({
        group_goal_id: data.id,
        user_id: userId,
      });

      toast.success(t('social.goalCreated'));
      setShowCreate(false);
      setNewTitle('');
      loadGoals();
    } catch {
      toast.error(t('social.createFailed'));
    }
  };

  const joinGoal = async () => {
    if (!joinCode.trim()) return;
    try {
      const userId = await getAuthenticatedUserId();

      const { data: goal } = await supabase
        .from('group_goals')
        .select('id')
        .eq('invite_code', joinCode.trim())
        .eq('is_active', true)
        .maybeSingle();

      if (!goal) {
        toast.error(t('social.codeNotFound'));
        return;
      }

      await supabase.from('group_goal_members').insert({
        group_goal_id: goal.id,
        user_id: userId,
      });

      toast.success(t('social.joinedGoal'));
      setShowJoin(false);
      setJoinCode('');
      loadGoals();
    } catch (e: any) {
      if (e?.message?.includes('duplicate')) {
        toast.error(t('social.alreadyMember'));
      } else {
        toast.error(t('social.joinFailed'));
      }
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code).catch(() => {});
    toast.success(t('social.codeCopied'));
  };

  return (
    <div className="space-y-4">
      {/* Actions */}
      <div className="flex gap-2">
        <Button onClick={() => setShowCreate(!showCreate)} variant="outline" size="sm" className="flex-1">
          <Plus className="w-4 h-4 mr-1" />
          {t('social.createGoal')}
        </Button>
        <Button onClick={() => setShowJoin(!showJoin)} variant="outline" size="sm" className="flex-1">
          <UserPlus className="w-4 h-4 mr-1" />
          {t('social.joinGoal')}
        </Button>
      </div>

      {/* Create form */}
      {showCreate && (
        <Card>
          <CardContent className="p-4 space-y-3">
            <Input
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              placeholder={t('social.goalTitle')}
            />
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{t('social.target')}:</span>
              <Input
                type="number"
                value={newTarget}
                onChange={e => setNewTarget(Number(e.target.value))}
                className="w-24"
              />
            </div>
            <Button onClick={createGoal} className="w-full">{t('common.create')}</Button>
          </CardContent>
        </Card>
      )}

      {/* Join form */}
      {showJoin && (
        <Card>
          <CardContent className="p-4 space-y-3">
            <Input
              value={joinCode}
              onChange={e => setJoinCode(e.target.value)}
              placeholder={t('social.enterGroupCode')}
              className="font-mono"
            />
            <Button onClick={joinGoal} className="w-full">{t('social.joinGoal')}</Button>
          </CardContent>
        </Card>
      )}

      {/* Goals list */}
      {goals.map(goal => {
        const progress = goal.target > 0 ? Math.round((goal.progress / goal.target) * 100) : 0;
        return (
          <Card key={goal.id}>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  <h4 className="font-semibold text-sm">{goal.title}</h4>
                </div>
                <button onClick={() => copyCode(goal.invite_code)} className="text-xs text-primary flex items-center gap-1">
                  <Copy className="w-3 h-3" />
                  {goal.invite_code}
                </button>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{goal.progress}/{goal.target}</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-1 flex-wrap">
                <Users className="w-3.5 h-3.5 text-muted-foreground" />
                {goal.members.map(m => (
                  <span key={m.user_id} className="text-xs bg-muted px-2 py-0.5 rounded-full">
                    {m.display_name}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}

      {!loading && goals.length === 0 && !showCreate && (
        <p className="text-xs text-muted-foreground text-center italic py-4">
          {t('social.noGroupGoals')}
        </p>
      )}
    </div>
  );
}
