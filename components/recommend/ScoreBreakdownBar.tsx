import * as React from "react";
import { ScoreBreakdown } from "@/types";

interface ScoreBreakdownBarProps {
  breakdown: ScoreBreakdown;
  score: number;
}

export function ScoreBreakdownBar({ breakdown, score }: ScoreBreakdownBarProps) {
  // Max possible weights: skillGap(35), level(15), goal(15), budget(10), time(10), format(5), quality(10) = 100
  const items = [
    { label: "Skill Gap", val: breakdown.skillGap, max: 35, color: "bg-accent" },
    { label: "Level Fit", val: breakdown.level, max: 15, color: "bg-emerald-500" },
    { label: "Goal Alignment", val: breakdown.goal, max: 15, color: "bg-indigo-500" },
    { label: "Budget", val: breakdown.budget, max: 10, color: "bg-blue-400" },
    { label: "Time Fit", val: breakdown.time, max: 10, color: "bg-amber-500" },
    { label: "Format", val: breakdown.format, max: 5, color: "bg-purple-500" },
    { label: "Quality", val: breakdown.quality, max: 10, color: "bg-rose-400" },
  ];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-foreground">Score Breakdown</span>
        <span className="font-mono text-muted text-[11px]">{score} / 100 points</span>
      </div>

      {/* Stacked Bar */}
      <div className="h-2 w-full rounded-full bg-border/40 overflow-hidden flex">
        {items.map((item) => {
          if (item.val <= 0) return null;
          return (
            <div
              key={item.label}
              style={{ width: `${item.val}%` }}
              className={`h-full ${item.color} transition-all duration-300`}
              title={`${item.label}: ${item.val} / ${item.max} pts`}
            />
          );
        })}
      </div>

      {/* Legend / Metrics list */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-1.5 text-[11px]">
            <span className={`w-2 h-2 rounded-full ${item.color} flex-shrink-0`} />
            <span className="text-muted truncate">{item.label}:</span>
            <span className="font-mono text-foreground font-medium ml-auto">
              {item.val}/{item.max}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
