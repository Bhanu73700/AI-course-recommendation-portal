import { Assessment, Course, Role } from "@/types";
import { ASSISTANT_INTENTS, QUICK_REPLIES_DEFAULT, SKILL_EXPLANATIONS } from "@/data/assistantKB";
import { analyzeSkillGap } from "./skillGap";
import { getScaledRoadmap } from "./roadmap";

export interface AssistantContext {
  assessment: Assessment | null;
  knownSkills: string[];
  role: Role | null;
  allCourses: Course[];
}

export interface AssistantResponse {
  text: string;
  suggestedCourses?: Course[];
  quickReplies?: string[];
}

/**
 * getAssistantReply - Transparent deterministic rule-based intent engine.
 *
 * NOTE FOR FUTURE LLM UPGRADE:
 * To swap in a live LLM (e.g. Google Gemini 1.5 Pro / Flash or Claude 3.5 Sonnet),
 * replace this function body with a fetch to your backend route (e.g. `/api/chat`)
 * passing the user prompt and serialized `context`. Keep this same signature.
 */
export async function getAssistantReply(
  userMessage: string,
  context: AssistantContext
): Promise<AssistantResponse> {
  const query = userMessage.toLowerCase().trim();

  // 1. Check for specific skill explanation
  for (const [skillKey, explanation] of Object.entries(SKILL_EXPLANATIONS)) {
    if (query.includes(skillKey) && (query.includes("what is") || query.includes("explain") || query.includes("tell me about") || query.includes("definition"))) {
      const relatedCourses = context.allCourses
        .filter((c) => c.skills.includes(skillKey))
        .slice(0, 2);

      return {
        text: `**${skillKey.toUpperCase()}**: ${explanation}\n\nHere are top rated courses teaching this skill:`,
        suggestedCourses: relatedCourses,
        quickReplies: ["What should I learn next?", "Make me a 4-week study plan"],
      };
    }
  }

  // 2. Classify intent
  let matchedIntent = "fallback";
  for (const intent of ASSISTANT_INTENTS) {
    if (intent.keywords.some((kw) => query.includes(kw))) {
      matchedIntent = intent.id;
      break;
    }
  }

  // Handle Intents:

  if (matchedIntent === "learn_next") {
    if (!context.role) {
      return {
        text: "You haven't selected a career goal yet! Please take the 2-minute onboarding assessment so I can analyze your exact skill gap.",
        quickReplies: ["Start Onboarding Assessment", "Browse all courses"],
      };
    }

    const gap = analyzeSkillGap(context.knownSkills, context.role, context.allCourses);

    if (gap.missing.length === 0) {
      return {
        text: `🎉 Impressive! You've already covered all required core skills for **${context.role.title}** (100% readiness)! Your next step is to polish your capstone projects, write tests, and prep for technical interviews.`,
        quickReplies: ["Technical interview prep tips", "Review my resume"],
      };
    }

    const topMissing = gap.missing[0];
    const coursesForMissing = topMissing.topCourses;

    return {
      text: `Based on your target role as **${context.role.title}**, your highest priority gap is **${topMissing.name}** (Weight: ${topMissing.weight}/10).\n\nClosing this gap will boost your readiness score from ${gap.readinessPercent}% towards job qualification. Here are the top courses to tackle next:`,
      suggestedCourses: coursesForMissing,
      quickReplies: ["Make me a 4-week study plan", "How long will this take?", "Compare Compose vs XML"],
    };
  }

  if (matchedIntent === "study_plan") {
    const weeklyHours = context.assessment?.hoursPerWeek || 10;
    const roleTitle = context.role?.title || "Software Developer";

    return {
      text: `Here is a calibrated **4-Week Study Plan** for **${roleTitle}** at **${weeklyHours} hours/week**:\n\n` +
        `• **Week 1 (Foundations & Environment)**: Set up development tools, master core language syntax, and complete fundamental exercises (~${weeklyHours} hrs).\n` +
        `• **Week 2 (Core Framework & State)**: Build foundational interactive components, understand state hoisting and unidirectional flow.\n` +
        `• **Week 3 (Data & Architecture)**: Connect to REST APIs or local persistence (Room/Prisma) with clean architecture separation.\n` +
        `• **Week 4 (Capstone Project)**: Build, test, and document an end-to-end portfolio project with a clean GitHub README.\n\n` +
        `Consistency beats intensity: study in focused 90-minute blocks with deliberate practice.`,
      quickReplies: ["What should I learn next?", "How long will this take?"],
    };
  }

  if (matchedIntent === "compare_compose_xml") {
    return {
      text: `### Jetpack Compose vs. XML Views\n\n` +
        `| Feature | Jetpack Compose (Modern) | XML Layouts (Legacy) |\n` +
        `| :--- | :--- | :--- |\n` +
        `| **Paradigm** | Declarative (Kotlin only) | Imperative (XML + Kotlin/Java) |\n` +
        `| **State** | Unidirectional Data Flow | Manual findViewById / ViewBinding |\n` +
        `| **Boilerplate** | Low (no XML, no adapters) | High (RecyclerView Adapters, XML attrs) |\n` +
        `| **Recommendation** | **Learn Compose first**. Google and new apps are 100% Compose. Learn basic XML later to read legacy code. |`,
      quickReplies: ["What should I learn next?", "Make me a 4-week study plan"],
    };
  }

  if (matchedIntent === "compare_react_next") {
    return {
      text: `### React vs. Next.js\n\n` +
        `• **React** is a client-side component library. Great for dashboards, SPAs, and understanding DOM state.\n` +
        `• **Next.js** is a full-stack framework on top of React featuring the App Router, React Server Components (RSC), built-in routing, SEO optimization, and Server Actions.\n\n` +
        `**Recommendation**: If you are a beginner, learn React component fundamentals first, then transition into Next.js for full-stack production apps.`,
      quickReplies: ["Recommend a Next.js course", "What should I learn next?"],
    };
  }

  if (matchedIntent === "interview_prep") {
    const roleTitle = context.role?.title || "Developer";
    return {
      text: `### 🎯 Technical Interview Strategy for ${roleTitle}\n\n` +
        `1. **System & Architecture**: Be ready to explain MVVM/Clean Architecture or React unidirectional data flow on a whiteboard.\n` +
        `2. **Deep Dives**: Expect questions on asynchronous handling (Coroutines vs RxJava in Android, or Event Loop & Promises in JS).\n` +
        `3. **Portfolio Defense**: Interviewers will grill your project code. Be ready to explain *why* you chose your libraries and how you handled edge cases or errors.\n` +
        `4. **STAR Method**: Frame non-technical questions around Situation, Task, Action, and Quantified Result.`,
      quickReplies: ["Review my resume", "What should I learn next?"],
    };
  }

  if (matchedIntent === "time_estimate") {
    const weeklyHours = context.assessment?.hoursPerWeek || 10;
    const roleTitle = context.role?.title || "Junior Developer";
    const roadmap = getScaledRoadmap(context.role?.id || "android-developer-junior", roleTitle, weeklyHours);

    return {
      text: `At **${weeklyHours} hours per week**, your estimated roadmap to reach job readiness as a **${roleTitle}** is **≈${roadmap.totalWeeks} weeks** (projected target date: **${roadmap.projectedCompletionDate}**).\n\nIf you increase your commitment to ${Math.min(40, weeklyHours + 5)} hours/week, you can shorten this timeline by ~${Math.round(roadmap.totalWeeks * 0.3)} weeks.`,
      quickReplies: ["What should I learn next?", "Make me a 4-week study plan"],
    };
  }

  if (matchedIntent === "recommend_course") {
    const topPicks = context.allCourses
      .filter((c) => !context.assessment?.track || c.track === context.assessment.track)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 3);

    return {
      text: `Here are the top-rated courses in your track:`,
      suggestedCourses: topPicks,
      quickReplies: ["What should I learn next?", "Make me a 4-week study plan"],
    };
  }

  if (matchedIntent === "roadmap_info") {
    return {
      text: `The CourseAI Roadmap breaks your career transition into sequential milestones: Foundations → Practical Application → Architecture & Data → Capstone & Launch.\n\nEach phase has actionable checkpoints you can tick off to calculate real completion percentage.`,
      quickReplies: ["How long will this take?", "What should I learn next?"],
    };
  }

  // Fallback response with helpful hints
  return {
    text: `I'm CourseAI's rule-based assistant! I can help you analyze your skill gaps, generate calibrated study plans, explain technical skills, compare frameworks, and estimate your time to job-readiness.\n\nTry asking me one of the quick questions below:`,
    quickReplies: QUICK_REPLIES_DEFAULT,
  };
}
