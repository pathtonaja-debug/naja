import { usePrayerTimes } from "@/hooks/usePrayerTimes";
import { Clock, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import mosqueIllustration from "@/assets/illustrations/mosque-illustration.png";

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
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative h-[170px] rounded-2xl overflow-hidden mx-4 mt-3"
    >
      {/* Background Image */}
      <img 
        src={mosqueIllustration} 
        alt="Mosque illustration" 
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-black/10 to-black/50" />
      
      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-between p-3.5">
        {/* Top Section - Greeting */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <p className="text-white/80 text-[10px] font-medium">السلام عليكم</p>
          <h1 className="text-white text-base font-semibold mt-0.5">
            {userName}
          </h1>
          <div className="flex items-center gap-1 mt-0.5 text-white/70 text-[10px]">
            <MapPin className="w-2.5 h-2.5" />
            <span>{locationDisplay}</span>
          </div>
        </motion.div>
        
        {/* Bottom Section - Next Prayer */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          className="backdrop-blur-xl bg-white/25 border border-white/30 rounded-xl p-2.5"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-[9px]">Next Prayer</p>
              <p className="text-white text-sm font-semibold">
                {nextPrayerName}
              </p>
              <p className="text-white/80 text-[10px]">
                {nextPrayerTime}
              </p>
            </div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1 bg-white/25 backdrop-blur-sm text-white px-2.5 py-1 rounded-full border border-white/30"
            >
              <Clock className="w-3 h-3" />
              <span className="text-[11px] font-medium">{countdown || "—"}</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
