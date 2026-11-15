"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Check } from "lucide-react";

interface BudgetSelectorProps {
  value: number;
  onChange: (budget: number) => void;
}

const PRESETS = [
  { label: "Free Only", amount: 0, desc: "Only recommend 100% free courses ($0)" },
  { label: "Up to $50", amount: 50, desc: "Standard book/course budget ($0-$50)" },
  { label: "Up to $200", amount: 200, desc: "Bootcamp & certificate budget ($0-$200)" },
  { label: "Flexible", amount: 500, desc: "No price restrictions ($0-$500+)" },
];

export function BudgetSelector({ value, onChange }: BudgetSelectorProps) {
  const [isCustom, setIsCustom] = React.useState(
    !PRESETS.some((p) => p.amount === value)
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {PRESETS.map((preset) => {
          const isSelected = !isCustom && value === preset.amount;
          return (
            <button
              key={preset.label}
              type="button"
              onClick={() => {
                setIsCustom(false);
                onChange(preset.amount);
              }}
              className={`p-4 rounded-card border text-left transition-all ${
                isSelected
                  ? "border-accent ring-1 ring-accent bg-accent-soft/30"
                  : "border-border hover:border-foreground/30 bg-background"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-sm text-foreground">
                  {preset.label}
                </span>
                {isSelected && <Check className="h-4 w-4 text-accent" />}
              </div>
              <p className="text-xs text-muted leading-relaxed">{preset.desc}</p>
            </button>
          );
        })}
      </div>

      <div className="p-4 rounded-card border border-border bg-surface flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="font-semibold text-xs text-foreground block">
            Or specify custom budget ($USD):
          </span>
          <span className="text-[11px] text-muted">
            Enter 0 for free courses only.
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-muted">$</span>
          <Input
            type="number"
            min={0}
            max={2000}
            value={value}
            onChange={(e) => {
              setIsCustom(true);
              const val = Math.max(0, parseInt(e.target.value, 10) || 0);
              onChange(val);
            }}
            className="w-24 text-xs font-mono h-8 bg-background"
          />
        </div>
      </div>
    </div>
  );
}
