import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  MapPin,
  Search,
  Loader2,
  Check,
  Calculator,
  CalendarDays,
  ChevronLeft,
} from "lucide-react";
import { toast } from "sonner";
import { searchCity, CityResult, getDefaultMethod } from "@/services/locationService";
import { getUserLocation, saveUserLocation } from "@/services/locationStore";

// Calculation methods (same as onboarding)
const METHODS = [
  { value: 16, name: "UAE / Dubai (AWQAF)", region: "United Arab Emirates" },
  { value: 4, name: "Umm Al-Qura", region: "Saudi Arabia & Gulf" },
  { value: 3, name: "Muslim World League", region: "Europe, Far East" },
  { value: 5, name: "Egyptian General Authority", region: "Africa, Syria, Iraq" },
  { value: 1, name: "University of Islamic Sciences", region: "Pakistan, Bangladesh, India" },
  { value: 2, name: "Islamic Society of North America", region: "USA & Canada" },
  { value: 12, name: "Union of French Islamic Orgs", region: "France & Europe" },
  { value: 11, name: "Majlis Ugama Islam Singapura", region: "Singapore & Malaysia" },
];

const HIJRI_ADJ_KEY = "naja_hijri_adjustment";

export function getHijriAdjustment(): number {
  try {
    const v = localStorage.getItem(HIJRI_ADJ_KEY);
    if (v !== null) return parseInt(v, 10) || 0;
  } catch { /* ignore */ }
  return 0;
}

export function setHijriAdjustment(adj: number): void {
  try {
    localStorage.setItem(HIJRI_ADJ_KEY, String(adj));
  } catch { /* ignore */ }
}

function getMethodName(value: number): string {
  return METHODS.find((m) => m.value === value)?.name ?? "Unknown";
}

interface PrayerSettingsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved?: () => void;
}

type Section = "main" | "city" | "method";

export function PrayerSettingsSheet({ open, onOpenChange, onSaved }: PrayerSettingsSheetProps) {
  const { t } = useTranslation();
  const location = getUserLocation();

  const [section, setSection] = useState<Section>("main");

  // City search state
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<CityResult[]>([]);
  const [searching, setSearching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Method state
  const [selectedMethod, setSelectedMethod] = useState<number>(location?.method ?? 3);

  // Hijri adjustment state
  const [hijriAdj, setHijriAdj] = useState(getHijriAdjustment());

  // Reset state when opening
  useEffect(() => {
    if (open) {
      setSection("main");
      setQuery("");
      setResults([]);
      const loc = getUserLocation();
      setSelectedMethod(loc?.method ?? 3);
      setHijriAdj(getHijriAdjustment());
    }
  }, [open]);

  // City search debounce
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

  const handleCitySelect = (city: CityResult) => {
    const autoMethod = getDefaultMethod(city.countryCode);
    saveUserLocation({
      city: city.name,
      lat: city.lat,
      lng: city.lng,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      method: autoMethod,
    });
    setSelectedMethod(autoMethod);
    toast.success(t("settings.locationSaved"));
    setSection("main");
    onSaved?.();
  };

  const handleMethodSelect = (method: number) => {
    setSelectedMethod(method);
    const loc = getUserLocation();
    if (loc) {
      saveUserLocation({ ...loc, method });
      toast.success(t("settings.locationSaved"));
      onSaved?.();
    }
    setSection("main");
  };

  const handleAdjustmentChange = (delta: number) => {
    const newAdj = Math.max(-1, Math.min(1, hijriAdj + delta));
    setHijriAdj(newAdj);
    setHijriAdjustment(newAdj);
    onSaved?.();
  };

  // ── City search section ──
  if (section === "city") {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" className="rounded-t-3xl max-h-[85vh] overflow-hidden flex flex-col">
          <SheetHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => setSection("main")}>
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <SheetTitle>{t("prayerSettings.changeCity")}</SheetTitle>
            </div>
          </SheetHeader>

          <div className="relative px-1 mb-3">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={t("location.onboarding.searchPlaceholder")}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 h-11"
              autoFocus
            />
            {searching && (
              <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground" />
            )}
          </div>

          <ScrollArea className="flex-1 -mx-1">
            <div className="px-1 space-y-1 pb-6">
              {results.map((city, i) => (
                <button
                  key={`${city.lat}-${city.lng}-${i}`}
                  onClick={() => handleCitySelect(city)}
                  className="w-full px-4 py-3 text-left hover:bg-muted/50 transition-colors rounded-xl flex items-start gap-3"
                >
                  <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-foreground line-clamp-2">{city.displayName}</span>
                </button>
              ))}
              {query.length >= 3 && !searching && results.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-6">
                  {t("common.noResults") || "No results found"}
                </p>
              )}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    );
  }

  // ── Method selection section ──
  if (section === "method") {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" className="rounded-t-3xl max-h-[85vh] overflow-hidden flex flex-col">
          <SheetHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => setSection("main")}>
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <SheetTitle>{t("prayerSettings.changeMethod")}</SheetTitle>
            </div>
          </SheetHeader>

          <ScrollArea className="flex-1 -mx-1">
            <div className="space-y-2 px-1 pb-6">
              {METHODS.map((method) => (
                <button
                  key={method.value}
                  onClick={() => handleMethodSelect(method.value)}
                  className={`w-full p-4 rounded-xl border text-left transition-all ${
                    selectedMethod === method.value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/40"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground text-sm">{method.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{method.region}</p>
                    </div>
                    {selectedMethod === method.value && (
                      <Check className="w-5 h-5 text-primary flex-shrink-0" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    );
  }

  // ── Main menu ──
  const currentLoc = getUserLocation();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl">
        <SheetHeader className="pb-4">
          <SheetTitle>{t("prayerSettings.title")}</SheetTitle>
          <SheetDescription>{t("prayerSettings.subtitle")}</SheetDescription>
        </SheetHeader>

        <div className="space-y-3 pb-6">
          {/* City */}
          <button
            onClick={() => setSection("city")}
            className="w-full p-4 rounded-xl border border-border hover:border-primary/40 text-left transition-all flex items-center gap-3"
          >
            <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">{t("prayerSettings.city")}</p>
              <p className="font-medium text-foreground text-sm truncate">
                {currentLoc?.city || t("prayerSettings.notSet")}
              </p>
            </div>
            <ChevronLeft className="w-4 h-4 text-muted-foreground rotate-180" />
          </button>

          {/* Method */}
          <button
            onClick={() => setSection("method")}
            className="w-full p-4 rounded-xl border border-border hover:border-primary/40 text-left transition-all flex items-center gap-3"
          >
            <Calculator className="w-5 h-5 text-primary flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">{t("prayerSettings.method")}</p>
              <p className="font-medium text-foreground text-sm truncate">
                {getMethodName(currentLoc?.method ?? 3)}
              </p>
            </div>
            <ChevronLeft className="w-4 h-4 text-muted-foreground rotate-180" />
          </button>

          {/* Hijri adjustment */}
          <div className="p-4 rounded-xl border border-border">
            <div className="flex items-center gap-3 mb-3">
              <CalendarDays className="w-5 h-5 text-primary flex-shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">{t("prayerSettings.hijriAdjust")}</p>
                <p className="text-xs text-muted-foreground/70">{t("prayerSettings.hijriAdjustHint")}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAdjustmentChange(-1)}
                disabled={hijriAdj <= -1}
                className="h-9 w-12"
              >
                −1
              </Button>
              <div className="flex-1 text-center font-semibold text-foreground">
                {hijriAdj > 0 ? `+${hijriAdj}` : hijriAdj === 0 ? "0" : hijriAdj}
                <span className="text-xs text-muted-foreground ml-1.5">
                  {hijriAdj === 0 ? t("prayerSettings.default") : t("prayerSettings.day")}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAdjustmentChange(1)}
                disabled={hijriAdj >= 1}
                className="h-9 w-12"
              >
                +1
              </Button>
            </div>
          </div>

          <p className="text-xs text-muted-foreground text-center pt-1">
            {t("method.onboarding.note")}
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
