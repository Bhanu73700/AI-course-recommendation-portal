"use client";

import * as React from "react";

export function ActivityHeatmap() {
  // Generate 28 mock activity days (4 weeks)
  const days = React.useMemo(() => {
    return Array.from({ length: 28 }, (_, i) => {
      // Deterministic activity levels for demo
      const intensity = (i * 7 + 3) % 5;
      return { day: i + 1, level: intensity };
    });
  }, []);

  const colorMap = [
    "bg-border/30",
    "bg-accent/30",
    "bg-accent/60",
    "bg-accent",
    "bg-accent-hover",
  ];

  return (
    <div className="p-4 rounded-card border border-border bg-background space-y-3">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-foreground">Learning Activity</span>
        <span className="text-[11px] font-mono text-muted">Past 4 weeks · 18 active days</span>
      </div>

      <div className="grid grid-flow-col grid-rows-4 gap-1.5 overflow-x-auto py-1">
        {days.map((d, index) => (
          <div
            key={index}
            className={`h-3.5 w-3.5 rounded-sm ${colorMap[d.level]} transition-colors`}
            title={`Day ${d.day}: ${d.level > 0 ? `${d.level * 45} mins studied` : "No study"}`}
          />
        ))}
      </div>

      <div className="flex items-center justify-between text-[10px] text-muted font-mono pt-1">
        <span>Less</span>
        <div className="flex items-center gap-1">
          {colorMap.map((c, i) => (
            <span key={i} className={`h-2.5 w-2.5 rounded-xs ${c}`} />
          ))}
        </div>
        <span>More</span>
      </div>
    </div>
  );
}
