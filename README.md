# CourseAI — AI Course Recommendation & Career Roadmap Platform

CourseAI is an open-access, client-side, local-first web application designed to help anyone who wants to learn tech find the exact right courses and a clear, milestone-driven roadmap to a career.

> **Live Local Application**: Runs completely offline with `npm install && npm run dev`
> **Zero External APIs**: No database, no accounts, and no paid LLM tokens required.

---

## 1. Product Vision & Architecture

CourseAI replaces opaque, black-box recommendation engines and ad-driven course marketplaces with a **transparent, deterministic scoring engine** and an interactive career roadmap.

### The Problem
- Course aggregators promote sponsored courses regardless of real learner fit.
- Learners face tutorial paralysis with no clear sequence from beginner basics to production job readiness.
- Black-box generative AI models hallucinate non-existent course URLs, invent ratings, and fail to explain *why* a course was chosen.

### The CourseAI Solution
1. **Curated Multi-Track Catalog**: 60+ realistic courses across Web Development, Android Development, Data & AI, Cybersecurity, Cloud & DevOps, UI/UX Design, and Mobile Cross-Platform.
2. **Transparent Scoring Formula (0-100)**: Every course is scored across 7 deterministic dimensions with plain-English explanation lines and prerequisite warnings.
3. **Interactive Skill-Gap Analysis**: Visualizes competencies mastered, partially covered, and missing against real industry roles with an auditable readiness percentage.
4. **Adaptive Career Roadmaps**: Sequential learning phases, capstone portfolio milestones, and tickable checkpoints scaled to your available hours per week.
5. **Private Resume Analyzer**: Client-side parsing of `.pdf`, `.docx`, and `.txt` files directly in the browser to extract technical skills and score ATS readiness.
6. **Rule-Based Learning Assistant**: Fast, offline intent engine to answer study questions, explain technical skills, compare frameworks, and formulate 4-week study plans.

---

## 2. Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS with custom CSS variables (Light & Dark minimalist theme)
- **Design System**: shadcn/ui accessible Radix primitives (Button, Card, Dialog, Sheet, Tabs, Select, Slider, Progress, Badge, Input)
- **Icons**: Lucide React (16-20px, 1.5 stroke)
- **State & Persistence**: Zustand with `persist` middleware using `localStorage`
- **Validation**: Zod schema validation for assessments and resume signals
- **Charts**: Recharts (minimalist monochrome layout)
- **Client Parsing**: `pdfjs-dist` (client-side PDF extraction) and `mammoth` (DOCX extraction)
- **Testing**: Vitest with 16 unit tests covering scoring, skill gaps, and resume parsing

---

## 3. How the Recommendation Engine Works

CourseAI uses a pure, deterministic scoring function:

$$\text{Recommendation Score} = \sum_{i=1}^{7} S_i \in [0, 100]$$

| Dimension | Max Weight | Logic & Formulation |
| :--- | :--- | :--- |
| **1. Skill-Gap Coverage** | **35 pts** | $\text{Score} = 35 \times \sqrt{\min\left(1, \frac{\sum W_{\text{covered}}}{\sum W_{\text{required}}}\right)}$. Rewards courses teaching missing target skills with diminishing returns. |
| **2. Level Fit** | **15 pts** | $1.0$ if level matches learner, $0.6$ if 1 step away, $0.2$ if 2 steps away. Penalized by $40\%$ if course has unmet prerequisites. |
| **3. Goal Alignment** | **15 pts** | $+11$ pts if course career tags include target role ID; $+4$ pts bonus if course sub-group matches learner's selected interest topics. |
| **4. Budget Fit** | **10 pts** | Free courses ($0) receive full 10 pts. Paid courses scale linearly if within budget. Over budget receives 0 and generates a warning. |
| **5. Time Fit** | **10 pts** | Compares $\frac{\text{Duration Hours}}{\text{Weekly Hours}}$ with learner deadline. Penalizes if course cannot be finished in time. |
| **6. Format Match** | **5 pts** | Full 5 pts if course format (Video, Interactive, Project-based, Text, Bootcamp) matches preferred formats. |
| **7. Quality & Projects** | **10 pts** | Bayesian-weighted rating $R_B = \frac{v}{v+m}R + \frac{m}{v+m}C$ ($C=4.8, m=500$), plus portfolio project count and certificate bonus. |

### Tie-Breaking & Diversity Pass
- Ties are broken by the quality score first, then by shorter duration.
- **Provider Diversity**: No single course provider or sub-group may occupy more than 3 of the top 8 positions.

---

## 4. Project Structure

```
courseai/
├── app/
│   ├── layout.tsx              # Root layout (Inter font, Navbar, Footer, MobileNav, Assistant)
│   ├── globals.css             # Design tokens (Light/Dark variables, print stylesheet)
│   ├── page.tsx                # Landing hero + Track selection grid
│   ├── onboarding/page.tsx     # 9-step assessment wizard (validated with Zod)
│   ├── dashboard/page.tsx      # Overview KPIs, readiness, streak, heatmap sparkline
│   ├── courses/
│   │   ├── page.tsx            # Filterable catalog with search, chips, grid/list view
│   │   └── [id]/page.tsx       # Course detail (outcomes, skills, prereqs, match breakdown)
│   ├── recommendations/page.tsx# Ranked match list with score rings & live adjust sheet
│   ├── skill-gap/page.tsx      # Have / Partially / Missing analysis & Recharts bar chart
│   ├── roadmap/page.tsx        # Vertical timeline of phases & printable PDF checklist
│   ├── wishlist/page.tsx       # Saved bookmarks, cost & duration summary
│   ├── progress/page.tsx       # Course tracking, % sliders, notes, JSON import/export
│   ├── resume/page.tsx         # Client-side resume drag-and-drop & ATS score report
│   ├── assistant/page.tsx      # Full-page AI Learning Assistant chat interface
│   └── about/page.tsx          # How scoring works, architecture, sample data notice
├── components/
│   ├── ui/                     # Accessible shadcn/ui primitives
│   ├── layout/                 # Navbar, Footer, MobileNav, ThemeToggle, TrackSwitcher
│   ├── track/                  # TrackCard, TrackPicker
│   ├── assessment/             # Stepper, SkillPicker, BudgetSelector
│   ├── courses/                # CourseCard, SearchBar, Filters, ScoreRing
│   ├── recommend/              # RecommendationCard, ScoreBreakdownBar, WhyThis
│   ├── skillgap/               # SkillRow, GapChart
│   ├── roadmap/                # PhaseCard, Checklist
│   ├── resume/                 # Dropzone, ResumeReport
│   ├── assistant/              # ChatPanel, FloatingAssistant
│   └── dashboard/              # StatCard, ActivityHeatmap
├── data/
│   ├── courses.ts              # 60+ realistic courses across 7 learning tracks
│   ├── roles.ts                # 11 industry job roles with weighted skills
│   ├── skills.ts               # Master skill list with aliases and categories
│   ├── roadmapTemplates.ts     # Sequential roadmap phase templates per role
│   └── assistantKB.ts          # Knowledge base and intent definitions
├── lib/
│   ├── recommend.ts            # Pure deterministic recommendation scoring engine
│   ├── skillGap.ts             # Skill gap & readiness percentage calculation
│   ├── roadmap.ts              # Roadmap phase builder & timeline scaling
│   ├── resume.ts               # Client-side resume parsing & scoring
│   ├── assistant.ts            # Rule-based intent engine (documented for LLM upgrade)
│   └── utils.ts                # Tailwind utility class helpers and formatters
├── store/
│   └── useAppStore.ts          # Zustand store with persistence & hydration guards
├── tests/
│   ├── recommend.test.ts       # 10 unit tests for filtering, budget, monotonicity
│   ├── skillGap.test.ts        # 4 unit tests for readiness % and gap categorization
│   └── resume.test.ts          # 2 unit tests for skill extraction and section detection
├── vitest.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── README.md
└── DEMO_SCRIPT.md
```

---

## 5. Getting Started

### Prerequisites
- Node.js 18+ or 20+ installed
- npm or yarn

### Installation
```bash
# Clone or navigate to the project directory
cd courseai

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts
```bash
npm run dev        # Launch development server
npm run build      # Production Next.js build
npm start          # Start production server
npm run lint       # Run ESLint check
npm run typecheck  # Run strict TypeScript compiler check (tsc --noEmit)
npm test           # Run 16 Vitest unit tests
```

---

## 6. Verification & Test Suite

All 16 unit tests run and pass cleanly:
```
 ✓ tests/recommend.test.ts (10 tests)
   - filters out courses from irrelevant tracks
   - strictly excludes paid courses when budget is 0
   - satisfies scoring monotonicity (more gap coverage yields higher score)
   - generates prerequisite warning when user lacks prerequisite
   - removes prerequisite warning when prerequisite is in knownSkills
   - awards level fit bonus when level matches exactly
   - calculates Bayesian weighted rating correctly
   - breaks ties by quality score and duration
   - includes plain-English explanation lines
   - populates fillsSkills with correct subset of gap skills
 ✓ tests/skillGap.test.ts (4 tests)
   - calculates 0% readiness when no skills are known
   - calculates correct readiness when some skills are known
   - calculates 100% readiness when all skills are known
   - associates top matching courses with missing skills
 ✓ tests/resume.test.ts (2 tests)
   - extracts skills and aliases correctly
   - detects sections and signals in resume
```

---

## 7. Limitations & Future Roadmap

1. **Rule-Based Assistant vs Live LLM**: The assistant runs deterministically offline using custom keyword and fuzzy intent matching. The codebase is organized cleanly behind the interface `getAssistantReply(message, context)` in `lib/assistant.ts`, allowing an engineer to swap in Google Gemini 1.5 Pro / Flash or Claude 3.5 Sonnet by connecting a Next.js API route.
2. **Catalog Scope**: The initial seed database contains 60+ curated courses across 7 tracks. In production, live scrapers or official APIs (Coursera Catalog API, edX Discovery API, YouTube Data API v3) could populate dynamic pricing and syllabus updates.
3. **Storage**: All user states persist in browser `localStorage`. Adding an optional authentication layer (NextAuth, Supabase, or Firebase) would enable multi-device sync.

---

## 8. Academic Demonstration Disclaimer

CourseAI was created for educational, portfolio, and project demonstration purposes. Course titles, ratings, providers, and prices represent realistic sample data. All provider links point to legitimate top-level provider search domains.
