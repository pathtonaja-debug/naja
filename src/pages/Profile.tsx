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
import { motion } from "framer-motion";
import palmsWatercolor from "@/assets/illustrations/palms-watercolor.png";
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
  
  const [locationSheetOpen, setLocationSheetOpen] = useState(false);
  const [methodSheetOpen, setMethodSheetOpen] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.display_name || "");
      setNotificationsEnabled(profile.notifications_enabled ?? true);
    }
    
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
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-background pb-24 relative overflow-hidden"
    >
      {/* Watercolor decoration */}
      <motion.img 
        src={palmsWatercolor}
        alt=""
        className="absolute top-20 right-0 w-36 h-36 object-contain opacity-20 pointer-events-none"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 0.2, x: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      />

      <TopBar title="Settings" />

      {/* User Card */}
      <motion.div 
        className="px-4 pb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Avatar className="w-14 h-14">
              <AvatarFallback className="bg-primary/20 text-primary text-lg">
                {name ? name.charAt(0).toUpperCase() : "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-foreground mb-0.5">{name || "User"}</h2>
              <p className="text-[13px] text-muted-foreground">{userEmail}</p>
            </div>
          </div>
        </Card>
      </motion.div>

      <main className="px-4 space-y-5">
        {/* Profile Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <h2 className="text-[15px] font-semibold text-foreground mb-2 px-1">Profile</h2>
          <Card className="p-3 space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-[13px]">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="h-10 text-[13px]"
              />
            </div>
            <Button onClick={handleSave} className="w-full h-10 text-[13px]" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Name"
              )}
            </Button>
          </Card>
        </motion.div>

        {/* Prayer & Location Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-[15px] font-semibold text-foreground mb-2 px-1">Prayer & Location</h2>
          <Card>
            <ListCell
              title="Location"
              subtitle={getLocationDisplay()}
              leftElement={<MapPin className="w-4 h-4 text-foreground" />}
              onPress={() => setLocationSheetOpen(true)}
            />
            <ListCell
              title="Prayer Method"
              subtitle={getPrayerMethodLabel(profile?.prayer_method ?? null)}
              leftElement={<Calculator className="w-4 h-4 text-foreground" />}
              onPress={() => setMethodSheetOpen(true)}
            />
          </Card>
          <p className="text-[11px] text-muted-foreground mt-1.5 px-1">
            Location and prayer method are used to calculate accurate prayer times.
          </p>
        </motion.div>

        {/* Quick Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <h2 className="text-[15px] font-semibold text-foreground mb-2 px-1">Preferences</h2>
          <Card>
            <ListCell
              title="Dark Mode"
              subtitle="Switch between light and dark theme"
              leftElement={theme === "dark" ? <Moon className="w-4 h-4 text-foreground" /> : <Sun className="w-4 h-4 text-foreground" />}
              rightElement={<Switch checked={theme === "dark"} onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")} />}
              showChevron={false}
            />
            <ListCell
              title="Notifications"
              subtitle="Prayer and habit reminders"
              leftElement={<Bell className="w-4 h-4 text-foreground" />}
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
        </motion.div>

        {/* Logout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <ListCell
              title="Log Out"
              subtitle="Sign out of your account"
              leftElement={<LogOut className="w-4 h-4 text-destructive" />}
              onPress={handleLogout}
              className="text-destructive"
            />
          </Card>
        </motion.div>
      </main>

      <LocationSettingsSheet
        open={locationSheetOpen}
        onOpenChange={setLocationSheetOpen}
        currentCity={profile?.city ?? null}
        currentCountry={profile?.country ?? null}
        currentLatitude={profile?.latitude ?? null}
        currentLongitude={profile?.longitude ?? null}
        onSave={handleLocationSave}
      />

      <PrayerMethodSheet
        open={methodSheetOpen}
        onOpenChange={setMethodSheetOpen}
        currentMethod={profile?.prayer_method ?? null}
        onSave={handleMethodSave}
      />

      <BottomNav />
    </motion.div>
  );
};

export default Profile;
