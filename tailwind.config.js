/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Noto Sans"', '"Noto Sans Devanagari"', 'system-ui', 'sans-serif'],
        display: ['"Noto Serif"', '"Noto Serif Devanagari"', 'Georgia', 'serif'],
      },
      colors: {
        saffron: {
          50: '#fff8ed',
          100: '#ffefd4',
          200: '#ffdba8',
          300: '#ffc070',
          400: '#ff9d37',
          500: '#fb8a14',
          600: '#e96d0a',
          700: '#c2520a',
          800: '#9a410f',
          900: '#7c3710',
        },
        leaf: {
          50: '#f1faf3',
          100: '#dff3e3',
          200: '#bfe7c8',
          300: '#90d3a0',
          400: '#5cb873',
          500: '#389d54',
          600: '#257f40',
          700: '#1d6535',
          800: '#1a512e',
          900: '#164328',
        },
        ink: {
          50: '#f6f7f9',
          100: '#eceef2',
          200: '#d5dae2',
          300: '#b0b9c8',
          400: '#8593a8',
          500: '#677592',
          600: '#525e7a',
          700: '#444d63',
          800: '#3a4153',
          900: '#1f2330',
        },
      },
      boxShadow: {
        soft: '0 2px 12px -2px rgba(31, 35, 48, 0.08), 0 1px 3px -1px rgba(31, 35, 48, 0.06)',
        lift: '0 8px 30px -6px rgba(31, 35, 48, 0.12), 0 2px 8px -2px rgba(31, 35, 48, 0.08)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.4s ease-out',
        'pulse-soft': 'pulse-soft 1.6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
