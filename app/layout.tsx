import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "CourseAI",
  description: "AI-powered learning discovery platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <nav className="nav">
          <div
            className="container"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Link href="/" className="brand">
              Course<span>AI</span>
            </Link>

            <div className="navlinks">
              <Link href="/recommend">Recommendations</Link>
              <Link href="/courses">Courses</Link>
              <Link href="/roadmap">Roadmap</Link>
              <Link href="/chat">AI Assistant</Link>
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/compare">Compare</Link>
              <Link href="/plan">Study Plan</Link>
            </div>

            <Link className="btn" href="/assessment">
              Get Started
            </Link>
          </div>
        </nav>

        {children}

        <footer className="footer">
          CourseAI • AI-powered learning discovery platform
        </footer>
      </body>
    </html>
  );
}