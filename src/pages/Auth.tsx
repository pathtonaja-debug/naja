import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { PasswordStrengthIndicator, validatePasswordStrength } from "@/components/auth/PasswordStrengthIndicator";

// Validation schemas
const emailSchema = z.string().email("Please enter a valid email address");
const passwordSchema = z.string().min(6, "Password must be at least 6 characters");
const displayNameSchema = z.string().min(1, "Display name is required").max(100, "Display name too long");

export default function Auth() {
  const { t } = useTranslation();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("display_name")
          .eq("id", session.user.id)
          .single();
        
        if (!profile?.display_name) {
          navigate("/onboarding", { replace: true });
        } else {
          navigate("/dashboard", { replace: true });
        }
      }
      setCheckingSession(false);
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("display_name")
          .eq("id", session.user.id)
          .single();
        
        if (!profile?.display_name) {
          navigate("/onboarding", { replace: true });
        } else {
          navigate("/dashboard", { replace: true });
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      emailSchema.parse(email);
      passwordSchema.parse(password);
      if (isSignUp) {
        displayNameSchema.parse(displayName);
        const strengthCheck = validatePasswordStrength(password);
        if (!strengthCheck.valid) {
          toast.error(strengthCheck.message);
          setLoading(false);
          return;
        }
      }

      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: {
              display_name: displayName,
            },
          },
        });

        if (error) throw error;
        
        if (data.user && !data.user.email_confirmed_at) {
          localStorage.setItem("naja_pending_verification_email", email);
          toast.success(t('auth.verificationEmailSent'));
          navigate("/verify-email", { replace: true });
        } else {
          toast.success(t('auth.accountCreated'));
          navigate("/onboarding", { replace: true });
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          if (error.message?.includes("Email not confirmed")) {
            localStorage.setItem("naja_pending_verification_email", email);
            navigate("/verify-email", { replace: true });
            return;
          }
          throw error;
        }
        
        if (!rememberMe) {
          sessionStorage.setItem("naja_session_temp", "true");
        }
        
        toast.success(t('auth.welcomeBackMsg'));
        navigate("/dashboard", { replace: true });
      }
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast.error(error.issues[0].message);
      } else if (error.message?.includes("User already registered")) {
        toast.error(t('auth.emailAlreadyRegistered'));
        setIsSignUp(false);
      } else if (error.message?.includes("Invalid login credentials")) {
        toast.error(t('auth.invalidCredentials'));
      } else {
        toast.error(error.message || "Authentication failed");
      }
    } finally {
      setLoading(false);
    }
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
              <span className="text-3xl">🌿</span>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            {isSignUp ? t('auth.createAccount') : t('auth.signIn')}
          </CardTitle>
          <CardDescription className="text-center">
            {isSignUp ? (
              <>
                {t('auth.alreadyHaveAccountQuestion')}{" "}
                <button
                  type="button"
                  onClick={() => setIsSignUp(false)}
                  className="text-primary font-medium hover:underline"
                >
                  {t('auth.signIn')}
                </button>
              </>
            ) : (
              <>
                {t('auth.newUser')}{" "}
                <button
                  type="button"
                  onClick={() => setIsSignUp(true)}
                  className="text-primary font-medium hover:underline"
                >
                  {t('auth.createAnAccount')}
                </button>
              </>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleAuth} className="space-y-4">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="displayName">{t('auth.displayName')}</Label>
                <Input
                  id="displayName"
                  placeholder={t('auth.yourName')}
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required={isSignUp}
                  disabled={loading}
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">{t('auth.emailAddress')}</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="h-12 border-2 focus:border-primary"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">{t('auth.password')}</Label>
                {!isSignUp && (
                  <Link 
                    to="/forgot-password" 
                    className="text-sm text-primary hover:underline"
                  >
                    {t('auth.forgotPassword')}
                  </Link>
                )}
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={isSignUp ? 8 : 6}
                disabled={loading}
                className="h-12"
              />
              {isSignUp && <PasswordStrengthIndicator password={password} />}
            </div>
            
            {!isSignUp && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="rememberMe"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked === true)}
                  disabled={loading}
                />
                <Label 
                  htmlFor="rememberMe" 
                  className="text-sm text-muted-foreground cursor-pointer"
                >
                  {t('auth.rememberMe')}
                </Label>
              </div>
            )}
            
            <Button
              type="submit" 
              className="w-full h-12 rounded-full bg-primary hover:bg-primary/90" 
              disabled={loading || !email || !password}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {isSignUp ? t('auth.creatingAccount') : t('auth.signingIn')}
                </>
              ) : (
                isSignUp ? t('auth.signUp') : t('auth.signIn')
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
