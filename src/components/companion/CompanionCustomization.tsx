import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, ArrowLeft, Check, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { getDeviceId } from "@/lib/deviceId";
import avatar1 from "@/assets/avatar-preset-1.png";
import avatar2 from "@/assets/avatar-preset-2.png";
import avatar3 from "@/assets/avatar-preset-3.png";
import avatar4 from "@/assets/avatar-preset-4.png";

interface CompanionCustomizationProps {
  onComplete: () => void;
}

const avatarPresets = [
  { id: 1, image: avatar1, name: "Naja", gender: "female", skinTone: "warm-brown", outfit: "teal-abaya", hairColor: "black", eyeColor: "brown" },
  { id: 2, image: avatar2, name: "Noor", gender: "female", skinTone: "light-olive", outfit: "lavender-dress", hairColor: "black", eyeColor: "dark-brown" },
  { id: 3, image: avatar3, name: "Amira", gender: "female", skinTone: "fair", outfit: "sand-abaya", hairColor: "black", eyeColor: "hazel" },
  { id: 4, image: avatar4, name: "Sami", gender: "male", skinTone: "warm-brown", outfit: "olive-shirt", hairColor: "black", eyeColor: "dark" },
];

export default function CompanionCustomization({ onComplete }: CompanionCustomizationProps) {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState({
    name: "Naja",
    gender: "female",
    voiceTone: "warm",
    selectedPreset: 1,
    skinTone: "warm-brown",
    hairColor: "black",
    eyeColor: "brown",
    beard: "none",
    hijab: "classic",
    outfit: "teal-abaya",
    faithAligned: true,
    gentleReminders: true,
    contextualSuggestions: true,
  });
  const [generatedVariants, setGeneratedVariants] = useState<any[]>([]);
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationCount, setGenerationCount] = useState(0);
  const [lastGenerationTime, setLastGenerationTime] = useState<number>(0);

  const generateAvatars = async () => {
    // Rate limiting check (max 3 per hour)
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;
    if (generationCount >= 3 && now - lastGenerationTime < oneHour) {
      toast({
        title: "Generation Limit Reached",
        description: "Maximum 3 generations per hour. Please try again later.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await supabase.functions.invoke('generate-avatar', {
        body: {
          gender: profile.gender,
          skinTone: profile.skinTone,
          hijab: profile.hijab,
          beard: profile.beard,
          outfit: profile.outfit,
        },
      });

      if (response.error) throw response.error;

      if (response.data?.variations) {
        setGeneratedVariants(response.data.variations);
        setGenerationCount(prev => prev + 1);
        setLastGenerationTime(now);
        toast({
          title: "Avatars Generated",
          description: "Select your favorite variant below.",
        });
      }
    } catch (error) {
      console.error("Avatar generation error:", error);
      toast({
        title: "Generation Failed",
        description: "Using default presets. You can regenerate later.",
        variant: "destructive",
      });
      // Fallback to preset images
      setGeneratedVariants(avatarPresets.map((p, i) => ({
        id: i + 1,
        imageData: p.image,
      })));
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (step === 6 && generatedVariants.length === 0) {
      generateAvatars();
    }
  }, [step]);

  const handleSave = async () => {
    if (!selectedVariantId) {
      toast({
        title: "Select a Variant",
        description: "Please select an avatar variant to continue.",
        variant: "destructive",
      });
      return;
    }

    try {
      const deviceId = getDeviceId();
      const selectedVariant = generatedVariants.find(v => v.id === selectedVariantId);
      
      if (!selectedVariant) throw new Error("Selected variant not found");

      // Upload full body image to Storage
      const base64Data = selectedVariant.imageData.replace(/^data:image\/\w+;base64,/, "");
      const binaryData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
      
      const fullBodyPath = `${deviceId}/fullbody.png`;
      const { error: uploadError } = await supabase.storage
        .from('companion-avatars')
        .upload(fullBodyPath, binaryData, {
          contentType: 'image/png',
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl: fullBodyUrl } } = supabase.storage
        .from('companion-avatars')
        .getPublicUrl(fullBodyPath);

      // Create portrait crop (1:1 center crop focusing on upper third)
      const portraitPath = `${deviceId}/portrait.png`;
      const { error: portraitUploadError } = await supabase.storage
        .from('companion-avatars')
        .upload(portraitPath, binaryData, {
          contentType: 'image/png',
          upsert: true,
        });

      if (portraitUploadError) throw portraitUploadError;

      const { data: { publicUrl: portraitUrl } } = supabase.storage
        .from('companion-avatars')
        .getPublicUrl(portraitPath);

      // First check if a profile exists for this device
      const { data: existing } = await supabase
        .from("companion_profiles")
        .select("id")
        .eq("device_id", deviceId)
        .maybeSingle();

      const profileData = {
        device_id: deviceId,
        name: profile.name,
        skin_tone: profile.skinTone,
        hair_color: profile.hairColor,
        eye_color: profile.eyeColor,
        outfit: profile.outfit,
        voice_tone: profile.voiceTone,
        behavior_settings: {
          faith_aligned: profile.faithAligned,
          gentle_reminders: profile.gentleReminders,
          contextual_suggestions: profile.contextualSuggestions,
        },
        selected_variant_id: selectedVariantId,
        full_body_url: fullBodyUrl,
        portrait_url: portraitUrl,
        portrait_crop: { x: 0, y: 0, width: 256, height: 256 },
        appearance: {
          gender: profile.gender,
          skinTone: profile.skinTone,
          hijab: profile.hijab,
          beard: profile.beard,
          outfit: profile.outfit,
        },
      };

      let error;
      if (existing) {
        ({ error } = await supabase
          .from("companion_profiles")
          .update(profileData)
          .eq("id", existing.id));
      } else {
        ({ error } = await supabase
          .from("companion_profiles")
          .insert(profileData));
      }

      if (error) throw error;

      toast({
        title: "Companion Updated",
        description: "Your companion has been personalized.",
      });
      onComplete();
    } catch (error) {
      console.error("Error saving companion:", error);
      toast({
        title: "Error",
        description: "Failed to save companion settings.",
        variant: "destructive",
      });
    }
  };

  const selectPreset = (presetId: number) => {
    const preset = avatarPresets.find(p => p.id === presetId);
    if (preset) {
      setProfile({
        ...profile,
        selectedPreset: presetId,
        name: preset.name,
        gender: preset.gender,
        skinTone: preset.skinTone,
        hairColor: preset.hairColor,
        eyeColor: preset.eyeColor,
        outfit: preset.outfit,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="w-full max-w-2xl bg-card border-none shadow-card rounded-[2.5rem] p-8 animate-fade-in">
        {/* Screen 1 - Welcome */}
        {step === 1 && (
          <div className="space-y-8 text-center">
            <div className="space-y-4">
              <h1 className="text-3xl font-medium tracking-tight text-foreground">
                Customize your companion
              </h1>
              <p className="text-muted-foreground leading-relaxed">
                Personalize NAJA to feel familiar and comforting.
              </p>
            </div>
            <div className="space-y-3 pt-4">
              <Button
                onClick={() => setStep(2)}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full h-14 text-base font-medium"
              >
                Get Started
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                onClick={onComplete}
                className="w-full text-muted-foreground hover:text-foreground rounded-full h-14"
              >
                Skip (use default)
              </Button>
            </div>
          </div>
        )}

        {/* Screen 2 - Identity */}
        {step === 2 && (
          <div className="space-y-8">
            <div className="space-y-3">
              <h2 className="text-2xl font-medium text-foreground">Identity</h2>
              <p className="text-sm text-muted-foreground">
                Personalize your companion's identity and tone.
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  placeholder="e.g. Naja, Noor, Sami"
                  className="rounded-full h-12"
                />
              </div>

              <div className="space-y-3">
                <Label>Gender</Label>
                <RadioGroup value={profile.gender} onValueChange={(value) => setProfile({ ...profile, gender: value })}>
                  <div className="flex items-center space-x-2 p-4 rounded-[1.5rem] border border-border hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female" className="cursor-pointer flex-1">Female</Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 rounded-[1.5rem] border border-border hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male" className="cursor-pointer flex-1">Male</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label>Voice Tone</Label>
                <RadioGroup value={profile.voiceTone} onValueChange={(value) => setProfile({ ...profile, voiceTone: value })}>
                  <div className="flex items-center space-x-2 p-4 rounded-[1.5rem] border border-border hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="motherly" id="motherly" />
                    <Label htmlFor="motherly" className="cursor-pointer flex-1">Motherly Figure</Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 rounded-[1.5rem] border border-border hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="mentor" id="mentor" />
                    <Label htmlFor="mentor" className="cursor-pointer flex-1">Motivational Mentor</Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 rounded-[1.5rem] border border-border hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="peer" id="peer" />
                    <Label htmlFor="peer" className="cursor-pointer flex-1">Friendly Peer</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1 rounded-full h-12">
                <ArrowLeft className="mr-2 w-5 h-5" />
                Back
              </Button>
              <Button onClick={() => setStep(3)} className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full h-12">
                Continue
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        )}

        {/* Screen 3 - Appearance Presets */}
        {step === 3 && (
          <div className="space-y-8">
            <div className="space-y-3">
              <h2 className="text-2xl font-medium text-foreground">Choose Your Companion</h2>
              <p className="text-sm text-muted-foreground">
                Select a preset or customize further in the next step.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {avatarPresets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => selectPreset(preset.id)}
                  className={`relative p-4 rounded-[1.5rem] border-2 transition-all ${
                    profile.selectedPreset === preset.id
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <img src={preset.image} alt={preset.name} className="w-full aspect-square object-cover rounded-[1rem]" />
                  <p className="mt-3 font-medium text-foreground">{preset.name}</p>
                  {profile.selectedPreset === preset.id && (
                    <div className="absolute top-6 right-6 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-5 h-5 text-primary-foreground" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => setStep(2)} className="flex-1 rounded-full h-12">
                <ArrowLeft className="mr-2 w-5 h-5" />
                Back
              </Button>
              <Button onClick={() => setStep(4)} className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full h-12">
                Continue
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        )}

        {/* Screen 4 - Detailed Appearance */}
        {step === 4 && (
          <div className="space-y-8">
            <div className="space-y-3">
              <h2 className="text-2xl font-medium text-foreground">Detailed Appearance</h2>
              <p className="text-sm text-muted-foreground">
                Fine-tune your companion's appearance (optional).
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <Label>Skin Tone</Label>
                <RadioGroup value={profile.skinTone} onValueChange={(value) => setProfile({ ...profile, skinTone: value })}>
                  {["fair", "light-olive", "warm-brown", "deep-brown"].map((tone) => (
                    <div key={tone} className="flex items-center space-x-2 p-4 rounded-[1.5rem] border border-border hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value={tone} id={tone} />
                      <Label htmlFor={tone} className="cursor-pointer flex-1 capitalize">{tone.replace("-", " ")}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {profile.gender === "female" && (
                <div className="space-y-3">
                  <Label>Hijab Style</Label>
                  <RadioGroup value={profile.hijab} onValueChange={(value) => setProfile({ ...profile, hijab: value })}>
                    {["none", "classic", "draped"].map((style) => (
                      <div key={style} className="flex items-center space-x-2 p-4 rounded-[1.5rem] border border-border hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value={style} id={style} />
                        <Label htmlFor={style} className="cursor-pointer flex-1 capitalize">{style}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}

              {profile.gender === "male" && (
                <div className="space-y-3">
                  <Label>Beard Style</Label>
                  <RadioGroup value={profile.beard} onValueChange={(value) => setProfile({ ...profile, beard: value })}>
                    {["none", "short", "trimmed", "full"].map((style) => (
                      <div key={style} className="flex items-center space-x-2 p-4 rounded-[1.5rem] border border-border hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value={style} id={style} />
                        <Label htmlFor={style} className="cursor-pointer flex-1 capitalize">{style}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => setStep(3)} className="flex-1 rounded-full h-12">
                <ArrowLeft className="mr-2 w-5 h-5" />
                Back
              </Button>
              <Button onClick={() => setStep(5)} className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full h-12">
                Continue
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        )}

        {/* Screen 5 - Behavior & Boundaries */}
        {step === 5 && (
          <div className="space-y-8">
            <div className="space-y-3">
              <h2 className="text-2xl font-medium text-foreground">Behavior & Boundaries</h2>
              <p className="text-sm text-muted-foreground">
                Configure how your companion interacts with you.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-5 rounded-[1.5rem] border border-border">
                <div className="space-y-1">
                  <Label>Faith-aligned guidance</Label>
                  <p className="text-sm text-muted-foreground">Always respects Islamic values</p>
                </div>
                <Switch checked={profile.faithAligned} disabled className="data-[state=checked]:bg-primary" />
              </div>

              <div className="flex items-center justify-between p-5 rounded-[1.5rem] border border-border">
                <div className="space-y-1">
                  <Label>Gentle reminders</Label>
                  <p className="text-sm text-muted-foreground">Nudges for prayer and reflection</p>
                </div>
                <Switch
                  checked={profile.gentleReminders}
                  onCheckedChange={(checked) => setProfile({ ...profile, gentleReminders: checked })}
                  className="data-[state=checked]:bg-primary"
                />
              </div>

              <div className="flex items-center justify-between p-5 rounded-[1.5rem] border border-border">
                <div className="space-y-1">
                  <Label>Contextual suggestions</Label>
                  <p className="text-sm text-muted-foreground">Proactive spiritual support</p>
                </div>
                <Switch
                  checked={profile.contextualSuggestions}
                  onCheckedChange={(checked) => setProfile({ ...profile, contextualSuggestions: checked })}
                  className="data-[state=checked]:bg-primary"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => setStep(4)} className="flex-1 rounded-full h-12">
                <ArrowLeft className="mr-2 w-5 h-5" />
                Back
              </Button>
              <Button onClick={() => setStep(6)} className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full h-12">
                Continue
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        )}

        {/* Screen 6 - Avatar Generation & Selection */}
        {step === 6 && (
          <div className="space-y-8">
            <div className="space-y-3">
              <h2 className="text-2xl font-medium text-foreground">Choose Your Avatar</h2>
              <p className="text-sm text-muted-foreground">
                Select your favorite full-body companion design.
              </p>
            </div>

            {isGenerating ? (
              <div className="space-y-4">
                <p className="text-center text-sm text-muted-foreground">Generating your personalized avatars...</p>
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="w-full aspect-[3/5] rounded-[1.5rem]" />
                  ))}
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4">
                  {generatedVariants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariantId(variant.id)}
                      className={`relative rounded-[1.5rem] border-2 overflow-hidden transition-all ${
                        selectedVariantId === variant.id
                          ? "border-primary shadow-lg scale-105"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <img 
                        src={variant.imageData} 
                        alt={`Variant ${variant.id}`}
                        className="w-full aspect-[3/5] object-cover"
                      />
                      {selectedVariantId === variant.id && (
                        <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                          <Check className="w-5 h-5 text-primary-foreground" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  onClick={generateAvatars}
                  disabled={isGenerating || (generationCount >= 3 && Date.now() - lastGenerationTime < 3600000)}
                  className="w-full rounded-full h-12"
                >
                  <RefreshCw className="mr-2 w-5 h-5" />
                  Regenerate ({3 - generationCount} left)
                </Button>
              </>
            )}

            <div className="space-y-4">
              <div className="p-6 rounded-[1.5rem] border border-border space-y-4">
                <div className="space-y-2">
                  <div>
                    <h3 className="font-medium text-foreground text-lg">{profile.name}</h3>
                    <p className="text-sm text-muted-foreground capitalize">{profile.voiceTone} • {profile.gender}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-border space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Skin Tone:</span>
                    <span className="text-foreground capitalize">{profile.skinTone.replace("-", " ")}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Outfit:</span>
                    <span className="text-foreground capitalize">{profile.outfit.replace("-", " ")}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Gentle Reminders:</span>
                    <span className="text-foreground">{profile.gentleReminders ? "On" : "Off"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Contextual Suggestions:</span>
                    <span className="text-foreground">{profile.contextualSuggestions ? "On" : "Off"}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => setStep(5)} className="flex-1 rounded-full h-12">
                <ArrowLeft className="mr-2 w-5 h-5" />
                Edit
              </Button>
              <Button onClick={handleSave} className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full h-12">
                Save & Continue
                <Check className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        )}

        {/* Progress Indicator */}
        <div className="flex justify-center gap-2 mt-10">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === step
                  ? "w-8 bg-primary"
                  : i < step
                  ? "w-1.5 bg-primary/50"
                  : "w-1.5 bg-muted"
              }`}
            />
          ))}
        </div>
      </Card>
    </div>
  );
}
