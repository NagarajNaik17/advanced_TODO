/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        lightBg: '#F8FAFC',
        lightCard: '#FFFFFF',
        lightBorder: '#E5E7EB',
        lightText: '#111827',
        
        darkBg: '#0F172A',
        darkCard: '#1E293B',
        darkBorder: '#334155',
        darkText: '#F8FAFC',
        
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1', // Indigo (dark mode primary)
          600: '#4f46e5', // Dark Indigo (light mode primary)
          700: '#4338ca',
          800: '#3730a3',
        },
        accent: {
          indigo: '#6366f1',
          purple: '#a855f7',
          emerald: '#10b981',
          rose: '#f43f5e',
          amber: '#f59e0b',
          cyan: '#06b6d4',
          pink: '#ec4899'
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 15px rgba(99, 102, 241, 0.15)',
        glowEmerald: '0 0 15px rgba(16, 185, 129, 0.15)',
      }
    },
  },
  plugins: [],
}
