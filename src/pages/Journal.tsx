import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TopBar } from "@/components/ui/top-bar";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, BookOpen } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import BottomNav from "@/components/BottomNav";
import { addReflection, listReflections } from "@/services/db";
import { reflectionPrompts, moodOptions } from "@/components/journal/ReflectionPrompts";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import quranWatercolor from "@/assets/illustrations/quran-watercolor.png";

const Journal = () => {
  const [text, setText] = useState("");
  const [selectedPrompt, setSelectedPrompt] = useState(reflectionPrompts[0]);
  const [selectedMood, setSelectedMood] = useState("");
  const [items, setItems] = useState<any[]>([]);
  const [showInput, setShowInput] = useState(false);

  async function load() {
    const reflections = await listReflections();
    setItems(reflections);
  }

  useEffect(() => {
    load();
  }, []);

  async function save() {
    if (!text.trim()) {
      toast.error("Please write something");
      return;
    }

    try {
      await addReflection({
        date: new Date().toISOString().slice(0, 10),
        text,
        prompt: selectedPrompt.prompt,
        mood: selectedMood || selectedPrompt.mood,
      });

      toast.success("Reflection saved");
      setText("");
      setSelectedMood("");
      setShowInput(false);
      setSelectedPrompt(reflectionPrompts[0]);
      load();
    } catch (error) {
      console.error("Error saving reflection:", error);
      toast.error("Failed to save reflection");
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-background pb-24 relative overflow-hidden"
    >
      {/* Watercolor decoration */}
      <motion.img 
        src={quranWatercolor}
        alt=""
        className="absolute top-24 right-0 w-32 h-32 object-contain opacity-20 pointer-events-none"
        initial={{ opacity: 0, rotate: 10 }}
        animate={{ opacity: 0.2, rotate: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      />

      <TopBar
        title="Journal"
        rightElement={
          <Button 
            size="icon" 
            variant="ghost"
            onClick={() => setShowInput(!showInput)}
          >
            <Plus className="w-5 h-5" />
          </Button>
        }
      />

      <motion.div 
        className="px-5 pt-2 pb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h1 className="text-2xl font-semibold text-foreground mb-1">
          Daily Reflections
        </h1>
        <p className="text-muted-foreground text-sm">
          One entry per day to reflect on your journey
        </p>
      </motion.div>

      <main className="px-5 space-y-5">
        <AnimatePresence>
          {showInput && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="p-5">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Today's Prompt</label>
                    <div className="grid grid-cols-4 gap-2">
                      {reflectionPrompts.map((prompt) => (
                        <button
                          key={prompt.id}
                          onClick={() => setSelectedPrompt(prompt)}
                          className={`flex flex-col items-center gap-1 p-3 rounded-xl border transition-all ${
                            selectedPrompt.id === prompt.id
                              ? "border-primary bg-primary/10"
                              : "border-border bg-card hover:bg-muted/50"
                          }`}
                        >
                          <span className="text-2xl">{prompt.icon}</span>
                          <span className="text-xs text-center text-foreground">{prompt.title}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-muted/50 border border-border">
                    <p className="text-sm text-muted-foreground italic">{selectedPrompt.prompt}</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">How are you feeling?</label>
                    <Select value={selectedMood} onValueChange={setSelectedMood}>
                      <SelectTrigger className="rounded-xl">
                        <SelectValue placeholder="Select mood" />
                      </SelectTrigger>
                      <SelectContent>
                        {moodOptions.map((mood) => (
                          <SelectItem key={mood.value} value={mood.value}>
                            {mood.emoji} {mood.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Textarea
                    placeholder="Write your reflection..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="min-h-[150px] resize-none rounded-xl"
                  />

                  <div className="flex items-center gap-2 justify-end">
                    <Button 
                      onClick={() => setShowInput(false)} 
                      variant="ghost"
                    >
                      Cancel
                    </Button>
                    <Button onClick={save}>
                      Save Reflection
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <Card className="p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No reflections yet</h3>
              <p className="text-muted-foreground mb-4 text-sm">
                Start your spiritual journey by writing your first reflection
              </p>
              <Button onClick={() => setShowInput(true)}>
                <Plus className="w-4 h-4 mr-2" />
                New Reflection
              </Button>
            </Card>
          </motion.div>
        ) : (
          items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
            >
              <Card className="p-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                    <span className="text-lg">
                      {moodOptions.find(m => m.value === item.mood)?.emoji || "📝"}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-sm font-semibold text-foreground">
                        {item.prompt || "Daily Reflection"}
                      </h3>
                      {item.mood && (
                        <Badge variant="secondary" className="rounded-full text-xs">
                          {moodOptions.find(m => m.value === item.mood)?.label}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-foreground mb-3 whitespace-pre-wrap">
                      {item.text}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(item.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </main>

      <BottomNav />
    </motion.div>
  );
};

export default Journal;
