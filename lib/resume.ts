import { Course, ResumeAnalysis, Role } from "@/types";
import { SKILLS_MASTER } from "@/data/skills";

const ACTION_VERBS = [
  "built", "developed", "architected", "engineered", "implemented", "designed",
  "optimized", "deployed", "spearheaded", "reduced", "increased", "created",
  "automated", "maintained", "refactored", "integrated", "led", "scaled"
];

export function extractSkillsFromText(text: string): string[] {
  const normalized = text.toLowerCase();
  const detectedSlugs = new Set<string>();

  for (const item of SKILLS_MASTER) {
    // Check main slug
    const slugRegex = new RegExp(`\\b${escapeRegExp(item.slug)}\\b`, "i");
    if (slugRegex.test(normalized)) {
      detectedSlugs.add(item.slug);
      continue;
    }

    // Check name
    const nameRegex = new RegExp(`\\b${escapeRegExp(item.name.toLowerCase())}\\b`, "i");
    if (nameRegex.test(normalized)) {
      detectedSlugs.add(item.slug);
      continue;
    }

    // Check aliases
    for (const alias of item.aliases) {
      const aliasRegex = new RegExp(`\\b${escapeRegExp(alias.toLowerCase())}\\b`, "i");
      if (aliasRegex.test(normalized)) {
        detectedSlugs.add(item.slug);
        break;
      }
    }
  }

  return Array.from(detectedSlugs);
}

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function analyzeResumeText(
  text: string,
  targetRole: Role,
  allCourses: Course[]
): ResumeAnalysis {
  const normalized = text.toLowerCase();
  const words = text.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  // 1. Detect sections
  const hasEducation = /(education|academics|university|college|bachelor|master|degree|gpa)/i.test(normalized);
  const hasExperience = /(experience|employment|work history|internship|roles|career)/i.test(normalized);
  const hasProjects = /(projects|portfolio|personal projects|open source|capstone)/i.test(normalized);
  const hasSkills = /(skills|technical skills|proficiencies|technologies|tools|stack)/i.test(normalized);

  // 2. Signals
  const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(text);
  const hasGithubOrLinks = /(github\.com|gitlab\.com|linkedin\.com|https?:\/\/|portfolio)/i.test(text);
  const hasQuantifiedMetrics = /\b\d+(\.\d+)?%|\b\d+x\b|\b\$\d+|\b\d+\s*(users|clients|ms|seconds|fps|stars|downloads|hours)\b/i.test(text);

  let actionVerbsCount = 0;
  for (const verb of ACTION_VERBS) {
    const r = new RegExp(`\\b${verb}\\b`, "gi");
    const matches = text.match(r);
    if (matches) actionVerbsCount += matches.length;
  }

  // 3. Extract skills
  const detectedSkills = extractSkillsFromText(text);
  const detectedSet = new Set(detectedSkills);

  // 4. Score Checklist (Total: 100 points)
  const checklist = [
    {
      item: "Contact Info & Email Provided",
      passed: hasEmail,
      points: 10,
      tip: "Include a professional email address at the top.",
    },
    {
      item: "Portfolio or GitHub Profile Link",
      passed: hasGithubOrLinks,
      points: 15,
      tip: "Link to your GitHub profile or live project demonstrations.",
    },
    {
      item: "Projects Section with Real Applications",
      passed: hasProjects,
      points: 15,
      tip: "Detail 2-3 substantial projects showcasing relevant technologies.",
    },
    {
      item: "Quantified Metrics and Impact (%, numbers, scale)",
      passed: hasQuantifiedMetrics,
      points: 15,
      tip: "Include measurable outcomes (e.g. 'Reduced load times by 35%').",
    },
    {
      item: "Strong Action Verbs in Bullet Points",
      passed: actionVerbsCount >= 3,
      points: 15,
      tip: "Start bullets with strong impact verbs like 'Architected', 'Deployed', or 'Optimized'.",
    },
    {
      item: "Core Technical Skills for Target Role",
      passed: detectedSkills.length >= 4,
      points: 15,
      tip: "Explicitly highlight foundational languages and frameworks.",
    },
    {
      item: "Optimal Resume Length (200-800 words)",
      passed: wordCount >= 180 && wordCount <= 900,
      points: 15,
      tip: "Keep resume concise and focused, ideally 1-page.",
    },
  ];

  const totalScore = checklist.reduce((sum, item) => sum + (item.passed ? item.points : 0), 0);

  // 5. Gaps versus target role
  const gapsVersusRole: string[] = [];
  for (const req of targetRole.requiredSkills) {
    if (!detectedSet.has(req.skill.toLowerCase())) {
      gapsVersusRole.push(req.skill);
    }
  }

  // 6. Suggestions
  const suggestions: string[] = [];
  if (!hasQuantifiedMetrics) {
    suggestions.push("Add at least 2 quantified bullet points to your projects (e.g. 'Improved response latency by 40%').");
  }
  if (!hasGithubOrLinks) {
    suggestions.push("Add links to your active GitHub repositories or live deployed web/Android demos.");
  }
  if (gapsVersusRole.length > 0) {
    const topGaps = gapsVersusRole.slice(0, 3).join(", ");
    suggestions.push(`Close critical skill gaps for ${targetRole.title}: ${topGaps}.`);
  }
  if (actionVerbsCount < 3) {
    suggestions.push("Replace passive language with assertive action verbs ('Engineered', 'Spearheaded', 'Optimized').");
  }

  // 7. Recommended courses for gaps
  const gapSet = new Set(gapsVersusRole);
  const recommendedCourses = allCourses
    .filter((c) => c.skills.some((sk) => gapSet.has(sk)))
    .slice(0, 3);

  return {
    detectedSkills,
    score: totalScore,
    checklist,
    gapsVersusRole,
    suggestions,
    recommendedCourses,
    extractedSections: {
      education: hasEducation,
      experience: hasExperience,
      projects: hasProjects,
      skills: hasSkills,
    },
    signals: {
      hasEmail,
      hasGithubOrLinks,
      hasQuantifiedMetrics,
      wordCount,
      actionVerbsCount,
    },
  };
}
