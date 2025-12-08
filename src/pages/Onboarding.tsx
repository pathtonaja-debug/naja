import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { MapPin, User, ArrowRight } from "lucide-react";

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const navigate = useNavigate();

  const handleComplete = () => {
    // Save preferences to localStorage for now
    localStorage.setItem("user-name", name);
    localStorage.setItem("user-location", location);
    localStorage.setItem("onboarding-complete", "true");
    navigate("/dashboard");
  };

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {step === 1 && (
          <div className="relative animate-fade-in">
            <Card className="p-8">
              <div className="text-center space-y-2 mb-8">
                <h1 className="text-2xl font-bold text-foreground">
                  Welcome to NAJA
                </h1>
                <p className="text-muted-foreground">
                  Your spiritual journey starts here
                </p>
              </div>

              <div className="flex justify-center mb-8">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-5xl">🕌</span>
                </div>
              </div>

              <p className="text-center text-muted-foreground leading-relaxed mb-8">
                Track your prayers, build lasting Islamic habits, and strengthen your faith—one step at a time.
              </p>

              <Button 
                onClick={handleNext}
                className="w-full h-12"
              >
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Card>

            <div className="flex justify-center mt-6 gap-2">
              <div className="w-8 h-1 bg-primary rounded-full" />
              <div className="w-8 h-1 bg-muted rounded-full" />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="relative animate-fade-in">
            <Card className="p-8">
              <div className="text-center space-y-2 mb-8">
                <h1 className="text-2xl font-bold text-foreground">
                  Set Up Your Profile
                </h1>
                <p className="text-muted-foreground">
                  Help us personalize your experience
                </p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Your Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location" className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Location (for prayer times)
                  </Label>
                  <Input
                    id="location"
                    placeholder="e.g., London, UK"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="h-12"
                  />
                </div>
              </div>

              <div className="mt-8 space-y-3">
                <Button 
                  onClick={handleComplete}
                  className="w-full h-12"
                  disabled={!name.trim()}
                >
                  Complete Setup
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button 
                  variant="ghost"
                  onClick={() => setStep(1)}
                  className="w-full"
                >
                  Back
                </Button>
              </div>
            </Card>

            <div className="flex justify-center mt-6 gap-2">
              <div className="w-8 h-1 bg-primary rounded-full" />
              <div className="w-8 h-1 bg-primary rounded-full" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;