import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Search, Loader2, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { searchCity, CityResult, getDefaultMethod } from "@/services/locationService";
import { saveUserLocation } from "@/services/locationStore";
import { MethodOnboarding } from "./MethodOnboarding";

interface CityOnboardingProps {
  onComplete: () => void;
}

export function CityOnboarding({ onComplete }: CityOnboardingProps) {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<CityResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [selected, setSelected] = useState<CityResult | null>(null);
  const [step, setStep] = useState<"city" | "method">("city");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (query.length < 3) {
      setResults([]);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      const cities = await searchCity(query);
      setResults(cities);
      setSearching(false);
    }, 350);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  const handleSelect = (city: CityResult) => {
    setSelected(city);
    setQuery(city.name);
    setResults([]);
  };

  const handleCityConfirm = () => {
    if (!selected) return;
    setStep("method");
  };

  const handleMethodComplete = (method: number) => {
    if (!selected) return;

    saveUserLocation({
      city: selected.name,
      lat: selected.lat,
      lng: selected.lng,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      method,
    });

    setTimeout(() => {
      onComplete();
    }, 200);
  };

  // Step 2: Method selection
  if (step === "method" && selected) {
    return (
      <MethodOnboarding
        defaultMethod={getDefaultMethod(selected.countryCode)}
        onComplete={handleMethodComplete}
      />
    );
  }

  // Step 1: City search
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-background flex items-center justify-center p-6"
    >
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center space-y-3"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/15">
            <MapPin className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            {t("location.onboarding.title")}
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {t("location.onboarding.subtitle")}
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={t("location.onboarding.searchPlaceholder")}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelected(null);
              }}
              className="pl-10 h-12"
              autoFocus
            />
            {searching && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground" />
            )}
          </div>

          {/* Dropdown results */}
          <AnimatePresence>
            {results.length > 0 && !selected && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="absolute z-20 w-full mt-1 bg-card border border-border rounded-xl shadow-lg overflow-hidden"
              >
                {results.map((city, i) => (
                  <motion.button
                    key={`${city.lat}-${city.lng}-${i}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    onClick={() => handleSelect(city)}
                    className="w-full px-4 py-3 text-left hover:bg-muted/50 transition-colors border-b border-border/50 last:border-b-0 flex items-start gap-3"
                  >
                    <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-foreground line-clamp-2">
                      {city.displayName}
                    </span>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Selected city confirmation */}
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{selected.name}</p>
                    <p className="text-xs text-muted-foreground">{selected.displayName}</p>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleCityConfirm}
                className="w-full h-12"
              >
                <ChevronRight className="w-4 h-4 mr-2" />
                {t("common.continue")}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
