import { Assessment, Course, Recommendation, Role, ScoreBreakdown } from "@/types";

const LEVEL_ORDER: Record<string, number> = {
  Beginner: 1,
  Intermediate: 2,
  Advanced: 3,
};

// Global prior rating for Bayesian calculation (mean rating ~4.8, min votes 500)
const C_PRIOR_RATING = 4.8;
const M_PRIOR_COUNT = 500;

export function calculateBayesianRating(rating: number, count: number): number {
  return (count / (count + M_PRIOR_COUNT)) * rating + (M_PRIOR_COUNT / (count + M_PRIOR_COUNT)) * C_PRIOR_RATING;
}

export function recommend(
  assessment: Assessment,
  courses: Course[],
  role: Role
): Recommendation[] {
  const knownSet = new Set(assessment.knownSkills.map((s) => s.toLowerCase()));

  // 1. Identify missing skills with their weights
  const missingSkills = role.requiredSkills.filter(
    (rs) => !knownSet.has(rs.skill.toLowerCase())
  );
  const totalGapWeight = missingSkills.reduce((acc, rs) => acc + rs.weight, 0);

  // Map of gap skill -> weight
  const gapWeightMap = new Map<string, number>();
  for (const ms of missingSkills) {
    gapWeightMap.set(ms.skill.toLowerCase(), ms.weight);
  }

  // Helper: check if a course is cross-track relevant (e.g. Git, CS fundamentals)
  const isCrossTrackAllowed = (course: Course): boolean => {
    return course.skills.includes("git") || course.id === "web-05" || course.id === "web-19";
  };

  const scoredRecommendations: Recommendation[] = [];

  for (const course of courses) {
    // ----------------------------------------------------
    // Hard filters
    // ----------------------------------------------------
    const isMatchingTrack =
      course.track === assessment.track ||
      assessment.extraTracks?.includes(course.track) ||
      isCrossTrackAllowed(course);

    if (!isMatchingTrack) {
      continue;
    }

    // Budget hard filter: drop if budgetUSD === 0 and course price > 0
    if (assessment.budgetUSD === 0 && course.priceUSD > 0) {
      continue;
    }

    const reasons: string[] = [];
    const warnings: string[] = [];

    // Check which gap skills this course fills
    const filledGapSkills = course.skills.filter((sk) =>
      gapWeightMap.has(sk.toLowerCase())
    );

    // ----------------------------------------------------
    // Component 1: Skill-Gap Coverage (Weight: 35)
    // ----------------------------------------------------
    let skillGapScore = 0;
    if (totalGapWeight > 0) {
      const coveredWeight = filledGapSkills.reduce(
        (sum, sk) => sum + (gapWeightMap.get(sk.toLowerCase()) || 0),
        0
      );
      // Coverage fraction with smooth diminishing returns
      const fraction = Math.min(1, coveredWeight / totalGapWeight);
      // Diminishing returns curve: sqrt(fraction)
      skillGapScore = Math.round(35 * Math.sqrt(fraction));
    } else {
      // If user already has all required skills, reward any skills taught
      skillGapScore = course.skills.length > 0 ? 25 : 10;
    }

    if (filledGapSkills.length > 0) {
      const formattedSkills = filledGapSkills.slice(0, 4).join(", ");
      reasons.push(
        `Covers ${filledGapSkills.length} of your missing target skills: ${formattedSkills}${
          filledGapSkills.length > 4 ? "..." : ""
        }.`
      );
    }

    // ----------------------------------------------------
    // Component 2: Level Fit (Weight: 15)
    // ----------------------------------------------------
    const userLevelVal = LEVEL_ORDER[assessment.currentLevel] || 1;
    const courseLevelVal = LEVEL_ORDER[course.level] || 1;
    const levelDiff = Math.abs(userLevelVal - courseLevelVal);

    let levelMultiplier = 1.0;
    if (levelDiff === 1) levelMultiplier = 0.6;
    else if (levelDiff >= 2) levelMultiplier = 0.2;

    // Check unmet prerequisites
    const unmetPrereqs = course.prerequisites.filter(
      (prereq) => !knownSet.has(prereq.toLowerCase())
    );

    let prereqPenalty = 0;
    if (unmetPrereqs.length > 0) {
      levelMultiplier *= 0.2; // heavy penalty for unmet prerequisites
      prereqPenalty = unmetPrereqs.length * 15;
      for (const up of unmetPrereqs) {
        warnings.push(`Missing prerequisite: ${up}. Requires ${up}, which isn't in your skills yet. Take ${up} basics first.`);
      }
    } else {
      if (course.level === assessment.currentLevel) {
        reasons.push(`Directly matches your ${course.level} proficiency level with all prerequisites met.`);
      }
    }

    const levelScore = Math.round(15 * levelMultiplier);

    // ----------------------------------------------------
    // Component 3: Career Goal Alignment (Weight: 15)
    // ----------------------------------------------------
    let goalScore = 0;
    const matchesGoal =
      course.careerTags.includes(assessment.careerGoal) ||
      course.careerTags.includes(role.id);

    if (matchesGoal) {
      goalScore += 11;
      reasons.push(`Tailored specifically for the ${role.title} career roadmap.`);
    }

    const matchesInterest =
      assessment.interests && assessment.interests.includes(course.subGroup);
    if (matchesInterest) {
      goalScore += 4;
      reasons.push(`Focuses on your chosen interest area: ${course.subGroup}.`);
    }
    goalScore = Math.min(15, goalScore);

    // ----------------------------------------------------
    // Component 4: Budget Fit (Weight: 10)
    // ----------------------------------------------------
    let budgetScore = 0;
    if (course.priceUSD === 0) {
      budgetScore = 10;
      reasons.push("100% Free course material.");
    } else if (assessment.budgetUSD > 0 && course.priceUSD <= assessment.budgetUSD) {
      const budgetFrac = 1 - course.priceUSD / (assessment.budgetUSD * 1.5);
      budgetScore = Math.max(4, Math.round(10 * Math.min(1, budgetFrac)));
      reasons.push(`Priced at $${course.priceUSD}, well within your $${assessment.budgetUSD} budget.`);
    } else {
      budgetScore = 0;
      warnings.push(`Costs $${course.priceUSD}, which exceeds your current budget.`);
    }

    // ----------------------------------------------------
    // Component 5: Time Fit (Weight: 10)
    // ----------------------------------------------------
    let timeScore = 8;
    const weeklyHours = Math.max(1, assessment.hoursPerWeek);
    const estimatedWeeks = Math.ceil(course.durationHours / weeklyHours);

    if (assessment.deadlineWeeks && assessment.deadlineWeeks > 0) {
      if (estimatedWeeks <= assessment.deadlineWeeks) {
        timeScore = 10;
        reasons.push(`Finish in ≈${estimatedWeeks} weeks at ${weeklyHours} hrs/week (fits deadline of ${assessment.deadlineWeeks}w).`);
      } else {
        const overtimeRatio = estimatedWeeks / assessment.deadlineWeeks;
        timeScore = Math.max(1, Math.round(10 / overtimeRatio));
        warnings.push(`May require ${estimatedWeeks} weeks to complete at ${weeklyHours} hrs/week.`);
      }
    } else {
      // Reward realistic durations
      timeScore = course.durationHours <= 60 ? 10 : 8;
      reasons.push(`Takes approximately ${estimatedWeeks} weeks at ${weeklyHours} hrs/week.`);
    }

    // ----------------------------------------------------
    // Component 6: Format Preference (Weight: 5)
    // ----------------------------------------------------
    let formatScore = 2;
    if (assessment.preferredFormats && assessment.preferredFormats.includes(course.format)) {
      formatScore = 5;
      reasons.push(`Delivered in your preferred ${course.format} format.`);
    }

    // ----------------------------------------------------
    // Component 7: Quality & Credibility (Weight: 10)
    // ----------------------------------------------------
    const bayesianRating = calculateBayesianRating(course.rating, course.ratingCount);
    // Rating 4.0-5.0 mapped to 0-5 pts
    const ratingScore = Math.max(0, Math.min(5, (bayesianRating - 4.0) * 5));

    let projectScore = Math.min(3, (course.projectsCount || 0) * 0.6);
    let certBonus = 0;
    if (assessment.wantsCertificate && course.hasCertificate) {
      certBonus = 2;
    } else if (!assessment.wantsCertificate) {
      certBonus = 1;
    }

    const qualityScore = Math.min(10, Math.round(ratingScore + projectScore + certBonus));

    // Aggregate breakdown
    const breakdown: ScoreBreakdown = {
      skillGap: skillGapScore,
      level: levelScore,
      goal: goalScore,
      budget: budgetScore,
      time: timeScore,
      format: formatScore,
      quality: qualityScore,
    };

    const totalScore = Math.min(
      100,
      Math.max(
        0,
        skillGapScore +
          levelScore +
          goalScore +
          budgetScore +
          timeScore +
          formatScore +
          qualityScore -
          prereqPenalty
      )
    );

    // Limit reasons to 2-4 most impactful lines
    const finalReasons = reasons.slice(0, 4);

    scoredRecommendations.push({
      course,
      score: totalScore,
      breakdown,
      reasons: finalReasons,
      warnings,
      fillsSkills: filledGapSkills,
    });
  }

  // 4. Sort descending: Score -> Quality -> Shorter duration
  scoredRecommendations.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (b.breakdown.quality !== a.breakdown.quality) return b.breakdown.quality - a.breakdown.quality;
    return a.course.durationHours - b.course.durationHours;
  });

  // 7. Diversity pass: don't let one provider or sub-group take more than 3 of the top 8
  const diversified: Recommendation[] = [];
  const top8 = scoredRecommendations.slice(0, 8);
  const remaining = scoredRecommendations.slice(8);

  const providerCounts = new Map<string, number>();
  const subGroupCounts = new Map<string, number>();

  for (const rec of top8) {
    const p = rec.course.provider;
    const sg = rec.course.subGroup;
    const pCount = providerCounts.get(p) || 0;
    const sgCount = subGroupCounts.get(sg) || 0;

    if (pCount < 3 && sgCount < 3) {
      providerCounts.set(p, pCount + 1);
      subGroupCounts.set(sg, sgCount + 1);
      diversified.push(rec);
    } else {
      // Re-queue
      remaining.push(rec);
    }
  }

  // Fill in back up to original length
  for (const rem of remaining) {
    if (!diversified.some((d) => d.course.id === rem.course.id)) {
      diversified.push(rem);
    }
  }

  return diversified;
}
