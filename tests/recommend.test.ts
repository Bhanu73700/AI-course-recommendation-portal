import { describe, it, expect } from "vitest";
import { recommend, calculateBayesianRating } from "@/lib/recommend";
import { Assessment, Course, Role } from "@/types";

const mockRole: Role = {
  id: "frontend-developer",
  title: "Frontend Developer",
  track: "web",
  summary: "Frontend Dev role",
  requiredSkills: [
    { skill: "html", weight: 9, level: 1 },
    { skill: "css", weight: 9, level: 1 },
    { skill: "javascript", weight: 10, level: 2 },
    { skill: "react", weight: 10, level: 2 },
    { skill: "typescript", weight: 8, level: 2 },
  ],
  niceToHave: ["tailwind"],
};

const mockCourses: Course[] = [
  {
    id: "c-web-free-beg",
    title: "Free Web Basics",
    provider: "freeCodeCamp",
    track: "web",
    subGroup: "HTML/CSS Foundations",
    level: "Beginner",
    format: "Interactive",
    skills: ["html", "css"],
    prerequisites: [],
    durationHours: 20,
    priceUSD: 0,
    rating: 4.9,
    ratingCount: 10000,
    language: "English",
    hasCertificate: true,
    projectsCount: 3,
    description: "HTML & CSS",
    outcomes: ["Build pages"],
    careerTags: ["frontend-developer"],
    url: "https://www.freecodecamp.org",
    updatedYear: 2024,
  },
  {
    id: "c-web-paid-react",
    title: "Paid React & TypeScript",
    provider: "Udemy",
    track: "web",
    subGroup: "React & Next.js",
    level: "Intermediate",
    format: "Video",
    skills: ["react", "typescript"],
    prerequisites: ["javascript"],
    durationHours: 30,
    priceUSD: 50,
    rating: 4.8,
    ratingCount: 5000,
    language: "English",
    hasCertificate: true,
    projectsCount: 4,
    description: "React Masterclass",
    outcomes: ["Build apps"],
    careerTags: ["frontend-developer"],
    url: "https://www.udemy.com",
    updatedYear: 2024,
  },
  {
    id: "c-web-full-js",
    title: "Complete JS, React & HTML",
    provider: "Coursera",
    track: "web",
    subGroup: "React & Next.js",
    level: "Beginner",
    format: "Video",
    skills: ["html", "javascript", "react"],
    prerequisites: [],
    durationHours: 40,
    priceUSD: 0,
    rating: 4.85,
    ratingCount: 8000,
    language: "English",
    hasCertificate: true,
    projectsCount: 5,
    description: "Web Full stack",
    outcomes: ["Build full frontend"],
    careerTags: ["frontend-developer"],
    url: "https://www.coursera.org",
    updatedYear: 2024,
  },
  {
    id: "c-andr-kotlin",
    title: "Kotlin Android",
    provider: "Google",
    track: "android",
    subGroup: "Kotlin Basics",
    level: "Beginner",
    format: "Interactive",
    skills: ["kotlin"],
    prerequisites: [],
    durationHours: 20,
    priceUSD: 0,
    rating: 4.9,
    ratingCount: 12000,
    language: "English",
    hasCertificate: true,
    projectsCount: 2,
    description: "Kotlin for Android",
    outcomes: ["Kotlin"],
    careerTags: ["android-developer-junior"],
    url: "https://developer.android.com",
    updatedYear: 2024,
  },
];

describe("Recommendation Engine", () => {
  const baseAssessment: Assessment = {
    track: "web",
    extraTracks: [],
    careerGoal: "frontend-developer",
    currentLevel: "Beginner",
    knownSkills: [],
    interests: ["HTML/CSS Foundations"],
    hoursPerWeek: 10,
    budgetUSD: 100,
    preferredFormats: ["Interactive", "Video"],
    wantsCertificate: true,
  };

  it("1. filters out courses from irrelevant tracks", () => {
    const results = recommend(baseAssessment, mockCourses, mockRole);
    const ids = results.map((r) => r.course.id);
    expect(ids).not.toContain("c-andr-kotlin");
  });

  it("2. strictly excludes paid courses when budget is 0", () => {
    const freeAssessment: Assessment = {
      ...baseAssessment,
      budgetUSD: 0,
    };
    const results = recommend(freeAssessment, mockCourses, mockRole);
    for (const r of results) {
      expect(r.course.priceUSD).toBe(0);
    }
    const ids = results.map((r) => r.course.id);
    expect(ids).not.toContain("c-web-paid-react");
  });

  it("3. satisfies scoring monotonicity (more gap coverage yields higher score)", () => {
    // Assessment with no known skills:
    // c-web-full-js covers html (9) + js (10) + react (10) = 29 weight
    // c-web-free-beg covers html (9) + css (9) = 18 weight
    const results = recommend(baseAssessment, mockCourses, mockRole);
    const recFull = results.find((r) => r.course.id === "c-web-full-js");
    const recBeg = results.find((r) => r.course.id === "c-web-free-beg");

    expect(recFull).toBeDefined();
    expect(recBeg).toBeDefined();
    expect(recFull!.breakdown.skillGap).toBeGreaterThan(recBeg!.breakdown.skillGap);
  });

  it("4. generates prerequisite warning when user lacks prerequisite", () => {
    // c-web-paid-react requires 'javascript', which is not in baseAssessment.knownSkills
    const results = recommend(baseAssessment, mockCourses, mockRole);
    const recReact = results.find((r) => r.course.id === "c-web-paid-react");
    expect(recReact).toBeDefined();
    expect(recReact!.warnings.some((w) => w.toLowerCase().includes("javascript"))).toBe(true);
  });

  it("5. removes prerequisite warning when prerequisite is in knownSkills", () => {
    const skilledAssessment: Assessment = {
      ...baseAssessment,
      knownSkills: ["javascript"],
    };
    const results = recommend(skilledAssessment, mockCourses, mockRole);
    const recReact = results.find((r) => r.course.id === "c-web-paid-react");
    expect(recReact).toBeDefined();
    expect(recReact!.warnings.some((w) => w.toLowerCase().includes("javascript"))).toBe(false);
  });

  it("6. awards level fit bonus when level matches exactly", () => {
    const results = recommend(baseAssessment, mockCourses, mockRole);
    const recBeg = results.find((r) => r.course.id === "c-web-free-beg");
    const recInt = results.find((r) => r.course.id === "c-web-paid-react");
    expect(recBeg!.breakdown.level).toBeGreaterThan(recInt!.breakdown.level);
  });

  it("7. calculates Bayesian weighted rating correctly", () => {
    const rating1 = calculateBayesianRating(5.0, 100);
    const rating2 = calculateBayesianRating(5.0, 50000);
    // With 50,000 votes, rating should be much closer to 5.0 than with only 100 votes
    expect(rating2).toBeGreaterThan(rating1);
  });

  it("8. breaks ties by quality score and duration", () => {
    const tieCourses: Course[] = [
      {
        ...mockCourses[0],
        id: "tie-1",
        durationHours: 30,
        rating: 4.8,
        ratingCount: 1000,
      },
      {
        ...mockCourses[0],
        id: "tie-2",
        durationHours: 15, // shorter duration
        rating: 4.8,
        ratingCount: 1000,
      },
    ];
    const results = recommend(baseAssessment, tieCourses, mockRole);
    expect(results[0].course.id).toBe("tie-2");
  });

  it("9. includes plain-English explanation lines", () => {
    const results = recommend(baseAssessment, mockCourses, mockRole);
    const topRec = results[0];
    expect(topRec.reasons.length).toBeGreaterThanOrEqual(1);
    expect(typeof topRec.reasons[0]).toBe("string");
  });

  it("10. populates fillsSkills with correct subset of gap skills", () => {
    const results = recommend(baseAssessment, mockCourses, mockRole);
    const recBeg = results.find((r) => r.course.id === "c-web-free-beg");
    expect(recBeg!.fillsSkills).toContain("html");
    expect(recBeg!.fillsSkills).toContain("css");
    expect(recBeg!.fillsSkills).not.toContain("react");
  });
});
