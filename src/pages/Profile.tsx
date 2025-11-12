import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TopBar } from "@/components/ui/top-bar";
import { ListCell } from "@/components/ui/list-cell";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Bell, Settings, Moon, Globe, User, Sun } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { useState } from "react";
import { useTheme } from "next-themes";

const Profile = () => {
  const { theme, setTheme } = useTheme();
  const [showHijri, setShowHijri] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const settings = [
    { icon: User, label: "Account Settings", subtitle: "Manage your profile" },
    { icon: Bell, label: "Notifications", subtitle: "Prayer & habit reminders" },
    { icon: Moon, label: "Prayer Settings", subtitle: "Calculation method" },
    { icon: Globe, label: "Language & Region", subtitle: "English, UTC" },
    { icon: Settings, label: "App Preferences", subtitle: "Customize NAJA" },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Top Bar */}
      <TopBar
        title="Profile"
        rightElement={
          <Button size="icon" variant="ghost">
            <Settings className="w-5 h-5" />
          </Button>
        }
      />

      {/* User Card */}
      <div className="px-5 pb-6">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src="" />
              <AvatarFallback className="bg-primary/20 text-primary text-xl">U</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-[22px] leading-[28px] font-semibold text-foreground mb-1">User Name</h2>
              <p className="text-[15px] leading-[22px] text-foreground-muted">user@example.com</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <main className="px-5 space-y-6">
        <div>
          <h2 className="text-[22px] leading-[28px] font-semibold text-foreground mb-3 px-2">Quick Settings</h2>
          
          {/* Quick Toggles */}
          <Card>
            <ListCell
              title="Dark Mode"
              subtitle="Switch to dark theme"
              leftElement={theme === "dark" ? <Moon className="w-5 h-5 text-foreground" /> : <Sun className="w-5 h-5 text-foreground" />}
              rightElement={<Switch checked={theme === "dark"} onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")} />}
              showChevron={false}
            />
            <ListCell
              title="Show Hijri Date"
              subtitle="Display Islamic calendar"
              leftElement={<Moon className="w-5 h-5 text-foreground" />}
              rightElement={<Switch checked={showHijri} onCheckedChange={setShowHijri} />}
              showChevron={false}
            />
            <ListCell
              title="Notifications"
              subtitle="Prayer & habit reminders"
              leftElement={<Bell className="w-5 h-5 text-foreground" />}
              rightElement={<Switch checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />}
              showChevron={false}
            />
          </Card>
        </div>

        <div>
          <h2 className="text-[22px] leading-[28px] font-semibold text-foreground mb-3 px-2">All Settings</h2>
          
          {/* Settings List */}
          <Card>
            {settings.map((setting, i) => (
              <ListCell
                key={i}
                title={setting.label}
                subtitle={setting.subtitle}
                leftElement={
                  <div className="w-12 h-12 rounded-card bg-muted flex items-center justify-center">
                    <setting.icon className="w-6 h-6 text-foreground" />
                  </div>
                }
                onPress={() => {}}
              />
            ))}
          </Card>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Profile;
