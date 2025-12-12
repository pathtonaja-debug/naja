import { usePrayerTimes } from "@/hooks/usePrayerTimes";
import { Clock, MapPin, Star } from "lucide-react";
import mosqueSunset from "@/assets/mosque-sunset.jpg";
import { motion } from "framer-motion";

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
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative h-[320px] sm:h-[380px] rounded-card overflow-hidden mx-4 mt-4"
    >
      {/* Background Image */}
      <img 
        src={mosqueSunset} 
        alt="Mosque at sunset" 
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      {/* Gradient Overlay - Flowblox style darker gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-black/20 to-black/80" />
      
      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-between p-5 sm:p-7">
        {/* Top Section - Greeting */}
        <div>
          <p className="text-white/70 text-sm font-medium tracking-wide">السلام عليكم</p>
          <h1 className="text-white text-3xl sm:text-4xl font-display font-semibold mt-1.5 tracking-tight">
            Welcome, {userName}
          </h1>
          <div className="flex items-center gap-2 mt-3 text-white/60 text-sm">
            <MapPin className="w-4 h-4" />
            <span>{locationDisplay}</span>
          </div>
        </div>
        
        {/* Bottom Section - Next Prayer Card (Flowblox style sage card) */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="sage-card p-5 sm:p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Star className="w-4 h-4 text-primary-foreground/60" />
                <p className="text-primary-foreground/70 text-sm font-medium">Next Prayer</p>
              </div>
              <p className="text-primary-foreground text-2xl sm:text-3xl font-display font-semibold tracking-tight">
                {nextPrayerName}
              </p>
              <p className="text-primary-foreground/70 text-base mt-1 font-medium">
                {nextPrayerTime}
              </p>
            </div>
            <div className="flex flex-col items-center gap-1.5 px-4 py-3 bg-accent/90 text-accent-foreground rounded-2xl">
              <Clock className="w-5 h-5" />
              <span className="text-sm font-semibold">{countdown || "—"}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
