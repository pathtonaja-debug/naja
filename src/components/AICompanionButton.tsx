import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AICompanionButtonProps {
  onClick?: () => void;
  className?: string;
}

const AICompanionButton = ({ onClick, className }: AICompanionButtonProps) => {
  return (
    <Button
      onClick={onClick}
      className={cn(
        "fab w-12 h-12 p-0",
        "fixed top-4 right-4 z-50",
        "bg-gradient-primary text-white",
        "hover:scale-110 active:scale-95",
        className
      )}
      aria-label="Open AI Companion"
    >
      <MessageCircle className="w-5 h-5" />
    </Button>
  );
};

export default AICompanionButton;
