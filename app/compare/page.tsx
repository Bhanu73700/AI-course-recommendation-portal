"use client";

import { useState } from "react";
import Link from "next/link";
import { COURSES } from "@/data/courses";
import { Course } from "@/types";
import { Button } from "@/components/ui/button";
import { formatUSD, formatHours } from "@/lib/utils";
import { ArrowLeft, Check, Plus, Star } from "lucide-react";

export default function Compare() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleCourse = (id: string) => {
    setSelectedIds((current) => {
      if (current.includes(id)) {
        return current.filter((item) => item !== id);
      }
      if (current.length >= 3) {
        return current;
      }
      return [...current, id];
    });
  };

  const selectedCourses = COURSES.filter((c) => selectedIds.includes(c.id));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Compare Courses
          </h1>
          <p className="text-xs text-muted mt-1">
            Select up to 3 courses from the catalog to compare side-by-side.
          </p>
        </div>
        <Link href="/courses">
          <Button variant="outline" size="sm" className="text-xs gap-1">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Catalog</span>
          </Button>
        </Link>
      </div>

      {/* Course Selector Chips */}
      <div className="p-4 rounded-card border border-border bg-surface space-y-2">
        <span className="text-xs font-semibold text-foreground">
          Select courses to compare ({selectedIds.length}/3):
        </span>
        <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto">
          {COURSES.map((c) => {
            const isSelected = selectedIds.includes(c.id);
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => toggleCourse(c.id)}
                className={`text-xs px-2.5 py-1 rounded-md border transition-colors flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-accent text-white border-accent"
                    : "bg-background border-border text-foreground hover:border-foreground/30"
                }`}
              >
                {isSelected ? <Check className="h-3 w-3" /> : <Plus className="h-3 w-3 text-muted" />}
                <span className="truncate max-w-[180px]">{c.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Comparison Grid */}
      {selectedCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {selectedCourses.map((c) => (
            <div
              key={c.id}
              className="p-5 rounded-card border border-border bg-background space-y-4 text-xs"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-muted font-semibold text-[11px] block">{c.provider}</span>
                  <h3 className="font-semibold text-sm text-foreground mt-0.5">{c.title}</h3>
                </div>
                <button
                  onClick={() => toggleCourse(c.id)}
                  className="text-xs text-muted hover:text-danger font-mono"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-2 pt-2 border-t border-border/60">
                <div className="flex justify-between">
                  <span className="text-muted">Level:</span>
                  <span className="font-semibold text-foreground">{c.level}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Price:</span>
                  <span className="font-mono font-semibold text-accent">{formatUSD(c.priceUSD)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Duration:</span>
                  <span className="font-mono text-foreground">{formatHours(c.durationHours)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Rating:</span>
                  <span className="flex items-center gap-1 text-amber-500 font-semibold">
                    <Star className="h-3 w-3 fill-current" />
                    {c.rating.toFixed(1)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Format:</span>
                  <span className="text-foreground">{c.format}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Certificate:</span>
                  <span className="text-foreground">{c.hasCertificate ? "Yes" : "No"}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-border/60 space-y-1">
                <span className="text-muted block text-[11px] font-mono uppercase">Skills Taught:</span>
                <div className="flex flex-wrap gap-1">
                  {c.skills.map((s) => (
                    <span key={s} className="px-1.5 py-0.5 rounded bg-surface border border-border font-mono text-[10px]">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <Link href={`/courses/${c.id}`} className="block pt-2">
                <Button size="sm" variant="secondary" className="w-full text-xs">
                  View Full Details
                </Button>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-card border border-dashed border-border bg-surface text-muted text-xs">
          Select courses from above to compare them side-by-side.
        </div>
      )}
    </div>
  );
}
