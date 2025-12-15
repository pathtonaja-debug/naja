import { useMemo } from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface PasswordStrengthIndicatorProps {
  password: string;
}

interface Requirement {
  label: string;
  test: (password: string) => boolean;
}

const requirements: Requirement[] = [
  { label: "At least 8 characters", test: (p) => p.length >= 8 },
  { label: "Uppercase letter", test: (p) => /[A-Z]/.test(p) },
  { label: "Lowercase letter", test: (p) => /[a-z]/.test(p) },
  { label: "Number", test: (p) => /[0-9]/.test(p) },
  { label: "Special character (!@#$%^&*)", test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
];

export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  const { strength, passedCount } = useMemo(() => {
    const passed = requirements.filter((req) => req.test(password));
    const count = passed.length;
    
    let strengthLevel: "weak" | "fair" | "good" | "strong" = "weak";
    if (count >= 5) strengthLevel = "strong";
    else if (count >= 4) strengthLevel = "good";
    else if (count >= 3) strengthLevel = "fair";
    
    return { strength: strengthLevel, passedCount: count };
  }, [password]);

  const strengthColors = {
    weak: "bg-destructive",
    fair: "bg-orange-500",
    good: "bg-yellow-500",
    strong: "bg-green-500",
  };

  const strengthLabels = {
    weak: "Weak",
    fair: "Fair",
    good: "Good",
    strong: "Strong",
  };

  if (!password) return null;

  return (
    <div className="space-y-3 mt-2">
      {/* Strength bar */}
      <div className="space-y-1">
        <div className="flex justify-between items-center text-xs">
          <span className="text-muted-foreground">Password strength</span>
          <span className={cn(
            "font-medium",
            strength === "strong" && "text-green-500",
            strength === "good" && "text-yellow-500",
            strength === "fair" && "text-orange-500",
            strength === "weak" && "text-destructive"
          )}>
            {strengthLabels[strength]}
          </span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full transition-all duration-300 rounded-full",
              strengthColors[strength]
            )}
            style={{ width: `${(passedCount / requirements.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Requirements checklist */}
      <ul className="space-y-1">
        {requirements.map((req) => {
          const passed = req.test(password);
          return (
            <li
              key={req.label}
              className={cn(
                "flex items-center gap-2 text-xs transition-colors",
                passed ? "text-green-500" : "text-muted-foreground"
              )}
            >
              {passed ? (
                <Check className="w-3 h-3" />
              ) : (
                <X className="w-3 h-3" />
              )}
              {req.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function validatePasswordStrength(password: string): { valid: boolean; message: string } {
  const failedRequirements = requirements.filter((req) => !req.test(password));
  
  if (failedRequirements.length === 0) {
    return { valid: true, message: "" };
  }
  
  return {
    valid: false,
    message: `Password must have: ${failedRequirements.map((r) => r.label.toLowerCase()).join(", ")}`,
  };
}
