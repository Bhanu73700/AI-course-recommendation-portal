"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useAppStore } from "@/store/useAppStore";
import { TRACKS } from "@/data/skills";
import { ROLES, getRolesByTrack } from "@/data/roles";
import { Stepper } from "@/components/assessment/Stepper";
import { SkillPicker } from "@/components/assessment/SkillPicker";
import { BudgetSelector } from "@/components/assessment/BudgetSelector";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { TrackCard } from "@/components/track/TrackCard";
import { Assessment, Format, Level, TrackId } from "@/types";
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Check,
  AlertCircle,
  Briefcase,
  GraduationCap,
  Clock,
  DollarSign,
  Layers,
} from "lucide-react";

const STEPS = [
  "Track",
  "Career Goal",
  "Current Level",
  "Known Skills",
  "Interests",
  "Weekly Time",
  "Budget",
  "Preferences",
  "Review",
];

const assessmentSchema = z.object({
  track: z.enum(["web", "android", "data-ai", "cybersecurity", "cloud-devops", "design", "cross-platform"]),
  careerGoal: z.string().min(1, "Please select a target role"),
  currentLevel: z.enum(["Beginner", "Intermediate", "Advanced"]),
  hoursPerWeek: z.number().min(1).max(40),
  budgetUSD: z.number().min(0),
  wantsCertificate: z.boolean(),
  knownSkills: z.array(z.string()),
  interests: z.array(z.string()),
});

export default function OnboardingPage() {
  const router = useRouter();
  const { track: initialTrack, assessment: savedAssessment, setAssessment, hasHydrated } = useAppStore();

  const [currentStep, setCurrentStep] = React.useState(0);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  // Form State
  const [track, setTrack] = React.useState<TrackId>(initialTrack || "web");
  const [careerGoal, setCareerGoal] = React.useState<string>("frontend-developer");
  const [currentLevel, setCurrentLevel] = React.useState<Level>("Beginner");
  const [knownSkills, setKnownSkills] = React.useState<string[]>([]);
  const [interests, setInterests] = React.useState<string[]>([]);
  const [hoursPerWeek, setHoursPerWeek] = React.useState<number>(10);
  const [budgetUSD, setBudgetUSD] = React.useState<number>(0);
  const [preferredFormats, setPreferredFormats] = React.useState<Format[]>([
    "Interactive",
    "Video",
    "Project-based",
  ]);
  const [wantsCertificate, setWantsCertificate] = React.useState<boolean>(false);
  const [deadlineWeeks, setDeadlineWeeks] = React.useState<number>(16);

  // Initialize from store
  React.useEffect(() => {
    if (hasHydrated) {
      if (savedAssessment) {
        setTrack(savedAssessment.track);
        setCareerGoal(savedAssessment.careerGoal);
        setCurrentLevel(savedAssessment.currentLevel);
        setKnownSkills(savedAssessment.knownSkills);
        setInterests(savedAssessment.interests || []);
        setHoursPerWeek(savedAssessment.hoursPerWeek);
        setBudgetUSD(savedAssessment.budgetUSD);
        setPreferredFormats(savedAssessment.preferredFormats);
        setWantsCertificate(savedAssessment.wantsCertificate);
        if (savedAssessment.deadlineWeeks) setDeadlineWeeks(savedAssessment.deadlineWeeks);
      } else if (initialTrack) {
        setTrack(initialTrack);
        const roles = getRolesByTrack(initialTrack);
        if (roles.length > 0) setCareerGoal(roles[0].id);
      }
    }
  }, [hasHydrated, savedAssessment, initialTrack]);

  // When track changes, update available roles and default careerGoal
  const availableRoles = React.useMemo(() => getRolesByTrack(track), [track]);
  const currentTrackMeta = React.useMemo(() => TRACKS.find((t) => t.id === track), [track]);

  React.useEffect(() => {
    if (availableRoles.length > 0 && !availableRoles.some((r) => r.id === careerGoal)) {
      setCareerGoal(availableRoles[0].id);
    }
  }, [availableRoles, careerGoal]);

  const handleNext = () => {
    setErrorMsg(null);

    // Step validations
    if (currentStep === 1 && !careerGoal) {
      setErrorMsg("Please select a target career role to proceed.");
      return;
    }

    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleFinalSubmit();
    }
  };

  const handleBack = () => {
    setErrorMsg(null);
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleFinalSubmit = () => {
    const finalData: Assessment = {
      track,
      extraTracks: [],
      careerGoal,
      currentLevel,
      knownSkills,
      interests,
      hoursPerWeek,
      budgetUSD,
      preferredFormats,
      deadlineWeeks,
      wantsCertificate,
    };

    const validation = assessmentSchema.safeParse(finalData);
    if (!validation.success) {
      setErrorMsg(validation.error.errors[0]?.message || "Validation failed");
      return;
    }

    setAssessment(finalData);
    router.push("/recommendations");
  };

  const toggleInterest = (subGroup: string) => {
    setInterests((prev) =>
      prev.includes(subGroup) ? prev.filter((i) => i !== subGroup) : [...prev, subGroup]
    );
  };

  const toggleFormat = (fmt: Format) => {
    setPreferredFormats((prev) =>
      prev.includes(fmt) ? prev.filter((f) => f !== fmt) : [...prev, fmt]
    );
  };

  // Time estimate live calculation
  const monthsEstimate = Math.max(1, Math.round((160 / hoursPerWeek) / 4));

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-4 sm:py-6">
      {/* Stepper Header */}
      <div className="space-y-4">
        <Stepper
          currentStep={currentStep}
          totalSteps={STEPS.length}
          steps={STEPS}
          onStepClick={(s) => setCurrentStep(s)}
        />
      </div>

      {errorMsg && (
        <div className="flex items-center gap-2 p-3 rounded-card bg-danger/10 border border-danger/30 text-danger text-xs">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Step Container */}
      <div className="min-h-[380px] rounded-card border border-border bg-background p-6 shadow-sm flex flex-col justify-between">
        {/* Step 1: Track */}
        {currentStep === 0 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-foreground">Select your learning track</h2>
              <p className="text-xs text-muted">
                Pick your primary discipline. All course recommendations and career milestones will focus here.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {TRACKS.map((t) => {
                const isSelected = track === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTrack(t.id)}
                    className={`p-3.5 rounded-card border text-left transition-all ${
                      isSelected
                        ? "border-accent ring-1 ring-accent bg-accent-soft/30"
                        : "border-border hover:border-foreground/30 bg-surface"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-xs sm:text-sm text-foreground">
                        {t.name}
                      </span>
                      {isSelected && <Check className="h-3.5 w-3.5 text-accent" />}
                    </div>
                    <p className="text-[11px] text-muted line-clamp-2 leading-relaxed">
                      {t.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2: Career Goal */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-foreground">What is your target role?</h2>
              <p className="text-xs text-muted">
                We will calculate your specific skill gap and roadmap milestones against this job profile.
              </p>
            </div>

            <div className="space-y-2.5 pt-2">
              {availableRoles.map((role) => {
                const isSelected = careerGoal === role.id;
                return (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => setCareerGoal(role.id)}
                    className={`w-full p-4 rounded-card border text-left transition-all flex items-start justify-between gap-3 ${
                      isSelected
                        ? "border-accent ring-1 ring-accent bg-accent-soft/30"
                        : "border-border hover:border-foreground/30 bg-surface"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Briefcase className="h-4 w-4 text-accent" />
                        <span className="font-semibold text-sm text-foreground">
                          {role.title}
                        </span>
                      </div>
                      <p className="text-xs text-muted leading-relaxed">
                        {role.summary}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {role.requiredSkills.slice(0, 4).map((rs) => (
                          <span
                            key={rs.skill}
                            className="text-[10px] px-2 py-0.5 rounded bg-background border border-border text-muted font-mono"
                          >
                            {rs.skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    {isSelected && <Check className="h-4 w-4 text-accent flex-shrink-0 mt-1" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: Current Level */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-foreground">What is your current experience level?</h2>
              <p className="text-xs text-muted">
                We will prioritize courses matching your exact starting point.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {[
                {
                  level: "Beginner" as Level,
                  title: "Beginner",
                  desc: "New to programming or this track. Starting with foundational syntax and concepts.",
                },
                {
                  level: "Intermediate" as Level,
                  title: "Intermediate",
                  desc: "Familiar with core syntax and built small projects. Ready for architecture and production patterns.",
                },
                {
                  level: "Advanced" as Level,
                  title: "Advanced",
                  desc: "Professional engineer looking to master advanced performance, testing, or multiplatform systems.",
                },
              ].map((lvl) => {
                const isSelected = currentLevel === lvl.level;
                return (
                  <button
                    key={lvl.level}
                    type="button"
                    onClick={() => setCurrentLevel(lvl.level)}
                    className={`w-full p-4 rounded-card border text-left transition-all flex items-start justify-between ${
                      isSelected
                        ? "border-accent ring-1 ring-accent bg-accent-soft/30"
                        : "border-border hover:border-foreground/30 bg-surface"
                    }`}
                  >
                    <div>
                      <span className="font-semibold text-sm text-foreground block mb-1">
                        {lvl.title}
                      </span>
                      <p className="text-xs text-muted leading-relaxed">{lvl.desc}</p>
                    </div>
                    {isSelected && <Check className="h-4 w-4 text-accent flex-shrink-0 mt-1" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 4: Known Skills */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-foreground">Which skills do you already know?</h2>
              <p className="text-xs text-muted">
                Courses teaching skills you already have will not waste your time.
              </p>
            </div>

            <SkillPicker
              selectedSkills={knownSkills}
              onChange={setKnownSkills}
              track={track}
            />
          </div>
        )}

        {/* Step 5: Interests / Sub-Groups */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-foreground">Topics of interest</h2>
              <p className="text-xs text-muted">
                Select specific sub-topics within {currentTrackMeta?.name} you want emphasized.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {currentTrackMeta?.subGroups.map((sg) => {
                const isSelected = interests.includes(sg);
                return (
                  <button
                    key={sg}
                    type="button"
                    onClick={() => toggleInterest(sg)}
                    className={`px-3 py-2 rounded-md border text-xs transition-colors flex items-center gap-1.5 ${
                      isSelected
                        ? "bg-accent text-white border-accent font-medium"
                        : "bg-surface border-border text-foreground hover:border-foreground/40"
                    }`}
                  >
                    {isSelected && <Check className="h-3 w-3" />}
                    <span>{sg}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 6: Weekly Time Commitment */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-foreground">How many hours per week can you study?</h2>
              <p className="text-xs text-muted">
                Your roadmap phases and course duration estimates will scale to match this.
              </p>
            </div>

            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted">Weekly Commitment:</span>
                <span className="text-2xl font-bold font-mono text-accent">
                  {hoursPerWeek} hrs / week
                </span>
              </div>

              <Slider
                min={1}
                max={40}
                step={1}
                value={[hoursPerWeek]}
                onValueChange={(val) => setHoursPerWeek(val[0])}
                className="py-4"
              />

              <div className="p-4 rounded-card border border-border bg-surface flex items-center gap-3">
                <Clock className="h-5 w-5 text-accent flex-shrink-0" />
                <div className="text-xs">
                  <p className="font-semibold text-foreground">
                    Estimated Time: ≈ {monthsEstimate} months to job readiness
                  </p>
                  <p className="text-muted mt-0.5">
                    Based on typical mastery hours for {careerGoal} at {hoursPerWeek} hrs/week.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 7: Budget */}
        {currentStep === 6 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-foreground">What is your learning budget?</h2>
              <p className="text-xs text-muted">
                Select $0 to restrict recommendations strictly to verified free open-access materials.
              </p>
            </div>

            <BudgetSelector value={budgetUSD} onChange={setBudgetUSD} />
          </div>
        )}

        {/* Step 8: Preferences */}
        {currentStep === 7 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-bold text-foreground">Learning preferences</h2>
              <p className="text-xs text-muted">
                Fine-tune your format and certification requirements.
              </p>
            </div>

            {/* Formats */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground block">
                Preferred Learning Formats:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {(["Video", "Interactive", "Project-based", "Text", "Bootcamp"] as Format[]).map((fmt) => {
                  const isSelected = preferredFormats.includes(fmt);
                  return (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => toggleFormat(fmt)}
                      className={`p-2.5 rounded-md border text-xs text-center transition-colors ${
                        isSelected
                          ? "bg-accent-soft border-accent text-accent font-medium"
                          : "bg-surface border-border text-muted hover:text-foreground"
                      }`}
                    >
                      {fmt}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Certificate Toggle */}
            <div className="pt-3 border-t border-border/60">
              <label className="flex items-center justify-between p-3 rounded-card border border-border bg-surface cursor-pointer select-none">
                <div>
                  <span className="font-semibold text-xs text-foreground block">
                    Require Completion Certificate
                  </span>
                  <span className="text-[11px] text-muted">
                    Prioritize courses that grant verifiable digital certificates.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={wantsCertificate}
                  onChange={(e) => setWantsCertificate(e.target.checked)}
                  className="h-4 w-4 rounded border-border text-accent focus:ring-accent"
                />
              </label>
            </div>
          </div>
        )}

        {/* Step 9: Review and Generate */}
        {currentStep === 8 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-foreground">Review Your Profile</h2>
              <p className="text-xs text-muted">
                Confirm your selections to compute your personalized recommendations and roadmap.
              </p>
            </div>

            <div className="p-4 rounded-card border border-border bg-surface space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-border/60">
                <span className="text-muted">Primary Track:</span>
                <span className="font-semibold text-foreground capitalize">{track}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/60">
                <span className="text-muted">Target Career Role:</span>
                <span className="font-semibold text-foreground">
                  {availableRoles.find((r) => r.id === careerGoal)?.title || careerGoal}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/60">
                <span className="text-muted">Experience Level:</span>
                <span className="font-semibold text-foreground">{currentLevel}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/60">
                <span className="text-muted">Known Skills:</span>
                <span className="font-semibold text-foreground">
                  {knownSkills.length > 0 ? knownSkills.join(", ") : "None yet (Fresh start)"}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/60">
                <span className="text-muted">Weekly Commitment:</span>
                <span className="font-semibold font-mono text-foreground">{hoursPerWeek} hrs/week</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-muted">Max Budget:</span>
                <span className="font-semibold font-mono text-foreground">
                  {budgetUSD === 0 ? "Free Only ($0)" : `$${budgetUSD} USD`}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="pt-6 border-t border-border flex items-center justify-between gap-3 mt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={handleBack}
            disabled={currentStep === 0}
            className="text-xs gap-1"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back</span>
          </Button>

          <Button
            type="button"
            onClick={handleNext}
            className="text-xs gap-1.5 px-6 font-medium"
          >
            {currentStep === STEPS.length - 1 ? (
              <>
                <Sparkles className="h-3.5 w-3.5" />
                <span>Generate Recommendations</span>
              </>
            ) : (
              <>
                <span>Next</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
