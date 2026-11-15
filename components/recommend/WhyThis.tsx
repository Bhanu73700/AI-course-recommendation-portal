"use client";

import * as React from "react";
import { ChevronDown, ChevronUp, Info, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function WhyThis() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="rounded-card border border-border bg-surface overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3.5 text-left text-xs font-medium text-foreground hover:bg-background/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <HelpCircle className="h-4 w-4 text-accent" />
          <span>How CourseAI Scoring Works (Transparent & Deterministic Formula)</span>
        </div>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-muted" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted" />
        )}
      </button>

      {isOpen && (
        <div className="p-4 pt-1 border-t border-border/60 text-xs space-y-3 bg-background">
          <p className="text-muted leading-relaxed">
            CourseAI uses a deterministic scoring formula (0 to 100 points) evaluating 7 distinct dimensions. There are no black-box generative hallucinations:
          </p>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-border text-[11px] font-mono uppercase text-muted">
                  <th className="py-1.5 pr-4">Dimension</th>
                  <th className="py-1.5 pr-4">Weight</th>
                  <th className="py-1.5">Scoring Logic</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-muted">
                <tr>
                  <td className="py-1.5 pr-4 font-medium text-foreground">Skill-Gap Coverage</td>
                  <td className="py-1.5 pr-4 font-mono font-semibold text-accent">35 pts</td>
                  <td className="py-1.5">Sum of missing role skill weights covered by the course with diminishing returns.</td>
                </tr>
                <tr>
                  <td className="py-1.5 pr-4 font-medium text-foreground">Level Fit</td>
                  <td className="py-1.5 pr-4 font-mono font-semibold text-accent">15 pts</td>
                  <td className="py-1.5">1.0 for matching level, 0.6 if 1 level away, 0.2 if 2. Penalized if unmet prerequisites.</td>
                </tr>
                <tr>
                  <td className="py-1.5 pr-4 font-medium text-foreground">Career-Goal Alignment</td>
                  <td className="py-1.5 pr-4 font-mono font-semibold text-accent">15 pts</td>
                  <td className="py-1.5">Bonus when course career tags align with role ID and user’s selected interests.</td>
                </tr>
                <tr>
                  <td className="py-1.5 pr-4 font-medium text-foreground">Budget Fit</td>
                  <td className="py-1.5 pr-4 font-mono font-semibold text-accent">10 pts</td>
                  <td className="py-1.5">Free is 1.0 (10 pts). Within budget scales linearly. Over budget adds a warning.</td>
                </tr>
                <tr>
                  <td className="py-1.5 pr-4 font-medium text-foreground">Time Fit</td>
                  <td className="py-1.5 pr-4 font-mono font-semibold text-accent">10 pts</td>
                  <td className="py-1.5">Course duration scaled by user&apos;s weekly commitment against optional deadline.</td>
                </tr>
                <tr>
                  <td className="py-1.5 pr-4 font-medium text-foreground">Format Match</td>
                  <td className="py-1.5 pr-4 font-mono font-semibold text-accent">5 pts</td>
                  <td className="py-1.5">Matches user preference (Video, Interactive, Project-based, Text, Bootcamp).</td>
                </tr>
                <tr>
                  <td className="py-1.5 pr-4 font-medium text-foreground">Quality & Credibility</td>
                  <td className="py-1.5 pr-4 font-mono font-semibold text-accent">10 pts</td>
                  <td className="py-1.5">Bayesian-weighted user rating, portfolio project count, and certificate availability.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-[11px] text-muted font-mono pt-1">
            * Diversity constraint: No single course provider or sub-topic may occupy more than 3 slots in the top 8 recommendations.
          </p>
        </div>
      )}
    </div>
  );
}
