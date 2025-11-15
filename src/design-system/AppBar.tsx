import * as React from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AppBarProps {
  greeting?: string;
  subtitle?: string;
  avatarSrc?: string;
  avatarFallback?: string;
  rightElement?: React.ReactNode;
  className?: string;
}

const AppBar = React.forwardRef<HTMLDivElement, AppBarProps>(
  ({ greeting, subtitle, avatarSrc, avatarFallback = "U", rightElement, className }, ref) => {
    return (
      <header ref={ref} className={cn("px-5 pt-12 pb-6", className)}>
        <div className="flex items-start justify-between mb-6">
          <Avatar className="w-12 h-12 ring-2 ring-pink/20">
            <AvatarImage src={avatarSrc} />
            <AvatarFallback className="bg-pink text-ink900 text-lg font-medium">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
          
          {rightElement && (
            <div className="flex items-center gap-2">
              {rightElement}
            </div>
          )}
        </div>

        {greeting && (
          <div>
            <h1 className="text-[34px] leading-[40px] font-semibold text-ink900 mb-1">
              {greeting}
            </h1>
            {subtitle && (
              <p className="text-[17px] leading-[24px] text-ink400">
                {subtitle}
              </p>
            )}
          </div>
        )}
      </header>
    );
  }
);
AppBar.displayName = "AppBar";

export { AppBar };
