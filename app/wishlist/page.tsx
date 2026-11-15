"use client";

import * as React from "react";
import Link from "next/link";
import { COURSES } from "@/data/courses";
import { useAppStore } from "@/store/useAppStore";
import { CourseCard } from "@/components/courses/CourseCard";
import { Button } from "@/components/ui/button";
import { formatHours, formatUSD } from "@/lib/utils";
import { Bookmark, Clock, DollarSign, Compass, ArrowRight, Trash2 } from "lucide-react";

export default function WishlistPage() {
  const { wishlist, toggleWishlist, hasHydrated } = useAppStore();

  const savedCourses = React.useMemo(() => {
    return COURSES.filter((c) => wishlist.includes(c.id));
  }, [wishlist]);

  const totalCost = savedCourses.reduce((sum, c) => sum + c.priceUSD, 0);
  const totalHours = savedCourses.reduce((sum, c) => sum + c.durationHours, 0);

  if (!hasHydrated) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-foreground">Saved Wishlist</h1>
        <div className="h-40 rounded-card border border-border bg-surface animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tightest text-foreground">
            Saved Courses Wishlist
          </h1>
          <p className="text-xs text-muted mt-1">
            Courses you bookmarked for later study. Stored locally in your browser.
          </p>
        </div>

        {savedCourses.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              for (const id of wishlist) toggleWishlist(id);
            }}
            className="text-xs text-muted hover:text-danger gap-1.5 self-start sm:self-center"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Clear Wishlist</span>
          </Button>
        )}
      </div>

      {savedCourses.length > 0 ? (
        <>
          {/* Summary Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-card border border-border bg-surface">
            <div>
              <span className="text-[11px] font-mono uppercase text-muted tracking-label block">
                Saved Items
              </span>
              <div className="text-xl font-bold font-mono text-foreground mt-0.5">
                {savedCourses.length} Courses
              </div>
            </div>

            <div>
              <span className="text-[11px] font-mono uppercase text-muted tracking-label block">
                Total Commitment
              </span>
              <div className="flex items-center gap-1.5 text-xl font-bold font-mono text-foreground mt-0.5">
                <Clock className="h-4 w-4 text-accent" />
                <span>{formatHours(totalHours)}</span>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-mono uppercase text-muted tracking-label block">
                Total Estimated Cost
              </span>
              <div className="text-xl font-bold font-mono text-accent mt-0.5">
                {formatUSD(totalCost)}
              </div>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </>
      ) : (
        <div className="p-12 text-center rounded-card border border-dashed border-border bg-surface space-y-4 max-w-md mx-auto">
          <Bookmark className="h-9 w-9 text-muted mx-auto" />
          <div className="space-y-1">
            <h3 className="font-semibold text-base text-foreground">Your wishlist is empty</h3>
            <p className="text-xs text-muted leading-relaxed">
              Click the bookmark heart icon on any course in the catalog or recommendations to save it here.
            </p>
          </div>
          <Link href="/courses">
            <Button size="sm" className="text-xs gap-1.5">
              <Compass className="h-3.5 w-3.5" />
              <span>Explore Course Catalog</span>
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
