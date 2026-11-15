import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { FloatingAssistant } from "@/components/assistant/FloatingAssistant";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CourseAI — AI Course Recommendation & Career Roadmap Platform",
  description:
    "Deterministic AI course recommendations, skill-gap analysis, and interactive career roadmaps. 100% local, zero tracking.",
  openGraph: {
    title: "CourseAI — AI Course Recommendation & Career Roadmap Platform",
    description: "Transparent, deterministic skill-gap and course matching engine.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen flex flex-col font-sans pb-16 lg:pb-0">
        <Navbar />
        <main className="flex-1 max-w-content mx-auto w-full px-4 sm:px-6 py-6 sm:py-8">
          {children}
        </main>
        <Footer />
        <MobileNav />
        <FloatingAssistant />
      </body>
    </html>
  );
}
