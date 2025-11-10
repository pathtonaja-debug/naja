import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-secondary/20 to-accent/30 flex items-center justify-center p-6">
      <div className="text-center space-y-8 max-w-2xl animate-fade-in">
        <div className="space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
            <span className="text-5xl">🌿</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-light tracking-tight text-foreground">
            NAJA
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-lg mx-auto">
            A serene companion for your Islamic lifestyle. Reflection, prayer, and faith-centered daily life.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Button 
            onClick={() => navigate("/onboarding")}
            size="lg"
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white px-8 transition-all duration-200"
          >
            Begin Your Journey
          </Button>
          <Button 
            onClick={() => navigate("/dashboard")}
            variant="outline"
            size="lg"
            className="w-full sm:w-auto border-border hover:bg-accent px-8"
          >
            View Dashboard
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
          <div className="p-6 rounded-lg bg-card/50 border border-border backdrop-blur-sm">
            <div className="text-3xl mb-3">📔</div>
            <h3 className="font-medium text-foreground mb-2">Reflection Journal</h3>
            <p className="text-sm text-muted-foreground">
              Guided prompts for daily gratitude, intention, and spiritual growth
            </p>
          </div>
          <div className="p-6 rounded-lg bg-card/50 border border-border backdrop-blur-sm">
            <div className="text-3xl mb-3">🤲</div>
            <h3 className="font-medium text-foreground mb-2">Dua Builder</h3>
            <p className="text-sm text-muted-foreground">
              Create personalized duas with prophetic guidance and structure
            </p>
          </div>
          <div className="p-6 rounded-lg bg-card/50 border border-border backdrop-blur-sm">
            <div className="text-3xl mb-3">⏰</div>
            <h3 className="font-medium text-foreground mb-2">Prayer Times</h3>
            <p className="text-sm text-muted-foreground">
              Accurate Salah times with gentle reminders and tracking
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
