"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { TRACKS } from "@/data/skills";
import { TrackCard } from "./TrackCard";
import { useAppStore } from "@/store/useAppStore";
import { Button } from "@/components/ui/button";
import { ArrowRight, Compass } from "lucide-react";
import { TrackId } from "@/types";

export function TrackPicker() {
  const router = useRouter();
  const { track, setTrack, extraTracks, setExtraTracks, hasHydrated } = useAppStore();

  const [selectedPrimary, setSelectedPrimary] = React.useState<TrackId>(track || "web");
  const [selectedSecondary, setSelectedSecondary] = React.useState<TrackId[]>(extraTracks || []);

  React.useEffect(() => {
    if (hasHydrated && track) {
      setSelectedPrimary(track);
      setSelectedSecondary(extraTracks);
    }
  }, [hasHydrated, track, extraTracks]);

  const handleSelectPrimary = (id: TrackId) => {
    setSelectedPrimary(id);
    setSelectedSecondary((prev) => prev.filter((t) => t !== id));
  };

  const handleToggleSecondary = (id: TrackId) => {
    if (id === selectedPrimary) return;
    setSelectedSecondary((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const handleConfirm = () => {
    setTrack(selectedPrimary);
    setExtraTracks(selectedSecondary);
    router.push("/onboarding");
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {TRACKS.map((t) => (
          <TrackCard
            key={t.id}
            track={t}
            isPrimary={selectedPrimary === t.id}
            isSecondary={selectedSecondary.includes(t.id)}
            onSelectPrimary={handleSelectPrimary}
            onToggleSecondary={handleToggleSecondary}
          />
        ))}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-card border border-border bg-surface">
        <div className="text-xs text-muted">
          Selected primary: <span className="font-semibold text-foreground">{TRACKS.find((t) => t.id === selectedPrimary)?.name}</span>
          {selectedSecondary.length > 0 && (
            <span>
              {" "}· Secondary:{" "}
              {selectedSecondary.map((s) => TRACKS.find((t) => t.id === s)?.name).join(", ")}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            onClick={handleConfirm}
            className="w-full sm:w-auto gap-2 px-6 h-10 text-sm font-medium"
          >
            <span>Continue to Assessment</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
