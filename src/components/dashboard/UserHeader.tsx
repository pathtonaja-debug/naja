import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Bell, Bot } from "lucide-react";

interface UserHeaderProps {
  userName?: string;
  avatarUrl?: string;
  onNotificationClick?: () => void;
  onCompanionClick?: () => void;
  hasCompanion?: boolean;
}

export function UserHeader({ 
  userName = "User", 
  avatarUrl,
  onNotificationClick,
  onCompanionClick,
  hasCompanion = false
}: UserHeaderProps) {
  return (
    <div className="px-5 pt-4 pb-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Avatar className="w-14 h-14 ring-2 ring-background ring-offset-2">
          <AvatarImage src={avatarUrl} />
          <AvatarFallback className="bg-gradient-primary text-primary-foreground text-lg font-semibold">
            {userName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-caption-2 text-foreground-muted">السلام عليکم</p>
          <h2 className="text-title-2 text-foreground font-semibold">{userName}</h2>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button 
          size="icon" 
          variant="ghost"
          className="relative"
          onClick={onNotificationClick}
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full" />
        </Button>
        {hasCompanion && (
          <Button 
            size="icon" 
            variant="ghost"
            onClick={onCompanionClick}
          >
            <Bot className="w-5 h-5" />
          </Button>
        )}
      </div>
    </div>
  );
}
