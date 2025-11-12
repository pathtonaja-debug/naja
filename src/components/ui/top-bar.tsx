import * as React from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TopBarProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
  avatarSrc?: string;
  avatarFallback?: string;
  blurOnScroll?: boolean;
}

const TopBar = React.forwardRef<HTMLDivElement, TopBarProps>(
  ({ className, title, leftElement, rightElement, avatarSrc, avatarFallback, blurOnScroll = true, ...props }, ref) => {
    const [isScrolled, setIsScrolled] = React.useState(false);

    React.useEffect(() => {
      if (!blurOnScroll) return;

      const handleScroll = () => {
        setIsScrolled(window.scrollY > 10);
      };

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }, [blurOnScroll]);

    return (
      <div
        ref={ref}
        className={cn(
          "sticky top-0 z-40 px-5 py-3 transition-all duration-med ease-ios",
          "flex items-center justify-between min-h-[60px]",
          isScrolled && blurOnScroll && "backdrop-blur-xl bg-glass border-b border-border",
          className
        )}
        {...props}
      >
        {/* Left */}
        <div className="flex items-center gap-3 min-w-[44px]">
          {leftElement || (
            avatarSrc !== undefined && (
              <Avatar className="w-9 h-9">
                <AvatarImage src={avatarSrc} />
                <AvatarFallback className="text-sm">{avatarFallback || "U"}</AvatarFallback>
              </Avatar>
            )
          )}
        </div>

        {/* Center */}
        {title && (
          <h1 className="text-[17px] leading-[22px] font-semibold text-foreground text-center flex-1">
            {title}
          </h1>
        )}

        {/* Right */}
        <div className="flex items-center gap-2 min-w-[44px] justify-end">
          {rightElement}
        </div>
      </div>
    );
  }
);
TopBar.displayName = "TopBar";

export { TopBar };
