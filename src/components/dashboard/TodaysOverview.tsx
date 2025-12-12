import { CheckCircle2, ListChecks, HandMetal, Flame } from "lucide-react";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

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
    <motion.div 
      whileHover={{ y: -2 }}
      className={`p-4 sm:p-5 rounded-card ${bgColor} border border-border/20 space-y-3`}
    >
      <div className="flex items-center justify-between">
        <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white/80 flex items-center justify-center`}>
          {icon}
        </div>
        <div className={`px-3 py-1.5 rounded-pill bg-white/70`}>
          <span className={`text-lg sm:text-xl font-display font-semibold ${color}`}>
            {total || value}
          </span>
        </div>
      </div>
      <div>
        <p className="text-xs text-foreground-muted font-medium uppercase tracking-wide">{label}</p>
        {total && (
          <p className="text-sm text-foreground/70 font-medium mt-0.5">{value}</p>
        )}
      </div>
    </motion.div>
  );
}

function StatCardSkeleton() {
  return (
    <div className="sage-card p-5 space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="w-12 h-12 rounded-2xl" />
        <Skeleton className="w-14 h-7 rounded-full" />
      </div>
      <div>
        <Skeleton className="h-3 w-16 mb-1" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  );
}

export function TodaysOverview() {
  const { stats, loading } = useDashboardStats();

  if (loading) {
    return (
      <div>
        <Skeleton className="h-7 w-40 mb-4" />
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <h3 className="text-2xl sm:text-3xl font-display font-semibold text-foreground mb-4">
        Today's Overview
      </h3>
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          icon={<CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />}
          label="Prayers"
          value="Completed"
          total={`${stats.prayersCompleted}/${stats.prayersTotal}`}
          color="text-primary-foreground"
          bgColor="sage-card"
        />
        <StatCard
          icon={<ListChecks className="w-5 h-5 sm:w-6 sm:h-6 text-secondary-foreground" />}
          label="Habits"
          value="Tracked"
          total={`${stats.habitsCompleted}/${stats.habitsTotal}`}
          color="text-secondary-foreground"
          bgColor="cream-card"
        />
        <StatCard
          icon={<HandMetal className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />}
          label="Dhikr"
          value="Count"
          total={String(stats.dhikrCount)}
          color="text-primary-foreground"
          bgColor="sage-card"
        />
        <StatCard
          icon={<Flame className="w-5 h-5 sm:w-6 sm:h-6 text-accent-foreground" />}
          label="Streak"
          value="Day"
          total={String(stats.currentStreak)}
          color="text-accent"
          bgColor="bg-accent/10"
        />
      </div>
    </motion.div>
  );
}
