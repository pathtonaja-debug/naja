import * as React from "react";
import { cn } from "@/lib/utils";

interface ProgressRingProps {
  progress: number; // 0-100
  size?: number; // diameter in pixels
  strokeWidth?: number;
  className?: string;
  label?: string;
  sublabel?: string;
  gradient?: boolean;
}

const ProgressRing = React.forwardRef<SVGSVGElement, ProgressRingProps>(
  ({ progress, size = 48, strokeWidth = 4, className, label, sublabel, gradient = true }, ref) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress / 100) * circumference;
    const gradientId = React.useId();

    return (
      <div className={cn("flex flex-col items-center gap-2", className)}>
        <svg
          ref={ref}
          width={size}
          height={size}
          className="transform -rotate-90"
        >
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(12, 90%, 60%)" />
              <stop offset="50%" stopColor="hsl(280, 85%, 55%)" />
              <stop offset="100%" stopColor="hsl(210, 100%, 55%)" />
            </linearGradient>
          </defs>
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth={strokeWidth}
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={gradient ? `url(#${gradientId})` : "hsl(var(--primary))"}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-med ease-ios"
          />
        </svg>
        {label && (
          <div className="text-center">
            <div className="text-[15px] leading-[22px] font-medium text-foreground">
              {label}
            </div>
            {sublabel && (
              <div className="text-[12px] leading-[18px] text-foreground-muted">
                {sublabel}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
);
ProgressRing.displayName = "ProgressRing";

export { ProgressRing };
