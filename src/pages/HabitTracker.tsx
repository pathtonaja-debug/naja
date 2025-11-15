import { useState, useEffect } from "react";
import { Plus, Search } from "lucide-react";
import { motion } from "framer-motion";
import { TopBar } from "@/components/ui/top-bar";
import BottomNav from "@/components/BottomNav";
import AICompanion from "@/components/AICompanion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import CategoryCard from "@/components/habits/CategoryCard";
import CreateHabitSheet from "@/components/habits/CreateHabitSheet";
import { initializeDefaultHabits, getAllHabits, getCategoryProgress } from "@/services/habitTracking";
import type { CategoryProgress } from "@/services/habitTracking";

const categoryIcons: Record<string, string> = {
  "Salah": "sunrise",
  "Quran": "book-open",
  "Dhikr": "sparkles",
  "Dua": "hand",
  "Fasting": "moon",
  "Charity": "heart",
  "One good deed of the day": "smile",
  "Custom": "target"
};

const categoryColors: Record<string, string> = {
  "Salah": "#FFE5D9",
  "Quran": "#BDB2FF",
  "Dhikr": "#FFC6FF",
  "Dua": "#CAFFBF",
  "Fasting": "#9BF6FF",
  "Charity": "#FFADAD",
  "One good deed of the day": "#A0C4FF",
  "Custom": "#E8EAED"
};

export default function HabitTracker() {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<CategoryProgress[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [createSheetOpen, setCreateSheetOpen] = useState(false);
  const [companionOpen, setCompanionOpen] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      await initializeDefaultHabits();
      const progress = await getCategoryProgress();
      setCategories(progress);
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
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-accent/5 pb-24">
      <TopBar title="Habit Tracker" />

      <div className="px-4 pt-safe">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-[28px] font-bold text-foreground mb-1">
            Habit Tracker
          </h1>
          <p className="text-[15px] text-muted-foreground">
            Build consistency with faith
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 bg-background/40 backdrop-blur-xl border-border/50 rounded-2xl"
            />
          </div>
        </motion.div>

        {/* Categories Grid */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-32 bg-background/40 backdrop-blur-xl rounded-3xl animate-pulse"
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
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-accent/20 flex items-center justify-center">
              <Search className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-[17px] font-semibold text-foreground mb-2">
              No categories found
            </h3>
            <p className="text-[15px] text-muted-foreground">
              Try adjusting your search
            </p>
          </motion.div>
        )}

        {/* Floating Add Button */}
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

      <AICompanion onClose={() => setCompanionOpen(false)} isOpen={companionOpen} />
      <BottomNav onChatbotOpen={() => setCompanionOpen(true)} />
    </div>
  );
}
