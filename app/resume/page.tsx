"use client";

import * as React from "react";
import { COURSES } from "@/data/courses";
import { ROLES, getRoleById } from "@/data/roles";
import { useAppStore } from "@/store/useAppStore";
import { analyzeResumeText } from "@/lib/resume";
import { Dropzone } from "@/components/resume/Dropzone";
import { ResumeReport } from "@/components/resume/ResumeReport";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileText, Shield, Sparkles } from "lucide-react";

export default function ResumePage() {
  const {
    track,
    assessment,
    resumeAnalysis,
    setResumeAnalysis,
    hasHydrated,
  } = useAppStore();

  const [selectedRoleId, setSelectedRoleId] = React.useState<string>(() => {
    return assessment?.careerGoal || (track === "android" ? "android-developer-junior" : "frontend-developer");
  });

  const [isAnalyzing, setIsAnalyzing] = React.useState(false);

  const activeRole = React.useMemo(() => {
    return getRoleById(selectedRoleId) || ROLES[0];
  }, [selectedRoleId]);

  const handleAnalyze = (rawText: string) => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const result = analyzeResumeText(rawText, activeRole, COURSES);
      setResumeAnalysis(result);
      setIsAnalyzing(false);
    }, 400);
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-accent-soft text-accent border border-accent/20 text-xs font-medium mb-1.5">
            <Shield className="h-3 w-3" />
            <span>100% Client-Side Privacy (Zero Remote Uploads)</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tightest text-foreground">
            Resume Skill Analyzer
          </h1>
          <p className="text-xs text-muted mt-0.5">
            Upload or paste your resume to extract skills, calculate ATS score, and find gaps against {activeRole.title}.
          </p>
        </div>

        {/* Target Role Selector */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <label className="text-xs text-muted whitespace-nowrap">Target Role:</label>
          <Select value={selectedRoleId} onValueChange={setSelectedRoleId}>
            <SelectTrigger className="h-9 w-52 text-xs bg-surface border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="end">
              {ROLES.map((r) => (
                <SelectItem key={r.id} value={r.id} className="text-xs">
                  {r.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Dropzone & Input */}
      <Dropzone onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />

      {/* Analysis Results */}
      {resumeAnalysis && (
        <ResumeReport analysis={resumeAnalysis} roleTitle={activeRole.title} />
      )}
    </div>
  );
}
