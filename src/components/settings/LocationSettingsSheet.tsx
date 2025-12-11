import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Loader2, Navigation } from "lucide-react";
import { toast } from "sonner";

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
  const [city, setCity] = useState(currentCity || "");
  const [country, setCountry] = useState(currentCountry || "");
  const [latitude, setLatitude] = useState(currentLatitude?.toString() || "");
  const [longitude, setLongitude] = useState(currentLongitude?.toString() || "");
  const [saving, setSaving] = useState(false);
  const [locating, setLocating] = useState(false);

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

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl">
        <SheetHeader className="pb-4">
          <SheetTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Set Location
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-6 pb-6">
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

          <p className="text-xs text-muted-foreground">
            Coordinates are used to calculate accurate prayer times for your location.
          </p>

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
