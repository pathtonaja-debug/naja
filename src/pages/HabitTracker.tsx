import { useState, useEffect } from "react";
import { Plus, Search } from "lucide-react";
import { motion } from "framer-motion";
import { TopBar } from "@/components/ui/top-bar";
import BottomNav from "@/components/BottomNav";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import CategoryCard from "@/components/habits/CategoryCard";
import CreateHabitSheet from "@/components/habits/CreateHabitSheet";
import { initializeDefaultHabits, getAllHabits, getCategoryProgress } from "@/services/habitTracking";
import type { CategoryProgress } from "@/services/habitTracking";

// MVP: Limit to 4 categories
const MVP_CATEGORIES = ["Prayer", "Dhikr", "Reflection", "Quran"];

const categoryIcons: Record<string, string> = {
  "Prayer": "sunrise",
  "Dhikr": "sparkles",
  "Reflection": "heart",
  "Quran": "book-open",
};

const categoryColors: Record<string, string> = {
  "Prayer": "#FFE5D9",
  "Dhikr": "#FFC6FF",
  "Reflection": "#CAFFBF",
  "Quran": "#BDB2FF",
};

export default function HabitTracker() {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<CategoryProgress[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [createSheetOpen, setCreateSheetOpen] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      await initializeDefaultHabits();
      const progress = await getCategoryProgress();
      // Filter to MVP categories only
      const mvpProgress = progress.filter(cat => MVP_CATEGORIES.includes(cat.category));
      setCategories(mvpProgress);
    } catch (error) {
      console.error("Error loading habits:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredCategories = categories.filter(cat =>
    cat.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background pb-24">
      <TopBar title="Habit Tracker" />

      <div className="px-4 pt-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-bold text-foreground mb-1">
            Habit Tracker
          </h1>
          <p className="text-muted-foreground">
            Build consistency with faith (max 4 habits)
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search habits..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 rounded-2xl"
            />
          </div>
        </motion.div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-24 bg-muted rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : filteredCategories.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            {filteredCategories.map((cat, index) => (
              <motion.div
                key={cat.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <CategoryCard
                  category={cat.category}
                  icon={categoryIcons[cat.category] || "target"}
                  habitCount={cat.total}
                  completedToday={cat.completed}
                  color={categoryColors[cat.category] || "#E8EAED"}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <Search className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No habits found
            </h3>
            <p className="text-muted-foreground">
              Try adjusting your search
            </p>
          </motion.div>
        )}

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
          className="fixed bottom-24 right-6 z-40"
        >
          <Button
            size="lg"
            onClick={() => setCreateSheetOpen(true)}
            className="w-14 h-14 rounded-full shadow-lg"
          >
            <Plus className="w-6 h-6" />
          </Button>
        </motion.div>
      </div>

      <CreateHabitSheet
        open={createSheetOpen}
        onOpenChange={setCreateSheetOpen}
        onSuccess={loadData}
      />

      <BottomNav />
    </div>
  );
}