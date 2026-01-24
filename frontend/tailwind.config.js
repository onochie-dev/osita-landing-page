/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // OSITA brand palette - refined black/white theme
        osita: {
          50: '#fafafa',
          100: '#f7f7f7',
          200: '#ededed',
          300: '#d6d6d6',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#3d3d3d',
          800: '#262626',
          900: '#1a1a1a',
          950: '#0d0d0d',
        },
        // Sidebar dark theme - rich black
        sidebar: {
          bg: '#0d0d0d',
          hover: '#1a1a1a',
          active: '#242424',
          border: '#2a2a2a',
          muted: '#6b6b6b',
        },
        // Extended neutral scale
        neutral: {
          750: '#333333',
          850: '#1c1c1c',
        },
        // Accent for subtle highlights
        accent: {
          DEFAULT: '#1a1a1a',
          muted: '#f5f5f5',
        },
      },
      fontFamily: {
        sans: ['Geist', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Instrument Serif', 'Georgia', 'serif'],
        mono: ['Geist Mono', 'JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'display-lg': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '400' }],
        'display': ['2.5rem', { lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: '400' }],
        'display-sm': ['1.875rem', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '400' }],
        'title': ['1.25rem', { lineHeight: '1.4', letterSpacing: '-0.01em', fontWeight: '500' }],
        'body-lg': ['1.0625rem', { lineHeight: '1.6', letterSpacing: '0' }],
        'body': ['0.9375rem', { lineHeight: '1.6', letterSpacing: '0' }],
        'body-sm': ['0.8125rem', { lineHeight: '1.5', letterSpacing: '0.01em' }],
        'caption': ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.02em' }],
        'overline': ['0.6875rem', { lineHeight: '1.3', letterSpacing: '0.08em', fontWeight: '500' }],
      },
      animation: {
        'fade-in': 'fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-up': 'fadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-down': 'fadeDown 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in': 'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-in-right': 'slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-subtle': 'pulseSubtle 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeDown: {
          '0%': { opacity: '0', transform: 'translateY(-16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgb(0 0 0 / 0.03)',
        'card': '0 1px 3px 0 rgb(0 0 0 / 0.04), 0 1px 2px -1px rgb(0 0 0 / 0.03)',
        'card-hover': '0 8px 24px -4px rgb(0 0 0 / 0.08), 0 4px 8px -4px rgb(0 0 0 / 0.04)',
        'elevated': '0 12px 40px -8px rgb(0 0 0 / 0.12), 0 4px 12px -4px rgb(0 0 0 / 0.06)',
        'inner-subtle': 'inset 0 1px 2px 0 rgb(0 0 0 / 0.04)',
        'ring': '0 0 0 1px rgb(0 0 0 / 0.05)',
        'ring-dark': '0 0 0 1px rgb(255 255 255 / 0.08)',
      },
      borderRadius: {
        'xl': '0.875rem',
        '2xl': '1rem',
        '3xl': '1.25rem',
        '4xl': '1.5rem',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'bounce-subtle': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      backgroundImage: {
        'gradient-subtle': 'linear-gradient(180deg, transparent 0%, rgb(0 0 0 / 0.02) 100%)',
        'gradient-dark': 'linear-gradient(180deg, rgb(26 26 26) 0%, rgb(13 13 13) 100%)',
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
}
