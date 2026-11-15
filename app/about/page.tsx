import { WhyThis } from "@/components/recommend/WhyThis";
import { Cpu, ShieldCheck, Database, Sparkles, BookOpen, Layers } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="space-y-8 max-w-3xl mx-auto py-4">
      <div className="space-y-2 border-b border-border/80 pb-4">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tightest text-foreground">
          About CourseAI
        </h1>
        <p className="text-sm text-muted leading-relaxed">
          CourseAI is an open-access, local-first course recommendation and career roadmap platform engineered for software engineering students and career changers.
        </p>
      </div>

      {/* Core Philosophy */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Core Architecture & Design Principles</h2>
        <p className="text-xs text-muted leading-relaxed">
          Most modern recommendation systems are opaque black-boxes that prioritize sponsored advertisements or hallucinate unverified course links. CourseAI was built with four uncompromising technical principles:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div className="p-4 rounded-card border border-border bg-surface space-y-1.5">
            <div className="flex items-center gap-2 font-semibold text-xs text-foreground">
              <Cpu className="h-4 w-4 text-accent" />
              <span>100% Deterministic AI</span>
            </div>
            <p className="text-xs text-muted leading-relaxed">
              Every course match score (0-100) is calculated via a pure, auditable mathematical function balancing skill gaps, difficulty, budget, and time commitment.
            </p>
          </div>

          <div className="p-4 rounded-card border border-border bg-surface space-y-1.5">
            <div className="flex items-center gap-2 font-semibold text-xs text-foreground">
              <ShieldCheck className="h-4 w-4 text-accent" />
              <span>Zero Remote Tracking</span>
            </div>
            <p className="text-xs text-muted leading-relaxed">
              No remote database, no user accounts, and no paid third-party APIs. All data and parsed resumes persist strictly in your browser&apos;s localStorage.
            </p>
          </div>

          <div className="p-4 rounded-card border border-border bg-surface space-y-1.5">
            <div className="flex items-center gap-2 font-semibold text-xs text-foreground">
              <Database className="h-4 w-4 text-accent" />
              <span>Real Verified Providers</span>
            </div>
            <p className="text-xs text-muted leading-relaxed">
              Curated from world-class free and accessible platforms: freeCodeCamp, The Odin Project, JetBrains Academy, Google, CS50, and Scrimba.
            </p>
          </div>

          <div className="p-4 rounded-card border border-border bg-surface space-y-1.5">
            <div className="flex items-center gap-2 font-semibold text-xs text-foreground">
              <Layers className="h-4 w-4 text-accent" />
              <span>Job-Ready Milestones</span>
            </div>
            <p className="text-xs text-muted leading-relaxed">
              Rather than isolated courses, users receive an actionable sequence of phases, capstone portfolio milestones, and interview preparation checklists.
            </p>
          </div>
        </div>
      </div>

      {/* Scoring Engine Breakdown */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">How the Recommendation Engine Works</h2>
        <WhyThis />
      </div>

      {/* Sample Data Disclaimer */}
      <div className="rounded-card border border-border bg-surface p-5 space-y-2 text-xs">
        <h3 className="font-semibold text-foreground flex items-center gap-1.5">
          <BookOpen className="h-4 w-4 text-accent" />
          <span>Academic & Demonstration Data Disclaimer</span>
        </h3>
        <p className="text-muted leading-relaxed">
          Course names, provider platforms, curricula, and ratings in this application are realistic illustrative seed data synthesized for software project evaluation. All external provider links point directly to official search pages or home domains, rather than invented deep links.
        </p>
      </div>

      {/* Future Roadmap / Real LLM Integration */}
      <div className="rounded-card border border-border bg-background p-5 space-y-2 text-xs">
        <h3 className="font-semibold text-foreground flex items-center gap-1.5">
          <Sparkles className="h-4 w-4 text-accent" />
          <span>Future Enhancements & Production Roadmap</span>
        </h3>
        <ul className="text-muted space-y-1.5 list-disc list-inside leading-relaxed">
          <li><strong>Live LLM Integration:</strong> Plug in Google Gemini 1.5 Pro or Claude 3.5 Sonnet behind the existing <code className="font-mono text-foreground">getAssistantReply(message, context)</code> interface.</li>
          <li><strong>Real Course API Connectors:</strong> Integrate Coursera Partner API, edX API, and YouTube Data API v3 for live pricing and syllabus sync.</li>
          <li><strong>OAuth User Accounts & Cloud Sync:</strong> Optional Firebase or Supabase authentication to sync learning roadmaps across mobile and desktop devices.</li>
        </ul>
      </div>
    </div>
  );
}
