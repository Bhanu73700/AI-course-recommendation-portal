
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  recommend,
  Profile,
  Recommendation,
} from "@/lib/recommend";

export default function Recommend() {
  const [data, setData] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRecommendations = () => {
      try {
        const saved = localStorage.getItem(
          "courseai-profile"
        );

        const defaultProfile: Profile = {
          goal: "Backend Developer",
          skills: ["JavaScript", "C++", "DSA"],
          interests: ["Web Development"],
          level: "Intermediate",
          hoursPerDay: 2,
          budget: 0,
        };

        let profile: Profile = defaultProfile;

        if (saved) {
          const parsed = JSON.parse(saved);

          profile = {
            goal:
              parsed.goal ||
              defaultProfile.goal,

            skills:
              Array.isArray(parsed.skills)
                ? parsed.skills
                : defaultProfile.skills,

            interests:
              Array.isArray(parsed.interests)
                ? parsed.interests
                : defaultProfile.interests,

            level:
              parsed.level ||
              defaultProfile.level,

            /*
             * Some older versions of the
             * assessment may have saved "hours"
             * instead of "hoursPerDay".
             *
             * We support both.
             */
            hoursPerDay:
              parsed.hoursPerDay ??
              parsed.hours ??
              defaultProfile.hoursPerDay,

            budget:
              parsed.budget !== undefined
                ? parsed.budget
                : defaultProfile.budget,
          };
        }

        /*
         * IMPORTANT:
         * recommend() accepts ONE Profile object.
         */
        const results = recommend(profile);

        setData(results);
      } catch (error) {
        console.error(
          "Failed to generate recommendations:",
          error
        );

        const fallbackProfile: Profile = {
          goal: "Backend Developer",
          skills: ["JavaScript", "C++", "DSA"],
          interests: ["Web Development"],
          level: "Intermediate",
          hoursPerDay: 2,
          budget: 0,
        };

        setData(recommend(fallbackProfile));
      } finally {
        setLoading(false);
      }
    };

    loadRecommendations();
  }, []);

  if (loading) {
    return (
      <main className="section">
        <div className="container">
          <div className="kicker">
            AI RANKING
          </div>

          <h1 className="title">
            Finding your best courses...
          </h1>

          <p className="muted">
            Analyzing your skills, interests
            and career goals.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="section">
      <div className="container">

        {/* HEADER */}
        <div className="kicker">
          AI RANKING
        </div>

        <h1 className="title">
          Your personalized recommendations
        </h1>

        <p className="muted">
          Courses ranked according to your
          career goal, skills and interests.
        </p>

        {/* PROFILE SUMMARY */}
        <div
          className="card"
          style={{
            marginTop: 24,
            marginBottom: 30,
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <span>
              <strong>Goal:</strong>{" "}
              Backend Developer
            </span>

            <span>•</span>

            <span>
              <strong>2h/day</strong>
            </span>

            <span>•</span>

            <span>
              <strong>Free</strong>
            </span>
          </div>
        </div>

        {/* RECOMMENDATIONS */}
        {data.length === 0 ? (
          <div className="card">
            <h3>
              No recommendations found
            </h3>

            <p className="muted">
              Try updating your assessment
              profile.
            </p>

            <Link
              className="btn"
              href="/assessment"
              style={{
                display: "inline-block",
                marginTop: 15,
              }}
            >
              Retake assessment
            </Link>
          </div>
        ) : (
          <div className="grid grid3">
            {data.map((course) => (
              <div
                className="card course"
                key={course.id}
              >

                {/* CATEGORY + SCORE */}
                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    alignItems: "center",
                    marginBottom: 15,
                  }}
                >
                  <span className="badge">
                    {course.category}
                  </span>

                  <strong>
                    {course.score}%
                  </strong>
                </div>

                {/* COURSE TITLE */}
                <h3>
                  {course.title}
                </h3>

                {/* DESCRIPTION */}
                <p className="muted">
                  {course.description}
                </p>

                {/* COURSE META */}
                <div className="meta">
                  <span>
                    ⭐ {course.rating}
                  </span>

                  <span>
                    ⏱ {course.duration}h
                  </span>

                  <span>
                    💰{" "}
                    {course.price === 0
                      ? "Free"
                      : `₹${course.price}`}
                  </span>

                  <span>
                    🎓 {course.level}
                  </span>
                </div>

                {/* REASON */}
                <div
                  style={{
                    marginTop: 15,
                  }}
                >
                  <div className="small muted">
                    Why recommended
                  </div>

                  <p className="muted">
                    {course.reason}
                  </p>
                </div>

                {/* SKILLS */}
                <div
                  className="chips"
                  style={{
                    marginTop: 12,
                  }}
                >
                  {course.skills
                    .slice(0, 5)
                    .map((skill) => (
                      <span
                        className="chip"
                        key={skill}
                      >
                        {skill}
                      </span>
                    ))}
                </div>

                {/* ACTION */}
                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    marginTop: 20,
                    flexWrap: "wrap",
                  }}
                >
                  <Link
                    className="btn secondary"
                    href={`/courses/${course.id}`}
                  >
                    View course →
                  </Link>

                  <button
                    className="btn secondary"
                    type="button"
                    onClick={() =>
                      alert(
                        `${course.title} saved!`
                      )
                    }
                  >
                    ♡ Save
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

        {/* BOTTOM ACTIONS */}
        <div
          style={{
            display: "flex",
            gap: 12,
            marginTop: 35,
            flexWrap: "wrap",
          }}
        >
          <Link
            className="btn secondary"
            href="/skill-gap"
          >
            See my skill gaps
          </Link>

          <Link
            className="btn secondary"
            href="/roadmap"
          >
            Build career roadmap
          </Link>

          <Link
            className="btn secondary"
            href="/assessment"
          >
            Update assessment
          </Link>
        </div>

      </div>
    </main>
  );
}

