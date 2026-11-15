# CourseAI — 3-Minute College Presentation Demo Script

This script provides an exact 3-minute presentation walkthrough for presenting CourseAI to faculty, judges, or peers.

---

### Timing Breakdown
- **0:00 - 0:30**: Introduction & First-Run Track Selection (`/`)
- **0:30 - 1:00**: 9-Step Personalization Assessment (`/onboarding`)
- **1:00 - 1:40**: Deterministic Match Scoring & "Why This?" Breakdown (`/recommendations`)
- **1:40 - 2:10**: Skill-Gap Analysis & Role Readiness Radar (`/skill-gap`)
- **2:10 - 2:35**: Scaled Career Roadmap & Printable PDF Checklist (`/roadmap`)
- **2:35 - 3:00**: Client-Side Resume Analyzer & Local AI Assistant (`/resume` & `/assistant`)

---

## Screen 1: The Landing Page (`/`) — [0:00 - 0:30]
> **Action**: Open [http://localhost:3000](http://localhost:3000). Show the clean editorial interface (Linear/Vercel aesthetic). Toggle dark mode in the top right navbar.

**Talking Points**:
> *"Good morning. Most online learning platforms push sponsored courses or leave students paralyzed with thousands of disconnected tutorials. CourseAI solves this by providing a personalized, milestone-driven pathway into tech.*
>
> *Notice our minimalist, editorial design: no noisy gradients, zero stock illustrations, and strict 1px hairline borders.*
>
> *Right on the landing page, the first thing a student sees is: **'What do you want to learn?'** We support 7 learning tracks. Today, let's select **Android Development** as our primary focus, with Cross-Platform as a secondary interest."*

---

## Screen 2: Multi-Step Assessment (`/onboarding`) — [0:30 - 1:00]
> **Action**: Click "Continue to Assessment". Step through the flow:
> 1. Track: Android Development
> 2. Career Goal: Select **Android Developer (Junior)**
> 3. Level: Beginner
> 4. Known Skills: Search "Git" and add it. Leave Kotlin unselected to demonstrate prerequisite warnings.
> 5. Interests: Jetpack Compose
> 6. Weekly Time: Set slider to **12 hours/week** (point out live estimate: *"≈ 4 months to job ready"*).
> 7. Budget: Set to **Free Only ($0)**.
> 8. Click "Generate Recommendations".

**Talking Points**:
> *"The onboarding wizard is validated with Zod schemas. Rather than asking vague questions, it captures practical constraints: target role, known skills, budget, and weekly availability.*
>
> *Notice that every step persists in localStorage, so a student never loses their progress on refresh."*

---

## Screen 3: Transparent Recommendations (`/recommendations`) — [1:00 - 1:40]
> **Action**: Show the top-ranked courses. Point out the score ring (e.g. 92) and plain-English reasons.
> Expand the **"How CourseAI Scoring Works"** collapsible table.
> Expand the **"View scoring breakdown"** on the top card to show the stacked horizontal bar.
> Open the **"Adjust Preferences"** side sheet, increase budget, and show live recomputation.

**Talking Points**:
> *"Here are our ranked recommendations. Notice this isn't an opaque black box. Every match score from 0 to 100 is computed deterministically across 7 dimensions: skill-gap coverage, difficulty fit, career goal alignment, budget, time, format, and Bayesian-weighted ratings.*
>
> *Look at the card reasons: 'Covers 4 of your missing target skills', 'Matches your Beginner level', and because we chose $0 budget, it only surfaced verified free courses.*
>
> *Notice the warning on Jetpack Compose: 'Missing prerequisite: Kotlin. Take Kotlin Basics first.' This prevents learners from hitting roadblocks before they even start."*

---

## Screen 4: Skill-Gap Analysis (`/skill-gap`) — [1:40 - 2:10]
> **Action**: Click **Skill Gap** in the navbar. Point out the 3 categorized groups: Missing, Partially Covered, and Mastered. Show the Recharts competency distribution chart.
> Click the checkmark on "Kotlin" to mark it as learned. Watch the readiness score jump in real time!

**Talking Points**:
> *"On the Skill-Gap screen, CourseAI visualizes exactly where the student stands against industry requirements for an Android Developer.*
>
> *Skills are categorized into Have, Partially Covered, and Missing, with weight-based priorities. As a student completes a course or marks Kotlin as learned, the readiness percentage recalculates instantly from our formula: (Covered Weights / Total Required Weights) * 100.*
>
> *Each missing skill directly links to the top 2 courses that teach it."*

---

## Screen 5: Career Roadmap & Printable PDF (`/roadmap`) — [2:10 - 2:35]
> **Action**: Click **Roadmap** in the navbar. Scroll down the sequential timeline: Kotlin Foundations → Android Basics → Jetpack Compose → Architecture & Data → Play Store Launch.
> Check off a checkpoint.
> Click **"Print / Save as PDF"** to trigger the browser's native print preview dialog, showing the clean print stylesheet!

**Talking Points**:
> *"Learning tech isn't just about watching videos; it's about building projects. Our Career Roadmap scales phase durations to the user's specific weekly commitment.*
>
> *Each phase includes an assigned capstone project, such as building a Room database habit tracker. When you reach the end, the Job-Ready Checklist outlines portfolio, GitHub, and interview requirements.*
>
> *Clicking 'Print / Save as PDF' formats the entire roadmap into an executive document using our zero-dependency print stylesheet."*

---

## Screen 6: Local Resume Analyzer & AI Assistant (`/resume` & `/assistant`) — [2:35 - 3:00]
> **Action**:
> 1. Go to `/resume`. Click **"Load Sample Resume"** and click **Analyze Resume**.
> 2. Show the ATS score out of 100, detected skill pills, checklist, and the button *"Add all to my profile"*.
> 3. Click the floating **"Ask Assistant"** button in the bottom right corner.
> 4. Click the quick reply *"What should I learn next?"*. Show the assistant responding using real app data and linking to courses!

**Talking Points**:
> *"Finally, we have two standout features:*
>
> *First, our **Resume Skill Analyzer**. It extracts technical skills and checks for quantified metrics, action verbs, and section completeness. Crucially, the parsing happens 100% locally in the browser using pdfjs and mammoth — no data ever leaves the user's machine.*
>
> *Second, our **AI Learning Assistant**. Available as a full page or this floating widget. It runs a deterministic rule-based intent engine over our local catalog. When asked 'What should I learn next?', it consults the student's actual missing skills and recommends the top course.*
>
> *Thank you. CourseAI is production-ready, fully tested with 16 Vitest unit tests, and available for review."*
