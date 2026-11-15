"use client";

import * as React from "react";
import Link from "next/link";
import { ResumeAnalysis } from "@/types";
import { useAppStore } from "@/store/useAppStore";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScoreRing } from "@/components/courses/ScoreRing";
import {
  CheckCircle2,
  XCircle,
  Lightbulb,
  Plus,
  BookOpen,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";

interface ResumeReportProps {
  analysis: ResumeAnalysis;
  roleTitle: string;
}

export function ResumeReport({ analysis, roleTitle }: ResumeReportProps) {
  const { setKnownSkills, knownSkills } = useAppStore();
  const [addedSkillsNotice, setAddedSkillsNotice] = React.useState(false);

  const handleAddAllSkills = () => {
    const combined = Array.from(new Set([...knownSkills, ...analysis.detectedSkills]));
    setKnownSkills(combined);
    setAddedSkillsNotice(true);
    setTimeout(() => setAddedSkillsNotice(false), 3000);
  };

  return (
    <div className="space-y-6 pt-4">
      {/* Top Banner: Score & Readiness */}
      <div className="rounded-card border border-border bg-surface p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-lg text-foreground">
              Resume Strength Assessment
            </h3>
            <Badge variant="outline" className="font-mono text-[10px]">
              Evaluated against {roleTitle}
            </Badge>
          </div>
          <p className="text-xs text-muted max-w-lg leading-relaxed">
            Client-side structural and keyword audit based on industry hiring patterns, action verbs, and technical alignment.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <ScoreRing score={analysis.score} size="lg" showLabel={true} />
        </div>
      </div>

      {/* Detected Skills */}
      <div className="rounded-card border border-border bg-background p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h4 className="font-semibold text-sm text-foreground">
              Extracted Technical Skills ({analysis.detectedSkills.length})
            </h4>
            <p className="text-xs text-muted">
              Parsed from your master skill set and known aliases.
            </p>
          </div>

          <Button
            size="sm"
            variant="secondary"
            onClick={handleAddAllSkills}
            className="text-xs h-8 gap-1.5 self-start sm:self-center"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add all to my profile</span>
          </Button>
        </div>

        {addedSkillsNotice && (
          <div className="text-xs text-success bg-success/10 border border-success/20 p-2 rounded-md">
            ✓ Added {analysis.detectedSkills.length} skills to your learner profile!
          </div>
        )}

        <div className="flex flex-wrap gap-1.5 pt-1">
          {analysis.detectedSkills.length > 0 ? (
            analysis.detectedSkills.map((sk) => (
              <span
                key={sk}
                className="px-2.5 py-1 rounded-full bg-accent-soft text-accent border border-accent/20 text-xs font-mono"
              >
                {sk}
              </span>
            ))
          ) : (
            <p className="text-xs text-muted">No matching technical skills detected yet.</p>
          )}
        </div>
      </div>

      {/* Gaps versus Role */}
      {analysis.gapsVersusRole.length > 0 && (
        <div className="rounded-card border border-border bg-background p-5 space-y-3">
          <h4 className="font-semibold text-sm text-foreground">
            Missing Skills for {roleTitle} ({analysis.gapsVersusRole.length})
          </h4>
          <p className="text-xs text-muted">
            These required skills were not found in your resume text:
          </p>

          <div className="flex flex-wrap gap-1.5">
            {analysis.gapsVersusRole.map((gap) => (
              <span
                key={gap}
                className="px-2.5 py-1 rounded-full bg-surface border border-danger/30 text-danger text-xs font-mono"
              >
                -{gap}
              </span>
            ))}
          </div>

          {/* Recommended Courses to close gap */}
          {analysis.recommendedCourses.length > 0 && (
            <div className="pt-3 border-t border-border/50 space-y-2">
              <p className="text-[11px] font-mono uppercase text-muted tracking-label flex items-center gap-1">
                <BookOpen className="h-3 w-3 text-accent" />
                Target Courses to Close These Gaps:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {analysis.recommendedCourses.map((c) => (
                  <div
                    key={c.id}
                    className="p-2.5 rounded-md border border-border bg-surface flex flex-col justify-between text-xs"
                  >
                    <div>
                      <p className="font-medium text-foreground truncate">{c.title}</p>
                      <p className="text-[10px] text-muted">{c.provider} · {c.priceUSD === 0 ? "Free" : `$${c.priceUSD}`}</p>
                    </div>
                    <Link href={`/courses/${c.id}`} className="mt-2">
                      <Button variant="ghost" size="sm" className="h-6 w-full text-[10px] gap-1 text-accent">
                        <span>View Course</span>
                        <ExternalLink className="h-2.5 w-2.5" />
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Score Checklist */}
      <div className="rounded-card border border-border bg-background p-5 space-y-3">
        <h4 className="font-semibold text-sm text-foreground">
          Evaluation Checklist ({analysis.score}/100)
        </h4>

        <div className="space-y-2">
          {analysis.checklist.map((item) => (
            <div
              key={item.item}
              className="flex items-start justify-between gap-3 p-2.5 rounded-md border border-border/60 bg-surface/50 text-xs"
            >
              <div className="flex items-start gap-2.5">
                {item.passed ? (
                  <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="h-4 w-4 text-muted flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <p className={`font-medium ${item.passed ? "text-foreground" : "text-muted"}`}>
                    {item.item}
                  </p>
                  {!item.passed && (
                    <p className="text-[11px] text-muted mt-0.5">{item.tip}</p>
                  )}
                </div>
              </div>

              <span className="font-mono text-muted flex-shrink-0">
                {item.passed ? `+${item.points} pts` : "0 pts"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Suggestions */}
      {analysis.suggestions.length > 0 && (
        <div className="rounded-card border border-border bg-surface p-5 space-y-2.5">
          <h4 className="font-semibold text-sm text-foreground flex items-center gap-1.5">
            <Lightbulb className="h-4 w-4 text-accent" />
            <span>High-Impact Recommendations</span>
          </h4>
          <ul className="space-y-1.5 text-xs text-muted list-disc list-inside">
            {analysis.suggestions.map((s, idx) => (
              <li key={idx} className="leading-relaxed">
                <span className="text-foreground">{s}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Privacy & Disclaimer Notice */}
      <div className="p-3 rounded-card border border-border bg-surface/30 flex items-start gap-2.5 text-[11px] text-muted">
        <ShieldCheck className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-foreground">Local Privacy Guarantee:</strong> Your resume is parsed strictly on your computer inside this browser session. No text or data is uploaded to any remote server or external LLM API.
          <br />
          <span className="text-muted/80">
            * Heuristic analysis. It is not a substitute for human review by a hiring manager.
          </span>
        </p>
      </div>
    </div>
  );
}
