import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Bell, Search } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import BottomNav from "@/components/BottomNav";
import { addReflection, listReflections } from "@/services/db";
import { useState, useEffect } from "react";

const Journal = () => {
  const [text, setText] = useState("");
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
    if (!text.trim()) return;
    await addReflection({
      date: new Date().toISOString().slice(0, 10),
      text,
      prompt: "Daily Reflection"
    });
    setText("");
    setShowInput(false);
    load();
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="px-6 pt-12 pb-6">
        <div className="flex items-center justify-between mb-8">
          <Avatar className="w-12 h-12">
            <AvatarImage src="" />
            <AvatarFallback className="bg-muted">U</AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-3">
            <Button 
              size="icon" 
              className="rounded-full bg-foreground hover:bg-foreground/90 w-12 h-12"
              onClick={() => setShowInput(!showInput)}
            >
              <Plus className="w-5 h-5 text-background" />
            </Button>
            <Button size="icon" variant="ghost" className="rounded-full w-12 h-12 bg-muted hover:bg-muted/80">
              <Bell className="w-5 h-5 text-foreground" />
            </Button>
          </div>
        </div>

        <h1 className="text-2xl font-medium text-foreground mb-2">
          Reflection Journal
        </h1>
        <p className="text-sm text-muted-foreground">Your spiritual journey</p>
      </header>

      {/* Main Content */}
      <main className="px-6 space-y-4">
        {/* New Reflection Input */}
        {showInput && (
          <Card className="border-border bg-card rounded-[2rem] p-5 shadow-card">
            <Textarea
              placeholder="Write your reflection..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-[120px] mb-3 border-none bg-muted resize-none"
            />
            <div className="flex gap-2">
              <Button onClick={save} className="flex-1 rounded-full">
                Save Reflection
              </Button>
              <Button 
                onClick={() => setShowInput(false)} 
                variant="ghost" 
                className="rounded-full"
              >
                Cancel
              </Button>
            </div>
          </Card>
        )}

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search reflections..."
            className="w-full pl-12 pr-4 py-3 bg-muted border-none rounded-[2rem] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Journal Entries */}
        {items.map((item) => (
          <Card key={item.id} className="border-border bg-card rounded-[2rem] p-5 shadow-card">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center shrink-0">
                <span className="text-lg">📝</span>
              </div>
              <div className="flex-1">
                <h3 className="text-foreground font-medium mb-2">
                  {item.prompt || "Daily Reflection"}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {item.text}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{new Date(item.date).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </main>

      <BottomNav />
    </div>
  );
};

export default Journal;
