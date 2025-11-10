import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handleComplete = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 flex items-center justify-center p-6">
      <Card className="w-full max-w-md p-8 shadow-lg animate-fade-in">
        {step === 1 && (
          <div className="space-y-6 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-light tracking-tight text-foreground">
                Welcome to NAJA
              </h1>
              <p className="text-muted-foreground leading-relaxed">
                Your serene companion for reflection, prayer, and faith-centered daily life.
              </p>
            </div>
            
            <div className="flex justify-center py-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-3xl">🌿</span>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <Button 
                onClick={() => setStep(2)}
                className="w-full bg-primary hover:bg-primary/90 text-white transition-all duration-200"
                size="lg"
              >
                Get Started
              </Button>
              <Button 
                variant="ghost"
                onClick={handleComplete}
                className="w-full text-muted-foreground hover:text-foreground"
              >
                Skip for now
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-light text-foreground">
                Set Your Prayer Times
              </h2>
              <p className="text-sm text-muted-foreground">
                We'll use your location to provide accurate prayer times.
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-accent/50 border border-border">
                <p className="text-sm text-foreground">
                  📍 Location services will help provide accurate Salah times based on your timezone.
                </p>
              </div>

              <div className="space-y-3">
                <Button 
                  onClick={() => setStep(3)}
                  className="w-full bg-primary hover:bg-primary/90 text-white"
                  size="lg"
                >
                  Enable Location
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setStep(3)}
                  className="w-full border-border"
                >
                  Set Manually
                </Button>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-light text-foreground">
                All Set! 🌙
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your spiritual companion is ready. Begin your journey with reflection, dua, and mindful habits.
              </p>
            </div>

            <div className="space-y-3 pt-4">
              <Button 
                onClick={handleComplete}
                className="w-full bg-primary hover:bg-primary/90 text-white"
                size="lg"
              >
                Enter NAJA
              </Button>
            </div>
          </div>
        )}

        <div className="flex justify-center gap-2 mt-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-200 ${
                i === step ? "w-8 bg-primary" : "w-1.5 bg-muted"
              }`}
            />
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Onboarding;
