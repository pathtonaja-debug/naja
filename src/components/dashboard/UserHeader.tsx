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
    <div className="px-4 sm:px-5 pt-3 sm:pt-4 pb-2 sm:pb-3 flex items-center justify-between">
      <div className="flex items-center gap-2.5 sm:gap-3">
        <Avatar className="w-11 h-11 sm:w-14 sm:h-14 ring-2 ring-background ring-offset-2">
          <AvatarImage src={avatarUrl} />
          <AvatarFallback className="bg-gradient-primary text-primary-foreground text-base sm:text-lg font-semibold">
            {userName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-[10px] sm:text-caption-2 text-foreground-muted">السلام عليکم</p>
          <h2 className="text-lg sm:text-title-2 text-foreground font-semibold">{userName}</h2>
        </div>
      </div>
      <div className="flex items-center gap-1 sm:gap-2">
        <Button 
          size="icon" 
          variant="ghost"
          className="relative h-9 w-9 sm:h-10 sm:w-10"
          onClick={onNotificationClick}
        >
          <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="absolute top-1.5 sm:top-2 right-1.5 sm:right-2 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-destructive rounded-full" />
        </Button>
        {hasCompanion && (
          <Button 
            size="icon" 
            variant="ghost"
            className="h-9 w-9 sm:h-10 sm:w-10"
            onClick={onCompanionClick}
          >
            <Bot className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
        )}
      </div>
    </div>
  );
}
