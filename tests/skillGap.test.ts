import { describe, it, expect } from "vitest";
import { analyzeSkillGap } from "@/lib/skillGap";
import { Role, Course } from "@/types";

const mockRole: Role = {
  id: "test-role",
  title: "Test Role",
  track: "android",
  summary: "Test Role Summary",
  requiredSkills: [
    { skill: "kotlin", weight: 10, level: 1 },
    { skill: "jetpack-compose", weight: 10, level: 1 },
    { skill: "room-db", weight: 5, level: 1 },
  ],
  niceToHave: [],
};

const mockCourses: Course[] = [
  {
    id: "andr-01",
    title: "Kotlin Basics",
    provider: "JetBrains",
    track: "android",
    subGroup: "Kotlin Basics",
    level: "Beginner",
    format: "Interactive",
    skills: ["kotlin"],
    prerequisites: [],
    durationHours: 20,
    priceUSD: 0,
    rating: 4.9,
    ratingCount: 1000,
    language: "English",
    hasCertificate: true,
    projectsCount: 2,
    description: "Kotlin Basics",
    outcomes: ["Kotlin"],
    careerTags: ["test-role"],
    url: "https://developer.android.com",
    updatedYear: 2024,
  },
];

describe("Skill Gap Analysis", () => {
  it("calculates 0% readiness when no skills are known", () => {
    const analysis = analyzeSkillGap([], mockRole, mockCourses);
    expect(analysis.readinessPercent).toBe(0);
    expect(analysis.missing.length).toBe(3);
    expect(analysis.have.length).toBe(0);
  });

  it("calculates correct readiness when some skills are known", () => {
    // Total weight = 10 + 10 + 5 = 25.
    // Known: kotlin (10). Readiness = (10/25)*100 = 40%
    const analysis = analyzeSkillGap(["kotlin"], mockRole, mockCourses);
    expect(analysis.readinessPercent).toBe(40);
    expect(analysis.have.some((s) => s.skill === "kotlin")).toBe(true);
    expect(analysis.missing.some((s) => s.skill === "jetpack-compose")).toBe(true);
  });

  it("calculates 100% readiness when all skills are known", () => {
    const analysis = analyzeSkillGap(["kotlin", "jetpack-compose", "room-db"], mockRole, mockCourses);
    expect(analysis.readinessPercent).toBe(100);
    expect(analysis.missing.length).toBe(0);
  });

  it("associates top matching courses with missing skills", () => {
    const analysis = analyzeSkillGap([], mockRole, mockCourses);
    const kotlinGap = analysis.missing.find((s) => s.skill === "kotlin");
    expect(kotlinGap).toBeDefined();
    expect(kotlinGap!.topCourses.length).toBeGreaterThanOrEqual(1);
    expect(kotlinGap!.topCourses[0].id).toBe("andr-01");
  });
});
