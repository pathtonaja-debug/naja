import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Circle, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePrayerTimes } from "@/hooks/usePrayerTimes";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import medinaMosque from "@/assets/medina-mosque.jpg";

interface PrayerItemProps {
  name: string;
  time: string;
  isCompleted: boolean;
  isNext: boolean;
}

function PrayerItem({ name, time, isCompleted, isNext }: PrayerItemProps) {
  const Icon = isNext ? Clock : isCompleted ? Check : Circle;

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${
        isNext 
          ? "sage-card" 
          : isCompleted 
          ? "bg-white/60 backdrop-blur-sm" 
          : "bg-white/40 backdrop-blur-sm"
      }`}
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
        isNext 
          ? "bg-accent text-accent-foreground" 
          : isCompleted 
          ? "bg-primary text-primary-foreground" 
          : "bg-muted text-muted-foreground"
      }`}>
        <Icon className="w-5 h-5" strokeWidth={2} />
      </div>
      <span className={`text-sm sm:text-base font-semibold flex-1 ${
        isNext ? "text-primary-foreground" : "text-foreground"
      }`}>
        {name}
      </span>
      <span className={`text-sm sm:text-base font-display font-medium ${
        isNext ? "text-primary-foreground/80" : "text-foreground-muted"
      }`}>
        {time}
      </span>
    </motion.div>
  );
}

function PrayerItemSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/40">
      <Skeleton className="w-10 h-10 rounded-xl" />
      <Skeleton className="h-4 w-16 flex-1" />
      <Skeleton className="h-4 w-12" />
    </div>
  );
}

export function PrayerTimesList() {
  const navigate = useNavigate();
  const { prayerTimes, loading } = usePrayerTimes();

  if (loading) {
    return (
      <div className="relative rounded-card overflow-hidden">
        <div className="absolute inset-0 bg-muted" />
        <div className="relative z-10 p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-7 w-32" />
            <Skeleton className="h-8 w-20" />
          </div>
          <div className="space-y-2">
            <PrayerItemSkeleton />
            <PrayerItemSkeleton />
            <PrayerItemSkeleton />
            <PrayerItemSkeleton />
            <PrayerItemSkeleton />
          </div>
        </div>
      </div>
    );
  }

  if (!prayerTimes) {
    return (
      <Card className="glass-card p-6">
        <p className="text-body text-foreground-muted">Unable to load prayer times</p>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="relative rounded-card overflow-hidden"
    >
      {/* Background Image */}
      <img 
        src={medinaMosque} 
        alt="Medina Mosque" 
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/60" />
      
      {/* Content */}
      <div className="relative z-10 p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl sm:text-2xl font-display font-semibold text-white">
            Prayer Times
          </h3>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white/80 hover:text-white hover:bg-white/20"
            onClick={() => navigate("/calendar")}
          >
            Calendar
          </Button>
        </div>
        <div className="space-y-2">
          {prayerTimes.prayers.map((prayer, index) => (
            <motion.div
              key={prayer.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.08 }}
            >
              <PrayerItem
                name={prayer.name}
                time={prayer.time}
                isCompleted={prayer.isCompleted}
                isNext={prayer.isNext}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
