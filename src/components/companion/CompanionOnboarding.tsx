import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, User, Palette, Shirt } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

type Step = "intro" | "gender" | "name" | "skin" | "outfit" | "generate" | "select";

const skinTones = [
  { id: "light", color: "#FFE0BD", label: "Light" },
  { id: "medium", color: "#E0AC69", label: "Medium" },
  { id: "tan", color: "#C68642", label: "Tan" },
  { id: "brown", color: "#8D5524", label: "Brown" },
  { id: "deep", color: "#6B4423", label: "Deep" },
];

const outfits = [
  { id: "light", label: "Light & Minimal", desc: "Soft, neutral tones" },
  { id: "dark", label: "Bold & Elegant", desc: "Rich, deep colors" },
  { id: "colorful", label: "Vibrant & Cheerful", desc: "Bright, energetic" },
];

export function CompanionOnboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("intro");
  const [gender, setGender] = useState("");
  const [name, setName] = useState("");
  const [skinTone, setSkinTone] = useState("");
  const [outfit, setOutfit] = useState("");
  const [selectedVariant, setSelectedVariant] = useState(0);

  const handleComplete = () => {
    // Save companion profile
    localStorage.setItem("companion-onboarded", "true");
    navigate("/dashboard");
  };

  if (step === "intro") {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-primary/20 via-secondary/20 to-primary/10">
        <Card className="liquid-glass max-w-md w-full p-8 text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-primary flex items-center justify-center">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-title-1 text-foreground">Meet Your AI Companion</h1>
          <p className="text-body text-foreground-muted">
            Your personal guide on your spiritual journey. Let's create your companion together.
          </p>
          <Button variant="primary" size="lg" onClick={() => setStep("gender")} className="w-full">
            Get Started
          </Button>
        </Card>
      </div>
    );
  }

  if (step === "gender") {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-primary/20 via-secondary/20 to-primary/10">
        <Card className="liquid-glass max-w-md w-full p-8 space-y-6">
          <h2 className="text-title-2 text-foreground text-center">Choose Gender</h2>
          <div className="grid grid-cols-2 gap-4">
            {["male", "female"].map((g) => (
              <button
                key={g}
                onClick={() => {
                  setGender(g);
                  setStep("name");
                }}
                className={cn(
                  "liquid-glass p-6 rounded-card text-center space-y-3 card-interactive",
                  gender === g && "ring-2 ring-primary"
                )}
              >
                <User className="w-8 h-8 mx-auto text-foreground" />
                <span className="text-subheadline text-foreground capitalize">{g}</span>
              </button>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  if (step === "name") {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-primary/20 via-secondary/20 to-primary/10">
        <Card className="liquid-glass max-w-md w-full p-8 space-y-6">
          <h2 className="text-title-2 text-foreground text-center">Name Your Companion</h2>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter a name..."
            className="w-full liquid-glass px-4 py-3 rounded-button text-body text-foreground placeholder:text-foreground-muted border border-border focus:ring-2 focus:ring-primary outline-none"
          />
          <Button
            variant="primary"
            size="lg"
            onClick={() => setStep("skin")}
            disabled={!name.trim()}
            className="w-full"
          >
            Continue
          </Button>
        </Card>
      </div>
    );
  }

  if (step === "skin") {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-primary/20 via-secondary/20 to-primary/10">
        <Card className="liquid-glass max-w-md w-full p-8 space-y-6">
          <h2 className="text-title-2 text-foreground text-center">Choose Skin Tone</h2>
          <div className="grid grid-cols-5 gap-4">
            {skinTones.map((tone) => (
              <button
                key={tone.id}
                onClick={() => {
                  setSkinTone(tone.id);
                  setStep("outfit");
                }}
                className={cn(
                  "aspect-square rounded-full card-interactive",
                  skinTone === tone.id && "ring-4 ring-primary ring-offset-2 ring-offset-background"
                )}
                style={{ backgroundColor: tone.color }}
                title={tone.label}
              />
            ))}
          </div>
        </Card>
      </div>
    );
  }

  if (step === "outfit") {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-primary/20 via-secondary/20 to-primary/10">
        <Card className="liquid-glass max-w-md w-full p-8 space-y-6">
          <h2 className="text-title-2 text-foreground text-center">Choose Outfit Style</h2>
          <div className="space-y-3">
            {outfits.map((o) => (
              <button
                key={o.id}
                onClick={() => {
                  setOutfit(o.id);
                  setStep("generate");
                }}
                className={cn(
                  "w-full liquid-glass p-4 rounded-card text-left space-y-1 card-interactive",
                  outfit === o.id && "ring-2 ring-primary"
                )}
              >
                <div className="flex items-center gap-3">
                  <Shirt className="w-5 h-5 text-foreground" />
                  <div>
                    <p className="text-subheadline text-foreground">{o.label}</p>
                    <p className="text-caption-2 text-foreground-muted">{o.desc}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  if (step === "generate") {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-primary/20 via-secondary/20 to-primary/10">
        <Card className="liquid-glass max-w-md w-full p-8 text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-primary flex items-center justify-center animate-pulse">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-title-2 text-foreground">Generating Your Companion</h2>
          <p className="text-body text-foreground-muted">
            Creating 4 unique variations for you...
          </p>
          <Button
            variant="primary"
            size="lg"
            onClick={() => setStep("select")}
            className="w-full"
          >
            View Avatars
          </Button>
        </Card>
      </div>
    );
  }

  if (step === "select") {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-primary/20 via-secondary/20 to-primary/10">
        <Card className="liquid-glass max-w-2xl w-full p-8 space-y-6">
          <h2 className="text-title-2 text-foreground text-center">Choose Your Favorite</h2>
          <div className="grid grid-cols-2 gap-4">
            {[0, 1, 2, 3].map((i) => (
              <button
                key={i}
                onClick={() => setSelectedVariant(i)}
                className={cn(
                  "aspect-square liquid-glass rounded-card card-interactive overflow-hidden",
                  selectedVariant === i && "ring-4 ring-primary"
                )}
              >
                <div className="w-full h-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center">
                  <Sparkles className="w-12 h-12 text-foreground/40" />
                </div>
              </button>
            ))}
          </div>
          <Button variant="primary" size="lg" onClick={handleComplete} className="w-full">
            Complete Setup
          </Button>
        </Card>
      </div>
    );
  }

  return null;
}
