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
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {step === 1 && (
          <div className="relative animate-fade-in">
            {/* Gradient Card */}
            <div className="rounded-[2.5rem] bg-gradient-to-b from-pink-200 via-purple-200 to-purple-400 p-8 shadow-2xl">
              {/* Header */}
              <div className="text-center space-y-2 mb-12">
                <h1 className="text-3xl font-light text-gray-800">
                  You just
                </h1>
                <h2 className="text-3xl font-medium text-pink-500">
                  chose yourself
                </h2>
                <p className="text-xs tracking-wider text-gray-600 uppercase mt-3">
                  Let's make it easier to keep going
                </p>
              </div>

              {/* Center Icon */}
              <div className="flex justify-center mb-8">
                <div className="w-24 h-24 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
                  <Flower2 className="w-12 h-12 text-pink-400" />
                </div>
              </div>

              {/* Badge */}
              <div className="flex justify-center mb-6">
                <div className="px-4 py-1.5 rounded-full bg-white/30 backdrop-blur-sm border border-white/50">
                  <span className="text-xs text-white font-medium">✨ Just Friends</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-center text-sm text-white leading-relaxed px-2">
                We'll show you what makes consistency finally feel possible. Your personal journey, your next workout, and how to see your progress.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 space-y-4">
              <Button 
                onClick={handleContinue}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-full h-14 text-base font-medium shadow-lg"
              >
                Continue
              </Button>
              <button
                onClick={handleComplete}
                className="w-full text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Share my win
              </button>
            </div>

            {/* Progress Indicator */}
            <div className="flex justify-center mt-8">
              <div className="w-16 h-1 bg-gray-900 rounded-full"></div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="relative animate-fade-in">
            {/* Progress Counter */}
            <div className="absolute -top-8 left-4 text-sm text-muted-foreground">
              1 / 4
            </div>
            <button 
              onClick={() => setStep(1)}
              className="absolute -top-8 right-4 text-xl text-muted-foreground hover:text-foreground"
            >
              ×
            </button>

            {/* White Card */}
            <div className="rounded-[2.5rem] bg-card border border-border p-8 shadow-xl">
              {/* Header */}
              <div className="text-center space-y-2 mb-12">
                <h1 className="text-3xl font-light text-pink-500">
                  Here starts
                </h1>
                <p className="text-xs tracking-wider text-muted-foreground uppercase">
                  Your 21 day journey
                </p>
              </div>

              {/* Progress Circles */}
              <div className="flex justify-center gap-4 mb-12 mt-16">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-4 border-pink-500 flex items-center justify-center bg-pink-50">
                    <span className="text-2xl">📅</span>
                  </div>
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-1 h-4 bg-pink-200"></div>
                </div>
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-4 border-gray-200 flex items-center justify-center bg-gray-50">
                    <span className="text-2xl">🎯</span>
                  </div>
                </div>
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-4 border-gray-200 flex items-center justify-center bg-gray-50">
                    <span className="text-2xl">✨</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="text-center space-y-3 mt-16">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  This shows every way you're showing up. Workouts, walks, stretches, even rest days. Nothing resets if you miss a day.
                </p>
                <p className="text-sm text-pink-500 font-medium">
                  You're building momentum, and you'll see it here.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 space-y-4">
              <Button 
                onClick={handleContinue}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-full h-14 text-base font-medium shadow-lg"
              >
                Show me more
              </Button>
              <button
                onClick={handleComplete}
                className="w-full text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                I'll explore later
              </button>
            </div>

            {/* Progress Indicator */}
            <div className="flex justify-center mt-8">
              <div className="flex gap-1.5">
                <div className="w-8 h-1 bg-pink-500 rounded-full"></div>
                <div className="w-8 h-1 bg-gray-300 rounded-full"></div>
                <div className="w-8 h-1 bg-gray-300 rounded-full"></div>
                <div className="w-8 h-1 bg-gray-300 rounded-full"></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
