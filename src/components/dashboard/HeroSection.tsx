import { usePrayerTimes } from "@/hooks/usePrayerTimes";
import { Clock, MapPin } from "lucide-react";
import mosqueHero from "@/assets/mosque-hero.jpg";

interface HeroSectionProps {
  userName?: string;
  city?: string;
  country?: string;
}

export function HeroSection({ userName = "User", city, country }: HeroSectionProps) {
  const { prayerTimes, countdown } = usePrayerTimes();
  
  const locationDisplay = city && country 
    ? `${city}, ${country}` 
    : city || country || "Location not set";

  // Get next prayer info from prayers array
  const nextPrayerInfo = prayerTimes?.prayers?.find(p => p.isNext);
  const nextPrayerName = nextPrayerInfo?.name || prayerTimes?.next || "—";
  const nextPrayerTime = nextPrayerInfo?.time || "—";

  return (
    <div className="relative h-[280px] sm:h-[320px] rounded-card overflow-hidden mx-4 mt-4">
      {/* Background Image */}
      <img 
        src={mosqueHero} 
        alt="Mosque at sunset" 
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/70" />
      
      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-between p-5 sm:p-6">
        {/* Top Section - Greeting */}
        <div>
          <p className="text-white/70 text-sm font-medium">السلام عليكم</p>
          <h1 className="text-white text-2xl sm:text-3xl font-semibold mt-1">
            {userName}
          </h1>
          <div className="flex items-center gap-1.5 mt-2 text-white/60 text-xs sm:text-sm">
            <MapPin className="w-3.5 h-3.5" />
            <span>{locationDisplay}</span>
          </div>
        </div>
        
        {/* Bottom Section - Next Prayer */}
        <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-xs sm:text-sm">Next Prayer</p>
              <p className="text-white text-xl sm:text-2xl font-semibold mt-0.5">
                {nextPrayerName}
              </p>
              <p className="text-white/70 text-sm mt-1">
                {nextPrayerTime}
              </p>
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full border border-white/30">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">{countdown || "—"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
