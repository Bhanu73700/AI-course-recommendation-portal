"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertCircle, RotateCcw, Home } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("CourseAI Runtime Error:", error);
  }, [error]);

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
      <div className="h-12 w-12 rounded-full bg-danger/10 text-danger flex items-center justify-center">
        <AlertCircle className="h-6 w-6" />
      </div>
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-foreground">Something went wrong</h2>
        <p className="text-xs text-muted max-w-md">
          {error.message || "An unexpected error occurred while rendering this page."}
        </p>
      </div>
      <div className="flex items-center gap-2 pt-2">
        <Button onClick={() => reset()} size="sm" variant="secondary" className="gap-1.5 text-xs">
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Try again</span>
        </Button>
        <Link href="/">
          <Button size="sm" className="gap-1.5 text-xs">
            <Home className="h-3.5 w-3.5" />
            <span>Go home</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
