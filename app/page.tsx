import Link from "next/link";
import { TrackPicker } from "@/components/track/TrackPicker";
import { Button } from "@/components/ui/button";
import { ArrowRight, Compass, Sparkles, Shield, Cpu, Target, CheckCircle2 } from "lucide-react";

export default function HomePage() {
  return (
    <div className="space-y-12 sm:space-y-16">
      {/* Editorial Hero */}
      <section className="text-center max-w-3xl mx-auto space-y-4 pt-4 sm:pt-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border bg-surface text-muted text-xs">
          <Sparkles className="h-3.5 w-3.5 text-accent" />
          <span>Transparent, Deterministic Course & Roadmap Recommendation</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-semibold tracking-tightest text-foreground leading-[1.15]">
          What do you want to learn?
        </h1>

        <p className="text-base sm:text-lg text-muted max-w-2xl mx-auto leading-relaxed">
          Select your primary learning track below. CourseAI analyzes your skill gap, filters out the noise, and maps the shortest path to your target career role.
        </p>
      </section>

      {/* Track Selection Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-border/80 pb-3">
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-foreground">
              Choose your primary track
            </h2>
            <p className="text-xs text-muted">
              Select one main focus. You can switch tracks or add secondary interests at any time.
            </p>
          </div>
        </div>

        <TrackPicker />
      </section>

      {/* Value Pillars */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8 border-t border-border/60">
        <div className="p-5 rounded-card border border-border bg-background space-y-2">
          <div className="h-8 w-8 rounded-lg bg-surface border border-border flex items-center justify-center text-accent">
            <Cpu className="h-4 w-4" />
          </div>
          <h3 className="font-semibold text-sm text-foreground">
            Deterministic Match Engine
          </h3>
          <p className="text-xs text-muted leading-relaxed">
            Every match score is computed transparently across 7 weighted dimensions: skill gap, difficulty fit, career goal, budget, and time commitment.
          </p>
        </div>

        <div className="p-5 rounded-card border border-border bg-background space-y-2">
          <div className="h-8 w-8 rounded-lg bg-surface border border-border flex items-center justify-center text-accent">
            <Target className="h-4 w-4" />
          </div>
          <h3 className="font-semibold text-sm text-foreground">
            Targeted Skill-Gap Analysis
          </h3>
          <p className="text-xs text-muted leading-relaxed">
            See exactly what skills you have and what you are missing compared to real-world job roles like Junior Android Engineer or Frontend Developer.
          </p>
        </div>

        <div className="p-5 rounded-card border border-border bg-background space-y-2">
          <div className="h-8 w-8 rounded-lg bg-surface border border-border flex items-center justify-center text-accent">
            <Shield className="h-4 w-4" />
          </div>
          <h3 className="font-semibold text-sm text-foreground">
            100% Client-Side Privacy
          </h3>
          <p className="text-xs text-muted leading-relaxed">
            Zero external tracking, no database, and no paid API tokens. Your assessment answers, progress, and uploaded resumes remain strictly in your browser.
          </p>
        </div>
      </section>
    </div>
  );
}
