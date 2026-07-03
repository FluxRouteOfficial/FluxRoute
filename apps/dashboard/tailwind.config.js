/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        accent: {
          50: '#f0fdf9', 100: '#ccfbee', 200: '#9af5dd', 300: '#5feac9', 400: '#2dd4b0',
          500: '#14b897', 600: '#0d957b', 700: '#0f7764', 800: '#115e51', 900: '#134e44', 950: '#042f29',
        },
        surface: {
          0: '#ffffff', 50: '#fafaf9', 100: '#f5f5f3', 200: '#e8e7e4', 300: '#d4d3cf', 400: '#a3a19b',
          500: '#78756e', 600: '#5c5a54', 700: '#454340', 800: '#2d2c29', 900: '#1a1918', 950: '#0d0c0b',
        },
        // Semantic, theme-aware tokens (backed by CSS variables)
        canvas: 'rgb(var(--canvas) / <alpha-value>)',
        panel: 'rgb(var(--panel) / <alpha-value>)',
        'panel-2': 'rgb(var(--panel-2) / <alpha-value>)',
        line: 'rgb(var(--line) / <alpha-value>)',
        'line-strong': 'rgb(var(--line-strong) / <alpha-value>)',
        ink: 'rgb(var(--ink) / <alpha-value>)',
        dim: 'rgb(var(--dim) / <alpha-value>)',
        faint: 'rgb(var(--faint) / <alpha-value>)',
        brand: {
          DEFAULT: 'rgb(var(--brand) / <alpha-value>)',
          strong: 'rgb(var(--brand-strong) / <alpha-value>)',
          contrast: 'rgb(var(--brand-contrast) / <alpha-value>)',
        },
        danger: {
          DEFAULT: 'rgb(var(--danger) / <alpha-value>)',
          soft: 'rgb(var(--danger) / 0.12)',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        sm: '0.375rem', DEFAULT: '0.5rem', md: '0.625rem', lg: '0.875rem', xl: '1.125rem', '2xl': '1.5rem',
      },
      boxShadow: {
        elevate: '0 1px 2px rgb(var(--shadow) / 0.04), 0 4px 12px rgb(var(--shadow) / 0.06)',
        'elevate-lg': '0 2px 4px rgb(var(--shadow) / 0.05), 0 12px 32px rgb(var(--shadow) / 0.10)',
      },
      transitionTimingFunction: { smooth: 'cubic-bezier(0.22, 1, 0.36, 1)' },
      animation: {
        shimmer: 'shimmer 1.8s linear infinite',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
      },
      keyframes: {
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        fadeIn: { '0%': { opacity: '0', transform: 'translateY(6px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
};
