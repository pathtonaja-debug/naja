import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowRight } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="p-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">NAJA</h1>
          </div>
          <Button
            onClick={() => navigate('/auth')}
            className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Get Started
          </Button>
        </div>
      </header>
      
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <Badge className="rounded-full bg-primary/20 text-primary border-primary/30 px-4 py-2">
            Your Spiritual Companion
          </Badge>
          
          <h2 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
            Strengthen Your Faith<br />
            <span className="text-primary">One Moment at a Time</span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A mindful companion for Muslims seeking to deepen their spiritual practice through
            reflection, habits, duas, and AI-powered guidance.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Button
              onClick={() => navigate('/auth')}
              size="lg"
              className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground h-14 px-8"
            >
              Start Your Journey
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              onClick={() => navigate('/dashboard')}
              size="lg"
              variant="outline"
              className="rounded-full h-14 px-8"
            >
              View Demo
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
