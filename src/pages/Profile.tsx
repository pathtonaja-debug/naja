import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TopBar } from "@/components/ui/top-bar";
import { ListCell } from "@/components/ui/list-cell";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bell, Moon, Sun, MapPin, LogOut, Loader2, Calculator } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useProfile } from "@/hooks/useProfile";
import { Skeleton } from "@/components/ui/skeleton";
import { LocationSettingsSheet } from "@/components/settings/LocationSettingsSheet";
import { PrayerMethodSheet, getPrayerMethodLabel } from "@/components/settings/PrayerMethodSheet";
import type { Database } from "@/integrations/supabase/types";

type PrayerMethod = Database["public"]["Enums"]["prayer_method"];

const Profile = () => {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const { profile, loading, updateProfile, refetch } = useProfile();
  
  const [name, setName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
  // Sheet states
  const [locationSheetOpen, setLocationSheetOpen] = useState(false);
  const [methodSheetOpen, setMethodSheetOpen] = useState(false);

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

  const handleLocationSave = async (data: {
    city: string | null;
    country: string | null;
    latitude: number | null;
    longitude: number | null;
  }) => {
    const result = await updateProfile(data);
    if (result.success) {
      await refetch();
    }
    return result;
  };

  const handleMethodSave = async (method: PrayerMethod) => {
    const result = await updateProfile({ prayer_method: method });
    if (result.success) {
      await refetch();
    }
    return result;
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth", { replace: true });
  };

  // Get location display text
  const getLocationDisplay = () => {
    if (profile?.city && profile?.country) {
      return `${profile.city}, ${profile.country}`;
    }
    if (profile?.city) return profile.city;
    if (profile?.country) return profile.country;
    if (profile?.latitude && profile?.longitude) {
      return `${profile.latitude.toFixed(2)}°, ${profile.longitude.toFixed(2)}°`;
    }
    return "Not set yet";
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
            <Button onClick={handleSave} className="w-full" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Name"
              )}
            </Button>
          </Card>
        </div>

        {/* Prayer & Location Settings */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-3 px-2">Prayer & Location</h2>
          <Card>
            <ListCell
              title="Location"
              subtitle={getLocationDisplay()}
              leftElement={<MapPin className="w-5 h-5 text-foreground" />}
              onPress={() => setLocationSheetOpen(true)}
            />
            <ListCell
              title="Prayer Method"
              subtitle={getPrayerMethodLabel(profile?.prayer_method ?? null)}
              leftElement={<Calculator className="w-5 h-5 text-foreground" />}
              onPress={() => setMethodSheetOpen(true)}
            />
          </Card>
          <p className="text-xs text-muted-foreground mt-2 px-2">
            Location and prayer method are used to calculate accurate prayer times.
          </p>
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
                  onCheckedChange={async (checked) => {
                    setNotificationsEnabled(checked);
                    await updateProfile({ notifications_enabled: checked });
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

      {/* Location Settings Sheet */}
      <LocationSettingsSheet
        open={locationSheetOpen}
        onOpenChange={setLocationSheetOpen}
        currentCity={profile?.city ?? null}
        currentCountry={profile?.country ?? null}
        currentLatitude={profile?.latitude ?? null}
        currentLongitude={profile?.longitude ?? null}
        onSave={handleLocationSave}
      />

      {/* Prayer Method Sheet */}
      <PrayerMethodSheet
        open={methodSheetOpen}
        onOpenChange={setMethodSheetOpen}
        currentMethod={profile?.prayer_method ?? null}
        onSave={handleMethodSave}
      />

      <BottomNav />
    </div>
  );
};

export default Profile;
