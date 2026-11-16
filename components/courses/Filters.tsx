"use client";

import * as React from "react";
import { TRACKS } from "@/data/skills";
import { Format, Level, TrackId } from "@/types";
import { Button } from "@/components/ui/button";
import { X, RotateCcw } from "lucide-react";

export interface FilterState {
  track: string;
  subGroup: string;
  level: string;
  priceType: "all" | "free" | "paid";
  format: string;
  hasCertificate: boolean;
  sortBy: "match" | "rating" | "duration-asc" | "duration-desc" | "price-asc" | "newest";
}

export const INITIAL_FILTERS: FilterState = {
  track: "all",
  subGroup: "all",
  level: "all",
  priceType: "all",
  format: "all",
  hasCertificate: false,
  sortBy: "rating",
};

interface FiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  availableSubGroups: string[];
}

export function Filters({ filters, onChange, availableSubGroups }: FiltersProps) {
  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    onChange({ ...filters, [key]: value });
  };

  const handleClearAll = () => {
    onChange(INITIAL_FILTERS);
  };

  const activeFiltersCount =
    (filters.track !== "all" ? 1 : 0) +
    (filters.subGroup !== "all" ? 1 : 0) +
    (filters.level !== "all" ? 1 : 0) +
    (filters.priceType !== "all" ? 1 : 0) +
    (filters.format !== "all" ? 1 : 0) +
    (filters.hasCertificate ? 1 : 0);

  return (
    <div className="space-y-5">
      {/* Track Tabs */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-mono uppercase tracking-label text-muted">
          Learning Track
        </label>
        <div className="flex flex-wrap gap-1">
          <button
            onClick={() => {
              onChange({ ...filters, track: "all", subGroup: "all" });
            }}
            className={`px-2.5 py-1 text-xs rounded-full border transition-colors ${
              filters.track === "all"
                ? "bg-foreground text-background border-foreground font-medium"
                : "bg-surface border-border text-muted hover:text-foreground"
            }`}
          >
            All Tracks
          </button>
          {TRACKS.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                onChange({ ...filters, track: t.id, subGroup: "all" });
              }}
              className={`px-2.5 py-1 text-xs rounded-full border transition-colors ${
                filters.track === t.id
                  ? "bg-foreground text-background border-foreground font-medium"
                  : "bg-surface border-border text-muted hover:text-foreground"
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>
      </div>

      {/* Sub-groups chips if a specific track is selected or sub-groups exist */}
      {availableSubGroups.length > 0 && (
        <div className="space-y-1.5">
          <label className="text-[11px] font-mono uppercase tracking-label text-muted">
            Topic Focus
          </label>
          <div className="flex flex-wrap gap-1">
            <button
              onClick={() => updateFilter("subGroup", "all")}
              className={`px-2 py-0.5 text-xs rounded-md border transition-colors ${
                filters.subGroup === "all"
                  ? "bg-accent-soft text-accent border-accent/30 font-medium"
                  : "bg-background border-border text-muted hover:text-foreground"
              }`}
            >
              All Topics
            </button>
            {availableSubGroups.map((sg) => (
              <button
                key={sg}
                onClick={() => updateFilter("subGroup", sg)}
                className={`px-2 py-0.5 text-xs rounded-md border transition-colors ${
                  filters.subGroup === sg
                    ? "bg-accent-soft text-accent border-accent/30 font-medium"
                    : "bg-background border-border text-muted hover:text-foreground"
                }`}
              >
                {sg}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Level, Price, Format, Certificate Grids */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-border/60">
        {/* Level */}
        <div>
          <label className="text-[11px] font-mono uppercase tracking-label text-muted block mb-1">
            Level
          </label>
          <select
            value={filters.level}
            onChange={(e) => updateFilter("level", e.target.value)}
            className="w-full text-xs h-8 rounded-input bg-surface border border-border px-2 text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
          >
            <option value="all">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        {/* Price */}
        <div>
          <label className="text-[11px] font-mono uppercase tracking-label text-muted block mb-1">
            Pricing
          </label>
          <select
            value={filters.priceType}
            onChange={(e) => updateFilter("priceType", e.target.value as "all" | "free" | "paid")}
            className="w-full text-xs h-8 rounded-input bg-surface border border-border px-2 text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
          >
            <option value="all">Free & Paid</option>
            <option value="free">Free Only ($0)</option>
            <option value="paid">Paid Only</option>
          </select>
        </div>

        {/* Format */}
        <div>
          <label className="text-[11px] font-mono uppercase tracking-label text-muted block mb-1">
            Format
          </label>
          <select
            value={filters.format}
            onChange={(e) => updateFilter("format", e.target.value)}
            className="w-full text-xs h-8 rounded-input bg-surface border border-border px-2 text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
          >
            <option value="all">All Formats</option>
            <option value="Interactive">Interactive</option>
            <option value="Video">Video</option>
            <option value="Project-based">Project-based</option>
            <option value="Text">Text</option>
            <option value="Bootcamp">Bootcamp</option>
          </select>
        </div>

        {/* Certificate Checkbox */}
        <div className="flex flex-col justify-end">
          <label className="flex items-center gap-2 cursor-pointer h-8 text-xs text-foreground select-none">
            <input
              type="checkbox"
              checked={filters.hasCertificate}
              onChange={(e) => updateFilter("hasCertificate", e.target.checked)}
              className="rounded border-border text-accent focus:ring-accent h-3.5 w-3.5"
            />
            <span>With Certificate</span>
          </label>
        </div>
      </div>

      {/* Active Filter Chips & Clear All */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/60">
          <span className="text-[11px] text-muted">Active:</span>

          {filters.track !== "all" && (
            <span className="inline-flex items-center gap-1 text-[11px] bg-surface border border-border px-2 py-0.5 rounded-full text-foreground">
              {TRACKS.find((t) => t.id === filters.track)?.name}
              <X
                className="h-3 w-3 cursor-pointer text-muted hover:text-foreground"
                onClick={() => updateFilter("track", "all")}
              />
            </span>
          )}

          {filters.subGroup !== "all" && (
            <span className="inline-flex items-center gap-1 text-[11px] bg-surface border border-border px-2 py-0.5 rounded-full text-foreground">
              {filters.subGroup}
              <X
                className="h-3 w-3 cursor-pointer text-muted hover:text-foreground"
                onClick={() => updateFilter("subGroup", "all")}
              />
            </span>
          )}

          {filters.level !== "all" && (
            <span className="inline-flex items-center gap-1 text-[11px] bg-surface border border-border px-2 py-0.5 rounded-full text-foreground">
              {filters.level}
              <X
                className="h-3 w-3 cursor-pointer text-muted hover:text-foreground"
                onClick={() => updateFilter("level", "all")}
              />
            </span>
          )}

          {filters.priceType !== "all" && (
            <span className="inline-flex items-center gap-1 text-[11px] bg-surface border border-border px-2 py-0.5 rounded-full text-foreground">
              {filters.priceType === "free" ? "Free Only" : "Paid Only"}
              <X
                className="h-3 w-3 cursor-pointer text-muted hover:text-foreground"
                onClick={() => updateFilter("priceType", "all")}
              />
            </span>
          )}

          {filters.format !== "all" && (
            <span className="inline-flex items-center gap-1 text-[11px] bg-surface border border-border px-2 py-0.5 rounded-full text-foreground">
              {filters.format}
              <X
                className="h-3 w-3 cursor-pointer text-muted hover:text-foreground"
                onClick={() => updateFilter("format", "all")}
              />
            </span>
          )}

          {filters.hasCertificate && (
            <span className="inline-flex items-center gap-1 text-[11px] bg-surface border border-border px-2 py-0.5 rounded-full text-foreground">
              Certificate Included
              <X
                className="h-3 w-3 cursor-pointer text-muted hover:text-foreground"
                onClick={() => updateFilter("hasCertificate", false)}
              />
            </span>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearAll}
            className="h-6 px-2 text-[11px] text-muted hover:text-danger gap-1 ml-auto"
          >
            <RotateCcw className="h-3 w-3" />
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
}
