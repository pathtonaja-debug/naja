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
import cardBgGreen from '@/assets/card-bg-green.jpg';

const Profile = () => {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { profile, updateDisplayName, resetData } = useGuestProfile();
  const { user: authUser } = useAuthUser();
  
  const displayName = authUser?.displayName || profile.displayName;
  const [name, setName] = useState(displayName);
  const [saving, setSaving] = useState(false);
  const [currentLang, setCurrentLang] = useState(getCurrentLanguage());

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
      className="min-h-screen bg-background pb-28"
    >
      <TopBar title={t('profile.title')} />

      {/* Hero User Card with Background Image */}
      <motion.div 
        className="px-4 pb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div 
          className="relative overflow-hidden rounded-3xl"
          style={{ boxShadow: '0 20px 60px -15px rgba(45, 90, 71, 0.35)' }}
        >
          <img 
            src={cardBgGreen} 
            alt="" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/40 to-black/60" />
          
          <div className="relative z-10 p-5">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16 ring-2 ring-white/30">
                <AvatarFallback className="bg-white/20 text-white text-xl font-bold backdrop-blur-sm">
                  {displayName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white">{displayName}</h2>
                <p className="text-sm text-white/70">{levelTitle}</p>
                {authUser?.email && (
                  <div className="flex items-center gap-1 mt-1">
                    <Mail className="w-3 h-3 text-white/50" />
                    <span className="text-xs text-white/50">{authUser.email}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Star className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-white font-bold">{t('dashboard.level')} {profile.level}</p>
                  <p className="text-white/60 text-xs">{profile.barakahPoints} pts</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Flame className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-white font-bold">{profile.hasanatStreak}</p>
                  <p className="text-white/60 text-xs">{t('profile.days')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
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
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Star className="w-4 h-4 text-primary" />
              </div>
              <span className="text-xs text-muted-foreground">{t('profile.totalPoints')}</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{profile.barakahPoints}</p>
            <p className="text-[10px] text-muted-foreground">{t('dashboard.barakahPoints')}</p>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                <Flame className="w-4 h-4 text-accent" />
              </div>
              <span className="text-xs text-muted-foreground">{t('profile.bestStreak')}</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{profile.hasanatStreak}</p>
            <p className="text-[10px] text-muted-foreground">{t('profile.days')}</p>
          </Card>
        </div>
        
        <p className="text-[10px] text-muted-foreground mt-2 text-center italic px-4">
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
        <Card>
          <ListCell
            title={t('profile.achievements')}
            subtitle={t('learn.badgesEarned')}
            leftElement={<Trophy className="w-4 h-4 text-warn" />}
            onPress={() => navigate('/achievements')}
          />
          <ListCell
            title={t('profile.progress')}
            subtitle={t('learn.viewAll')}
            leftElement={<TrendingUp className="w-4 h-4 text-success" />}
            onPress={() => navigate('/progress')}
          />
          <ListCell
            title={t('profile.leaderboard')}
            subtitle={t('profile.achievements')}
            leftElement={<Users className="w-4 h-4 text-accent" />}
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
          <Card className="p-3 space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs text-muted-foreground">{t('profile.displayName')}</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('profile.displayName')}
                className="h-10 text-sm"
              />
            </div>
            <Button onClick={handleSave} variant="primary" className="w-full h-10 text-sm" disabled={saving}>
              {t('common.save')}
            </Button>
          </Card>
          <p className="text-[10px] text-muted-foreground mt-1.5 px-1">
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
          <Card>
            <div className="p-3 flex gap-2">
              <Button
                variant={currentLang === 'en' ? 'primary' : 'outline'}
                size="sm"
                className="flex-1"
                onClick={() => handleLanguageChange('en')}
              >
                <Globe className="w-4 h-4 mr-2" />
                {t('profile.english')}
              </Button>
              <Button
                variant={currentLang === 'fr' ? 'primary' : 'outline'}
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
          <Card>
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
          <Card>
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
          <Card>
            <ListCell
              title={t('auth.logout')}
              subtitle={t('auth.logoutConfirm').slice(0, 40) + '...'}
              leftElement={<LogOut className="w-4 h-4 text-muted-foreground" />}
              onPress={handleLogout}
            />
          </Card>
        </motion.div>

        {/* Account Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="glass-card p-4"
        >
          <p className="text-xs text-muted-foreground text-center">
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
