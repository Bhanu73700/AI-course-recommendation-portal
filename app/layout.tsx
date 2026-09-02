import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "CourseAI — AI-Powered Learning Discovery",
  description:
    "Personalized AI course recommendations, skill-gap analysis and career roadmaps.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="app-shell">
          {/* Left Icon Sidebar */}
          <aside className="icon-sidebar">
            <Link href="/" className="sidebar-icon active" title="Home">
              🏠
            </Link>
            <Link href="/dashboard" className="sidebar-icon" title="Dashboard">
              📊
            </Link>
            <Link href="/courses" className="sidebar-icon" title="Courses">
              📚
            </Link>
            <Link
              href="/recommend"
              className="sidebar-icon"
              title="Recommendations"
            >
              🤖
            </Link>
            <Link href="/roadmap" className="sidebar-icon" title="Roadmap">
              🗺️
            </Link>
            <Link href="/plan" className="sidebar-icon" title="Study Plan">
              📅
            </Link>
            <Link href="/compare" className="sidebar-icon" title="Compare">
              ⚖️
            </Link>
            <Link href="/skill-gap" className="sidebar-icon" title="Skill Gap">
              📈
            </Link>

            <div className="sidebar-spacer" />

            <Link href="/chat" className="sidebar-icon" title="AI Assistant">
              💬
            </Link>
            <Link
              href="/assessment"
              className="sidebar-icon"
              title="Assessment"
            >
              📝
            </Link>
            <Link href="/login" className="sidebar-icon" title="Profile">
              👤
            </Link>
          </aside>

          {/* Main Area */}
          <div className="app-main">
            {/* Top Bar */}
            <header className="topbar">
              <Link href="/" className="topbar-brand">
                Course<span>AI</span>
              </Link>

              <div className="topbar-center">
                <div className="topbar-pill">
                  <span className="pill-icon">📖</span>
                  Learning Plan
                </div>

                <div className="topbar-search">
                  <span>🔍</span>
                  <input type="text" placeholder="Search" />
                </div>
              </div>

              <div className="topbar-right">
                <div className="topbar-avatar">ST</div>
                <div>
                  <div className="topbar-user">Student</div>
                  <div className="topbar-email">student@courseai.com</div>
                </div>
              </div>
            </header>

            {/* Content */}
            <div className="content-area">{children}</div>
          </div>
        </div>

        {/* No floating toolbar — all nav is in the sidebar */}
      </body>
    </html>
  );
}