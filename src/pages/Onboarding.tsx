import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Flower2 } from "lucide-react";
import CompanionCustomization from "@/components/companion/CompanionCustomization";

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [showCompanion, setShowCompanion] = useState(false);
  const navigate = useNavigate();

  const handleComplete = () => {
    navigate("/dashboard");
  };

  const handleContinue = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      setShowCompanion(true);
    }
  };

  if (showCompanion) {
    return <CompanionCustomization onComplete={handleComplete} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {step === 1 && (
          <div className="relative animate-fade-in">
            {/* Liquid Glass Card */}
            <div className="liquid-glass rounded-card p-8 card-interactive">
              {/* Header */}
              <div className="text-center space-y-2 mb-12">
                <h1 className="text-large-title text-foreground/90">
                  You just took
                </h1>
                <h2 className="text-large-title bg-gradient-primary bg-clip-text text-transparent">
                  the first step
                </h2>
                <p className="text-caption-1 tracking-wider text-foreground-muted uppercase mt-3">
                  Towards a stronger connection with Allah
                </p>
              </div>

              {/* Center Icon */}
              <div className="flex justify-center mb-8">
                <div className="w-24 h-24 liquid-glass rounded-full flex items-center justify-center">
                  <span className="text-5xl">🕌</span>
                </div>
              </div>

              {/* Badge */}
              <div className="flex justify-center mb-6">
                <div className="liquid-glass-light px-4 py-1.5 rounded-pill">
                  <span className="text-caption-1 text-foreground font-medium">Your Spiritual Journey</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-center text-body text-foreground-muted leading-relaxed px-2">
                NAJA will help you build lasting Islamic habits, track your prayers, reflect through journaling, and strengthen your faith—one step at a time, with barakah.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 space-y-4">
              <Button 
                onClick={handleContinue}
                className="w-full bg-gradient-primary text-white rounded-button h-14 text-body font-medium shadow-elevation-2 hover:shadow-elevation-3 transition-all"
              >
                Continue
              </Button>
              <button
                onClick={handleComplete}
                className="w-full text-subheadline text-foreground-muted hover:text-foreground transition-colors"
              >
                Begin my journey
              </button>
            </div>

            {/* Progress Indicator */}
            <div className="flex justify-center mt-8">
              <div className="w-16 h-1 bg-primary rounded-pill"></div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="relative animate-fade-in">
            {/* Progress Counter */}
            <div className="absolute -top-8 left-4 text-footnote text-foreground-muted">
              1 / 4
            </div>
            <button 
              onClick={() => setStep(1)}
              className="absolute -top-8 right-4 text-2xl text-foreground-muted hover:text-foreground transition-colors"
            >
              ×
            </button>

            {/* Liquid Glass Card */}
            <div className="liquid-glass rounded-card p-8">
              {/* Header */}
              <div className="text-center space-y-2 mb-12">
                <h1 className="text-large-title bg-gradient-primary bg-clip-text text-transparent">
                  Your path to
                </h1>
                <p className="text-caption-1 tracking-wider text-foreground-muted uppercase">
                  Spiritual consistency
                </p>
              </div>

              {/* Progress Circles */}
              <div className="flex justify-center gap-4 mb-12 mt-16">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-4 border-primary flex items-center justify-center liquid-glass-light glow-ring">
                    <span className="text-2xl">📿</span>
                  </div>
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-1 h-4 bg-primary/30 rounded-pill"></div>
                </div>
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-4 border-muted flex items-center justify-center liquid-glass">
                    <span className="text-2xl">🤲</span>
                  </div>
                </div>
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-4 border-muted flex items-center justify-center liquid-glass">
                    <span className="text-2xl">🌙</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="text-center space-y-3 mt-16">
                <p className="text-body text-foreground-muted leading-relaxed">
                  Track your prayers, dhikr, Quran reading, and good deeds. Your progress never resets—every act of worship counts, even after missed days.
                </p>
                <p className="text-body text-primary font-medium">
                  Allah sees your effort, and so will you.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 space-y-4">
              <Button 
                onClick={handleContinue}
                className="w-full bg-gradient-primary text-white rounded-button h-14 text-body font-medium shadow-elevation-2 hover:shadow-elevation-3 transition-all"
              >
                Show me more
              </Button>
              <button
                onClick={handleComplete}
                className="w-full text-subheadline text-foreground-muted hover:text-foreground transition-colors"
              >
                I'll explore later
              </button>
            </div>

            {/* Progress Indicator */}
            <div className="flex justify-center mt-8">
              <div className="flex gap-1.5">
                <div className="w-8 h-1 bg-primary rounded-pill"></div>
                <div className="w-8 h-1 bg-muted rounded-pill"></div>
                <div className="w-8 h-1 bg-muted rounded-pill"></div>
                <div className="w-8 h-1 bg-muted rounded-pill"></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
