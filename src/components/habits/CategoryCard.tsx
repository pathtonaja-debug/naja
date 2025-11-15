import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import * as Icons from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface CategoryCardProps {
  category: string;
  icon: string;
  habitCount: number;
  completedToday: number;
  color?: string;
}

export default function CategoryCard({ 
  category, 
  icon, 
  habitCount, 
  completedToday,
  color = "#E8EAED"
}: CategoryCardProps) {
  const navigate = useNavigate();
  const IconComponent = (Icons as any)[icon] || Icons.Target;
  const percentage = habitCount > 0 ? (completedToday / habitCount) * 100 : 0;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(`/habits/category/${category}`)}
      className="bg-background/40 backdrop-blur-xl rounded-3xl p-6 border border-border/50 shadow-sm hover:shadow-md transition-all cursor-pointer"
    >
      <div className="flex items-start gap-4">
        <div 
          className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: color }}
        >
          <IconComponent className="w-7 h-7 text-foreground/80" strokeWidth={1.5} />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-[17px] font-semibold text-foreground mb-1 truncate">
            {category}
          </h3>
          <p className="text-[13px] text-muted-foreground mb-3">
            {habitCount} {habitCount === 1 ? 'habit' : 'habits'}
          </p>
          
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[12px]">
              <span className="text-muted-foreground">Today</span>
              <span className="font-medium text-foreground">
                {completedToday}/{habitCount}
              </span>
            </div>
            <Progress value={percentage} className="h-1.5" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
