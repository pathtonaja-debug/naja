import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, MapPin, Check } from "lucide-react";
import CompanionCustomization from "@/components/companion/CompanionCustomization";

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [showCompanion, setShowCompanion] = useState(false);
  const navigate = useNavigate();

  const handleComplete = () => {
    navigate("/dashboard");
  };

  const handleSetupLocation = () => {
    setShowCompanion(true);
  };

  if (showCompanion) {
    return <CompanionCustomization onComplete={handleComplete} />;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="w-full max-w-md bg-card border-none shadow-card rounded-[2.5rem] p-8 animate-fade-in">
        {step === 1 && (
          <div className="space-y-8 text-center">
            <div className="space-y-4">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-[2rem] bg-primary/20">
                <span className="text-5xl">🌿</span>
              </div>
              <h1 className="text-3xl font-medium tracking-tight text-foreground">
                Welcome to NAJA
              </h1>
              <p className="text-muted-foreground leading-relaxed">
                Your spiritual companion for prayer, reflection, and mindful Islamic living.
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
                onClick={handleComplete}
                className="w-full text-muted-foreground hover:text-foreground rounded-full h-14"
              >
                Skip for now
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8">
            <div className="space-y-3 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-[1.5rem] bg-secondary/30 mb-2">
                <MapPin className="w-8 h-8 text-secondary-foreground" />
              </div>
              <h2 className="text-2xl font-medium text-foreground">
                Set Prayer Times
              </h2>
              <p className="text-sm text-muted-foreground">
                We'll use your location for accurate Salah times
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-5 rounded-[1.5rem] bg-primary/10 border border-primary/20">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">
                    Location services help provide accurate prayer times based on your timezone and calculation method.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <Button 
                  onClick={handleSetupLocation}
                  className="w-full bg-foreground hover:bg-foreground/90 text-background rounded-full h-14 text-base font-medium"
                >
                  Enable Location
                </Button>
                <Button 
                  variant="outline"
                  onClick={handleSetupLocation}
                  className="w-full border-border rounded-full h-14 text-base font-medium hover:bg-muted"
                >
                  Set Manually
                </Button>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8">
            <div className="space-y-3 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-[1.5rem] bg-success/20 mb-2">
                <Check className="w-8 h-8 text-success-foreground" />
              </div>
              <h2 className="text-2xl font-medium text-foreground">
                All Set! 🌙
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your spiritual companion is ready. Begin your journey with reflection, dua, and mindful habits.
              </p>
            </div>

            <div className="space-y-3 pt-4">
              <Button 
                onClick={handleComplete}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full h-14 text-base font-medium"
              >
                Enter NAJA
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        )}

        {/* Progress Indicator */}
        <div className="flex justify-center gap-2 mt-10">
          {[1, 2, 3].map((i) => (
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
};

export default Onboarding;
