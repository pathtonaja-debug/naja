import { Card } from "@/components/ui/card";
import { Building2, BookOpen, Sparkles, Flame } from "lucide-react";
import { motion } from "framer-motion";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  colorClass: string;
  bgClass: string;
  index: number;
}

function StatCard({ icon, label, value, colorClass, bgClass, index }: StatCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      className="bg-card border border-border p-4 rounded-xl space-y-2"
    >
      <div className={`w-10 h-10 rounded-full ${bgClass} flex items-center justify-center`}>
        {icon}
      </div>
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="text-base text-foreground font-bold">{value}</p>
    </motion.div>
  );
}

export function QuickStats() {
  const stats = [
    {
      icon: <Building2 className="w-5 h-5 text-semantic-coral-dark" />,
      label: "Prayers",
      value: "4/5",
      colorClass: "text-semantic-coral-dark",
      bgClass: "bg-semantic-coral-soft",
    },
    {
      icon: <BookOpen className="w-5 h-5 text-semantic-violet-dark" />,
      label: "Quran",
      value: "15 min",
      colorClass: "text-semantic-violet-dark",
      bgClass: "bg-semantic-violet-soft",
    },
    {
      icon: <Sparkles className="w-5 h-5 text-semantic-blue-dark" />,
      label: "Dhikr",
      value: "250",
      colorClass: "text-semantic-blue-dark",
      bgClass: "bg-semantic-blue-soft",
    },
    {
      icon: <Flame className="w-5 h-5 text-semantic-gold-dark" />,
      label: "Streak",
      value: "12 days",
      colorClass: "text-semantic-gold-dark",
      bgClass: "bg-semantic-gold-soft",
    },
  ];

  return (
    <Card className="bg-card border border-border p-6 space-y-4">
      <h3 className="text-headline text-foreground font-semibold">Quick Stats</h3>
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat, index) => (
          <StatCard key={stat.label} {...stat} index={index} />
        ))}
      </div>
    </Card>
  );
}
