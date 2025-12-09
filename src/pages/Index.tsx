import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // User is authenticated, check if they have a profile with display_name
          const { data: profile } = await supabase
            .from("profiles")
            .select("display_name")
            .eq("id", session.user.id)
            .maybeSingle();

          if (profile?.display_name) {
            // Profile is complete, go to dashboard
            navigate("/dashboard", { replace: true });
          } else {
            // Profile needs setup
            navigate("/onboarding", { replace: true });
          }
        } else {
          // Not authenticated
          navigate("/auth", { replace: true });
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        navigate("/auth", { replace: true });
      } finally {
        setChecking(false);
      }
    };

    // Small delay for smooth transition
    const timer = setTimeout(() => {
      checkAuthAndRedirect();
    }, 800);

    return () => clearTimeout(timer);
  }, [navigate]);

  if (checking) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full space-y-8 text-center animate-fade-in">
          <div className="space-y-4">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-[2.5rem] bg-primary/20">
              <span className="text-6xl">🌿</span>
            </div>
            <h1 className="text-4xl font-medium tracking-tight text-foreground">
              NAJA
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Your spiritual companion for prayer, reflection, and mindful Islamic living.
            </p>
          </div>
          <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto mt-8" />
        </div>
      </div>
    );
  }

  return null;
};

export default Index;