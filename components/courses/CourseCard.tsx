"use client";

import * as React from "react";
import Link from "next/link";
import { Course } from "@/types";
import { useAppStore } from "@/store/useAppStore";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScoreRing } from "./ScoreRing";
import { formatHours, formatUSD } from "@/lib/utils";
import { Star, Clock, Heart, Award, ArrowUpRight } from "lucide-react";

interface CourseCardProps {
  course: Course;
  matchScore?: number;
  viewMode?: "grid" | "list";
}

export function CourseCard({ course, matchScore, viewMode = "grid" }: CourseCardProps) {
  const { wishlist, toggleWishlist, progress, updateProgress, hasHydrated } = useAppStore();

  const isSaved = hasHydrated ? wishlist.includes(course.id) : false;
  const currentProgress = hasHydrated ? progress[course.id] : undefined;
  const isCompleted = currentProgress?.status === "completed";
  const isInProgress = currentProgress?.status === "in-progress";

  const handleStartCourse = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isInProgress && !isCompleted) {
      updateProgress(course.id, {
        status: "in-progress",
        percent: 10,
        hoursLogged: 1,
      });
    }
  };

  const levelColorMap = {
    Beginner: "border-success/30 text-success bg-success/5",
    Intermediate: "border-accent/30 text-accent bg-accent-soft/40",
    Advanced: "border-warning/30 text-warning bg-warning/5",
  };

  if (viewMode === "list") {
    return (
      <div className="group relative flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-card border border-border bg-background hover:border-foreground/40 transition-colors gap-4">
        <div className="flex-1 min-w-0 pr-4">
          <div className="flex flex-wrap items-center gap-2 mb-1.5 text-xs">
            <span className="font-semibold text-foreground text-xs">{course.provider}</span>
            <span className="text-muted">·</span>
            <span className={`px-2 py-0.5 rounded-full border text-[10px] font-medium ${levelColorMap[course.level]}`}>
              {course.level}
            </span>
            <span className="text-muted">·</span>
            <span className="text-muted font-mono">{course.subGroup}</span>
          </div>

          <Link href={`/courses/${course.id}`}>
            <h3 className="font-semibold text-sm sm:text-base text-foreground group-hover:text-accent transition-colors truncate">
              {course.title}
            </h3>
          </Link>

          <p className="text-xs text-muted mt-1 line-clamp-1 max-w-2xl">
            {course.description}
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-2.5 text-xs text-muted">
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
            {course.hasCertificate && (
              <span className="inline-flex items-center gap-1 text-[11px] text-muted">
                <Award className="h-3 w-3 text-accent" />
                Certificate
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end flex-shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-border">
          {matchScore !== undefined && (
            <div className="flex items-center gap-2 pr-2">
              <ScoreRing score={matchScore} size="sm" />
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(course.id);
            }}
            className={`h-8 w-8 text-muted hover:text-foreground ${
              isSaved ? "text-accent fill-accent" : ""
            }`}
            aria-label="Save to wishlist"
          >
            <Heart className={`h-4 w-4 ${isSaved ? "fill-accent text-accent" : ""}`} />
          </Button>

          <Link href={`/courses/${course.id}`}>
            <Button variant="secondary" size="sm" className="h-8 text-xs gap-1">
              <span>View</span>
              <ArrowUpRight className="h-3 w-3" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative flex flex-col justify-between p-5 rounded-card border border-border bg-background hover:border-foreground/40 transition-colors">
      <div>
        {/* Top Header: Provider & Score / Wishlist */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-foreground tracking-tight">{course.provider}</span>
            <span className="text-[11px] text-muted font-mono">{course.subGroup}</span>
          </div>

          <div className="flex items-center gap-2">
            {matchScore !== undefined && (
              <ScoreRing score={matchScore} size="sm" />
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.preventDefault();
                toggleWishlist(course.id);
              }}
              className="h-7 w-7 text-muted hover:text-foreground -mr-1"
              aria-label="Wishlist"
            >
              <Heart className={`h-4 w-4 ${isSaved ? "fill-accent text-accent" : ""}`} />
            </Button>
          </div>
        </div>

        {/* Title */}
        <Link href={`/courses/${course.id}`} className="block group-hover:text-accent transition-colors">
          <h3 className="font-semibold text-sm leading-snug text-foreground mb-2 line-clamp-2">
            {course.title}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-xs text-muted leading-relaxed line-clamp-2 mb-3">
          {course.description}
        </p>

        {/* Skills preview chips */}
        <div className="flex flex-wrap gap-1 mb-4">
          {course.skills.slice(0, 3).map((sk) => (
            <span
              key={sk}
              className="text-[10px] px-2 py-0.5 rounded bg-surface border border-border text-muted font-mono"
            >
              {sk}
            </span>
          ))}
          {course.skills.length > 3 && (
            <span className="text-[10px] px-1 text-muted font-mono">
              +{course.skills.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Footer Meta & Actions */}
      <div className="pt-3 border-t border-border/70 flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs text-muted">
          <div className="flex items-center gap-1 text-amber-500 font-medium">
            <Star className="h-3 w-3 fill-current" />
            <span>{course.rating.toFixed(1)}</span>
            <span className="text-muted text-[10px]">({course.ratingCount.toLocaleString()})</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px]">{formatHours(course.durationHours)}</span>
            <span className={`px-2 py-0.5 rounded-full border text-[10px] font-medium ${levelColorMap[course.level]}`}>
              {course.level}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-1">
          <span className="font-semibold text-sm text-foreground font-mono">
            {formatUSD(course.priceUSD)}
          </span>

          <div className="flex items-center gap-1.5">
            {isCompleted ? (
              <Badge variant="success" className="text-[10px] h-6">Completed</Badge>
            ) : isInProgress ? (
              <Badge variant="accent" className="text-[10px] h-6">In Progress</Badge>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleStartCourse}
                className="h-7 px-2 text-[11px] text-muted hover:text-foreground"
              >
                Start
              </Button>
            )}

            <Link href={`/courses/${course.id}`}>
              <Button variant="secondary" size="sm" className="h-7 px-2.5 text-xs">
                Details
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
