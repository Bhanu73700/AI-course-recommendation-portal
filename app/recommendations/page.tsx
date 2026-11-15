"use client";

import * as React from "react";
import Link from "next/link";
import { COURSES } from "@/data/courses";
import { ROLES, getRoleById } from "@/data/roles";
import { useAppStore } from "@/store/useAppStore";
import { recommend } from "@/lib/recommend";
import { RecommendationCard } from "@/components/recommend/RecommendationCard";
import { WhyThis } from "@/components/recommend/WhyThis";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Sparkles,
  SlidersHorizontal,
  Compass,
  Zap,
  Award,
  Layers,
  CheckCircle2,
} from "lucide-react";
import { Assessment, Level } from "@/types";

export default function RecommendationsPage() {
  const { assessment, track, setAssessment, hasHydrated } = useAppStore();
  const [activeTab, setActiveTab] = React.useState<"all" | "fastest" | "free" | "projects">("all");
  const [isAdjustOpen, setIsAdjustOpen] = React.useState(false);

  // Fallback assessment if user navigated here directly without taking onboarding
  const effectiveAssessment: Assessment = React.useMemo(() => {
    if (assessment) return assessment;
    return {
      track: track || "web",
      extraTracks: [],
      careerGoal: track === "android" ? "android-developer-junior" : "frontend-developer",
      currentLevel: "Beginner",
      knownSkills: [],
      interests: [],
      hoursPerWeek: 10,
      budgetUSD: 100,
      preferredFormats: ["Video", "Interactive", "Project-based"],
      wantsCertificate: false,
    };
  }, [assessment, track]);

  const activeRole = React.useMemo(() => {
    return getRoleById(effectiveAssessment.careerGoal) || ROLES[0];
  }, [effectiveAssessment.careerGoal]);

  // Adjust preferences temporary form state
  const [tempBudget, setTempBudget] = React.useState(effectiveAssessment.budgetUSD);
  const [tempHours, setTempHours] = React.useState(effectiveAssessment.hoursPerWeek);
  const [tempLevel, setTempLevel] = React.useState<Level>(effectiveAssessment.currentLevel);

  React.useEffect(() => {
    setTempBudget(effectiveAssessment.budgetUSD);
    setTempHours(effectiveAssessment.hoursPerWeek);
    setTempLevel(effectiveAssessment.currentLevel);
  }, [effectiveAssessment]);

  const handleApplyPreferences = () => {
    setAssessment({
      ...effectiveAssessment,
      budgetUSD: tempBudget,
      hoursPerWeek: tempHours,
      currentLevel: tempLevel,
    });
    setIsAdjustOpen(false);
  };

  // Run deterministic recommendation engine
  const recommendations = React.useMemo(() => {
    return recommend(effectiveAssessment, COURSES, activeRole);
  }, [effectiveAssessment, activeRole]);

  // Tab views
  const filteredRecs = React.useMemo(() => {
    if (activeTab === "fastest") {
      // Sort by shortest duration among high matches
      return [...recommendations]
        .filter((r) => r.score >= 50)
        .sort((a, b) => a.course.durationHours - b.course.durationHours);
    }
    if (activeTab === "free") {
      return recommendations.filter((r) => r.course.priceUSD === 0);
    }
    if (activeTab === "projects") {
      return [...recommendations]
        .filter((r) => (r.course.projectsCount || 0) >= 3)
        .sort((a, b) => (b.course.projectsCount || 0) - (a.course.projectsCount || 0));
    }
    return recommendations;
  }, [recommendations, activeTab]);

  return (
    <div className="space-y-6">
      {/* Hero Line */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-accent-soft text-accent border border-accent/20 text-xs font-medium mb-1.5">
            <Sparkles className="h-3 w-3" />
            <span>Target Role: {activeRole.title}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tightest text-foreground">
            Top Course Matches
          </h1>
          <p className="text-xs text-muted mt-0.5">
            Ranked deterministically for your {effectiveAssessment.currentLevel} level and {effectiveAssessment.hoursPerWeek} hrs/week commitment.
          </p>
        </div>

        {/* Adjust Preferences Sheet */}
        <Sheet open={isAdjustOpen} onOpenChange={setIsAdjustOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="text-xs gap-1.5 h-9 self-start sm:self-center">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span>Adjust Preferences</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80 sm:w-96 p-6 flex flex-col justify-between">
            <div className="space-y-6">
              <SheetHeader className="text-left pb-3 border-b border-border">
                <SheetTitle className="text-base">Live Scoring Adjustments</SheetTitle>
              </SheetHeader>

              {/* Budget */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-foreground">Budget Limit ($USD):</span>
                  <span className="font-mono text-accent">
                    {tempBudget === 0 ? "Free Only ($0)" : `$${tempBudget}`}
                  </span>
                </div>
                <Input
                  type="number"
                  min={0}
                  value={tempBudget}
                  onChange={(e) => setTempBudget(Math.max(0, parseInt(e.target.value) || 0))}
                  className="text-xs h-8"
                />
              </div>

              {/* Weekly Hours */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-foreground">Weekly Study Time:</span>
                  <span className="font-mono text-accent">{tempHours} hrs / week</span>
                </div>
                <Slider
                  min={1}
                  max={40}
                  step={1}
                  value={[tempHours]}
                  onValueChange={(val) => setTempHours(val[0])}
                />
              </div>

              {/* Current Level */}
              <div className="space-y-2">
                <span className="font-medium text-xs text-foreground block">
                  Difficulty Level:
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  {(["Beginner", "Intermediate", "Advanced"] as Level[]).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setTempLevel(lvl)}
                      className={`py-1.5 text-xs rounded-md border text-center transition-colors ${
                        tempLevel === lvl
                          ? "bg-accent text-white border-accent font-medium"
                          : "bg-surface border-border text-muted hover:text-foreground"
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <Button onClick={handleApplyPreferences} className="w-full text-xs">
              Recompute Matches
            </Button>
          </SheetContent>
        </Sheet>
      </div>

      {/* Transparent Formula Explain Collapsible */}
      <WhyThis />

      {/* Curated Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-border/80 pb-3">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-3 py-1.5 rounded-full text-xs transition-colors flex items-center gap-1.5 ${
            activeTab === "all"
              ? "bg-foreground text-background font-semibold"
              : "bg-surface border border-border text-muted hover:text-foreground"
          }`}
        >
          <span>Best Overall ({recommendations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("fastest")}
          className={`px-3 py-1.5 rounded-full text-xs transition-colors flex items-center gap-1.5 ${
            activeTab === "fastest"
              ? "bg-foreground text-background font-semibold"
              : "bg-surface border border-border text-muted hover:text-foreground"
          }`}
        >
          <Zap className="h-3 w-3" />
          <span>Fastest Path</span>
        </button>

        <button
          onClick={() => setActiveTab("free")}
          className={`px-3 py-1.5 rounded-full text-xs transition-colors flex items-center gap-1.5 ${
            activeTab === "free"
              ? "bg-foreground text-background font-semibold"
              : "bg-surface border border-border text-muted hover:text-foreground"
          }`}
        >
          <CheckCircle2 className="h-3 w-3" />
          <span>Best Free Options</span>
        </button>

        <button
          onClick={() => setActiveTab("projects")}
          className={`px-3 py-1.5 rounded-full text-xs transition-colors flex items-center gap-1.5 ${
            activeTab === "projects"
              ? "bg-foreground text-background font-semibold"
              : "bg-surface border border-border text-muted hover:text-foreground"
          }`}
        >
          <Layers className="h-3 w-3" />
          <span>Best for Portfolio Projects</span>
        </button>
      </div>

      {/* Ranked List */}
      {filteredRecs.length > 0 ? (
        <div className="space-y-4">
          {filteredRecs.map((rec, index) => (
            <RecommendationCard
              key={rec.course.id}
              recommendation={rec}
              rank={index + 1}
            />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-card border border-dashed border-border bg-surface space-y-3">
          <Compass className="h-8 w-8 text-muted mx-auto" />
          <h3 className="font-semibold text-sm text-foreground">No matches for current criteria</h3>
          <p className="text-xs text-muted max-w-sm mx-auto">
            Try adjusting your budget or weekly hours in the &quot;Adjust Preferences&quot; panel.
          </p>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setActiveTab("all")}
            className="text-xs"
          >
            Show All Recommendations
          </Button>
        </div>
      )}
    </div>
  );
}
