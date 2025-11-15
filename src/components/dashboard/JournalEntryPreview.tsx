import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Quote, Plus, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function JournalEntryPreview() {
  const navigate = useNavigate();

  return (
    <div className="px-5 py-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-title-2 text-foreground font-semibold">Journal Entry</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-primary"
          onClick={() => navigate("/journal")}
        >
          View All
        </Button>
      </div>
      
      <div className="liquid-glass p-5 rounded-card space-y-4 mb-3">
        <div className="flex items-center justify-between">
          <span className="text-caption-1 text-foreground-muted">Today, 9:30 AM</span>
          <Button size="icon" variant="ghost" className="h-8 w-8">
            <Edit className="w-4 h-4 text-primary" />
          </Button>
        </div>
        
        <p className="text-body text-foreground leading-relaxed">
          "Started my day with gratitude. Alhamdulillah for another beautiful morning and the strength to continue my journey..."
        </p>
        
        <div className="flex gap-2">
          <Badge variant="secondary" className="rounded-pill">Gratitude</Badge>
          <Badge variant="secondary" className="rounded-pill">Morning</Badge>
        </div>
      </div>

      <Button
        variant="default"
        onClick={() => navigate("/journal")}
        className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground"
      >
        <Plus className="w-5 h-5 mr-2" />
        New Entry
      </Button>

      <div className="liquid-glass p-5 rounded-card mt-4 bg-primary/5 border border-primary/10">
        <div className="flex gap-4">
          <Quote className="w-8 h-8 text-primary/40 flex-shrink-0" />
          <div>
            <p className="text-body text-foreground leading-relaxed mb-3 italic">
              "And whoever relies upon Allah - then He is sufficient for him. Indeed, Allah will accomplish His purpose."
            </p>
            <p className="text-caption-2 text-foreground-muted font-medium">— Quran 65:3</p>
          </div>
        </div>
      </div>
    </div>
  );
}
