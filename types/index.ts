export type TrackId =
  | "web"
  | "android"
  | "data-ai"
  | "cybersecurity"
  | "cloud-devops"
  | "design"
  | "cross-platform";

export type Level = "Beginner" | "Intermediate" | "Advanced";
export type Format = "Video" | "Interactive" | "Text" | "Bootcamp" | "Project-based";

export interface Course {
  id: string;
  title: string;
  provider: string;            // e.g. freeCodeCamp, Coursera, Udemy, Google, Meta, YouTube, Udacity
  track: TrackId;
  subGroup: string;            // e.g. "Jetpack Compose"
  level: Level;
  format: Format;
  skills: string[];            // skills taught (lowercase slugs)
  prerequisites: string[];     // skill slugs
  durationHours: number;
  priceUSD: number;            // 0 = free
  rating: number;              // 0-5
  ratingCount: number;
  language: string;
  hasCertificate: boolean;
  projectsCount: number;
  description: string;
  outcomes: string[];          // what you will be able to do
  careerTags: string[];        // role ids this course supports
  url: string;                 // provider's homepage or search URL, never an invented deep link
  updatedYear: number;
}

export interface Assessment {
  track: TrackId;
  extraTracks: TrackId[];
  careerGoal: string;          // role id, e.g. "frontend-developer"
  currentLevel: Level;
  knownSkills: string[];
  interests: string[];         // sub-groups or topics
  hoursPerWeek: number;        // 1-40
  budgetUSD: number;           // 0 = free only
  preferredFormats: Format[];
  deadlineWeeks?: number;
  wantsCertificate: boolean;
}

export interface Role {
  id: string;
  title: string;
  track: TrackId;
  summary: string;
  requiredSkills: { skill: string; weight: number; level: 1 | 2 | 3 }[];
  niceToHave: string[];
  avgSalaryRangeUSD?: [number, number];   // mark as illustrative in the UI
}

export interface ScoreBreakdown {
  skillGap: number;
  level: number;
  goal: number;
  budget: number;
  time: number;
  format: number;
  quality: number;
}

export interface Recommendation {
  course: Course;
  score: number;               // 0-100
  breakdown: ScoreBreakdown;
  reasons: string[];           // human-readable explanation lines
  warnings: string[];          // e.g. "Over your budget", "Missing prerequisite: kotlin"
  fillsSkills: string[];       // gap skills this course covers
}

export interface ProgressEntry {
  courseId: string;
  status: "saved" | "in-progress" | "completed";
  percent: number;
  startedAt?: string;
  completedAt?: string;
  notes?: string;
  hoursLogged: number;
}

export interface RoadmapPhase {
  id: string;
  title: string;
  goal: string;
  durationWeeks: number;
  skills: string[];
  courseIds: string[];
  project: { title: string; description: string };
  checkpoints: string[];
}

export interface SkillItem {
  slug: string;
  name: string;
  category: string;
  track?: TrackId;
  aliases: string[];
  description?: string;
}

export interface TrackMeta {
  id: TrackId;
  name: string;
  iconName: string;
  description: string;
  subGroups: string[];
}

export interface SkillGapItem {
  skill: string;
  name: string;
  status: "have" | "partially" | "missing";
  weight: number;
  level: 1 | 2 | 3;
  priority: "High" | "Medium" | "Low";
  topCourses: Course[];
}

export interface SkillGapAnalysis {
  role: Role;
  readinessPercent: number;
  have: SkillGapItem[];
  partially: SkillGapItem[];
  missing: SkillGapItem[];
  totalRequiredWeight: number;
  coveredWeight: number;
}

export interface ResumeAnalysis {
  detectedSkills: string[];
  score: number;
  checklist: { item: string; passed: boolean; tip: string; points: number }[];
  gapsVersusRole: string[];
  suggestions: string[];
  recommendedCourses: Course[];
  extractedSections: {
    education: boolean;
    experience: boolean;
    projects: boolean;
    skills: boolean;
  };
  signals: {
    hasEmail: boolean;
    hasGithubOrLinks: boolean;
    hasQuantifiedMetrics: boolean;
    wordCount: number;
    actionVerbsCount: number;
  };
}

export interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
  suggestedCourses?: Course[];
  quickReplies?: string[];
}
