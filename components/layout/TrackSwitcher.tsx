"use client";

import * as React from "react";
import { useAppStore } from "@/store/useAppStore";
import { TRACKS } from "@/data/skills";
import { COURSES } from "@/data/courses";
import { TrackId } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Globe, Smartphone, BrainCircuit, ShieldAlert, Cloud, Palette, Layers } from "lucide-react";

const TRACK_ICONS: Record<TrackId, React.ReactNode> = {
  web: <Globe className="h-3.5 w-3.5 text-accent" />,
  android: <Smartphone className="h-3.5 w-3.5 text-accent" />,
  "data-ai": <BrainCircuit className="h-3.5 w-3.5 text-accent" />,
  cybersecurity: <ShieldAlert className="h-3.5 w-3.5 text-accent" />,
  "cloud-devops": <Cloud className="h-3.5 w-3.5 text-accent" />,
  design: <Palette className="h-3.5 w-3.5 text-accent" />,
  "cross-platform": <Layers className="h-3.5 w-3.5 text-accent" />,
};

export function TrackSwitcher() {
  const { track, setTrack, hasHydrated } = useAppStore();

  if (!hasHydrated || !track) {
    return (
      <div className="h-8 w-36 rounded-md bg-surface border border-border animate-pulse" />
    );
  }

  const currentMeta = TRACKS.find((t) => t.id === track);

  return (
    <div className="flex items-center gap-1.5">
      <Select value={track} onValueChange={(val) => setTrack(val as TrackId)}>
        <SelectTrigger className="h-8 px-2.5 text-xs bg-surface border-border text-foreground hover:border-foreground/30 focus:ring-0">
          <div className="flex items-center gap-2 truncate">
            {TRACK_ICONS[track]}
            <span className="font-medium truncate">{currentMeta?.name || "Track"}</span>
          </div>
        </SelectTrigger>
        <SelectContent align="end" className="w-56">
          {TRACKS.map((t) => {
            const count = COURSES.filter((c) => c.track === t.id).length;
            return (
              <SelectItem key={t.id} value={t.id} className="text-xs">
                <div className="flex items-center justify-between w-full gap-2">
                  <div className="flex items-center gap-2">
                    {TRACK_ICONS[t.id]}
                    <span className="font-medium">{t.name}</span>
                  </div>
                  <span className="text-[10px] text-muted">{count} courses</span>
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}
