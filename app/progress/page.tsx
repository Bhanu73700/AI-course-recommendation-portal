"use client";

import * as React from "react";
import Link from "next/link";
import { COURSES, getCourseById } from "@/data/courses";
import { useAppStore } from "@/store/useAppStore";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  CheckCircle2,
  Clock,
  Download,
  Upload,
  RotateCcw,
  BookOpen,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function ProgressPage() {
  const {
    progress,
    updateProgress,
    markCourseCompleted,
    resetAllData,
    hasHydrated,
  } = useAppStore();

  const [resetDialogOpen, setResetDialogOpen] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const progressEntries = Object.values(progress);
  const inProgressCourses = progressEntries.filter((p) => p.status === "in-progress");
  const completedCourses = progressEntries.filter((p) => p.status === "completed");

  const totalHoursLogged = progressEntries.reduce((acc, p) => acc + (p.hoursLogged || 0), 0);

  const handleExportJSON = () => {
    const state = localStorage.getItem("courseai:v1");
    if (!state) return;
    const blob = new Blob([state], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `courseai-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        JSON.parse(text); // validate
        localStorage.setItem("courseai:v1", text);
        window.location.reload();
      } catch {
        alert("Invalid CourseAI backup file.");
      }
    };
    reader.readAsText(file);
  };

  if (!hasHydrated) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-foreground">Learning Progress</h1>
        <div className="h-40 rounded-card border border-border bg-surface animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header with Export / Import / Reset */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tightest text-foreground">
            Learning Progress
          </h1>
          <p className="text-xs text-muted mt-1">
            Track your active courses, completion percentages, study hours, and notes.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportJSON}
            accept=".json"
            className="hidden"
          />

          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="text-xs h-8 gap-1"
          >
            <Upload className="h-3 w-3" />
            <span>Import</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportJSON}
            className="text-xs h-8 gap-1"
          >
            <Download className="h-3 w-3" />
            <span>Export</span>
          </Button>

          {/* Reset Dialog */}
          <Dialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-8 text-muted hover:text-danger gap-1"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reset</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Reset All CourseAI Data?</DialogTitle>
                <DialogDescription className="text-xs text-muted">
                  This will wipe all stored assessment answers, progress, logged hours, checkpoints, and resume analysis from this browser. This cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setResetDialogOpen(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    resetAllData();
                    setResetDialogOpen(false);
                  }}
                  className="text-xs"
                >
                  Yes, Reset Everything
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary KPI Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 rounded-card border border-border bg-surface">
        <div>
          <span className="text-[11px] font-mono uppercase text-muted tracking-label block">
            Courses in Progress
          </span>
          <div className="text-2xl font-bold font-mono text-accent mt-0.5">
            {inProgressCourses.length}
          </div>
        </div>

        <div>
          <span className="text-[11px] font-mono uppercase text-muted tracking-label block">
            Completed Courses
          </span>
          <div className="flex items-center gap-1.5 text-2xl font-bold font-mono text-success mt-0.5">
            <CheckCircle2 className="h-5 w-5" />
            <span>{completedCourses.length}</span>
          </div>
        </div>

        <div>
          <span className="text-[11px] font-mono uppercase text-muted tracking-label block">
            Total Hours Logged
          </span>
          <div className="flex items-center gap-1.5 text-2xl font-bold font-mono text-foreground mt-0.5">
            <Clock className="h-4 w-4 text-accent" />
            <span>{totalHoursLogged} hrs</span>
          </div>
        </div>
      </div>

      {/* In-Progress Section */}
      <div className="space-y-4">
        <h2 className="text-base font-semibold text-foreground border-b border-border/60 pb-2">
          Active Courses ({inProgressCourses.length})
        </h2>

        {inProgressCourses.length > 0 ? (
          <div className="space-y-4">
            {inProgressCourses.map((entry) => {
              const course = getCourseById(entry.courseId);
              if (!course) return null;

              return (
                <div
                  key={entry.courseId}
                  className="p-5 rounded-card border border-border bg-background space-y-4 text-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border/60">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-foreground text-sm">
                          {course.title}
                        </span>
                        <Badge variant="outline" className="text-[10px]">
                          {course.provider}
                        </Badge>
                      </div>
                      <p className="text-muted">
                        Started: {new Date(entry.startedAt || "").toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => markCourseCompleted(course.id, course.skills)}
                        className="text-xs h-8 text-success hover:border-success gap-1"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Mark Completed</span>
                      </Button>
                      <Link href={`/courses/${course.id}`}>
                        <Button variant="ghost" size="sm" className="text-xs h-8">
                          Details
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {/* Percentage Slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-muted">
                      <span>Completion:</span>
                      <span className="font-mono text-foreground font-semibold">
                        {entry.percent}%
                      </span>
                    </div>
                    <Slider
                      min={0}
                      max={100}
                      step={5}
                      value={[entry.percent]}
                      onValueChange={(val) =>
                        updateProgress(course.id, { percent: val[0] })
                      }
                    />
                  </div>

                  {/* Hours Logged & Notes */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div>
                      <label className="text-muted block mb-1">Hours Logged:</label>
                      <Input
                        type="number"
                        min={0}
                        value={entry.hoursLogged}
                        onChange={(e) =>
                          updateProgress(course.id, {
                            hoursLogged: Math.max(0, parseInt(e.target.value) || 0),
                          })
                        }
                        className="h-8 text-xs font-mono bg-surface"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-muted block mb-1">Study Notes:</label>
                      <Input
                        placeholder="Key insights, milestones, or repo link..."
                        value={entry.notes || ""}
                        onChange={(e) =>
                          updateProgress(course.id, { notes: e.target.value })
                        }
                        className="h-8 text-xs bg-surface"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center rounded-card border border-dashed border-border bg-surface text-muted text-xs space-y-2">
            <p>No courses currently in progress.</p>
            <Link href="/courses">
              <Button size="sm" variant="secondary" className="text-xs mt-1">
                Browse catalog to start a course
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Completed Section */}
      <div className="space-y-4">
        <h2 className="text-base font-semibold text-foreground border-b border-border/60 pb-2">
          Completed Courses ({completedCourses.length})
        </h2>

        {completedCourses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {completedCourses.map((entry) => {
              const course = getCourseById(entry.courseId);
              if (!course) return null;

              return (
                <div
                  key={entry.courseId}
                  className="p-4 rounded-card border border-success/30 bg-success/5 space-y-2 text-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-semibold text-foreground text-sm">
                        {course.title}
                      </h4>
                      <p className="text-muted text-[11px]">{course.provider}</p>
                    </div>
                    <Badge variant="success" className="text-[10px] gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      100%
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {course.skills.map((sk) => (
                      <span
                        key={sk}
                        className="text-[10px] px-2 py-0.5 rounded bg-background border border-border text-foreground font-mono"
                      >
                        +{sk}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-muted pt-2 border-t border-border/50">
                    <span>Logged: {entry.hoursLogged} hrs</span>
                    <Link href={`/courses/${course.id}`} className="text-accent hover:underline">
                      Review
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-muted p-6 rounded-card border border-dashed border-border bg-surface text-center">
            Completed courses will appear here and automatically award new skills to your profile.
          </p>
        )}
      </div>
    </div>
  );
}
