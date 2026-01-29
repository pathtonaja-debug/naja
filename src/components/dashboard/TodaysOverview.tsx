import { CheckCircle2, ListChecks, HandMetal, Flame } from "lucide-react";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  colorClass: string;
  bgClass: string;
  index: number;
}

function StatCard({ icon, label, value, colorClass, bgClass, index }: StatCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05, duration: 0.2 }}
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.98 }}
      className="bg-card border border-border p-2 rounded-lg space-y-1"
    >
      <div className="flex items-center gap-1.5">
        <div className={`w-6 h-6 rounded-md ${bgClass} flex items-center justify-center`}>
          {icon}
        </div>
        <div className={`px-1.5 py-0.5 rounded-full ${bgClass}`}>
          <span className={`text-[10px] font-bold ${colorClass}`}>{value}</span>
        </div>
      </div>
      <p className="text-[9px] text-muted-foreground font-medium">{label}</p>
    </motion.div>
  );
}

function StatCardSkeleton() {
  return (
    <div className="bg-card border border-border p-2 rounded-lg space-y-1">
      <div className="flex items-center gap-1.5">
        <Skeleton className="w-6 h-6 rounded-md" />
        <Skeleton className="w-7 h-4 rounded-full" />
      </div>
      <Skeleton className="h-2 w-10" />
    </div>
  );
}

export function TodaysOverview() {
  const { stats, loading } = useDashboardStats();

  if (loading) {
    return (
      <div className="px-4 py-1.5">
        <Skeleton className="h-3.5 w-20 mb-1.5" />
        <div className="grid grid-cols-4 gap-1.5">
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
      icon: <CheckCircle2 className="w-3 h-3 text-semantic-coral-dark" />,
      label: "Prayers",
      value: `${stats.prayersCompleted}/${stats.prayersTotal}`,
      colorClass: "text-semantic-coral-dark",
      bgClass: "bg-semantic-coral-soft",
    },
    {
      icon: <ListChecks className="w-3 h-3 text-semantic-violet-dark" />,
      label: "Habits",
      value: `${stats.habitsCompleted}/${stats.habitsTotal}`,
      colorClass: "text-semantic-violet-dark",
      bgClass: "bg-semantic-violet-soft",
    },
    {
      icon: <HandMetal className="w-3 h-3 text-semantic-blue-dark" />,
      label: "Dhikr",
      value: String(stats.dhikrCount),
      colorClass: "text-semantic-blue-dark",
      bgClass: "bg-semantic-blue-soft",
    },
    {
      icon: <Flame className="w-3 h-3 text-semantic-gold-dark" />,
      label: "Streak",
      value: `${stats.currentStreak}d`,
      colorClass: "text-semantic-gold-dark",
      bgClass: "bg-semantic-gold-soft",
    },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="px-4 py-1.5"
    >
      <h3 className="text-[13px] text-foreground font-semibold mb-1.5">Today</h3>
      <div className="grid grid-cols-4 gap-1.5">
        {statCards.map((stat, index) => (
          <StatCard key={stat.label} {...stat} index={index} />
        ))}
      </div>
    </motion.div>
  );
}
