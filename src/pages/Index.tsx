import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookOpen, Heart, Clock, ArrowRight } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="text-center space-y-10 max-w-2xl animate-fade-in">
        {/* Hero Section */}
        <div className="space-y-6">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-[2rem] bg-primary/20 mb-2">
            <span className="text-6xl">🌿</span>
          </div>
          <div className="space-y-3">
            <h1 className="text-5xl md:text-6xl font-medium tracking-tight text-foreground">
              NAJA
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-lg mx-auto">
              Your spiritual companion for reflection, prayer, and mindful Islamic living
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2">
          <Button 
            onClick={() => navigate("/onboarding")}
            size="lg"
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground px-8 rounded-full h-14 text-base font-medium"
          >
            Begin Your Journey
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <Button 
            onClick={() => navigate("/dashboard")}
            variant="outline"
            size="lg"
            className="w-full sm:w-auto border-border hover:bg-muted px-8 rounded-full h-14 text-base font-medium"
          >
            View Dashboard
          </Button>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-8">
          <Card className="p-6 rounded-[2rem] bg-card/80 backdrop-blur-sm border-border shadow-card hover:shadow-lg transition-all duration-200">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-14 h-14 rounded-[1.25rem] bg-primary/20 flex items-center justify-center">
                <BookOpen className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="font-medium text-foreground">Reflection Journal</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Guided prompts for daily gratitude and spiritual growth
              </p>
            </div>
          </Card>

          <Card className="p-6 rounded-[2rem] bg-card/80 backdrop-blur-sm border-border shadow-card hover:shadow-lg transition-all duration-200">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-14 h-14 rounded-[1.25rem] bg-secondary/40 flex items-center justify-center">
                <Heart className="w-7 h-7 text-secondary-foreground" />
              </div>
              <h3 className="font-medium text-foreground">Dua Builder</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Create personalized duas with prophetic structure
              </p>
            </div>
          </Card>

          <Card className="p-6 rounded-[2rem] bg-card/80 backdrop-blur-sm border-border shadow-card hover:shadow-lg transition-all duration-200">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-14 h-14 rounded-[1.25rem] bg-accent/90 flex items-center justify-center">
                <Clock className="w-7 h-7 text-accent-foreground" />
              </div>
              <h3 className="font-medium text-foreground">Prayer Times</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Accurate Salah times with gentle tracking
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
