import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Mail, CheckCircle2, RefreshCw } from "lucide-react";

export default function VerifyEmail() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState<string | null>(null);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    // Check for unverified user or get email from session
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // User is logged in
        if (session.user.email_confirmed_at) {
          // Email is already verified, redirect to dashboard
          navigate("/dashboard", { replace: true });
          return;
        }
        setEmail(session.user.email || null);
      } else {
        // Check localStorage for pending verification email
        const pendingEmail = localStorage.getItem("naja_pending_verification_email");
        if (pendingEmail) {
          setEmail(pendingEmail);
        } else {
          // No pending verification, redirect to auth
          navigate("/auth", { replace: true });
          return;
        }
      }
      setCheckingAuth(false);
    };

    checkAuth();

    // Listen for auth changes (email confirmation)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session?.user?.email_confirmed_at) {
        localStorage.removeItem("naja_pending_verification_email");
        toast.success(t("auth.emailVerified"));
        navigate("/dashboard", { replace: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, t]);

  // Cooldown timer
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleResendEmail = async () => {
    if (!email || cooldown > 0) return;
    
    setResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) throw error;
      
      toast.success(t("auth.verificationEmailResent"));
      setCooldown(60); // 60 second cooldown
    } catch (error: any) {
      toast.error(error.message || t("auth.resendFailed"));
    } finally {
      setResending(false);
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
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md bg-card border-border">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-semantic-blue-soft flex items-center justify-center">
              <Mail className="w-10 h-10 text-semantic-blue-dark" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">
            {t("auth.verifyYourEmail")}
          </CardTitle>
          <CardDescription className="text-base">
            {t("auth.verificationEmailSentTo")}
          </CardDescription>
          {email && (
            <p className="font-medium text-foreground mt-2">{email}</p>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted/50 rounded-xl p-4 space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
              <p className="text-sm text-muted-foreground">
                {t("auth.checkInboxInstructions")}
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
              <p className="text-sm text-muted-foreground">
                {t("auth.clickVerificationLink")}
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
              <p className="text-sm text-muted-foreground">
                {t("auth.checkSpamFolder")}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleResendEmail}
              variant="outline"
              className="w-full h-12 rounded-full"
              disabled={resending || cooldown > 0}
            >
              {resending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t("auth.resendingEmail")}
                </>
              ) : cooldown > 0 ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  {t("auth.resendIn", { seconds: cooldown })}
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  {t("auth.resendVerificationEmail")}
                </>
              )}
            </Button>

            <Link to="/auth" className="block">
              <Button
                variant="ghost"
                className="w-full h-12 rounded-full text-muted-foreground"
              >
                {t("auth.backToSignIn")}
              </Button>
            </Link>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            {t("auth.wrongEmail")}{" "}
            <Link to="/auth" className="text-primary hover:underline">
              {t("auth.signUpAgain")}
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
