import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Auto-redirect to onboarding after a brief moment
    const timer = setTimeout(() => {
      navigate("/onboarding");
    }, 1500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full space-y-8 text-center animate-fade-in">
        <div className="space-y-4">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-[2.5rem] bg-primary/20">
            <span className="text-6xl">🌿</span>
          </div>
          <h1 className="text-4xl font-medium tracking-tight text-foreground">
            Welcome to NAJA
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Your spiritual companion for prayer, reflection, and mindful Islamic living.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
