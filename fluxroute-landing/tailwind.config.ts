import type { Config } from "tailwindcss";

/**
 * FluxRoute design system.
 *
 * Two token layers:
 *  1. Fixed brand scales (`sol`, `accent`, `surface`) - used where a tone must
 *     stay constant regardless of theme (e.g. the always-dark code window).
 *  2. Semantic, theme-aware tokens (`canvas`, `panel`, `line`, `ink`, `dim`,
 *     `faint`, `brand`) - backed by CSS variables that flip in dark mode.
 *
 * All spacing follows an 8px base grid; typography follows a fixed modular scale.
 */
const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // --- Fixed brand scales -------------------------------------------
        sol: {
          50: "#faf8f5",
          100: "#f3efe8",
          200: "#e8e0d4",
          300: "#d4c8b5",
          400: "#b8a48a",
          500: "#9d8268",
          600: "#8a6f55",
          700: "#735b47",
          800: "#5f4c3e",
          900: "#4f4035",
          950: "#2a211b",
        },
        accent: {
          50: "#f0fdf9",
          100: "#ccfbee",
          200: "#9af5dd",
          300: "#5feac9",
          400: "#2dd4b0",
          500: "#14b897",
          600: "#0d957b",
          700: "#0f7764",
          800: "#115e51",
          900: "#134e44",
          950: "#042f29",
        },
        surface: {
          0: "#ffffff",
          50: "#fafaf9",
          100: "#f5f5f3",
          200: "#e8e7e4",
          300: "#d4d3cf",
          400: "#a3a19b",
          500: "#78756e",
          600: "#5c5a54",
          700: "#454340",
          800: "#2d2c29",
          900: "#1a1918",
          950: "#0d0c0b",
        },
        // --- Semantic, theme-aware tokens ---------------------------------
        canvas: "rgb(var(--canvas) / <alpha-value>)",
        panel: "rgb(var(--panel) / <alpha-value>)",
        "panel-2": "rgb(var(--panel-2) / <alpha-value>)",
        line: "rgb(var(--line) / <alpha-value>)",
        "line-strong": "rgb(var(--line-strong) / <alpha-value>)",
        ink: "rgb(var(--ink) / <alpha-value>)",
        dim: "rgb(var(--dim) / <alpha-value>)",
        faint: "rgb(var(--faint) / <alpha-value>)",
        brand: {
          DEFAULT: "rgb(var(--brand) / <alpha-value>)",
          strong: "rgb(var(--brand-strong) / <alpha-value>)",
          contrast: "rgb(var(--brand-contrast) / <alpha-value>)",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        "display-2xl": ["5.5rem", { lineHeight: "1.02", letterSpacing: "-0.035em" }],
        "display-xl": ["4.5rem", { lineHeight: "1.05", letterSpacing: "-0.03em" }],
        display: ["3.5rem", { lineHeight: "1.1", letterSpacing: "-0.025em" }],
        "heading-1": ["2.5rem", { lineHeight: "1.15", letterSpacing: "-0.02em" }],
        "heading-2": ["2rem", { lineHeight: "1.2", letterSpacing: "-0.015em" }],
        "heading-3": ["1.5rem", { lineHeight: "1.3", letterSpacing: "-0.01em" }],
        "body-lg": ["1.125rem", { lineHeight: "1.65" }],
        body: ["1rem", { lineHeight: "1.6" }],
        "body-sm": ["0.875rem", { lineHeight: "1.55" }],
        caption: ["0.75rem", { lineHeight: "1.5", letterSpacing: "0.02em" }],
      },
      spacing: {
        // 8px-grid extensions
        "18": "4.5rem",
        "22": "5.5rem",
        "30": "7.5rem",
        "34": "8.5rem",
      },
      maxWidth: {
        content: "75rem",
        prose: "42rem",
      },
      borderRadius: {
        sm: "0.375rem",
        DEFAULT: "0.5rem",
        md: "0.625rem",
        lg: "0.875rem",
        xl: "1.125rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
      boxShadow: {
        elevate:
          "0 1px 2px rgb(var(--shadow) / 0.04), 0 4px 12px rgb(var(--shadow) / 0.06), 0 16px 40px rgb(var(--shadow) / 0.08)",
        "elevate-lg":
          "0 2px 4px rgb(var(--shadow) / 0.05), 0 12px 32px rgb(var(--shadow) / 0.10), 0 32px 80px rgb(var(--shadow) / 0.14)",
        glow: "0 0 0 1px rgb(var(--brand) / 0.18), 0 8px 28px rgb(var(--brand) / 0.22)",
        "inner-line": "inset 0 0 0 1px rgb(var(--line) / 1)",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "slide-up": "slideUp 0.6s cubic-bezier(0.22,1,0.36,1) forwards",
        shimmer: "shimmer 1.8s linear infinite",
        marquee: "marquee 38s linear infinite",
        "float-slow": "float 7s ease-in-out infinite",
        "pulse-ring": "pulseRing 2.6s ease-out infinite",
        "dash-flow": "dashFlow 1.2s linear infinite",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        pulseRing: {
          "0%": { transform: "scale(0.8)", opacity: "0.5" },
          "100%": { transform: "scale(2.2)", opacity: "0" },
        },
        dashFlow: {
          to: { strokeDashoffset: "-16" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
