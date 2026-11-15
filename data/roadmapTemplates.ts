import { RoadmapPhase } from "@/types";

export const ROADMAP_TEMPLATES: Record<string, RoadmapPhase[]> = {
  // ----------------------------------------------------
  // Android Roles
  // ----------------------------------------------------
  "android-developer-junior": [
    {
      id: "andr-p1",
      title: "Phase 1: Kotlin Foundations",
      goal: "Master modern idiomatic Kotlin syntax, null safety, OOP paradigms, and collections.",
      durationWeeks: 3,
      skills: ["kotlin", "kotlin-oop"],
      courseIds: ["andr-01", "andr-19"],
      project: {
        title: "Console Task & Budget Manager",
        description: "Build an interactive CLI task tracker in pure Kotlin utilizing data classes, sealed states, and collections.",
      },
      checkpoints: [
        "Write Kotlin programs using val/var and type inference",
        "Implement safe calls (?.) and Elvis operator (?:) for null handling",
        "Create custom data classes and sealed class state representations",
        "Use filter, map, and reduce collection transformations",
      ],
    },
    {
      id: "andr-p2",
      title: "Phase 2: Android Studio & Lifecycle Basics",
      goal: "Understand the Android SDK toolchain, Activity lifecycle, and building basic screens.",
      durationWeeks: 4,
      skills: ["android-studio", "android-fundamentals", "xml-layouts"],
      courseIds: ["andr-02", "andr-17"],
      project: {
        title: "Multi-Screen Flashcard App",
        description: "Create an app that tracks flashcard scores across multiple activities, surviving screen rotations.",
      },
      checkpoints: [
        "Configure build.gradle.kts with dependencies and SDK target versions",
        "Observe and log Activity lifecycle state transitions",
        "Handle configuration changes without losing UI state",
        "Pass data between screens via Explicit Intents",
      ],
    },
    {
      id: "andr-p3",
      title: "Phase 3: Modern Declarative UI with Jetpack Compose",
      goal: "Build reactive, accessible user interfaces using Jetpack Compose and Material 3.",
      durationWeeks: 4,
      skills: ["jetpack-compose", "material3", "android-navigation"],
      courseIds: ["andr-03", "andr-18", "andr-20"],
      project: {
        title: "Recipe Discovery App",
        description: "Develop a multi-screen recipe browsing app with Material 3 theming, LazyColumn lists, and Compose navigation.",
      },
      checkpoints: [
        "Build composables with Row, Column, Box, and LazyColumn",
        "Implement state hoisting with remember and mutableStateOf",
        "Apply Material 3 Dynamic Color and dark mode support",
        "Set up type-safe Compose Navigation with arguments",
      ],
    },
    {
      id: "andr-p4",
      title: "Phase 4: State Management & Offline Cache",
      goal: "Implement unidirectional data flow using ViewModel, StateFlow, and local Room persistence.",
      durationWeeks: 4,
      skills: ["viewmodel", "room-db", "coroutines"],
      courseIds: ["andr-07", "andr-09"],
      project: {
        title: "Habit Tracker with Room Database",
        description: "An offline-first habit streak tracker with SQLite storage via Room and real-time UI updates.",
      },
      checkpoints: [
        "Encapsulate state inside a ViewModel with StateFlow",
        "Define Room Entities, DAOs, and database migrations",
        "Collect database Flow emissions safely in Composables with collectAsStateWithLifecycle",
        "Handle background I/O operations with Coroutines Dispatchers.IO",
      ],
    },
    {
      id: "andr-p5",
      title: "Phase 5: Capstone & Play Store Launch",
      goal: "Package, sign, and publish a complete native Android application to the Google Play Store.",
      durationWeeks: 3,
      skills: ["play-store", "git"],
      courseIds: ["andr-14", "andr-21"],
      project: {
        title: "Published Portfolio App",
        description: "A production app published to Google Play with custom launcher icons, privacy policy, and signed AAB.",
      },
      checkpoints: [
        "Generate a secure production Keystore in Android Studio",
        "Build and inspect an Android App Bundle (.aab)",
        "Set up Play Console store listing with screenshots and descriptions",
        "Deploy to internal/closed testing track and invite testers",
      ],
    },
  ],

  "android-developer-mid": [
    {
      id: "andrmid-p1",
      title: "Phase 1: Advanced Coroutines & Flow Streams",
      goal: "Master reactive asynchronous programming with Kotlin Coroutines and cold/hot Flow streams.",
      durationWeeks: 3,
      skills: ["coroutines", "kotlin-oop"],
      courseIds: ["andr-05"],
      project: {
        title: "Real-time Stock Ticker Simulator",
        description: "A reactive ticker that combines multiple Flow streams, handles debounce/throttle, and auto-reconnects.",
      },
      checkpoints: [
        "Manage CoroutineScope lifecycles and Job hierarchies",
        "Utilize StateFlow vs SharedFlow for state vs events",
        "Implement backpressure and buffer strategies",
      ],
    },
    {
      id: "andrmid-p2",
      title: "Phase 2: Clean Architecture & Multi-Module Setup",
      goal: "Structure enterprise apps using Domain Use Cases, Repository Pattern, and Dependency Injection.",
      durationWeeks: 4,
      skills: ["mvvm-clean-arch", "hilt-dagger", "viewmodel"],
      courseIds: ["andr-07", "andr-08", "andr-16"],
      project: {
        title: "Modular Crypto Tracker App",
        description: "A 3-tier clean architecture app separated into feature, domain, data, and core library modules with Hilt.",
      },
      checkpoints: [
        "Decouple UI layer from data layer with domain Use Cases",
        "Configure Hilt dependency injection with Singleton and ViewModel scopes",
        "Create repository abstractions for remote and local data sources",
      ],
    },
    {
      id: "andrmid-p3",
      title: "Phase 3: Resilient Networking & Offline-First Cache",
      goal: "Connect to REST APIs with Retrofit, handle token refresh, and build Single Source of Truth caching.",
      durationWeeks: 4,
      skills: ["retrofit", "room-db"],
      courseIds: ["andr-10", "andr-09"],
      project: {
        title: "Offline-First News Reader",
        description: "Fetches news articles via REST, caches them in Room, and provides seamless offline reading with search.",
      },
      checkpoints: [
        "Write Retrofit service interfaces with Moshi JSON adapters",
        "Add OkHttp interceptors for authentication and logging",
        "Implement Single Source of Truth database caching with Flow",
      ],
    },
    {
      id: "andrmid-p4",
      title: "Phase 4: Automated Testing & Performance",
      goal: "Ensure production reliability with ViewModel unit tests, Turbine Flow tests, and Compose UI tests.",
      durationWeeks: 3,
      skills: ["android-testing"],
      courseIds: ["andr-13"],
      project: {
        title: "Comprehensive Test Suite",
        description: "Achieve >80% test coverage on a feature module using MockK, Turbine, and ComposeTestRule.",
      },
      checkpoints: [
        "Test ViewModel state transitions with StandardTestDispatcher and advanceUntilIdle",
        "Test Kotlin Flow emissions using the Turbine testing library",
        "Automate Compose screen interactions with ComposeTestRule",
      ],
    },
  ],

  // ----------------------------------------------------
  // Web Roles
  // ----------------------------------------------------
  "frontend-developer": [
    {
      id: "web-p1",
      title: "Phase 1: Semantic Web & Modern CSS",
      goal: "Master semantic HTML5, accessible markup, modern CSS Flexbox, Grid, and Tailwind CSS.",
      durationWeeks: 3,
      skills: ["html", "css", "accessibility", "tailwind"],
      courseIds: ["web-01", "web-10", "web-21"],
      project: {
        title: "Accessible SaaS Marketing Website",
        description: "A multi-page responsive company landing page scoring 100 on Lighthouse Accessibility with dark mode.",
      },
      checkpoints: [
        "Build layouts using CSS Grid and Flexbox with zero layout shift",
        "Enforce WCAG 2.2 AA color contrast and keyboard tab navigation",
        "Implement utility classes and responsive design with Tailwind CSS",
      ],
    },
    {
      id: "web-p2",
      title: "Phase 2: JavaScript Mastery & Git",
      goal: "Understand ES6+ syntax, asynchronous programming (promises, async/await), DOM APIs, and Git version control.",
      durationWeeks: 4,
      skills: ["javascript", "dom", "git"],
      courseIds: ["web-03", "web-04", "web-19"],
      project: {
        title: "Interactive Weather & Forecast Dashboard",
        description: "Vanilla JavaScript application fetching live meteorological APIs, caching search history in localStorage.",
      },
      checkpoints: [
        "Master closures, prototypal inheritance, and event loops",
        "Handle asynchronous API calls with fetch and async/await",
        "Use Git branching, interactive rebasing, and GitHub PR workflows",
      ],
    },
    {
      id: "web-p3",
      title: "Phase 3: React Ecosystem & TypeScript",
      goal: "Build component-driven single page applications with React, custom hooks, and strict TypeScript types.",
      durationWeeks: 5,
      skills: ["react", "typescript", "rest-apis"],
      courseIds: ["web-06", "web-09"],
      project: {
        title: "Interactive Kanban Board",
        description: "Drag-and-drop project management board with custom hooks, strict TypeScript interfaces, and persistence.",
      },
      checkpoints: [
        "Write reusable React components with useState, useEffect, and useMemo",
        "Create custom React hooks for shared logic",
        "Define discriminated union types and generics in TypeScript",
      ],
    },
    {
      id: "web-p4",
      title: "Phase 4: Next.js App Router & Production Polish",
      goal: "Build full-featured web applications with Next.js 14, Server Components, and automated E2E tests.",
      durationWeeks: 4,
      skills: ["nextjs", "testing-web", "web-performance", "deployment"],
      courseIds: ["web-08", "web-16", "web-18", "web-22"],
      project: {
        title: "Full-Stack E-Commerce Storefront",
        description: "High-performance store with Next.js Server Components, cart state, Playwright E2E tests, and Vercel CI/CD.",
      },
      checkpoints: [
        "Leverage React Server Components (RSC) for lightning-fast initial load",
        "Write integration tests with Vitest and Playwright",
        "Optimize Core Web Vitals (LCP, INP, CLS) to green thresholds",
        "Deploy automated CI/CD preview pipelines with GitHub Actions and Vercel",
      ],
    },
  ],

  "backend-developer": [
    {
      id: "be-p1",
      title: "Phase 1: Node.js & REST API Architecture",
      goal: "Build resilient RESTful backend services with Node.js, Express, and TypeScript.",
      durationWeeks: 4,
      skills: ["nodejs", "express", "typescript", "rest-apis"],
      courseIds: ["web-11", "web-09"],
      project: {
        title: "RESTful Content Management API",
        description: "Express TypeScript API with validation middleware, centralized error handling, and swagger documentation.",
      },
      checkpoints: [
        "Configure Express server with security headers (Helmet, CORS)",
        "Implement request validation using Zod schemas",
        "Structure modular controller-service-repository patterns",
      ],
    },
    {
      id: "be-p2",
      title: "Phase 2: Relational Databases & Prisma ORM",
      goal: "Design normalized database schemas, write SQL queries, and manage migrations with PostgreSQL and Prisma.",
      durationWeeks: 4,
      skills: ["sql", "postgresql", "prisma"],
      courseIds: ["web-13", "web-14"],
      project: {
        title: "Scalable E-Commerce Database Backend",
        description: "Postgres database with indexing, transactions, and Prisma schema modeling 1:N and N:M relations.",
      },
      checkpoints: [
        "Design 3NF normalized tables with foreign key constraints",
        "Write complex SQL joins and aggregation queries",
        "Execute database schema migrations and seed scripts using Prisma",
      ],
    },
    {
      id: "be-p3",
      title: "Phase 3: Authentication, Security & Docker",
      goal: "Implement JWT/cookie authentication, role-based access control, and containerize backend microservices.",
      durationWeeks: 4,
      skills: ["authentication", "docker-basics", "deployment"],
      courseIds: ["web-15", "web-17", "web-22"],
      project: {
        title: "Containerized Microservices Auth API",
        description: "Multi-container setup (Node, Postgres, Redis) with JWT refresh tokens, password hashing, and Docker Compose.",
      },
      checkpoints: [
        "Hash passwords securely with bcrypt and salt rounds",
        "Implement JWT access tokens and secure HTTP-only refresh cookies",
        "Create multi-stage Dockerfiles and orchestrate with docker-compose",
      ],
    },
  ],

  "fullstack-developer": [
    {
      id: "fs-p1",
      title: "Phase 1: Frontend Foundation",
      goal: "Build responsive UIs with HTML5, CSS3, Tailwind, JavaScript, and React.",
      durationWeeks: 5,
      skills: ["html", "css", "javascript", "react", "tailwind"],
      courseIds: ["web-01", "web-03", "web-06", "web-10"],
      project: {
        title: "Interactive Client Portal",
        description: "Responsive dashboard interface built with React and Tailwind CSS.",
      },
      checkpoints: [
        "Master semantic HTML and Tailwind utility styling",
        "Manage React component state and custom hooks",
      ],
    },
    {
      id: "fs-p2",
      title: "Phase 2: Backend & Database Layer",
      goal: "Architect APIs and relational databases with Node.js, Express, PostgreSQL, and Prisma.",
      durationWeeks: 5,
      skills: ["nodejs", "rest-apis", "sql", "postgresql", "prisma"],
      courseIds: ["web-11", "web-13", "web-14"],
      project: {
        title: "Backend API & Database Service",
        description: "Robust REST API connected to PostgreSQL via Prisma ORM.",
      },
      checkpoints: [
        "Create secure REST endpoints with validation",
        "Design relational database models and migrations",
      ],
    },
    {
      id: "fs-p3",
      title: "Phase 3: Full-Stack Next.js Application",
      goal: "Unify frontend and backend with Next.js 14 App Router, Server Actions, Auth, and Vercel.",
      durationWeeks: 5,
      skills: ["nextjs", "typescript", "authentication", "deployment"],
      courseIds: ["web-08", "web-20"],
      project: {
        title: "Production SaaS Web Application",
        description: "End-to-end full-stack web application with authentication, database mutations, and cloud deployment.",
      },
      checkpoints: [
        "Integrate Server Actions and optimistic UI updates",
        "Implement user authentication and session cookies",
        "Deploy to production on Vercel with automated CI checks",
      ],
    },
  ],
};

// Fallback template builder for other roles
export function getRoadmapForRole(roleId: string, roleTitle: string): RoadmapPhase[] {
  if (ROADMAP_TEMPLATES[roleId]) {
    return ROADMAP_TEMPLATES[roleId];
  }

  // Generative default roadmap for roles without custom template
  return [
    {
      id: `${roleId}-p1`,
      title: "Phase 1: Core Fundamentals & Tools",
      goal: `Learn foundational syntax, development environment, and basic principles for ${roleTitle}.`,
      durationWeeks: 4,
      skills: ["git"],
      courseIds: [],
      project: {
        title: "Starter Project",
        description: `Build an initial baseline project demonstrating tool mastery and fundamentals in ${roleTitle}.`,
      },
      checkpoints: [
        "Install and configure IDE and command-line tools",
        "Understand foundational concepts and domain vocabulary",
        "Implement version control with Git and GitHub",
      ],
    },
    {
      id: `${roleId}-p2`,
      title: "Phase 2: Intermediate Practical Application",
      goal: "Build real-world projects and tackle intermediate domain challenges.",
      durationWeeks: 5,
      skills: [],
      courseIds: [],
      project: {
        title: "Intermediate Domain Solution",
        description: `Create a realistic project solving key industry workflows required for ${roleTitle}.`,
      },
      checkpoints: [
        "Apply best practices and standard architectural patterns",
        "Integrate external data or APIs",
        "Refactor code for performance and maintainability",
      ],
    },
    {
      id: `${roleId}-p3`,
      title: "Phase 3: Production Capstone & Career Launch",
      goal: `Deliver an end-to-end capstone portfolio asset and prepare for interviews for ${roleTitle}.`,
      durationWeeks: 4,
      skills: [],
      courseIds: [],
      project: {
        title: "Production Capstone Project",
        description: `Publish an end-to-end project demonstrating all core skills for ${roleTitle}.`,
      },
      checkpoints: [
        "Package and document project with a clean README and live demo",
        "Write comprehensive tests and verification passes",
        "Prepare technical interview talking points and resume review",
      ],
    },
  ];
}
