"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { COURSES } from "@/data/courses";
import { TRACKS } from "@/data/skills";
import { ROLES, getRoleById } from "@/data/roles";
import { useAppStore } from "@/store/useAppStore";
import { CourseCard } from "@/components/courses/CourseCard";
import { SearchBar } from "@/components/courses/SearchBar";
import { Filters, FilterState, INITIAL_FILTERS } from "@/components/courses/Filters";
import { recommend } from "@/lib/recommend";
import { Button } from "@/components/ui/button";
import { Course } from "@/types";
import {
  LayoutGrid,
  List,
  SlidersHorizontal,
  BookOpen,
  ArrowUpDown,
  Sparkles,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

function CoursesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { track, assessment, hasHydrated } = useAppStore();

  const [searchQuery, setSearchQuery] = React.useState("");
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");
  const [visibleCount, setVisibleCount] = React.useState(12);
  const [mobileFilterOpen, setMobileFilterOpen] = React.useState(false);

  // Initialize filters from searchParams or defaults
  const [filters, setFilters] = React.useState<FilterState>(() => {
    return {
      track: searchParams.get("track") || (track || "all"),
      subGroup: searchParams.get("subGroup") || "all",
      level: searchParams.get("level") || "all",
      priceType: (searchParams.get("price") as "all" | "free" | "paid") || "all",
      format: searchParams.get("format") || "all",
      hasCertificate: searchParams.get("cert") === "true",
      sortBy: (searchParams.get("sort") as FilterState["sortBy"]) || "rating",
    };
  });

  // Keep URL query params in sync
  React.useEffect(() => {
    const params = new URLSearchParams();
    if (filters.track !== "all") params.set("track", filters.track);
    if (filters.subGroup !== "all") params.set("subGroup", filters.subGroup);
    if (filters.level !== "all") params.set("level", filters.level);
    if (filters.priceType !== "all") params.set("price", filters.priceType);
    if (filters.format !== "all") params.set("format", filters.format);
    if (filters.hasCertificate) params.set("cert", "true");
    if (filters.sortBy !== "rating") params.set("sort", filters.sortBy);
    if (searchQuery) params.set("q", searchQuery);

    const qs = params.toString();
    const targetUrl = qs ? `/courses?${qs}` : "/courses";
    window.history.replaceState(null, "", targetUrl);
  }, [filters, searchQuery]);

  // Compute recommendation scores if assessment exists
  const matchScoresMap = React.useMemo(() => {
    if (!assessment) return new Map<string, number>();
    const role = getRoleById(assessment.careerGoal) || ROLES[0];
    const recs = recommend(assessment, COURSES, role);
    const map = new Map<string, number>();
    for (const r of recs) {
      map.set(r.course.id, r.score);
    }
    return map;
  }, [assessment]);

  // Available sub-groups based on selected track
  const availableSubGroups = React.useMemo(() => {
    if (filters.track === "all") {
      const allSg = new Set<string>();
      for (const t of TRACKS) {
        for (const sg of t.subGroups) allSg.add(sg);
      }
      return Array.from(allSg);
    }
    const tMeta = TRACKS.find((t) => t.id === filters.track);
    return tMeta ? tMeta.subGroups : [];
  }, [filters.track]);

  // Filter & Search Logic
  const filteredCourses = React.useMemo(() => {
    return COURSES.filter((course) => {
      // Track
      if (filters.track !== "all" && course.track !== filters.track) return false;
      // Sub-Group
      if (filters.subGroup !== "all" && course.subGroup !== filters.subGroup) return false;
      // Level
      if (filters.level !== "all" && course.level !== filters.level) return false;
      // Price
      if (filters.priceType === "free" && course.priceUSD > 0) return false;
      if (filters.priceType === "paid" && course.priceUSD === 0) return false;
      // Format
      if (filters.format !== "all" && course.format !== filters.format) return false;
      // Certificate
      if (filters.hasCertificate && !course.hasCertificate) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = course.title.toLowerCase().includes(q);
        const matchesProvider = course.provider.toLowerCase().includes(q);
        const matchesSkill = course.skills.some((s) => s.toLowerCase().includes(q));
        const matchesSubGroup = course.subGroup.toLowerCase().includes(q);
        if (!matchesTitle && !matchesProvider && !matchesSkill && !matchesSubGroup) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === "match") {
        const scoreA = matchScoresMap.get(a.id) || 0;
        const scoreB = matchScoresMap.get(b.id) || 0;
        return scoreB - scoreA;
      }
      if (filters.sortBy === "rating") {
        return b.rating - a.rating;
      }
      if (filters.sortBy === "duration-asc") {
        return a.durationHours - b.durationHours;
      }
      if (filters.sortBy === "duration-desc") {
        return b.durationHours - a.durationHours;
      }
      if (filters.sortBy === "price-asc") {
        return a.priceUSD - b.priceUSD;
      }
      if (filters.sortBy === "newest") {
        return b.updatedYear - a.updatedYear;
      }
      return 0;
    });
  }, [filters, searchQuery, matchScoresMap]);

  const displayedCourses = filteredCourses.slice(0, visibleCount);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tightest text-foreground">
            Course Catalog
          </h1>
          <p className="text-xs text-muted mt-1">
            Browse {COURSES.length} curated, open-access and verified professional courses.
          </p>
        </div>

        {/* View Mode & Mobile Filter Trigger */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <div className="flex items-center border border-border rounded-button p-0.5 bg-surface">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-sm transition-colors ${
                viewMode === "grid" ? "bg-background text-foreground shadow-sm" : "text-muted"
              }`}
              aria-label="Grid view"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-sm transition-colors ${
                viewMode === "list" ? "bg-background text-foreground shadow-sm" : "text-muted"
              }`}
              aria-label="List view"
            >
              <List className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Mobile Filter Sheet Trigger */}
          <Sheet open={mobileFilterOpen} onOpenChange={setMobileFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="sm:hidden text-xs gap-1.5 h-8">
                <SlidersHorizontal className="h-3.5 w-3.5" />
                <span>Filters</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto rounded-t-card p-6">
              <SheetHeader className="text-left pb-3 border-b border-border mb-4">
                <SheetTitle className="text-base">Filter Courses</SheetTitle>
              </SheetHeader>
              <Filters
                filters={filters}
                onChange={setFilters}
                availableSubGroups={availableSubGroups}
              />
              <Button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full mt-6 text-xs"
              >
                Apply Filters ({filteredCourses.length} results)
              </Button>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Search & Sort Controls */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="flex-1 w-full">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-xs text-muted whitespace-nowrap">Sort:</label>
          <select
            value={filters.sortBy}
            onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as FilterState["sortBy"] })}
            className="w-full sm:w-auto text-xs h-10 rounded-input bg-surface border border-border px-3 text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
          >
            {assessment && <option value="match">★ Highest Match Score</option>}
            <option value="rating">Highest Rated</option>
            <option value="duration-asc">Duration: Short to Long</option>
            <option value="duration-desc">Duration: Long to Short</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="newest">Recently Updated</option>
          </select>
        </div>
      </div>

      {/* Desktop Filters Panel */}
      <div className="hidden sm:block p-4 rounded-card border border-border bg-surface">
        <Filters
          filters={filters}
          onChange={setFilters}
          availableSubGroups={availableSubGroups}
        />
      </div>

      {/* Course Count Summary */}
      <div className="flex items-center justify-between text-xs text-muted">
        <span>Showing {displayedCourses.length} of {filteredCourses.length} courses</span>
        {assessment && (
          <span className="flex items-center gap-1 text-accent font-medium">
            <Sparkles className="h-3 w-3" />
            <span>Match scores computed for {assessment.careerGoal}</span>
          </span>
        )}
      </div>

      {/* Course Grid / List View */}
      {displayedCourses.length > 0 ? (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              : "space-y-3"
          }
        >
          {displayedCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              matchScore={matchScoresMap.get(course.id)}
              viewMode={viewMode}
            />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-card border border-dashed border-border bg-surface space-y-3">
          <BookOpen className="h-8 w-8 text-muted mx-auto" />
          <h3 className="font-semibold text-sm text-foreground">No courses found</h3>
          <p className="text-xs text-muted max-w-sm mx-auto">
            No courses match your active search and filter combinations. Try clearing some filters or relaxing your price criteria.
          </p>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setFilters(INITIAL_FILTERS);
              setSearchQuery("");
            }}
            className="text-xs"
          >
            Reset All Filters
          </Button>
        </div>
      )}

      {/* Load More Button */}
      {visibleCount < filteredCourses.length && (
        <div className="text-center pt-4">
          <Button
            variant="outline"
            onClick={() => setVisibleCount((prev) => prev + 12)}
            className="text-xs px-6"
          >
            Load More Courses ({filteredCourses.length - visibleCount} remaining)
          </Button>
        </div>
      )}
    </div>
  );
}

export default function CoursesPage() {
  return (
    <React.Suspense
      fallback={
        <div className="p-8 text-center text-xs text-muted">
          Loading course catalog...
        </div>
      }
    >
      <CoursesContent />
    </React.Suspense>
  );
}
