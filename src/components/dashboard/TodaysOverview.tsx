import { CheckCircle2, ListChecks, HandMetal, Flame } from "lucide-react";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
  bgColor: string;
  index: number;
}

function StatCard({ icon, label, value, color, bgColor, index }: StatCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05, duration: 0.2 }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className="liquid-glass p-2.5 rounded-xl space-y-1.5 cursor-pointer"
    >
      <div className="flex items-center gap-2">
        <div className={`w-7 h-7 rounded-lg ${bgColor} flex items-center justify-center`}>
          {icon}
        </div>
        <div className={`px-2 py-0.5 rounded-full ${bgColor}`}>
          <span className={`text-xs font-bold ${color}`}>{value}</span>
        </div>
      </div>
      <p className="text-[9px] text-foreground-muted font-medium">{label}</p>
    </motion.div>
  );
}

function StatCardSkeleton() {
  return (
    <div className="liquid-glass p-2.5 rounded-xl space-y-1.5">
      <div className="flex items-center gap-2">
        <Skeleton className="w-7 h-7 rounded-lg" />
        <Skeleton className="w-8 h-5 rounded-full" />
      </div>
      <Skeleton className="h-2 w-12" />
    </div>
  );
}

export function TodaysOverview() {
  const { stats, loading } = useDashboardStats();

  if (loading) {
    return (
      <div className="px-3 py-2">
        <Skeleton className="h-4 w-28 mb-2" />
        <div className="grid grid-cols-4 gap-2">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
      </div>
    );
  }

  const statCards = [
    {
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-primary" />,
      label: "Prayers",
      value: `${stats.prayersCompleted}/${stats.prayersTotal}`,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: <ListChecks className="w-3.5 h-3.5 text-secondary" />,
      label: "Habits",
      value: `${stats.habitsCompleted}/${stats.habitsTotal}`,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      icon: <HandMetal className="w-3.5 h-3.5 text-primary" />,
      label: "Dhikr",
      value: String(stats.dhikrCount),
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: <Flame className="w-3.5 h-3.5 text-accent" />,
      label: "Streak",
      value: `${stats.currentStreak}d`,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="px-3 py-2"
    >
      <h3 className="text-sm text-foreground font-semibold mb-2">Today</h3>
      <div className="grid grid-cols-4 gap-1.5">
        {statCards.map((stat, index) => (
          <StatCard key={stat.label} {...stat} index={index} />
        ))}
      </div>
    </motion.div>
  );
}
