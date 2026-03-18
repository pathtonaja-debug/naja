import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronLeft, Landmark, BookOpen, History, Heart, Star, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  HAJJ_STEPS,
  UMRAH_STEPS,
  HISTORY_SECTIONS,
  BENEFITS_SECTIONS,
  PILGRIMAGE_DUAS,
} from "@/data/pilgrimageContent";
import { PackingChecklist } from "@/components/pilgrimage/PackingChecklist";

const Pilgrimage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("hajj");
  const [expandedStep, setExpandedStep] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleStep = (id: string) =>
    setExpandedStep((prev) => (prev === id ? null : id));
  const toggleSection = (id: string) =>
    setExpandedSection((prev) => (prev === id ? null : id));

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border/40">
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            onClick={() => navigate(-1)}
            className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
            aria-label={t("common.back")}
          >
            <ChevronLeft className="h-5 w-5 text-foreground" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-foreground">
              {t("pilgrimage.title")}
            </h1>
            <p className="text-xs text-muted-foreground">
              {t("pilgrimage.subtitle")}
            </p>
          </div>
          <Landmark className="h-6 w-6 text-primary" />
        </div>
      </div>

      {/* Main tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="px-4 pt-3">
          <TabsList className="w-full grid grid-cols-5 h-10 bg-muted/50">
            <TabsTrigger value="hajj" className="text-xs font-medium">
              {t("pilgrimage.tabs.hajj")}
            </TabsTrigger>
            <TabsTrigger value="umrah" className="text-xs font-medium">
              {t("pilgrimage.tabs.umrah")}
            </TabsTrigger>
            <TabsTrigger value="history" className="text-xs font-medium">
              {t("pilgrimage.tabs.history")}
            </TabsTrigger>
            <TabsTrigger value="benefits" className="text-xs font-medium">
              {t("pilgrimage.tabs.benefits")}
            </TabsTrigger>
            <TabsTrigger value="duas" className="text-xs font-medium">
              {t("pilgrimage.tabs.duas")}
            </TabsTrigger>
          </TabsList>
        </div>

        {/* HAJJ TAB */}
        <TabsContent value="hajj" className="px-4 pt-4 space-y-3">
          {/* What is Hajj */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <h2 className="font-semibold text-foreground">
                  {t("pilgrimage.hajj.whatIs.title")}
                </h2>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t("pilgrimage.hajj.whatIs.content")}
              </p>
            </CardContent>
          </Card>

          {/* Conditions */}
          <Card>
            <CardContent className="p-4 space-y-2">
              <h3 className="font-semibold text-foreground text-sm">
                {t("pilgrimage.hajj.conditions.title")}
              </h3>
              <ul className="space-y-1.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                    <span className="text-primary font-medium shrink-0">{i}.</span>
                    <span>{t(`pilgrimage.hajj.conditions.c${i}`)}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Step-by-step */}
          <h3 className="font-semibold text-foreground pt-2">
            {t("pilgrimage.hajj.stepsTitle")}
          </h3>
          {HAJJ_STEPS.map((step, idx) => (
            <Card key={step.id} className="overflow-hidden">
              <button
                onClick={() => toggleStep(step.id)}
                className="w-full text-left p-4 flex items-start gap-3"
              >
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-sm">
                  {step.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-primary">
                      {t("pilgrimage.step")} {idx + 1}
                    </span>
                  </div>
                  <h4 className="font-medium text-foreground text-sm">
                    {t(step.titleKey)}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {t(step.descriptionKey)}
                  </p>
                </div>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 text-muted-foreground shrink-0 mt-1 transition-transform duration-200",
                    expandedStep === step.id && "rotate-180"
                  )}
                />
              </button>
              {expandedStep === step.id && (
                <div className="px-4 pb-4 pl-[3.75rem]">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t(step.detailsKey)}
                  </p>
                </div>
              )}
            </Card>
          ))}
        </TabsContent>

        {/* UMRAH TAB */}
        <TabsContent value="umrah" className="px-4 pt-4 space-y-3">
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <h2 className="font-semibold text-foreground">
                  {t("pilgrimage.umrah.whatIs.title")}
                </h2>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t("pilgrimage.umrah.whatIs.content")}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 space-y-2">
              <h3 className="font-semibold text-foreground text-sm">
                {t("pilgrimage.umrah.difference.title")}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t("pilgrimage.umrah.difference.content")}
              </p>
            </CardContent>
          </Card>

          <h3 className="font-semibold text-foreground pt-2">
            {t("pilgrimage.umrah.stepsTitle")}
          </h3>
          {UMRAH_STEPS.map((step, idx) => (
            <Card key={step.id} className="overflow-hidden">
              <button
                onClick={() => toggleStep(step.id)}
                className="w-full text-left p-4 flex items-start gap-3"
              >
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-sm">
                  {step.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-primary">
                      {t("pilgrimage.step")} {idx + 1}
                    </span>
                  </div>
                  <h4 className="font-medium text-foreground text-sm">
                    {t(step.titleKey)}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {t(step.descriptionKey)}
                  </p>
                </div>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 text-muted-foreground shrink-0 mt-1 transition-transform duration-200",
                    expandedStep === step.id && "rotate-180"
                  )}
                />
              </button>
              {expandedStep === step.id && (
                <div className="px-4 pb-4 pl-[3.75rem]">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t(step.detailsKey)}
                  </p>
                </div>
              )}
            </Card>
          ))}
        </TabsContent>

        {/* HISTORY TAB */}
        <TabsContent value="history" className="px-4 pt-4 space-y-3">
          <div className="flex items-center gap-2 pb-1">
            <History className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-foreground">
              {t("pilgrimage.history.title")}
            </h2>
          </div>
          {HISTORY_SECTIONS.map((section) => (
            <Card key={section.id} className="overflow-hidden">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full text-left p-4 flex items-center justify-between gap-2"
              >
                <h3 className="font-medium text-foreground text-sm">
                  {t(section.titleKey)}
                </h3>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-200",
                    expandedSection === section.id && "rotate-180"
                  )}
                />
              </button>
              {expandedSection === section.id && (
                <div className="px-4 pb-4">
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                    {t(section.contentKey)}
                  </p>
                </div>
              )}
            </Card>
          ))}
        </TabsContent>

        {/* BENEFITS TAB */}
        <TabsContent value="benefits" className="px-4 pt-4 space-y-3">
          <div className="flex items-center gap-2 pb-1">
            <Heart className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-foreground">
              {t("pilgrimage.benefits.title")}
            </h2>
          </div>

          {/* Hadith highlight */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-4">
              <p className="text-sm text-foreground italic leading-relaxed">
                "{t("pilgrimage.benefits.hadith")}"
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                — {t("pilgrimage.benefits.hadithSource")}
              </p>
            </CardContent>
          </Card>

          {BENEFITS_SECTIONS.map((section) => (
            <Card key={section.id}>
              <CardContent className="p-4 space-y-1.5">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-primary" />
                  <h3 className="font-medium text-foreground text-sm">
                    {t(section.titleKey)}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t(section.contentKey)}
                </p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* DUAS TAB */}
        <TabsContent value="duas" className="px-4 pt-4 space-y-3">
          <div className="flex items-center gap-2 pb-1">
            <span className="text-lg">🤲</span>
            <h2 className="font-semibold text-foreground">
              {t("pilgrimage.duas.title")}
            </h2>
          </div>

          {PILGRIMAGE_DUAS.map((dua) => (
            <Card key={dua.id}>
              <CardContent className="p-4 space-y-3">
                <p className="text-xs font-medium text-primary uppercase tracking-wider">
                  {t(dua.contextKey)}
                </p>
                <p
                  className="text-right text-xl leading-loose text-foreground"
                  style={{ fontFamily: "'Nabi', serif" }}
                  dir="rtl"
                >
                  {dua.arabic}
                </p>
                <p className="text-sm text-muted-foreground italic">
                  {dua.transliteration}
                </p>
                <p className="text-sm text-foreground leading-relaxed">
                  {t(dua.translationKey)}
                </p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Pilgrimage;
