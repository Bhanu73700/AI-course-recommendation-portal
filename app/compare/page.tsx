
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  courses,
  Course
} from "@/data/courses";

export default function Compare() {
  const [selectedIds, setSelectedIds] =
    useState<string[]>([]);

  const toggleCourse = (id: string) => {
    setSelectedIds((current) => {
      if (current.includes(id)) {
        return current.filter(
          (item) => item !== id
        );
      }

      if (current.length >= 3) {
        return current;
      }

      return [...current, id];
    });
  };

  const selectedCourses: Course[] =
    courses.filter((course: Course) =>
      selectedIds.includes(course.id)
    );

  return (
    <main className="section">
      <div className="container">
        <div className="kicker">
          COURSE COMPARISON
        </div>

        <h1 className="title">
          Compare courses
        </h1>

        <p className="muted">
          Select up to three courses to compare
          their skills, duration, ratings and
          pricing.
        </p>

        <div
          className="card"
          style={{
            marginTop: 25,
            marginBottom: 25
          }}
        >
          <h3>Select courses</h3>

          <div className="chips">
            {courses.map((course: Course) => (
              <button
                key={course.id}
                type="button"
                className={
                  selectedIds.includes(course.id)
                    ? "chip active"
                    : "chip"
                }
                onClick={() =>
                  toggleCourse(course.id)
                }
                style={{
                  cursor: "pointer"
                }}
              >
                {course.title}
              </button>
            ))}
          </div>

          <p
            className="small muted"
            style={{
              marginTop: 15
            }}
          >
            {selectedCourses.length}/3 courses
            selected
          </p>
        </div>

        {selectedCourses.length === 0 ? (
          <div className="card">
            <h3>
              Choose courses to compare
            </h3>

            <p className="muted">
              Select at least one course above
              to start comparing.
            </p>
          </div>
        ) : (
          <div className="grid grid3">
            {selectedCourses.map(
              (course: Course) => (
                <div
                  className="card course"
                  key={course.id}
                >
                  <span className="badge">
                    {course.category}
                  </span>

                  <h2>{course.title}</h2>

                  <p className="muted">
                    {course.description}
                  </p>

                  <div
                    className="meta"
                    style={{
                      marginTop: 20
                    }}
                  >
                    <span>
                      ⭐ {course.rating}
                    </span>

                    <span>
                      ⏱ {course.duration}h
                    </span>

                    <span>
                      👥{" "}
                      {course.learners.toLocaleString()}
                    </span>
                  </div>

                  <hr
                    style={{
                      margin: "20px 0"
                    }}
                  />

                  <h4>Level</h4>

                  <p>
                    {course.level}
                  </p>

                  <h4>Price</h4>

                  <p>
                    {course.price === 0
                      ? "Free"
                      : `₹${course.price}`}
                  </p>

                  <h4>Skills</h4>

                  <div className="chips">
                    {course.skills.map(
                      (skill: string) => (
                        <span
                          className="chip active"
                          key={skill}
                        >
                          {skill}
                        </span>
                      )
                    )}
                  </div>

                  <h4
                    style={{
                      marginTop: 20
                    }}
                  >
                    Career paths
                  </h4>

                  <div className="chips">
                    {course.career_paths.map(
                      (career: string) => (
                        <span
                          className="chip"
                          key={career}
                        >
                          {career}
                        </span>
                      )
                    )}
                  </div>

                  <Link
                    className="btn secondary"
                    href={`/courses/${course.id}`}
                    style={{
                      marginTop: 20,
                      display:
                        "inline-block"
                    }}
                  >
                    View course →
                  </Link>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </main>
  );
}

