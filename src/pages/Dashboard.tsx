import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Home, 
  BookOpen, 
  Heart, 
  UserCircle,
  Plus,
  Bell,
  Calendar as CalendarIcon,
  ArrowRight,
  Clock,
  Sparkles
} from "lucide-react";

const Dashboard = () => {
  const prayerTimes = [
    { name: "Fajr", time: "05:32 AM", completed: true },
    { name: "Dhuhr", time: "12:45 PM", completed: true },
    { name: "Asr", time: "03:58 PM", completed: false, isNext: true },
    { name: "Maghrib", time: "06:15 PM", completed: false },
    { name: "Isha", time: "07:42 PM", completed: false },
  ];

  const statusCounts = {
    completed: 2,
    upcoming: 3,
    onHold: 0,
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="px-6 pt-12 pb-6">
        <div className="flex items-center justify-between mb-8">
          <Avatar className="w-12 h-12">
            <AvatarImage src="" />
            <AvatarFallback className="bg-muted">U</AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-3">
            <Button size="icon" className="rounded-full bg-foreground hover:bg-foreground/90 w-12 h-12">
              <Plus className="w-5 h-5 text-background" />
            </Button>
            <Button size="icon" variant="ghost" className="rounded-full w-12 h-12 bg-muted hover:bg-muted/80">
              <Bell className="w-5 h-5 text-foreground" />
            </Button>
          </div>
        </div>

        <h1 className="text-2xl font-medium text-foreground mb-2">
          Assalamu Alaikum
        </h1>
        <p className="text-sm text-muted-foreground">Saturday, January 11, 2025</p>
      </header>

      {/* Main Content */}
      <main className="px-6 space-y-4">
        {/* Next Prayer Card - Dark */}
        <Card className="relative overflow-hidden bg-accent border-none shadow-card rounded-[2rem] p-6 pb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="w-14 h-14 border-2 border-muted/20">
                <AvatarImage src="" />
                <AvatarFallback className="bg-muted/10 text-accent-foreground">
                  🕌
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-accent-foreground font-medium text-lg mb-1">Next Prayer</h3>
                <div className="flex items-center gap-2 text-accent-foreground/70 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>03:58 PM - 04:30 PM</span>
                </div>
              </div>
            </div>
            <Button 
              size="icon" 
              className="rounded-full w-14 h-14 bg-primary hover:bg-primary/90 text-primary-foreground shrink-0"
            >
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
          <div 
            className="absolute bottom-0 left-0 right-0 h-2 bg-primary/30 rounded-b-[2rem]"
            style={{ clipPath: 'ellipse(50% 100% at 50% 100%)' }}
          />
        </Card>

        {/* Status Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-6 px-6 scrollbar-hide">
          <Badge 
            variant="outline" 
            className="rounded-full px-4 py-2 border-none bg-primary text-primary-foreground font-medium whitespace-nowrap"
          >
            Completed
            <span className="ml-2 bg-primary-foreground/20 px-2 py-0.5 rounded-full text-xs">
              {statusCounts.completed}
            </span>
          </Badge>
          <Badge 
            variant="outline" 
            className="rounded-full px-4 py-2 border-border bg-muted text-foreground font-medium whitespace-nowrap"
          >
            Upcoming
            <span className="ml-2 bg-foreground/10 px-2 py-0.5 rounded-full text-xs">
              {statusCounts.upcoming}
            </span>
          </Badge>
          <Badge 
            variant="outline" 
            className="rounded-full px-4 py-2 border-border bg-background text-muted-foreground font-medium whitespace-nowrap"
          >
            On hold
          </Badge>
        </div>

        {/* Prayer Cards - Lavender */}
        <Card className="relative overflow-hidden bg-secondary border-none shadow-card rounded-[2rem] p-6 pb-10">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-foreground font-medium text-lg mb-3">
                Morning Reflection
              </h3>
              <div className="flex items-center gap-2 text-foreground/70 text-sm mb-4">
                <Clock className="w-4 h-4" />
                <span>10:00 AM - 10:30 AM</span>
              </div>
              <Badge className="rounded-full bg-secondary-foreground/10 text-secondary-foreground hover:bg-secondary-foreground/15 border-secondary-foreground/20">
                Daily Habit
              </Badge>
            </div>
            <div className="flex gap-2">
              <Button 
                size="icon" 
                variant="ghost" 
                className="rounded-full w-10 h-10 bg-card hover:bg-card/80"
              >
                <CalendarIcon className="w-4 h-4" />
              </Button>
              <Button 
                size="icon" 
                variant="ghost" 
                className="rounded-full w-10 h-10 bg-card hover:bg-card/80"
              >
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div 
            className="absolute bottom-0 left-0 right-0 h-3"
            style={{ 
              background: 'hsl(250 30% 70%)',
              clipPath: 'ellipse(50% 100% at 50% 100%)' 
            }}
          />
        </Card>

        {/* Team/Community Section */}
        <Card className="border-border bg-card rounded-[2rem] p-5 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex -space-x-3">
              {[1, 2, 3].map((i) => (
                <Avatar key={i} className="w-10 h-10 border-2 border-card">
                  <AvatarFallback className="bg-muted text-muted-foreground">
                    {i}
                  </AvatarFallback>
                </Avatar>
              ))}
              <Button 
                size="icon" 
                className="w-10 h-10 rounded-full bg-foreground hover:bg-foreground/90 border-2 border-card"
              >
                <Plus className="w-4 h-4 text-background" />
              </Button>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="font-medium text-foreground">3</span>
              <span className="text-muted-foreground">In community</span>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="flex-1 bg-primary rounded-2xl px-4 py-2 text-center">
              <span className="text-sm font-medium text-primary-foreground">Active</span>
            </div>
            <div className="flex-1 bg-muted rounded-2xl px-4 py-2 text-center">
              <span className="text-sm font-medium text-muted-foreground">Paused</span>
            </div>
          </div>
        </Card>

        {/* Dhikr Counter - Lime Green */}
        <Card className="relative overflow-hidden bg-primary/20 border-none shadow-card rounded-[2rem] p-6 pb-10">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-foreground font-medium text-lg mb-3">
                Evening Dhikr
              </h3>
              <div className="flex items-center gap-2 text-foreground/70 text-sm mb-4">
                <Sparkles className="w-4 h-4" />
                <span>SubhanAllah × 33</span>
              </div>
              <Badge className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                In Progress
              </Badge>
            </div>
            <div className="flex gap-2">
              <Button 
                size="icon" 
                variant="ghost" 
                className="rounded-full w-10 h-10 bg-card hover:bg-card/80"
              >
                <CalendarIcon className="w-4 h-4" />
              </Button>
              <Button 
                size="icon" 
                variant="ghost" 
                className="rounded-full w-10 h-10 bg-card hover:bg-card/80"
              >
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div 
            className="absolute bottom-0 left-0 right-0 h-3"
            style={{ 
              background: 'hsl(68 58% 62%)',
              clipPath: 'ellipse(50% 100% at 50% 100%)' 
            }}
          />
        </Card>

        {/* Dua Reminder Card */}
        <Card className="border-border bg-card rounded-[2rem] p-5 shadow-card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center shrink-0">
              <Heart className="w-6 h-6 text-foreground" />
            </div>
            <div className="flex-1">
              <h3 className="text-foreground font-medium mb-1">Gratitude Dua</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-3.5 h-3.5" />
                <span>08:00 PM - 08:30 PM</span>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full border-2 border-primary bg-background flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-primary" />
            </div>
          </div>
        </Card>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 px-6 w-full max-w-md">
        <div className="bg-foreground rounded-full px-8 py-4 shadow-2xl">
          <div className="flex justify-around items-center">
            {[
              { icon: Home, active: true },
              { icon: BookOpen, active: false },
              { icon: CalendarIcon, active: false },
              { icon: UserCircle, active: false },
            ].map((item, index) => (
              <Button
                key={index}
                size="icon"
                variant="ghost"
                className={`rounded-full w-12 h-12 relative ${
                  item.active
                    ? "bg-card hover:bg-card/90"
                    : "hover:bg-accent-foreground/10"
                }`}
              >
                <item.icon 
                  className={`w-5 h-5 ${
                    item.active ? "text-foreground" : "text-accent-foreground/60"
                  }`} 
                />
                {item.active && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
                )}
              </Button>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Dashboard;
