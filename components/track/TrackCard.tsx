import * as React from "react";
import { TrackMeta } from "@/types";
import { Globe, Smartphone, BrainCircuit, ShieldAlert, Cloud, Palette, Layers, Check } from "lucide-react";
import { COURSES } from "@/data/courses";
import { cn } from "@/lib/utils";

const ICONS = {
  Globe,
  Smartphone,
  BrainCircuit,
  ShieldAlert,
  Cloud,
  Palette,
  Layers,
};

interface TrackCardProps {
  track: TrackMeta;
  isPrimary: boolean;
  isSecondary: boolean;
  onSelectPrimary: (id: TrackMeta["id"]) => void;
  onToggleSecondary: (id: TrackMeta["id"]) => void;
}

export function TrackCard({
  track,
  isPrimary,
  isSecondary,
  onSelectPrimary,
  onToggleSecondary,
}: TrackCardProps) {
  const IconComponent = ICONS[track.iconName as keyof typeof ICONS] || Globe;
  const courseCount = COURSES.filter((c) => c.track === track.id).length;

  return (
    <div
      onClick={() => onSelectPrimary(track.id)}
      className={cn(
        "group relative flex flex-col justify-between p-5 rounded-card border transition-all duration-150 cursor-pointer text-left bg-background",
        isPrimary
          ? "border-accent ring-1 ring-accent bg-accent-soft/30"
          : isSecondary
          ? "border-accent/40 bg-surface"
          : "border-border hover:border-foreground/40 bg-background"
      )}
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <div
            className={cn(
              "h-10 w-10 rounded-lg flex items-center justify-center transition-colors",
              isPrimary
                ? "bg-accent text-white"
                : "bg-surface border border-border text-foreground group-hover:text-accent group-hover:border-accent/40"
            )}
          >
            <IconComponent className="h-5 w-5" />
          </div>

          <div className="flex items-center gap-1.5">
            {isPrimary ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent text-white text-[10px] font-semibold tracking-wide">
                <Check className="h-3 w-3" />
                Primary
              </span>
            ) : isSecondary ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent-soft text-accent border border-accent/20 text-[10px] font-medium">
                Interest
              </span>
            ) : (
              <span className="text-[11px] font-mono text-muted">
                {courseCount} courses
              </span>
            )}
          </div>
        </div>

        <h3 className="font-semibold text-base text-foreground mb-1 group-hover:text-accent transition-colors">
          {track.name}
        </h3>
        <p className="text-xs text-muted leading-relaxed line-clamp-2">
          {track.description}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-[11px]">
        <span className="text-muted font-mono">{courseCount} courses available</span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleSecondary(track.id);
          }}
          className={cn(
            "text-[10px] px-2 py-0.5 rounded transition-colors",
            isSecondary
              ? "text-danger hover:underline"
              : "text-muted hover:text-foreground"
          )}
        >
          {isSecondary ? "Remove secondary" : "+ Also interested"}
        </button>
      </div>
    </div>
  );
}
