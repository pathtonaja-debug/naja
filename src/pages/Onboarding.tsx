import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { User, ArrowRight, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Onboarding = () => {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [checkingProfile, setCheckingProfile] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkProfileCompletion = async () => {
      try {
        // First check if user is authenticated
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate("/auth", { replace: true });
          return;
        }

        // Fetch user profile to check if onboarding was already completed
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("display_name")
          .eq("id", session.user.id)
          .maybeSingle();

        if (error) {
          console.error("Error fetching profile:", error);
          // Continue to onboarding if we can't fetch profile
          setCheckingProfile(false);
          return;
        }

        // If profile has a display_name, onboarding is complete - go to dashboard
        if (profile?.display_name && profile.display_name.trim() !== "") {
          navigate("/dashboard", { replace: true });
          return;
        }

        // Prefill name if it exists but is empty (edge case)
        if (profile?.display_name) {
          setName(profile.display_name);
        }

        // Show onboarding
        setCheckingProfile(false);
      } catch (error) {
        console.error("Error checking profile:", error);
        setCheckingProfile(false);
      }
    };

    checkProfileCompletion();
  }, [navigate]);

  const handleComplete = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error(t('auth.pleaseSignInFirst'));
        navigate("/auth", { replace: true });
        return;
      }

      // Default coordinates (Dubai)
      const latitude = 25.2;
      const longitude = 55.3;

      // Use upsert to guarantee profile row exists
      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          display_name: name.trim() || null,
          latitude,
          longitude,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'id'
        });

      if (error) throw error;

      toast.success(t('onboarding.profileComplete'));
      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error(t('onboarding.failedToSave'));
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

  if (checkingProfile) {
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
                  {t('onboarding.welcomeToNaja')}
                </h1>
                <p className="text-muted-foreground">
                  {t('onboarding.journeyStarts')}
                </p>
              </div>

              <div className="flex justify-center mb-8">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-5xl">🕌</span>
                </div>
              </div>

              <p className="text-center text-muted-foreground leading-relaxed mb-8">
                {t('onboarding.appDescription')}
              </p>

              <Button 
                onClick={handleNext}
                className="w-full h-12"
              >
                {t('onboarding.getStarted')}
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
                  {t('onboarding.setUpProfile')}
                </h1>
                <p className="text-muted-foreground">
                  {t('onboarding.personalizeExperience')}
                </p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="flex items-center gap-2 text-sm font-medium">
                    <User className="w-4 h-4" />
                    {t('onboarding.yourName')}
                  </label>
                  <Input
                    id="name"
                    placeholder={t('onboarding.enterName')}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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
                      {t('common.saving') || 'Saving...'}
                    </>
                  ) : (
                    <>
                      {t('onboarding.completeSetup')}
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
                  {t('common.back')}
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
