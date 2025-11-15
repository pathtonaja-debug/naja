import { MessageCircle, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface AICompanionCardProps {
  name?: string;
  message?: string;
  avatarUrl?: string;
  onChatClick?: () => void;
  onSettingsClick?: () => void;
}

export function AICompanionCard({
  name = "Noor",
  message = "Remember, every small good deed is a seed of light. How can I support your spiritual journey today?",
  avatarUrl,
  onChatClick,
  onSettingsClick
}: AICompanionCardProps) {
  return (
    <div className="px-5 py-3">
      <div className="liquid-glass p-6 rounded-card bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12 border-2 border-dashed border-primary/30">
              <AvatarImage src={avatarUrl} />
              <AvatarFallback className="bg-primary/20 text-primary">
                {name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-caption-2 text-foreground-muted">Your AI Companion</p>
              <h4 className="text-headline font-semibold text-foreground">{name}</h4>
            </div>
          </div>
          <Button 
            size="icon" 
            variant="ghost"
            onClick={onSettingsClick}
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>

        <div className="bg-background/50 backdrop-blur-sm p-4 rounded-card">
          <p className="text-body text-foreground leading-relaxed">"{message}"</p>
        </div>

        <Button
          onClick={onChatClick}
          className="w-full bg-background/70 hover:bg-background/90 text-foreground"
          variant="secondary"
        >
          <MessageCircle className="w-5 h-5 mr-2" />
          Chat with {name}
        </Button>
      </div>
    </div>
  );
}
