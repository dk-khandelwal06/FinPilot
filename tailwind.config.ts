import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        navy: {
          950: "#060913",
          900: "#0B0F19",
          850: "#0F1626",
          800: "#141E34",
          700: "#1E2D4A",
          600: "#2A3D63",
        },
        finGreen: {
          400: "#34D399",
          500: "#10B981",
          600: "#059669",
          700: "#047857",
        },
        finCyan: {
          400: "#22D3EE",
          500: "#06B6D4",
          600: "#0891B2",
        },
        finViolet: {
          400: "#A78BFA",
          500: "#8B5CF6",
          600: "#7C3AED",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-outfit)", "system-ui", "sans-serif"],
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
        "glow": "glow 3s ease-in-out infinite alternate",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        glow: {
          "0%": { opacity: "0.4", filter: "blur(20px)" },
          "100%": { opacity: "0.8", filter: "blur(30px)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
