"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { ThemeToggle } from "./ThemeToggle";
import { TrackSwitcher } from "./TrackSwitcher";
import { Button } from "@/components/ui/button";
import { Compass, Sparkles, Bookmark, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/courses", label: "Catalog" },
  { href: "/recommendations", label: "Recommendations" },
  { href: "/skill-gap", label: "Skill Gap" },
  { href: "/roadmap", label: "Roadmap" },
  { href: "/resume", label: "Resume" },
  { href: "/progress", label: "Progress" },
  { href: "/assistant", label: "AI Assistant" },
  { href: "/about", label: "About" },
];

export function Navbar() {
  const pathname = usePathname();
  const { wishlist, assessment, hasHydrated } = useAppStore();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const wishlistCount = hasHydrated ? wishlist.length : 0;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="max-w-content mx-auto flex h-14 items-center justify-between px-4 sm:px-6">
        {/* Brand / Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-7 w-7 rounded-lg bg-accent text-white flex items-center justify-center font-bold text-xs tracking-tight shadow-sm">
              CA
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-semibold text-base tracking-tight text-foreground">CourseAI</span>
              <span className="text-[10px] text-muted font-mono tracking-wider uppercase">MVP</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-medium">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-2.5 py-1.5 rounded-button text-xs transition-colors ${
                    isActive
                      ? "text-foreground bg-surface font-semibold"
                      : "text-muted hover:text-foreground hover:bg-surface/60"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Wishlist Link */}
          <Link href="/wishlist" className="relative hidden sm:inline-flex">
            <Button variant="ghost" size="icon" className="w-8 h-8 text-muted hover:text-foreground" aria-label="View Wishlist">
              <Bookmark className="h-4 w-4" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[9px] font-semibold text-white">
                  {wishlistCount}
                </span>
              )}
            </Button>
          </Link>

          {/* Track Switcher */}
          <div className="hidden sm:block">
            <TrackSwitcher />
          </div>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Assessment CTA */}
          <Link href="/onboarding" className="hidden md:inline-flex">
            <Button size="sm" variant={assessment ? "secondary" : "primary"} className="gap-1.5 text-xs h-8">
              <Sparkles className="h-3 w-3" />
              {assessment ? "Retake Assessment" : "Start Assessment"}
            </Button>
          </Link>

          {/* Mobile Sheet Trigger */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden w-8 h-8" aria-label="Open menu">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 p-6 flex flex-col justify-between">
              <div className="space-y-6">
                <SheetHeader className="text-left pb-2 border-b border-border">
                  <SheetTitle className="flex items-center gap-2 text-base">
                    <div className="h-6 w-6 rounded bg-accent text-white flex items-center justify-center font-bold text-xs">
                      CA
                    </div>
                    CourseAI
                  </SheetTitle>
                </SheetHeader>

                <div className="space-y-1">
                  <div className="text-[11px] font-mono uppercase text-muted tracking-label px-2 py-1">
                    Select Track
                  </div>
                  <div className="px-2">
                    <TrackSwitcher />
                  </div>
                </div>

                <nav className="flex flex-col space-y-1">
                  <div className="text-[11px] font-mono uppercase text-muted tracking-label px-2 py-1">
                    Pages
                  </div>
                  {NAV_LINKS.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className={`px-3 py-2 rounded-button text-sm transition-colors ${
                          isActive
                            ? "bg-accent-soft text-accent font-medium"
                            : "text-muted hover:text-foreground hover:bg-surface"
                        }`}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                  <Link
                    href="/wishlist"
                    onClick={() => setMobileOpen(false)}
                    className="px-3 py-2 rounded-button text-sm text-muted hover:text-foreground hover:bg-surface flex items-center justify-between"
                  >
                    <span>Wishlist</span>
                    {wishlistCount > 0 && (
                      <span className="rounded-full bg-accent text-white text-[10px] px-2 py-0.5 font-medium">
                        {wishlistCount}
                      </span>
                    )}
                  </Link>
                </nav>
              </div>

              <div className="pt-4 border-t border-border">
                <Link href="/onboarding" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full text-xs gap-1.5">
                    <Compass className="h-3.5 w-3.5" />
                    {assessment ? "Retake Assessment" : "Take Assessment"}
                  </Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
