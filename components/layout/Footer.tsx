import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface text-muted text-xs py-10 px-4 sm:px-6">
      <div className="max-w-content mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-md">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground text-sm">CourseAI</span>
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded border border-border">Local MVP</span>
          </div>
          <p className="text-xs text-muted leading-relaxed">
            AI course recommendation & career roadmap platform. Fully local, client-side, deterministic scoring with zero external APIs or tracking.
          </p>
          <p className="text-[11px] text-muted/80">
            Course details, providers, and prices are illustrative sample data for project demonstration.
          </p>
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs">
          <Link href="/about" className="hover:text-foreground transition-colors">
            How Scoring Works
          </Link>
          <Link href="/courses" className="hover:text-foreground transition-colors">
            Course Catalog
          </Link>
          <Link href="/recommendations" className="hover:text-foreground transition-colors">
            Recommendations
          </Link>
          <Link href="/skill-gap" className="hover:text-foreground transition-colors">
            Skill Gap
          </Link>
          <Link href="/roadmap" className="hover:text-foreground transition-colors">
            Career Roadmap
          </Link>
          <Link href="/resume" className="hover:text-foreground transition-colors">
            Resume Analyzer
          </Link>
          <Link href="/assistant" className="hover:text-foreground transition-colors">
            AI Assistant
          </Link>
        </div>
      </div>
    </footer>
  );
}
