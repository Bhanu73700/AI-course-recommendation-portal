"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, BookOpen, Map, Sparkles, User } from "lucide-react";

export function MobileNav() {
  const pathname = usePathname();

  const items = [
    { href: "/dashboard", label: "Overview", icon: User },
    { href: "/courses", label: "Catalog", icon: BookOpen },
    { href: "/recommendations", label: "Matches", icon: Sparkles },
    { href: "/roadmap", label: "Roadmap", icon: Map },
    { href: "/onboarding", label: "Assess", icon: Compass },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 z-40 w-full border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 px-2 py-1.5 flex items-center justify-around">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-md transition-colors ${
              isActive ? "text-accent" : "text-muted hover:text-foreground"
            }`}
          >
            <Icon className="h-4 w-4" />
            <span className="text-[10px] mt-0.5 font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
