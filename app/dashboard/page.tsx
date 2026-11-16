"use client";

import * as React from "react";
import Link from "next/link";
import { COURSES, getCourseById } from "@/data/courses";
import { ROLES, getRoleById } from "@/data/roles";
import { useAppStore } from "@/store/useAppStore";
import { recommend } from "@/lib/recommend";
import { analyzeSkillGap } from "@/lib/skillGap";
import { StatCard } from "@/components/dashboard/StatCard";
import { ActivityHeatmap } from "@/components/dashboard/ActivityHeatmap";
import { CourseCard } from "@/components/courses/CourseCard";
import { ScoreRing } from "@/components/courses/ScoreRing";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Compass,
  Sparkles,
  Flame,
  Clock,
  BookOpen,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Target,
} from "lucide-react";

export default function DashboardPage() {
  const {
    track,
    assessment,
    knownSkills,
    progress,
    wishlist,
    hasHydrated,
  } = useAppStore();

  const progressEntries = Object.values(progress);
  const inProgressCourses = progressEntries.filter((p) => p.status === "in-progress");
  const completedCourses = progressEntries.filter((p) => p.status === "completed");
  const totalHoursLogged = progressEntries.reduce((acc, p) => acc + (p.hoursLogged || 0), 0);

  const activeRole = React.useMemo(() => {
    const roleId = assessment?.careerGoal || (track === "android" ? "android-developer-junior" : "frontend-developer");
    return getRoleById(roleId) || ROLES[0];
  }, [assessment, track]);

  const skillAnalysis = React.useMemo(() => {
    return analyzeSkillGap(knownSkills, activeRole, COURSES);
  }, [knownSkills, activeRole]);

  // Top 3 Recommendations
  const topRecommendations = React.useMemo(() => {
    if (!assessment) return [];
    return recommend(assessment, COURSES, activeRole).slice(0, 3);
  }, [assessment, activeRole]);

  if (!hasHydrated) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 rounded bg-surface animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 rounded-card border border-border bg-surface animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tightest text-foreground">
              Learning Dashboard
            </h1>
            <Badge variant="outline" className="text-xs uppercase font-mono">
              {track} track
            </Badge>
          </div>
          <p className="text-xs text-muted">
            Track role readiness, study streaks, and high-impact next steps.
          </p>
        </div>

        <Link href="/onboarding">
          <Button variant="secondary" size="sm" className="text-xs gap-1.5 h-8 self-start sm:self-center">
            <Compass className="h-3.5 w-3.5" />
            <span>Update Assessment</span>
          </Button>
        </Link>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Role Readiness"
          value={`${skillAnalysis.readinessPercent}%`}
          subtitle={`for ${activeRole.title}`}
          icon={<Target className="h-4 w-4 text-accent" />}
          trend="+5% this week"
        />

        <StatCard
          title="Current Streak"
          value="7 Days"
          subtitle="Keep up the momentum!"
          icon={<Flame className="h-4 w-4 text-amber-500" />}
          trend="Active"
        />

        <StatCard
          title="In Progress"
          value={inProgressCourses.length}
          subtitle={`${completedCourses.length} completed`}
          icon={<BookOpen className="h-4 w-4 text-accent" />}
        />

        <StatCard
          title="Study Time Logged"
          value={`${totalHoursLogged} hrs`}
          subtitle={`Goal: ${assessment?.hoursPerWeek || 10} hrs/wk`}
          icon={<Clock className="h-4 w-4 text-accent" />}
        />
      </div>

      {/* Next Step / Action Recommended Banner */}
      <div className="rounded-card border border-border bg-gradient-to-r from-accent-soft/40 via-surface to-background p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Recommended Next Action</span>
          </div>
          <h3 className="font-semibold text-base text-foreground">
            {skillAnalysis.missing.length > 0
              ? `Close your top skill gap: ${skillAnalysis.missing[0].name}`
              : "Review your portfolio & capstone projects for interviews"}
          </h3>
          <p className="text-xs text-muted leading-relaxed">
            {skillAnalysis.missing.length > 0
              ? `Mastering ${skillAnalysis.missing[0].name} gives you +${skillAnalysis.missing[0].weight} pts towards 100% role readiness.`
              : "All required skills acquired! Polish your resume and test coverage."}
          </p>
        </div>

        <Link href={skillAnalysis.missing.length > 0 ? "/skill-gap" : "/roadmap"}>
          <Button size="sm" className="text-xs gap-1.5 h-9 flex-shrink-0">
            <span>View Action Step</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </div>

      {/* Activity Heatmap & In-Progress Quick View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivityHeatmap />

        {/* Current Active Courses */}
        <div className="rounded-card border border-border bg-background p-5 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-sm text-foreground">Currently Learning</h3>
              <Link href="/progress" className="text-xs text-accent hover:underline">
                View all ({inProgressCourses.length})
              </Link>
            </div>

            {inProgressCourses.length > 0 ? (
              <div className="space-y-2.5">
                {inProgressCourses.slice(0, 2).map((p) => {
                  const course = getCourseById(p.courseId);
                  if (!course) return null;
                  return (
                    <div
                      key={p.courseId}
                      className="p-3 rounded-md border border-border bg-surface text-xs space-y-1.5"
                    >
                      <div className="flex justify-between font-medium">
                        <span className="text-foreground truncate">{course.title}</span>
                        <span className="font-mono text-accent">{p.percent}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-border/50 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-accent transition-all duration-300"
                          style={{ width: `${p.percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-muted py-6 text-center">
                No active courses right now. Pick one from your top recommendations below!
              </p>
            )}
          </div>

          <Link href="/courses">
            <Button variant="outline" size="sm" className="w-full text-xs">
              Explore Course Catalog
            </Button>
          </Link>
        </div>
      </div>

      {/* Top Recommendations Section */}
      {topRecommendations.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-border/80 pb-2">
            <div>
              <h2 className="text-base font-semibold text-foreground">
                Top Course Recommendations
              </h2>
              <p className="text-xs text-muted">
                Hand-picked based on your latest assessment and missing skills.
              </p>
            </div>
            <Link href="/recommendations" className="text-xs text-accent hover:underline">
              View all ({COURSES.length})
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topRecommendations.map((rec) => (
              <CourseCard
                key={rec.course.id}
                course={rec.course}
                matchScore={rec.score}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
