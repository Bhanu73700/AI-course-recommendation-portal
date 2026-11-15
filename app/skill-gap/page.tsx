"use client";

import * as React from "react";
import Link from "next/link";
import { COURSES } from "@/data/courses";
import { ROLES, getRolesByTrack, getRoleById } from "@/data/roles";
import { useAppStore } from "@/store/useAppStore";
import { analyzeSkillGap } from "@/lib/skillGap";
import { SkillRow } from "@/components/skillgap/SkillRow";
import { GapChart } from "@/components/skillgap/GapChart";
import { ScoreRing } from "@/components/courses/ScoreRing";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Layers,
  Sparkles,
  ArrowRight,
  Compass,
} from "lucide-react";

export default function SkillGapPage() {
  const { knownSkills, track, assessment, setAssessment, hasHydrated } = useAppStore();

  const [selectedRoleId, setSelectedRoleId] = React.useState<string>(() => {
    return assessment?.careerGoal || (track === "android" ? "android-developer-junior" : "frontend-developer");
  });

  const activeRole = React.useMemo(() => {
    return getRoleById(selectedRoleId) || ROLES[0];
  }, [selectedRoleId]);

  const analysis = React.useMemo(() => {
    return analyzeSkillGap(knownSkills, activeRole, COURSES);
  }, [knownSkills, activeRole]);

  const handleRoleChange = (roleId: string) => {
    setSelectedRoleId(roleId);
    if (assessment) {
      setAssessment({
        ...assessment,
        careerGoal: roleId,
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Header & Target Role Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tightest text-foreground">
            Skill-Gap Analysis
          </h1>
          <p className="text-xs text-muted mt-1">
            Compare your current skill profile against real-world job role competencies.
          </p>
        </div>

        {/* Role Switcher */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <label className="text-xs text-muted whitespace-nowrap">Target Role:</label>
          <Select value={selectedRoleId} onValueChange={handleRoleChange}>
            <SelectTrigger className="h-9 w-60 text-xs bg-surface border-border">
              <SelectValue placeholder="Select target role" />
            </SelectTrigger>
            <SelectContent align="end">
              {ROLES.map((r) => (
                <SelectItem key={r.id} value={r.id} className="text-xs">
                  {r.title} ({r.track})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Hero Readiness Score Card */}
      <div className="rounded-card border border-border bg-background p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-accent-soft text-accent border border-accent/20 text-xs font-medium">
            <Sparkles className="h-3 w-3" />
            <span>Target Role: {activeRole.title}</span>
          </div>

          <h2 className="text-xl font-bold text-foreground">
            Role Readiness: {analysis.readinessPercent}%
          </h2>

          <p className="text-xs text-muted leading-relaxed">
            {analysis.readinessPercent >= 80
              ? "You have covered the vast majority of critical core competencies for this role. Focus on testing and portfolio capstones."
              : analysis.readinessPercent >= 40
              ? "Good foundation! You have acquired several foundational skills. Tackle the high-priority missing skills below to qualify for entry roles."
              : "Early stage. Prioritize foundational language syntax and core framework skills marked High Priority below."}
          </p>

          <div className="flex items-center gap-2 text-[11px] text-muted font-mono pt-1">
            <span>Covered Weight: {analysis.coveredWeight.toFixed(1)}</span>
            <span>·</span>
            <span>Total Required: {analysis.totalRequiredWeight} pts</span>
            <span>·</span>
            <span>Formula: (Covered ÷ Required) × 100</span>
          </div>
        </div>

        <div className="flex flex-col items-center p-3 rounded-card border border-border bg-surface flex-shrink-0">
          <ScoreRing score={analysis.readinessPercent} size="lg" showLabel={true} />
        </div>
      </div>

      {/* Visual Chart */}
      <GapChart analysis={analysis} />

      {/* 3 Skill Groups: Missing, Partially, Have */}
      <div className="space-y-6">
        {/* Missing Skills */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-border/60 pb-2">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-danger" />
              <h3 className="font-semibold text-sm text-foreground">
                Missing Skills ({analysis.missing.length})
              </h3>
            </div>
            <span className="text-xs text-muted font-mono">
              Highest priority gaps to close
            </span>
          </div>

          {analysis.missing.length > 0 ? (
            <div className="space-y-2.5">
              {analysis.missing.map((item) => (
                <SkillRow key={item.skill} item={item} />
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted p-4 rounded-card border border-dashed border-border bg-surface text-center">
              ✓ No missing skills! You meet all core requirements for this role.
            </p>
          )}
        </div>

        {/* Partially Covered Skills */}
        {analysis.partially.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-border/60 pb-2">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-warning" />
                <h3 className="font-semibold text-sm text-foreground">
                  Partially Covered / Related ({analysis.partially.length})
                </h3>
              </div>
              <span className="text-xs text-muted font-mono">50% weight credit</span>
            </div>

            <div className="space-y-2.5">
              {analysis.partially.map((item) => (
                <SkillRow key={item.skill} item={item} />
              ))}
            </div>
          </div>
        )}

        {/* Have (Mastered Skills) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-border/60 pb-2">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-success" />
              <h3 className="font-semibold text-sm text-foreground">
                Acquired Skills ({analysis.have.length})
              </h3>
            </div>
            <span className="text-xs text-muted font-mono">100% credit applied</span>
          </div>

          {analysis.have.length > 0 ? (
            <div className="space-y-2.5">
              {analysis.have.map((item) => (
                <SkillRow key={item.skill} item={item} />
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted p-4 rounded-card border border-dashed border-border bg-surface text-center">
              None yet. Tick the checkmark next to any skill above once you master it!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
