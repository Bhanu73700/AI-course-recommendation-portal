'use client';

import Link from "next/link";
import { courses } from "@/data/courses";

/* ── Tile background colors — cycle through pastels ────────── */
const COLORS = ["lavender", "mint", "peach", "yellow", "rose", "sky"];

/* ── Custom SVG Graphic for each course ────────────────────── */
function CourseIllustration({ id }: { id: string }) {
  switch (id) {
    case "python-programming":
      return (
        <svg width="64" height="64" viewBox="0 0 128 128" fill="none">
          <path
            d="M62.6 14c-22.3 0-20.9 9.7-20.9 9.7l.1 10.1h21.3v3h-29.8c-13.4 0-23.5 8.1-23.5 23.3 0 15.2 8.7 22.5 20.3 22.5h12.1v-10.7c0-12.7 10.9-23.3 23.6-23.3h22.9V33.8c0-12.4-10.7-19.8-26.1-19.8zm-11.4 7c2.3 0 4.2 1.9 4.2 4.2 0 2.3-1.9 4.2-4.2 4.2-2.3 0-4.2-1.9-4.2-4.2 0-2.3 1.9-4.2 4.2-4.2z"
            fill="#3776AB"
          />
          <path
            d="M65.4 114c22.3 0 20.9-9.7 20.9-9.7l-.1-10.1H64.9v-3h29.8c13.4 0 23.5-8.1 23.5-23.3 0-15.2-8.7-22.5-20.3-22.5H85.8v10.7c0 12.7-10.9 23.3-23.6 23.3H39.3v14.4c0 12.4 10.7 19.8 26.1 19.8zm11.4-7c-2.3 0-4.2-1.9-4.2-4.2 0-2.3 1.9-4.2 4.2-4.2 2.3 0 4.2 1.9 4.2 4.2 0 2.3-1.9 4.2-4.2 4.2z"
            fill="#FFD43B"
          />
        </svg>
      );
    case "react-development":
      return (
        <svg width="64" height="64" viewBox="0 0 100 100" fill="none">
          <ellipse cx="50" cy="50" rx="36" ry="14" stroke="#61DAFB" strokeWidth="4" transform="rotate(0 50 50)" />
          <ellipse cx="50" cy="50" rx="36" ry="14" stroke="#61DAFB" strokeWidth="4" transform="rotate(60 50 50)" />
          <ellipse cx="50" cy="50" rx="36" ry="14" stroke="#61DAFB" strokeWidth="4" transform="rotate(120 50 50)" />
          <circle cx="50" cy="50" r="7" fill="#61DAFB" />
        </svg>
      );
    case "full-stack-development":
      return (
        <svg width="64" height="64" viewBox="0 0 80 80" fill="none">
          <rect x="10" y="14" width="60" height="42" rx="6" fill="#635BFF" fillOpacity="0.15" stroke="#635BFF" strokeWidth="4" />
          <path d="M26 62h28M40 56v6" stroke="#635BFF" strokeWidth="4" strokeLinecap="round" />
          <path d="M22 30l-6 6 6 6M58 30l6 6-6 6M44 26l-8 20" stroke="#635BFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "nodejs-backend":
      return (
        <svg width="64" height="64" viewBox="0 0 80 80" fill="none">
          <path d="M40 10l28 16v32L40 74 12 58V26L40 10z" fill="#5FA04E" fillOpacity="0.2" stroke="#5FA04E" strokeWidth="4" strokeLinejoin="round" />
          <path d="M40 24v32M24 33l16 9 16-9" stroke="#5FA04E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "data-science":
      return (
        <svg width="64" height="64" viewBox="0 0 80 80" fill="none">
          <rect x="16" y="44" width="10" height="22" rx="3" fill="#E0A060" />
          <rect x="30" y="32" width="10" height="34" rx="3" fill="#9B8EC0" />
          <rect x="44" y="20" width="10" height="46" rx="3" fill="#6EC08A" />
          <rect x="58" y="14" width="10" height="52" rx="3" fill="#7EA8D0" />
          <path d="M16 38l14-12 14 6 18-18" stroke="#D06060" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "machine-learning":
      return (
        <svg width="64" height="64" viewBox="0 0 80 80" fill="none">
          <circle cx="40" cy="40" r="14" fill="#9B8EC0" fillOpacity="0.3" stroke="#9B8EC0" strokeWidth="4" />
          <circle cx="20" cy="20" r="8" fill="#7EA8D0" />
          <circle cx="60" cy="20" r="8" fill="#6EC08A" />
          <circle cx="20" cy="60" r="8" fill="#E0A060" />
          <circle cx="60" cy="60" r="8" fill="#D06060" />
          <line x1="26" y1="24" x2="33" y2="33" stroke="#9B8EC0" strokeWidth="3" />
          <line x1="54" y1="24" x2="47" y2="33" stroke="#9B8EC0" strokeWidth="3" />
          <line x1="26" y1="56" x2="33" y2="47" stroke="#9B8EC0" strokeWidth="3" />
          <line x1="54" y1="56" x2="47" y2="47" stroke="#9B8EC0" strokeWidth="3" />
        </svg>
      );
    case "deep-learning":
      return (
        <svg width="64" height="64" viewBox="0 0 80 80" fill="none">
          <path d="M40 14c-14.3 0-26 11.7-26 26s11.7 26 26 26 26-11.7 26-26-11.7-26-26-26z" fill="#D4A0B0" fillOpacity="0.2" stroke="#D4A0B0" strokeWidth="4" />
          <path d="M28 32c4 4 8 16 12 16s8-12 12-16" stroke="#9B8EC0" strokeWidth="4" strokeLinecap="round" />
          <circle cx="40" cy="26" r="4" fill="#9B8EC0" />
          <circle cx="28" cy="48" r="4" fill="#7EA8D0" />
          <circle cx="52" cy="48" r="4" fill="#6EC08A" />
        </svg>
      );
    case "sql-database":
      return (
        <svg width="64" height="64" viewBox="0 0 80 80" fill="none">
          <ellipse cx="40" cy="22" rx="24" ry="10" fill="#7EA8D0" fillOpacity="0.3" stroke="#7EA8D0" strokeWidth="4" />
          <path d="M16 22v18c0 5.5 10.7 10 24 10s24-4.5 24-10V22" stroke="#7EA8D0" strokeWidth="4" />
          <path d="M16 40v18c0 5.5 10.7 10 24 10s24-4.5 24-10V40" stroke="#7EA8D0" strokeWidth="4" />
        </svg>
      );
    case "aws-cloud":
      return (
        <svg width="64" height="64" viewBox="0 0 80 80" fill="none">
          <path d="M22 52c-6.6 0-12-5.4-12-12 0-5.8 4.2-10.7 9.8-11.8C21.4 20.3 28.5 14 37 14c8.8 0 16.1 6.8 16.9 15.5C59 30.5 63 35.3 63 41c0 6.1-4.9 11-11 11H22z" fill="#E0A060" fillOpacity="0.25" stroke="#E0A060" strokeWidth="4" strokeLinejoin="round" />
          <path d="M28 58c10 6 20 6 30 0" stroke="#E0A060" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case "devops":
      return (
        <svg width="64" height="64" viewBox="0 0 80 80" fill="none">
          <path d="M28 40c-7-7-7-18 0-25s18-7 25 0l-25 25z" fill="#6EC08A" fillOpacity="0.3" stroke="#6EC08A" strokeWidth="4" strokeLinejoin="round" />
          <path d="M52 40c7 7 7 18 0 25s-18 7-25 0l25-25z" fill="#7EA8D0" fillOpacity="0.3" stroke="#7EA8D0" strokeWidth="4" strokeLinejoin="round" />
        </svg>
      );
    case "dsa-cpp":
      return (
        <svg width="64" height="64" viewBox="0 0 80 80" fill="none">
          <rect x="14" y="16" width="52" height="48" rx="8" fill="#1C1C2E" />
          <text x="22" y="46" fontFamily="monospace" fontSize="22" fontWeight="bold" fill="#6EC08A">C++</text>
        </svg>
      );
    case "cybersecurity":
      return (
        <svg width="64" height="64" viewBox="0 0 80 80" fill="none">
          <path d="M40 14L18 24v18c0 14.3 9.4 27.6 22 32 12.6-4.4 22-17.7 22-32V24L40 14z" fill="#D06060" fillOpacity="0.2" stroke="#D06060" strokeWidth="4" strokeLinejoin="round" />
          <path d="M34 40v-4c0-3.3 2.7-6 6-6s6 2.7 6 6v4h2v12H32V40h2zm4 0h4v-4c0-1.1-.9-2-2-2s-2 .9-2 2v4z" fill="#D06060" />
        </svg>
      );
    default:
      return (
        <svg width="64" height="64" viewBox="0 0 80 80" fill="none">
          <rect x="16" y="18" width="48" height="44" rx="6" stroke="#9B8EC0" strokeWidth="4" fill="#9B8EC0" fillOpacity="0.2" />
          <line x1="26" y1="30" x2="54" y2="30" stroke="#9B8EC0" strokeWidth="4" strokeLinecap="round" />
          <line x1="26" y1="42" x2="44" y2="42" stroke="#9B8EC0" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );
  }
}

/* ── Main Component ───────────────────────────────── */
export default function Home() {
  return (
    <div className="course-grid">
      {courses.map((course, i) => (
        <div
          key={course.id}
          className={`course-tile ${COLORS[i % COLORS.length]}`}
        >
          {/* Top 3-dot hover trigger & sliding options bar */}
          <div className="dot-menu-wrapper">
            <span className="dot-trigger">⋯</span>
            <div className="dot-options">
              <Link
                href={`/courses/${course.id}`}
                className="dot-option"
                title="View course"
              >
                👁
              </Link>
              <button
                className="dot-option"
                title="Save course"
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  alert(`${course.title} saved to your wishlist!`);
                }}
              >
                ♡
              </button>
              <Link
                href="/compare"
                className="dot-option"
                title="Compare"
              >
                ⚖️
              </Link>
              <Link
                href="/recommend"
                className="dot-option"
                title="Recommendations"
              >
                🤖
              </Link>
            </div>
          </div>

          {/* Main clickable link to course */}
          <Link
            href={`/courses/${course.id}`}
            style={{
              textDecoration: "none",
              color: "inherit",
              display: "flex",
              flexDirection: "column",
              height: "100%",
            }}
          >
            {/* Visual vector artwork for the course */}
            <div className="tile-icon-area">
              <CourseIllustration id={course.id} />
            </div>

            {/* Course Information */}
            <div className="tile-info">
              <span className="tile-badge">{course.category}</span>
              <h3 className="tile-title">{course.title}</h3>
              <p className="tile-desc">{course.description}</p>
              <div className="tile-meta">
                <span>⭐ {course.rating}</span>
                <span>⏱ {course.duration}h</span>
                <span>
                  {course.price === 0 ? "Free" : `₹${course.price}`}
                </span>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}
