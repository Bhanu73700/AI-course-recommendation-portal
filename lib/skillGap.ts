import { Course, Role, SkillGapAnalysis, SkillGapItem } from "@/types";
import { getSkillBySlug } from "@/data/skills";

export function analyzeSkillGap(
  knownSkills: string[],
  role: Role,
  allCourses: Course[]
): SkillGapAnalysis {
  const knownSet = new Set(knownSkills.map((s) => s.toLowerCase()));

  const have: SkillGapItem[] = [];
  const partially: SkillGapItem[] = [];
  const missing: SkillGapItem[] = [];

  let totalRequiredWeight = 0;
  let coveredWeight = 0;

  for (const req of role.requiredSkills) {
    const slug = req.skill.toLowerCase();
    const skillMeta = getSkillBySlug(slug);
    const skillName = skillMeta ? skillMeta.name : req.skill;
    totalRequiredWeight += req.weight;

    // Determine priority by weight
    let priority: "High" | "Medium" | "Low" = "Low";
    if (req.weight >= 9) priority = "High";
    else if (req.weight >= 7) priority = "Medium";

    // Find top 2 courses teaching this skill
    const matchingCourses = allCourses
      .filter((c) => c.skills.map((s) => s.toLowerCase()).includes(slug))
      .sort((a, b) => {
        // Sort by rating & rating count
        return b.rating * Math.log10(b.ratingCount + 10) - a.rating * Math.log10(a.ratingCount + 10);
      })
      .slice(0, 2);

    const isKnown = knownSet.has(slug);

    if (isKnown) {
      coveredWeight += req.weight;
      have.push({
        skill: slug,
        name: skillName,
        status: "have",
        weight: req.weight,
        level: req.level,
        priority,
        topCourses: matchingCourses,
      });
    } else {
      // Check if partially known via aliases or related prereqs
      const hasRelated = skillMeta?.aliases.some((a) => knownSet.has(a.toLowerCase()));
      if (hasRelated) {
        coveredWeight += req.weight * 0.5;
        partially.push({
          skill: slug,
          name: skillName,
          status: "partially",
          weight: req.weight,
          level: req.level,
          priority,
          topCourses: matchingCourses,
        });
      } else {
        missing.push({
          skill: slug,
          name: skillName,
          status: "missing",
          weight: req.weight,
          level: req.level,
          priority,
          topCourses: matchingCourses,
        });
      }
    }
  }

  // Sort missing skills by priority (High first) then weight descending
  missing.sort((a, b) => b.weight - a.weight);
  partially.sort((a, b) => b.weight - a.weight);
  have.sort((a, b) => b.weight - a.weight);

  const readinessPercent = totalRequiredWeight > 0
    ? Math.min(100, Math.round((coveredWeight / totalRequiredWeight) * 100))
    : 100;

  return {
    role,
    readinessPercent,
    have,
    partially,
    missing,
    totalRequiredWeight,
    coveredWeight,
  };
}
