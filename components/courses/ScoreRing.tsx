import * as React from "react";
import { cn } from "@/lib/utils";

interface ScoreRingProps {
  score: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export function ScoreRing({ score, size = "md", showLabel = false }: ScoreRingProps) {
  const normalized = Math.max(0, Math.min(100, Math.round(score)));

  // Sizes: sm (32px), md (44px), lg (64px)
  const dimensions = {
    sm: { size: 32, stroke: 3, radius: 13, text: "text-[10px]" },
    md: { size: 44, stroke: 3.5, radius: 18, text: "text-xs font-semibold" },
    lg: { size: 68, stroke: 5, radius: 27, text: "text-lg font-bold" },
  }[size];

  const circumference = 2 * Math.PI * dimensions.radius;
  const strokeDashoffset = circumference - (normalized / 100) * circumference;

  let colorClass = "text-accent stroke-accent";
  if (normalized >= 85) colorClass = "text-success stroke-success";
  else if (normalized < 60) colorClass = "text-warning stroke-warning";

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative inline-flex items-center justify-center" style={{ width: dimensions.size, height: dimensions.size }}>
        <svg
          className="transform -rotate-90"
          width={dimensions.size}
          height={dimensions.size}
        >
          {/* Background circle */}
          <circle
            cx={dimensions.size / 2}
            cy={dimensions.size / 2}
            r={dimensions.radius}
            className="stroke-border"
            strokeWidth={dimensions.stroke}
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx={dimensions.size / 2}
            cy={dimensions.size / 2}
            r={dimensions.radius}
            className={cn("transition-all duration-500 ease-out", colorClass)}
            strokeWidth={dimensions.stroke}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>
        <span className={cn("absolute font-mono tracking-tight", dimensions.text)}>
          {normalized}
        </span>
      </div>
      {showLabel && (
        <span className="text-[10px] text-muted uppercase font-mono tracking-wider mt-1">
          Match
        </span>
      )}
    </div>
  );
}
