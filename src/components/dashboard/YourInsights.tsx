import { BarChart3 } from "lucide-react";

export function YourInsights() {
  return (
    <div className="px-5 py-4">
      <div className="liquid-glass p-6 rounded-card bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-caption-1 text-foreground-muted uppercase tracking-wide mb-1">THIS WEEK</p>
            <h3 className="text-title-1 text-foreground font-bold">Your Insights</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-background/50 backdrop-blur-sm flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-foreground" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 mt-6">
          <div className="bg-background/50 backdrop-blur-sm rounded-card p-4 text-center">
            <p className="text-4xl font-bold text-foreground mb-1">95%</p>
            <p className="text-caption-2 text-foreground-muted">Prayer Rate</p>
          </div>
          <div className="bg-background/50 backdrop-blur-sm rounded-card p-4 text-center">
            <p className="text-4xl font-bold text-foreground mb-1">3.5h</p>
            <p className="text-caption-2 text-foreground-muted">Quran Time</p>
          </div>
          <div className="bg-background/50 backdrop-blur-sm rounded-card p-4 text-center">
            <p className="text-4xl font-bold text-foreground mb-1">18</p>
            <p className="text-caption-2 text-foreground-muted">Good Deeds</p>
          </div>
        </div>
      </div>
    </div>
  );
}
