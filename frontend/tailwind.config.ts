import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: "#0d1117",
          raised: "#161b22",
          hover: "#1c2128",
          inset: "#21262d",
        },
        border: {
          DEFAULT: "#30363d",
          light: "#484f58",
        },
        fg: {
          DEFAULT: "#e6edf3",
          muted: "#8b949e",
          dim: "#6e7681",
        },
        brand: {
          50: "#ebf5ff",
          100: "#d6eaff",
          200: "#add5ff",
          300: "#6cb4ff",
          400: "#58a6ff",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
        success: { DEFAULT: "#3fb950", bg: "rgba(63,185,80,0.12)" },
        warning: { DEFAULT: "#d29922", bg: "rgba(210,153,34,0.12)" },
        danger: { DEFAULT: "#f85149", bg: "rgba(248,81,73,0.12)" },
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        mono: ["SF Mono", "JetBrains Mono", "Fira Code", "monospace"],
      },
      borderRadius: {
        DEFAULT: "6px",
        lg: "8px",
        xl: "10px",
      },
      animation: {
        "fade-in": "fadeIn 0.15s ease",
        "slide-up": "slideUp 0.2s ease",
        "slide-down": "slideDown 0.15s ease",
      },
      keyframes: {
        fadeIn: { from: { opacity: "0" }, to: { opacity: "1" } },
        slideUp: { from: { opacity: "0", transform: "translateY(4px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        slideDown: { from: { opacity: "0", transform: "translateY(-4px)" }, to: { opacity: "1", transform: "translateY(0)" } },
      },
    },
  },
  plugins: [],
};

export default config;
