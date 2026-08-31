
import { courses, Course } from "@/data/courses";

export type Profile = {
  goal: string;
  skills: string[];
  interests: string[];
  level?: string;
  hoursPerDay?: number;
  budget?: number;
};

export type Recommendation = Course & {
  score: number;
  reason: string;
};

const norm = (value: string = "") =>
  value.toLowerCase().trim();

export function scoreCourse(
  course: Course,
  profile: Profile
): number {
  const courseSkills = (course.skills || []).map(norm);
  const courseCareers = (course.career_paths || []).map(norm);

  const userSkills = Array.isArray(profile.skills)
    ? profile.skills
    : [];

  const interests = Array.isArray(profile.interests)
    ? profile.interests
    : [];

  const goal = norm(profile.goal || "");

  // Skill match
  const skillMatch =
    userSkills.length > 0
      ? userSkills.filter((skill) =>
          courseSkills.includes(norm(skill))
        ).length / userSkills.length
      : 0;

  // Career goal match
  let careerMatch = 0;

  if (goal) {
    if (
      courseCareers.some(
        (career) =>
          career.includes(goal) ||
          goal.includes(career)
      )
    ) {
      careerMatch = 1;
    } else if (
      goal.includes("developer") &&
      courseCareers.some((career) =>
        career.includes("developer")
      )
    ) {
      careerMatch = 0.45;
    }
  }

  // Interest match
  let interestMatch = 0;

  if (interests.length > 0) {
    interestMatch =
      interests.some((interest) => {
        const i = norm(interest);

        return (
          norm(course.category).includes(i) ||
          courseSkills.some((skill) =>
            skill.includes(i)
          )
        );
      })
        ? 1
        : 0;
  }

  // Level match
  const levelMatch =
    profile.level &&
    norm(profile.level) === norm(course.level)
      ? 1
      : 0;

  // Budget match
  const budgetMatch =
    profile.budget !== undefined &&
    course.price <= profile.budget
      ? 1
      : 0;

  const finalScore =
    careerMatch * 0.45 +
    skillMatch * 0.25 +
    interestMatch * 0.15 +
    levelMatch * 0.10 +
    budgetMatch * 0.05;

  return Math.round(finalScore * 100);
}

export function recommend(
  profile: Profile
): Recommendation[] {
  const safeProfile: Profile = {
    goal: profile?.goal || "",
    skills: Array.isArray(profile?.skills)
      ? profile.skills
      : [],
    interests: Array.isArray(profile?.interests)
      ? profile.interests
      : [],
    level: profile?.level || "",
    hoursPerDay: profile?.hoursPerDay || 0,
    budget: profile?.budget
  };

  return courses
    .map((course) => {
      const score = scoreCourse(
        course,
        safeProfile
      );

      let reason =
        "Recommended based on your learning profile.";

      if (score >= 70) {
        reason =
          "Strong match for your career goal and current skills.";
      } else if (score >= 40) {
        reason =
          "Good match based on your career goal and interests.";
      } else {
        reason =
          "Useful course for building skills toward your career goal.";
      }

      return {
        ...course,
        score,
        reason
      };
    })
    .sort((a, b) => b.score - a.score);
}

export function skillGap(
  goal: string,
  userSkills: string[] = []
) {
  const requiredSkills: Record<string, string[]> = {
    "Full Stack Developer": [
      "HTML",
      "CSS",
      "JavaScript",
      "React",
      "Node.js",
      "Express",
      "MongoDB",
      "Git"
    ],

    "Backend Developer": [
      "JavaScript",
      "Node.js",
      "Express",
      "REST API",
      "MongoDB",
      "SQL",
      "Git",
      "Docker"
    ],

    "Frontend Developer": [
      "HTML",
      "CSS",
      "JavaScript",
      "React",
      "TypeScript",
      "Git"
    ],

    "Data Scientist": [
      "Python",
      "SQL",
      "Statistics",
      "Pandas",
      "NumPy",
      "Machine Learning"
    ],

    "Machine Learning Engineer": [
      "Python",
      "NumPy",
      "Pandas",
      "Scikit-learn",
      "Machine Learning",
      "Deep Learning",
      "TensorFlow"
    ],

    "Cloud Engineer": [
      "Linux",
      "Networking",
      "AWS",
      "Docker",
      "Kubernetes",
      "Git"
    ],

    "DevOps Engineer": [
      "Linux",
      "Git",
      "Docker",
      "Kubernetes",
      "CI/CD",
      "AWS"
    ]
  };

  const required =
    requiredSkills[goal] ||
    requiredSkills["Full Stack Developer"];

  const normalizedUserSkills =
    Array.isArray(userSkills)
      ? userSkills.map(norm)
      : [];

  return required.map((skill) => ({
    skill,
    hasSkill: normalizedUserSkills.includes(
      norm(skill)
    ),
    level: normalizedUserSkills.includes(
      norm(skill)
    )
      ? "Strong"
      : "Missing"
  }));
}

export function roadmap(goal: string): string[] {
  const roadmaps: Record<string, string[]> = {
    "Full Stack Developer": [
      "HTML & CSS",
      "JavaScript",
      "Git & GitHub",
      "React",
      "Node.js & Express",
      "Databases",
      "REST APIs",
      "Authentication",
      "Deployment",
      "Build full-stack projects"
    ],

    "Backend Developer": [
      "Programming fundamentals",
      "JavaScript / Python / Java",
      "Data Structures & Algorithms",
      "Node.js & Express",
      "REST APIs",
      "SQL & MongoDB",
      "Authentication",
      "Docker",
      "Cloud deployment",
      "Build backend projects"
    ],

    "Frontend Developer": [
      "HTML",
      "CSS",
      "JavaScript",
      "Git & GitHub",
      "React",
      "TypeScript",
      "State management",
      "API integration",
      "Testing",
      "Build portfolio projects"
    ],

    "Data Scientist": [
      "Python",
      "NumPy",
      "Pandas",
      "Statistics",
      "SQL",
      "Data Visualization",
      "Machine Learning",
      "Model Evaluation",
      "Projects",
      "Portfolio & interview preparation"
    ],

    "Machine Learning Engineer": [
      "Python",
      "Mathematics & Statistics",
      "NumPy & Pandas",
      "Machine Learning",
      "Scikit-learn",
      "Deep Learning",
      "TensorFlow / PyTorch",
      "MLOps",
      "Cloud",
      "Deploy ML projects"
    ],

    "Cloud Engineer": [
      "Linux",
      "Networking",
      "Git",
      "AWS Fundamentals",
      "Cloud Architecture",
      "Docker",
      "Kubernetes",
      "CI/CD",
      "Infrastructure as Code",
      "Cloud projects"
    ]
  };

  return (
    roadmaps[goal] ||
    roadmaps["Full Stack Developer"]
  );
}

