import { describe, it, expect } from "vitest";
import { COURSES } from "@/data/courses";
import { ROLES, getRoleById } from "@/data/roles";
import { recommend } from "@/lib/recommend";
import { analyzeSkillGap } from "@/lib/skillGap";
import { getScaledRoadmap, calculateRoadmapProgress } from "@/lib/roadmap";
import { extractSkillsFromText, analyzeResumeText } from "@/lib/resume";
import { getAssistantReply } from "@/lib/assistant";
import { Assessment, Role } from "@/types";

describe("CourseAI End-to-End Verification Flows (Section 13)", () => {
  // --------------------------------------------------------------------------
  // Flow A: Web Development, Beginner, $0 Budget -> Free beginner courses rank first
  // --------------------------------------------------------------------------
  it("Flow A: Web Development, Beginner, $0 Budget ranks free beginner courses first", () => {
    const webAssessment: Assessment = {
      track: "web",
      extraTracks: [],
      careerGoal: "frontend-developer",
      currentLevel: "Beginner",
      knownSkills: [],
      interests: ["HTML/CSS Foundations"],
      hoursPerWeek: 10,
      budgetUSD: 0, // $0 Free only
      preferredFormats: ["Interactive", "Video"],
      wantsCertificate: false,
    };

    const role = getRoleById("frontend-developer")!;
    expect(role).toBeDefined();

    const results = recommend(webAssessment, COURSES, role);

    // Verify results exist
    expect(results.length).toBeGreaterThan(0);

    // Verify all recommended courses are strictly $0
    for (const r of results) {
      expect(r.course.priceUSD).toBe(0);
      expect(r.course.track).toBe("web");
    }

    // Top recommended courses should be Beginner level
    const topPick = results[0];
    expect(topPick.course.level).toBe("Beginner");
    expect(topPick.score).toBeGreaterThanOrEqual(70);
    expect(topPick.course.skills).toContain("html");
  });

  // --------------------------------------------------------------------------
  // Flow B: Android Development, Android Dev Junior, no Kotlin:
  // Kotlin courses must show before Compose, and Compose courses show prerequisite warning
  // --------------------------------------------------------------------------
  it("Flow B: Android Dev without Kotlin ranks Kotlin first and flags Compose with prerequisite warning", () => {
    const androidAssessment: Assessment = {
      track: "android",
      extraTracks: [],
      careerGoal: "android-developer-junior",
      currentLevel: "Beginner",
      knownSkills: [], // No Kotlin!
      interests: ["Jetpack Compose"],
      hoursPerWeek: 12,
      budgetUSD: 100,
      preferredFormats: ["Interactive", "Video"],
      wantsCertificate: false,
    };

    const role = getRoleById("android-developer-junior")!;
    expect(role).toBeDefined();

    const results = recommend(androidAssessment, COURSES, role);

    // Find first Kotlin course and Compose course
    const kotlinCourseIndex = results.findIndex((r) =>
      r.course.skills.includes("kotlin") && !r.course.skills.includes("jetpack-compose")
    );
    const composeCourseIndex = results.findIndex((r) =>
      r.course.skills.includes("jetpack-compose")
    );

    expect(kotlinCourseIndex).toBeGreaterThan(-1);
    expect(composeCourseIndex).toBeGreaterThan(-1);

    // Kotlin basics must rank before Compose courses when Kotlin is unknown
    expect(kotlinCourseIndex).toBeLessThan(composeCourseIndex);

    // Compose course must have a warning about missing Kotlin prerequisite
    const composeRec = results[composeCourseIndex];
    expect(
      composeRec.warnings.some((w) => w.toLowerCase().includes("prerequisite: kotlin"))
    ).toBe(true);
  });

  // --------------------------------------------------------------------------
  // Flow C: Wishlist Persistence & Manipulation
  // --------------------------------------------------------------------------
  it("Flow C: Wishlist accurately tracks 3 saved courses and computes hours and cost", () => {
    const wishlistIds = ["web-01", "web-02", "andr-01"];
    const savedCourses = COURSES.filter((c) => wishlistIds.includes(c.id));

    expect(savedCourses.length).toBe(3);
    const totalDuration = savedCourses.reduce((sum, c) => sum + c.durationHours, 0);
    expect(totalDuration).toBe(40 + 60 + 20); // 120 hrs
    const totalCost = savedCourses.reduce((sum, c) => sum + c.priceUSD, 0);
    expect(totalCost).toBe(0); // All 3 are free
  });

  // --------------------------------------------------------------------------
  // Flow D: Marking Course Complete updates skills, progress, and skill-gap readiness
  // --------------------------------------------------------------------------
  it("Flow D: Marking a course complete awards skills and raises readiness score", () => {
    const role = getRoleById("android-developer-junior")!;

    // Initial state: 0 known skills
    const initialGap = analyzeSkillGap([], role, COURSES);
    expect(initialGap.readinessPercent).toBe(0);

    // User completes 'andr-01' which teaches 'kotlin' and 'kotlin-oop'
    const course = COURSES.find((c) => c.id === "andr-01")!;
    const updatedKnownSkills = [...course.skills]; // ['kotlin', 'kotlin-oop']

    const updatedGap = analyzeSkillGap(updatedKnownSkills, role, COURSES);

    // Readiness score must increase
    expect(updatedGap.readinessPercent).toBeGreaterThan(0);
    expect(updatedGap.have.some((s) => s.skill === "kotlin")).toBe(true);
    expect(updatedGap.have.some((s) => s.skill === "kotlin-oop")).toBe(true);

    // Further complete Jetpack Compose ('andr-03')
    const composeCourse = COURSES.find((c) => c.id === "andr-03")!;
    const advancedSkills = [...updatedKnownSkills, ...composeCourse.skills];
    const finalGap = analyzeSkillGap(advancedSkills, role, COURSES);

    expect(finalGap.readinessPercent).toBeGreaterThan(updatedGap.readinessPercent);
  });

  // --------------------------------------------------------------------------
  // Flow E: Resume Parsing and Skill Extraction
  // --------------------------------------------------------------------------
  it("Flow E: Analyzes resume text, extracts skills, and calculates heuristic score", () => {
    const sampleResume = `
      Alex Rivera
      alex.rivera@example.com | github.com/alexrivera-dev
      
      EXPERIENCE
      Frontend Developer at Acme Corp
      - Architected responsive web application utilizing React, Next.js, and TypeScript.
      - Increased Lighthouse performance score by 35% for over 50,000 monthly active users.
      - Implemented automated testing with Jest and Playwright.
      
      PROJECTS
      Android Fitness App
      - Built native Android app with Kotlin and Jetpack Compose.
      - Implemented local offline caching using Room database.
      
      SKILLS
      React, Next.js, TypeScript, JavaScript, HTML, CSS, Tailwind CSS, Kotlin, Jetpack Compose, Git
    `;

    const role = getRoleById("frontend-developer")!;
    const analysis = analyzeResumeText(sampleResume, role, COURSES);

    expect(analysis.detectedSkills).toContain("react");
    expect(analysis.detectedSkills).toContain("nextjs");
    expect(analysis.detectedSkills).toContain("typescript");
    expect(analysis.detectedSkills).toContain("kotlin");
    expect(analysis.detectedSkills).toContain("jetpack-compose");

    expect(analysis.signals.hasEmail).toBe(true);
    expect(analysis.signals.hasGithubOrLinks).toBe(true);
    expect(analysis.signals.hasQuantifiedMetrics).toBe(true);
    expect(analysis.score).toBeGreaterThanOrEqual(80);
  });

  // --------------------------------------------------------------------------
  // Flow F: Assistant 'What should I learn next?' uses user's real gap
  // --------------------------------------------------------------------------
  it("Flow F: AI Assistant targets user's highest priority missing gap", async () => {
    const role = getRoleById("android-developer-junior")!;

    // Scenario: User knows Git and Android Studio, but missing Kotlin
    const reply = await getAssistantReply("What should I learn next?", {
      assessment: {
        track: "android",
        extraTracks: [],
        careerGoal: "android-developer-junior",
        currentLevel: "Beginner",
        knownSkills: ["git", "android-studio"],
        interests: [],
        hoursPerWeek: 10,
        budgetUSD: 100,
        preferredFormats: ["Video", "Interactive"],
        wantsCertificate: false,
      },
      knownSkills: ["git", "android-studio"],
      role,
      allCourses: COURSES,
    });

    // Assistant response must mention highest priority gap (Kotlin) and suggest courses
    expect(reply.text.toLowerCase()).toContain("kotlin");
    expect(reply.suggestedCourses).toBeDefined();
    expect(reply.suggestedCourses!.length).toBeGreaterThan(0);
    expect(reply.suggestedCourses![0].skills).toContain("kotlin");
  });

  // --------------------------------------------------------------------------
  // Flow G: Career Roadmap Scaling
  // --------------------------------------------------------------------------
  it("Flow G: Scales roadmap durations according to user weekly commitment", () => {
    const roadmap10Hrs = getScaledRoadmap("android-developer-junior", "Android Developer (Junior)", 10);
    const roadmap20Hrs = getScaledRoadmap("android-developer-junior", "Android Developer (Junior)", 20);

    // 20 hrs/week should take roughly half the weeks of 10 hrs/week
    expect(roadmap20Hrs.totalWeeks).toBeLessThan(roadmap10Hrs.totalWeeks);
    expect(roadmap10Hrs.phases.length).toBeGreaterThanOrEqual(4);
  });
});
