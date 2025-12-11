import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Check, Loader2, Calculator } from "lucide-react";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type PrayerMethod = Database["public"]["Enums"]["prayer_method"];

interface PrayerMethodSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentMethod: PrayerMethod | null;
  onSave: (method: PrayerMethod) => Promise<{ success: boolean; error?: string }>;
}

interface MethodOption {
  value: PrayerMethod;
  label: string;
  description: string;
}

const PRAYER_METHODS: MethodOption[] = [
  {
    value: "MWL",
    label: "Muslim World League",
    description: "Fajr: 18°, Isha: 17°",
  },
  {
    value: "Makkah",
    label: "Umm al-Qura (Makkah)",
    description: "Fajr: 18.5°, Isha: 90 min after Maghrib",
  },
  {
    value: "Egypt",
    label: "Egyptian General Authority",
    description: "Fajr: 19.5°, Isha: 17.5°",
  },
  {
    value: "Karachi",
    label: "University of Islamic Sciences (Karachi)",
    description: "Fajr: 18°, Isha: 18°",
  },
  {
    value: "ISNA",
    label: "ISNA (North America)",
    description: "Fajr: 15°, Isha: 15°",
  },
  {
    value: "Tehran",
    label: "Institute of Geophysics (Tehran)",
    description: "Fajr: 17.7°, Isha: 14°",
  },
  {
    value: "Jafari",
    label: "Shia Ithna-Ashari (Jafari)",
    description: "Fajr: 16°, Isha: 14°",
  },
];

export function PrayerMethodSheet({
  open,
  onOpenChange,
  currentMethod,
  onSave,
}: PrayerMethodSheetProps) {
  const [selected, setSelected] = useState<PrayerMethod>(currentMethod || "MWL");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const result = await onSave(selected);
    setSaving(false);

    if (result.success) {
      toast.success("Prayer method saved");
      onOpenChange(false);
    } else {
      toast.error(result.error || "Failed to save prayer method");
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl max-h-[85vh] overflow-y-auto">
        <SheetHeader className="pb-4">
          <SheetTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Prayer Calculation Method
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-3 pb-6">
          {PRAYER_METHODS.map((method) => (
            <button
              key={method.value}
              onClick={() => setSelected(method.value)}
              className={`w-full p-4 rounded-xl border text-left transition-all ${
                selected === method.value
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium text-foreground">{method.label}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {method.description}
                  </p>
                </div>
                {selected === method.value && (
                  <Check className="w-5 h-5 text-primary flex-shrink-0 ml-2" />
                )}
              </div>
            </button>
          ))}

          <p className="text-xs text-muted-foreground pt-2">
            Different methods use different angles to calculate Fajr and Isha times. 
            Choose the method used in your region or by your local mosque.
          </p>

          {/* Save Button */}
          <Button onClick={handleSave} className="w-full mt-4" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Method"
            )}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function getPrayerMethodLabel(method: PrayerMethod | null): string {
  const found = PRAYER_METHODS.find((m) => m.value === method);
  return found?.label || "Muslim World League";
}
