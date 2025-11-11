import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Bell, ChevronRight, Settings, Moon, Globe, User } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { useState } from "react";

const Profile = () => {
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
      {/* Header */}
      <header className="px-6 pt-12 pb-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-medium text-foreground">Profile</h1>
          <Button size="icon" variant="ghost" className="rounded-full w-12 h-12 bg-muted hover:bg-muted/80">
            <Settings className="w-5 h-5 text-foreground" />
          </Button>
        </div>

        {/* User Card */}
        <Card className="border-border bg-card rounded-[2rem] p-6 shadow-card">
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src="" />
              <AvatarFallback className="bg-primary/20 text-primary text-xl">U</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-xl font-medium text-foreground mb-1">User Name</h2>
              <p className="text-sm text-muted-foreground">user@example.com</p>
            </div>
          </div>
        </Card>
      </header>

      {/* Main Content */}
      <main className="px-6 space-y-4">
        <h2 className="text-lg font-medium text-foreground px-2">Quick Settings</h2>
        
        {/* Quick Toggles */}
        <Card className="border-border bg-card rounded-[2rem] p-5 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Moon className="w-5 h-5 text-foreground" />
              <div>
                <h3 className="text-foreground font-medium">Show Hijri Date</h3>
                <p className="text-sm text-muted-foreground">Display Islamic calendar</p>
              </div>
            </div>
            <Switch checked={showHijri} onCheckedChange={setShowHijri} />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-foreground" />
              <div>
                <h3 className="text-foreground font-medium">Notifications</h3>
                <p className="text-sm text-muted-foreground">Prayer & habit reminders</p>
              </div>
            </div>
            <Switch checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
          </div>
        </Card>

        <h2 className="text-lg font-medium text-foreground px-2 mt-6">All Settings</h2>
        
        {/* Settings List */}
        {settings.map((setting, i) => (
          <Card key={i} className="border-border bg-card rounded-[2rem] p-5 shadow-card">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center shrink-0">
                <setting.icon className="w-6 h-6 text-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="text-foreground font-medium mb-1">{setting.label}</h3>
                <p className="text-sm text-muted-foreground">{setting.subtitle}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </Card>
        ))}
      </main>

      <BottomNav />
    </div>
  );
};

export default Profile;
