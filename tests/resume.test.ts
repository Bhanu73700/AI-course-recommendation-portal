import { describe, it, expect } from "vitest";
import { extractSkillsFromText, analyzeResumeText } from "@/lib/resume";
import { Role } from "@/types";

const mockRole: Role = {
  id: "frontend-developer",
  title: "Frontend Developer",
  track: "web",
  summary: "Frontend Developer",
  requiredSkills: [
    { skill: "html", weight: 9, level: 1 },
    { skill: "react", weight: 10, level: 2 },
    { skill: "typescript", weight: 9, level: 2 },
  ],
  niceToHave: [],
};

describe("Resume Parser & Analyzer", () => {
  it("extracts skills and aliases correctly", () => {
    const text = "Experienced with ReactJS, TypeScript, Git, and HTML5 development.";
    const skills = extractSkillsFromText(text);
    expect(skills).toContain("react");
    expect(skills).toContain("typescript");
    expect(skills).toContain("git");
    expect(skills).toContain("html");
  });

  it("detects sections and signals in resume", () => {
    const resume = `
      John Doe - Developer
      Email: john@example.com | github.com/johndoe
      
      EXPERIENCE
      Software Engineer at Acme Corp (2023 - Present)
      - Architected responsive web application using React and TypeScript.
      - Optimized load times by 35% for over 50,000 active users.
      - Developed automated testing pipelines with Jest.
      
      PROJECTS
      E-Commerce Platform
      - Built full-stack application using Node.js and SQL database.
      - Implemented payment integration with Stripe.
      
      EDUCATION
      B.S. in Computer Science, University of Technology
      
      SKILLS
      React, TypeScript, JavaScript, HTML, CSS, Git, Node.js
    `;

    const analysis = analyzeResumeText(resume, mockRole, []);
    expect(analysis.signals.hasEmail).toBe(true);
    expect(analysis.signals.hasGithubOrLinks).toBe(true);
    expect(analysis.signals.hasQuantifiedMetrics).toBe(true);
    expect(analysis.extractedSections.experience).toBe(true);
    expect(analysis.extractedSections.projects).toBe(true);
    expect(analysis.extractedSections.education).toBe(true);
    expect(analysis.score).toBeGreaterThanOrEqual(70);
  });
});
