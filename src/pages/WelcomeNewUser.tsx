import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Sparkles } from "lucide-react";
import { z } from "zod";

const displayNameSchema = z.string().min(1, "Display name is required").max(100, "Display name too long");

export default function WelcomeNewUser() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth", { replace: true });
        return;
      }

      // Pre-fill with name from Google if available
      const userName = session.user.user_metadata?.full_name || 
                       session.user.user_metadata?.name || "";
      setDisplayName(userName);
      setUserEmail(session.user.email || "");
      
      // Check if user already has a display name in profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name")
        .eq("id", session.user.id)
        .single();
      
      if (profile?.display_name) {
        // User already completed profile, redirect to dashboard
        navigate("/dashboard", { replace: true });
        return;
      }
      
      setCheckingSession(false);
    };

    checkSession();
  }, [navigate]);

  const handleComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      displayNameSchema.parse(displayName);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth", { replace: true });
        return;
      }

      // Update profile with display name
      const { error } = await supabase
        .from("profiles")
        .update({ 
          display_name: displayName,
          // Set default coordinates (can be updated later in settings)
          latitude: 48.8566,
          longitude: 2.3522,
        })
        .eq("id", session.user.id);

      if (error) throw error;

      toast.success(t('auth.profileCompleted'));
      navigate("/dashboard", { replace: true });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast.error(error.issues[0].message);
      } else {
        toast.error(error.message || t('auth.profileUpdateFailed'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      // Use email username as display name
      const fallbackName = userEmail.split("@")[0];
      await supabase
        .from("profiles")
        .update({ 
          display_name: fallbackName,
          latitude: 48.8566,
          longitude: 2.3522,
        })
        .eq("id", session.user.id);
    }
    navigate("/dashboard", { replace: true });
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background p-4">
      <Card className="w-full max-w-md backdrop-blur-xl bg-card/80 border-border/30">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            {t('auth.welcomeToNaja')}
          </CardTitle>
          <CardDescription className="text-center">
            {t('auth.completeYourProfile')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleComplete} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">{t('auth.whatShouldWeCallYou')}</Label>
              <Input
                id="displayName"
                placeholder={t('auth.yourName')}
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                disabled={loading}
                className="h-12 border-2 focus:border-primary"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full h-12 rounded-full" 
              disabled={loading || !displayName.trim()}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t('common.loading')}
                </>
              ) : (
                t('auth.getStarted')
              )}
            </Button>
          </form>
          <Button 
            variant="ghost" 
            className="w-full" 
            onClick={handleSkip}
            disabled={loading}
          >
            {t('auth.skipForNow')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
