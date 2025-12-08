import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TopBar } from "@/components/ui/top-bar";
import { ListCell } from "@/components/ui/list-cell";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bell, Moon, Sun, MapPin, LogOut } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Profile = () => {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    // Load saved preferences
    setName(localStorage.getItem("user-name") || "");
    setLocation(localStorage.getItem("user-location") || "");
    
    // Get user email
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) {
        setUserEmail(user.email);
      }
    });
  }, []);

  const handleSave = () => {
    localStorage.setItem("user-name", name);
    localStorage.setItem("user-location", location);
    toast.success("Settings saved");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

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
            </div>
            <Button onClick={handleSave} className="w-full">
              Save Changes
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
              rightElement={<Switch checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />}
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