import { RoadmapPhase } from "@/types";
import { getRoadmapForRole } from "@/data/roadmapTemplates";

export function getScaledRoadmap(
  roleId: string,
  roleTitle: string,
  hoursPerWeek: number
): {
  phases: RoadmapPhase[];
  totalWeeks: number;
  projectedCompletionDate: string;
} {
  const basePhases = getRoadmapForRole(roleId, roleTitle);
  const weeklyHours = Math.max(1, Math.min(40, hoursPerWeek || 10));

  // Base templates assume 10 hrs/week
  const scale = 10 / weeklyHours;

  const scaledPhases = basePhases.map((phase) => ({
    ...phase,
    durationWeeks: Math.max(1, Math.round(phase.durationWeeks * scale)),
  }));

  const totalWeeks = scaledPhases.reduce((acc, p) => acc + p.durationWeeks, 0);

  // Projected completion date from today
  const today = new Date();
  const projected = new Date(today.getTime() + totalWeeks * 7 * 24 * 60 * 60 * 1000);
  const projectedCompletionDate = projected.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return {
    phases: scaledPhases,
    totalWeeks,
    projectedCompletionDate,
  };
}

export function calculateRoadmapProgress(
  phases: RoadmapPhase[],
  completedCheckpoints: string[]
): {
  totalCheckpoints: number;
  completedCount: number;
  percentage: number;
} {
  const completedSet = new Set(completedCheckpoints);
  let totalCheckpoints = 0;
  let completedCount = 0;

  for (const phase of phases) {
    for (const cp of phase.checkpoints) {
      totalCheckpoints++;
      if (completedSet.has(cp)) {
        completedCount++;
      }
    }
  }

  const percentage = totalCheckpoints > 0 ? Math.round((completedCount / totalCheckpoints) * 100) : 0;
  return { totalCheckpoints, completedCount, percentage };
}
