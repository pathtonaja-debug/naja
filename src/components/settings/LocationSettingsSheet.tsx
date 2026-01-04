import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Loader2, Navigation, Clock } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { 
  getUserCalendarConfig, 
  setUserCalendarConfig, 
  clearIslamicCalendarCache,
  getUserTimeZone 
} from "@/services/islamicCalendarApi";
import { initializeRamadanPhase } from "@/services/ramadanState";

interface LocationSettingsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentCity: string | null;
  currentCountry: string | null;
  currentLatitude: number | null;
  currentLongitude: number | null;
  onSave: (data: {
    city: string | null;
    country: string | null;
    latitude: number | null;
    longitude: number | null;
  }) => Promise<{ success: boolean; error?: string }>;
}

export function LocationSettingsSheet({
  open,
  onOpenChange,
  currentCity,
  currentCountry,
  currentLatitude,
  currentLongitude,
  onSave,
}: LocationSettingsSheetProps) {
  const { t } = useTranslation();
  const [city, setCity] = useState(currentCity || "");
  const [country, setCountry] = useState(currentCountry || "");
  const [latitude, setLatitude] = useState(currentLatitude?.toString() || "");
  const [longitude, setLongitude] = useState(currentLongitude?.toString() || "");
  const [adjustment, setAdjustment] = useState(0);
  const [saving, setSaving] = useState(false);
  const [locating, setLocating] = useState(false);

  // Load existing Islamic calendar config
  useEffect(() => {
    const config = getUserCalendarConfig();
    if (config.city && !city) setCity(config.city);
    if (config.country && !country) setCountry(config.country);
    if (config.adjustment !== undefined) setAdjustment(config.adjustment);
  }, [open]);

  const handleUseCurrentLocation = async () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude: lat, longitude: lon } = position.coords;
        setLatitude(lat.toFixed(6));
        setLongitude(lon.toFixed(6));

        // Try to get city/country from reverse geocoding
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10`
          );
          const data = await response.json();
          
          if (data.address) {
            const cityName = data.address.city || data.address.town || data.address.village || data.address.municipality || "";
            const countryName = data.address.country || "";
            setCity(cityName);
            setCountry(countryName);
            toast.success(`Location detected: ${cityName}, ${countryName}`);
          }
        } catch (error) {
          console.error("Reverse geocoding failed:", error);
          toast.success("Coordinates detected. Enter city/country manually.");
        }

        setLocating(false);
      },
      (error) => {
        setLocating(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            toast.error("Location permission denied. Please enable location access.");
            break;
          case error.POSITION_UNAVAILABLE:
            toast.error("Location information unavailable.");
            break;
          case error.TIMEOUT:
            toast.error("Location request timed out.");
            break;
          default:
            toast.error("Failed to get location.");
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSave = async () => {
    const lat = latitude ? parseFloat(latitude) : null;
    const lon = longitude ? parseFloat(longitude) : null;

    if (latitude && (isNaN(lat!) || lat! < -90 || lat! > 90)) {
      toast.error("Invalid latitude. Must be between -90 and 90.");
      return;
    }

    if (longitude && (isNaN(lon!) || lon! < -180 || lon! > 180)) {
      toast.error("Invalid longitude. Must be between -180 and 180.");
      return;
    }

    setSaving(true);

    // Save to Islamic calendar config
    setUserCalendarConfig({
      city: city.trim() || undefined,
      country: country.trim() || undefined,
      adjustment: adjustment,
    });

    // Clear Islamic calendar cache so new settings take effect
    clearIslamicCalendarCache();

    // Re-initialize Ramadan phase with new settings
    initializeRamadanPhase().catch(console.warn);

    // Save to prayer times/profile (existing logic)
    const result = await onSave({
      city: city.trim() || null,
      country: country.trim() || null,
      latitude: lat,
      longitude: lon,
    });

    setSaving(false);

    if (result.success) {
      toast.success("Location saved");
      onOpenChange(false);
    } else {
      toast.error(result.error || "Failed to save location");
    }
  };

  const timezone = getUserTimeZone();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl">
        <SheetHeader className="pb-4">
          <SheetTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Set Location
          </SheetTitle>
          <SheetDescription>
            Used for prayer times and Islamic calendar accuracy.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 pb-6">
          {/* Timezone Display */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded-lg px-3 py-2">
            <Clock className="w-4 h-4" />
            <span>Timezone: {timezone}</span>
          </div>

          {/* Use Current Location Button */}
          <Button
            variant="outline"
            className="w-full h-12"
            onClick={handleUseCurrentLocation}
            disabled={locating}
          >
            {locating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Detecting location...
              </>
            ) : (
              <>
                <Navigation className="w-4 h-4 mr-2" />
                Use Current Location
              </>
            )}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or enter manually
              </span>
            </div>
          </div>

          {/* Manual Entry Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g., Dubai"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="e.g., UAE"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                type="number"
                step="any"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                placeholder="e.g., 25.2048"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                type="number"
                step="any"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                placeholder="e.g., 55.2708"
              />
            </div>
          </div>

          {/* Hijri Adjustment */}
          <div className="space-y-2">
            <Label htmlFor="adjustment">Hijri Date Adjustment</Label>
            <div className="flex gap-2 items-center">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setAdjustment(Math.max(-2, adjustment - 1))}
                disabled={adjustment <= -2}
              >
                -
              </Button>
              <div className="flex-1 text-center font-medium">
                {adjustment > 0 ? `+${adjustment}` : adjustment} {adjustment === 0 ? "(default)" : adjustment === 1 || adjustment === -1 ? "day" : "days"}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setAdjustment(Math.min(2, adjustment + 1))}
                disabled={adjustment >= 2}
              >
                +
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Adjust if the Hijri date shown doesn't match your local moonsighting.
            </p>
          </div>

          {/* Save Button */}
          <Button onClick={handleSave} className="w-full" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Location"
            )}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
