import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Plus, 
  Search, 
  Heart, 
  Clock, 
  Sparkles,
  ArrowLeft,
  MoreVertical,
  Star
} from "lucide-react";
import BottomNav from "@/components/BottomNav";
import DuaBuilderFlow from "@/components/dua/DuaBuilderFlow";
import { supabase } from "@/integrations/supabase/client";
import { getDeviceId } from "@/lib/deviceId";
import { useToast } from "@/hooks/use-toast";

interface Dua {
  id: string;
  title: string;
  category: string | null;
  content: any;
  is_favorite: boolean;
  reminder_time: string | null;
  created_at: string;
}

const Duas = () => {
  const { toast } = useToast();
  const [showBuilder, setShowBuilder] = useState(false);
  const [duas, setDuas] = useState<Dua[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loadingDuas, setLoadingDuas] = useState(true);

  useEffect(() => {
    loadDuas();
  }, []);

  const loadDuas = async () => {
    try {
      const deviceId = getDeviceId();
      
      const { data, error } = await supabase
        .from('duas')
        .select('*')
        .eq('device_id', deviceId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDuas(data || []);
    } catch (error) {
      console.error('Error loading duas:', error);
      toast({
        title: "Error",
        description: "Failed to load duas. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoadingDuas(false);
    }
  };

  const toggleFavorite = async (duaId: string, currentFavorite: boolean) => {
    try {
      const { error } = await supabase
        .from('duas')
        .update({ is_favorite: !currentFavorite })
        .eq('id', duaId);

      if (error) throw error;

      setDuas(duas.map(d => 
        d.id === duaId ? { ...d, is_favorite: !currentFavorite } : d
      ));
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: "Error",
        description: "Failed to update favorite status",
        variant: "destructive"
      });
    }
  };

  const categories = Array.from(new Set(duas.map(d => d.category).filter(Boolean))) as string[];
  
  const filteredDuas = duas.filter(dua => {
    const matchesSearch = dua.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || dua.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (showBuilder) {
    return (
      <DuaBuilderFlow
        onComplete={() => {
          setShowBuilder(false);
          loadDuas();
        }}
        onCancel={() => setShowBuilder(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-lilac/30 via-pink/20 to-sky/30 pb-24">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background border-b border-border px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold text-foreground">My Duas</h1>
          </div>
          <Button
            onClick={() => setShowBuilder(true)}
            className="rounded-full bg-primary hover:bg-primary/90 h-12 px-6 whitespace-nowrap shrink-0"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Dua
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search duas..."
            className="rounded-full pl-12 h-12"
          />
        </div>
      </header>

      <main className="px-6 pt-6 space-y-6">
        {/* Categories */}
        {categories.length > 0 && (
          <ScrollArea className="w-full">
            <div className="flex gap-2 pb-2">
              <Badge
                onClick={() => setSelectedCategory(null)}
                className={`rounded-full cursor-pointer px-4 py-2 ${
                  !selectedCategory
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                All
              </Badge>
              {categories.map((category) => (
                <Badge
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full cursor-pointer px-4 py-2 whitespace-nowrap ${
                    selectedCategory === category
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </ScrollArea>
        )}

        {/* Empty State */}
        {filteredDuas.length === 0 && !loadingDuas && (
          <Card className="border-border bg-card rounded-[2rem] p-12 text-center">
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <Heart className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {searchQuery || selectedCategory ? 'No duas found' : 'No duas yet'}
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery || selectedCategory
                ? 'Try adjusting your search or filters'
                : 'Start building your first personal dua'}
            </p>
            {!searchQuery && !selectedCategory && (
              <Button
                onClick={() => setShowBuilder(true)}
                className="rounded-full bg-primary hover:bg-primary/90 px-8"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Your First Dua
              </Button>
            )}
          </Card>
        )}

        {/* Duas List */}
        <div className="space-y-4">
          {filteredDuas.map((dua) => (
            <Card key={dua.id} className="border-border bg-card rounded-[2rem] p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-foreground">
                      {dua.title}
                    </h3>
                    {dua.is_favorite && (
                      <Star className="w-4 h-4 text-primary fill-primary" />
                    )}
                  </div>
                  {dua.category && (
                    <Badge className="rounded-full bg-secondary/40 text-secondary-foreground mb-3">
                      {dua.category}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => toggleFavorite(dua.id, dua.is_favorite)}
                    className="rounded-full"
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        dua.is_favorite ? 'fill-primary text-primary' : 'text-muted-foreground'
                      }`}
                    />
                  </Button>
                  <Button size="icon" variant="ghost" className="rounded-full">
                    <MoreVertical className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Preview of dua content */}
              {dua.content?.step3_need && (
                <div className="bg-muted/30 rounded-2xl p-4 mb-4">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {dua.content.step3_need}
                  </p>
                </div>
              )}

              {/* Selected Names */}
              {dua.content?.step1_selected_names?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {dua.content.step1_selected_names.map((name: any, idx: number) => (
                    <Badge
                      key={idx}
                      className="rounded-full bg-primary/20 text-primary border-primary/30"
                    >
                      {name.transliteration}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                {dua.reminder_time && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{dua.reminder_time}</span>
                  </div>
                )}
                <span>
                  {new Date(dua.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>
            </Card>
          ))}
        </div>

        {/* AI Suggestions Card */}
        <Card className="border-border bg-secondary/20 rounded-[2rem] p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-2">
                Need inspiration?
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Get AI-powered suggestions for duas based on your current needs and emotions.
              </p>
              <Button
                variant="outline"
                className="rounded-full"
                onClick={() => {
                  toast({
                    title: "Coming soon",
                    description: "AI suggestions feature is under development"
                  });
                }}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Get Suggestions
              </Button>
            </div>
          </div>
        </Card>
      </main>

      <BottomNav />
    </div>
  );
};

export default Duas;
