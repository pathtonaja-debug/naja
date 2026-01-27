import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TopBar } from "@/components/ui/top-bar";
import { ListCell } from "@/components/ui/list-cell";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Moon, Sun, Trash2, Trophy, TrendingUp, 
  Star, Flame, Users, Globe, LogOut, Mail
} from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useGuestProfile, SPIRITUAL_LEVELS } from "@/hooks/useGuestProfile";
import { useAuthUser } from "@/hooks/useAuthUser";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { changeLanguage, getCurrentLanguage } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";

const Profile = () => {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { profile, updateDisplayName, resetData } = useGuestProfile();
  const { user: authUser } = useAuthUser();
  
  // Use auth display name if available, fall back to local profile
  const displayName = authUser?.displayName || profile.displayName;
  const [name, setName] = useState(displayName);
  const [saving, setSaving] = useState(false);
  const [currentLang, setCurrentLang] = useState(getCurrentLanguage());

  // Update name field when auth user loads
  useEffect(() => {
    if (authUser?.displayName) {
      setName(authUser.displayName);
    }
  }, [authUser?.displayName]);

  const handleSave = () => {
    setSaving(true);
    updateDisplayName(name.trim() || 'Traveler');
    toast.success(t('toast.saved'));
    setSaving(false);
  };

  const handleReset = () => {
    if (confirm(t('profile.resetConfirm'))) {
      resetData();
      toast.success(t('toast.deleted'));
    }
  };

  const handleLogout = async () => {
    if (confirm(t('auth.logoutConfirm'))) {
      try {
        await supabase.auth.signOut();
        toast.success(t('auth.loggedOut'));
        navigate('/auth', { replace: true });
      } catch (error: any) {
        toast.error(error.message || 'Logout failed');
      }
    }
  };

  const handleLanguageChange = (lang: 'en' | 'fr') => {
    changeLanguage(lang);
    setCurrentLang(lang);
  };

  const levelTitle = SPIRITUAL_LEVELS[profile.level - 1] || 'The Seeker';

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-background pb-24"
    >
      <TopBar title={t('profile.title')} />

      {/* User Card */}
      <motion.div 
        className="px-4 pb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-4 bg-card border-border">
          <div className="flex items-center gap-3">
            <Avatar className="w-16 h-16">
              <AvatarFallback className="bg-semantic-teal-soft text-semantic-teal-dark text-xl font-bold">
                {displayName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-foreground">{displayName}</h2>
              <p className="text-sm text-foreground/60">{levelTitle}</p>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs text-foreground/50 flex items-center gap-1">
                  <Star className="w-3 h-3 text-semantic-yellow-dark" /> {t('dashboard.level')} {profile.level}
                </span>
                <span className="text-xs text-foreground/50 flex items-center gap-1">
                  <Flame className="w-3 h-3 text-orange-500" /> {profile.hasanatStreak} {t('profile.days')}
                </span>
              </div>
              {authUser?.email && (
                <div className="flex items-center gap-1 mt-1">
                  <Mail className="w-3 h-3 text-foreground/40" />
                  <span className="text-xs text-foreground/40">{authUser.email}</span>
                </div>
              )}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        className="px-4 pb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <h2 className="text-sm font-semibold text-foreground mb-2 px-1">{t('profile.progress')}</h2>
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4 bg-card border-border">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-semantic-yellow-soft flex items-center justify-center">
                <Star className="w-4 h-4 text-semantic-yellow-dark" />
              </div>
              <span className="text-xs text-foreground/60">{t('profile.totalPoints')}</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{profile.barakahPoints}</p>
            <p className="text-[10px] text-foreground/40">{t('dashboard.barakahPoints')}</p>
          </Card>
          
          <Card className="p-4 bg-card border-border">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center">
                <Flame className="w-4 h-4 text-destructive" />
              </div>
              <span className="text-xs text-foreground/60">{t('profile.bestStreak')}</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{profile.hasanatStreak}</p>
            <p className="text-[10px] text-foreground/40">{t('profile.days')}</p>
          </Card>
        </div>
        
        <p className="text-[10px] text-foreground/40 mt-2 text-center italic px-4">
          {t('dashboard.niyyahDisclaimer')}
        </p>
      </motion.div>

      {/* Quick Links */}
      <motion.div
        className="px-4 pb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-card border-border">
          <ListCell
            title={t('profile.achievements')}
            subtitle={t('learn.badgesEarned')}
            leftElement={<Trophy className="w-4 h-4 text-semantic-yellow-dark" />}
            onPress={() => navigate('/achievements')}
          />
          <ListCell
            title={t('profile.progress')}
            subtitle={t('learn.viewAll')}
            leftElement={<TrendingUp className="w-4 h-4 text-semantic-green-dark" />}
            onPress={() => navigate('/progress')}
          />
          <ListCell
            title={t('profile.leaderboard')}
            subtitle={t('profile.achievements')}
            leftElement={<Users className="w-4 h-4 text-semantic-blue-dark" />}
            onPress={() => navigate('/leaderboard')}
          />
        </Card>
      </motion.div>

      <main className="px-4 space-y-4">
        {/* Profile Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <h2 className="text-sm font-semibold text-foreground mb-2 px-1">{t('profile.displayName')}</h2>
          <Card className="p-3 space-y-3 bg-card border-border">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs text-foreground/60">{t('profile.displayName')}</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('profile.displayName')}
                className="h-10 text-sm bg-muted/50 border-border"
              />
            </div>
            <Button onClick={handleSave} className="w-full h-10 text-sm" disabled={saving}>
              {t('common.save')}
            </Button>
          </Card>
          <p className="text-[10px] text-foreground/40 mt-1.5 px-1">
            {t('profile.anonymous')}
          </p>
        </motion.div>

        {/* Language Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28 }}
        >
          <h2 className="text-sm font-semibold text-foreground mb-2 px-1">{t('profile.language')}</h2>
          <Card className="bg-card border-border">
            <div className="p-3 flex gap-2">
              <Button
                variant={currentLang === 'en' ? 'default' : 'outline'}
                size="sm"
                className="flex-1"
                onClick={() => handleLanguageChange('en')}
              >
                <Globe className="w-4 h-4 mr-2" />
                {t('profile.english')}
              </Button>
              <Button
                variant={currentLang === 'fr' ? 'default' : 'outline'}
                size="sm"
                className="flex-1"
                onClick={() => handleLanguageChange('fr')}
              >
                <Globe className="w-4 h-4 mr-2" />
                {t('profile.french')}
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-sm font-semibold text-foreground mb-2 px-1">{t('profile.preferences')}</h2>
          <Card className="bg-white border-border/30">
            <ListCell
              title={t('profile.darkMode')}
              subtitle={t('profile.preferences')}
              leftElement={theme === "dark" ? <Moon className="w-4 h-4 text-foreground" /> : <Sun className="w-4 h-4 text-foreground" />}
              rightElement={<Switch checked={theme === "dark"} onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")} />}
              showChevron={false}
            />
          </Card>
        </motion.div>

        {/* Data Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <h2 className="text-sm font-semibold text-foreground mb-2 px-1">{t('profile.dataManagement')}</h2>
          <Card className="bg-white border-border/30">
            <ListCell
              title={t('profile.resetData')}
              subtitle={t('profile.resetConfirm').slice(0, 40) + '...'}
              leftElement={<Trash2 className="w-4 h-4 text-destructive" />}
              onPress={handleReset}
              className="text-destructive"
            />
          </Card>
        </motion.div>

        {/* Logout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-white border-border/30">
            <ListCell
              title={t('auth.logout')}
              subtitle={t('auth.logoutConfirm').slice(0, 40) + '...'}
              leftElement={<LogOut className="w-4 h-4 text-foreground/60" />}
              onPress={handleLogout}
            />
          </Card>
        </motion.div>

        {/* Account Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="p-4 rounded-2xl bg-pastel-blue/20 border border-pastel-blue/30"
        >
          <p className="text-xs text-foreground/60 text-center">
            🔒 {t('profile.dataSecure')}
            {authUser?.provider && (
              <>
                <br />
                <span className="text-[10px]">
                  {authUser.provider === 'google' ? 'Connected with Google' : 'Signed in with email'}
                </span>
              </>
            )}
          </p>
        </motion.div>
      </main>

      <BottomNav />
    </motion.div>
  );
};

export default Profile;
