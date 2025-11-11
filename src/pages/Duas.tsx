import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Bell, Search, Heart } from "lucide-react";
import BottomNav from "@/components/BottomNav";

const Duas = () => {
  const duas = [
    { title: "Morning Protection", category: "Protection", favorite: true },
    { title: "Gratitude Dua", category: "Gratitude", favorite: true },
    { title: "Patience & Strength", category: "Patience", favorite: false },
    { title: "Healing Dua", category: "Healing", favorite: false },
  ];

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
            <Button size="icon" className="rounded-full bg-foreground hover:bg-foreground/90 w-12 h-12">
              <Plus className="w-5 h-5 text-background" />
            </Button>
            <Button size="icon" variant="ghost" className="rounded-full w-12 h-12 bg-muted hover:bg-muted/80">
              <Bell className="w-5 h-5 text-foreground" />
            </Button>
          </div>
        </div>

        <h1 className="text-2xl font-medium text-foreground mb-2">
          Dua Library
        </h1>
        <p className="text-sm text-muted-foreground">Your personal collection</p>
      </header>

      {/* Main Content */}
      <main className="px-6 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search duas by theme..."
            className="w-full pl-12 pr-4 py-3 bg-muted border-none rounded-[2rem] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Duas List */}
        {duas.map((dua, i) => (
          <Card key={i} className="border-border bg-card rounded-[2rem] p-5 shadow-card">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-foreground font-medium">{dua.title}</h3>
                  {dua.favorite && (
                    <Heart className="w-4 h-4 text-primary fill-primary" />
                  )}
                </div>
                <Badge className="rounded-full bg-primary/10 text-primary hover:bg-primary/15 border-primary/20">
                  {dua.category}
                </Badge>
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="rounded-full w-10 h-10 bg-muted hover:bg-muted/80"
              >
                <span className="text-lg">→</span>
              </Button>
            </div>
          </Card>
        ))}
      </main>

      <BottomNav />
    </div>
  );
};

export default Duas;
