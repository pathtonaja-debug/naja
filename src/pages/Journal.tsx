import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Bell, 
  Search, 
  Image as ImageIcon, 
  X,
  Calendar,
  Filter
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import BottomNav from "@/components/BottomNav";
import { addReflection, listReflections, uploadReflectionPhoto } from "@/services/db";
import { reflectionPrompts, moodOptions } from "@/components/journal/ReflectionPrompts";
import { VoiceRecorder } from "@/components/journal/VoiceRecorder";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";

const Journal = () => {
  const [text, setText] = useState("");
  const [selectedPrompt, setSelectedPrompt] = useState(reflectionPrompts[0]);
  const [selectedMood, setSelectedMood] = useState("");
  const [items, setItems] = useState<any[]>([]);
  const [filteredItems, setFilteredItems] = useState<any[]>([]);
  const [showInput, setShowInput] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMood, setFilterMood] = useState<string>("all");
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function load() {
    const reflections = await listReflections();
    setItems(reflections);
    setFilteredItems(reflections);
  }

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    let filtered = items;

    if (searchQuery) {
      filtered = filtered.filter(item => 
        item.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.prompt?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterMood !== "all") {
      filtered = filtered.filter(item => item.mood === filterMood);
    }

    setFilteredItems(filtered);
  }, [searchQuery, filterMood, items]);

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVoiceTranscription = (transcribedText: string) => {
    setText(prev => prev ? `${prev}\n\n${transcribedText}` : transcribedText);
  };

  async function save() {
    if (!text.trim()) {
      toast.error("Please write something");
      return;
    }

    try {
      let photoUrl = undefined;
      
      if (photoFile) {
        toast.info("Uploading photo...");
        photoUrl = await uploadReflectionPhoto(photoFile);
      }

      await addReflection({
        date: new Date().toISOString().slice(0, 10),
        text,
        prompt: selectedPrompt.prompt,
        mood: selectedMood || selectedPrompt.mood,
        photo_url: photoUrl,
      });

      toast.success("Reflection saved");
      setText("");
      setSelectedMood("");
      setPhotoFile(null);
      setPhotoPreview(null);
      setShowInput(false);
      setSelectedPrompt(reflectionPrompts[0]);
      load();
    } catch (error) {
      console.error("Error saving reflection:", error);
      toast.error("Failed to save reflection");
    }
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="relative overflow-hidden bg-gradient-to-br from-secondary/5 via-background to-primary/5 px-6 pt-12 pb-8 rounded-b-[3rem]">
        <div className="flex items-center justify-between mb-6">
          <Avatar className="w-14 h-14 ring-2 ring-secondary/20">
            <AvatarImage src="" />
            <AvatarFallback className="bg-gradient-to-br from-secondary/20 to-primary/20 text-foreground font-medium">
              N
            </AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-2">
            <Button 
              size="icon" 
              className="rounded-full bg-primary hover:bg-primary/90 w-11 h-11 shadow-lg"
              onClick={() => setShowInput(!showInput)}
            >
              <Plus className="w-5 h-5 text-primary-foreground" />
            </Button>
            <Button 
              size="icon" 
              variant="ghost" 
              className="rounded-full w-11 h-11 bg-card/50 hover:bg-card/80 backdrop-blur-sm"
            >
              <Bell className="w-5 h-5 text-foreground" />
            </Button>
          </div>
        </div>

        <div className="space-y-1">
          <h1 className="text-3xl font-semibold text-foreground tracking-tight">
            Reflection Journal
          </h1>
          <p className="text-muted-foreground">Your spiritual journey</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 space-y-5 -mt-4">
        {/* New Reflection Input */}
        {showInput && (
          <Card className="border-border bg-card rounded-[1.5rem] p-5 shadow-lg">
            <div className="space-y-4">
              {/* Prompt Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Choose a prompt</label>
                <div className="grid grid-cols-4 gap-2">
                  {reflectionPrompts.map((prompt) => (
                    <button
                      key={prompt.id}
                      onClick={() => setSelectedPrompt(prompt)}
                      className={`flex flex-col items-center gap-1 p-3 rounded-2xl border transition-all ${
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

              {/* Selected Prompt */}
              <div className="p-4 rounded-xl bg-muted/50 border border-border">
                <p className="text-sm text-muted-foreground italic">{selectedPrompt.prompt}</p>
              </div>

              {/* Mood Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">How are you feeling?</label>
                <Select value={selectedMood} onValueChange={setSelectedMood}>
                  <SelectTrigger className="rounded-full">
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

              {/* Photo Preview */}
              {photoPreview && (
                <div className="relative">
                  <img 
                    src={photoPreview} 
                    alt="Preview" 
                    className="w-full h-48 object-cover rounded-xl"
                  />
                  <Button
                    size="icon"
                    variant="destructive"
                    className="absolute top-2 right-2 rounded-full w-8 h-8"
                    onClick={() => {
                      setPhotoFile(null);
                      setPhotoPreview(null);
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}

              {/* Text Input */}
              <Textarea
                placeholder="Write your reflection..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="min-h-[150px] border-border bg-background resize-none rounded-2xl"
              />

              {/* Actions */}
              <div className="flex items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoSelect}
                />
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  className="rounded-full w-11 h-11"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImageIcon className="w-5 h-5" />
                </Button>
                <VoiceRecorder onTranscription={handleVoiceTranscription} />
                
                <div className="flex-1" />
                
                <Button 
                  onClick={() => setShowInput(false)} 
                  variant="ghost" 
                  className="rounded-full"
                >
                  Cancel
                </Button>
                <Button onClick={save} className="rounded-full bg-primary hover:bg-primary/90">
                  Save Reflection
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Search & Filter */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search reflections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-full text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <Select value={filterMood} onValueChange={setFilterMood}>
              <SelectTrigger className="w-[180px] rounded-full border-border">
                <SelectValue placeholder="Filter by mood" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All moods</SelectItem>
                {moodOptions.map((mood) => (
                  <SelectItem key={mood.value} value={mood.value}>
                    {mood.emoji} {mood.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Journal Entries */}
        {filteredItems.length === 0 ? (
          <Card className="border-border bg-card rounded-[1.5rem] p-8 text-center">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-foreground font-semibold mb-2">No reflections yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Start your spiritual journey by writing your first reflection
            </p>
            <Button 
              onClick={() => setShowInput(true)}
              className="rounded-full bg-primary hover:bg-primary/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Reflection
            </Button>
          </Card>
        ) : (
          filteredItems.map((item) => (
            <Card key={item.id} className="border-border bg-card rounded-[1.5rem] p-5 shadow-sm hover:shadow-md transition-shadow">
              {item.photo_url && (
                <img 
                  src={item.photo_url} 
                  alt="Reflection" 
                  className="w-full h-48 object-cover rounded-xl mb-4"
                />
              )}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center shrink-0">
                  <span className="text-lg">
                    {moodOptions.find(m => m.value === item.mood)?.emoji || "📝"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-foreground font-semibold">
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
          ))
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default Journal;
