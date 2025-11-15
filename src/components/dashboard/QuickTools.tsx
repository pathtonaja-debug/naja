import { Button } from "@/components/ui/button";
import { HandMetal, BookOpen, Hand } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function QuickTools() {
  const navigate = useNavigate();

  const tools = [
    { 
      icon: Hand, 
      label: "Dua Builder", 
      color: "bg-primary/10",
      iconColor: "text-primary",
      onClick: () => navigate("/duas")
    },
    { 
      icon: HandMetal, 
      label: "Dhikr Counter", 
      color: "bg-secondary/10",
      iconColor: "text-secondary",
      onClick: () => {} // Scroll to dhikr counter
    },
    { 
      icon: BookOpen, 
      label: "Journal", 
      color: "bg-accent/10",
      iconColor: "text-accent",
      onClick: () => navigate("/journal")
    },
  ];

  return (
    <div className="px-5 py-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-title-2 text-foreground font-semibold">Quick Tools</h3>
        <Button variant="ghost" size="sm" className="text-primary">View All</Button>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {tools.map((tool) => (
          <button
            key={tool.label}
            onClick={tool.onClick}
            className="flex flex-col items-center gap-3 p-4 liquid-glass rounded-card hover:scale-[1.02] active:scale-[0.98] transition-transform"
          >
            <div className={`w-16 h-16 rounded-3xl ${tool.color} flex items-center justify-center`}>
              <tool.icon className={`w-7 h-7 ${tool.iconColor}`} />
            </div>
            <span className="text-caption-1 text-foreground text-center">{tool.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
