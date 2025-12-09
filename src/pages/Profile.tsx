import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TopBar } from "@/components/ui/top-bar";
import { ListCell } from "@/components/ui/list-cell";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bell, Moon, Sun, MapPin, LogOut, Loader2 } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useProfile } from "@/hooks/useProfile";
import { Skeleton } from "@/components/ui/skeleton";

const Profile = () => {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const { profile, loading, updateProfile } = useProfile();
  
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    if (profile) {
      setName(profile.display_name || "");
      setNotificationsEnabled(profile.notifications_enabled ?? true);
    }
    
    // Get user email
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) {
        setUserEmail(user.email);
      }
    });
  }, [profile]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const result = await updateProfile({
        display_name: name.trim() || null,
        notifications_enabled: notificationsEnabled,
      });

      if (result.success) {
        toast.success("Settings saved");
      } else {
        toast.error(result.error || "Failed to save settings");
      }
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth", { replace: true });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-24">
        <TopBar title="Settings" />
        <div className="px-5 pb-6">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <Skeleton className="w-16 h-16 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-48" />
              </div>
            </div>
          </Card>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <TopBar title="Settings" />

      {/* User Card */}
      <div className="px-5 pb-6">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarFallback className="bg-primary/20 text-primary text-xl">
                {name ? name.charAt(0).toUpperCase() : "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-foreground mb-1">{name || "User"}</h2>
              <p className="text-sm text-muted-foreground">{userEmail}</p>
            </div>
          </div>
        </Card>
      </div>

      <main className="px-5 space-y-6">
        {/* Profile Settings */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-3 px-2">Profile</h2>
          <Card className="p-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Location (for prayer times)
              </Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., London, UK"
              />
              <p className="text-xs text-muted-foreground">
                Location is used to calculate accurate prayer times.
              </p>
            </div>
            <Button onClick={handleSave} className="w-full" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </Card>
        </div>

        {/* Quick Settings */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-3 px-2">Preferences</h2>
          <Card>
            <ListCell
              title="Dark Mode"
              subtitle="Switch between light and dark theme"
              leftElement={theme === "dark" ? <Moon className="w-5 h-5 text-foreground" /> : <Sun className="w-5 h-5 text-foreground" />}
              rightElement={<Switch checked={theme === "dark"} onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")} />}
              showChevron={false}
            />
            <ListCell
              title="Notifications"
              subtitle="Prayer and habit reminders"
              leftElement={<Bell className="w-5 h-5 text-foreground" />}
              rightElement={
                <Switch 
                  checked={notificationsEnabled} 
                  onCheckedChange={(checked) => {
                    setNotificationsEnabled(checked);
                    handleSave();
                  }} 
                />
              }
              showChevron={false}
            />
          </Card>
        </div>

        {/* Logout */}
        <Card>
          <ListCell
            title="Log Out"
            subtitle="Sign out of your account"
            leftElement={<LogOut className="w-5 h-5 text-destructive" />}
            onPress={handleLogout}
            className="text-destructive"
          />
        </Card>
      </main>

      <BottomNav />
    </div>
  );
};

export default Profile;