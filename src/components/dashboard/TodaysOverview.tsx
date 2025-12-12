import { CheckCircle2, ListChecks, HandMetal, Flame } from "lucide-react";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { Skeleton } from "@/components/ui/skeleton";

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
    <div className="liquid-glass p-3 sm:p-5 rounded-card space-y-2 sm:space-y-3">
      <div className="flex items-center justify-between">
        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl ${bgColor} flex items-center justify-center`}>
          {icon}
        </div>
        <div className={`px-2 sm:px-3 py-1 rounded-pill ${bgColor}`}>
          <span className={`text-base sm:text-title-3 font-bold ${color}`}>{total || value}</span>
        </div>
      </div>
      <div>
        <p className="text-[10px] sm:text-caption-2 text-foreground-muted">{label}</p>
        <p className="text-base sm:text-title-2 text-foreground font-bold">{total ? value : ""}</p>
      </div>
    </div>
  );
}

function StatCardSkeleton() {
  return (
    <div className="liquid-glass p-5 rounded-card space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="w-12 h-12 rounded-2xl" />
        <Skeleton className="w-12 h-6 rounded-full" />
      </div>
      <div>
        <Skeleton className="h-3 w-16 mb-1" />
        <Skeleton className="h-5 w-20" />
      </div>
    </div>
  );
}

export function TodaysOverview() {
  const { stats, loading } = useDashboardStats();

  if (loading) {
    return (
      <div className="px-5 py-4">
        <Skeleton className="h-6 w-36 mb-4" />
        <div className="grid grid-cols-2 gap-3">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="px-5 py-4">
      <h3 className="text-title-2 text-foreground font-semibold mb-4">Today's Overview</h3>
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        <StatCard
          icon={<CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />}
          label="Prayers"
          value="Completed"
          total={`${stats.prayersCompleted}/${stats.prayersTotal}`}
          color="text-primary"
          bgColor="bg-primary/10"
        />
        <StatCard
          icon={<ListChecks className="w-5 h-5 sm:w-6 sm:h-6 text-secondary" />}
          label="Habits"
          value="Tracked"
          total={`${stats.habitsCompleted}/${stats.habitsTotal}`}
          color="text-secondary"
          bgColor="bg-secondary/10"
        />
        <StatCard
          icon={<HandMetal className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />}
          label="Dhikr"
          value="Count"
          total={String(stats.dhikrCount)}
          color="text-primary"
          bgColor="bg-primary/10"
        />
        <StatCard
          icon={<Flame className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />}
          label="Day"
          value="Streak"
          total={String(stats.currentStreak)}
          color="text-accent"
          bgColor="bg-accent/10"
        />
      </div>
    </div>
  );
}