"use client";

import * as React from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import { getCourseById, COURSES } from "@/data/courses";
import { useAppStore } from "@/store/useAppStore";
import { recommend } from "@/lib/recommend";
import { ROLES, getRoleById } from "@/data/roles";
import { ScoreRing } from "@/components/courses/ScoreRing";
import { ScoreBreakdownBar } from "@/components/recommend/ScoreBreakdownBar";
import { CourseCard } from "@/components/courses/CourseCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatHours, formatUSD } from "@/lib/utils";
import {
  Star,
  Clock,
  Heart,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  ChevronLeft,
  Award,
  BookOpen,
  Calendar,
} from "lucide-react";

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = params.id as string;
  const course = getCourseById(courseId);

  const {
    wishlist,
    toggleWishlist,
    progress,
    updateProgress,
    markCourseCompleted,
    knownSkills,
    assessment,
    hasHydrated,
  } = useAppStore();

  if (!course) {
    notFound();
  }

  const isSaved = hasHydrated ? wishlist.includes(course.id) : false;
  const currentProgress = hasHydrated ? progress[course.id] : undefined;
  const isCompleted = currentProgress?.status === "completed";
  const isInProgress = currentProgress?.status === "in-progress";

  // Calculate recommendation breakdown if assessment is available
  const recommendation = React.useMemo(() => {
    if (!assessment) return null;
    const role = getRoleById(assessment.careerGoal) || ROLES[0];
    const recs = recommend(assessment, [course], role);
    return recs.length > 0 ? recs[0] : null;
  }, [assessment, course]);

  // Related courses (same sub-group or track)
  const relatedCourses = React.useMemo(() => {
    return COURSES.filter(
      (c) => c.id !== course.id && (c.subGroup === course.subGroup || c.track === course.track)
    ).slice(0, 3);
  }, [course]);

  const handleStart = () => {
    updateProgress(course.id, {
      status: "in-progress",
      percent: 10,
      hoursLogged: 1,
    });
  };

  const handleComplete = () => {
    markCourseCompleted(course.id, course.skills);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <div>
        <Link
          href="/courses"
          className="inline-flex items-center gap-1 text-xs text-muted hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          <span>Back to catalog</span>
        </Link>
      </div>

      {/* Hero Header */}
      <div className="rounded-card border border-border bg-background p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-xs text-foreground uppercase tracking-wider">
                {course.provider}
              </span>
              <span className="text-muted">·</span>
              <Badge variant="outline" className="text-xs">
                {course.level}
              </Badge>
              <span className="text-muted">·</span>
              <span className="text-xs text-muted font-mono">{course.subGroup}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground leading-snug">
              {course.title}
            </h1>

            <p className="text-sm text-muted leading-relaxed">
              {course.description}
            </p>
          </div>

          {/* Match Score Ring (if user took assessment) */}
          {recommendation && (
            <div className="flex flex-col items-center p-3 rounded-card border border-border bg-surface flex-shrink-0 self-start">
              <ScoreRing score={recommendation.score} size="lg" showLabel={true} />
              <span className="text-[10px] text-muted text-center mt-1">
                for {assessment?.careerGoal}
              </span>
            </div>
          )}
        </div>

        {/* Course Specs Bar */}
        <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-border/70 text-xs text-muted">
          <div className="flex items-center gap-1.5 text-amber-500 font-semibold">
            <Star className="h-4 w-4 fill-current" />
            <span>{course.rating.toFixed(2)}</span>
            <span className="text-muted font-normal">({course.ratingCount.toLocaleString()} ratings)</span>
          </div>
          <div className="flex items-center gap-1 font-mono">
            <Clock className="h-3.5 w-3.5" />
            <span>{formatHours(course.durationHours)}</span>
          </div>
          <div className="font-semibold text-foreground font-mono text-sm">
            {formatUSD(course.priceUSD)}
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="h-3.5 w-3.5" />
            <span>{course.format}</span>
          </div>
          {course.hasCertificate && (
            <div className="flex items-center gap-1 text-accent">
              <Award className="h-3.5 w-3.5" />
              <span>Verified Certificate</span>
            </div>
          )}
          <div className="flex items-center gap-1 font-mono text-muted">
            <Calendar className="h-3.5 w-3.5" />
            <span>Updated {course.updatedYear}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-border/70">
          <a
            href={course.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex"
          >
            <Button className="gap-1.5 text-xs h-9 px-5">
              <span>Go to Provider Website</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Button>
          </a>

          <Button
            variant="secondary"
            onClick={() => toggleWishlist(course.id)}
            className="text-xs h-9 gap-1.5"
          >
            <Heart className={`h-3.5 w-3.5 ${isSaved ? "fill-accent text-accent" : ""}`} />
            <span>{isSaved ? "Saved in Wishlist" : "Save to Wishlist"}</span>
          </Button>

          {isCompleted ? (
            <Badge variant="success" className="h-9 px-3 text-xs gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Completed
            </Badge>
          ) : isInProgress ? (
            <Button
              variant="outline"
              onClick={handleComplete}
              className="text-xs h-9 text-success hover:border-success"
            >
              Mark as Completed (100%)
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={handleStart}
              className="text-xs h-9"
            >
              Start Course Tracking
            </Button>
          )}
        </div>
      </div>

      {/* Match Score Breakdown Bar (if recommendation available) */}
      {recommendation && (
        <div className="rounded-card border border-border bg-background p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-foreground">
              Deterministic Scoring Analysis ({recommendation.score}/100)
            </h3>
            <span className="text-[11px] text-muted">Computed from your assessment profile</span>
          </div>

          <ScoreBreakdownBar breakdown={recommendation.breakdown} score={recommendation.score} />

          <div className="pt-2 space-y-1">
            {recommendation.reasons.map((r, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-foreground/90">
                <CheckCircle2 className="h-3.5 w-3.5 text-success flex-shrink-0 mt-0.5" />
                <span>{r}</span>
              </div>
            ))}
            {recommendation.warnings.map((w, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-warning bg-warning/5 border border-warning/20 p-2 rounded-md">
                <AlertTriangle className="h-3.5 w-3.5 text-warning flex-shrink-0 mt-0.5" />
                <span>{w}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Learning Outcomes */}
      <div className="rounded-card border border-border bg-background p-5 space-y-3">
        <h3 className="font-semibold text-sm text-foreground">What you will learn</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-foreground">
          {course.outcomes.map((outcome, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-accent flex-shrink-0 mt-0.5" />
              <span>{outcome}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Skills Taught (Highlight missing from user profile) */}
      <div className="rounded-card border border-border bg-background p-5 space-y-3">
        <h3 className="font-semibold text-sm text-foreground">Skills Covered</h3>
        <p className="text-xs text-muted">
          Skills marked with a star are required for your target career role:
        </p>
        <div className="flex flex-wrap gap-2">
          {course.skills.map((skill) => {
            const isKnown = knownSkills.includes(skill.toLowerCase());
            return (
              <span
                key={skill}
                className={`px-3 py-1 rounded-full border text-xs font-mono flex items-center gap-1.5 ${
                  isKnown
                    ? "bg-surface border-border text-muted"
                    : "bg-accent-soft border-accent/30 text-accent font-medium"
                }`}
              >
                <span>{skill}</span>
                {isKnown ? (
                  <span className="text-[10px] text-muted font-sans">(already known)</span>
                ) : (
                  <span className="text-[10px] font-sans font-semibold">★ Target Skill</span>
                )}
              </span>
            );
          })}
        </div>
      </div>

      {/* Prerequisites */}
      <div className="rounded-card border border-border bg-background p-5 space-y-3">
        <h3 className="font-semibold text-sm text-foreground">Prerequisites</h3>
        {course.prerequisites.length > 0 ? (
          <div className="space-y-2">
            {course.prerequisites.map((prereq) => {
              const isMet = knownSkills.includes(prereq.toLowerCase());
              return (
                <div
                  key={prereq}
                  className="flex items-center justify-between p-2.5 rounded-md border border-border bg-surface text-xs"
                >
                  <span className="font-mono text-foreground font-medium">{prereq}</span>
                  {isMet ? (
                    <span className="flex items-center gap-1 text-success text-[11px] font-medium">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Prerequisite Met
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-warning text-[11px] font-medium">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      Missing from your skills
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-muted">No prerequisites required! Suitable for complete beginners.</p>
        )}
      </div>

      {/* Related Courses */}
      {relatedCourses.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-border/80">
          <h3 className="font-semibold text-base text-foreground">Related Courses</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedCourses.map((c) => (
              <CourseCard key={c.id} course={c} />
            ))}
          </div>
        </div>
      )}

      {/* Disclaimer footnote */}
      <p className="text-[11px] text-muted text-center pt-2 font-mono">
        * Course details, pricing, and ratings are illustrative sample data for project demonstration.
      </p>
    </div>
  );
}
