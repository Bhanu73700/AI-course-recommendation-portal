"use client";

import * as React from "react";
import Link from "next/link";
import { SkillGapItem } from "@/types";
import { useAppStore } from "@/store/useAppStore";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Plus, ExternalLink } from "lucide-react";

interface SkillRowProps {
  item: SkillGapItem;
}

export function SkillRow({ item }: SkillRowProps) {
  const { addKnownSkill, removeKnownSkill, knownSkills, wishlist, toggleWishlist } = useAppStore();
  const isKnown = knownSkills.includes(item.skill.toLowerCase());

  const priorityBadgeVariant = {
    High: "danger",
    Medium: "warning",
    Low: "outline",
  }[item.priority] as "danger" | "warning" | "outline";

  return (
    <div className="p-4 rounded-card border border-border bg-background hover:border-foreground/30 transition-colors space-y-3 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              if (isKnown) {
                removeKnownSkill(item.skill);
              } else {
                addKnownSkill(item.skill);
              }
            }}
            className={`h-5 w-5 rounded border flex items-center justify-center transition-colors ${
              isKnown
                ? "bg-success border-success text-white"
                : "border-border hover:border-accent text-transparent"
            }`}
            title={isKnown ? "Mark as unlearned" : "Mark as learned"}
            aria-label={`Toggle knowledge of ${item.name}`}
          >
            <Check className="h-3 w-3" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-foreground">{item.name}</span>
              <span className="text-[11px] font-mono text-muted">({item.skill})</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <Badge variant={priorityBadgeVariant} className="text-[10px] py-0 px-2">
            {item.priority} Priority
          </Badge>
          <span className="text-xs text-muted font-mono">Weight: {item.weight}/10</span>
        </div>
      </div>

      {/* Top recommended courses to close this gap */}
      {item.topCourses.length > 0 && item.status !== "have" && (
        <div className="pt-2 border-t border-border/50 space-y-1.5">
          <p className="text-[10px] font-mono uppercase text-muted tracking-label">
            Top courses teaching this:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {item.topCourses.map((c) => (
              <div
                key={c.id}
                className="p-2 rounded-md border border-border bg-surface flex items-center justify-between gap-2 text-xs"
              >
                <div className="min-w-0">
                  <p className="font-medium text-foreground truncate">{c.title}</p>
                  <p className="text-[10px] text-muted">{c.provider} · {c.priceUSD === 0 ? "Free" : `$${c.priceUSD}`}</p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Link href={`/courses/${c.id}`}>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-muted hover:text-foreground">
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </Link>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => toggleWishlist(c.id)}
                    className="h-6 px-2 text-[10px] gap-1"
                  >
                    <Plus className="h-2.5 w-2.5" />
                    <span>{wishlist.includes(c.id) ? "Saved" : "Save"}</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
