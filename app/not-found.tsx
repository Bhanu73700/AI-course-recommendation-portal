import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileQuestion, Home, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
      <div className="h-12 w-12 rounded-full bg-surface border border-border text-muted flex items-center justify-center">
        <FileQuestion className="h-6 w-6" />
      </div>
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-foreground">Page Not Found</h2>
        <p className="text-xs text-muted max-w-md">
          The course, role, or route you are looking for does not exist in CourseAI.
        </p>
      </div>
      <div className="flex items-center gap-2 pt-2">
        <Link href="/">
          <Button size="sm" variant="secondary" className="gap-1.5 text-xs">
            <Home className="h-3.5 w-3.5" />
            <span>Home</span>
          </Button>
        </Link>
        <Link href="/courses">
          <Button size="sm" className="gap-1.5 text-xs">
            <Compass className="h-3.5 w-3.5" />
            <span>Browse Catalog</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
