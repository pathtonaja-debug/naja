import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TopBar } from "@/components/ui/top-bar";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Bell, 
  Search, 
  Image as ImageIcon, 
  X,
  Calendar
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
      {/* Top Bar */}
      <TopBar
        avatarFallback="N"
        rightElement={
          <div className="flex items-center gap-2">
            <Button 
              size="icon" 
              variant="ghost"
              onClick={() => setShowInput(!showInput)}
            >
              <Plus className="w-5 h-5" />
            </Button>
            <Button 
              size="icon" 
              variant="ghost"
            >
              <Bell className="w-5 h-5" />
            </Button>
          </div>
        }
      />

      {/* Greeting Section */}
      <div className="px-5 pt-2 pb-6">
        <h1 className="text-[28px] leading-[32px] font-semibold text-foreground mb-1">
          Reflection Journal
        </h1>
        <p className="text-[15px] leading-[22px] text-foreground-muted">
          Your spiritual journey
        </p>
      </div>

      {/* Main Content */}
      <main className="px-5 space-y-5">
        {/* New Reflection Input */}
        {showInput && (
          <Card className="p-5">
            <div className="space-y-4">
              {/* Prompt Selection */}
              <div className="space-y-2">
                <label className="text-[15px] leading-[22px] font-medium text-foreground">Choose a prompt</label>
                <div className="grid grid-cols-4 gap-2">
                  {reflectionPrompts.map((prompt) => (
                    <button
                      key={prompt.id}
                      onClick={() => setSelectedPrompt(prompt)}
                      className={`flex flex-col items-center gap-1 p-3 rounded-card border transition-all duration-fast ease-ios active:scale-[0.98] ${
                        selectedPrompt.id === prompt.id
                          ? "border-primary bg-primary/10"
                          : "border-border bg-card hover:bg-muted/50"
                      }`}
                    >
                      <span className="text-2xl">{prompt.icon}</span>
                      <span className="text-[12px] leading-[18px] text-center text-foreground">{prompt.title}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected Prompt */}
              <div className="p-4 rounded-card bg-muted/50 border border-border">
                <p className="text-[12px] leading-[18px] text-foreground-muted italic">{selectedPrompt.prompt}</p>
              </div>

              {/* Mood Selection */}
              <div className="space-y-2">
                <label className="text-[15px] leading-[22px] font-medium text-foreground">How are you feeling?</label>
                <Select value={selectedMood} onValueChange={setSelectedMood}>
                  <SelectTrigger className="rounded-pill">
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
                    className="w-full h-48 object-cover rounded-card"
                  />
                  <Button
                    size="icon"
                    variant="destructive"
                    className="absolute top-2 right-2 w-8 h-8"
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
                className="min-h-[150px] resize-none rounded-card"
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
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImageIcon className="w-5 h-5" />
                </Button>
                <VoiceRecorder onTranscription={handleVoiceTranscription} />
                
                <div className="flex-1" />
                
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
        )}

        {/* Search & Filter */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground-muted" />
            <input
              type="text"
              placeholder="Search reflections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-pill text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-fast"
            />
          </div>

          <SegmentedControl
            value={filterMood}
            onValueChange={setFilterMood}
            options={[
              { label: "All", value: "all" },
              ...moodOptions.slice(0, 3).map(mood => ({
                label: mood.emoji,
                value: mood.value
              }))
            ]}
          />
        </div>

        {/* Journal Entries */}
        {filteredItems.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-[22px] leading-[28px] font-semibold text-foreground mb-2">No reflections yet</h3>
            <p className="text-[15px] leading-[22px] text-foreground-muted mb-4">
              Start your spiritual journey by writing your first reflection
            </p>
            <Button 
              onClick={() => setShowInput(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              New Reflection
            </Button>
          </Card>
        ) : (
          filteredItems.map((item) => (
            <Card key={item.id} className="p-5 transition-all duration-fast ease-ios hover:shadow-elevation-2">
              {item.photo_url && (
                <img 
                  src={item.photo_url} 
                  alt="Reflection" 
                  className="w-full h-48 object-cover rounded-card mb-4"
                />
              )}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-card bg-primary/20 flex items-center justify-center shrink-0">
                  <span className="text-lg">
                    {moodOptions.find(m => m.value === item.mood)?.emoji || "📝"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-[15px] leading-[22px] font-semibold text-foreground">
                      {item.prompt || "Daily Reflection"}
                    </h3>
                    {item.mood && (
                      <Badge variant="secondary" className="rounded-pill text-[12px]">
                        {moodOptions.find(m => m.value === item.mood)?.label}
                      </Badge>
                    )}
                  </div>
                  <p className="text-[15px] leading-[22px] text-foreground mb-3 whitespace-pre-wrap">
                    {item.text}
                  </p>
                  <div className="flex items-center gap-2 text-[12px] leading-[18px] text-foreground-muted">
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
