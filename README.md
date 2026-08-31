# CourseAI — AI Course Recommendation & Career Roadmap Platform

A complete college-project MVP built with Next.js, React and TypeScript.

## Features
- Personalized course recommendation engine
- Course catalog, search and filters
- User assessment: skills, interests, career goal, level, time and budget
- Recommendation score and explanation
- Skill-gap analysis
- Career roadmap
- Wishlist and progress tracking with localStorage
- Resume upload/analyzer UI
- AI learning assistant demo
- Responsive design

## Run
```bash
npm install
npm run dev
```
Open http://localhost:3000.

## Recommendation engine
`lib/recommend.ts` implements transparent content-based ranking using skill match, career match, interests, level, time and budget. It works without an API key.

## Production upgrades
For a production deployment, add real authentication, PostgreSQL/MongoDB, server-side persistence, PDF text extraction and an LLM API for the chatbot/resume analysis. Embeddings/vector search can replace simple keyword matching.
