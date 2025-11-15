import { Card } from "@/components/ui/card";
import { Building2, BookOpen, Sparkles, Flame } from "lucide-react";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
}

function StatCard({ icon, label, value, color }: StatCardProps) {
  return (
    <div className="liquid-glass p-4 rounded-card space-y-2">
      <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center`}>
        {icon}
      </div>
      <p className="text-caption-1 text-foreground-muted">{label}</p>
      <p className="text-title-3 text-foreground font-bold">{value}</p>
    </div>
  );
}

export function QuickStats() {
  return (
    <Card className="liquid-glass p-6 space-y-4">
      <h3 className="text-headline text-foreground">Quick Stats</h3>
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          icon={<Building2 className="w-5 h-5 text-primary" />}
          label="Prayers"
          value="4/5"
          color="bg-primary/20"
        />
        <StatCard
          icon={<BookOpen className="w-5 h-5 text-secondary" />}
          label="Quran"
          value="15 min"
          color="bg-secondary/20"
        />
        <StatCard
          icon={<Sparkles className="w-5 h-5 text-primary" />}
          label="Dhikr"
          value="250"
          color="bg-primary/20"
        />
        <StatCard
          icon={<Flame className="w-5 h-5 text-primary" />}
          label="Streak"
          value="12 days"
          color="bg-primary/20"
        />
      </div>
    </Card>
  );
}
