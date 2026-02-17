import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Check, ChevronRight, Loader2, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MethodOption {
  value: number;
  name: string;
  region: string;
}

const METHODS: MethodOption[] = [
  { value: 16, name: "UAE / Dubai (AWQAF)", region: "United Arab Emirates" },
  { value: 4, name: "Umm Al-Qura", region: "Saudi Arabia & Gulf" },
  { value: 3, name: "Muslim World League", region: "Europe, Far East" },
  { value: 5, name: "Egyptian General Authority", region: "Africa, Syria, Iraq" },
  { value: 1, name: "University of Islamic Sciences", region: "Pakistan, Bangladesh, India" },
  { value: 2, name: "Islamic Society of North America", region: "USA & Canada" },
  { value: 12, name: "Union of French Islamic Orgs", region: "France & Europe" },
  { value: 11, name: "Majlis Ugama Islam Singapura", region: "Singapore & Malaysia" },
];

interface MethodOnboardingProps {
  defaultMethod: number;
  onComplete: (method: number) => void;
}

export function MethodOnboarding({ defaultMethod, onComplete }: MethodOnboardingProps) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<number>(defaultMethod);
  const [saving, setSaving] = useState(false);
  const selectedRef = useRef<HTMLButtonElement>(null);

  // Scroll selected into view on mount
  useEffect(() => {
    setTimeout(() => {
      selectedRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 300);
  }, []);

  const handleConfirm = () => {
    setSaving(true);
    setTimeout(() => {
      onComplete(selected);
    }, 200);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-background flex flex-col"
    >
      <div className="flex-1 flex flex-col max-w-md mx-auto w-full px-6 pt-12 pb-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center space-y-3 mb-6"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/15">
            <Calculator className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            {t("method.onboarding.title")}
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {t("method.onboarding.subtitle")}
          </p>
        </motion.div>

        {/* Method cards */}
        <ScrollArea className="flex-1 -mx-2">
          <div className="space-y-2.5 px-2 pb-4">
            {METHODS.map((method, i) => (
              <motion.button
                key={method.value}
                ref={method.value === selected ? selectedRef : undefined}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.04 }}
                onClick={() => setSelected(method.value)}
                className={`w-full p-4 rounded-xl border text-left transition-all ${
                  selected === method.value
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/40"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm">{method.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{method.region}</p>
                  </div>
                  {selected === method.value && (
                    <Check className="w-5 h-5 text-primary flex-shrink-0" />
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="space-y-3 pt-4">
          <Button
            onClick={handleConfirm}
            disabled={saving || selected === undefined}
            className="w-full h-12"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <ChevronRight className="w-4 h-4 mr-2" />
            )}
            {t("common.continue")}
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            {t("method.onboarding.note")}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
