/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── Stitch CivicConnect Design System ──
        primary: {
          DEFAULT: '#00236f',
          container: '#dce1ff',
          'fixed-dim': '#b6c4ff',
        },
        'on-primary': {
          DEFAULT: '#ffffff',
          container: '#001452',
        },
        secondary: {
          DEFAULT: '#006a61',
          container: '#86f2e4',
        },
        'on-secondary': {
          DEFAULT: '#ffffff',
          container: '#00201d',
        },
        tertiary: {
          DEFAULT: '#6b3a2a',
          container: '#ffdbcb',
        },
        'on-tertiary': {
          DEFAULT: '#ffffff',
          container: '#341100',
        },
        error: {
          DEFAULT: '#ba1a1a',
          container: '#ffdad6',
        },
        'on-error': {
          DEFAULT: '#ffffff',
          container: '#93000a',
        },

        // ── Surface System ──
        surface: {
          DEFAULT: '#f7f9fb',
          dim: '#d8dadc',
          bright: '#f7f9fb',
          variant: '#e0e3e5',
        },
        'surface-container': {
          lowest: '#ffffff',
          low: '#f2f4f6',
          DEFAULT: '#eceef0',
          high: '#e6e8ea',
          highest: '#e0e3e5',
        },
        'on-surface': {
          DEFAULT: '#191c1e',
          variant: '#444651',
        },
        'inverse-surface': { DEFAULT: '#2d3133' },
        'inverse-on-surface': { DEFAULT: '#eff1f3' },
        'inverse-primary': { DEFAULT: '#b6c4ff' },

        // ── Outline ──
        outline: {
          DEFAULT: '#757682',
          variant: '#c5c5d3',
        },

        // ── Global aliases ──
        background: '#f7f9fb',
        'on-background': '#191c1e',

        // ── Legacy brand alias (maps to primary) ──
        brand: {
          300: '#90a8ff',
          400: '#b6c4ff',
          500: '#4059aa',
          600: '#00236f',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(15,23,42,0.08), 0 1px 2px rgba(15,23,42,0.04)',
        'card-hover': '0 4px 12px rgba(15,23,42,0.08), 0 1px 3px rgba(15,23,42,0.06)',
        overlay: '0 10px 25px -5px rgba(15,23,42,0.14), 0 4px 10px -2px rgba(15,23,42,0.08)',
      },
      borderRadius: {
        sm: '0.375rem',
        md: '0.5rem',
        lg: '0.625rem',
        xl: '0.75rem',
        '2xl': '1rem',
      },
      spacing: {
        gutter: '24px',
        'gutter-sm': '16px',
      },
      maxWidth: {
        content: '1280px',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'fade-in': 'fadeIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
