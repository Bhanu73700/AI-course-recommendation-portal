"use client";

import * as React from "react";
import Link from "next/link";
import { COURSES } from "@/data/courses";
import { ROLES, getRoleById } from "@/data/roles";
import { useAppStore } from "@/store/useAppStore";
import { getScaledRoadmap, calculateRoadmapProgress } from "@/lib/roadmap";
import { PhaseCard } from "@/components/roadmap/PhaseCard";
import { Checklist } from "@/components/roadmap/Checklist";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Printer, Sparkles, CheckCircle2 } from "lucide-react";

export default function RoadmapPage() {
  const { assessment, track, roadmapCheckpoints, hasHydrated } = useAppStore();

  const roleId = assessment?.careerGoal || (track === "android" ? "android-developer-junior" : "frontend-developer");
  const activeRole = getRoleById(roleId) || ROLES[0];
  const weeklyHours = assessment?.hoursPerWeek || 10;

  const { phases, totalWeeks, projectedCompletionDate } = React.useMemo(() => {
    return getScaledRoadmap(activeRole.id, activeRole.title, weeklyHours);
  }, [activeRole, weeklyHours]);

  const progressMetrics = React.useMemo(() => {
    return calculateRoadmapProgress(phases, roadmapCheckpoints);
  }, [phases, roadmapCheckpoints]);

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="space-y-8 print-page">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-4 no-print">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-accent-soft text-accent border border-accent/20 text-xs font-medium mb-1.5">
            <Sparkles className="h-3 w-3" />
            <span>Target Role: {activeRole.title}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tightest text-foreground">
            Phase-by-Phase Career Roadmap
          </h1>
          <p className="text-xs text-muted mt-1">
            Calibrated milestone progression scaled to your {weeklyHours} hours/week commitment.
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={handlePrint}
          className="text-xs gap-1.5 h-9 self-start sm:self-center"
        >
          <Printer className="h-3.5 w-3.5" />
          <span>Print / Save as PDF</span>
        </Button>
      </div>

      {/* Progress & Timeline Stats Banner */}
      <div className="rounded-card border border-border bg-surface p-5 space-y-4 card-print">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-3 border-b border-border/60">
          <div>
            <span className="text-[11px] font-mono uppercase text-muted tracking-label block">
              Estimated Duration
            </span>
            <div className="flex items-center gap-1.5 mt-0.5 font-mono text-base font-bold text-foreground">
              <Clock className="h-4 w-4 text-accent" />
              <span>≈ {totalWeeks} Weeks</span>
            </div>
          </div>

          <div>
            <span className="text-[11px] font-mono uppercase text-muted tracking-label block">
              Projected Job Readiness
            </span>
            <div className="flex items-center gap-1.5 mt-0.5 font-mono text-base font-bold text-foreground">
              <Calendar className="h-4 w-4 text-accent" />
              <span>{projectedCompletionDate}</span>
            </div>
          </div>

          <div>
            <span className="text-[11px] font-mono uppercase text-muted tracking-label block">
              Roadmap Checkpoints
            </span>
            <div className="flex items-center gap-1.5 mt-0.5 font-mono text-base font-bold text-accent">
              <CheckCircle2 className="h-4 w-4" />
              <span>
                {progressMetrics.completedCount} / {progressMetrics.totalCheckpoints} ({progressMetrics.percentage}%)
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-muted">
            <span>Overall Roadmap Completion</span>
            <span className="font-mono text-foreground font-semibold">{progressMetrics.percentage}%</span>
          </div>
          <Progress value={progressMetrics.percentage} className="h-2.5" />
        </div>
      </div>

      {/* Phases Vertical Timeline */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-border/60 pb-2">
          <h2 className="text-base font-semibold text-foreground">
            Sequential Learning Phases ({phases.length})
          </h2>
          <span className="text-xs text-muted font-mono">
            Check off items as you learn
          </span>
        </div>

        <div className="space-y-6">
          {phases.map((phase, index) => {
            // A phase is unlocked if it's the first one, or if the previous phase has at least 1 checkpoint completed
            const isUnlocked =
              index === 0 ||
              phases[index - 1].checkpoints.some((cp) => roadmapCheckpoints.includes(cp));

            const assignedCourses = COURSES.filter((c) =>
              phase.courseIds.includes(c.id)
            );

            return (
              <div key={phase.id} className="relative card-print">
                <PhaseCard
                  phase={phase}
                  phaseIndex={index}
                  isUnlocked={isUnlocked}
                  assignedCourses={assignedCourses}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Final Job-Ready Launch Checklist */}
      <div className="card-print">
        <Checklist />
      </div>
    </div>
  );
}
