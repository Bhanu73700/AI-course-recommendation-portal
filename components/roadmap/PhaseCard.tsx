"use client";

import * as React from "react";
import Link from "next/link";
import { RoadmapPhase, Course } from "@/types";
import { useAppStore } from "@/store/useAppStore";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, Clock, FolderGit2, BookOpen, ExternalLink, Lock } from "lucide-react";

interface PhaseCardProps {
  phase: RoadmapPhase;
  phaseIndex: number;
  isUnlocked: boolean;
  assignedCourses: Course[];
}

export function PhaseCard({
  phase,
  phaseIndex,
  isUnlocked,
  assignedCourses,
}: PhaseCardProps) {
  const { roadmapCheckpoints, toggleCheckpoint } = useAppStore();

  const completedCheckpointsCount = phase.checkpoints.filter((cp) =>
    roadmapCheckpoints.includes(cp)
  ).length;

  const isPhaseCompleted =
    phase.checkpoints.length > 0 &&
    completedCheckpointsCount === phase.checkpoints.length;

  return (
    <div
      className={`rounded-card border transition-all duration-200 p-5 bg-background ${
        isPhaseCompleted
          ? "border-success/40 bg-success/5"
          : isUnlocked
          ? "border-border hover:border-foreground/40 shadow-sm"
          : "border-border/50 opacity-70 bg-surface/40"
      }`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border/60">
        <div className="flex items-center gap-2.5">
          <div
            className={`h-7 w-7 rounded-full flex items-center justify-center font-mono text-xs font-semibold ${
              isPhaseCompleted
                ? "bg-success text-white"
                : isUnlocked
                ? "bg-accent text-white"
                : "bg-surface border border-border text-muted"
            }`}
          >
            {isPhaseCompleted ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : isUnlocked ? (
              phaseIndex + 1
            ) : (
              <Lock className="h-3.5 w-3.5" />
            )}
          </div>

          <div>
            <h3 className="font-semibold text-base text-foreground">{phase.title}</h3>
            <p className="text-xs text-muted leading-relaxed">{phase.goal}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center font-mono text-xs text-muted">
          <Clock className="h-3.5 w-3.5" />
          <span>≈ {phase.durationWeeks} weeks</span>
        </div>
      </div>

      {/* Skills learned in this phase */}
      {phase.skills.length > 0 && (
        <div className="py-3 flex flex-wrap items-center gap-1.5 border-b border-border/50">
          <span className="text-[11px] text-muted mr-1">Skills:</span>
          {phase.skills.map((sk) => (
            <span
              key={sk}
              className="text-[10px] px-2 py-0.5 rounded-full bg-surface border border-border text-foreground font-mono"
            >
              {sk}
            </span>
          ))}
        </div>
      )}

      {/* Assigned Recommended Courses */}
      {assignedCourses.length > 0 && (
        <div className="py-3 border-b border-border/50 space-y-2">
          <p className="text-[11px] font-mono uppercase text-muted tracking-label flex items-center gap-1.5">
            <BookOpen className="h-3 w-3 text-accent" />
            Assigned Courses:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {assignedCourses.map((c) => (
              <div
                key={c.id}
                className="p-2.5 rounded-md border border-border bg-surface flex items-center justify-between gap-2 text-xs"
              >
                <div className="min-w-0">
                  <p className="font-medium text-foreground truncate">{c.title}</p>
                  <p className="text-[10px] text-muted">
                    {c.provider} · {c.durationHours} hrs · {c.priceUSD === 0 ? "Free" : `$${c.priceUSD}`}
                  </p>
                </div>
                <Link href={`/courses/${c.id}`}>
                  <Button variant="ghost" size="sm" className="h-6 px-2 text-[10px] gap-1 flex-shrink-0">
                    <span>View</span>
                    <ExternalLink className="h-2.5 w-2.5" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Capstone Project */}
      {phase.project && (
        <div className="py-3 border-b border-border/50 space-y-1 bg-surface/50 -mx-5 px-5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
            <FolderGit2 className="h-3.5 w-3.5 text-accent" />
            <span>Capstone Milestone: {phase.project.title}</span>
          </div>
          <p className="text-xs text-muted leading-relaxed">
            {phase.project.description}
          </p>
        </div>
      )}

      {/* Checkpoints Checklist */}
      <div className="pt-3 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-mono text-[11px] text-muted uppercase tracking-label">
            Phase Checkpoints
          </span>
          <span className="font-mono text-[11px] text-muted">
            {completedCheckpointsCount} of {phase.checkpoints.length} completed
          </span>
        </div>

        <div className="space-y-1.5">
          {phase.checkpoints.map((checkpoint) => {
            const isChecked = roadmapCheckpoints.includes(checkpoint);
            return (
              <label
                key={checkpoint}
                onClick={() => isUnlocked && toggleCheckpoint(checkpoint)}
                className={`flex items-start gap-2.5 p-2 rounded-md transition-colors text-xs select-none ${
                  isUnlocked ? "cursor-pointer hover:bg-surface" : "cursor-not-allowed opacity-60"
                }`}
              >
                {isChecked ? (
                  <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
                ) : (
                  <Circle className="h-4 w-4 text-muted flex-shrink-0 mt-0.5" />
                )}
                <span
                  className={
                    isChecked
                      ? "line-through text-muted"
                      : "text-foreground"
                  }
                >
                  {checkpoint}
                </span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
}
