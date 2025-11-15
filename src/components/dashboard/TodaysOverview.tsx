import { CheckCircle2, ListChecks, HandMetal, Flame } from "lucide-react";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  total?: string;
  color: string;
  bgColor: string;
}

function StatCard({ icon, label, value, total, color, bgColor }: StatCardProps) {
  return (
    <div className="liquid-glass p-5 rounded-card space-y-3">
      <div className="flex items-center justify-between">
        <div className={`w-12 h-12 rounded-2xl ${bgColor} flex items-center justify-center`}>
          {icon}
        </div>
        <div className={`px-3 py-1 rounded-pill ${bgColor}`}>
          <span className={`text-title-3 font-bold ${color}`}>{total || value}</span>
        </div>
      </div>
      <div>
        <p className="text-caption-2 text-foreground-muted">{label}</p>
        <p className="text-title-2 text-foreground font-bold">{total ? value : ""}</p>
      </div>
    </div>
  );
}

export function TodaysOverview() {
  return (
    <div className="px-5 py-4">
      <h3 className="text-title-2 text-foreground font-semibold mb-4">Today's Overview</h3>
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          icon={<CheckCircle2 className="w-6 h-6 text-primary" />}
          label="Prayers"
          value="Completed"
          total="4/5"
          color="text-primary"
          bgColor="bg-primary/10"
        />
        <StatCard
          icon={<ListChecks className="w-6 h-6 text-secondary" />}
          label="Habits"
          value="Tracked"
          total="7/10"
          color="text-secondary"
          bgColor="bg-secondary/10"
        />
        <StatCard
          icon={<HandMetal className="w-6 h-6 text-primary" />}
          label="Dhikr"
          value="Count"
          total="250"
          color="text-primary"
          bgColor="bg-primary/10"
        />
        <StatCard
          icon={<Flame className="w-6 h-6 text-accent" />}
          label="Day"
          value="Streak"
          total="12"
          color="text-accent"
          bgColor="bg-accent/10"
        />
      </div>
    </div>
  );
}
