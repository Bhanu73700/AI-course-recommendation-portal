"use client";

import * as React from "react";
import { SkillGapAnalysis } from "@/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface GapChartProps {
  analysis: SkillGapAnalysis;
}

export function GapChart({ analysis }: GapChartProps) {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="h-64 w-full rounded-card border border-border bg-surface flex items-center justify-center text-xs text-muted">
        Loading skill distribution chart...
      </div>
    );
  }

  // Combine items for chart
  const allItems = [
    ...analysis.have.map((i) => ({ name: i.name, weight: i.weight, status: "have", score: 100 })),
    ...analysis.partially.map((i) => ({ name: i.name, weight: i.weight, status: "partially", score: 50 })),
    ...analysis.missing.map((i) => ({ name: i.name, weight: i.weight, status: "missing", score: 0 })),
  ].slice(0, 8); // Top 8 skills

  return (
    <div className="rounded-card border border-border bg-background p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-semibold text-sm text-foreground">Competency Distribution</h4>
          <p className="text-xs text-muted">Coverage for {analysis.role.title}</p>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-success" />
            <span className="text-muted">Mastered</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-warning" />
            <span className="text-muted">Partial</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-border" />
            <span className="text-muted">Missing</span>
          </div>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={allItems}
            layout="vertical"
            margin={{ top: 5, right: 20, left: 40, bottom: 5 }}
          >
            <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} unit="%" />
            <YAxis
              type="category"
              dataKey="name"
              width={100}
              tick={{ fontSize: 11, fill: "var(--foreground)" }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="rounded-card border border-border bg-surface p-2.5 shadow-md text-xs">
                      <p className="font-semibold text-foreground">{data.name}</p>
                      <p className="text-muted">Importance Weight: {data.weight}/10</p>
                      <p className="font-mono text-accent">Mastery: {data.score}%</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="score" radius={[0, 4, 4, 0]}>
              {allItems.map((entry, index) => {
                let fill = "var(--border)";
                if (entry.status === "have") fill = "var(--success)";
                else if (entry.status === "partially") fill = "var(--warning)";
                return <Cell key={`cell-${index}`} fill={fill} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
