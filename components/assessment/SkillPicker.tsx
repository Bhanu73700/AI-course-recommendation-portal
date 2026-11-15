"use client";

import * as React from "react";
import { Search, Plus, Check, X } from "lucide-react";
import { searchSkills, SKILLS_MASTER } from "@/data/skills";
import { TrackId } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SkillPickerProps {
  selectedSkills: string[];
  onChange: (skills: string[]) => void;
  track: TrackId;
}

export function SkillPicker({ selectedSkills, onChange, track }: SkillPickerProps) {
  const [query, setQuery] = React.useState("");

  const matchingSkills = React.useMemo(() => {
    return searchSkills(query, query ? undefined : track).slice(0, 20);
  }, [query, track]);

  const toggleSkill = (slug: string) => {
    const s = slug.toLowerCase();
    if (selectedSkills.includes(s)) {
      onChange(selectedSkills.filter((item) => item !== s));
    } else {
      onChange([...selectedSkills, s]);
    }
  };

  const handleSelectNone = () => {
    onChange([]);
  };

  return (
    <div className="space-y-4">
      {/* Selected Chips Area */}
      <div className="p-3 rounded-card border border-border bg-surface min-h-[56px] flex flex-wrap items-center gap-1.5">
        {selectedSkills.length > 0 ? (
          selectedSkills.map((slug) => {
            const meta = SKILLS_MASTER.find((s) => s.slug === slug);
            return (
              <span
                key={slug}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent-soft text-accent border border-accent/20 text-xs font-mono"
              >
                <span>{meta?.name || slug}</span>
                <button
                  type="button"
                  onClick={() => toggleSkill(slug)}
                  className="hover:text-danger"
                  aria-label={`Remove ${slug}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            );
          })
        ) : (
          <span className="text-xs text-muted">
            No skills selected yet. Select the languages and tools you already know, or choose &quot;None yet&quot;.
          </span>
        )}
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted pointer-events-none" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search skills (e.g. JavaScript, Kotlin, Docker, Git)..."
            className="pl-8 text-xs h-9 bg-background"
          />
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleSelectNone}
          className="text-xs h-9"
        >
          None yet (Beginner)
        </Button>
      </div>

      {/* Suggested Skill Pills */}
      <div>
        <p className="text-[11px] font-mono uppercase text-muted tracking-label mb-2">
          {query ? "Search Results" : `Suggested for ${track.toUpperCase()}`}:
        </p>
        <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto p-1">
          {matchingSkills.map((skill) => {
            const isSelected = selectedSkills.includes(skill.slug);
            return (
              <button
                type="button"
                key={skill.slug}
                onClick={() => toggleSkill(skill.slug)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs transition-colors border ${
                  isSelected
                    ? "bg-accent text-white border-accent font-medium"
                    : "bg-surface border-border text-foreground hover:border-foreground/30"
                }`}
              >
                {isSelected ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <Plus className="h-3 w-3 text-muted" />
                )}
                <span>{skill.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
