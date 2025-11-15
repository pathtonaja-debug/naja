import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IconBadge } from "@/design-system/IconBadge";
import { Flame, Check } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { useState, useEffect } from "react";
import { listHabits } from "@/services/db";

const Dashboard = () => {
  const [habits, setHabits] = useState<any[]>([]);
  const [moodWeek] = useState([
    { day: "Mon", date: 17, mood: "😢", selected: false },
    { day: "Tue", date: 18, mood: "😐", selected: false },
    { day: "Wed", date: 19, mood: "😊", selected: false },
    { day: "Thu", date: 20, mood: "😊", selected: true },
    { day: "Fri", date: 21, mood: null, selected: false },
    { day: "Sat", date: 22, mood: null, selected: false },
    { day: "Sun", date: 23, mood: null, selected: false },
  ]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const data = await listHabits();
    setHabits(data.slice(0, 3));
  }

  const highlights = [
    { label: "sleep", sublabel: "7/8 hours", color: "butter", emoji: "🌙", angle: "-12deg" },
    { label: "water", sublabel: "2/10 glasses", color: "sky", emoji: "💧", angle: "5deg" },
    { label: "mind", sublabel: "30/30 min", color: "pink", emoji: "🧠", angle: "-8deg" },
    { label: "pills", sublabel: "2/4", color: "olive", emoji: "💊", angle: "10deg" },
    { label: "study", sublabel: "1/6 hours", color: "lilac", emoji: "📚", angle: "-5deg" },
  ];

  return (
    <div className="min-h-screen bg-canvas pb-32">
      {/* App Bar */}
      <header className="px-5 pt-12 pb-6">
        <div className="flex items-start justify-between mb-6">
          <Avatar className="w-12 h-12 ring-2 ring-pink/20">
            <AvatarImage src="" />
            <AvatarFallback className="bg-pink text-ink900 text-lg font-medium">
              N
            </AvatarFallback>
          </Avatar>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-pink/30 rounded-full px-3 py-1.5">
              <Flame className="w-4 h-4 text-danger" />
              <span className="text-[15px] font-semibold text-ink900">53</span>
            </div>
          </div>
        </div>

        <div>
          <h1 className="text-[34px] leading-[40px] font-semibold text-ink900 mb-1">
            Hi, Nova!
          </h1>
          <p className="text-[17px] leading-[24px] text-ink400">
            How are you feeling today?
          </p>
        </div>
      </header>

      {/* Mood Week Strip */}
      <div className="px-5 pb-6">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {moodWeek.map((day) => (
            <div key={day.date} className="flex flex-col items-center min-w-[52px]">
              <span className="text-[13px] text-ink400 mb-2">{day.day}</span>
              <span className="text-[17px] font-semibold text-ink900 mb-2">{day.date}</span>
              {day.mood ? (
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center text-[24px] ${
                    day.selected ? "bg-pink" : "bg-pink/30"
                  }`}
                >
                  {day.mood}
                </div>
              ) : (
                <button className="w-11 h-11 rounded-full border-2 border-dashed border-stroke flex items-center justify-center text-ink400">
                  +
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="px-5 space-y-6">
        {/* Daily Highlights */}
        <div>
          <h2 className="text-[22px] leading-[28px] font-semibold text-ink900 mb-4">
            Daily highlights
          </h2>
          <div className="relative h-40 flex items-center justify-center gap-4 overflow-x-auto scrollbar-hide">
            {highlights.map((highlight, idx) => {
              const bgColors: Record<string, string> = {
                butter: "bg-butter",
                sky: "bg-sky",
                pink: "bg-pink",
                olive: "bg-olive",
                lilac: "bg-lilac",
              };
              const sizes = [
                "w-28 h-28",
                "w-32 h-32",
                "w-36 h-36",
                "w-28 h-28",
                "w-32 h-32",
              ];
              
              return (
                <div
                  key={idx}
                  className={`${bgColors[highlight.color]} ${sizes[idx]} rounded-[32px] shadow-card flex flex-col items-center justify-center shrink-0 relative`}
                  style={{ transform: `rotate(${highlight.angle})` }}
                >
                  <span className="text-[32px] mb-1">{highlight.emoji}</span>
                  <p className="text-[15px] font-semibold text-ink900">{highlight.label}</p>
                  <p className="text-[12px] text-ink700">{highlight.sublabel}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Challenges */}
        <div>
          <h2 className="text-[22px] leading-[28px] font-semibold text-ink900 mb-4">
            Challenges
          </h2>
          <Card className="p-5 bg-pink/20 border-pink/30">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-[17px] font-semibold text-ink900 mb-1">
                  30-day walking challenge 🏃‍♀️
                </h3>
                <p className="text-[13px] text-ink700 mb-2">
                  Walk for 1 hour every day
                </p>
              </div>
              <div className="flex -space-x-2">
                <div className="w-6 h-6 rounded-full bg-butter border-2 border-panel" />
                <div className="w-6 h-6 rounded-full bg-lilac border-2 border-panel" />
                <div className="w-6 h-6 rounded-full bg-olive border-2 border-panel" />
              </div>
            </div>
            <div className="h-2 bg-ink900/10 rounded-full overflow-hidden mb-2">
              <div className="h-full bg-pink rounded-full" style={{ width: "45%" }} />
            </div>
            <p className="text-[13px] text-ink700">You and 2 friends joined</p>
          </Card>
        </div>

        {/* Today's Tasks */}
        <div>
          <h2 className="text-[22px] leading-[28px] font-semibold text-ink900 mb-4">
            Today
          </h2>
          <div className="space-y-3">
            {habits.map((habit, idx) => {
              const colors = ["pink", "sky", "butter"];
              const emojis = ["🧘", "💧", "💊"];
              
              return (
                <Card key={habit.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <IconBadge
                        variant={colors[idx % colors.length] as any}
                        size="lg"
                        className="text-[24px]"
                      >
                        {emojis[idx % emojis.length]}
                      </IconBadge>
                      <div>
                        <h3 className="text-[17px] font-medium text-ink900">
                          {habit.name}
                        </h3>
                        <p className="text-[13px] text-ink400">
                          {habit.target_count || 30}/30 min
                        </p>
                      </div>
                    </div>
                    {habit.completed ? (
                      <div className="w-6 h-6 rounded-full bg-success flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    ) : (
                      <button className="w-6 h-6 rounded-full border-2 border-stroke flex items-center justify-center text-ink400 hover:border-pink">
                        +
                      </button>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Dashboard;
