import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft, ChevronRight, Save, Sparkles } from "lucide-react";
import { namesOfAllah, type AllahName } from "@/data/namesOfAllah";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface DuaContent {
  step1_praise: string;
  step1_selected_names: AllahName[];
  step2_salawat: string;
  step3_need: string;
  step4_forgiveness: string;
  step5_gratitude: string;
  step6_amin: string;
}

interface DuaBuilderFlowProps {
  onComplete: () => void;
  onCancel: () => void;
}

const DuaBuilderFlow = ({ onComplete, onCancel }: DuaBuilderFlowProps) => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [selectedNames, setSelectedNames] = useState<AllahName[]>([]);
  const [showNameSelector, setShowNameSelector] = useState(false);
  const [duaContent, setDuaContent] = useState<DuaContent>({
    step1_praise: "اَلْـحَمْدُ لِلّٰهِ رَبِّ الْعَالَمِينَ\nAl-ḥamdu lillāhi Rabbil-ʿālamīn\nAll praise is due to Allah, Lord of the worlds.",
    step1_selected_names: [],
    step2_salawat: "اَللّٰهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ وَعَلَىٰ آلِ مُحَمَّدٍ\nAllāhumma ṣalli ʿalā Muḥammad wa ʿalā āli Muḥammad\nO Allah, send blessings upon Muhammad and the family of Muhammad.",
    step3_need: "",
    step4_forgiveness: "اللّٰهُمَّ اغْفِرْ لِي ذُنُوبِي كُلَّهَا\nAllāhumma ighfir lī dhunūbī kullahā\nO Allah, forgive all my sins.",
    step5_gratitude: "الْحَمْدُ لِلّٰهِ رَبِّ الْعَالَمِينَ\nAlḥamdulillāhi Rabbil-ʿālamīn\nAll praise is due to Allah, Lord of the worlds.",
    step6_amin: "آمِينَ، يَا رَبَّ الْعَالَمِينَ\nĀmīn, Yā Rabb al-ʿĀlamīn\nAmin, O Lord of the worlds."
  });

  const steps = [
    {
      number: 1,
      title: "Opening Praise",
      subtitle: "Begin your dua by praising Allah",
      tip: "Mention Allah's Names that match your need",
      field: "step1_praise" as keyof DuaContent
    },
    {
      number: 2,
      title: "Send Blessings",
      subtitle: "Send peace and blessings upon the Prophet ﷺ",
      tip: "Begin and end your dua with ṣalawāt — it brings barakah",
      field: "step2_salawat" as keyof DuaContent
    },
    {
      number: 3,
      title: "Express Your Need",
      subtitle: "Speak from your heart — what do you need from Allah today?",
      tip: "Be sincere and specific in your request",
      field: "step3_need" as keyof DuaContent
    },
    {
      number: 4,
      title: "Ask for Forgiveness",
      subtitle: "Seek Allah's forgiveness and protection",
      tip: "Humility opens the doors of mercy",
      field: "step4_forgiveness" as keyof DuaContent
    },
    {
      number: 5,
      title: "Conclude with Gratitude",
      subtitle: "Express gratitude and pray for others",
      tip: "Praying for others multiplies your own reward",
      field: "step5_gratitude" as keyof DuaContent
    },
    {
      number: 6,
      title: "Seal with Āmīn",
      subtitle: "Complete your dua with conviction",
      tip: "Say Āmīn with certainty in your heart",
      field: "step6_amin" as keyof DuaContent
    }
  ];

  const currentStepData = steps[currentStep - 1];

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNameToggle = (name: AllahName) => {
    if (selectedNames.find(n => n.number === name.number)) {
      setSelectedNames(selectedNames.filter(n => n.number !== name.number));
    } else if (selectedNames.length < 3) {
      setSelectedNames([...selectedNames, name]);
    } else {
      toast({
        title: "Maximum reached",
        description: "You can select up to 3 Names of Allah",
        variant: "destructive"
      });
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for your dua",
        variant: "destructive"
      });
      return;
    }

    if (!duaContent.step3_need.trim()) {
      toast({
        title: "Need required",
        description: "Please express your need in Step 3",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const contentWithNames = {
        ...duaContent,
        step1_selected_names: selectedNames
      };

      const { error } = await supabase
        .from('duas')
        .insert([{
          user_id: user.id,
          title,
          category: category || 'Personal',
          content: contentWithNames as any
        }]);

      if (error) throw error;

      toast({
        title: "Dua saved",
        description: "Your dua has been saved successfully",
      });

      onComplete();
    } catch (error) {
      console.error("Error saving dua:", error);
      toast({
        title: "Error",
        description: "Failed to save dua. Please try again.",
        variant: "destructive"
      });
    }
  };

  const updateContent = (field: keyof DuaContent, value: string) => {
    setDuaContent(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b border-border px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" onClick={onCancel} className="rounded-full">
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back
          </Button>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Step {currentStep} of 6</p>
            <h2 className="text-lg font-semibold text-foreground">{currentStepData.title}</h2>
          </div>
          <Button onClick={handleSave} className="rounded-full bg-primary hover:bg-primary/90">
            <Save className="w-5 h-5 mr-2" />
            Save
          </Button>
        </div>

        {/* Progress bar */}
        <div className="flex gap-1">
          {steps.map((step) => (
            <div
              key={step.number}
              className={`h-1 flex-1 rounded-full transition-colors ${
                step.number <= currentStep ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="px-6 pt-6 space-y-6">
        {/* Title and Category (shown on first step) */}
        {currentStep === 1 && (
          <Card className="border-border bg-card rounded-[2rem] p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Title *
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Dua for Guidance"
                className="rounded-2xl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Category
              </label>
              <Input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g., Gratitude, Patience, Healing"
                className="rounded-2xl"
              />
            </div>
          </Card>
        )}

        {/* Step Instruction */}
        <Card className="border-border bg-secondary/20 rounded-[2rem] p-6">
          <p className="text-foreground/80 text-center leading-relaxed">
            {currentStepData.subtitle}
          </p>
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="w-4 h-4" />
            <p className="italic">{currentStepData.tip}</p>
          </div>
        </Card>

        {/* Names of Allah Selector (Step 1 only) */}
        {currentStep === 1 && (
          <Card className="border-border bg-card rounded-[2rem] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-foreground">
                Select Names of Allah (up to 3)
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNameSelector(!showNameSelector)}
                className="rounded-full"
              >
                {showNameSelector ? 'Hide' : 'Show'} Names
              </Button>
            </div>

            {selectedNames.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedNames.map((name) => (
                  <Badge
                    key={name.number}
                    onClick={() => handleNameToggle(name)}
                    className="rounded-full bg-primary text-primary-foreground cursor-pointer hover:bg-primary/80 px-4 py-2"
                  >
                    {name.transliteration} ✕
                  </Badge>
                ))}
              </div>
            )}

            {showNameSelector && (
              <ScrollArea className="h-96 rounded-2xl border border-border p-4">
                <div className="grid grid-cols-1 gap-3">
                  {namesOfAllah.map((name) => {
                    const isSelected = selectedNames.find(n => n.number === name.number);
                    return (
                      <Card
                        key={name.number}
                        onClick={() => handleNameToggle(name)}
                        className={`p-4 cursor-pointer transition-all rounded-2xl ${
                          isSelected
                            ? 'bg-primary/20 border-primary'
                            : 'bg-card hover:bg-muted border-border'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <p className="text-2xl font-arabic mb-1">{name.arabic}</p>
                            <p className="text-sm font-semibold text-foreground mb-1">
                              {name.transliteration}
                            </p>
                            <p className="text-sm text-primary font-medium mb-2">
                              {name.english}
                            </p>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              {name.meaning}
                            </p>
                          </div>
                          {isSelected && (
                            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0">
                              <span className="text-primary-foreground text-sm">✓</span>
                            </div>
                          )}
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </ScrollArea>
            )}
          </Card>
        )}

        {/* Content Editor */}
        <Card className="border-border bg-card rounded-[2rem] p-6">
          <Textarea
            value={String(duaContent[currentStepData.field] || "")}
            onChange={(e) => updateContent(currentStepData.field, e.target.value)}
            placeholder={
              currentStep === 3
                ? "Write your personal need in your own words...\n\nYā Allāh, You are the Most Merciful, and I am in need of Your mercy..."
                : "Edit or keep the default text..."
            }
            className="min-h-[300px] text-base leading-relaxed rounded-2xl resize-none"
            dir="auto"
          />
        </Card>
      </main>

      {/* Navigation */}
      <div className="fixed bottom-6 left-6 right-6 flex gap-3">
        <Button
          onClick={handleBack}
          disabled={currentStep === 1}
          variant="outline"
          className="flex-1 rounded-full h-14"
        >
          <ChevronLeft className="w-5 h-5 mr-2" />
          Previous
        </Button>
        <Button
          onClick={handleNext}
          disabled={currentStep === 6}
          className="flex-1 rounded-full h-14 bg-primary hover:bg-primary/90"
        >
          Next
          <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default DuaBuilderFlow;
