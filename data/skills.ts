import { SkillItem, TrackMeta, TrackId } from "@/types";

export const TRACKS: TrackMeta[] = [
  {
    id: "web",
    name: "Web Development",
    iconName: "Globe",
    description: "Modern frontend, backend, full-stack web applications with React, Next.js, Node, and TypeScript.",
    subGroups: [
      "HTML/CSS Foundations",
      "JavaScript",
      "React & Next.js",
      "Node & APIs",
      "Databases",
      "Full-Stack Projects",
      "Testing & Deployment",
    ],
  },
  {
    id: "android",
    name: "Android Development",
    iconName: "Smartphone",
    description: "Native modern Android apps with Kotlin, Jetpack Compose, Clean Architecture, and Coroutines.",
    subGroups: [
      "Kotlin Basics",
      "Android Fundamentals",
      "Jetpack Compose",
      "Architecture (MVVM, Hilt, Room)",
      "Networking & Data",
      "Publishing to Play Store",
    ],
  },
  {
    id: "data-ai",
    name: "Data Science & AI/ML",
    iconName: "BrainCircuit",
    description: "Machine learning, data analysis, deep learning, PyTorch, and generative AI models.",
    subGroups: ["Python & Math", "Data Analysis", "Machine Learning", "Deep Learning & LLMs"],
  },
  {
    id: "cybersecurity",
    name: "Cybersecurity",
    iconName: "ShieldAlert",
    description: "Network security, ethical hacking, SOC operations, defensive security, and penetration testing.",
    subGroups: ["Network Fundamentals", "Linux & Scripting", "Ethical Hacking", "Security Operations"],
  },
  {
    id: "cloud-devops",
    name: "Cloud & DevOps",
    iconName: "Cloud",
    description: "Cloud computing (AWS/GCP), CI/CD automation, Docker, Kubernetes, and Infrastructure as Code.",
    subGroups: ["Cloud Basics", "Containers & Docker", "CI/CD & GitOps", "Kubernetes & Terraform"],
  },
  {
    id: "design",
    name: "UI/UX & Product Design",
    iconName: "Palette",
    description: "User research, wireframing, Figma design systems, prototyping, and modern interaction design.",
    subGroups: ["Design Thinking", "Figma & Wireframing", "Design Systems", "Usability & Research"],
  },
  {
    id: "cross-platform",
    name: "Mobile Cross-Platform",
    iconName: "Layers",
    description: "Cross-platform mobile apps using Flutter & Dart or React Native.",
    subGroups: ["Flutter & Dart", "React Native", "State Management", "Mobile APIs & Release"],
  },
];

export const SKILLS_MASTER: SkillItem[] = [
  // Web - Foundations
  { slug: "html", name: "HTML5", category: "Web Foundations", track: "web", aliases: ["html5", "semantic html", "web markup"] },
  { slug: "css", name: "CSS3", category: "Web Foundations", track: "web", aliases: ["css3", "stylesheets", "flexbox", "grid", "responsive design"] },
  { slug: "javascript", name: "JavaScript", category: "Web Foundations", track: "web", aliases: ["js", "es6", "es2022", "ecmascript", "vanilla js"] },
  { slug: "typescript", name: "TypeScript", category: "Languages", track: "web", aliases: ["ts", "typescript lang", "static typing"] },
  { slug: "git", name: "Git & GitHub", category: "Tools", track: "web", aliases: ["git", "github", "version control", "gitlab"] },

  // Web - Frontend
  { slug: "react", name: "React", category: "Frontend Frameworks", track: "web", aliases: ["reactjs", "react.js", "react hooks", "create-react-app"] },
  { slug: "nextjs", name: "Next.js", category: "Frontend Frameworks", track: "web", aliases: ["next.js", "nextjs 14", "next", "app router", "server components"] },
  { slug: "tailwind", name: "Tailwind CSS", category: "Styling", track: "web", aliases: ["tailwindcss", "utility css"] },
  { slug: "dom", name: "DOM Manipulation & Web APIs", category: "Web Foundations", track: "web", aliases: ["dom", "browser apis", "fetch api"] },
  { slug: "accessibility", name: "Web Accessibility (a11y)", category: "Quality", track: "web", aliases: ["a11y", "wcag", "aria", "web accessibility"] },
  { slug: "web-performance", name: "Web Performance & Core Vitals", category: "Quality", track: "web", aliases: ["cwv", "lighthouse", "bundle optimization", "perf"] },

  // Web - Backend & DB
  { slug: "nodejs", name: "Node.js", category: "Backend", track: "web", aliases: ["node", "nodejs runtime", "server js"] },
  { slug: "express", name: "Express.js", category: "Backend", track: "web", aliases: ["express", "expressjs", "rest api with express"] },
  { slug: "rest-apis", name: "REST APIs", category: "Backend", track: "web", aliases: ["rest", "restful api", "api design", "json api"] },
  { slug: "sql", name: "SQL & Relational Databases", category: "Databases", track: "web", aliases: ["sql", "rdbms", "database queries"] },
  { slug: "postgresql", name: "PostgreSQL", category: "Databases", track: "web", aliases: ["postgres", "postgresql db"] },
  { slug: "mongodb", name: "MongoDB", category: "Databases", track: "web", aliases: ["mongo", "nosql", "mongoose"] },
  { slug: "prisma", name: "Prisma ORM", category: "Databases", track: "web", aliases: ["prisma", "prisma client", "orm"] },
  { slug: "authentication", name: "Authentication & Security", category: "Backend", track: "web", aliases: ["jwt", "oauth", "auth0", "next-auth", "bcrypt"] },

  // Web - Testing & Deployment
  { slug: "testing-web", name: "Web Testing (Jest / Playwright)", category: "Testing", track: "web", aliases: ["jest", "playwright", "vitest", "cypress", "unit testing"] },
  { slug: "docker-basics", name: "Docker Basics", category: "DevOps", track: "web", aliases: ["docker", "containers", "containerization"] },
  { slug: "deployment", name: "CI/CD & Cloud Deployment (Vercel)", category: "DevOps", track: "web", aliases: ["vercel", "netlify", "ci/cd", "github actions"] },

  // Android - Core & Language
  { slug: "kotlin", name: "Kotlin Basics & Syntax", category: "Android Core", track: "android", aliases: ["kotlin", "kotlin lang", "kotlin syntax"] },
  { slug: "kotlin-oop", name: "Kotlin OOP & Functional Programming", category: "Android Core", track: "android", aliases: ["kotlin oop", "sealed classes", "lambdas", "generics"] },
  { slug: "coroutines", name: "Kotlin Coroutines & Flow", category: "Android Core", track: "android", aliases: ["coroutines", "kotlin flow", "async kotlin", "stateflow", "sharedflow"] },
  { slug: "android-studio", name: "Android Studio & Gradle", category: "Android Core", track: "android", aliases: ["android studio", "gradle", "build tools", "sdk manager"] },
  { slug: "android-fundamentals", name: "Activities, Fragments & Lifecycle", category: "Android Core", track: "android", aliases: ["activity", "fragment", "lifecycle", "intents", "android sdk"] },
  { slug: "xml-layouts", name: "XML Layouts & View Binding", category: "Android UI", track: "android", aliases: ["xml layout", "viewbinding", "constraint layout", "recyclerview"] },

  // Android - Modern UI & Architecture
  { slug: "jetpack-compose", name: "Jetpack Compose", category: "Android UI", track: "android", aliases: ["compose", "declarative ui", "compose ui"] },
  { slug: "material3", name: "Material 3 Design for Android", category: "Android UI", track: "android", aliases: ["material 3", "material design", "m3", "theming"] },
  { slug: "android-navigation", name: "Compose & Jetpack Navigation", category: "Android UI", track: "android", aliases: ["navigation component", "compose navigation", "deep linking"] },
  { slug: "viewmodel", name: "ViewModel & State Management", category: "Android Architecture", track: "android", aliases: ["viewmodel", "state management", "savedstatehandle"] },
  { slug: "room-db", name: "Room Persistence Library", category: "Android Architecture", track: "android", aliases: ["room", "room database", "sqlite android", "dao"] },
  { slug: "retrofit", name: "Retrofit & REST Networking", category: "Android Networking", track: "android", aliases: ["retrofit", "okhttp", "moshi", "kotlinx.serialization", "api client"] },
  { slug: "hilt-dagger", name: "Hilt / Dependency Injection", category: "Android Architecture", track: "android", aliases: ["hilt", "dagger", "di", "dependency injection"] },
  { slug: "mvvm-clean-arch", name: "MVVM & Clean Architecture", category: "Android Architecture", track: "android", aliases: ["mvvm", "clean architecture", "repository pattern", "use cases"] },
  { slug: "workmanager", name: "WorkManager & Background Tasks", category: "Android Architecture", track: "android", aliases: ["workmanager", "background processing", "services"] },
  { slug: "firebase-android", name: "Firebase Android SDK", category: "Android Services", track: "android", aliases: ["firebase", "fcm", "firestore android"] },
  { slug: "android-testing", name: "Android Testing (JUnit / Espresso)", category: "Android Quality", track: "android", aliases: ["espresso", "junit", "mockk", "compose test"] },
  { slug: "play-store", name: "Google Play Store Publishing", category: "Android Release", track: "android", aliases: ["play store", "app bundle", "keystore", "signing", "release"] },
  { slug: "kmp", name: "Kotlin Multiplatform (KMP)", category: "Cross-Platform", track: "android", aliases: ["kmp", "kotlin multiplatform", "compose multiplatform"] },

  // Data & AI
  { slug: "python", name: "Python Programming", category: "Data & AI", track: "data-ai", aliases: ["python", "python3", "numpy", "pandas"] },
  { slug: "machine-learning", name: "Machine Learning (Scikit-Learn)", category: "Data & AI", track: "data-ai", aliases: ["scikit-learn", "ml", "regression", "classification", "clustering"] },
  { slug: "deep-learning", name: "Deep Learning (PyTorch)", category: "Data & AI", track: "data-ai", aliases: ["pytorch", "neural networks", "tensors", "deep learning"] },
  { slug: "llm-ai", name: "Large Language Models & Prompt Engineering", category: "Data & AI", track: "data-ai", aliases: ["llm", "genai", "prompt engineering", "langchain"] },

  // Cybersecurity
  { slug: "network-security", name: "Network Security & Protocols", category: "Cybersecurity", track: "cybersecurity", aliases: ["tcp/ip", "wireshark", "dns", "firewalls", "subnets"] },
  { slug: "ethical-hacking", name: "Ethical Hacking & Penetration Testing", category: "Cybersecurity", track: "cybersecurity", aliases: ["pentesting", "kali linux", "metasploit", "nmap", "burp suite"] },
  { slug: "security-ops", name: "Security Operations (SOC & SIEM)", category: "Cybersecurity", track: "cybersecurity", aliases: ["soc", "siem", "incident response", "spluck"] },

  // Cloud & DevOps
  { slug: "cloud-aws", name: "AWS Cloud Practitioner", category: "Cloud & DevOps", track: "cloud-devops", aliases: ["aws", "amazon web services", "ec2", "s3", "iam"] },
  { slug: "kubernetes", name: "Kubernetes & Orchestration", category: "Cloud & DevOps", track: "cloud-devops", aliases: ["k8s", "kubernetes", "helm", "pods"] },
  { slug: "terraform", name: "Terraform & IaC", category: "Cloud & DevOps", track: "cloud-devops", aliases: ["terraform", "iac", "infrastructure as code"] },

  // Design
  { slug: "figma", name: "Figma & UI Prototyping", category: "Design", track: "design", aliases: ["figma", "wireframing", "prototyping", "components", "autolayout"] },
  { slug: "design-systems", name: "Design Systems & Tokens", category: "Design", track: "design", aliases: ["design system", "ui tokens", "style guide"] },
  { slug: "user-research", name: "User Research & Usability Testing", category: "Design", track: "design", aliases: ["ux research", "usability testing", "interviews", "personas"] },

  // Cross-Platform
  { slug: "flutter", name: "Flutter & Dart", category: "Mobile Cross-Platform", track: "cross-platform", aliases: ["flutter", "dart", "flutter widgets"] },
  { slug: "react-native", name: "React Native & Expo", category: "Mobile Cross-Platform", track: "cross-platform", aliases: ["react native", "expo", "mobile react"] },
];

export function getSkillBySlug(slug: string): SkillItem | undefined {
  return SKILLS_MASTER.find((s) => s.slug.toLowerCase() === slug.toLowerCase());
}

export function searchSkills(query: string, track?: TrackId): SkillItem[] {
  const q = query.toLowerCase().trim();
  return SKILLS_MASTER.filter((skill) => {
    if (track && skill.track && skill.track !== track) return false;
    if (!q) return true;
    return (
      skill.slug.includes(q) ||
      skill.name.toLowerCase().includes(q) ||
      skill.category.toLowerCase().includes(q) ||
      skill.aliases.some((a) => a.toLowerCase().includes(q))
    );
  });
}
