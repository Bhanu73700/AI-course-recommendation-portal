"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, toggleTheme, hasHydrated } = useAppStore();

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  if (!hasHydrated) {
    return (
      <Button variant="ghost" size="icon" aria-label="Toggle theme" className="w-8 h-8 text-muted">
        <Sun className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      className="w-8 h-8 text-muted hover:text-foreground transition-colors"
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4 transition-transform rotate-0 scale-100" />
      ) : (
        <Moon className="h-4 w-4 transition-transform rotate-0 scale-100" />
      )}
    </Button>
  );
}
