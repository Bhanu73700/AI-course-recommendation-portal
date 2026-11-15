export interface AssistantIntent {
  id: string;
  keywords: string[];
  patterns?: RegExp[];
  description: string;
}

export const ASSISTANT_INTENTS: AssistantIntent[] = [
  {
    id: "learn_next",
    keywords: ["what should i learn next", "next step", "what next", "where to start", "where should i start", "next skill", "what to study"],
    description: "Determines next recommended skill and courses based on user's current gap.",
  },
  {
    id: "study_plan",
    keywords: ["study plan", "schedule", "hours per week", "plan for", "weeks", "how to study", "weekly routine", "4-week plan", "make me a plan"],
    description: "Generates a structured weekly study plan calibrated to user's available hours.",
  },
  {
    id: "compare_compose_xml",
    keywords: ["compose vs xml", "compare compose", "xml vs compose", "jetpack compose vs xml", "view vs compose", "views or compose"],
    description: "Compares Jetpack Compose with the legacy Android XML view system.",
  },
  {
    id: "compare_react_next",
    keywords: ["react vs next", "next vs react", "next.js vs react", "compare react and next", "should i learn react or next"],
    description: "Compares React SPA vs Next.js full-stack App Router.",
  },
  {
    id: "interview_prep",
    keywords: ["interview", "prep", "job ready", "interview tips", "coding interview", "technical interview", "questions"],
    description: "Provides targeted technical interview prep strategies and portfolio guidance.",
  },
  {
    id: "time_estimate",
    keywords: ["how long", "duration", "how much time", "how many months", "timeline", "when will i be ready", "finish"],
    description: "Calculates realistic time estimate to job-readiness given user's weekly commitment.",
  },
  {
    id: "explain_skill",
    keywords: ["explain", "what is", "tell me about", "define", "concept of"],
    description: "Explains a tech skill clearly with why it matters.",
  },
  {
    id: "recommend_course",
    keywords: ["recommend", "best course", "which course", "good course", "course for", "find course", "free course"],
    description: "Picks the highest scoring course for a specific query.",
  },
  {
    id: "roadmap_info",
    keywords: ["roadmap", "phases", "checkpoints", "path", "curriculum"],
    description: "Explains how the roadmap phases and capstone milestones work.",
  },
];

export const SKILL_EXPLANATIONS: Record<string, string> = {
  kotlin: "Kotlin is a modern, statically typed language that is Google's preferred language for Android. It eliminates null pointer exceptions by default, offers concise syntax with data classes and extension functions, and runs seamlessly on the JVM.",
  "jetpack-compose": "Jetpack Compose is Android's modern declarative UI toolkit. Instead of writing XML layouts and mutating views imperatively, you describe what your UI looks like for a given state using Kotlin functions marked @Composable.",
  coroutines: "Kotlin Coroutines provide structured concurrency for asynchronous code without blocking the main thread. Combined with Flow, they allow you to stream and transform reactive data asynchronously with clean imperative-looking code.",
  react: "React is a component-based JavaScript library for building user interfaces. It uses a virtual DOM, declarative state management with hooks (useState, useEffect), and JSX syntax to render responsive UI trees.",
  nextjs: "Next.js is a full-stack React framework featuring the App Router, React Server Components (RSC), automatic code splitting, optimized image loading, and Server Actions for database mutations without boilerplate APIs.",
  typescript: "TypeScript adds optional static typing to JavaScript. It catches errors at compile time, provides rich IDE autocomplete, and helps teams safely maintain large, complex codebases.",
  "room-db": "Room is Android's official SQLite object-mapping abstraction library. It validates SQL queries at compile time, minimizes boilerplate, and returns reactive Kotlin Flow streams directly from database tables.",
  prisma: "Prisma is a modern next-generation Node.js and TypeScript ORM. It provides declarative schema modeling, automated migrations, and an auto-generated type-safe database client for PostgreSQL and MySQL.",
  tailwind: "Tailwind CSS is a utility-first CSS framework that lets you build modern designs directly in your markup using composable utility classes like flex, pt-4, and rounded-xl without writing custom CSS files.",
};

export const QUICK_REPLIES_DEFAULT = [
  "What should I learn next?",
  "Make me a 4-week study plan",
  "Compare Compose vs XML",
  "How long will it take to get job-ready?",
  "Technical interview prep tips",
];
