"use client";

import * as React from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Search by course title, skill (e.g. 'compose', 'react'), or provider...",
}: SearchBarProps) {
  const [localVal, setLocalVal] = React.useState(value);

  React.useEffect(() => {
    setLocalVal(value);
  }, [value]);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      onChange(localVal);
    }, 200);
    return () => clearTimeout(handler);
  }, [localVal, onChange]);

  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted pointer-events-none" />
      <Input
        value={localVal}
        onChange={(e) => setLocalVal(e.target.value)}
        placeholder={placeholder}
        className="pl-9 pr-8 h-10 text-xs sm:text-sm bg-background border-border shadow-none"
      />
      {localVal && (
        <button
          onClick={() => {
            setLocalVal("");
            onChange("");
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground p-0.5"
          aria-label="Clear search"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
