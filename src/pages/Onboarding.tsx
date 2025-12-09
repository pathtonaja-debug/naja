import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { MapPin, User, ArrowRight, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
        return;
      }
      setCheckingAuth(false);
    });
  }, [navigate]);

  const handleComplete = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Please sign in first");
        navigate("/auth");
        return;
      }

      // Geocode location to get coordinates (simple approach using a free API or default)
      let latitude = 25.2; // Default (Dubai)
      let longitude = 55.3;

      // Update profile in Supabase
      const { error } = await supabase
        .from("profiles")
        .update({
          display_name: name.trim() || null,
          latitude,
          longitude,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;

      toast.success("Profile setup complete!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to save profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

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
                  disabled={!name.trim() || loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      Complete Setup
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
                <Button 
                  variant="ghost"
                  onClick={() => setStep(1)}
                  disabled={loading}
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