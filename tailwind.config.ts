import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        surface: "var(--surface)",
        border: "var(--border)",
        foreground: "var(--foreground)",
        muted: "var(--muted-text)",
        accent: {
          DEFAULT: "var(--accent)",
          soft: "var(--accent-soft)",
          hover: "var(--accent-hover)",
        },
        success: "var(--success)",
        warning: "var(--warning)",
        danger: "var(--danger)",
      },
      borderRadius: {
        card: "12px",
        input: "8px",
        button: "8px",
        badge: "9999px",
      },
      maxWidth: {
        content: "1120px",
      },
      letterSpacing: {
        tightest: "-0.03em",
        label: "0.06em",
      },
    },
  },
  plugins: [],
};
export default config;
