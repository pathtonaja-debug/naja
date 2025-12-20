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
  Star, Flame, Users
} from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { useState } from "react";
import { useTheme } from "next-themes";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useGuestProfile, SPIRITUAL_LEVELS } from "@/hooks/useGuestProfile";
import { motion } from "framer-motion";

const Profile = () => {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const { profile, updateDisplayName, resetData } = useGuestProfile();
  
  const [name, setName] = useState(profile.displayName);
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    updateDisplayName(name.trim() || 'Traveler');
    toast.success("Name updated!");
    setSaving(false);
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to reset all your data? This cannot be undone.")) {
      resetData();
      toast.success("Data reset successfully");
    }
  };

  const levelTitle = SPIRITUAL_LEVELS[profile.level - 1] || 'The Seeker';

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-pastel-cream pb-24"
    >
      <TopBar title="Profile" />

      {/* User Card */}
      <motion.div 
        className="px-4 pb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-4 bg-white border-border/30">
          <div className="flex items-center gap-3">
            <Avatar className="w-16 h-16">
              <AvatarFallback className="bg-pastel-lavender text-foreground text-xl font-bold">
                {profile.displayName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-foreground">{profile.displayName}</h2>
              <p className="text-sm text-foreground/60">{levelTitle}</p>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs text-foreground/50 flex items-center gap-1">
                  <Star className="w-3 h-3 text-pastel-yellow" /> Level {profile.level}
                </span>
                <span className="text-xs text-foreground/50 flex items-center gap-1">
                  <Flame className="w-3 h-3 text-orange-500" /> {profile.hasanatStreak} day streak
                </span>
              </div>
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
        <h2 className="text-sm font-semibold text-foreground mb-2 px-1">Your Journey</h2>
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4 bg-white border-border/30">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-pastel-lavender/50 flex items-center justify-center">
                <Star className="w-4 h-4 text-pastel-lavender" />
              </div>
              <span className="text-xs text-foreground/60">Total Points</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{profile.barakahPoints}</p>
            <p className="text-[10px] text-foreground/40">Barakah Points</p>
          </Card>
          
          <Card className="p-4 bg-white border-border/30">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <Flame className="w-4 h-4 text-orange-500" />
              </div>
              <span className="text-xs text-foreground/60">Best Streak</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{profile.hasanatStreak}</p>
            <p className="text-[10px] text-foreground/40">Days in a row</p>
          </Card>
        </div>
        
        <p className="text-[10px] text-foreground/40 mt-2 text-center italic px-4">
          Your niyyah is what matters — points are just a tool to help you stay consistent.
        </p>
      </motion.div>

      {/* Quick Links */}
      <motion.div
        className="px-4 pb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-white border-border/30">
          <ListCell
            title="Achievements"
            subtitle="View your badges and milestones"
            leftElement={<Trophy className="w-4 h-4 text-pastel-yellow" />}
            onPress={() => navigate('/achievements')}
          />
          <ListCell
            title="Progress & History"
            subtitle="See your weekly stats"
            leftElement={<TrendingUp className="w-4 h-4 text-pastel-green" />}
            onPress={() => navigate('/progress')}
          />
          <ListCell
            title="Leaderboard"
            subtitle="See how you rank this week"
            leftElement={<Users className="w-4 h-4 text-pastel-blue" />}
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
          <h2 className="text-sm font-semibold text-foreground mb-2 px-1">Display Name</h2>
          <Card className="p-3 space-y-3 bg-white border-border/30">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs text-foreground/60">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="h-10 text-sm bg-pastel-cream/50 border-border/30"
              />
            </div>
            <Button onClick={handleSave} className="w-full h-10 text-sm" disabled={saving}>
              Save Name
            </Button>
          </Card>
          <p className="text-[10px] text-foreground/40 mt-1.5 px-1">
            This name is stored locally on your device and shown on the leaderboard.
          </p>
        </motion.div>

        {/* Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-sm font-semibold text-foreground mb-2 px-1">Preferences</h2>
          <Card className="bg-white border-border/30">
            <ListCell
              title="Dark Mode"
              subtitle="Switch between light and dark theme"
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
          <h2 className="text-sm font-semibold text-foreground mb-2 px-1">Data</h2>
          <Card className="bg-white border-border/30">
            <ListCell
              title="Reset All Data"
              subtitle="Clear all progress and start fresh"
              leftElement={<Trash2 className="w-4 h-4 text-destructive" />}
              onPress={handleReset}
              className="text-destructive"
            />
          </Card>
        </motion.div>

        {/* Anonymous Disclaimer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-4 rounded-2xl bg-pastel-blue/20 border border-pastel-blue/30"
        >
          <p className="text-xs text-foreground/60 text-center">
            🔒 Your data is stored locally on this device. No account required. 
            Your ID: <span className="font-mono text-[10px]">{profile.id.slice(0, 8)}...</span>
          </p>
        </motion.div>
      </main>

      <BottomNav />
    </motion.div>
  );
};

export default Profile;
