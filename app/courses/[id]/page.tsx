
import Link from "next/link";
import { courses } from "@/data/courses";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function CourseDetails({
  params
}: Props) {
  const { id } = await params;

  const course = courses.find(
    (item) => item.id === id
  );

  if (!course) {
    return (
      <main className="section">
        <div className="container">
          <div className="card">
            <h1 className="title">
              Course not found
            </h1>

            <p className="muted">
              The course you are looking for
              does not exist.
            </p>

            <Link
              className="btn"
              href="/courses"
              style={{
                marginTop: 20,
                display: "inline-block"
              }}
            >
              ← Back to courses
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="section">
      <div className="container">
        <Link
          href="/courses"
          className="muted"
        >
          ← Back to courses
        </Link>

        <div
          className="twoCol"
          style={{
            marginTop: 20
          }}
        >
          <div className="card">
            <span className="badge">
              {course.category}
            </span>

            <h1 className="title">
              {course.title}
            </h1>

            <p className="muted">
              {course.description}
            </p>

            <div
              className="meta"
              style={{
                margin: "20px 0"
              }}
            >
              <span>
                ⭐ {course.rating}
              </span>

              <span>
                👥{" "}
                {course.learners.toLocaleString()}{" "}
                learners
              </span>

              <span>
                ⏱ {course.duration} hours
              </span>

              <span>
                🎓 {course.level}
              </span>
            </div>

            <h3>
              Skills covered
            </h3>

            <div className="chips">
              {course.skills.map(
                (skill) => (
                  <span
                    className="chip active"
                    key={skill}
                  >
                    {skill}
                  </span>
                )
              )}
            </div>

            <h3
              style={{
                marginTop: 25
              }}
            >
              Career paths
            </h3>

            <div className="chips">
              {course.career_paths.map(
                (career) => (
                  <span
                    className="chip"
                    key={career}
                  >
                    {career}
                  </span>
                )
              )}
            </div>
          </div>

          <div className="card">
            <div className="small muted">
              Course price
            </div>

            <div className="stat">
              {course.price === 0
                ? "Free"
                : `₹${course.price}`}
            </div>

            <p className="muted">
              Includes practical exercises,
              projects and career guidance.
            </p>

            <Link
              className="btn"
              href="/dashboard"
              style={{
                display: "inline-block",
                marginTop: 15
              }}
            >
              Add to learning plan
            </Link>

            <div
              className="card"
              style={{
                marginTop: 20
              }}
            >
              <strong>
                Why take this course?
              </strong>

              <p className="muted">
                Build job-ready skills and
                strengthen your portfolio with
                practical projects.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}