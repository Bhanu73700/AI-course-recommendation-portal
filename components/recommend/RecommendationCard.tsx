"use client";

import * as React from "react";
import Link from "next/link";
import { Recommendation } from "@/types";
import { ScoreRing } from "@/components/courses/ScoreRing";
import { ScoreBreakdownBar } from "./ScoreBreakdownBar";
import { useAppStore } from "@/store/useAppStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatHours, formatUSD } from "@/lib/utils";
import {
  CheckCircle2,
  AlertTriangle,
  Heart,
  ChevronDown,
  ChevronUp,
  Star,
  Clock,
  ArrowUpRight,
} from "lucide-react";

interface RecommendationCardProps {
  recommendation: Recommendation;
  rank: number;
}

export function RecommendationCard({ recommendation, rank }: RecommendationCardProps) {
  const { course, score, breakdown, reasons, warnings, fillsSkills } = recommendation;
  const { wishlist, toggleWishlist, hasHydrated } = useAppStore();
  const [showBreakdown, setShowBreakdown] = React.useState(false);

  const isSaved = hasHydrated ? wishlist.includes(course.id) : false;

  return (
    <div className="rounded-card border border-border bg-background hover:border-foreground/40 transition-colors p-5 text-left relative">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-border/70">
        <div className="flex items-start gap-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-surface border border-border font-mono text-xs font-semibold text-muted flex-shrink-0 mt-0.5">
            #{rank}
          </span>

          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="font-semibold text-xs text-foreground">{course.provider}</span>
              <span className="text-muted text-xs">·</span>
              <span className="text-xs text-muted font-mono">{course.subGroup}</span>
              <Badge variant="outline" className="text-[10px] py-0 px-2">
                {course.level}
              </Badge>
            </div>

            <Link href={`/courses/${course.id}`} className="hover:text-accent transition-colors">
              <h3 className="font-semibold text-base sm:text-lg text-foreground leading-snug">
                {course.title}
              </h3>
            </Link>
          </div>
        </div>

        {/* Score Ring & Wishlist */}
        <div className="flex items-center gap-3 self-end sm:self-center flex-shrink-0">
          <ScoreRing score={score} size="md" showLabel={true} />

          <Button
            variant="ghost"
            size="icon"
            onClick={() => toggleWishlist(course.id)}
            className="h-9 w-9 text-muted hover:text-foreground"
            aria-label="Save to wishlist"
          >
            <Heart className={`h-4 w-4 ${isSaved ? "fill-accent text-accent" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Meta Specs (Rating, duration, price) */}
      <div className="flex flex-wrap items-center gap-4 py-3 text-xs text-muted border-b border-border/50">
        <div className="flex items-center gap-1 text-amber-500 font-medium">
          <Star className="h-3.5 w-3.5 fill-current" />
          <span>{course.rating.toFixed(1)}</span>
          <span className="text-muted font-normal text-[11px]">({course.ratingCount.toLocaleString()})</span>
        </div>
        <div className="flex items-center gap-1 font-mono">
          <Clock className="h-3 w-3" />
          <span>{formatHours(course.durationHours)}</span>
        </div>
        <div className="font-semibold text-foreground font-mono">
          {formatUSD(course.priceUSD)}
        </div>
        <span className="text-muted">·</span>
        <span>{course.format}</span>
        {course.hasCertificate && <span>· Certificate</span>}
      </div>

      {/* Plain-English Reasons */}
      <div className="py-3 space-y-1.5">
        <p className="text-[11px] font-mono uppercase text-muted tracking-label">
          Why this is recommended:
        </p>
        {reasons.map((reason, i) => (
          <div key={i} className="flex items-start gap-2 text-xs text-foreground/90">
            <CheckCircle2 className="h-3.5 w-3.5 text-success flex-shrink-0 mt-0.5" />
            <span>{reason}</span>
          </div>
        ))}

        {/* Warnings if any */}
        {warnings.length > 0 && (
          <div className="pt-1.5 space-y-1">
            {warnings.map((warning, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-warning bg-warning/5 border border-warning/20 p-2 rounded-md">
                <AlertTriangle className="h-3.5 w-3.5 text-warning flex-shrink-0 mt-0.5" />
                <span>{warning}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Fills Skills Tags */}
      {fillsSkills.length > 0 && (
        <div className="pt-2 pb-3 flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] text-muted mr-1">Fills missing skills:</span>
          {fillsSkills.map((sk) => (
            <span
              key={sk}
              className="text-[10px] px-2 py-0.5 rounded-full bg-accent-soft text-accent border border-accent/20 font-medium"
            >
              +{sk}
            </span>
          ))}
        </div>
      )}

      {/* Expandable Breakdown Bar */}
      <div className="pt-2 border-t border-border/60">
        <button
          onClick={() => setShowBreakdown(!showBreakdown)}
          className="flex items-center gap-1 text-[11px] text-muted hover:text-foreground font-medium transition-colors"
        >
          <span>{showBreakdown ? "Hide scoring breakdown" : "View scoring breakdown"}</span>
          {showBreakdown ? (
            <ChevronUp className="h-3 w-3" />
          ) : (
            <ChevronDown className="h-3 w-3" />
          )}
        </button>

        {showBreakdown && (
          <div className="mt-3 pt-3 border-t border-border/40">
            <ScoreBreakdownBar breakdown={breakdown} score={score} />
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between gap-3">
        <Link href={`/courses/${course.id}`}>
          <Button variant="secondary" size="sm" className="text-xs h-8 gap-1">
            <span>Course Details</span>
            <ArrowUpRight className="h-3 w-3" />
          </Button>
        </Link>

        <a
          href={course.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-accent hover:underline flex items-center gap-1 font-medium"
        >
          <span>Provider Page</span>
          <ArrowUpRight className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
}
